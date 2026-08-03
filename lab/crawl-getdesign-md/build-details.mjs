#!/usr/bin/env node

/**
 * Generate local detail pages + download page screenshots
 * 
 * Usage:
 *   node build-details.mjs                 # download screenshots + generate pages
 *   node build-details.mjs --skip-download # HTML only
 *   node build-details.mjs --concurrency 5
 *
 * Requires: output/catalog.json (run 'node crawl.mjs' first)
 */

import {
  readFile,
  writeFile,
  mkdir,
  open,
  rename,
  unlink,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { existsSync, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { parseArgs } from "node:util";

const { values: flags } = parseArgs({
  options: {
    "skip-download": { type: "boolean", default: false },
    concurrency: { type: "string", default: "3" },
  },
});

const SKIP_DL = flags["skip-download"];
const CONC = parseInt(flags.concurrency, 10) || 3;
const OUT = path.resolve(import.meta.dirname, "output");
const IMG = path.join(OUT, "images");
const PAGES_DIR = path.join(OUT, "pages");
const ENRICHED_PATH = path.join(OUT, "catalog-enriched.json");

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

async function isValidImage(filePath) {
  if (!existsSync(filePath)) return false;
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

async function dl(url, dest) {
  const temp = `${dest}.${process.pid}.${Date.now()}.tmp`;
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "getdesign-md-crawler/1.0" },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    await pipeline(r.body, createWriteStream(temp));
    if (!(await isValidImage(temp))) {
      throw new Error("Downloaded file is not a supported JPEG/WebP image");
    }
    await rename(temp, dest);
  } catch (error) {
    await unlink(temp).catch(() => {});
    throw error;
  }
}

async function pool(tasks, limit) {
  let i = 0;
  const results = [];
  async function w() {
    while (i < tasks.length) {
      const j = i++;
      try { await tasks[j](); results[j] = true; }
      catch (e) { results[j] = e.message; }
    }
  }
  await Promise.all(Array.from({ length: limit }, () => w()));
  return results;
}

// ─── Download page screenshots ───────────────────────────────────────────────

function screenshotsFor(entry) {
  if (Array.isArray(entry.pages) && entry.pages.length > 0) return entry.pages;
  if (entry.heroImage) {
    return [{ label: "Home", src: entry.heroImage, heroFallback: true }];
  }
  return [];
}

async function downloadScreenshots(catalog) {
  if (!existsSync(IMG)) await mkdir(IMG, { recursive: true });
  const jobs = [];

  for (const entry of catalog) {
    for (const pg of entry._screenshots) {
      if (!pg.src) continue;
      const ext = path.extname(new URL(pg.src).pathname) || ".webp";
      const fname = `${entry.slug}--${pg.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}${ext}`;
      const dest = path.join(IMG, fname);
      pg._local = `images/${fname}`;
      if (await isValidImage(dest)) continue;
      await unlink(dest).catch(() => {});
      jobs.push({ url: pg.src, dest });
    }
  }

  if (!jobs.length) { console.log("✅ All screenshots already downloaded"); return; }
  console.log(`📥 Downloading ${jobs.length} screenshots (×${CONC}) …`);

  let done = 0;
  const tasks = jobs.map(({ url, dest }) => async () => {
    await dl(url, dest);
    done++;
    if (done % 30 === 0 || done === jobs.length) console.log(`   ${done}/${jobs.length}`);
  });

  const res = await pool(tasks, CONC);
  const fail = res.filter((r) => r !== true).length;
  console.log(`✅ Downloaded ${jobs.length - fail}/${jobs.length}` + (fail ? ` (${fail} failed)` : ""));
  if (fail) throw new Error(`${fail} screenshot downloads failed`);
}

// ─── Detail page HTML ────────────────────────────────────────────────────────

function detailHtml(entry, prevSlug, nextSlug) {
  const screenshots = entry._screenshots || [];
  const hasScreenshotTabs = screenshots.length > 1;
  const screenshotTabs = hasScreenshotTabs
    ? `<div class="screenshot-tabs" role="tablist" aria-label="${entry.name} page screenshots">
${screenshots
  .map(
    (pg, index) => `      <button
        type="button"
        class="screenshot-tab${index === 0 ? " is-active" : ""}"
        id="screenshot-tab-${index}"
        role="tab"
        aria-selected="${index === 0 ? "true" : "false"}"
        aria-controls="screenshot-panel-${index}"
        tabindex="${index === 0 ? "0" : "-1"}"
        data-tab-target="screenshot-panel-${index}"
      >${pg.label}</button>`
  )
  .join("\n")}
    </div>`
    : "";
  const screenshotCards = screenshots
    .map((pg, index) => {
      const src = pg._local || pg.src;
      const panelAttributes = hasScreenshotTabs
        ? ` id="screenshot-panel-${index}" role="tabpanel" aria-labelledby="screenshot-tab-${index}"${index === 0 ? "" : " hidden"}`
        : "";
      return `
      <div class="screenshot"${panelAttributes}>
        ${hasScreenshotTabs ? "" : `<div class="screenshot-label">${pg.label}</div>`}
        <img src="${src}" alt="${entry.name} — ${pg.label}" loading="lazy" />
      </div>`;
    })
    .join("\n");

  const thumbSrc = entry._localThumb || entry.thumbnail;

  const meta = [
    ["Category", entry.category],
    ["Website", entry.website ? `<a href="${entry.website}" target="_blank">${entry.website}</a>` : "—"],
    ["Added", entry.addedAt || "—"],
    ["Detail crawled", entry.crawledAt || "—"],
    ["DESIGN.md", entry.hasDesignMd ? `✅ Available (${entry.designMdSlug})` : "Not yet"],
    ["High Demand", entry.highDemand ? "🔥 Yes" : "No"],
  ]
    .map(([k, v]) => `<tr><td class="meta-key">${k}</td><td>${v}</td></tr>`)
    .join("\n          ");

  const nav = `
    <div class="nav">
      ${prevSlug ? `<a href="${prevSlug}.html" class="nav-btn">← Prev</a>` : '<span></span>'}
      <a href="../index.html" class="nav-btn">☰ Catalog</a>
      ${nextSlug ? `<a href="${nextSlug}.html" class="nav-btn">Next →</a>` : '<span></span>'}
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${entry.name} — getdesign.md local viewer</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>◈</text></svg>" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--bg:#0a0a0a;--s:#141414;--s2:#1c1c1c;--bd:#262626;--t:#fafafa;--t2:#a1a1a1;--t3:#737373;--acc:#f5a623;--r:8px;--f:'Inter',system-ui,sans-serif;--m:'SF Mono','Fira Code',monospace}
    body{font-family:var(--f);background:var(--bg);color:var(--t);line-height:1.5;-webkit-font-smoothing:antialiased}
    a{color:var(--acc);text-decoration:none}
    a:hover{text-decoration:underline}

    .header{position:sticky;top:0;z-index:50;background:rgba(10,10,10,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--bd);padding:14px 24px}
    .header-inner{max-width:1000px;margin:0 auto;display:flex;align-items:center;gap:16px}
    .logo{font-family:var(--m);font-size:17px;font-weight:600;letter-spacing:.1em;color:var(--t);text-decoration:none}
    .logo em{color:var(--acc);font-style:normal}
    .back{font-size:13px;color:var(--t3);border:1px solid var(--bd);border-radius:var(--r);padding:5px 12px;transition:all .15s}
    .back:hover{color:var(--t);border-color:var(--t3);text-decoration:none}

    .container{max-width:1000px;margin:0 auto;padding:32px 24px 80px}

    .hero{display:grid;grid-template-columns:1fr 300px;gap:32px;margin-bottom:40px;align-items:start}
    @media(max-width:768px){.hero{grid-template-columns:1fr;gap:20px}}

    .hero-main h1{font-size:36px;font-weight:700;margin-bottom:8px;letter-spacing:-.02em}
    .hero-tagline{font-size:15px;color:var(--t2);line-height:1.6;margin-bottom:20px}
    .hero-links{display:flex;flex-wrap:wrap;gap:8px}
    .hero-link{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;padding:8px 16px;border-radius:var(--r);border:1px solid var(--bd);color:var(--t2);transition:all .15s}
    .hero-link:hover{border-color:var(--acc);color:var(--acc);text-decoration:none}
    .hero-link.primary{background:var(--acc);color:#1a1400;border-color:var(--acc);font-weight:600}
    .hero-link.primary:hover{filter:brightness(1.1)}

    .hero-thumb{border-radius:var(--r);overflow:hidden;border:1px solid var(--bd);background:var(--s)}
    .hero-thumb img{width:100%;height:auto;display:block}

    .meta-table{width:100%;border-collapse:collapse;margin-bottom:40px;font-size:13px}
    .meta-table td{padding:10px 16px;border-bottom:1px solid var(--bd)}
    .meta-key{color:var(--t3);font-family:var(--m);font-size:12px;letter-spacing:.04em;width:140px;white-space:nowrap}
    .meta-table a{color:var(--acc)}

    .section-title{font-size:20px;font-weight:600;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid var(--bd)}

    .screenshot-tabs{display:flex;gap:4px;overflow-x:auto;margin-bottom:16px;padding:4px 4px 10px;border-bottom:1px solid var(--bd);overscroll-behavior-inline:contain;scrollbar-width:thin}
    .screenshot-tab{flex:0 0 auto;appearance:none;border:1px solid transparent;border-radius:6px;background:transparent;color:var(--t2);font:600 12px/1 var(--m);letter-spacing:.03em;padding:9px 12px;cursor:pointer;transition:background .15s,border-color .15s,color .15s}
    .screenshot-tab:hover{color:var(--t);background:var(--s)}
    .screenshot-tab.is-active{color:var(--acc);background:var(--s2);border-color:var(--bd)}
    .screenshot-tab:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
    .screenshots{display:flex;flex-direction:column;gap:32px}
    .screenshot{border:1px solid var(--bd);border-radius:var(--r);overflow:hidden;background:var(--s)}
    .screenshot[hidden]{display:none}
    .screenshot-label{padding:10px 16px;font-size:12px;font-family:var(--m);font-weight:600;color:var(--t3);letter-spacing:.06em;text-transform:uppercase;border-bottom:1px solid var(--bd);background:var(--s2)}
    .screenshot img{width:100%;height:auto;display:block}

    .no-screenshots{text-align:center;padding:60px 20px;color:var(--t3);font-size:14px;border:1px dashed var(--bd);border-radius:var(--r)}

    .nav{display:flex;justify-content:space-between;align-items:center;margin-top:48px;padding-top:24px;border-top:1px solid var(--bd)}
    .nav-btn{font-size:13px;font-weight:500;color:var(--t2);padding:8px 16px;border:1px solid var(--bd);border-radius:var(--r);transition:all .15s}
    .nav-btn:hover{border-color:var(--t3);color:var(--t);text-decoration:none}
  </style>
</head>
<body>
  <div class="header">
    <div class="header-inner">
      <a href="../index.html" class="logo">get<em>design</em>.md</a>
      <a href="../index.html" class="back">← Back to catalog</a>
    </div>
  </div>

  <div class="container">
    <div class="hero">
      <div class="hero-main">
        <h1>${entry.name}</h1>
        <p class="hero-tagline">${entry.description || entry.tagline || ""}</p>
        <div class="hero-links">
          <a href="${entry.detailUrl}" target="_blank" class="hero-link primary">View on getdesign.md →</a>
          ${entry.website ? `<a href="${entry.website}" target="_blank" class="hero-link">Visit original site ↗</a>` : ""}
        </div>
      </div>
      <div class="hero-thumb">
        <img src="${thumbSrc}" alt="${entry.name}" />
      </div>
    </div>

    <table class="meta-table">
      ${meta}
    </table>

    <h2 class="section-title">Page Screenshots${screenshots.length ? ` (${screenshots.length})` : ""}</h2>

    ${screenshotCards
      ? `${screenshotTabs}<div class="screenshots">${screenshotCards}</div>`
      : `<div class="no-screenshots">No page screenshots available for this entry.</div>`}

    ${nav}
  </div>
  <script>
    for (const tablist of document.querySelectorAll('[role="tablist"]')) {
      const tabs = [...tablist.querySelectorAll('[role="tab"]')];
      const activate = (nextTab, moveFocus = false) => {
        for (const tab of tabs) {
          const active = tab === nextTab;
          tab.classList.toggle('is-active', active);
          tab.setAttribute('aria-selected', String(active));
          tab.tabIndex = active ? 0 : -1;
          const panel = document.getElementById(tab.dataset.tabTarget);
          if (panel) panel.hidden = !active;
        }
        if (moveFocus) {
          nextTab.focus();
          nextTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      };

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activate(tab));
        tab.addEventListener('keydown', (event) => {
          let nextIndex = null;
          if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
          if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
          if (event.key === 'Home') nextIndex = 0;
          if (event.key === 'End') nextIndex = tabs.length - 1;
          if (nextIndex === null) return;
          event.preventDefault();
          activate(tabs[nextIndex], true);
        });
      });
    }
  </script>
</body>
</html>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const catPath = path.join(OUT, "catalog.json");
  if (!existsSync(catPath)) {
    console.error("❌ output/catalog.json not found. Run 'node crawl.mjs' first.");
    process.exit(1);
  }

  const baseCatalog = JSON.parse(await readFile(catPath, "utf-8"));
  let catalog = baseCatalog;
  if (existsSync(ENRICHED_PATH)) {
    const enriched = JSON.parse(await readFile(ENRICHED_PATH, "utf-8"));
    const sameSnapshot =
      enriched.length === baseCatalog.length &&
      enriched.every(
        (entry, index) =>
          entry.slug === baseCatalog[index].slug &&
          entry.sourceCatalogEntrySha256 ===
            catalogEntryFingerprint(baseCatalog[index])
      );
    if (sameSnapshot && enriched.every((entry) => !entry.error)) {
      catalog = enriched;
      console.log(`📂 Loaded ${catalog.length} enriched entries`);
    } else {
      console.log("⚠️  Enriched catalog is partial or stale; using catalog.json");
    }
  } else {
    console.log(`📂 Loaded ${catalog.length} entries`);
  }

  for (const entry of catalog) {
    entry._screenshots = screenshotsFor(entry);
  }

  // Assign local thumb paths
  for (const entry of catalog) {
    if (!entry.thumbnail) continue;
    const ext = path.extname(new URL(entry.thumbnail).pathname) || ".webp";
    entry._localThumb = `images/${entry.slug}${ext}`;
  }

  // Download page screenshots
  if (!SKIP_DL) {
    await downloadScreenshots(catalog);
  } else {
    // still assign _local paths
    for (const entry of catalog) {
      for (const pg of entry._screenshots) {
        if (!pg.src) continue;
        const ext = path.extname(new URL(pg.src).pathname) || ".webp";
        const fname = `${entry.slug}--${pg.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}${ext}`;
        pg._local = `images/${fname}`;
      }
    }
    console.log("⏭️  Skipping screenshot download");
  }

  // Generate detail pages
  if (!existsSync(PAGES_DIR)) await mkdir(PAGES_DIR, { recursive: true });
  console.log(`🔨 Generating ${catalog.length} detail pages …`);

  for (let i = 0; i < catalog.length; i++) {
    const entry = catalog[i];
    const prev = i > 0 ? catalog[i - 1].slug : null;
    const next = i < catalog.length - 1 ? catalog[i + 1].slug : null;

    // fix relative paths — detail pages are in pages/ subfolder
    const adjusted = JSON.parse(JSON.stringify(entry));
    if (adjusted._localThumb) adjusted._localThumb = `../${adjusted._localThumb}`;
    for (const pg of adjusted._screenshots) {
      if (pg._local) pg._local = `../${pg._local}`;
    }

    const html = detailHtml(adjusted, prev, next);
    await atomicWriteFile(path.join(PAGES_DIR, `${entry.slug}.html`), html);
  }

  console.log(`💾 Saved → output/pages/*.html (${catalog.length} files)`);

  // Update index.html card links to point to local pages
  const indexPath = path.join(OUT, "index.html");
  if (existsSync(indexPath)) {
    let indexHtml = await readFile(indexPath, "utf-8");
    let replaced = 0;
    for (const entry of catalog) {
      const remote = `href="${entry.detailUrl}" target="_blank" rel="noopener"`;
      const local = `href="pages/${entry.slug}.html"`;
      if (indexHtml.includes(remote)) {
        indexHtml = indexHtml.replace(remote, local);
        replaced++;
      }
    }
    // Also update the overlay text
    indexHtml = indexHtml.replaceAll("View on getdesign.md →", "View details →");
    await atomicWriteFile(indexPath, indexHtml);
    console.log(`🔗 Updated ${replaced} links in index.html → local pages`);
  }

  console.log("\n✨ Done!");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
