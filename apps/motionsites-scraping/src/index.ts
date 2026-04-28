import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, type Locator, type Page } from "playwright";

type CliOptions = {
  dryRun: boolean;
  headful: boolean;
  limit: number;
  outDir: string;
  timeoutMs: number;
  delayMs: number;
};

type PromptRecord = {
  kind: "prompt";
  title: string;
  category: string;
  prompt: string;
  promptPath: string;
  thumbnailUrl?: string;
  thumbnailPath?: string;
  sourceUrl: string;
  skippedReason?: string;
};

type BackgroundRecord = {
  kind: "background";
  title: string;
  assetUrl: string;
  backgroundPath?: string;
  sourceUrl: string;
  skippedReason?: string;
};

type ManifestRecord = (PromptRecord | BackgroundRecord) & {
  id: string;
  createdAt: string;
  premium: false;
  dryRun: boolean;
};

const SITE_ORIGIN = "https://motionsites.ai";
const PROMPTS_URL = `${SITE_ORIGIN}/`;
const BACKGROUNDS_URL = `${SITE_ORIGIN}/backgrounds`;

const PROMPT_CARD_SELECTOR = "div.bg-card.rounded-3xl.overflow-visible.card-hover.flex.flex-col.cursor-pointer";
const BACKGROUND_CARD_SELECTOR = "div.bg-card.rounded-3xl.overflow-hidden.card-hover.flex.flex-col";
const PROMPT_THUMBNAILS_DIR = "prompts-thumbnails";
const PREMIUM_TEXT = /\b(premium|pro|locked|upgrade|unlimited)\b/i;

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(projectRoot, "..");

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const outputDir = path.resolve(appRoot, options.outDir);
  await prepareOutput(outputDir);

  const browser = await chromium.launch({ headless: !options.headful });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    userAgent: "motionsites-scraping/0.0.0 (+https://motionsites.ai public gallery scraper)",
  });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: SITE_ORIGIN });

  const page = await context.newPage();
  page.setDefaultTimeout(options.timeoutMs);

  const records: ManifestRecord[] = [];

  try {
    records.push(...(await scrapePrompts(page, outputDir, options)));
    records.push(...(await scrapeBackgrounds(page, outputDir, options)));
    await writeManifest(outputDir, records);
  } finally {
    await context.close();
    await browser.close();
  }

  printSummary(records, outputDir);
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    dryRun: false,
    headful: false,
    limit: 25,
    outDir: "output",
    timeoutMs: 15_000,
    delayMs: 250,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--") {
      continue;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--headful") {
      options.headful = true;
    } else if (arg === "--limit") {
      options.limit = parsePositiveInteger(readArgValue(args, index, arg), arg);
      index += 1;
    } else if (arg === "--out") {
      options.outDir = readArgValue(args, index, arg);
      index += 1;
    } else if (arg === "--timeout-ms") {
      options.timeoutMs = parsePositiveInteger(readArgValue(args, index, arg), arg);
      index += 1;
    } else if (arg === "--delay-ms") {
      options.delayMs = parsePositiveInteger(readArgValue(args, index, arg), arg);
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function readArgValue(args: string[], index: number, flag: string) {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function parsePositiveInteger(value: string, flag: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return parsed;
}

async function prepareOutput(outputDir: string) {
  await mkdir(path.join(outputDir, "prompts"), { recursive: true });
  await mkdir(path.join(outputDir, PROMPT_THUMBNAILS_DIR), { recursive: true });
  await mkdir(path.join(outputDir, "backgrounds"), { recursive: true });
}

async function scrapePrompts(page: Page, outputDir: string, options: CliOptions) {
  await page.goto(PROMPTS_URL, { waitUntil: "domcontentloaded" });
  await page.locator(PROMPT_CARD_SELECTOR).first().waitFor({ state: "visible" });
  await settleLazyContent(page, options.delayMs);

  const records: ManifestRecord[] = [];
  const cards = page.locator(PROMPT_CARD_SELECTOR);
  const count = Math.min(await cards.count(), options.limit);

  for (let index = 0; index < count; index += 1) {
    const card = cards.nth(index);
    const title = await readText(card.locator("h3").first(), `prompt-${index + 1}`);
    const category = await readText(card.locator("span.text-muted-foreground").first(), "uncategorized");
    const visibleText = await card.innerText().catch(() => "");

    if (isPremiumCard(visibleText)) {
      continue;
    }

    const thumbnailUrl = await findPromptThumbnailUrl(card);
    const thumbnailPath = thumbnailUrl ? path.join(outputDir, PROMPT_THUMBNAILS_DIR, `${slugify(title)}.${getAssetExtension(thumbnailUrl)}`) : "";
    if (thumbnailUrl && !options.dryRun) {
      await downloadAsset(page, thumbnailUrl, thumbnailPath);
    }

    const copyButton = card.locator('button[aria-label="Copy prompt"]').first();
    if ((await copyButton.count()) === 0) {
      records.push(createPromptRecord({
        title,
        category,
        prompt: "",
        promptPath: "",
        thumbnailUrl: thumbnailUrl || undefined,
        thumbnailPath: thumbnailPath ? relativeToApp(thumbnailPath) : undefined,
        skippedReason: "missing-copy-prompt-button",
        dryRun: options.dryRun,
      }));
      continue;
    }

    const prompt = await copyClipboardText(copyButton);
    if (!prompt) {
      records.push(createPromptRecord({
        title,
        category,
        prompt: "",
        promptPath: "",
        thumbnailUrl: thumbnailUrl || undefined,
        thumbnailPath: thumbnailPath ? relativeToApp(thumbnailPath) : undefined,
        skippedReason: "empty-clipboard-after-copy",
        dryRun: options.dryRun,
      }));
      continue;
    }

    const fileName = `${slugify(title)}.txt`;
    const promptPath = path.join(outputDir, "prompts", fileName);
    if (!options.dryRun) {
      await writeFile(promptPath, `${prompt.trim()}\n`, "utf8");
    }

    records.push(createPromptRecord({
      title,
      category,
      prompt,
      promptPath: relativeToApp(promptPath),
      thumbnailUrl: thumbnailUrl || undefined,
      thumbnailPath: thumbnailPath ? relativeToApp(thumbnailPath) : undefined,
      dryRun: options.dryRun,
    }));
    await page.waitForTimeout(options.delayMs);
  }

  return records;
}

async function scrapeBackgrounds(page: Page, outputDir: string, options: CliOptions) {
  await page.goto(BACKGROUNDS_URL, { waitUntil: "domcontentloaded" });
  await page.locator(BACKGROUND_CARD_SELECTOR).first().waitFor({ state: "visible" });
  await settleLazyContent(page, options.delayMs);

  const records: ManifestRecord[] = [];
  const cards = page.locator(BACKGROUND_CARD_SELECTOR);
  const count = Math.min(await cards.count(), options.limit);

  for (let index = 0; index < count; index += 1) {
    const card = cards.nth(index);
    const image = card.locator('img[alt^="Motion BG "]').first();
    const title =
      (await image.count()) > 0
        ? await image.getAttribute("alt").then((alt) => alt?.replace(/^Motion BG\s*/i, "").trim() || `background-${index + 1}`)
        : `background-${index + 1}`;
    const visibleText = await card.innerText().catch(() => "");

    if (isPremiumCard(visibleText) || (await card.locator('a[href="/unlimited"]').count()) > 0) {
      continue;
    }

    const copyUrlButton = card.getByRole("button", { name: /^Copy URL$/ }).first();
    if ((await copyUrlButton.count()) === 0) {
      records.push(createBackgroundRecord({ title, assetUrl: "", skippedReason: "missing-copy-url-button", dryRun: options.dryRun }));
      continue;
    }

    const copiedText = await copyClipboardText(copyUrlButton);
    const assetUrl = extractDownloadablePublicUrl(copiedText);
    if (!assetUrl) {
      records.push(createBackgroundRecord({ title, assetUrl: copiedText, skippedReason: "copied-text-has-no-public-media-url", dryRun: options.dryRun }));
      continue;
    }

    const extension = getAssetExtension(assetUrl);
    const backgroundPath = path.join(outputDir, "backgrounds", `${slugify(title)}.${extension}`);
    if (!options.dryRun) {
      await downloadAsset(page, assetUrl, backgroundPath);
    }

    records.push(createBackgroundRecord({ title, assetUrl, backgroundPath: relativeToApp(backgroundPath), dryRun: options.dryRun }));
    await page.waitForTimeout(options.delayMs);
  }

  return records;
}

async function settleLazyContent(page: Page, delayMs: number) {
  for (let step = 0; step < 4; step += 1) {
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(delayMs);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(delayMs);
}

async function readText(locator: Locator, fallback: string) {
  const text = await locator.textContent().catch(() => null);
  return text?.trim() || fallback;
}

async function copyClipboardText(button: Locator) {
  await button.scrollIntoViewIfNeeded();
  const page = button.page();
  const previousValue = await readClipboard(page);
  await button.click();
  for (let attempt = 0; attempt < 10; attempt += 1) {
    await page.waitForTimeout(150);
    const value = await readClipboard(page);
    if (value && value !== previousValue) {
      return value;
    }
  }

  return readClipboard(page);
}

async function readClipboard(page: Page) {
  return page.evaluate(() => navigator.clipboard.readText()).then((value) => value.trim()).catch(() => "");
}

function isPremiumCard(text: string) {
  return PREMIUM_TEXT.test(text);
}

function isDownloadablePublicUrl(value: string) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return false;
    }

    const pathname = url.pathname.toLowerCase();
    return /\.(avif|gif|jpe?g|png|webp|mp4|webm)$/.test(pathname);
  } catch {
    return false;
  }
}

