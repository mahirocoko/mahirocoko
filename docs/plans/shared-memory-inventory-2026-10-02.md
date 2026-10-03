# Shared memory inventory และ reconciliation — Letta / Agy / Cursor

> Historical discovery checkpoint, not current adapter readiness. The inventory verdict below predates the completed integration and published releases. Current owner: [integration evidence](shared-memory-integration-evidence-2026-10-02.md).

วันที่: 2026-10-02 · Verdict: **NOT ALIGNED สำหรับ selected shared content; read-only inventory เสร็จแล้ว**

นี่ไม่ใช่ผลทดสอบ sync หรือ adapter ไม่มีการแก้ source ของ adapters, live memory, hooks, settings หรือเปิด provider session ในรอบนี้

## Mandate และขอบเขต

Mahiroสลับ Letta/Agy/Cursor บ่อย ทั้ง Agy และ Cursor มี memory-layer ที่ port แนวคิด Letta และเรียนรู้เองได้ จึงตรวจว่าความรู้ร่วมแตกเป็นหลาย owners อย่างไร ก่อนเพิ่ม automatic read integration ไม่รวม Codex CLI ใน requirement ปัจจุบัน

อ่านและเทียบ committed owners 12 ไฟล์: `identity`, `communication`, `coding`, `workflow` ของสามระบบ ตรวจ source classification/injection ของ adapters ประกอบ และตรวจเฉพาะชื่อ owner ของ Agent Halo เป็นตัวอย่าง project mapping ไม่เปิด project memory bodies หรือ raw transcripts

Source-of-truth order: current user scope > current repo/runtime contracts ที่เกี่ยวข้อง > accepted memory พร้อม provenance > dated import notes การที่ Letta เป็น source เริ่มต้นไม่ทำให้ learning ของ Agy/Cursorผิดโดยอัตโนมัติ

## Snapshots ที่ใช้

| Store | Pinned commit | สถานะตอนตรวจ |
| --- | --- | --- |
| Letta Main | `9d8892fe7c309c6ce75ba6519f42021dcdb7ea5f` | มี unrelated dirty/untracked files 3 paths; ไม่นำมาอ่านเป็น active content |
| Agy | `66b66fdb9507250234f08a1ac81907b0b7558e8b` | Clean |
| Cursor | `9eeca5b782a6afa933fa621da57881a644e91a67` | Clean |

Native roots:

- Letta: `/Users/mahiro/.letta/lc-local-backend/memfs/agent-local-b1f7b85c-d49d-43ea-a7e3-6fa085ecd426/memory`
- Agy: `/Users/mahiro/.gemini/memory`
- Cursor: `/Users/mahiro/.cursor/memory`

ทุก owner ใน mechanical comparison อ่านจาก pinned SHA ไม่ใช่ working-tree body ผลจึงไม่รวมความรู้จากแชตนี้ที่ยังไม่ได้ commit เข้าหนึ่งใน stores

Live Letta status ที่รักษาไว้: modified `earn-money/flow-workbench.md`, modified `haabiz-ui/overview.md`, untracked `haabiz-ui/recent-alignment-2026-10.md` ไม่ stage, commit, restore หรือแก้ไฟล์เหล่านี้

## Owner map

| หัวข้อ | Letta owner | Agy owner | Cursor owner | Disposition |
| --- | --- | --- | --- | --- |
| Human identity | `system/human/identity.md` | `system/human/identity.md` | `human/identity.md` | เลือกเฉพาะ human facts; runtime relationship/identity ต้อง review แยก |
| Communication | `system/human/prefs/communication.md` | `system/human/prefs/communication.md` | `human/prefs/communication.md` | มี shared core และ native additions; เป็น pilot candidate ที่เล็กที่สุด |
| Coding | `system/human/prefs/coding.md` | `system/human/prefs/coding.md` | `human/prefs/coding.md` | มี approved delta และ condensation; ห้ามเลือกตามความยาวหรือ overwrite |
| Workflow | `system/human/prefs/workflow.md` | `system/human/prefs/workflow.md` | `human/prefs/workflow.md` | ผสม portable policy กับ native execution; แยกเป็น unit ไม่แชร์ทั้งไฟล์ |
| Persona | Letta runtime identity | Agy runtime identity | Cursor runtime identity | ไม่อ่าน/merge bodies ในรอบนี้; คง native owner |
| Recall/reflection state | Native runtime | Native runtime | Native runtime | ไม่รวมและไม่ใช้เป็น shared authoring permission |

