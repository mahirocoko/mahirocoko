# Shared/native overlay และ duplicate-owner guard — offline proof

> Historical offline overlay experiment. Its unintegrated status below is superseded by the completed adapters and published releases. Current owner: [integration evidence](shared-memory-integration-evidence-2026-10-02.md).

วันที่: 2026-10-02 · สถานะ: **27/27 focused self-checks ผ่าน; ยังไม่เชื่อม installed writers หรือ reflection**

## ขอบเขตที่ทำ

ต่อจาก [fresh Cursor read proof](shared-memory-cursor-proof-2026-10-02.md) โดยทดลอง owner registry และ overlay ใน ignored personal scratch เท่านั้น ไม่มี provider calls, adapter-source changes, live-memory writes หรือ hooks/config activation

ใช้ committed source units จริง แต่ mutation requests ที่ติดชื่อ `cli` / `reflection` เป็น fixtures ไม่ใช่ receipts ว่า native writers เรียก guard แล้ว ไม่ใช่ independent acceptance หรือ full-system safety verdict

## Registry ที่ตรวจ

| Owner | Units | Source |
| --- | --- | --- |
| Shared | Thai default, Concise Thai, eizypay PR voice provenance | Letta `9d8892fe7c309c6ce75ba6519f42021dcdb7ea5f`, communication lines 4/6/23 |
| Native | ห้ามส่ง Letta model slugs ให้ Cursor; ใช้ CLI inspection และไม่ schedule Cursor IDE proof | Cursor `9eeca5b782a6afa933fa621da57881a644e91a67`, workflow lines 28/35 |

Registry มี explicit stable IDs, owner, committed revision, source path/line และ body fingerprint จาก actual pinned source Native units ไม่ถูก rewrite ให้เป็น Letta behavior ส่วน source files ทั้งหมดอยู่นอก writable scratch

## Guard ทำอะไรได้ใน prototype

- ประกอบ shared/native units เป็น context เดียวโดยคงสองเจ้าของไว้
- Reject duplicate active ID แม้เนื้อหาเหมือนกัน ไม่ deduplicate แบบเงียบ ๆ
- Reject shared unit ที่ relabel เป็น native, เปลี่ยน ID, หรือแอบใส่เนื้อหาใน registered native slot
- Reject unreviewed units รวมถึง paraphrased preference override ไม่อ้าง semantic detection แต่ fail closed เพราะยังไม่ได้รับ review
- ตรวจ body/provenance ให้ตรง reviewed registry และ reject การละ shared rule/native capability จาก baseline เงียบ ๆ
- Shared mutation ทุก operation ต้องเป็น proposal แม้ caller ส่ง `force: true`
- Unknown owner ถูก block; native delete ต้อง retention review; native edits เป็น **plan-only** เพราะยังไม่มี filesystem writer ต่ออยู่
- Pending proposal ที่ base revision ตรงยังไม่เปลี่ยน active context; stale/wrong-target proposals ถูก reject

```text
Pinned shared units + pinned native units
                |
       Reviewed owner registry
                |
    Duplicate/provenance/baseline guard
                |
        Assembled context (offline)

Fixture mutation request
  shared -> proposal-required -> pending, not active
  native -> native-plan-only / retention review
  unknown -> blocked
```

## Direct counterexamples ที่ตรวจ

27 Node test cases ครอบคลุม:

1. Native capabilities ทั้งสองอยู่ร่วมกับ shared facts ทั้งสามได้ และมี active IDs ไม่ซ้ำห้ารายการ
2. Identical duplicate, native takeover, renamed copy, registered-slot smuggling และ unreviewed paraphrase ถูก reject
3. Ownership flag, source revision/path/line และ body ที่ caller ปลอมไม่ promote เป็น accepted content
4. Omitted shared rule/native capability ถูก reject
5. `write` / `append` / `replace` / `delete` ของ shared owner ผ่านสอง fixture channels ต้อง proposal แม้ `force`
6. Unknown/local shadow owner ถูก block และ native mutation/delete ยังไม่ถูก apply
7. Pending proposal ไม่เปลี่ยน active context, stale/wrong-target proposal ไม่ผ่าน และ registry/units ถูก freeze