function extractDownloadablePublicUrl(value: string) {
  if (isDownloadablePublicUrl(value)) {
    return value;
  }

  const matches = value.match(/https:\/\/[^\s)"'<>]+/g) || [];
  return matches.find(isDownloadablePublicUrl) || "";
}

async function downloadAsset(page: Page, url: string, destination: string) {
  const response = await page.request.get(url, { failOnStatusCode: false });
  if (!response.ok()) {
    throw new Error(`Failed to download ${url}: HTTP ${response.status()}`);
  }

  const contentType = response.headers()["content-type"] || "";
  if (!contentType.startsWith("image/") && !contentType.startsWith("video/")) {
    throw new Error(`Refusing non-media response for ${url}: ${contentType || "unknown content-type"}`);
  }

  await writeFile(destination, await response.body());
}

async function findPromptThumbnailUrl(card: Locator) {
  const image = card.locator("img").first();
  if ((await image.count()) === 0) {
    return "";
  }

  const currentSrc = await image.evaluate((node) => (node as HTMLImageElement).currentSrc).catch(() => "");
  const src = await image.getAttribute("src").catch(() => null);
  const srcset = await image.getAttribute("srcset").catch(() => null);
  const pictureSourceSrcsets = await card
    .locator("picture source[srcset]")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("srcset") || ""))
    .catch(() => [] as string[]);

  return pickPublicImageUrl(currentSrc, src, srcset, ...pictureSourceSrcsets);
}

