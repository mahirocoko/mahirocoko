#!/usr/bin/env node

/**
 * Crawl script for https://getdesign.md/design-md
 *
 * The catalog data (~330+ entries) is embedded in the client-side JS bundle,
 * NOT in the SSR HTML (which only renders ~16 cards). This script:
 *
 *   Phase 1 – Downloads the main JS bundle, extracts all catalog entry objects
 *             by brace-matching + eval-like parsing (handles any field order).
 *   Phase 2 – (Optional) Visits each detail page for richer metadata.
 *
 * Usage:
 *   node crawl.mjs                       # catalog only  → output/catalog.json
 *   node crawl.mjs --details             # + detail pages
 *   node crawl.mjs --details --limit 10  # first 10 detail pages only
 *   node crawl.mjs --delay 2000          # 2 s between requests (default 1000)
 *
 * Output:
 *   output/catalog.json          – full catalog array
 *   output/catalog-enriched.json – with detail-page metadata (--details)
 *   output/details/              – one JSON per detail page (--details)
 */

import { JSDOM } from "jsdom";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

// ─── CLI args ────────────────────────────────────────────────────────────────

const { values: flags } = parseArgs({
  options: {
    details: { type: "boolean", default: false },
    limit: { type: "string", default: "0" },
    delay: { type: "string", default: "1000" },
    help: { type: "boolean", default: false },
  },
});

if (flags.help) {
  console.log(`
Usage: node crawl.mjs [options]

Options:
  --details        Also crawl each detail page for richer metadata
  --limit <n>      Max number of detail pages to crawl (0 = all)
  --delay <ms>     Delay between requests in ms (default: 1000)
  --help           Show this help message
`);
  process.exit(0);
}

const CRAWL_DETAILS = flags.details;
const LIMIT = parseInt(flags.limit, 10) || 0;
const DELAY_MS = parseInt(flags.delay, 10) || 1000;
const BASE_URL = "https://getdesign.md";
const CDN_BASE = "https://cdn.getdesign.md";
const CATALOG_URL = `${BASE_URL}/design-md`;
const OUTPUT_DIR = path.resolve(import.meta.dirname, "output");
const DETAILS_DIR = path.join(OUTPUT_DIR, "details");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; getdesign-md-crawler/1.0; +https://github.com/mahirocoko)",
      Accept: "*/*",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchDocument(url) {
  const html = await fetchText(url);
  return new JSDOM(html);
}

const CATEGORY_MAP = {
  "productivity-saas": "Productivity & SaaS",
  "developer-tools": "Developer Tools",
  "ai-ml": "AI & ML",
  "backend-devops": "Backend & DevOps",
  fintech: "Fintech",
  "design-creative": "Design & Creative",
  "e-commerce": "E-commerce",
  "ecommerce-retail": "E-commerce",
  "media-consumer": "Media & Consumer",
};

function prefixUrl(urlOrPath) {
  if (!urlOrPath) return null;
  return urlOrPath.startsWith("http") ? urlOrPath : `${CDN_BASE}${urlOrPath}`;
}

/**
 * Extract the brace-balanced substring starting at position `start` in `src`.
 * Returns the full object literal string including the outer braces.
 */
