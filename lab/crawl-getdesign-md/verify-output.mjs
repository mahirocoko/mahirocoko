#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  open,
  readFile,
  readdir,
  rename,
  writeFile,
  unlink,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";

const OUTPUT_DIR = path.resolve(import.meta.dirname, "output");
const DETAILS_DIR = path.join(OUTPUT_DIR, "details");
const PAGES_DIR = path.join(OUTPUT_DIR, "pages");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");
const REPORT_PATH = path.join(OUTPUT_DIR, "completeness-report.json");

const REQUIRED_CATALOG_FIELDS = [
  "slug",
  "name",
  "category",
  "categorySlug",
  "thumbnail",
  "detailUrl",
];
const REQUIRED_DETAIL_FIELDS = [
  ...REQUIRED_CATALOG_FIELDS,
  "description",
  "ogImage",
  "heroImage",
  "structuredData",
  "crawledAt",
  "sourceCatalogEntrySha256",
];
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

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function atomicWriteJson(filePath, value) {
  const temp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`);
    await rename(temp, filePath);
  } catch (error) {
    await unlink(temp).catch(() => {});
    throw error;
  }
}

async function listFiles(directory, suffix = "") {
  if (!existsSync(directory)) return [];
  return (await readdir(directory))
    .filter((name) => !suffix || name.endsWith(suffix))
    .sort();
}

async function isValidImage(filePath) {
  let handle;
  try {
    handle = await open(filePath, "r");
    const header = Buffer.alloc(12);
    const { bytesRead } = await handle.read(header, 0, header.length, 0);
    if (bytesRead < 12) return false;
    const jpeg = header.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
    const webp =
      header.subarray(0, 4).toString("ascii") === "RIFF" &&
      header.subarray(8, 12).toString("ascii") === "WEBP";
    return jpeg || webp;
  } catch {
    return false;
  } finally {
    await handle?.close().catch(() => {});
  }
}

function sortedDifference(left, right) {
  const rightSet = new Set(right);
  return [...left].filter((value) => !rightSet.has(value)).sort();
}

function catalogEntryFingerprint(entry) {
  const source = Object.fromEntries(
    CATALOG_ENTRY_FIELDS.map((field) => [field, entry[field] ?? null])
  );
  return createHash("sha256").update(JSON.stringify(source)).digest("hex");
}

function screenshotsFor(entry, detail) {
  if (Array.isArray(entry.pages) && entry.pages.length > 0) return entry.pages;
  if (detail?.heroImage) return [{ label: "Home", src: detail.heroImage }];
  return [];
}

function expectedImageFiles(catalog, details) {
  const names = [];
  for (const entry of catalog) {
    const thumbExt = path.extname(new URL(entry.thumbnail).pathname) || ".webp";
    names.push(`${entry.slug}${thumbExt}`);
    for (const page of screenshotsFor(entry, details.get(entry.slug))) {
      if (!page.src) continue;
      const ext = path.extname(new URL(page.src).pathname) || ".webp";
      const label = page.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      names.push(`${entry.slug}--${label}${ext}`);
    }
  }
  return names.sort();
}

async function main() {
  const requiredPaths = [
    "catalog.json",
    "catalog-manifest.json",
    "catalog-enriched.json",
    "detail-crawl-state.json",
    "index.html",
  ];
  const missingRequiredPaths = requiredPaths.filter(
    (name) => !existsSync(path.join(OUTPUT_DIR, name))
  );
  if (missingRequiredPaths.length) {
    throw new Error(`Missing required outputs: ${missingRequiredPaths.join(", ")}`);
  }

  const catalog = await readJson(path.join(OUTPUT_DIR, "catalog.json"));
  const manifest = await readJson(path.join(OUTPUT_DIR, "catalog-manifest.json"));
  const enriched = await readJson(path.join(OUTPUT_DIR, "catalog-enriched.json"));
  const state = await readJson(path.join(OUTPUT_DIR, "detail-crawl-state.json"));
  const indexHtml = await readFile(path.join(OUTPUT_DIR, "index.html"), "utf8");

  const errors = [];
  const catalogSlugs = catalog.map((entry) => entry.slug);
  const uniqueSlugs = new Set(catalogSlugs);
  const catalogBySlug = new Map(catalog.map((entry) => [entry.slug, entry]));
  if (!Array.isArray(catalog) || catalog.length === 0) {
    errors.push("catalog.json is not a non-empty array");
  }
  if (uniqueSlugs.size !== catalog.length) {
    errors.push(`catalog has ${catalog.length - uniqueSlugs.size} duplicate slugs`);
  }
  for (const [index, entry] of catalog.entries()) {
    const missing = REQUIRED_CATALOG_FIELDS.filter((field) => !entry?.[field]);
    if (missing.length) errors.push(`catalog[${index}] missing ${missing.join(", ")}`);
  }

  const fingerprint = createHash("sha256")
    .update(JSON.stringify(catalog))
    .digest("hex");
  if (manifest.catalogSha256 !== fingerprint) {
    errors.push("catalog manifest fingerprint does not match catalog.json");
  }
  if (manifest.catalogEntries !== catalog.length) {
    errors.push("catalog manifest entry count does not match catalog.json");
  }
  if (manifest.extraction?.accepted !== catalog.length) {
    errors.push("catalog manifest accepted count does not match catalog.json");
  }

  const detailFiles = await listFiles(DETAILS_DIR, ".json");
  const detailSlugs = detailFiles.map((name) => name.slice(0, -5));
  const missingDetailFiles = sortedDifference(catalogSlugs, detailSlugs);
  const staleDetailFiles = sortedDifference(detailSlugs, catalogSlugs);
  if (missingDetailFiles.length) {
    errors.push(`missing ${missingDetailFiles.length} detail JSON files`);
  }
  if (staleDetailFiles.length) {
    errors.push(`found ${staleDetailFiles.length} stale detail JSON files`);
  }

  const details = new Map();
  for (const fileName of detailFiles) {
    const filePath = path.join(DETAILS_DIR, fileName);
    try {
      const detail = await readJson(filePath);
      const slug = fileName.slice(0, -5);
      details.set(slug, detail);
      if (detail.slug !== slug) errors.push(`${fileName} has mismatched slug`);
      if (detail.error) errors.push(`${fileName} contains error: ${detail.error}`);
      const missing = REQUIRED_DETAIL_FIELDS.filter(
        (field) => !Object.hasOwn(detail, field)
      );
      if (missing.length) errors.push(`${fileName} missing ${missing.join(", ")}`);
      const catalogEntry = catalogBySlug.get(slug);
      if (
        catalogEntry &&
        detail.sourceCatalogEntrySha256 !== catalogEntryFingerprint(catalogEntry)
      ) {
        errors.push(`${fileName} belongs to a stale catalog entry snapshot`);
      }
    } catch (error) {
      errors.push(`${fileName} is invalid JSON: ${error.message}`);
    }
  }

  const enrichedSlugs = enriched.map((entry) => entry.slug);
  if (enriched.length !== catalog.length) {
    errors.push(`catalog-enriched.json has ${enriched.length}/${catalog.length} entries`);
  }
  if (JSON.stringify(enrichedSlugs) !== JSON.stringify(catalogSlugs)) {
    errors.push("catalog-enriched.json does not preserve catalog order and slug set");
  }
  if (enriched.some((entry) => entry.error)) {
    errors.push("catalog-enriched.json contains failed entries");
  }
  const staleEnrichedEntries = enriched.filter((entry) => {
    const catalogEntry = catalogBySlug.get(entry.slug);
    return (
      !catalogEntry ||
      entry.sourceCatalogEntrySha256 !== catalogEntryFingerprint(catalogEntry)
    );
  });
  if (staleEnrichedEntries.length) {
    errors.push(
      `catalog-enriched.json has ${staleEnrichedEntries.length} stale catalog entry snapshots`
    );
  }

  if (state.catalogSha256 !== fingerprint) {
    errors.push("detail crawl state fingerprint does not match catalog.json");
  }
  if (state.summary?.success !== catalog.length || state.summary?.failed !== 0 || state.summary?.pending !== 0) {
    errors.push("detail crawl state summary is not 100% successful");
  }
  const missingStateEntries = catalogSlugs.filter(
    (slug) => state.entries?.[slug]?.status !== "success"
  );
  if (missingStateEntries.length) {
    errors.push(`${missingStateEntries.length} detail state entries are not successful`);
  }

  const pageFiles = await listFiles(PAGES_DIR, ".html");
  const expectedPageFiles = catalogSlugs.map((slug) => `${slug}.html`).sort();
  const missingPages = sortedDifference(expectedPageFiles, pageFiles);
  const stalePages = sortedDifference(pageFiles, expectedPageFiles);
  if (missingPages.length) errors.push(`missing ${missingPages.length} detail pages`);
  if (stalePages.length) errors.push(`found ${stalePages.length} stale detail pages`);

  let brokenBackLinks = 0;
  const renderedScreenshotMismatches = [];
  const tabContractMismatches = [];
  for (const fileName of expectedPageFiles) {
    const filePath = path.join(PAGES_DIR, fileName);
    if (!existsSync(filePath)) continue;
    const html = await readFile(filePath, "utf8");
    const document = new JSDOM(html).window.document;
    const slug = fileName.slice(0, -5);
    const catalogLinks = [...document.querySelectorAll('a[href]')].filter((link) =>
      link.textContent.toLowerCase().includes("catalog") ||
      link.classList.contains("logo")
    );
    if (
      catalogLinks.length !== 3 ||
      catalogLinks.some((link) => link.getAttribute("href") !== "../index.html")
    ) {
      brokenBackLinks++;
    }
    const entry = catalog.find((candidate) => candidate.slug === slug);
    const expectedScreenshotCount = screenshotsFor(entry, details.get(slug)).length;
    const actualScreenshotCount = document.querySelectorAll(".screenshot").length;
    if (actualScreenshotCount !== expectedScreenshotCount) {
      renderedScreenshotMismatches.push({
        slug,
        expected: expectedScreenshotCount,
        actual: actualScreenshotCount,
      });
    }
    const tablists = document.querySelectorAll('[role="tablist"]').length;
    const tabs = document.querySelectorAll('[role="tab"]').length;
    const panels = document.querySelectorAll('[role="tabpanel"]').length;
    const selectedTabs = document.querySelectorAll(
      '[role="tab"][aria-selected="true"]'
    ).length;
    const hiddenPanels = [...document.querySelectorAll('[role="tabpanel"]')].filter(
      (panel) => panel.hidden
    ).length;
    const validTabs =
      expectedScreenshotCount > 1
        ? tablists === 1 &&
          tabs === expectedScreenshotCount &&
          panels === expectedScreenshotCount &&
          selectedTabs === 1 &&
          hiddenPanels === expectedScreenshotCount - 1
        : tablists === 0 && tabs === 0 && panels === 0 && selectedTabs === 0;
    if (!validTabs) {
      tabContractMismatches.push({
        slug,
        expectedScreenshots: expectedScreenshotCount,
        tablists,
        tabs,
        panels,
        selectedTabs,
        hiddenPanels,
      });
    }
  }
  if (brokenBackLinks) errors.push(`${brokenBackLinks} detail pages have broken catalog links`);
  if (renderedScreenshotMismatches.length) {
    errors.push(
      `${renderedScreenshotMismatches.length} detail pages have incomplete screenshot rendering`
    );
  }
  if (tabContractMismatches.length) {
    errors.push(`${tabContractMismatches.length} detail pages violate the tab contract`);
  }

  const missingIndexLinks = catalogSlugs.filter(
    (slug) => !indexHtml.includes(`href="pages/${slug}.html"`)
  );
  if (missingIndexLinks.length) {
    errors.push(`${missingIndexLinks.length} catalog cards do not link to local detail pages`);
  }

  const expectedImages = expectedImageFiles(catalog, details);
  const imageFiles = await listFiles(IMAGES_DIR);
  const missingImages = sortedDifference(expectedImages, imageFiles);
  const staleImages = sortedDifference(imageFiles, expectedImages);
  if (missingImages.length) errors.push(`missing ${missingImages.length} local images`);
  if (staleImages.length) errors.push(`found ${staleImages.length} stale local images`);

  const invalidImages = [];
  for (const fileName of expectedImages) {
    const filePath = path.join(IMAGES_DIR, fileName);
    if (existsSync(filePath) && !(await isValidImage(filePath))) invalidImages.push(fileName);
  }
  if (invalidImages.length) errors.push(`${invalidImages.length} local images failed signature checks`);

  const tempFiles = (await readdir(OUTPUT_DIR, { recursive: true }))
    .filter((name) => name.endsWith(".tmp"));
  if (tempFiles.length) errors.push(`${tempFiles.length} temporary files remain in output`);

  const report = {
    schemaVersion: 1,
    verifiedAt: new Date().toISOString(),
    verdict: errors.length ? "incomplete" : "complete",
    source: {
      bundleUrl: manifest.bundleUrl,
      bundleSha256: manifest.bundleSha256,
      catalogSha256: fingerprint,
      extraction: manifest.extraction,
    },
    counts: {
      catalog: catalog.length,
      uniqueSlugs: uniqueSlugs.size,
      enriched: enriched.length,
      detailFiles: detailFiles.length,
      detailPages: pageFiles.length,
      thumbnails: catalog.length,
      screenshots: expectedImages.length - catalog.length,
      images: imageFiles.length,
    },
    gaps: {
      missingDetailFiles,
      staleDetailFiles,
      missingPages,
      stalePages,
      missingImages,
      staleImages,
      invalidImages,
      missingIndexLinks,
      brokenBackLinks,
      renderedScreenshotMismatches,
      tabContractMismatches,
      tempFiles,
    },
    errors,
  };

  await atomicWriteJson(REPORT_PATH, report);
  console.log(JSON.stringify(report, null, 2));
  if (errors.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});
