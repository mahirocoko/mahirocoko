# Isolated Cursor shared-read proof

> Historical isolated read proof, not the final installed integration. Current owner: [integration evidence](shared-memory-integration-evidence-2026-10-02.md). Retain the scoped outcomes below without promoting them into whole-memory or live-write claims.

วันที่: 2026-10-02 · ผล: **PASS เฉพาะ communication-slice delivery และ bounded fresh-session recall**

## สิ่งที่ทดลอง

ใช้ Cursor / Opus 5.5 High สอง fresh sessions แบบเรียงกัน คำถามเดียวกัน โดยต่างกันที่ project-local `sessionStart` hook ส่ง shared memory slice หรือไม่ ไม่เปิด native writable memory และปิด reflection ผ่าน session environment ไม่แก้ installed/global hooks

- Source: Letta Main committed revision `9d8892fe7c309c6ce75ba6519f42021dcdb7ea5f`
- Owner: `system/human/prefs/communication.md` source lines 4, 6, 23
- Slice: Thai default, Concise Thai และการแยก PR #75 agent-written ออกจาก human voice exemplars
- Native document renderer: Cursor memory-layer commit `f21fc28de296fa04bae93aeab9e45c7e3f73ebbb`
- Host CLI banner: `v2026.10.01-e373342`, `Claude Opus 5.5 300K High · max`, Ask mode
- Native rendererใช้เฉพาะ shared document anatomy ไม่ส่ง executor contract/mutation instructions ของ rendererข้ามมาด้วย
- Source bytes hash: `9ac9afa00a6af41a9b83511eaf960dab261689aac89cd407291d729e1bc18b4f` ตรงกับ inventoryก่อนหน้า

นี่เป็น scratch adapter ผ่าน supported project hook ไม่ใช่ featureที่ติดตั้งใน `cursor-memory-layer` และไม่ใช่ automatic full-memory integration

## Flow ที่เกิดจริง

```text
Pinned Letta communication owner
  -> explicit reviewed three-unit selection
  -> native Cursor document renderer + provenance wrapper
  -> scoped secret scan + conservative 12,000-byte pilot cap
  -> project-local sessionStart additional_context
  -> fresh Opus 5.5 session answers from loaded context
```

Readerอ่าน raw committed bytesโดยไม่ trim เพื่อรักษา source hash แล้วค่อยเลือก complete paragraphs ไม่มีการย่อความรู้หรือคัดลอก persona/model routing/project memories

Off/on fixture workspacesมี scratch Git rootsที่ยังไม่มี commit ไม่มีการสร้าง Git commitในรอบนี้ Native memory rootsแยกและไม่ได้ initialize เพื่อให้ global memory-layer hooksไม่เขียน reflection/fallback notesเข้า live store

## ผลคู่ off/on

| Check | Memory-off | Memory-on | Verdict |
| --- | --- | --- | --- |
| บอก personal language preference จาก memory | บอกไม่ทราบ; แยกข้อความไทยของ promptออกจาก personal memory | ระบุ Thai default และ Concise Thai พร้อม caveatห้ามตัดคำสั่ง/ความเสี่ยง | Scoped source-backed recall PASS |
| PR #75 เป็น human-written exemplarหรือไม่ | บอกไม่ทราบ ไม่มีข้อมูล PR | บอกใช้เป็น human-written voice exemplarไม่ได้; 12 inline commentsเป็น agent-written | Canary PASS |
| อะไรยังใช้จาก #75 ได้ | ไม่เดา | แยกโครงสร้าง pinpoint what/where/how + recommendationออกจาก voice | Meaningful distinction PASS |
| Human reviewsที่ใช้ calibrate | ไม่เดา | #24/#26/#37/#62/#65 | Exact fact PASS |
| Source revision และ coverage | ไม่มี committed memory revision | อ้าง SHAเต็มตรง source พร้อม owner/lines และระบุ exclusions | Attribution PASS |

คำถามมีเลข PR #75 แต่ไม่มีคำตอบเรื่องผู้เขียนหรือรายการ human reviews Offจึงเป็น useful controlสำหรับ canaryนี้ ภาษาไทยใน promptและ shared skill metadataทำให้ language/styleไม่ใช่ blinded independent preference-quality benchmark

Onยังระบุ native Cursor memoryว่า uninitialized แยกจาก shared Letta revisionได้ ไม่สับสนว่า source storeกับ writable native storeเป็นอันเดียวกัน

## Receipts และ byte boundary

| Arm | Native session/conversation ID | Emitted UTF-8 bytes | Bundle SHA-256 |
| --- | --- | ---: | --- |
| off | `07854cc1-a5e6-4640-9363-b1fd92485a20` | 82 | `fb355f3a08060595583429e2a16c1ef77d54bf7475c65465bc966a59e8fb6223` |
| on | `ece0f00e-cf43-4cf7-8c00-dd01a855fccf` | 1,733 | `fdec8fca5dede38cde25822e4f70228f8bfb4081b0448656a576a4248ecc6c65` |

