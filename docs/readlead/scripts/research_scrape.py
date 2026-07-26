#!/usr/bin/env python3
"""Run a bounded, content-only ReadLead source research scrape.

This is a research probe, not a production crawler. It intentionally:
- requires an explicit manifest of five approved first-chapter URLs per site,
- is dry-run by default,
- fetches sequentially with a conservative per-request delay,
- obeys robots.txt and stops on access denial,
- never uses login, cookies, proxies, headless browsers, or bypasses challenges,
- extracts only title/body text and never saves hrefs or page chrome.

Usage:
  python3 docs/readlead/scripts/research_scrape.py \
    --targets docs/readlead/research-targets.json

  python3 docs/readlead/scripts/research_scrape.py \
    --targets docs/readlead/research-targets.json --run
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.robotparser
import urllib.request
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

USER_AGENT = "ReadLeadResearchBot/0.1 (bounded research; no authentication)"
DEFAULT_DELAY_SECONDS = 12.0
MAX_BODY_BYTES = 2_000_000
EXPECTED_NOVELS_PER_SITE = 5
DEFAULT_CHAPTERS_PER_NOVEL = 5

SITE_HOSTS = {
    "novelfull": {"novelfull.com", "www.novelfull.com"},
    "wuxiaworld": {"wuxiaworld.com", "www.wuxiaworld.com"},
}

CONTENT_MARKERS = (
    "chapter-content",
    "chapter_content",
    "chaptercontent",
    "reading-content",
    "reading_content",
    "entry-content",
    "entry_content",
    "novel-content",
    "novel_content",
    "post-content",
    "post_content",
    "article-content",
    "article_content",
)
SKIP_TAGS = {"a", "aside", "button", "footer", "form", "header", "iframe", "nav", "script", "style"}
VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
NEXT_TEXT = re.compile(r"^(next(?:\s+chapter)?|continue\s+reading|next\s*›|next\s*>)", re.IGNORECASE)
WHITESPACE = re.compile(r"[ \t\r\f\v]+")


class ResearchError(RuntimeError):
    """A recoverable source or extraction failure."""


@dataclass(frozen=True)
class SiteTarget:
    key: str
    novel: str
    first_chapter_url: str


@dataclass
class ExtractedPage:
    title: str
    body: str
    next_url: str | None


class ChapterParser(HTMLParser):
    """Small dependency-free extractor for article/chapter HTML.

    It deliberately drops anchor text as well as hrefs. A research sample should
    contain the chapter body only, not promotion/related-link labels.
    """

    def __init__(self, page_url: str) -> None:
        super().__init__(convert_charrefs=True)
        self.page_url = page_url
        self.element_depth = 0
        self.capture_scopes: list[int] = []
        self.skip_depth = 0
        self.h1_depth = 0
        self.title_parts: list[str] = []
        self.content_parts: list[str] = []
        self.current_link: dict[str, Any] | None = None
        self.next_url: str | None = None

    @staticmethod
    def _attrs(attrs: list[tuple[str, str | None]]) -> dict[str, str]:
        return {name.lower(): value or "" for name, value in attrs}

    @staticmethod
    def _is_content_container(tag: str, attrs: dict[str, str]) -> bool:
        if tag == "article":
            return True
        marker = f"{attrs.get('id', '')} {attrs.get('class', '')}".lower()
        return any(value in marker for value in CONTENT_MARKERS)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        attributes = self._attrs(attrs)
        if tag not in VOID_TAGS:
            self.element_depth += 1
        if tag in SKIP_TAGS:
            self.skip_depth += 1
            if tag == "a":
                self.current_link = {
                    "href": attributes.get("href", ""),
                    "rel": attributes.get("rel", ""),
                    "class": attributes.get("class", ""),
                    "text": [],
                }
            return

        if tag == "h1":
            self.h1_depth += 1
        if self.skip_depth == 0 and self._is_content_container(tag, attributes):
            self.capture_scopes.append(self.element_depth)
        if self.capture_scopes and tag in {"br", "p", "div", "li", "blockquote"}:
            self.content_parts.append("\n")

    def _close_element(self, tag: str) -> None:
        if tag in VOID_TAGS:
            return
        if self.capture_scopes and self.capture_scopes[-1] == self.element_depth:
            self.capture_scopes.pop()
        self.element_depth = max(0, self.element_depth - 1)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "a" and self.current_link is not None:
            link = self.current_link
            self.current_link = None
            label = " ".join(link["text"]).strip()
            rel = link["rel"].lower()
            classes = link["class"].lower()
            href = link["href"]
            if href and self.next_url is None and (
                "next" in rel
                or "next" in classes
                or NEXT_TEXT.match(label) is not None
            ):
                self.next_url = urllib.parse.urljoin(self.page_url, href)
            self.skip_depth = max(0, self.skip_depth - 1)
            self._close_element(tag)
            return
        if tag in SKIP_TAGS:
            self.skip_depth = max(0, self.skip_depth - 1)
            self._close_element(tag)
            return

        if tag == "h1":
            self.h1_depth = max(0, self.h1_depth - 1)
        if self.capture_scopes and tag in {"p", "div", "li", "blockquote"}:
            self.content_parts.append("\n")
        self._close_element(tag)

    def handle_data(self, data: str) -> None:
        text = WHITESPACE.sub(" ", data).strip()
        if not text:
            return
        if self.current_link is not None:
            self.current_link["text"].append(text)
            return
        if self.skip_depth:
            return
        if self.h1_depth:
            self.title_parts.append(text)
        if self.capture_scopes:
            self.content_parts.append(text)

    def result(self) -> ExtractedPage:
        body_lines = []
        for line in "".join(self.content_parts).splitlines():
            normalized = WHITESPACE.sub(" ", line).strip()
            if normalized:
                body_lines.append(normalized)
        body = "\n\n".join(body_lines)
        title = " ".join(self.title_parts).strip() or "Untitled chapter"
        return ExtractedPage(title=title, body=body, next_url=self.next_url)


def parse_targets(path: Path, *, strict: bool) -> list[SiteTarget]:
    try:
        payload = json.loads(path.read_text())
    except FileNotFoundError as error:
        raise ResearchError(f"targets file not found: {path}") from error
    except json.JSONDecodeError as error:
        raise ResearchError(f"targets JSON is invalid: {error}") from error

    sites = payload.get("sites") if isinstance(payload, dict) else None
    if not isinstance(sites, list):
        raise ResearchError("targets must contain a `sites` array")

    targets: list[SiteTarget] = []
    seen_keys: set[str] = set()
    for site in sites:
        if not isinstance(site, dict):
            raise ResearchError("each site must be an object")
        key = site.get("key")
        novels = site.get("novels")
        if key not in SITE_HOSTS:
            raise ResearchError(f"unsupported site key: {key!r}")
        if key in seen_keys:
            raise ResearchError(f"duplicate site key: {key}")
        seen_keys.add(key)
        if not isinstance(novels, list) or len(novels) != EXPECTED_NOVELS_PER_SITE:
            raise ResearchError(f"{key} must declare exactly {EXPECTED_NOVELS_PER_SITE} novels")
        story_ids: set[str] = set()
        novel_names: set[str] = set()
        for novel in novels:
            if not isinstance(novel, dict):
                raise ResearchError(f"{key} novel entries must be objects")
            name = novel.get("name")
            url = novel.get("firstChapterUrl")
            if not isinstance(name, str) or not name.strip() or not isinstance(url, str):
                raise ResearchError(f"{key} novel needs non-empty `name` and `firstChapterUrl`")
            normalized_name = name.strip().lower()
            if strict and normalized_name.startswith("replace-with-"):
                raise ResearchError(f"{key} replace the placeholder name with the real novel title")
            if strict and normalized_name in novel_names:
                raise ResearchError(f"{key} repeats novel name: {name.strip()}")
            novel_names.add(normalized_name)
            parsed = urllib.parse.urlparse(url)
            if parsed.scheme != "https" or parsed.hostname not in SITE_HOSTS[key]:
                raise ResearchError(f"{key} URL must be HTTPS on an approved host: {url}")
            parts = [part for part in parsed.path.split("/") if part]
            if key == "novelfull":
                story_id = parts[0] if parts else ""
            else:
                story_id = parts[1] if len(parts) > 1 and parts[0] == "novel" else ""
            if strict and not story_id:
                raise ResearchError(f"{key} URL does not expose a recognizable novel slug: {url}")
            if strict and story_id in story_ids:
                raise ResearchError(
                    f"{key} repeats the same novel ({story_id}); each of the five entries must be a different story"
                )
            story_ids.add(story_id)
            targets.append(SiteTarget(key=key, novel=name.strip(), first_chapter_url=url))

    expected_sites = set(SITE_HOSTS)
    if seen_keys != expected_sites:
        raise ResearchError(f"targets must include exactly: {', '.join(sorted(expected_sites))}")
    return targets


class SequentialFetcher:
    def __init__(self, delay_seconds: float, max_requests: int) -> None:
        self.delay_seconds = delay_seconds
        self.max_requests = max_requests
        self.last_request_at: float | None = None
        self.request_count = 0
        self.robots: dict[str, urllib.robotparser.RobotFileParser] = {}

    def _wait(self) -> None:
        if self.last_request_at is None:
            return
        remaining = self.delay_seconds - (time.monotonic() - self.last_request_at)
        if remaining > 0:
            time.sleep(remaining)

    def _request(self, url: str) -> tuple[str, str]:
        if self.request_count >= self.max_requests:
            raise ResearchError(f"request budget reached ({self.max_requests})")
        self._wait()
        request = urllib.request.Request(
            url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml,text/plain;q=0.8,*/*;q=0.1",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                final_url = response.geturl()
                content_type = response.headers.get_content_type()
                raw = response.read(MAX_BODY_BYTES + 1)
        except urllib.error.HTTPError as error:
            raise ResearchError(f"HTTP {error.code} for {url}; stopping this source without retry") from error
        except urllib.error.URLError as error:
            raise ResearchError(f"network failure for {url}: {error.reason}") from error
        finally:
            self.last_request_at = time.monotonic()
            self.request_count += 1

        if len(raw) > MAX_BODY_BYTES:
            raise ResearchError(f"response exceeds {MAX_BODY_BYTES} bytes: {url}")
        if content_type not in {"text/html", "application/xhtml+xml", "text/plain"}:
            raise ResearchError(f"unsupported content type {content_type} for {url}")
        return final_url, raw.decode("utf-8", errors="replace")

    def allowed_by_robots(self, url: str) -> bool:
        parsed = urllib.parse.urlparse(url)
        host = parsed.hostname or ""
        if host not in self.robots:
            robots_url = f"{parsed.scheme}://{host}/robots.txt"
            final_url, content = self._request(robots_url)
            if urllib.parse.urlparse(final_url).hostname != host:
                raise ResearchError("robots.txt redirected to another host; refusing to continue")
            parser = urllib.robotparser.RobotFileParser()
            parser.set_url(robots_url)
            parser.parse(content.splitlines())
            self.robots[host] = parser
        return self.robots[host].can_fetch(USER_AGENT, url)

    def fetch_page(self, site_key: str, url: str) -> tuple[str, str]:
        if not self.allowed_by_robots(url):
            raise ResearchError(f"robots.txt disallows {url}; skipping")
        final_url, html = self._request(url)
        final_host = urllib.parse.urlparse(final_url).hostname
        if final_host not in SITE_HOSTS[site_key]:
            raise ResearchError(f"redirected outside approved hosts: {final_url}")
        return final_url, html


def safe_next_url(site_key: str, current_url: str, candidate: str | None) -> str | None:
    if not candidate:
        return None
    parsed = urllib.parse.urlparse(candidate)
    if parsed.scheme != "https" or parsed.hostname not in SITE_HOSTS[site_key]:
        return None
    if candidate == current_url:
        return None
    return candidate


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")


def run(targets: list[SiteTarget], output: Path, delay_seconds: float, max_requests: int, chapters_per_novel: int) -> int:
    fetcher = SequentialFetcher(delay_seconds=delay_seconds, max_requests=max_requests)
    report: dict[str, Any] = {
        "mode": "bounded-research-scrape",
        "userAgent": USER_AGENT,
        "delaySeconds": delay_seconds,
        "chaptersPerNovel": chapters_per_novel,
        "targets": [],
    }

    for target in targets:
        current_url = target.first_chapter_url
        novel_report: dict[str, Any] = {
            "site": target.key,
            "novel": target.novel,
            "firstChapterUrl": current_url,
            "chapters": [],
            "status": "ok",
        }
        for chapter_index in range(1, chapters_per_novel + 1):
            try:
                final_url, html = fetcher.fetch_page(target.key, current_url)
                parser = ChapterParser(final_url)
                parser.feed(html)
                extracted = parser.result()
                if len(extracted.body) < 400:
                    raise ResearchError("main chapter body was not found or is too short")
                chapter_path = output / target.key / f"{target.novel.replace('/', '-')}" / f"chapter-{chapter_index:02}.json"
                write_json(
                    chapter_path,
                    {
                        "site": target.key,
                        "novel": target.novel,
                        "chapterIndex": chapter_index,
                        "sourceUrl": final_url,
                        "title": extracted.title,
                        "body": extracted.body,
                    },
                )
                novel_report["chapters"].append({"index": chapter_index, "url": final_url, "file": str(chapter_path)})
                next_url = safe_next_url(target.key, final_url, extracted.next_url)
                if chapter_index < chapters_per_novel:
                    if not next_url:
                        raise ResearchError("could not identify an approved next-chapter link")
                    current_url = next_url
            except ResearchError as error:
                novel_report["status"] = "stopped"
                novel_report["error"] = str(error)
                break
        report["targets"].append(novel_report)

    report["requestCount"] = fetcher.request_count
    write_json(output / "run-report.json", report)
    print(json.dumps({"output": str(output), "requestCount": fetcher.request_count, "report": str(output / 'run-report.json')}, ensure_ascii=False))
    return 0 if all(item["status"] == "ok" for item in report["targets"]) else 2


def main() -> int:
    parser = argparse.ArgumentParser(description="Bounded ReadLead source research scraper")
    parser.add_argument("--targets", type=Path, required=True, help="approved five-novel-per-site JSON manifest")
    parser.add_argument("--run", action="store_true", help="perform network requests; otherwise print a dry-run plan")
    parser.add_argument("--output", type=Path, default=Path(".agent-state/tmp/readlead-research"))
    parser.add_argument("--delay-seconds", type=float, default=DEFAULT_DELAY_SECONDS)
    parser.add_argument("--chapters-per-novel", type=int, default=DEFAULT_CHAPTERS_PER_NOVEL)
    parser.add_argument("--max-requests", type=int, default=60)
    args = parser.parse_args()

    if args.delay_seconds < 8:
        parser.error("--delay-seconds must be at least 8 seconds")
    if args.chapters_per_novel != DEFAULT_CHAPTERS_PER_NOVEL:
        parser.error("this research contract requires exactly 5 chapters per novel")
    if args.max_requests < 52 or args.max_requests > 70:
        parser.error("--max-requests must stay between 52 and 70 for this bounded run")

    try:
        targets = parse_targets(args.targets, strict=args.run)
    except ResearchError as error:
        parser.error(str(error))

    if not args.run:
        print("Dry run only — no network requests will be made.")
        print(f"Targets: {len(targets)} novels × {args.chapters_per_novel} chapters = {len(targets) * args.chapters_per_novel} pages")
        print(f"Delay: {args.delay_seconds:g}s between every request; request budget: {args.max_requests}")
        for target in targets:
            print(f"- {target.key}: {target.novel} → {target.first_chapter_url}")
        return 0

    return run(
        targets=targets,
        output=args.output,
        delay_seconds=args.delay_seconds,
        max_requests=args.max_requests,
        chapters_per_novel=args.chapters_per_novel,
    )


if __name__ == "__main__":
    sys.exit(main())
