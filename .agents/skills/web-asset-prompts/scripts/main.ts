#!/usr/bin/env bun

type AssetMode = {
  name: string
  label: string
  ratio: string
  purpose: string
  required: string[]
  constraints: string[]
}

const MODES: Record<string, AssetMode> = {
  "photo-card": {
    name: "photo-card",
    label: "Full-bleed editorial card image",
    ratio: "4:5 or 3:4",
    purpose: "photographic cards, feature tiles, lifestyle modules",
    required: [
      "editorial web card image",
      "crop-safe composition",
      "subject not touching edges",
      "usable at responsive breakpoints",
    ],
    constraints: ["no text", "no logo", "no watermark", "no clutter"],
  },
  "overlay-photo": {
    name: "overlay-photo",
    label: "Overlay-safe photographic card image",
    ratio: "4:5 or 16:10",
    purpose: "photo cards that may contain text, gradients, captions, or badges",
    required: [
      "editorial web card image",
      "overlay-safe negative space",
      "low-detail area for text placement",
      "crop-safe composition",
    ],
    constraints: ["no text", "no logo", "no watermark", "avoid busy background"],
  },
  cutout: {
    name: "cutout",
    label: "Transparent PNG cutout",
    ratio: "4:5",
    purpose: "general web compositing assets placed on cards or panels",
    required: [
      "transparent PNG cutout",
      "isolated object",
      "no background",
      "generous padding",
      "subject fully visible",
      "clean silhouette",
      "centered web compositing asset",
    ],
    constraints: ["no cast shadow", "no floor plane", "no text", "no watermark"],
  },
  "product-cutout": {
    name: "product-cutout",
    label: "Transparent product/package cutout",
    ratio: "4:5",
    purpose: "product cards, protocol cards, pricing/product modules",
    required: [
      "transparent PNG product cutout",
      "isolated product",
      "no background",
      "generous padding",
      "full package visible",
      "clean silhouette",
      "front three-quarter angle",
    ],
    constraints: ["no readable fake text", "no logo", "no cast shadow", "no floor plane", "no watermark"],
  },
  "ingredient-cutout": {
    name: "ingredient-cutout",
    label: "Transparent ingredient/object cutout",
    ratio: "1:1",
    purpose: "ingredient grids, nutrition modules, decorative botanical objects",
    required: [
      "transparent PNG ingredient cutout",
      "isolated object",
      "no background",
      "generous padding",
      "subject fully visible",
      "clean natural silhouette",
    ],
    constraints: ["no cast shadow", "no floor plane", "no text", "no watermark", "no clipped edges"],
  },
  "journal-image": {
    name: "journal-image",
    label: "Editorial journal/card image",
    ratio: "16:10",
    purpose: "article cards, journal previews, education modules",
    required: [
      "editorial article card image",
      "16:10 aspect ratio",
      "crop-safe composition",
      "clear subject hierarchy",
    ],
    constraints: ["no text", "no logo", "no watermark", "no generic stock-photo look"],
  },
  "hero-image": {
    name: "hero-image",
    label: "Large responsive hero image",
    ratio: "16:9 or 21:9",
    purpose: "website hero, masthead, wide landing-page composition",
    required: [
      "large responsive website hero image",
      "wide crop-safe composition",
      "usable negative space",
      "subject remains readable on desktop and mobile crops",
    ],
    constraints: ["no text", "no logo", "no watermark", "avoid detail near critical crop edges"],
  },
}

function printUsage(): void {
  console.log(`Usage:
  bun .agents/skills/web-asset-prompts/scripts/main.ts list
  bun .agents/skills/web-asset-prompts/scripts/main.ts compose <mode> <request>
  bun .agents/skills/web-asset-prompts/scripts/main.ts check <prompt>

Modes: ${Object.keys(MODES).join(", ")}`)
}

function listModes(): void {
  console.log("# Web asset prompt modes\n")

  for (const mode of Object.values(MODES)) {
    console.log(`## ${mode.name}`)
    console.log(`- Label: ${mode.label}`)
    console.log(`- Default ratio: ${mode.ratio}`)
    console.log(`- Purpose: ${mode.purpose}`)
    console.log(`- Required: ${mode.required.join("; ")}`)
    console.log(`- Avoid: ${mode.constraints.join("; ")}\n`)
  }
}

function composePrompt(mode: AssetMode, request: string): void {
  console.log(`Use case: production-web-asset
Asset mode: ${mode.name} — ${mode.label}
Primary request: ${request}
Web role: ${mode.purpose}
Aspect ratio / canvas: ${mode.ratio}
Composition/framing: ${mode.required.join("; ")}
Output requirements: professional website-ready raster asset; clean edges; safe responsive crop; no generated UI text unless explicitly requested
Constraints: ${mode.constraints.join("; ")}
Avoid: vague standalone illustration look; clipped subject edges; unusable crop; clutter; fake text; watermark; logo artifacts`)
}

function checkPrompt(prompt: string): void {
  const normalized = prompt.toLowerCase()
  const markers = [
    "aspect ratio",
    "crop-safe",
    "no text",
    "no logo",
    "no watermark",
    "transparent",
    "padding",
    "overlay-safe",
    "negative space",
  ]

  const found = markers.filter((marker) => normalized.includes(marker))
  const missing = markers.filter((marker) => !normalized.includes(marker))

  console.log("# Web asset prompt check\n")
  console.log(`Found markers: ${found.length ? found.join(", ") : "none"}`)
  console.log(`Missing useful markers: ${missing.length ? missing.join(", ") : "none"}`)

  if (found.length < 4) {
    console.log("\nRecommendation: rewrite this as a production web asset prompt with explicit mode, ratio, crop safety, and usage constraints.")
  } else {
    console.log("\nRecommendation: prompt has usable production markers. Tighten only for the asset's exact web role.")
  }
}

const [command, ...args] = process.argv.slice(2)

if (!command || command === "help" || command === "--help") {
  printUsage()
  process.exit(0)
}

if (command === "list") {
  listModes()
  process.exit(0)
}

if (command === "compose") {
  const [modeName, ...requestParts] = args
  const mode = MODES[modeName]
  const request = requestParts.join(" ").trim()

  if (!mode || request.length === 0) {
    printUsage()
    process.exit(1)
  }

  composePrompt(mode, request)
  process.exit(0)
}

if (command === "check") {
  const prompt = args.join(" ").trim()

  if (prompt.length === 0) {
    printUsage()
    process.exit(1)
  }

  checkPrompt(prompt)
  process.exit(0)
}

console.error(`Unknown command: ${command}`)
printUsage()
process.exit(1)