### Volume evidence — เฉพาะ 4 selected owners ต่อ store

| Store | Identity | Communication | Coding | Workflow | รวม UTF-8 bytes |
| --- | ---: | ---: | ---: | ---: | ---: |
| Letta | 2,857 | 7,005 | 47,799 | 45,828 | **103,489** |
| Agy | 233 | 7,289 | 48,685 | 36,550 | **92,757** |
| Cursor | 3,047 | 8,443 | 8,313 | 10,618 | **30,421** |

ไม่ใช่ total injected payload และไม่ใช่ billed tokens Cursor coding/workflow เป็น condensed owners มี reference routes ของตัวเอง จึงห้ามตีความว่าข้อความน้อยแปลว่าความรู้หายทั้งหมด การนำ Letta ทั้งสี่ ownersเข้า Cursorตรง ๆ ก็ไม่ใช่ proof ว่าเข้า budgetได้

Exact long-line overlap ของ communication: Letta/Agy 27 lines และ Letta/Cursor 28 lines; coding Letta/Agy 86 lines ส่วน Cursor coding ไม่มี long exact lines ตาม normalization ที่ใช้ เนื่องจาก prose condensed/adapted ไม่ใช่หลักฐานว่าไม่มี semantic overlap

## Reconciliation ledger

Line references ต่อไปนี้ผูกกับ snapshot ด้านบน ไม่ใช่ current working-tree line guarantees

| ID | เรื่อง / competing claims | หลักฐาน | Classification / severity | การจัดการที่เสนอ |
| --- | --- | --- | --- | --- |
| R1 | Thai default และ Concise Thai | Communication ของทั้งสามมี wording ตรงกันหลาย lines | Shared agreement / low | Include เป็น positive control ไม่ต้องเพิ่ม owner ซ้ำ |
| R2 | Github PR #75 เป็น agent-written ไม่ใช่ human voice exemplar | Letta communication line 23; paragraph นี้ไม่อยู่ใน selected Agy/Cursor communication owners | Missing selected shared fact / medium | Pilot canary: จำแนก #75 กับ human reviews ก่อนให้คำแนะนำ; ไม่อ้างว่าไม่อยู่ที่ใดเลยในสอง stores |
| R3 | CCC ถูก retire เทียบกับคำแนะนำใช้ broad semantic search | Letta workflow line 64 ระบุ retire 2026-09-28; Agy workflow line 71 ยังสั่งใช้ `ccc`, line 86 ยังกล่าวถึง indexing workload | Active textual contradiction / high | Propose explicit supersession เฉพาะ CCC instructions; คง resource-safety rule ไม่ลบทั้ง paragraph ไม่รัน CCC |
| R4 | Artifact owner ต้องอยู่ task workspace เทียบกับ blanket personal-workspace routing | Letta workflow line 14 มี 2026-09-28 correction; Cursor workflow line 13 ส่ง proof artifacts ไป personal workspace/approved lab | Scope conflict / medium | Review และ adapt ให้ตรง task ownership/read-only exceptions; ไม่ทำ global path rewrite |
| R5 | Long className ใช้ existing combiner และ group utilities | Agy coding line 45; approved commit `66b66fd` วันที่ 2026-09-30 | Candidate new portable learning / medium preservation risk | Preserve และ propose กลับ owner ร่วม; ไม่พบ rule wording นี้ใน selected Letta coding owner แต่ไม่อ้าง global absence |
| R6 | Workspace design-system props/variants และห้ามซ้อน focus/radius/padding/paint | Agy approved curation `f21150f` วันที่ 2026-09-30; diff ปรับ rule เดิมใน coding | Compatible sharpening / medium preservation risk | Compare intent กับ rule เดิมของ Lettaแล้วเสนอ exact delta; ไม่ถือว่าแตกต่างแปลว่าขัดกัน |
| R7 | Cursor มี corrections ใหม่เรื่อง recap, screenshot target, explicit Opus 5.5 consultation และ Goal ทุก phase | Cursor communication lines 46–51 และ workflow line 9 | Mixed shared/native/context-specific additions | Preserve; review provenance ก่อน promote ส่วน Goal ทุก phaseไม่ควรกลายเป็น universal policy โดยไม่มี scope |
| R8 | Letta Main-first/Gemini routing เทียบกับ Cursor session/native routes และ Agy native-child boundary | Letta workflow มี named policy; Cursor workflow Models; Agy communication line 20 | Native adaptation, ไม่ใช่ drift ที่ต้องบังคับให้ตรง | Keep-local; ห้าม sync model/tool roster ทั้งก้อน |
| R9 | Same filename ไม่ได้หมายถึง same detail tier | Cursor `human/` active; Letta root `human/` เป็น external ส่วน active อยู่ `system/human/`; Agy layered `system/human/` | Structural mismatch / high หาก raw mirror | Map semantic owners จาก source classifier ไม่ map prefix อย่างเดียว |