function pickPublicImageUrl(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const direct = extractDownloadablePublicImageUrl(value || "");
    if (direct) {
      return direct;
    }

    const fromSrcset = extractDownloadablePublicImageUrlFromSrcset(value || "");
    if (fromSrcset) {
      return fromSrcset;
    }
  }

  return "";
}

function extractDownloadablePublicImageUrlFromSrcset(value: string) {
  if (!value) {
    return "";
  }

  const candidates = value.split(",").map((entry) => entry.trim().split(/\s+/)[0]).filter(Boolean);
  return candidates.find(isDownloadablePublicImageUrl) || "";
}

function isDownloadablePublicImageUrl(value: string) {
  if (!isDownloadablePublicUrl(value)) {
    return false;
  }

  return /\.(avif|gif|jpe?g|png|webp)$/.test(new URL(value).pathname.toLowerCase());
}

function extractDownloadablePublicImageUrl(value: string) {
  if (isDownloadablePublicImageUrl(value)) {
    return value;
  }

  const matches = value.match(/https:\/\/[^\s)"'<>]+/g) || [];
  return matches.find(isDownloadablePublicImageUrl) || "";
}

function getAssetExtension(url: string) {
  const pathname = new URL(url).pathname;
  const extension = path.extname(pathname).replace(/^\./, "").toLowerCase();
  return extension || "bin";
}

function createPromptRecord(input: Omit<PromptRecord, "kind" | "sourceUrl"> & { dryRun: boolean }): ManifestRecord {
  return {
    id: stableId("prompt", input.title, input.prompt),
    kind: "prompt",
    title: input.title,
    category: input.category,
    prompt: input.prompt,
    promptPath: input.promptPath,
    thumbnailUrl: input.thumbnailUrl,
    thumbnailPath: input.thumbnailPath,
    sourceUrl: PROMPTS_URL,
    skippedReason: input.skippedReason,
    createdAt: new Date().toISOString(),
    premium: false,
    dryRun: input.dryRun,
  };
}

function createBackgroundRecord(input: Omit<BackgroundRecord, "kind" | "sourceUrl"> & { dryRun: boolean }): ManifestRecord {
  return {
    id: stableId("background", input.title, input.assetUrl),
    kind: "background",
    title: input.title,
    assetUrl: input.assetUrl,
    backgroundPath: input.backgroundPath,
    sourceUrl: BACKGROUNDS_URL,
    skippedReason: input.skippedReason,
    createdAt: new Date().toISOString(),
    premium: false,
    dryRun: input.dryRun,
  };
}

async function writeManifest(outputDir: string, records: ManifestRecord[]) {
  const lines = records.map((record) => JSON.stringify(record)).join("\n");
  await writeFile(path.join(outputDir, "manifest.jsonl"), lines ? `${lines}\n` : "", "utf8");
}

function printSummary(records: ManifestRecord[], outputDir: string) {
  const prompts = records.filter((record) => record.kind === "prompt" && !record.skippedReason).length;
  const backgrounds = records.filter((record) => record.kind === "background" && !record.skippedReason).length;
  const skipped = records.filter((record) => record.skippedReason).length;

  console.log(`Saved ${prompts} prompts and ${backgrounds} backgrounds. Skipped ${skipped}.`);
  console.log(`Manifest: ${path.join(outputDir, "manifest.jsonl")}`);
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

  return slug || "untitled";
}

function stableId(...parts: string[]) {
  return createHash("sha256").update(parts.join("\0")).digest("hex").slice(0, 16);
}

function relativeToApp(filePath: string) {
  return path.relative(appRoot, filePath);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
