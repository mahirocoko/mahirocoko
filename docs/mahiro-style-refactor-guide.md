# เขียนและ refactor โปรเจกต์ให้เป็นแบบ Mahiro

คู่มือจากความชอบ คำแก้ไข และรูปแบบการทำงานที่สะสมจากการทำงานร่วมกัน

อัปเดต: 1 ตุลาคม 2026

## คู่มือนี้ใช้ทำอะไร

ถ้ามีโปรเจกต์หนึ่งแล้วอยากให้ AI refactor จนอ่านแล้วรู้สึกว่า “Mahiro เขียน” ต้องให้ context มากกว่าคำว่า clean code หรือ best practices เพราะสองคำนี้เปิดช่องให้ agent เลือก architecture ตามความเคยชินของตัวเอง

คู่มือนี้อธิบายทั้งรสนิยมการเขียน code, stack ที่พบในงานจริง, ขอบเขตของแต่ละ layer, วิธีจัดไฟล์ และ prompt ที่นำไปใช้ได้เลย ไม่ใช่คำสั่งให้ทุกโปรเจกต์เปลี่ยนเป็น stack เดียวกัน

**แก่นของ Mahiro-style คือ code ที่บอกได้ว่าใครเป็นเจ้าของอะไร อ่านตามงานจริงได้ และไม่สร้างระบบเผื่ออนาคตโดยยังไม่มีเหตุผล**

### ขอบเขตของหลักฐาน

- เรียบเรียงจาก canonical `mahiro-style` skill, preference memory, project memory และบทเรียนจากประวัติการทำงานที่เก็บไว้
- ไม่ใช่การเปิดอ่านทุก commit ของทุก repo ใหม่ทั้งหมด และไม่ใช่ข้อพิสูจน์ว่า code ทุกชิ้นในโปรเจกต์เหล่านั้น Mahiro เป็นคนเขียนเอง
- ความชอบที่ Mahiro บอกหรือแก้ไขตรง ๆ มีน้ำหนักมากกว่าการอนุมานจาก dependency ที่พบ
- Stack ในตารางเป็นสิ่งที่พบในบันทึกของโปรเจกต์ ไม่ใช่ผลตรวจ live checkout ของทุกโปรเจกต์ ณ วันนี้
- ตัวอย่าง code และ directory tree เป็นตัวอย่างที่เรียบเรียงขึ้นเพื่ออธิบาย ไม่ใช่ code ที่คัดมาจาก production และยังไม่ได้ผ่านการ compile ใน target repo
- คู่มือนี้เป็น reference สำหรับคนและ prompt ไม่ใช่เจ้าของกฎอีกชุดที่มาแทน repo docs หรือ canonical skill

## สารบัญ