R2/R5 เป็น bounded absence findings ไม่ใช่ semantic/global absence R3/R4 เป็น text-contract findings ไม่ได้พิสูจน์ว่า agent เรียก tool หรือเลือก artifact path ผิดใน runtime แล้ว

## ตัวอย่าง project mapping — Agent Halo

ตรวจชื่อ committed files เท่านั้น:

| Store | Owners ที่มี | Native tier จาก classifier |
| --- | --- | --- |
| Letta | `agent-halo/overview.md`, `agent-halo/conventions.md` | External/router-mediated ไม่อยู่ใน core `system/` |
| Agy | `projects/agent-halo/system/overview.md`, `projects/agent-halo/system/conventions.md` | Project system eligible เมื่อ resolve current project |
| Cursor | `agent-halo/MEMORY.md`, `agent-halo/reference/overview.md`, `agent-halo/reference/conventions.md` | Project index active; nested detail deferred |

จึงไม่ควรเริ่มด้วยการทำ project memories ทุกตัวให้เหมือนกัน ปริมาณที่โหลดและ routing ต้องปรับตาม host Proof แรกควรเป็น global communication ที่ไม่ต้องพึ่ง project alias; ทดสอบ project isolation ต่อด้วย controlled fixturesก่อนเปิด project bodies จริง

## Pilot ชุดแรกที่แนะนำ

**เลือก communication slice ไม่เลือก full workflow/core**

1. Positive control: Thai default + Concise Thai + แยก facts/recommendations
2. Incremental canary: PR #75 agent-written และ earlier human reviews ใช้ calibration คนละแบบ
3. Negative control: ไม่โหลด Letta model roster, runtime persona หรือ project bodies ที่ไม่เกี่ยวข้อง
4. Preserve-native test: Cursor corrections และ Agy native delegation guidance ยังอยู่ใน native owner ไม่ overwrite
5. Pending proposals R3/R5/R6 อยู่ใน ledger เท่านั้น ไม่ mutate live storesเพื่อให้ pilotดู aligned

สำหรับ adapter implementation: reader รับ explicit source root/agent + pinned SHA, ประกอบ selected unit พร้อม provenance โดยไม่ลด native memory ทั้งระบบ ตรวจ known duplicate owners ก่อน assembly หาก duplicate current ownerยัง unresolved ให้ fail/diagnose ไม่ใส่สองชุดแล้วหวังให้ modelเลือกเอง

การตัด selected source units ต้องมี exact owner/line fingerprint ไม่ใช้ keyword extraction เป็น production reader เวอร์ชันแรกของ proofเป็น explicit reviewed sliceได้ แต่ route รายละเอียดต้องไม่อ้างว่าพก memoryทั้งชีวิตครบแล้ว

