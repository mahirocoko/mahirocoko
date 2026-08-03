#!/usr/bin/env node

/**
 * Download thumbnails & generate a local HTML viewer from catalog.json
 *
 * Usage:
 *   node build-viewer.mjs                # download thumbs + generate index.html
 *   node build-viewer.mjs --skip-download # generate HTML only (thumbs already downloaded)
 *   node build-viewer.mjs --concurrency 5 # parallel downloads (default 3)
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
    help: { type: "boolean", default: false },
  },
});

if (flags.help) {
  console.log(`
Usage: node build-viewer.mjs [options]

Options:
  --skip-download     Skip downloading thumbnails (use if already downloaded)
  --concurrency <n>   Parallel download limit (default: 3)
  --help              Show this help message

Requires: output/catalog.json (run 'node crawl.mjs' first)
`);
  process.exit(0);
}

const SKIP_DOWNLOAD = flags["skip-download"];
const CONCURRENCY = parseInt(flags.concurrency, 10) || 3;
const OUTPUT_DIR = path.resolve(import.meta.dirname, "output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");
const CATALOG_PATH = path.join(OUTPUT_DIR, "catalog.json");

// ─── Download helpers ────────────────────────────────────────────────────────

async function downloadFile(url, dest) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; getdesign-md-crawler/1.0; +https://github.com/mahirocoko)",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const fileStream = createWriteStream(dest);
  await pipeline(res.body, fileStream);
}

async function downloadWithLimit(tasks, limit) {
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      try {
        await tasks[i]();
        results[i] = true;
      } catch (err) {
        results[i] = err.message;
      }
    }
  }

  await Promise.all(Array.from({ length: limit }, () => worker()));
  return results;
}

// ─── Download thumbnails ─────────────────────────────────────────────────────

async function downloadThumbnails(catalog) {
  if (!existsSync(IMAGES_DIR)) await mkdir(IMAGES_DIR, { recursive: true });

  const toDownload = [];

  for (const entry of catalog) {
    if (!entry.thumbnail) continue;
    const ext = path.extname(new URL(entry.thumbnail).pathname) || ".webp";
    const localFile = path.join(IMAGES_DIR, `${entry.slug}${ext}`);
    entry._localThumb = `images/${entry.slug}${ext}`;

    if (existsSync(localFile)) continue; // skip already downloaded
    toDownload.push({ entry, url: entry.thumbnail, dest: localFile });
  }

  if (toDownload.length === 0) {
    console.log("✅ All thumbnails already downloaded");
    return;
  }

  console.log(
    `📥 Downloading ${toDownload.length} thumbnails (concurrency ${CONCURRENCY}) …`
  );

  let done = 0;
  const tasks = toDownload.map(({ entry, url, dest }) => async () => {
    await downloadFile(url, dest);
    done++;
    if (done % 20 === 0 || done === toDownload.length) {
      console.log(`   ${done}/${toDownload.length}`);
    }
  });

  const results = await downloadWithLimit(tasks, CONCURRENCY);
  const failed = results.filter((r) => r !== true).length;
  console.log(
    `✅ Downloaded ${toDownload.length - failed}/${toDownload.length}` +
      (failed ? ` (${failed} failed)` : "")
  );
}

// ─── Generate HTML viewer ────────────────────────────────────────────────────

function generateHtml(catalog) {
  const categories = [...new Set(catalog.map((e) => e.category))].sort();
  const totalCount = catalog.length;
  const withDesignMd = catalog.filter((e) => e.hasDesignMd).length;

  const cards = catalog
    .map((entry) => {
      const thumb = entry._localThumb || entry.thumbnail;
      const tags = [
        entry.category,
        entry.highDemand ? "🔥 High Demand" : "",
        entry.hasDesignMd ? "📄 Has DESIGN.md" : "",
      ]
        .filter(Boolean)
        .map((t) => `<span class="tag">${t}</span>`)
        .join("");

      return `
      <div class="card" data-category="${entry.categorySlug}" data-name="${entry.name.toLowerCase()}" data-slug="${entry.slug}">
        <a href="${entry.detailUrl}" target="_blank" rel="noopener" class="card-thumb">
          <img src="${thumb}" alt="${entry.name}" loading="lazy" />
          <div class="card-overlay">
            <span>View on getdesign.md →</span>
          </div>
        </a>
        <div class="card-body">
          <div class="card-header">
            <h3 class="card-title">${entry.name}</h3>
            ${entry.website ? `<a href="${entry.website}" target="_blank" rel="noopener" class="card-link" title="Visit site">↗</a>` : ""}
          </div>
          <p class="card-tagline">${entry.tagline || ""}</p>
          <div class="card-tags">${tags}</div>
        </div>
      </div>`;
    })
    .join("\n");

  const categoryFilters = categories
    .map(
      (cat) =>
        `<button class="filter-btn" data-filter="${cat}">${cat}</button>`
    )
    .join("\n          ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>getdesign.md Catalog — Local Viewer</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0a0a0a;
      --surface: #141414;
      --surface-2: #1c1c1c;
      --border: #262626;
      --text: #fafafa;
      --text-2: #a1a1a1;
      --text-3: #737373;
      --accent: #f5a623;
      --radius: 8px;
      --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --mono: 'GeistMono', 'SF Mono', 'Fira Code', monospace;
    }

    @font-face {
      font-family: 'Inter';
      src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    }

    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    /* ─── Header ─── */
    .header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(10, 10, 10, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 16px 24px;
    }

    .header-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .logo {
      font-family: var(--mono);
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: var(--text);
      text-decoration: none;
    }
    .logo em { color: var(--accent); font-style: normal; }

    .stats {
      display: flex;
      gap: 16px;
      font-size: 12px;
      font-family: var(--mono);
      color: var(--text-3);
      letter-spacing: 0.04em;
    }
    .stats span { color: var(--text-2); font-weight: 600; }

    /* ─── Search + Filters ─── */
    .toolbar {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px 24px 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .search-box {
      position: relative;
      max-width: 360px;
    }
    .search-box svg {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-3);
      pointer-events: none;
    }
    .search-box input {
      width: 100%;
      padding: 10px 12px 10px 38px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text);
      font-size: 13px;
      font-family: var(--font);
      outline: none;
      transition: border-color 0.15s;
    }
    .search-box input:focus { border-color: var(--accent); }
    .search-box input::placeholder { color: var(--text-3); }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .filter-btn {
      padding: 6px 14px;
      font-size: 12px;
      font-family: var(--font);
      font-weight: 500;
      border: 1px solid var(--border);
      border-radius: 100px;
      background: var(--surface);
      color: var(--text-3);
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .filter-btn:hover { border-color: var(--text-3); color: var(--text-2); }
    .filter-btn.active {
      background: var(--text);
      border-color: var(--text);
      color: var(--bg);
    }

    .result-count {
      font-size: 12px;
      font-family: var(--mono);
      color: var(--text-3);
      padding: 4px 0;
      letter-spacing: 0.04em;
    }

    /* ─── Grid ─── */
    .grid {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px 24px 80px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    /* ─── Card ─── */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      transition: border-color 0.2s, transform 0.2s;
    }
    .card:hover { border-color: var(--text-3); transform: translateY(-2px); }
    .card.hidden { display: none; }

    .card-thumb {
      position: relative;
      display: block;
      aspect-ratio: 3 / 4;
      overflow: hidden;
      background: var(--surface-2);
    }
    .card-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      transition: transform 0.3s;
    }
    .card:hover .card-thumb img { transform: scale(1.03); }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.9) 100%);
      display: flex;
      align-items: flex-end;
      padding: 16px;
      opacity: 0;
      transition: opacity 0.25s;
    }
    .card:hover .card-overlay { opacity: 1; }
    .card-overlay span {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
    }

    .card-body { padding: 14px 16px 16px; }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 6px;
    }

    .card-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-link {
      flex-shrink: 0;
      font-size: 14px;
      color: var(--text-3);
      text-decoration: none;
      transition: color 0.15s;
      line-height: 1;
    }
    .card-link:hover { color: var(--accent); }

    .card-tagline {
      font-size: 12px;
      color: var(--text-3);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 10px;
    }

    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .tag {
      font-size: 11px;
      font-family: var(--mono);
      padding: 3px 8px;
      border-radius: 4px;
      background: var(--surface-2);
      color: var(--text-3);
      letter-spacing: 0.02em;
      white-space: nowrap;
    }

    /* ─── Empty state ─── */
    .empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: 80px 20px;
      color: var(--text-3);
      font-size: 14px;
    }

    /* ─── Responsive ─── */
    @media (max-width: 640px) {
      .grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; padding: 16px; }
      .header { padding: 12px 16px; }
      .toolbar { padding: 16px 16px 0; }
      .stats { display: none; }
    }
  </style>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="header">
    <div class="header-inner">
      <a href="https://getdesign.md/design-md" target="_blank" class="logo">get<em>design</em>.md</a>
      <div class="stats">
        <div><span>${totalCount}</span> websites</div>
        <div><span>${withDesignMd}</span> with DESIGN.md</div>
        <div><span>${categories.length}</span> categories</div>
      </div>
    </div>
  </div>

  <div class="toolbar">
    <div class="search-box">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input type="text" id="search" placeholder="Search websites…" autocomplete="off" />
    </div>
    <div class="filters">
      <button class="filter-btn active" data-filter="all">All</button>
      ${categoryFilters}
    </div>
    <div class="result-count" id="result-count"></div>
  </div>

  <div class="grid" id="grid">
    ${cards}
  </div>

  <script>
    const searchInput = document.getElementById('search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');
    const resultCount = document.getElementById('result-count');
    let activeCategory = 'all';

    function applyFilters() {
      const query = searchInput.value.toLowerCase().trim();
      let visible = 0;
      cards.forEach(card => {
        const name = card.dataset.name;
        const slug = card.dataset.slug;
        const category = card.dataset.category;
        const matchSearch = !query || name.includes(query) || slug.includes(query);
        const matchCategory = activeCategory === 'all' || card.querySelector('.card-tags').textContent.includes(activeCategory);
        const show = matchSearch && matchCategory;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });
      resultCount.textContent = query || activeCategory !== 'all'
        ? visible + ' of ' + cards.length + ' shown'
        : cards.length + ' websites';
    }

    searchInput.addEventListener('input', applyFilters);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.filter;
        applyFilters();
      });
    });

    applyFilters();
  </script>
</body>
</html>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(CATALOG_PATH)) {
    console.error("❌ output/catalog.json not found. Run 'node crawl.mjs' first.");
    process.exit(1);
  }

  const catalog = JSON.parse(await readFile(CATALOG_PATH, "utf-8"));
  console.log(`📂 Loaded ${catalog.length} entries from catalog.json`);

  // Assign local thumb paths
  for (const entry of catalog) {
    if (!entry.thumbnail) continue;
    const ext = path.extname(new URL(entry.thumbnail).pathname) || ".webp";
    entry._localThumb = `images/${entry.slug}${ext}`;
  }

  // Download thumbnails
  if (!SKIP_DOWNLOAD) {
    await downloadThumbnails(catalog);
  } else {
    console.log("⏭️  Skipping thumbnail download");
  }

  // Generate HTML
  console.log("🔨 Generating index.html …");
  const html = generateHtml(catalog);
  await writeFile(path.join(OUTPUT_DIR, "index.html"), html);
  console.log(`💾 Saved → output/index.html`);

  console.log(`\n✨ Done! Open output/index.html in a browser to browse.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
