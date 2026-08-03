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

import { readFile, writeFile, mkdir } from "node:fs/promises";
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

async function dl(url, dest) {
  const r = await fetch(url, {
    headers: { "User-Agent": "getdesign-md-crawler/1.0" },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  await pipeline(r.body, createWriteStream(dest));
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

async function downloadScreenshots(catalog) {
  if (!existsSync(IMG)) await mkdir(IMG, { recursive: true });
  const jobs = [];

  for (const entry of catalog) {
    if (!entry.pages) continue;
    for (const pg of entry.pages) {
      if (!pg.src) continue;
      const ext = path.extname(new URL(pg.src).pathname) || ".webp";
      const fname = `${entry.slug}--${pg.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}${ext}`;
      const dest = path.join(IMG, fname);
      pg._local = `images/${fname}`;
      if (existsSync(dest)) continue;
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
}

// ─── Detail page HTML ────────────────────────────────────────────────────────

function detailHtml(entry, prevSlug, nextSlug) {
  const screenshotCards = (entry.pages || [])
    .map((pg) => {
      const src = pg._local || pg.src;
      return `
      <div class="screenshot">
        <div class="screenshot-label">${pg.label}</div>
        <img src="${src}" alt="${entry.name} — ${pg.label}" loading="lazy" />
      </div>`;
    })
    .join("\n");

  const thumbSrc = entry._localThumb || entry.thumbnail;

  const meta = [
    ["Category", entry.category],
    ["Website", entry.website ? `<a href="${entry.website}" target="_blank">${entry.website}</a>` : "—"],
    ["Added", entry.addedAt || "—"],
    ["DESIGN.md", entry.hasDesignMd ? `✅ Available (${entry.designMdSlug})` : "Not yet"],
    ["High Demand", entry.highDemand ? "🔥 Yes" : "No"],
  ]
    .map(([k, v]) => `<tr><td class="meta-key">${k}</td><td>${v}</td></tr>`)
    .join("\n          ");

  const nav = `
    <div class="nav">
      ${prevSlug ? `<a href="${prevSlug}.html" class="nav-btn">← Prev</a>` : '<span></span>'}
      <a href="index.html" class="nav-btn">☰ Catalog</a>
      ${nextSlug ? `<a href="${nextSlug}.html" class="nav-btn">Next →</a>` : '<span></span>'}
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${entry.name} — getdesign.md local viewer</title>
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

    .screenshots{display:flex;flex-direction:column;gap:32px}
    .screenshot{border:1px solid var(--bd);border-radius:var(--r);overflow:hidden;background:var(--s)}
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
      <a href="index.html" class="logo">get<em>design</em>.md</a>
      <a href="index.html" class="back">← Back to catalog</a>
    </div>
  </div>

  <div class="container">
    <div class="hero">
      <div class="hero-main">
        <h1>${entry.name}</h1>
        <p class="hero-tagline">${entry.tagline || ""}</p>
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

    <h2 class="section-title">Page Screenshots${entry.pages ? ` (${entry.pages.length})` : ""}</h2>

    ${screenshotCards
      ? `<div class="screenshots">${screenshotCards}</div>`
      : `<div class="no-screenshots">No page screenshots available for this entry.</div>`}

    ${nav}
  </div>
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

  const catalog = JSON.parse(await readFile(catPath, "utf-8"));
  console.log(`📂 Loaded ${catalog.length} entries`);

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
      if (!entry.pages) continue;
      for (const pg of entry.pages) {
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
    if (adjusted.pages) {
      for (const pg of adjusted.pages) {
        if (pg._local) pg._local = `../${pg._local}`;
      }
    }

    const html = detailHtml(adjusted, prev, next);
    await writeFile(path.join(PAGES_DIR, `${entry.slug}.html`), html);
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
    await writeFile(indexPath, indexHtml);
    console.log(`🔗 Updated ${replaced} links in index.html → local pages`);
  }

  console.log("\n✨ Done!");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