**No-write experiment ที่ทำแล้ว:** อ่าน pinned source, เปรียบเทียบ/hash และเขียน inventory ใน personal workspace เท่านั้น **Host proof ที่ยังไม่ทำ:** fresh Agy/Cursor session ใช้ bundle, runtime budget delivery และ write/reflection guards

## Evidence matrix และ regression coverage

| Claim | Evidence ที่มี | ที่ยังขาด / counterexample |
| --- | --- | --- |
| Stores ไม่ใช่ shared writable directory | Native root realpaths และ separate HEADs; source topology | Installed behavior สามารถ override ผ่าน env ต้องตรวจอีกครั้งก่อน activation |
| Selected shared content ไม่ aligned | 12 pinned owners + concrete R2–R7 | ไม่ใช่ full-memory semantic audit |
| Native projection scope ต่างกัน | Cursor scope/projection/session-start; Agy layered classifier | ไม่มี fresh host runtime proof |
| Snapshot reader ปลอดภัยจาก mixed HEAD | Inventory ใช้ pinned SHA จริง | New adapter ยังไม่มี guard/test; broken case: git show HEAD ทีละไฟล์เมื่อ HEADขยับ |
| ไม่มี live writesใน inventory | Codeมีเฉพาะ read git operations; before/after HEAD/status เหมือนเดิมระหว่าง probe | ไม่ใช่ full working-tree byte invariance; concurrent modificationsที่ statusเหมือนเดิมอาจซ่อนอยู่ |
| Shared/native write separation | ยังเป็น design | Missing regression; broken case: reflectionสร้าง local shared preferenceที่ override canonical |
| Source secretsไม่ถูกส่งไป host | ไม่ได้ส่ง source payloadไป provider ในรอบนี้ | ไม่มี secret-clear verdict; future readerต้อง block/report safely |
| Pilotช่วย switchจริง | ยังไม่ได้ทดสอบ | Human-owned workflow acceptance และ fresh runtime behavior |

ไม่ได้ cleanup จึงไม่มี deletion/retention verdict ไม่เรียก fresh verifierเพื่อรับรอง implementationที่ยังไม่ได้ทำ

## ผลกระทบ repo และ next action

- รอบนี้เพิ่ม audit report + scratch read-only inventory และ refresh scope ในแผนหลักเท่านั้น
- Adapter source และ live stores/configs ทั้งสามไม่ถูกแก้ ไม่ติดตั้ง ไม่ commit/push ไม่เปิด reflection/provider jobs
- Letta dirty files ที่ไม่ใช่งานนี้รักษาไว้ ไม่ commitแทนงานของ conversationอื่น
- Proposed next scope: Cursor-first isolated communication reader proof แล้วใช้ contractเดียวกันกับ Agy โดย serialize implementation; ไม่เปิดใช้ live ไม่ reconcile/delete forksและไม่เพิ่ม Codex
- Source authoringของ learningร่วมยังไม่ตัดสินถาวร R5/R6พิสูจน์ว่ามี valuable deltaเกิดนอก Letta จึงต้องทดลองทางกลับด้วย ไม่ใช่พิสูจน์แค่ one-way reads

Reproducible metadata artifact: `.agent-state/tmp/shared-memory-inventory-20261002/inventory.json` มี pinned hashes, byte counts, literal cue locations และ HEAD/status snapshots ไม่มี raw memory bodies Scriptใช้ fixed owner allowlist ไม่ใช่ broad memory indexer

## Final disposition

**Inventory complete / NOT ALIGNED:** มีทั้ง stale shared instructions, missing selected facts, valuable native learning และ valid runtime adaptations ต้อง reconcileแบบรายเรื่อง ไม่ sync/overwriteทุกอย่างจาก Letta ส่วนการเปิด automatic readerยังเป็นงานถัดไป ไม่ได้อนุมัติ live activationจาก auditนี้
