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
 *   node crawl.mjs --details --resume    # reuse valid per-slug checkpoints
 *   node crawl.mjs --details --resume --limit 10 # next 10 pending details
 *   node crawl.mjs --delay 2000          # 2 s between requests (default 1000)
 *
 * Output:
 *   output/catalog.json          – full catalog array
 *   output/catalog-enriched.json – with detail-page metadata (--details)
 *   output/details/              – one JSON per detail page (--details)
 */

import { JSDOM } from "jsdom";
import { createHash } from "node:crypto";
import { writeFile, readFile, mkdir, rename, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

// ─── CLI args ────────────────────────────────────────────────────────────────

const { values: flags } = parseArgs({
  options: {
    details: { type: "boolean", default: false },
    resume: { type: "boolean", default: false },
    limit: { type: "string", default: "0" },
    delay: { type: "string", default: "1000" },
    retries: { type: "string", default: "2" },
    timeout: { type: "string", default: "20000" },
    help: { type: "boolean", default: false },
  },
});

if (flags.help) {
  console.log(`
Usage: node crawl.mjs [options]

Options:
  --details        Also crawl each detail page for richer metadata
  --resume         Reuse valid per-slug detail checkpoints and retry failures
  --limit <n>      Max number of pending detail pages to crawl (0 = all)
  --delay <ms>     Delay between requests in ms (default: 1000)
  --retries <n>    Retry transient HTTP/network failures (default: 2)
  --timeout <ms>   Per-request timeout in ms (default: 20000)
  --help           Show this help message
`);
  process.exit(0);
}

const CRAWL_DETAILS = flags.details;
const RESUME = flags.resume;
const LIMIT = parseInt(flags.limit, 10) || 0;
const DELAY_MS = parseInt(flags.delay, 10) || 1000;
const RETRIES = Math.max(0, parseInt(flags.retries, 10) || 0);
const TIMEOUT_MS = Math.max(1000, parseInt(flags.timeout, 10) || 20000);
const BASE_URL = "https://getdesign.md";
const CDN_BASE = "https://cdn.getdesign.md";
const CATALOG_URL = `${BASE_URL}/design-md`;
const OUTPUT_DIR = path.resolve(import.meta.dirname, "output");
const DETAILS_DIR = path.join(OUTPUT_DIR, "details");
const CATALOG_PATH = path.join(OUTPUT_DIR, "catalog.json");
const CATALOG_MANIFEST_PATH = path.join(OUTPUT_DIR, "catalog-manifest.json");
const ENRICHED_PATH = path.join(OUTPUT_DIR, "catalog-enriched.json");
const DETAIL_STATE_PATH = path.join(OUTPUT_DIR, "detail-crawl-state.json");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function atomicWriteFile(filePath, contents) {
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    await writeFile(tempPath, contents);
    await rename(tempPath, filePath);
  } catch (error) {
    await unlink(tempPath).catch(() => {});
    throw error;
  }
}

async function atomicWriteJson(filePath, value) {
  await atomicWriteFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function fetchText(url) {
  let lastError;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; getdesign-md-crawler/1.0; +https://github.com/mahirocoko)",
          Accept: "*/*",
        },
      });
      if (!res.ok) {
        const error = new Error(`HTTP ${res.status} for ${url}`);
        error.retryable = res.status === 429 || res.status >= 500;
        throw error;
      }
      return await res.text();
    } catch (error) {
      lastError = error;
      const retryable =
        error.name === "AbortError" ||
        error.retryable === true ||
        error instanceof TypeError;
      if (!retryable || attempt === RETRIES) break;
      await sleep(500 * (attempt + 1));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
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
 * Handles the current bundle shape: unquoted keys, !0/!1 booleans,
 * double-quoted strings, and nested objects/arrays (pages:[{…}]).
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
  const bundleSha256 = createHash("sha256").update(bundleJs).digest("hex");

  // Find every occurrence of `{slug:"…"` and extract the full object
  const slugPattern = /\{slug:"/g;
  const entries = [];
  const seen = new Set();
  const extraction = {
    slugCandidates: 0,
    accepted: 0,
    duplicates: 0,
    unbalanced: 0,
    missingShape: 0,
    parseErrors: 0,
  };
  let match;

  while ((match = slugPattern.exec(bundleJs)) !== null) {
    extraction.slugCandidates++;
    const objStr = extractBracedObject(bundleJs, match.index);
    if (!objStr) {
      extraction.unbalanced++;
      continue;
    }

    // Quick slug extraction for dedup
    const slugMatch = objStr.match(/slug:"([^"]+)"/);
    if (!slugMatch) {
      extraction.parseErrors++;
      continue;
    }
    const slug = slugMatch[1];
    if (seen.has(slug)) {
      extraction.duplicates++;
      continue;
    }

    // Must have `title:` and `category:` to be a catalog entry (skip route defs)
    if (!objStr.includes("title:") || !objStr.includes("category:")) {
      extraction.missingShape++;
      continue;
    }

    try {
      const json = jsObjectToJson(objStr);
      const data = JSON.parse(json);
      if (seen.has(data.slug)) {
        extraction.duplicates++;
        continue;
      }
      seen.add(data.slug);

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
      extraction.accepted++;
    } catch (err) {
      extraction.parseErrors++;
    }
  }

  console.log(`✅ Extracted ${entries.length} catalog entries from bundle`);
  return {
    entries,
    manifest: {
      schemaVersion: 1,
      crawledAt: new Date().toISOString(),
      catalogUrl: CATALOG_URL,
      bundleUrl,
      bundleSha256,
      extraction,
    },
  };
}

