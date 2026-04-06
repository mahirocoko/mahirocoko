# Maru Realtime Product Review

## Overview
`maru-realtime` เป็นแพลตฟอร์มแนว **realtime document store** ที่มี mental model เรียบมาก:

- `project -> collection -> document`
- มีทั้ง `REST` และ `WebSocket`
- มี dashboard สำหรับจัดการ data และ API key
- เหมาะกับ app ที่ต้องการ CRUD + realtime แบบตรงไปตรงมา

จาก docs และที่ลองใช้งานจริง ผมมองว่ามันเป็น:

> **strong realtime core, but still a thin platform layer**

คือแกนระบบดี ใช้งานเข้าใจง่าย แต่ยังไม่ครบเครื่องในฐานะ product platform แบบ Firebase/Firestore-class

## Strengths

### 1. Mental Model ดีมาก
โครงสร้าง `project / collection / document` เข้าใจง่ายทันที

ข้อดี:
- onboard dev ใหม่ง่าย
- schema ในหัวชัด
- เหมาะกับ app แนว kanban, chat, notes, dashboard, inventory

### 2. Realtime Story ตรงและชัด
มี WebSocket สำหรับ subscribe/update แบบสด

ข้อดี:
- เหมาะกับ collaborative-ish apps
- ใช้ทำ sandbox/prototype ได้เร็ว
- ไม่ต้องแบก abstraction หนักตั้งแต่แรก

### 3. Dashboard ใช้งานได้จริง
จากที่ลองจริง สามารถ:
- สมัคร
- เข้า dashboard
- สร้าง project
- สร้าง collection
- สร้าง document
- generate API key

แปลว่ามันไม่ใช่แค่ API core แต่มี operator surface ที่ usable แล้ว

### 4. API ตรงไปตรงมา
ทั้ง REST และ WS มีรูปแบบที่ไม่ซับซ้อน

ข้อดี:
- เรียนรู้เร็ว
- debug ง่าย
- เหมาะกับทีมเล็กและ internal tools มาก

### 5. เหมาะกับ Sandbox / Prototype มาก
ถ้าต้องการ “database ที่ realtime ได้ และไม่อยากตั้งระบบใหญ่”
ตัวนี้ถือว่า fit มาก

## Weaknesses

### 1. Security Model ยังบาง
จาก docs และพฤติกรรมที่ลองจริง ตอนนี้การใช้งานดูผูกกับ `project API key` เป็นหลัก

ผลกระทบ:
- app public ฝั่ง browser ใช้ตรง ๆ ไม่ปลอดภัย
- ต้องมี server/BFF กลางถ้าจะทำ production-safe
- ยังไม่เห็น user-level authz ที่ละเอียดพอ

### 2. ยังไม่ใช่ Frontend SDK Experience ที่ลื่น
ตอนนี้ใช้ได้ผ่าน REST/WS ตรง ๆ แต่ developer experience ยังไม่ถึงระดับ “หยิบไปทำ product แล้วสบาย”

สิ่งที่ยังต้องทำเองเยอะ:
- reconnect
- resubscribe
- client state sync
- conflict handling
- typed wrappers
- UX around loading/error/offline

### 3. Query Story ยังไม่ชัดพอ
แกน document-based realtime ดี แต่ถ้าจะโตเป็น platform จริงจัง ยังต้องเห็นเพิ่มเรื่อง:
- filtering
- sorting
- pagination
- indexing
- collection/query subscription

### 4. Concurrency / Data Integrity Story ยังไม่ลึก
ถ้าข้อมูลเริ่มมีการแก้พร้อมกันหลาย actor จะต้องมี story ที่ชัดขึ้นเรื่อง:
- versioning
- optimistic concurrency
- conditional writes
- batch/transaction semantics

### 5. Schema / Validation ยังบาง
ถ้า platform นี้มี:
- schema validation
- typed documents
- per-collection schema policy

จะช่วยทั้ง DX และ production safety มาก

### 6. Dev Experience ยังมีรอยสะดุด
จากที่ลองจริงเจอ:
- CORS allowlist ค่อนข้าง rigid
- local dev origin ต้องตรงเป๊ะ
- บาง flow ใน dashboard ยังไม่ polished มาก

## Risks

### Product Risk
ถ้า positioning คือ “Firebase alternative”
ตอนนี้ยังเสี่ยงที่จะถูกคาดหวังเกินสิ่งที่ product ให้ได้จริง

### Security Risk
ถ้า dev ใช้ตรงจาก browser เพราะมันง่าย
อาจเผลอ expose API key และทำให้ project ทั้งก้อนถูกอ่าน/เขียนได้

### Adoption Risk
ถ้าไม่มี SDK และ guardrails ดีพอ
คนจะชอบตอน demo แต่ชะงักตอนทำ app จริง

### Scale Risk
ถ้า query/index/rules/observability ยังไม่ชัด
พอ use case โตขึ้นจะเริ่มต้องห่อเพิ่มเองเยอะมาก

## Missing Pieces

สิ่งที่ผมคิดว่ายังขาดชัดที่สุด:

1. User-level auth + authorization
2. Rules/access policy ที่ละเอียด
3. Better frontend SDK
4. Query/index model ที่ชัด
5. Schema validation / typed contract
6. Conflict/version handling
7. Usage logs / observability / quotas
8. Better local/staging/prod environment ergonomics

## Best Fit Use Cases

ตอนนี้เหมาะมากกับ:

- internal tools
- admin panels
- live dashboards
- collab notes แบบเบา ๆ
- kanban/task board
- inventory/status monitor
- prototypes / demos / sandboxes

ยังไม่เหมาะจะ promise หนัก ๆ กับ:

- public app ที่ไม่มี BFF
- multi-tenant app ที่สิทธิ์ซับซ้อน
- data-heavy apps ที่ต้อง query เยอะ
- production workloads ที่ต้องการ strong policy layer ตั้งแต่ต้น

## Recommended Positioning

ถ้าจะขาย product นี้ตอนนี้ ผมจะไม่วางเป็น:

> “Firebase replacement”

แต่จะวางเป็น:

> “Simple realtime document backend for fast-moving apps and internal tools”

หรือ

> “A lightweight realtime JSON platform with a clean operator dashboard”

มันตรงความสามารถจริงมากกว่า และน่าเชื่อถือกว่า

## Roadmap Recommendation

### Phase 1: Make It Safe
เน้นก่อนเลย:
- authz/rules
- better secret story
- origin/CORS management
- project/environment separation

### Phase 2: Make It Pleasant
- frontend SDK
- reconnect/subscription helpers
- typed client
- better error ergonomics

### Phase 3: Make It Scalable
- query/index/pagination
- concurrency/versioning
- batch/transaction support

### Phase 4: Make It Operable
- logs
- connection metrics
- audit trail
- quotas / limits / usage dashboard

## Final Verdict

## Score
- **Core idea**: 8.5/10
- **Developer simplicity**: 8/10
- **Production readiness as a platform**: 5.5/10
- **Prototype/internal-tool fit**: 9/10

## Bottom Line
`maru-realtime` มีแกนที่ดีและน่าใช้มาก  
แต่ตอนนี้มันยังเป็น **realtime engine with admin surface** มากกว่า **complete app platform**

ถ้าจะใช้:
- **sandbox / prototype / internal**: แนะนำ
- **production public app**: ใช้ได้ แต่ควรห่อด้วย BFF/server layer และต้องยอมรับว่าหลาย capability ยังต้องเติมเอง