function extractBracedObject(src, start) {
  let depth = 0;
  for (let i = start; i < src.length && i < start + 4000; i++) {
    if (src[i] === "{") depth++;
    if (src[i] === "}") {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return null;
}

/**
 * Convert a minified JS object literal to valid JSON so we can JSON.parse it.
 *
 * Handles:  unquoted keys, !0/!1 booleans, single-quoted strings,
 *           nested objects/arrays (pages:[{…}])
 */
function jsObjectToJson(jsStr) {
  let s = jsStr;
  // Replace !0 → true, !1 → false (only when preceded by : or ,)
  s = s.replace(/(?<=[:,\[])!0/g, "true");
  s = s.replace(/(?<=[:,\[])!1/g, "false");
  // Quote unquoted keys:  {foo: → {"foo":
  s = s.replace(/([{,])(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*):/g, '$1$2"$3"$4:');
  return s;
}

// ─── Phase 1: Extract catalog from JS bundle ─────────────────────────────────

async function scrapeCatalog() {
  console.log("📥 Fetching catalog page to discover JS bundle …");
  const catalogHtml = await fetchText(CATALOG_URL);

  const bundleMatch = catalogHtml.match(
    /href="(\/assets\/main-[a-zA-Z0-9_-]+\.js)"/
  );
  if (!bundleMatch) {
    throw new Error("Could not find main JS bundle URL in catalog HTML");
  }
  const bundleUrl = `${BASE_URL}${bundleMatch[1]}`;
  console.log(`📦 Found bundle: ${bundleMatch[1]}`);
  console.log("📥 Downloading JS bundle …");

  const bundleJs = await fetchText(bundleUrl);

  // Find every occurrence of `{slug:"…"` and extract the full object
  const slugPattern = /\{slug:"/g;
  const entries = [];
  const seen = new Set();
  let match;

  while ((match = slugPattern.exec(bundleJs)) !== null) {
    const objStr = extractBracedObject(bundleJs, match.index);
    if (!objStr) continue;

    // Quick slug extraction for dedup
    const slugMatch = objStr.match(/slug:"([^"]+)"/);
    if (!slugMatch) continue;
    const slug = slugMatch[1];
    if (seen.has(slug)) continue;
    seen.add(slug);

    // Must have `title:` and `category:` to be a catalog entry (skip route defs)
    if (!objStr.includes("title:") || !objStr.includes("category:")) continue;

    try {
      const json = jsObjectToJson(objStr);
      const data = JSON.parse(json);

      const categorySlug = data.category || "unknown";

      entries.push({
        slug: data.slug,
        name: data.title,
        category: CATEGORY_MAP[categorySlug] || categorySlug,
        categorySlug,
        tags: data.tags || [],
        thumbnail: prefixUrl(data.thumb),
        favicon: prefixUrl(data.favicon),
        website: data.website || null,
        tagline: data.tagline || null,
        pages: data.pages
          ? data.pages.map((p) => ({
              label: p.label,
              src: prefixUrl(p.src),
            }))
          : null,
        hasDesignMd: !!data.designMdSlug,
        designMdSlug: data.designMdSlug || null,
        highDemand: !!data.highDemand,
        orders: data.orders || 0,
        priority: data.priority || 0,
        addedAt: data.addedAt || null,
        detailUrl: `${BASE_URL}/design-md/${data.slug}`,
      });
    } catch (err) {
      // Some {slug:...} matches may be route definitions, not catalog entries
      // — silently skip
    }
  }

  console.log(`✅ Extracted ${entries.length} catalog entries from bundle`);
  return entries;
}

// ─── Phase 2: Detail pages ───────────────────────────────────────────────────

async function scrapeDetail(entry) {
  const { document } = (await fetchDocument(entry.detailUrl)).window;

  const metaDesc = document.querySelector('meta[name="description"]');
  const description = metaDesc ? metaDesc.getAttribute("content") : null;

  const ogImg = document.querySelector('meta[property="og:image"]');
  const ogImage = ogImg ? ogImg.getAttribute("content") : null;

  const heroImg = document.querySelector(
    'img[src*="cdn.getdesign.md/catalog/"]'
  );
  const heroImage = heroImg ? heroImg.getAttribute("src") : null;

  let structuredData = null;
  const ldScripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  for (const s of ldScripts) {
    try {
      const data = JSON.parse(s.textContent);
      if (data["@type"] === "CreativeWork") {
        structuredData = data;
        break;
      }
    } catch {
      // ignore
    }
  }

  return {
    ...entry,
    description,
    ogImage,
    heroImage,
    structuredData,
    crawledAt: new Date().toISOString(),
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(OUTPUT_DIR)) await mkdir(OUTPUT_DIR, { recursive: true });

  // Phase 1
  const catalog = await scrapeCatalog();

  await writeFile(
    path.join(OUTPUT_DIR, "catalog.json"),
    JSON.stringify(catalog, null, 2)
  );
  console.log(`💾 Saved → output/catalog.json`);

  // Stats
  const withDesignMd = catalog.filter((e) => e.hasDesignMd).length;
  const highDemand = catalog.filter((e) => e.highDemand).length;
  const categories = [...new Set(catalog.map((e) => e.category))];
  console.log(`\n📊 Stats:`);
  console.log(`   Total entries:      ${catalog.length}`);
  console.log(`   With DESIGN.md:     ${withDesignMd}`);
  console.log(`   High demand:        ${highDemand}`);
  console.log(`   Categories:         ${categories.join(", ")}`);

  // Phase 2 (optional)
  if (CRAWL_DETAILS) {
    if (!existsSync(DETAILS_DIR))
      await mkdir(DETAILS_DIR, { recursive: true });

    const toProcess = LIMIT > 0 ? catalog.slice(0, LIMIT) : catalog;
    console.log(
      `\n🔍 Crawling ${toProcess.length} detail pages (delay ${DELAY_MS} ms) …`
    );

    const enriched = [];

    for (let i = 0; i < toProcess.length; i++) {
      const entry = toProcess[i];
      const progress = `[${i + 1}/${toProcess.length}]`;
      try {
        process.stdout.write(`  ${progress} ${entry.name} …`);
        const detail = await scrapeDetail(entry);
        enriched.push(detail);

        await writeFile(
          path.join(DETAILS_DIR, `${entry.slug}.json`),
          JSON.stringify(detail, null, 2)
        );
        console.log(" ✓");

        if (i < toProcess.length - 1) await sleep(DELAY_MS);
      } catch (err) {
        console.log(` ✗ ${err.message}`);
        enriched.push({ ...entry, error: err.message });
      }
    }

    await writeFile(
      path.join(OUTPUT_DIR, "catalog-enriched.json"),
      JSON.stringify(enriched, null, 2)
    );
    console.log(`\n💾 Saved → output/catalog-enriched.json`);
    console.log(`💾 Saved → output/details/*.json`);
  }

  console.log("\n✨ Done!");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