const REQUIRED_CATALOG_FIELDS = [
  "slug",
  "name",
  "category",
  "categorySlug",
  "thumbnail",
  "detailUrl",
];

function validateCatalog(catalog) {
  if (!Array.isArray(catalog) || catalog.length === 0) {
    throw new Error("Catalog must be a non-empty array");
  }
  const seen = new Set();
  for (const [index, entry] of catalog.entries()) {
    for (const field of REQUIRED_CATALOG_FIELDS) {
      if (!entry?.[field]) {
        throw new Error(`Catalog entry ${index} is missing ${field}`);
      }
    }
    if (seen.has(entry.slug)) {
      throw new Error(`Duplicate catalog slug: ${entry.slug}`);
    }
    seen.add(entry.slug);
  }
  return catalog;
}

function catalogFingerprint(catalog) {
  return createHash("sha256").update(JSON.stringify(catalog)).digest("hex");
}

const CATALOG_ENTRY_FIELDS = [
  "slug",
  "name",
  "category",
  "categorySlug",
  "tags",
  "thumbnail",
  "favicon",
  "website",
  "tagline",
  "pages",
  "hasDesignMd",
  "designMdSlug",
  "highDemand",
  "orders",
  "priority",
  "addedAt",
  "detailUrl",
];

function catalogEntryFingerprint(entry) {
  const source = Object.fromEntries(
    CATALOG_ENTRY_FIELDS.map((field) => [field, entry[field] ?? null])
  );
  return createHash("sha256").update(JSON.stringify(source)).digest("hex");
}

function hasMatchingLegacyCatalogFields(detail, entry) {
  return CATALOG_ENTRY_FIELDS.every(
    (field) => JSON.stringify(detail[field] ?? null) === JSON.stringify(entry[field] ?? null)
  );
}

const DETAIL_FIELDS = [
  "description",
  "ogImage",
  "heroImage",
  "structuredData",
  "crawledAt",
  "sourceCatalogEntrySha256",
];

function isReusableDetail(detail, entry) {
  return (
    detail &&
    !detail.error &&
    detail.slug === entry.slug &&
    detail.detailUrl === entry.detailUrl &&
    DETAIL_FIELDS.filter((field) => field !== "sourceCatalogEntrySha256").every(
      (field) => Object.hasOwn(detail, field)
    ) &&
    (detail.sourceCatalogEntrySha256
      ? detail.sourceCatalogEntrySha256 === catalogEntryFingerprint(entry)
      : hasMatchingLegacyCatalogFields(detail, entry))
  );
}

async function loadReusableDetails(catalog) {
  const details = new Map();
  for (const entry of catalog) {
    const detailPath = path.join(DETAILS_DIR, `${entry.slug}.json`);
    if (!existsSync(detailPath)) continue;
    try {
      const detail = await readJson(detailPath);
      if (isReusableDetail(detail, entry)) {
        if (!detail.sourceCatalogEntrySha256) {
          detail.sourceCatalogEntrySha256 = catalogEntryFingerprint(entry);
          await atomicWriteJson(detailPath, detail);
        }
        details.set(entry.slug, detail);
      }
    } catch {
      // Invalid or interrupted checkpoint: leave pending so it is retried.
    }
  }
  return details;
}

async function loadDetailState(fingerprint) {
  if (!existsSync(DETAIL_STATE_PATH)) return null;
  try {
    const state = await readJson(DETAIL_STATE_PATH);
    return state.catalogSha256 === fingerprint ? state : null;
  } catch {
    return null;
  }
}

