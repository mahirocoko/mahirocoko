# crawl-getdesign-md

Crawl script สำหรับดึงข้อมูล catalog ทั้งหมดจาก [getdesign.md/design-md](https://getdesign.md/design-md) — คอลเลกชัน DESIGN.md สำหรับ AI coding agents

## How It Works

เว็บ getdesign.md render แค่ ~16 items ใน SSR HTML ส่วนที่เหลือ (~330+ entries) ฝังอยู่ใน client-side JS bundle ตัว script จึงทำงาน 2 phases:

1. **Phase 1** — ดึง JS bundle แล้ว parse catalog objects ออกมาด้วย brace-matching + JS→JSON conversion
2. **Phase 2** _(optional)_ — เข้าแต่ละ detail page เพื่อดึง description, OG image, hero screenshot, structured data เพิ่ม

## Setup

```bash
npm install
```

## Usage

```bash
# ดึงแค่ catalog index (เร็ว, 2 HTTP requests)
node crawl.mjs

# ดึง catalog + detail pages ทุกตัว
node crawl.mjs --details --resume

# ดึง detail ที่ยังค้างอีกไม่เกิน 10 ตัว
node crawl.mjs --details --resume --limit 10

# ปรับ delay ระหว่าง request (default 1000ms)
node crawl.mjs --details --resume --delay 2000

# ไม่ reuse checkpoint เดิมและ crawl detail ใหม่ทั้งหมด
node crawl.mjs --details

# ดู help
node crawl.mjs --help
```

หรือใช้ npm scripts:

```bash
npm run crawl            # catalog only
npm run crawl:details    # resume detail crawl จนครบ
npm run crawl:details:fresh # crawl detail ใหม่ทั้งหมด
npm run crawl:sample     # pending details อีกไม่เกิน 5 ตัว
npm run build            # refresh catalog + details + viewer + verify
npm run verify           # ตรวจ corpus และ local artifacts โดยไม่ crawl ใหม่
```

`--resume` จะอ่าน `output/catalog.json` และ detail JSON ที่ผ่าน validation แล้ว จากนั้น retry เฉพาะรายการที่ยังขาด เคย error หรือมี catalog-entry fingerprint ไม่ตรงกับ snapshot ปัจจุบัน ระหว่างรันจะ checkpoint หลังจบทุก entry ถ้า process หยุดกลางทางให้รันคำสั่งเดิมซ้ำได้เลย

## Output

```
output/
├── catalog.json            # full catalog array (340 entries)
├── catalog-manifest.json   # bundle URL/hash + extraction counts
├── catalog-enriched.json   # catalog + detail-page metadata (--details)
├── detail-crawl-state.json # per-slug checkpoint + success/error/pending totals
├── completeness-report.json # ผลจาก npm run verify
├── index.html              # local catalog viewer
├── details/                # one JSON per entry (--details)
├── pages/                  # local detail pages 340 หน้า
└── images/                 # thumbnails + page screenshots
```

`output/` เป็น local generated state และถูก `.gitignore` ไว้ ถ้าจะย้ายเครื่องหรือใช้เป็น release artifact ต้อง archive แยกเอง

### Entry Schema (`catalog.json`)

```jsonc
{
  "slug": "specifyapp",
  "name": "Specify",
  "category": "Design & Creative",
  "categorySlug": "design-creative",
  "tags": [],
  "thumbnail": "https://cdn.getdesign.md/catalog/specifyapp/thumb.webp",
  "favicon": "https://cdn.getdesign.md/catalog/specifyapp/favicon.png",
  "website": "https://specifyapp.com/",
  "tagline": "A design token automation platform for design systems...",
  "pages": [
    { "label": "Home", "src": "https://cdn.getdesign.md/catalog/specifyapp/home.webp" },
    { "label": "Pricing", "src": "https://cdn.getdesign.md/catalog/specifyapp/pricing.webp" }
  ],
  "hasDesignMd": false,
  "designMdSlug": null,
  "highDemand": false,
  "orders": 0,
  "priority": 0,
  "addedAt": "2026-04-27",
  "detailUrl": "https://getdesign.md/design-md/specifyapp"
}
```

### Enriched Entry (`--details` เพิ่มเข้ามา)

```jsonc
{
  // ...ทุก field จาก catalog.json +
  "description": "...",
  "ogImage": "https://getdesign.md/api/og/default?v=2",
  "heroImage": "https://cdn.getdesign.md/catalog/specifyapp/home.webp",
  "structuredData": { "@type": "CreativeWork", "..." },
  "crawledAt": "2026-08-02T16:07:07.987Z"
}
```

## Categories

| Category | Slug |
|---|---|
| Productivity & SaaS | `productivity-saas` |
| Developer Tools | `developer-tools` |
| AI & ML | `ai-ml` |
| Backend & DevOps | `backend-devops` |
| Fintech | `fintech` |
| Design & Creative | `design-creative` |
| E-commerce | `ecommerce-retail` |
| Media & Consumer | `media-consumer` |

## Notes

- ใช้ `User-Agent` ที่ระบุตัวตนชัดเจน
- มี rate limiting (default 1s delay) เพื่อไม่ให้กระทบ server
- Bundle URL อาจเปลี่ยนเมื่อเว็บ deploy ใหม่ script จะหา `main-*.js` จาก catalog HTML แล้วบันทึก URL และ SHA-256 ไว้ใน manifest
- Catalog และ detail checkpoints เขียนผ่าน temporary file แล้ว atomic rename เพื่อลดโอกาสได้ JSON ครึ่งไฟล์
- Downloader reuse เฉพาะไฟล์ที่มี JPEG/WebP signature ถูกต้อง ถ้า process หยุดกลางทาง ไฟล์ชั่วคราวจะไม่ถูกนับว่าเสร็จ

## Completeness

current snapshot มี contract ดังนี้:

- `catalog.json`: 340 entries / 340 unique slugs
- `catalog-enriched.json`: 340 entries เรียงตาม catalog และไม่มี `error`
- `details/*.json`: 340 ไฟล์ตรงกับ slug set พอดี
- `pages/*.html`: 340 หน้าและทุกหน้ากลับ `../index.html` ได้
- local images: 340 thumbnails + 944 screenshots จาก `pages` + 123 `heroImage` fallbacks = 1,407 ไฟล์
- image ทุกไฟล์ผ่าน JPEG/WebP signature check

123 entries ไม่มี `pages` ใน bundle แต่ detail page มี `heroImage` อยู่ builder จะใช้ภาพนั้นเป็น Home screenshot แทน จึงไม่แสดงช่องว่างทั้งที่ source มีภาพให้ใช้งาน

ถ้ามี screenshots มากกว่า 1 หน้า detail viewer จะแสดงเป็น tabs และเปิดทีละภาพ รองรับ click, `ArrowLeft`, `ArrowRight`, `Home` และ `End` ตาม semantic tab contract ส่วนรายการที่มีภาพเดียวจะไม่สร้าง tab เพิ่ม

รัน `npm run verify` ก่อนเรียก output ว่าครบ ตัว verifier จะออก non-zero เมื่อมี detail/page/image ขาด มีไฟล์ stale, checkpoint ยัง pending หรือ manifest ไม่ตรงกับ catalog
