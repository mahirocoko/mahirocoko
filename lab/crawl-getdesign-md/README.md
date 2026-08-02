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
node crawl.mjs --details

# ดึง detail แค่ 10 ตัวแรก
node crawl.mjs --details --limit 10

# ปรับ delay ระหว่าง request (default 1000ms)
node crawl.mjs --details --delay 2000

# ดู help
node crawl.mjs --help
```

หรือใช้ npm scripts:

```bash
npm run crawl            # catalog only
npm run crawl:details    # catalog + all details
npm run crawl:sample     # catalog + first 5 details
```

## Output

```
output/
├── catalog.json            # full catalog array (340 entries)
├── catalog-enriched.json   # catalog + detail-page metadata (--details)
└── details/                # one JSON per entry (--details)
    ├── amplemarket.json
    ├── evervault.json
    └── ...
```

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
- Bundle URL อาจเปลี่ยนเมื่อเว็บ deploy ใหม่ — script จะ detect อัตโนมัติจาก `<link rel="modulepreload">`