async function persistDetailProgress(catalog, detailMap, state) {
  const enriched = catalog
    .map((entry) => detailMap.get(entry.slug))
    .filter(Boolean);
  const success = enriched.filter((entry) => !entry.error).length;
  const failed = enriched.length - success;
  state.updatedAt = new Date().toISOString();
  state.summary = {
    catalog: catalog.length,
    success,
    failed,
    pending: catalog.length - enriched.length,
  };
  await atomicWriteJson(ENRICHED_PATH, enriched);
  await atomicWriteJson(DETAIL_STATE_PATH, state);
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
    sourceCatalogEntrySha256: catalogEntryFingerprint(entry),
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(OUTPUT_DIR)) await mkdir(OUTPUT_DIR, { recursive: true });

  // Phase 1
  let catalog;
  if (RESUME && existsSync(CATALOG_PATH)) {
    catalog = validateCatalog(await readJson(CATALOG_PATH));
    console.log(`♻️  Reusing validated output/catalog.json (${catalog.length} entries)`);
  } else {
    const fresh = await scrapeCatalog();
    catalog = validateCatalog(fresh.entries);
    fresh.manifest.catalogSha256 = catalogFingerprint(catalog);
    fresh.manifest.catalogEntries = catalog.length;
    await atomicWriteJson(CATALOG_PATH, catalog);
    await atomicWriteJson(CATALOG_MANIFEST_PATH, fresh.manifest);
    console.log(`💾 Saved → output/catalog.json`);
    console.log(`💾 Saved → output/catalog-manifest.json`);
  }

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

    const fingerprint = catalogFingerprint(catalog);
    const reusable = RESUME ? await loadReusableDetails(catalog) : new Map();
    const pending = catalog.filter((entry) => !reusable.has(entry.slug));
    const toProcess = LIMIT > 0 ? pending.slice(0, LIMIT) : pending;
    const previousState = RESUME ? await loadDetailState(fingerprint) : null;
    const detailMap = new Map(reusable);
    const state = previousState || {
      schemaVersion: 1,
      catalogSha256: fingerprint,
      startedAt: new Date().toISOString(),
      entries: {},
    };
    for (const slug of reusable.keys()) {
      state.entries[slug] ||= {
        attempts: 0,
        status: "success",
        reused: true,
        error: null,
        updatedAt: new Date().toISOString(),
      };
    }

    console.log(
      `\n🔍 Crawling ${toProcess.length} pending detail pages ` +
        `(reused ${reusable.size}, delay ${DELAY_MS} ms) …`
    );
    await persistDetailProgress(catalog, detailMap, state);

    for (let i = 0; i < toProcess.length; i++) {
      const entry = toProcess[i];
      const progress = `[${i + 1}/${toProcess.length}]`;
      const prior = state.entries[entry.slug] || {};
      state.entries[entry.slug] = {
        attempts: (prior.attempts || 0) + 1,
        status: "running",
        updatedAt: new Date().toISOString(),
      };
      await persistDetailProgress(catalog, detailMap, state);
      try {
        process.stdout.write(`  ${progress} ${entry.name} …`);
        const detail = await scrapeDetail(entry);
        detailMap.set(entry.slug, detail);
        await atomicWriteJson(
          path.join(DETAILS_DIR, `${entry.slug}.json`),
          detail
        );
        state.entries[entry.slug] = {
          ...state.entries[entry.slug],
          status: "success",
          error: null,
          updatedAt: new Date().toISOString(),
        };
        console.log(" ✓");
      } catch (err) {
        console.log(` ✗ ${err.message}`);
        const failed = {
          ...entry,
          error: err.message,
          crawledAt: new Date().toISOString(),
          sourceCatalogEntrySha256: catalogEntryFingerprint(entry),
        };
        detailMap.set(entry.slug, failed);
        await atomicWriteJson(
          path.join(DETAILS_DIR, `${entry.slug}.json`),
          failed
        );
        state.entries[entry.slug] = {
          ...state.entries[entry.slug],
          status: "error",
          error: err.message,
          updatedAt: new Date().toISOString(),
        };
      } finally {
        await persistDetailProgress(catalog, detailMap, state);
        if (i < toProcess.length - 1) await sleep(DELAY_MS);
      }
    }

    console.log(`\n💾 Saved → output/catalog-enriched.json`);
    console.log(`💾 Saved → output/details/*.json`);

    const successful = catalog.filter((entry) =>
      isReusableDetail(detailMap.get(entry.slug), entry)
    ).length;
    const failed = [...detailMap.values()].filter((entry) => entry.error).length;
    const pendingCount = catalog.length - successful - failed;
    console.log(
      `📊 Detail status: ${successful} success, ${failed} failed, ${pendingCount} pending`
    );
    if (LIMIT === 0 && successful !== catalog.length) {
      throw new Error(
        `Detail crawl incomplete: ${successful}/${catalog.length} successful`
      );
    }
  }

  console.log("\n✨ Done!");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