Hook receiptsมาจาก host sessionStart พร้อม actual session IDs แยกจาก offline-preflight receipt มี source hash/revisionและ emitted payload hash ไม่เก็บ raw hook inputหรือ native transcriptใน receipt

Prompt file SHA-256: `53982216b2011ed3c616eb49cfa79b9ee1e37e6bbe7149d3e9f62cb961ec065d` ทั้งสอง sendsอ่านไฟล์เดียวกันด้วย shell command substitution ซึ่งตัด trailing newlineเหมือนกัน Byte identityที่ dispatch command boundaryไม่ใช่ provider request-byte proof

12,000 bytesเป็น conservative capของ pilot ไม่ใช่การอ้างว่าเป็น Cursor host limit Payloadเพียง 1,733 bytesที่ส่งครั้งนี้และคำตอบจริงเป็น host evidence ไม่พิสูจน์การส่ง full coreหรือ payloadใกล้เพดาน

## Validation และ no-write boundary

- Pure reader checks 12 assertions ผ่าน: selected unit count, canary content, negative off control, excluded native contract/persona, byte bound และ refusalเมื่อ root/revision/armผิด
- Formatterใช้ installed native Biomeของ Cursor repoผ่าน stdinกับ scratch TypeScriptสองไฟล์ แล้ว rerun checksก่อน host sessions
- Five repositories/storesมี HEADและ porcelain statusเหมือน before snapshot: Letta MemFS, Cursor memory, Agy memory, Cursor adapter source, Agy adapter source
- Letta unrelated dirty/untracked pathsทั้งสามยังอยู่เดิม ไม่ stageหรือ commitแทนงานอื่น
- Terminal reportsถูก Mainอ่านจริงและตรวจคำตอบกับ selected source; ไม่ให้ hostเรียกตัวเองว่า system PASS
- ไม่พบ tool-call rowsใน retained terminal response evidence; นี่ไม่ใช่ host-enforced no-tools isolation guarantee
- ส่ง interruptให้ exact receipt-bound lanes แล้วปิด job tabs Outputกลับ shell promptและ current personal workspaceเหลือ Main terminalเดียว ทั้งสอง handlesเป็น operator-closed/non-writable
- Native Cursor session/history stateเกิดใหม่ตามการเปิด hostตามปกติ ไม่อ้างว่า HOMEทั้งหมด byte-identical
- HEAD/status equalityไม่ใช่ full working-tree byte invariance และ scoped secret scanไม่ใช่ whole-store secret-clear verdict

## สิ่งที่ยังไม่พิสูจน์

1. Readerอยู่ร่วมกับ existing full native memoriesโดยไม่มี duplicate active owners
2. CLI/reflection guardsป้องกัน local shared overrideหรือเขียน sourceจริง — read-only metadata/promptไม่ใช่ enforcement proof
3. Project alias/scope isolation, deferred detail lookup, full-memory transport/budgetและlong-running session refresh
4. Shared learningกลับเข้า ownerผ่าน proposalโดยไม่เป็นคอขวด
5. Agy host behavior และ manual/native approval policy propagation
6. Reliabilityหลายครั้งหรือ quality upliftเชิงสถิติ — นี่มีเพียงหนึ่ง off/onคู่และหนึ่ง substantive canary

## ผลต่อการตัดสินใจ

**ไปต่อได้ในระดับ adapter prototype ไม่ใช่ live activation:** plain committed Letta Markdownส่งเป็น shared contextผ่าน native Cursor hookได้โดยไม่ต้อง syncทั้ง storeหรือเปิด Letta process และอย่างน้อยหนึ่ง factที่ไม่อยู่ใน selected Cursor communication ownerถูกใช้ได้ถูกใน fresh session

ขั้นถัดไปที่มี load-bearing valueคือ existing-native overlay/duplicate-owner guard + pending shared-learning path ก่อนขยายจำนวน facts อย่าเพิ่ม full workflow/core, vector serviceหรือหลาย adaptersพร้อมกันเพียงเพราะ canaryผ่าน

หลักฐาน scratchอยู่ใน `.agent-state/tmp/shared-memory-cursor-proof-20261002/` และถูก ignore: reader/check scripts, project fixtures, before/after snapshots, hook receipts, exact terminal receiptsและretained reports ไม่ต้อง commit bulky native session artifacts ไม่ลบ proofนี้แบบcacheโดยไม่มี inventory

ดู [inventory และ reconciliation ledger](shared-memory-inventory-2026-10-02.md) และ [แผน pilot/activation gates](portable-memory-read-adapters.md)