1. [Mahiro ชอบ code แบบไหน](#1-mahiro-ชอบ-code-แบบไหน)
2. [Stack และ libraries](#2-stack-และ-libraries)
3. [Naming และ TypeScript](#3-naming-และ-typescript)
4. [Structure และ ownership](#4-structure-และ-ownership)
5. [Routes, components และ hooks](#5-routes-components-และ-hooks)
6. [Services, contracts และ errors](#6-services-contracts-และ-errors)
7. [State, forms และ i18n](#7-state-forms-และ-i18n)
8. [UI และ design system](#8-ui-และ-design-system)
9. [วิธี refactor โดยไม่ทำของเดิมพัง](#9-วิธี-refactor-โดยไม่ทำของเดิมพัง)
10. [Context ที่ต้องเตรียม](#10-context-ที่ต้องเตรียม)
11. [Prompt พร้อมใช้](#11-prompt-พร้อมใช้)
12. [Checklist และเกณฑ์ส่งงาน](#12-checklist-และเกณฑ์ส่งงาน)
13. [ที่มาของข้อสรุปและวิธีรักษาคู่มือ](#13-ที่มาของข้อสรุปและวิธีรักษาคู่มือ)

## 1. Mahiro ชอบ code แบบไหน

### 1.1 Repo-reality-first ไม่ใช่ preference-first

ก่อนเปลี่ยนอะไร ต้องดูว่า repo นี้ตัดสินใจเรื่องนั้นไว้แล้วหรือยัง ลำดับพื้นฐานคือ:

1. คำสั่งล่าสุดและขอบเขตที่มนุษย์อนุมัติ ภายใต้ข้อจำกัดของ environment
2. `AGENTS.md` และ instruction ของ target repo
3. Docs เฉพาะเรื่อง เช่น file organization, API, i18n, styling
4. Pattern ที่ใช้ซ้ำจริงใน current code และ consumers
5. Mahiro-style เป็น fallback เมื่อ repo เงียบ ไม่ครบ หรือกำลัง drift

ตัวอย่าง: Mahiro ชอบ no semicolons แต่ถ้า repo ใช้ formatter ที่บังคับ semicolons ก็ใช้ของ repo ไม่แก้ formatter เพื่อให้ได้หน้าตาที่ชอบ

ถ้า docs กับ code ขัดกัน อย่าเลือกตามความสะดวก ต้องหาว่า owner ไหน current และส่วนไหนเป็น migration หรือ historical ถ้ายังตัดสินไม่ได้ ให้รายงานความขัดแย้งก่อนสร้าง implementation ใหม่

ใช้สี่สถานะนี้เมื่อเขียนแผนหรือ docs:

| สถานะ               | ความหมาย                               | ตัวอย่าง                                     |
| ------------------- | -------------------------------------- | -------------------------------------------- |
| Current Reality     | มีหลักฐานจาก target repo               | Repo ใช้ Valibot และมี form pattern อยู่แล้ว |
| Preferred Direction | ความชอบที่ใช้เมื่อ repo ยังไม่ตัดสินใจ | Props ใช้ interface ที่มี `I` prefix         |
| Not Established Yet | ยังไม่มี layer หรือหลักฐานรองรับ       | ยังไม่มี shared error resolver               |
| Adoption Triggers   | เงื่อนไขที่ทำให้ควรนำมาใช้             | หลายหน้าจัดการ error code เดียวกันซ้ำ ๆ      |

### 1.2 Ownership ต้องชัดกว่า abstraction

คำถามที่ควรตอบได้จาก code:

- UI ส่วนนี้อยู่ในความรับผิดชอบของ route, feature หรือ shared primitive?
- Network call มี owner เดียวหรือ endpoint ถูกประกอบในหลาย hook?
- Domain type ไหนเป็นของ API และ type ไหนเป็นของ UI?
- ข้อความนี้ใครแปล และแปลตอนใด?
- State นี้มีอายุเท่าไร ต้องอยู่ข้ามหน้าหรือไม่?
- ถ้าเปลี่ยน contract นี้ ใครบ้างต้องเปลี่ยนตาม?

Mahiro ไม่ได้ชอบแค่ “แยกไฟล์เยอะ” แต่ชอบการแยกที่ช่วยตอบคำถามพวกนี้ การย้าย code 30 บรรทัดไปไว้ใน `helpers.ts` โดยไม่ชัดว่าเป็น helper ของอะไร ไม่ได้ทำให้ code ดีขึ้น

### 1.3 YAGNI และ extraction เมื่อมีเหตุผล

ชอบ concrete typed helpers มากกว่า generic framework ที่รับทุกอย่าง ชอบ code ใกล้เจ้าของ มากกว่าย้ายทุกอย่างไป `shared/` ตั้งแต่เริ่ม

ค่อย extract เมื่อ:

- มีหลาย consumer ที่ต้องใช้ contract เดียวกันจริง
- Logic ซ้ำและเริ่มแก้ไม่พร้อมกัน
- Route หรือ component ไม่สื่อหน้าที่เดิมแล้ว
- มี lifetime, security, runtime หรือ dependency boundary ที่ต้องแยก
- มี public API ของ module ที่ต้องรักษา

ไม่ใช่ข้อห้าม abstraction แต่ abstraction ต้องจ่ายค่าใช้จ่ายของตัวเองได้ อย่าใช้จำนวนบรรทัดหรือ “เผื่อใช้” เป็นเหตุผลเดียว

### 1.4 ชอบความตรงและอ่านง่าย

- ชื่อบอก domain และ job เช่น `EmployeeDirectory`, `useInviteEmployee`, `formatTransactionAmount`
- Props และ payload เป็น contract ที่มองเห็น ไม่ซ่อนด้วย `any`
- Flow สำคัญตามอ่านได้ ไม่ต้องกระโดดผ่าน wrapper หลายชั้น
- Export เฉพาะ public surface ที่มีเหตุผล
- มี section comments ในไฟล์ซับซ้อน แต่ไม่ตกแต่งไฟล์เล็กด้วยพิธีกรรม
- Error, loading, empty และ disabled states เป็นงานจริง ไม่ใช่ของแถม

### 1.5 Preserve สิ่งที่มนุษย์แก้และยอมรับแล้ว

ก่อน rewrite ต้องอ่าน diff และดูสิ่งที่ Mahiro แก้เอง อย่านำ styling หรือ structure ที่ agent เคยทำผิดกลับมาอีก

Style refactor ไม่ได้ให้อำนาจเปลี่ยน business behavior, API, auth, persistence หรือหน้าตาที่รับแล้ว การเปลี่ยนเรื่องเหล่านี้ต้องเป็น scope ที่ระบุแยกกัน

## 2. Stack และ libraries

### 2.1 ไม่มี Mahiro stack เดียวที่ทุก repo ต้องใช้

สิ่งที่เห็นซ้ำมากใน web app คือ **TypeScript + React, server state แยกจาก client state, semantic UI primitives, i18n และ formatter ที่ repo เป็นเจ้าของ**

แต่ framework, package manager, component library, backend และ validation library แตกต่างกันตามงาน อย่าใช้คำว่า “ตามแบบ Mahiro” เป็นเหตุผล migrate Next.js เป็น React Router หรือ Ant Design เป็น Base UI

### 2.2 Stack map จากงานที่ทำร่วมกัน

| ประเภทงาน / ตัวอย่าง                         | Stack ที่พบในบันทึก                                                                                                 | ข้อสรุปที่นำไปใช้ได้                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Web app: Haabiz HRM, PaoPlew                 | React Router Framework, React, TypeScript, Tailwind, TanStack Query, Zustand, Lingui, Biome, pnpm                   | รูปแบบ owner และ data flow ใช้เป็นตัวอย่างได้ แต่ SSR/SPA ต้องดูแต่ละ repo   |
| Team/business app: Nortezh, Eizypay          | Next.js App Router, React, TypeScript, TanStack Query, Zustand, Lingui, Yarn monorepo/Turbo; Nortezh ใช้ Ant Design | Mahiro ทำงานกับ stack เดิมของทีม ไม่ได้บังคับ stack ส่วนตัว                  |
| Landing: Haabiz Landing, Portfolio Astro     | Astro; Haabiz Landing มี React islands, Tailwind/SCSS, Cloudflare และ native Astro i18n                             | งาน content-first ไม่จำเป็นต้องเป็น React app ทั้งหน้า                       |
| Fanarium                                     | React/React Router SSR, TypeScript, Tailwind, Lingui, Base UI/Vaul, GSAP, pnpm                                      | Motion และ primitives ถูกเลือกตาม product ไม่ใช่ dependency ที่ต้องใส่ทุกงาน |
| Component system: Haabiz UI, mahirocoko-ui   | Base UI, Tailwind, semantic tokens, component-owned variants; private UI มี theme compiler                          | แยก primitive, theme, runtime consumer และ generated output ให้ชัด           |
| Owned backend: Haabiz HRM, PaoPlew           | Hono + PostgreSQL, shared contracts; HRM มี Zod contracts                                                           | ใช้เมื่อ repo เลือก backend นี้แล้ว ไม่ใช่กฎให้เปลี่ยน backend ทุกตัว        |
| Admin อีกสาย: Haabiz Management              | React Router SPA, Ant Design, TanStack Query, Zustand, Lingui, Supabase                                             | Supabase ยังเป็นของจริงในบาง repo แม้ HRM/PaoPlew จะเลิกใช้ runtime เดิมแล้ว |
| Desktop: Traymori                            | Tauri + React/Vite, Rust native boundary                                                                            | Web UI กับ native capability มี owner คนละชั้น                               |
| Native: Care                                 | Native iPhone, SwiftData, String Catalog และ Apple-platform behavior                                                | ไม่ยัดโครง React hooks/services ไปใส่ Swift เพียงเพราะเป็น Mahiro-style      |
| Games / spatial: Cozy Hog, Paper Spell Table | React shell + Phaser หรือ imperative PixiJS core; pure TypeScript domain logic                                      | DOM UI, scene runtime และ domain rules แยกหน้าที่กัน                         |
| Developer tools: mahiro-skills, mods         | TypeScript/Bun และ APIs ของ runtime ที่เป็นเจ้าของ                                                                  | Script/tooling ต้องเล็ก ปลอดภัย และ observable ไม่จำเป็นต้องทำ framework     |

ตารางนี้ไม่ pin version สำหรับโปรเจกต์ใหม่ และไม่ได้ยืนยันว่า version ในทุกบันทึกยังล่าสุด ต้องอ่าน manifest, lockfile และ compatibility ก่อนเลือกเวอร์ชันจริง

### 2.3 Library posture: ใช้เพื่อปิดงาน ไม่ใช่สะสม dependency

| งาน                  | เครื่องมือที่พบ                                          | Posture ของ Mahiro                                                                            |
| -------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Server state/cache   | TanStack Query                                           | Query/mutation lifecycle ชัด ไม่เก็บสำเนา server records ใน store อีกชุด                      |
| Shared client state  | Zustand                                                  | ใช้ preferences/shell/shared interaction เมื่อ lifetime สมควร ไม่ใช้แทน state ทุกชนิด         |
| Forms                | React Hook Form                                          | เหมาะกับ form จริงที่มี validation, submit state และหลาย field; input เล็กไม่ต้องยกทั้งระบบมา |
| Validation/contracts | Zod, Valibot                                             | ทั้งสองมีหลักฐานการใช้งาน เลือกของ repo ไม่เปลี่ยนเพื่อความเป็นมาตรฐานส่วนตัว                 |
| i18n ของ React apps  | Lingui                                                   | Descriptor ที่ definition, translation ที่ render; source locale ดูของ repo                   |
| Component behavior   | Base UI/shadcn lineage; Ant Design หรือ Radix ในบาง repo | ใช้ canonical primitive เดิม ไม่เขียน interaction ใหม่เพียงเพื่อได้ class ตามใจ               |
| Variants             | CVA หรือ Tailwind Variants                               | ให้ variant owner คุม presentation axes ไม่กระจาย literal styles ทุก caller                   |
| Class merge          | `cn` + `tailwind-merge` ในระบบที่ใช้                     | ชอบ conventional helper มากกว่า custom deduper แต่ต้องระวัง utility conflicts                 |
| Icons                | Lucide/Iconify และ icon exports ของระบบ                  | ใช้ glyph ครบและชุดที่ repo เลือก แยก brand icons จาก functional icons                        |
| Dates                | date-fns ใน PaoPlew, dayjs ใน Nortezh                    | Shared formatting owner สำคัญกว่าการเลือก date library เดียวทุก repo                          |
| Charts               | Recharts ใน PaoPlew                                      | Legend, tooltip, series colors และ labels ต้องตรง canonical palette                           |
| Formatting           | Biome พบบ่อย; formatter ของ repo อื่นก็ใช้ได้            | ไม่เปลี่ยน tooling ใน style refactor โดยอัตโนมัติ                                             |
| Tests                | Vitest/Node tests/Bun tests ตาม repo                     | ทดสอบ contract และ behavior ไม่ใช่แค่ string presence                                         |

**ยังไม่ established:** ORM เดียวสำหรับทุก backend, state library เดียวสำหรับทุก platform, animation library เดียวสำหรับทุก UI หรือ monorepo tool ที่ต้องใช้ทุกงาน

### 2.4 ถ้าจะเริ่ม web app ใหม่โดย repo ยังไม่มีคำตอบ

ชุดตั้งต้นที่สอดคล้องกับงานส่วนตัวหลายชิ้นคือ React + TypeScript, React Router เมื่อเหมาะกับ routing/rendering, Tailwind กับ semantic primitives, TanStack Query เมื่อมี remote state, Lingui เมื่อมี multilingual UI, Biome และ pnpm

นี่เป็น **ข้อเสนอเริ่มต้น ไม่ใช่คำสั่งติดตั้งทั้งหมด**:

- ไม่มี backend data ก็ยังไม่ต้องมี TanStack Query
- State ไม่แชร์ข้าม owner ก็ยังไม่ต้องมี Zustand
- หน้าอ่าน content เป็นหลัก อาจเลือก Astro
- Form มีแค่ interaction เล็ก ๆ ก็ยังไม่ต้องมี RHF
- Repo มี package manager และ lockfile แล้ว ให้ใช้ชุดเดิม
- Personal project มักชอบ exact dependency versions ไม่ใช้ `latest`, `^`, `~` หรือ wildcard โดยไม่มีเหตุผล

## 3. Naming และ TypeScript

### 3.1 รูปแบบพื้นฐานเมื่อ repo ไม่กำหนดไว้

| สิ่งที่ตั้งชื่อ              | รูปแบบที่ชอบ                        | ตัวอย่าง                                                                |
| ---------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| Source filenames             | kebab-case รวม services, hooks, CSS | `employee-card.tsx`, `use-employee-directory.ts`, `employee-service.ts` |
| Components                   | PascalCase                          | `EmployeeCard`                                                          |
| Functions/helpers/hooks      | camelCase; hook มี `use`            | `formatEmployeeName`, `useEmployeeDirectory`                            |
| Constants                    | UPPER_CASE                          | `EMPLOYEE_STATUS_OPTIONS`, `DEFAULT_PAGE_SIZE`                          |
| Stable object contracts      | `I`-prefixed interface              | `IEmployee`, `IEmployeeCardProps`, `IInviteEmployeeParams`              |
| Unions/utility/derived types | type alias ไม่เติม `I`              | `EmployeeStatus`, `EmployeeId`, `InviteResult`                          |
| Source-root alias            | `@/` เมื่อไม่มี local convention    | `@/components/ui/button`                                                |

ใช้ relative imports ภายใน owner เดียวกันได้ Cross-owner imports ใช้ alias เมื่อ repo รองรับอยู่แล้ว ไม่เพิ่ม alias migration เพียงเพื่อเปลี่ยนหน้าตา import

Generated/external contracts และ framework conventions เป็นข้อยกเว้นที่ต้องรักษา ไม่เปลี่ยน type ของ dependency ให้เป็น `I...` ไปทั้งหมด

### 3.2 Arrow functions และ export

Frontend components/hooks/app-owned helpers มักชอบ arrow functions ส่วน reusable component นิยมประกาศก่อน แล้ว export public surface ที่ท้ายไฟล์

```tsx
interface IEmployeeCardProps {
  name: string;
  roleLabel: string;
}

const EmployeeCard = ({ name, roleLabel }: IEmployeeCardProps) => {
  return (
    <article>
      <h2>{name}</h2>
      <p>{roleLabel}</p>
    </article>
  );
};

export { EmployeeCard, type IEmployeeCardProps };
```

Utils, constants และ hooks สามารถ inline export ได้ Framework-required exports ก็รักษาไว้ เช่น route loader/action/default entrypoint ไม่ต้องดัดเพื่อให้เหมือน component file

### 3.3 Formatting

Fallback คือ 2 spaces, single quotes, no semicolons และ trailing commas ตาม formatter รองรับ แต่ formatter ของ repo มีอำนาจตัดสินสุดท้าย

ใช้ `import type` กับ type-only imports เมื่อ toolchain รองรับ ไม่จัด import order ด้วยมือแข่งกับ formatter และไม่ format ทั้ง repo ระหว่างงานเฉพาะจุด

### 3.4 Types ควรอยู่ที่ไหน

- Props ที่ใช้เฉพาะ component เดียว อยู่ข้าง component ได้
- Request/response ที่มี service เดียวเป็นเจ้าของ อยู่ข้าง service ได้
- หลายไฟล์ใน module แชร์ shape เดียวกัน ค่อยย้ายไป owner-local `types.ts`
- หลาย owners แชร์ domain/API contract ค่อย promote เป็น domain `types/` หรือ `contracts/` ของ repo
- ถ้า constant runtime เป็นเจ้าของรายการค่า ให้ derive union จากรายการนั้น ไม่ประกาศรายการซ้ำ

```ts
export const EMPLOYEE_STATUSES = ["active", "inactive"] as const;

export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

export interface IEmployee {
  id: string;
  name: string;
  status: EmployeeStatus;
}
```

ตัวอย่างนี้รวมไว้เพื่ออ่านง่าย ถ้า repo แยก constants/types ให้แยกตาม owner เดิม ไม่จำเป็นต้องสร้างสองไฟล์สำหรับทุก constant

เมื่อ CVA เป็นเจ้าของ variant axes ให้ derive props จาก `VariantProps` แทน copy literal unions อีกชุด Interface props ยังใช้ `I` ได้ แต่ derived type aliases ไม่ต้องมี prefix

## 4. Structure และ ownership

### 4.1 เริ่มจากโครงจริง ไม่ใช่ directory template

Mahiro มีทั้ง responsibility-first apps, domain/module folders, package workspaces และ standalone tools ไม่ได้มีหลักฐานว่าต้องใช้ Feature-Sliced Design, Clean Architecture, DDD หรือ hexagonal architecture กับทุกงาน

การ organize ที่เข้าท่าต้องทำให้ owner ชัดขึ้น โดยไม่เพิ่ม layer ที่ยังไม่มีหน้าที่

### 4.2 ตัวอย่าง app ที่โตพอแล้ว

โครงต่อไปนี้เป็นตัวอย่างสำหรับ app ที่มีหลาย domains ไม่ใช่รายการโฟลเดอร์ที่ต้องสร้างให้ครบ:

```text
app/
  routes/                       # framework entrypoints และ route orchestration
  components/
    ui/                         # canonical domain-neutral primitives
    layouts/                    # app shell และ layouts
    modules/
      employees/                # employee-owned UI
        employee-directory.tsx
        employee-card.tsx
        invite-employee-form.tsx
  hooks/
    fetchers/
      use-employee-directory.ts
    mutations/
      use-invite-employee.ts
  services/
    employee-service.ts         # เมื่อ repo มี service layer
  libs/
    api-client.ts               # existing transport integration
  stores/
    setting/                    # shared client preferences
  providers/
    query-provider.tsx
    page-provider.tsx
  constants/
    employees/
      employee-status.ts
      employee-query-keys.ts
      index.ts
  types/
    employees/
      employee.ts
      index.ts
  utils/
    format/
      date.ts
  locales/
  styles/

contracts/                      # เฉพาะเมื่อมี shared runtime API schemas จริง
server/                         # เฉพาะเมื่อ repo เป็นเจ้าของ backend
  routes/
  policies/
  db/
```

`app/` และ `src/` เป็นทางเลือกตาม framework/repo ไม่ใช่ต้องใช้ทั้งคู่ Services กับ `libs/backend/` ก็ไม่ควรสร้างให้เป็น transport owners ซ้ำกัน

### 4.3 Feature เล็กอยู่ใกล้เจ้าของก่อน

```text
components/modules/employees/
  employee-directory.tsx
  employee-card.tsx
```

ถ้ามี local filter helper เพียงหนึ่งตัว อาจอยู่ใน implementation เดิมได้ พอโตและมีหลายไฟล์ใช้ร่วมกันจึงค่อยเพิ่ม owner-local `utils/`, `types/`, `constants/`, `styles/` ตามเหตุผลจริง

เมื่อ constants/types โตเกิน surface เล็ก ๆ Mahiro ชอบ focused files ใน folders และ `index.ts` barrel ที่มี public job ชัดเจน แต่ไม่ต้องเพิ่ม barrel ทุก directory เพื่อทำ imports ให้สั้น

### 4.4 Component-library domain ใช้อีกขนาดหนึ่ง

```text
packages/ui/src/button/
  button.tsx
  constants.ts
  types.ts
  variants.ts
  styles.css                    # optional เมื่อ CSS มีงานจริง
  index.ts
```

ชอบ named implementation เช่น `button.tsx` มากกว่า `index.tsx` ที่ทำให้ editor tabs/stack traces อ่านยาก Support files ภายใน domain ใช้ชื่อสั้นได้ ไม่ต้องเป็น `button-constants.ts`, `button-types.ts` ทุกไฟล์

นี่ไม่ขัดกับการใช้ `constants/` และ `types/` folders ใน app เพราะ ownership scale ต่างกัน ถ้า component support surface โตจริงก็ขยายตามเหตุผล ไม่ต้องยึด template

### 4.5 Shared ต้อง earned

การ promote จาก feature ไป shared ควรถาม:

1. มี consumer อื่นใช้จริงหรือยัง?
2. สิ่งที่แชร์คือ contract เดียวกัน หรือแค่หน้าตาคล้าย?
3. API ที่ extract มี domain-neutral meaning จริงหรือไม่?
4. เปลี่ยนแล้วจะบังคับ unrelated domains ให้เปลี่ยนตามหรือไม่?
5. แค่ wrapper ส่ง props ผ่านไปเฉย ๆ หรือช่วยรักษา behavior/semantics จริง?

จำนวน consumer เป็นสัญญาณ ไม่ใช่สูตรตายตัว งานที่มี runtime/security boundary อาจต้องแยกแม้มี consumer เดียว

## 5. Routes, components และ hooks

### 5.1 Route เป็น entrypoint ไม่จำเป็นต้องว่าง

Route ควรทำให้เห็น page outline, params/search state, auth/loader/action ตาม framework และ composition ของ sections

เมื่อ route โตจนอ่านไม่เห็นงานของหน้า ค่อย extract domain sections หรือ reusable behavior แต่ไม่ย้ายทุกอย่างไป `useEmployeePage()` เพื่อให้ route เหลือสองบรรทัด

Route-only selection, redirects หรือ modal state เล็ก ๆ อยู่ใน route ได้ ถ้ายังมี route เดียวเป็น owner

### 5.2 Presentational กับ domain-aware component

**Presentational:** รับ shaped props, render semantics/layout/slots ไม่สร้าง endpoint ไม่จัด auth และไม่รู้ business transport

**Domain-aware:** รู้ domain vocabulary ได้ ใช้ domain hooks ได้ และประกอบ loading/empty/error UI ของ section ได้

```text
EmployeeDirectory route
  -> EmployeeDirectory section      # domain-aware
     -> useEmployeeDirectory        # server-state orchestration
     -> EmployeeCard                # presentation
     -> canonical Button/Input      # design-system primitives
```

Props เยอะไม่ใช่ smell อัตโนมัติ ถ้ายังสื่อ contract เดียวชัดเจน อย่ารวมทุกอย่างเป็น `config`, `data` หรือ `context` ก้อนเดียวเพียงเพื่อลดจำนวน props

### 5.3 Hooks มีงาน ไม่ใช่ที่ซ่อน code

| Hook        | รับผิดชอบ                                                                 |
| ----------- | ------------------------------------------------------------------------- |
| Fetcher     | Query key, query function, enabled/cancellation/cache options, read state |
| Mutation    | Write operation, invalidation, optimistic update ตาม repo, mutation state |
| Interaction | Reusable disclosure, selection, keyboard หรือ drag behavior               |
| Adapter     | Library/framework glue ที่ซ้ำและมี boundary ชัด                           |

ไม่ควรรวม fetch, modal, navigate, toast, unrelated setters และ formatted strings เป็น `useEverything()`

ตัวอย่างเมื่อ repo ใช้ service และ TanStack Query อยู่แล้ว:

```ts
export const useEmployeeDirectory = () => {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.list(),
    queryFn: ({ signal }) => EmployeeService.list({ signal }),
  });
};
```

ตัวอย่างนี้ย่อ imports และ definition ของ query keys ไว้ สิ่งสำคัญคือ hook เป็น owner ของ query mechanics และ service เป็น owner ของ transport ไม่ใช่ API signature ที่ทุก repo ต้อง copy

### 5.4 ภายใน React file

สำหรับไฟล์ซับซ้อน ลำดับที่มักช่วยอ่านคือ refs → state → context/store/query/mutation → derived values → callbacks/events → forms/schema → effects → render

ใช้ section comments ตาม snippet ของ repo เช่น `_State`, `_Query`, `_Event`, `_Effect` ถ้ามีอยู่แล้ว ไม่ต้องเปลี่ยนชื่อทุกหัวข้อให้ตรงเอกสารนี้

อย่าเพิ่ม `useMemo`/`useCallback` ทุก expression เพื่อให้ดู advanced ต้องมี identity/performance contract หรือหลักฐานที่รองรับ และต้องรักษา Rules of Hooks

## 6. Services, contracts และ errors

### 6.1 Data flow มีได้มากกว่าหนึ่งรูปแบบ

รูปแบบที่พบใน REST apps:

```text
Route / domain component
  -> fetcher or mutation hook
     -> domain service
        -> existing API client / BaseService / Axios / fetch wrapper
           -> backend
```

Repo ที่ใช้ backend SDK โดยตรงใน module-local hooks อาจยังไม่ต้องมี service เพิ่ม Framework loader/action ก็อาจเป็น data owner ตามการออกแบบของ repo อย่าห่อ SDK หนึ่งบรรทัดด้วย service class ใหม่เพียงเพื่อให้ตรง diagram

### 6.2 Service owner

Service หรือ transport owner ควรถือ endpoint, request construction, response mapping/parsing และ failure normalization ที่เกิดซ้ำ

Hooks ไม่ควรสร้าง URL/auth headers อีกชุด Components ไม่ควร parse response envelope ซ้ำทุกหน้า

บาง repo ใช้ static class methods เช่น `EmployeeService.list()` บาง repo ใช้ explicit module exports ทั้งสองเข้ากับ Mahiro-style ได้ ไม่มีเหตุผลแปลง class เป็น functions หรือกลับกันทั้ง repo ถ้า local convention ชัดอยู่แล้ว

### 6.3 Type safety ไม่เท่ากับ runtime validation

`response as IEmployee[]` ไม่ได้พิสูจน์ว่า server ส่ง shape นั้นจริง ถ้า repo มี schemas/shared contracts ให้ใช้ owner นั้น ไม่ copy schema อีกชุดเพื่อตอบโจทย์ frontend เพียงหน้าเดียว

แต่ก็ไม่จำเป็นต้องสร้าง schema framework สำหรับข้อมูลภายในเล็ก ๆ ที่ไม่มี runtime boundary ความเข้มของ validation ควรตามความเสี่ยง

### 6.4 Error flow

แนวทางสำหรับ error ที่ใช้ซ้ำ:

```text
Transport failure
  -> stable app-owned error identity/code
     -> shared resolver + descriptor map
        -> render owner เลือก inline, toast หรือ route fallback
           -> translate ตาม locale ปัจจุบัน
```

- อย่าเอา technical provider error หรือ secret-bearing response ไปแสดงตรง ๆ
- อย่า `catch` แล้วคืน empty array จนแยก failure จาก empty state ไม่ได้
- อย่า reimplement switch ของ error code เดียวกันทุก mutation
- Unknown errors ต้องมี safe fallback
- Final UI เป็นของ render owner ไม่ใช่ service ที่ trigger toast เองทุกครั้ง
- ถ้า repo ยังไม่มี shared resolver และ failure เป็น one-off ให้จัดการใกล้ owner ก่อน ไม่สร้าง error hierarchy ใหญ่ทันที

Auth failure ต้องรักษา product contract เช่น wrong password ไม่ควรถูก global unauthorized handler ทำให้ reload วนหรือซ่อน inline error

### 6.5 Browser/server boundary

ไฟล์ที่ route ฝั่ง browser import ตอน runtime ถือเป็น client dependency แม้ชื่อหรือเนื้อหาส่วนใหญ่ดูเป็น server utility

แยก browser-safe helpers ออกจาก `node:crypto`, `Buffer` หรือ Node-only globals อย่างชัดเจน Build ผ่านไม่ได้แปลว่า hydration ผ่าน ต้องทดสอบ consumer จริงถ้า refactor แตะ boundary นี้

## 7. State, forms และ i18n

### 7.1 เลือก state owner ตาม source และ lifetime

| State                                                 | Owner ที่เหมาะตาม pattern ที่พบ                                            |
| ----------------------------------------------------- | -------------------------------------------------------------------------- |
| Hover, disclosure, input interaction ของ owner เดียว  | local component state                                                      |
| Filters/search/page ที่ต้องแชร์ URL หรือ Back/Forward | URL/search params ตาม router contract                                      |
| Server records, loading, mutation, cache              | TanStack Query หรือ framework data layer ของ repo                          |
| Theme/language/shared shell/preferences               | Zustand/store/provider เมื่อมี lifetime รองรับ                             |
| Form values/errors/dirty/submit state                 | Form owner; RHF ใน repo ที่ใช้อยู่                                         |
| Auth session/security                                 | Server/runtime auth owner; frontend state เป็น projection ไม่ใช่ authority |

ไม่คัด server records จาก query cache ไป store อีกชุดเพียงเพื่อให้ทุก component อ่านง่าย และไม่ persist ทุก field ของ store อัตโนมัติ

ถ้ามี SSR ต้องรักษา provider placement, hydration และ persistence format อย่าเปลี่ยน cookie-based store เป็น localStorage โดยมองว่าเป็น implementation detail

### 7.2 Forms

Form ที่มีหลาย meaningful fields, validation, translated errors และ submit state ควรใช้ pattern ของ repo เช่น RHF + Valibot หรือ RHF กับ schema ที่ repo เลือก

สิ่งที่ต้องรักษาหรือทดสอบ:

- Default values และเวลา reset เมื่อเปลี่ยน entity
- Dirty/touched state และ validation timing
- Submit pending, duplicate-submit protection และ disabled actions
- Inline error และ success feedback
- Cancel/close กับ unsaved changes ตาม product
- Focus ไม่หลุดตอน remote data update
- Field labels, accessible description และ error association

ถ้าใช้ custom validation UI ต้องดู `noValidate` และ browser validation interaction ให้ตรงของเดิม ไม่ใส่ตาม template โดยไม่ตรวจ

### 7.3 Translation-safe constants

สำหรับ repo ที่ใช้ Lingui หลักคือ **descriptor ตอน definition, translation ตอน render**

```ts
import { msg } from "@lingui/core/macro";

export const EMPLOYEE_STATUS_OPTIONS = [
  { value: "active", label: msg`ทำงานอยู่` },
  { value: "inactive", label: msg`ไม่ได้ทำงานอยู่` },
] as const;
```

```tsx
import { useLingui } from "@lingui/react/macro";

const EmployeeStatusOptions = () => {
  const { t } = useLingui();

  return (
    <>
      {EMPLOYEE_STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {t(option.label)}
        </option>
      ))}
    </>
  );
};
```

ตัวอย่างนี้สมมุติ source locale เป็นไทย ต้องใช้ macro imports/source locale ตาม version และ convention ของ target repo ถ้า source locale เป็น English ให้รักษาของเดิม

- `msg` เหมาะกับ extracted shared copy/config
- `t` หรือ `i18n._` อยู่กับ live translation context ที่ render
- `<Trans>` เหมาะกับ rich text/JSX composition
- อย่า translate ครั้งเดียวตอน module load แล้วเก็บ string ที่ไม่เปลี่ยนตอนสลับภาษา
- อย่าแก้ user-facing strings เป็น plain constants จน extraction หาไม่เจอ
- Single-language หรือ Astro native-i18n repo ไม่ต้อง migrate มา Lingui โดยอัตโนมัติ

### 7.4 ภาษาไทยและ units ต้องตรงความจริง

Thai-facing UI ควรใช้ไทยธรรมชาติ Technical terms คง English ได้ถ้าอ่านชัดกว่า ไม่แปลศัพท์ทุกคำ และไม่ใช้ literal labels ที่ไม่เข้ากับ product

Labels/counters/validation ต้องใช้ unit เดียวกับ persistence เช่น UTF-8 bytes ไม่ใช่บอกเป็นตัวอักษรแต่ server จำกัด bytes ภาษาไทยทำให้ผิดพลาดได้ง่าย

## 8. UI และ design system

### 8.1 Style refactor ไม่ใช่ visual redesign

Default คือรักษา geometry, spacing, content, interaction, responsive anatomy, typography และ assets ที่รับไว้แล้ว ถ้าอยากปรับหน้าตาให้ระบุเป็น scope ใหม่พร้อม reference และ human gate

Mahiro มี personal preference ไปทาง Mac product aesthetic ที่ compact/calm/tactile แต่ไม่ใช่ permission ให้ทำทุกเว็บเป็น macOS, dark-only หรือ glassmorphism โดยอัตโนมัติ งานทีม/ลูกค้าต้องยึด product direction ของงานนั้น

### 8.2 ใช้ primitives จริง

- มี canonical `Button` ก็ใช้ component ไม่ทำ `<div>` clickable หรือใช้แค่ button style helper
- มี Input/Select/Dialog ที่เป็น owner ของ behavior ก็ใช้ API ของตัวนั้น
- Caller classes ควรเน้น layout/spacing ถ้า primitive ถือ shell paint อยู่แล้ว
- Missing reusable state ค่อยเพิ่ม semantic token/variant ใน owner ไม่ hardcode parallel palette
- Local native elements ใช้ได้เมื่อเป็น route composition ที่ตั้งใจ ไม่ต้องเอาทุก tag ไปห่อ primitive

ชื่อ class อย่าง `btn-primary` หรือ `ui-input` ไม่พิสูจน์ provenance ต้องมี current rule/variant จริง และ consumer ต้องแสดง computed paint/state ที่ตั้งใจ

### 8.3 Variants และ CSS

Finite presentation axes เช่น size, tone, appearance เหมาะกับ CVA/Tailwind Variants ตาม repo ใช้ `variants.ts` ใน component domains เมื่อ convention รองรับ

Readable Tailwind/CVA เป็นทิศทางที่ชอบ แต่ CSS ยังเหมาะกับ global contracts, keyframes หรือ selectors ที่ยัดเป็น arbitrary variants แล้วอ่านยาก ไม่ต้องย้าย CSS ทุกบรรทัดเพื่อลดตัวเลขไฟล์

ถ้าใช้ `tailwind-merge` ระวัง custom font-size names ที่ชน semantic colors เช่น `text-body` อาจถูก merge ทิ้ง ใช้ collision-safe owner อย่าง `type-*` เมื่อระบบนั้นรองรับ และตรวจ computed font size

### 8.4 UI correctness ที่ Mahiro สนใจจริง

- Contrast และ click affordance อ่านออก ไม่ใช่แค่ token name ดูถูกต้อง
- Control heights อยู่ใน hierarchy เดียวกัน ยกเว้น role ที่มีเหตุผลให้ compact
- Row/overlay ไม่ชนกัน: leading icon, flexible label, fixed metadata และ trailing affordance มี ownership ชัด
- ไม่เพิ่ม chevron ซ้ำกับ primitive ที่ inject มาแล้ว
- Base UI Select ต้องแสดง human-facing selected label ไม่ใช่ raw slug/ID
- Open/closed/selected/disabled state ต้อง render จริง ไม่ใช่แค่ data attribute อยู่ใน source
- Icon ใช้ full geometry ไม่ copy path บางส่วนจนรูปเสีย
- Heading ไม่ใหญ่หรือ tracking ติดกันโดยอัตโนมัติ Routine UI ไม่ bold ทุก role
- ภาษาไทยมีที่ให้ upper/lower glyphs และ line wraps
- Chart series, legend และ tooltip ใช้ canonical palette mapping เดียวกัน
- A → B → A ต้องคืน baseline จริง ไม่มี stale CSS variables หรือ persisted state
- Light/Dark ต้องตรวจ resolved roles ไม่ใช่เชื่อว่าชื่อ token เดียวกันแปลว่าลำดับ luminance เดียวกัน

Spacing เป็นสิ่งที่ Mahiro ตรวจด้วยตาจริง Utility class หรือ reviewer PASS ไม่ใช่ visual acceptance

## 9. วิธี refactor โดยไม่ทำของเดิมพัง

### 9.1 แยกงานสี่ชนิด

| งาน                 | ตัวอย่าง                                                    | Default ของคำขอ style refactor  |
| ------------------- | ----------------------------------------------------------- | ------------------------------- |
| Code-shape refactor | naming, types, file ownership, repeated helpers             | อยู่ใน scope ที่ระบุ            |
| Behavior fix        | เปลี่ยน calculations, auth, invalidation, validation timing | ขอ scope แยก เว้นแต่ระบุไว้แล้ว |
| Stack migration     | เปลี่ยน router, UI library, backend, package manager        | ไม่อนุมัติอัตโนมัติ             |
| Visual redesign     | เปลี่ยน layouts, typography, paint, assets, navigation      | ไม่อนุมัติอัตโนมัติ             |

พบ defect ระหว่าง refactor ให้รายงานและเสนอแก้แยก ไม่ทำให้ semantic changes ซ่อนอยู่ในคำว่า cleanup

### 9.2 ลำดับทำงานที่เหมาะ

1. **Inspect:** ตรวจ cwd/status, docs, formatter, scripts และ nearest accepted examples
2. **Map:** ระบุ owners/consumers ของ surface ที่กำลังจะย้าย
3. **Baseline:** เก็บ behavior/public API/visual contract ที่ห้ามเปลี่ยน และ checks ก่อนแก้
4. **Plan:** เสนอ file moves กับเหตุผล และแยก Preferred Direction ออกจาก Current Reality
5. **Refactor:** ทำทีละ domain/slice ไม่ rewrite ทุก layer พร้อมกัน
6. **Format:** ใช้ repo-native formatter เฉพาะ touched files
7. **Verify:** ใช้ focused checks ก่อน เพิ่ม matrix/build/runtime ตาม blast radius
8. **Propagate:** ตรวจ imports, barrels, tests, docs, generated outputs และ real consumers ที่ได้รับผล
9. **Handoff:** รายงานสิ่งที่เปลี่ยน สิ่งที่รักษา ผล checks และสิ่งที่ยังไม่พิสูจน์

สำหรับ implementation ใช้ loop สั้น: concrete anchor → falsifiable hypothesis → cheapest disconfirming check → smallest grounded edit → narrow useful validation ถ้าสมมุติฐานไม่ผ่านค่อยขยายการค้นหา

### 9.3 เกณฑ์ตรวจตามความเสี่ยง

- Rename/file moves: import resolution, casing, public exports และ focused tests
- Extract calculation/helper: boundary values และ output parity
- State/query refactor: loading/error/empty, cache invalidation, filters, navigation และ persistence
- UI component extraction: DOM semantics, keyboard/focus, responsive layout และ visual parity
- Server/client split: built runtime และ browser hydration ของ consumer
- Component registry/theme: canonical owner → runtime → export → generated payload → installed consumer
- Multi-process protocol: producer/consumer envelopes, success/failure, reload processes และ bounded end-to-end replay

Writer tests เป็น regression support ไม่ใช่ independent acceptance เพียงอย่างเดียว ต้องทดสอบจาก human/repo contract และลอง counterexample ที่ implementation ใหม่อาจพลาด

ไม่จำเป็นต้องเปิด reviewer ทุกครั้ง ถ้าต้องมี rendered browser QA ตามขอบเขตงาน ให้ใช้ fresh role-separated QA session ไม่ให้ writer grade ตัวเอง และตรวจ console ทั้ง load กับหลัง interaction

### 9.4 Workflow ปัจจุบันของ Mahiro

ณ 1 ตุลาคม 2026 ใช้ **Main-first + Gemini-on-demand**:

- Main ทำ clear small-to-medium work ที่เข้าใจ context อยู่แล้ว
- Agy/Gemini worker ทำ bounded separable work หรือ research เมื่อส่งต่อแล้วคุ้มจริง
- Required independent browser QA อยู่ใน fresh separate Gemini session
- พัก Grok จาก default เพราะ usage ไม่ใช่ข้อสรุปว่าคุณภาพด้อยกว่า
- Repo/task-specific owners ยังมีอำนาจเหนือ routing ทั่วไป

เรื่อง executor ไม่ใช่ส่วนหนึ่งของ coding style ที่ target repo ต้องติดตั้ง เป็นเพียง workflow ของผู้ทำงาน Prompt refactor ควร portable ข้าม executors

## 10. Context ที่ต้องเตรียม

### 10.1 Context ขั้นต่ำที่มีประโยชน์จริง

ส่งสิ่งเหล่านี้แทนการ dump ทั้ง repo:

1. Target path/domain และ branch/status ที่เกี่ยวข้อง
2. เป้าหมายที่สังเกตได้ เช่น route compose ง่ายขึ้น, transport ไม่ซ้ำ, constants ยัง extract i18n ได้
3. `AGENTS.md` และ docs เฉพาะงาน
4. Manifest/lockfile/tooling config ที่ยืนยัน stack และ commands โดยไม่ส่ง secrets
5. ไฟล์ตัวอย่างที่คุณยอมรับ 2–3 ชิ้น พร้อมเหตุผลที่ชอบ
6. Public consumers และ contract ที่ห้ามเปลี่ยน
7. Validation commands และ known pre-existing failures
8. Scope ของ visual/behavior changes และ commit/push permission

ตัวอย่างที่ยอมรับมีน้ำหนักมากกว่ากฎทั่วไป เช่น “ใช้ employee form นี้เป็นตัวอย่างเรื่อง props, sections และ submit flow แต่ไม่ copy business logic”

ถ้า executor เปิดไฟล์เองได้ ให้ชี้ไฟล์และหน้าที่ ไม่จำเป็นต้อง paste ทุกบรรทัด ถ้าอยู่ใน chat ที่ไม่มี filesystem ค่อยแนบเนื้อหาที่เกี่ยวข้อง

### 10.2 Context packet template

```markdown
# Refactor context

## Objective

- ทำให้ [domain/surface] อ่านและดูแลแบบ Mahiro-style
- Observable outcome: [ข้อที่ตรวจได้]

## Current Reality

- Framework/rendering mode: [...]
- Package manager/lockfile: [...]
- UI/data/form/i18n/error owners: [...]
- Formatter และ checks: [...]

## Accepted examples

- [file A]: ใช้เป็นตัวอย่างของ [...]
- [file B]: ใช้เป็นตัวอย่างของ [...]

## In scope

- [paths/symbols]
- [allowed rename/extraction/type changes]

## Protected contracts

- Public exports / route URLs / API payloads: [...]
- Business behavior / auth / persistence: [...]
- Visual baseline / interaction / responsive states: [...]
- User-authored changes to preserve: [...]

## Preferred Direction

- Arrow-function frontend components/hooks/helpers
- I-prefixed object interfaces; unprefixed union/derived type aliases
- Kebab-case filenames, UPPER_CASE constants
- Owner-local code; extract only when ownership/reuse warrants it
- Repo formatter wins

## Non-goals

- No stack/package-manager/backend migration
- No visual redesign or product-semantic changes
- No speculative shared layer
- No dependency changes, commits or pushes unless explicitly approved

## Verification

- Baseline checks: [...]
- Defect-shaped regressions and behavior parity: [...]
- Runtime/browser proof if needed: [...]
- Existing failures/exceptions: [...]

## Output

- Owner map and small plan before edits
- Implementation, formatting and relevant verification after approval
- Final summary with changes, preserved contracts, checks and limitations
```

### 10.3 วางกฎใน repo อย่างไร

- `AGENTS.md`: entrypoint สั้น บอก source-of-truth order, boundaries และ commands
- `docs/code-style.md`: syntax/naming/export rules ที่ทีมเลือกแล้ว
- `docs/file-organization.md`: current owners และเงื่อนไข extraction
- `docs/api-data-fetching.md`: transport/query/mutation/error/state boundary
- `docs/i18n-guidelines.md`: source locale, descriptor/render flow และ commands
- `docs/refactor-plan.md`: scoped migration ชั่วคราว ถ้างานใหญ่พอ

อย่าสร้างครบทุกไฟล์เพียงเพราะมี template ถ้า repo มี owners เดิม ให้ปรับ owner เดิมและทำ docs ให้พอดีกับขนาดงาน `mahiro-docs-rules-init` ช่วย bootstrap ได้เมื่อคุณอนุมัติ scope นั้น

## 11. Prompt พร้อมใช้

### 11.1 Prompt สั้นสำหรับ repo ที่มี docs และ skill แล้ว

```text
Refactor [target paths/domain] ให้เป็น Mahiro-style โดยยึด AGENTS.md,
repo-local docs และ accepted examples ก่อน แล้วใช้ mahiro-style เป็น fallback

เป้าหมาย: [observable outcome]
ตัวอย่างที่ชอบ: [files + สิ่งที่ให้เลียนแบบ]

รักษา business behavior, public API, auth/persistence, i18n และ visual baseline
ไม่เปลี่ยน stack/dependencies/package manager และไม่เพิ่ม shared abstractions
โดยไม่มี ownership/reuse trigger

เริ่มจาก bounded owner map และแผน file changes ก่อน ยังไม่แก้ code
แยก Current Reality / Preferred Direction / Not Established Yet / Adoption Triggers
เมื่อฉันอนุมัติ ค่อย refactor ทีละ slice, format และ verify ตาม repo
ไม่ commit/push จนกว่าฉันจะสั่ง
```

### 11.2 Full prompt สำหรับ executor ที่ไม่รู้จัก Mahiro มาก่อน

```text
You are refactoring an existing project to match Mahiro's coding preferences.
This is a bounded behavior-preserving refactor, not a rewrite or stack migration.

Target:
- Repository: [path]
- Scope: [paths, domain, symbols]
- Desired outcome: [observable improvement]
- Accepted examples: [2-3 files and what each demonstrates]

Authority:
1. Follow the user's explicit scope and repository instructions.
2. Read AGENTS.md and relevant local docs before editing.
3. Preserve repeated current repository patterns and canonical owners.
4. Apply the preferences below only where local evidence is silent or drifting.
5. If current owners conflict, report the conflict; do not invent a third owner.

Mahiro preferences:
- Keep ownership explicit and code close to its real owner.
- Prefer small concrete typed helpers; delay abstraction until there is real reuse,
  repeated maintenance friction, or a runtime/security/ownership boundary.
- Prefer kebab-case source filenames, including hooks, services and CSS.
- Prefer arrow-function frontend components/hooks/app-owned helpers where compatible.
- Define reusable components locally and export their public surface at the bottom.
  Inline exports for utilities/constants/hooks and framework-required exports are fine.
- Prefer I-prefixed interfaces for app-owned stable object contracts and props.
  Keep type aliases unprefixed for unions, mapped/utility/derived types.
  Preserve generated/external conventions and derive variants from their real owner.
- Use UPPER_CASE constants. Keep local types/constants local while ownership is small;
  use focused constants/types folders and deliberate barrels when they genuinely grow.
- Follow the existing source-root alias; @/ is only the repo-silent fallback.
- Follow the repository formatter. Repo-silent fallback: single quotes, no semicolons,
  2 spaces. Do not change formatter configuration to force personal taste.
- Routes should show page composition and route-owned orchestration.
  Do not hide an entire page in a useEverything/usePage hook just to shorten the route.
- Hooks own reusable behavior or query/mutation orchestration, not duplicated transport.
- Preserve the existing service/API/SDK boundary; do not add a ceremonial service layer.
- Keep server state in the established query/framework cache and client preferences
  in local state/store according to lifetime. Do not duplicate remote entities in stores.
- Keep form defaults/reset/dirty/validation/focus/submit behavior intact.
- Preserve i18n extraction and live locale changes. In Lingui projects, extracted
  shared copy uses descriptors and the render owner performs final translation.
- Reuse actual canonical UI primitives/tokens/variants, not handwritten lookalikes.
- Preserve errors as observable failures; do not turn failures into fake empty/success data.
- Preserve browser/server dependency boundaries and SSR hydration behavior.

Protected contracts:
- [public APIs, routes, endpoint payloads, auth, storage/persistence, calculations]
- [accepted visual/DOM/interaction/responsive baseline]
- [manual user edits and generated ownership boundaries]

Non-goals:
- No framework, backend, package-manager or UI-library migration.
- No dependency additions/upgrades without explicit approval.
- No redesign, copy/product-semantic changes or new capabilities.
- No speculative shared packages, generic frameworks or unrelated cleanup.
- No commits, pushes, deployments or destructive operations without approval.

Process:
1. Inspect status, relevant instructions, exact owners, consumers and existing checks.
2. Present a bounded owner map and proposed changes. Label Current Reality,
   Preferred Direction, Not Established Yet and Adoption Triggers where useful.
3. Wait for approval before writing. Once approved, complete the agreed scope.
4. Refactor one coherent slice at a time, preserving contracts and user edits.
5. Run the repository-native formatter on touched files, then focused tests/type checks.
   Expand validation only for actual blast radius, failures or explicit requirements.
6. Check import casing, public exports, docs and generated consumers for drift.
7. Use real runtime/browser evidence when the changed contract requires it.
   Writer self-checks are not independent acceptance or human visual approval.

Return:
- Files changed and the ownership reason for each meaningful extraction.
- Preserved contracts and any proposed out-of-scope issues, kept separate.
- Exact checks with passed/failed/not-run status and pre-existing failure evidence.
- Remaining risks and the smallest next action.
```

ถ้าต้องการอนุมัติให้ทำทันที เปลี่ยนข้อ 3 เป็น “You may implement the bounded plan immediately; pause only for material ambiguity or actions outside this scope.” อย่าเหลือข้อความทั้งรออนุมัติและทำทันทีไว้ใน prompt เดียวกัน

### 11.3 Prompt audit-only ก่อนตัดสินใจ refactor

```text
Review [scope] for Mahiro-style drift. Read AGENTS.md/local patterns first and
explicitly load mahiro-style if available. Do not modify files.

For each finding, report:
- Exact owner/location and current behavior
- Repository rule or explicit Mahiro preference supporting the finding
- Correctness/ownership blocker versus non-blocking preferred shape
- Smallest useful change and a cheap disconfirming check
- Whether extraction is earned or premature

Do not call a different stack, formatter, class/function style or directory tree
a defect solely because another Mahiro project uses it.
End with a ranked bounded refactor plan, not a whole-repository rewrite proposal.
```

### 11.4 Prompt แยก React feature ที่โตแล้ว

```text
Refactor [feature] within [approved paths]. Keep route orchestration and page outline
visible. Extract domain UI, shared types/constants, hooks and pure helpers only where
their owners become clearer. Keep single-owner logic inline when extraction adds no value.

Use [accepted component/hook/service files] as local examples.
Preserve props/public exports, query keys, mutation invalidation, forms, error surfaces,
translations, navigation and rendered layout. Do not create a whole-page mega hook.
Explain the owner before moving each meaningful responsibility.
Format touched files and run [exact focused checks]. No commit/push.
```

### 11.5 Prompt visual-lock สำหรับ component refactor

```text
This is implementation cleanup only. Freeze the accepted visual baseline.
Do not change dimensions, spacing, typography, colors, borders, shadows, icons,
content, responsive anatomy or interaction semantics.

Reuse the existing primitive APIs and canonical recipes. If the cleanup cannot
preserve the baseline, stop and describe the specific conflict before redesigning.
Verify relevant open/closed/selected/error states and console health through a fresh
independent browser-QA session when required. Human visual acceptance remains pending
until Mahiro reviews; technical PASS is not permission to change taste.
```

### 11.6 ข้อความสั้นสำหรับ `AGENTS.md` ที่ไม่มี skill installed

```markdown
## Mahiro-style fallback

Repository-specific rules and established current patterns win.
This section is fallback preference, not permission to migrate the stack.

- Keep code owner-local; extract only for real reuse or ownership/runtime boundaries.
- Prefer kebab-case source filenames and UPPER_CASE constants.
- Prefer arrow-function frontend components/hooks/helpers where framework-compatible.
- Use I-prefixed interfaces for app-owned object contracts and unprefixed type aliases
  for unions/derived/utility shapes. Preserve generated/external conventions.
- Keep component public exports at the bottom; follow framework export requirements.
- Repo formatter wins; fallback is single quotes and no semicolons.
- Keep routes compositional, hooks behavior-focused, and transport in its current owner.
- Separate remote server state from client preferences and preserve form/i18n/error flow.
- Reuse canonical UI primitives/tokens; preserve accepted visuals during code refactors.
- Do not add shared layers, dependencies, stack migrations or semantic changes without scope.
- Format touched files and verify actual behavior before claiming completion.
```

ส่วนนี้ใช้เมื่อทีมเลือกนำ preference เข้า repo แล้ว ไม่ควรแก้ instruction ของโปรเจกต์คนอื่นเองเพียงเพราะอ่านคู่มือนี้

## 12. Checklist และเกณฑ์ส่งงาน

### ก่อนแก้

- [ ] ระบุ target และ observable outcome ไม่ใช้แค่ “clean code”
- [ ] อ่าน instructions/tooling และตรวจสถานะ repo
- [ ] มี accepted examples หรือรู้ current convention ที่จะรักษา
- [ ] แยก Current Reality กับ fallback preferences
- [ ] รู้ canonical owners, consumers และ generated outputs
- [ ] ระบุ behavior/visual/API/storage ที่ห้ามเปลี่ยน
- [ ] มี baseline checks และขอบเขตที่อนุมัติชัดเจน

### ระหว่างแก้

- [ ] ชื่อสื่อ domain และ job
- [ ] File moves ทำให้ ownership ชัด ไม่ใช่แค่ไฟล์สั้น
- [ ] Object interfaces/type aliases/constants อยู่กับ owner ที่เหมาะ
- [ ] ไม่มี mega hook, pass-through wrapper หรือ speculative shared API
- [ ] Transport/query/store/form ไม่ duplicate authority
- [ ] i18n ยัง extract ได้และสลับ locale แล้วข้อความเปลี่ยน
- [ ] Error/empty/loading/disabled ยังต่างกันจริง
- [ ] ไม่ overwrite manual edits หรือเปลี่ยน design ที่รับแล้ว

### ก่อนส่ง

- [ ] Repo-native formatter ผ่านสำหรับ touched files
- [ ] Imports/casing/exports และ relevant type checks ผ่าน
- [ ] Behavior parity มี checks ตามความเสี่ยง ไม่ใช่แค่ snapshot ชื่อไฟล์
- [ ] Relevant runtime/browser/SSR checks ครบเมื่อ boundary นั้นเปลี่ยน
- [ ] Docs/generated outputs/current consumers ตรงกับ canonical source
- [ ] แยก writer checks, independent QA และ human acceptance ชัด
- [ ] ไม่มี secrets หรือ transient screenshots ปะปนเป็น tracked artifacts
- [ ] รายงาน exact checks, failures, not-run และ limitations ตามจริง
- [ ] ไม่ commit/push/deploy ถ้ายังไม่ได้รับอนุมัติ

### “เสร็จ” ไม่ใช่ “แก้ชื่อครบแล้ว”

ตัวอย่าง Definition of Done สำหรับ bounded style refactor:

1. Approved scope ใช้ ownership/naming/type/export patterns ที่เลือกไว้
2. Public contracts, business behavior และ persistence ไม่เปลี่ยน
3. ไม่มี duplicate canonical owner หรือ layer ที่สร้างเผื่อโดยไม่มี trigger
4. Formatter และ relevant checks ผ่าน หรือมีหลักฐานของ pre-existing blockers ที่ตกลงไว้
5. Consumers/docs/generated output ที่เกี่ยวข้องถูก propagate ครบ
6. ถ้าแตะ rendered UI มี proof ของ relevant states และ visual parity ยังอยู่ใน human-owned gate ตาม scope
7. Diff อ่านรู้เรื่องและอธิบายเหตุผลของ extraction ได้

## 13. ที่มาของข้อสรุปและวิธีรักษาคู่มือ

### Evidence map

| ข้อสรุป                                                                          | ที่มาที่ใช้                                                       | น้ำหนัก/ข้อจำกัด                                                                                          |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Repo-first, ownership, delay abstraction                                         | Canonical `mahiro-style` foundations/patterns และคำแก้ไขสะสม      | หลักหลักที่ใช้ข้ามโปรเจกต์ได้ แต่ repo-specific decisions ยังชนะ                                          |
| Arrow functions, bottom component exports, `I` interfaces, kebab-case, constants | Explicit coding preferences และ refactor feedback                 | Fallback ของ app-owned code ไม่บังคับ generated/framework code                                            |
| Domain component folders และ `variants.ts`                                       | Component-library feedback และ private UI refactor                | เป็น library-scale shape ไม่ใช่ template ของทุก feature                                                   |
| TanStack Query/Zustand/Lingui boundaries                                         | HRM, PaoPlew, Nortezh, Eizypay และ canonical patterns             | มี repeated evidence; library presence ไม่ใช่คำสั่งติดตั้ง                                                |
| RHF + Valibot และ shared Zod contracts                                           | Eizypay form conventions, PaoPlew form conventions, HRM contracts | ยืนยันว่ามีหลาย validation owners ไม่ใช่ library เดียวที่ชอบเสมอ                                          |
| Hono/PostgreSQL กับ Supabase ที่ต่าง repo                                        | HRM/PaoPlew owned-backend และ Management memory                   | ห้ามนำ migration ของ repo หนึ่งไปเหมารวมอีก repo                                                          |
| Base UI/private UI foundation                                                    | `mahirocoko-ui` foundation decision และ Haabiz UI source work     | Router summary เก่าบางส่วนเคยเรียก React Aria; detailed foundation memory ระบุ Base UI เป็น current owner |
| UI provenance, propagation, runtime, human gates                                 | Haabiz UI/theme/editor/reference corrections                      | Build หรือ browser technical PASS ไม่ substitute visual acceptance                                        |
| Main-first + Gemini-on-demand                                                    | คำอนุมัติในบทสนทนา 1 ตุลาคม 2026                                  | Workflow ปัจจุบัน ไม่ใช่ข้อพิสูจน์คุณภาพโมเดลและไม่ใช่ repo dependency                                    |

Canonical skill repository: <https://github.com/mahirocoko/mahiro-skills>

หน้าที่ใช้เป็นฐานของคู่มือนี้ใน `mahiro-style`:

- `foundations/code-style.md`
- `foundations/project-structure.md`
- `patterns/components.md`
- `patterns/hooks.md`
- `patterns/services.md`
- `patterns/stores-state.md`
- `patterns/constants-i18n.md`
- `patterns/error-handling.md`

สำหรับ target repo ต้องอ่าน docs และ implementation ปัจจุบันอีกครั้ง คู่มือนี้ไม่แทน live owner audit และไม่รับรอง version/branch/runtime ของโปรเจกต์อื่น

เมื่อมี correction ใหม่ ให้ปรับ canonical skill หรือ repo owner ที่เป็นเจ้าของกฎก่อน แล้วค่อยปรับคู่มือนี้ ถ้าข้อสรุปยังมีแค่ตัวอย่างเดียว ให้บันทึกเป็น evidence-scoped preference อย่าทำให้กลายเป็น mandatory architecture

ถ้าจะเริ่มใช้วันนี้ เลือกหนึ่ง domain ที่อ่านยาก เตรียม accepted examples สองชิ้น ใส่ protected contracts แล้วใช้ prompt audit-only ก่อน จากนั้นค่อยอนุมัติ bounded refactor ของ slice นั้น