Formatter ใช้ installed native Biome ผ่าน stdinกับ scratch TypeScript จากนั้นรัน `node:test` แบบหนึ่ง concurrency ผล **27 passed, 0 failed, 0 skipped** ไม่มีการสร้าง commitเพื่อ fixture stores

## ข้อค้นพบใน source เดิมที่สำคัญ

Cursor `src/memory/editor.ts` มี `assertWritable` ซึ่งยอมผ่านเมื่อ callerใช้ `force`; normal read-only fileต้องผ่าน human intentตาม contract ส่วน `src/dream/apply.ts` อ่าน document แล้ว reject `read_only` ก่อนประกอบ changes

ดังนั้น `read_only` frontmatter อย่างเดียวไม่ใช่ shared-owner boundaryที่สมบูรณ์ และ duplicate preference สามารถเกิดในอีก writable fileได้ ต้องมี shared ownership guardที่ทั้ง CLI และ reflection mutation entrypointsเข้าร่วมจริง

Prototypeนี้ **ยังไม่ได้เชื่อม** entrypoints เหล่านั้น ชื่อ fixture channel ไม่เปลี่ยนข้อเท็จจริงนี้ จึงห้ามรายงานว่า native CLI/reflection ถูก enforceแล้ว

## สิ่งที่ยังทำไม่ได้

- โหลด native memoryทั้ง storeแล้ว classify every paragraphอย่างถูกต้อง Registryนี้มีเพียงห้า reviewed units
- เปิดรับ native learningใหม่แบบ activeโดยอัตโนมัติ ตอนนี้ unreviewed inputเป็น pending/block; ต้องออกแบบ native acceptance pathที่ไม่ทำให้ทุก learningติดคอขวด
- แยก semantic conflictของ unitsที่ยอมรับเพิ่มภายหลัง การปฏิเสธ unknown unitไม่ใช่ universal contradiction detector
- รับรองการกัน same-UID code tampering/direct filesystem access Registry fingerprintไม่ใช่ cryptographic authorization/signature
- การ supersede/delete shared knowledge ผ่าน approved migration, retained native forksและcache lifecycle
- Runtime proof ว่า full native overlayถูกส่งครบหรือไม่มี bypassจาก real writers, `--force`, bulk writes, reverts และ reflection batches
- Proposal persistence/approval/integration กลับ Letta ส่วนที่สร้างใน testsเป็น synthetic fixture ไม่ใช่ submitted learning

## No-write evidence

Letta/Agy/Cursor memory HEAD/status ยังคงเดิมจาก prior proof และ Cursor/Agy adapter-source worktrees clean รักษา Letta unrelated modified/untracked filesทั้งสามไว้ ไม่ stage/commit/restore งานของอีก conversation

Scratch source/manifest/test outputอยู่ใน `.agent-state/tmp/shared-memory-overlay-proof-20261002/` ไม่มีการเปิด host lanesในรอบนี้ Source inspection/test codeใช้ read-only Git operations ไม่ใช้ native mutation commands

HEAD/status equalityไม่ใช่ full working-tree byte invariance และ self-checksไม่ใช่ independent acceptance

## Decision และ next scope

**Boundary แบบ registryใช้ทำ bounded overlayได้ แต่ยังไม่พร้อม activate** ขั้นถัดไปที่ควรพิสูจน์คือเชื่อม shared guardกับ real CLI/reflection planning entrypoints ใน isolated copy/fixture ก่อนขยาย unit count พร้อม counterexamplesสำหรับ `--force`, unknown target files, bulk/revert และ batch bypass

ไม่ควรเพิ่ม global hooks, ตัด native memoryเดิมออก หรือย้าย storeเพียงเพราะ offline testsผ่าน และยังไม่ต้องเพิ่ม Agy integrationจน real Cursor mutation seamsชัดเจน

ดู [แผน owner/activation gates](portable-memory-read-adapters.md) และ [reconciliation ledger](shared-memory-inventory-2026-10-02.md)
