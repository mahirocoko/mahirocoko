# Real Cursor mutation entrypoints — isolated integration proof

> Historical entrypoint experiment, not current installation state. Current owner: [integration evidence](shared-memory-integration-evidence-2026-10-02.md). Its original no-install/no-commit boundary describes this experiment only.

วันที่: 2026-10-02 · ผล: **19/19 focused self-checks ผ่านกับ patched pinned source copy**

## ขอบเขต

Mahiroอนุมัติให้ต่อจาก overlay proof จึงทดลองเชื่อม guardกับ codeจริงใน isolated copy ไม่แก้ repoต้นฉบับหรือ live stores ไม่เรียก providerและไม่สร้าง commits

Source copyมาจาก Cursor memory-layer commit `f21fc28de296fa04bae93aeab9e45c7e3f73ebbb` ผ่าน Git archiveเฉพาะ `src`, `bin`, `package.json` Fixtureเป็น sparse local cloneที่อ้าง existing Cursor memory commit `9eeca5b782a6afa933fa621da57881a644e91a67` และ checkoutเฉพาะ communication/workflow/native reference ไม่มีการสร้าง historyใหม่

Object alternatesของ fixtureอ่าน original memory object store แต่ index, working treeและGit metadataเป็นของ fixture ไม่ใช่ original ไม่มี native repo hooksถูกคัดลอกมาใช้

## Seams ที่เชื่อมใน copy

| Native seam | Guard ที่เพิ่ม | หลักฐาน |
| --- | --- | --- |
| Editor `assertWritable` | Shared/unknown ownerถูกปฏิเสธก่อน native `force` bypass | Real CLI write/append/replace/delete `--force` |
| Editor move | ตรวจ target ownershipก่อนอ่าน/ย้ายข้อมูล | Shared-to-native และ native-to-shared targets |
| Repository file write/delete | ตรวจ fixture root, pathและreviewed contentก่อน filesystem mutation | Direct APIs และ shared-content smuggling |
| Repository commit | Preflightทุก target/contentก่อน staging | Direct shared commit requestถูก reject |
| Reflection planner | Preflight batchทั้งชุดก่อน native planner logic | Mixed batchที่ native itemมาก่อน shared itemไม่ถูก partial apply |
| Revert/restore ทั้ง editor/repository/backup | Bulk historyต้อง reviewแยก ไม่ไหลเข้าถึง Git mutation | Real CLI revert/restoreและdirect APIs |

Tests spawn **real copied CLI** และ import **real copied reflection planner/apply functions** ไม่ใช่เพียงส่ง channel stringsเข้า fake dispatcher อย่างรอบก่อน อย่างไรก็ตาม actual reflection provider/triggerไม่ได้ถูกเปิด

## Coverage และผล

19 cases, 0 failed/skipped; formatterใช้ native Biomeก่อน rerun Node testsด้วยหนึ่ง concurrency

- Shared mutationผ่าน CLIถูกปฏิเสธแม้ `--force`
- Move, unknown new targetและshadow preferenceไม่สามารถสร้าง active ownerใหม่
- Reflection shared-onlyและmixed batchถูกปฏิเสธก่อน native write loop
- Native-only reflection **planning** ยังออก pending changeได้สำหรับ reviewed fixture addition ไม่ได้ apply/commitมัน
- Lower-level write/delete/commit/revert/restoreไม่หลุด guardตาม casesที่ตรวจ
- Known shared paragraphที่คัดลอกเข้า registered native fileถูกปฏิเสธ
- Paraphrased preferenceใน native fileถูก rejectด้วย unreviewed-content gate ไม่ใช่ semantic classifier
- Native deletionต้อง retention review
- การเปลี่ยน memory rootให้ชี้ live Cursor storeถูกปฏิเสธก่อน filesystem write
- ทุก rejected fixture operationตรวจ HEAD, porcelain status, index hashและhashของสาม selected filesก่อน/หลังเท่ากัน

Independent no-new-commit barrierใน fixture PATHปฏิเสธ Git commit/revert/history/network mutations กรณี guardหลุด Testsต้องได้ `Proof guard` error ไม่ใช่errorของ Git barrier จึงไม่ใช้ barrierเป็นตัวสร้าง PASSให้ ownership tests

## ข้อแก้ระหว่างตรวจ

Path allowlistอย่างเดียวไม่พอ: ถ้าเปิด registered native fileให้ appendอะไรก็ได้ shared preferenceอาจถูกเขียนแบบ paraphraseในไฟล์นั้น จึงเพิ่ม exact reviewed-native-content gateสำหรับ proofนี้ และเพิ่ม native-retention guard

Gateนี้อนุญาตเฉพาะ baselineกับหนึ่ง clearly-labelled synthetic native fixture addition ไม่ใช่ production native-learning policy ทุก learningใหม่ไม่ควรถูก blockตลอดไปเพียงเพื่อให้ testsผ่าน ต้องออกแบบ native acceptance/proposal pathก่อน activation

Whole human filesถูกกำหนดเป็น shared/protectedใน fixtureเพื่อทดสอบ bypass แต่ไฟล์จริงเหล่านั้นมี native additionsผสมอยู่ จึง **ห้ามยก allowlistนี้ไปติดตั้งแล้ว freeze native memoryทั้งระบบ** ต้อง reconcile/split ownersตามledgerก่อน

## No-write boundary และ concurrent source reality

- Live Letta, CursorและAgy memory HEAD/statusยังตรง prior snapshots มี unrelated Letta dirty/untracked filesสาม pathsที่รักษาไว้
- Fixtureจบที่ HEADเดิมและclean พร้อมselected file/index hash invarianceตามtests ไม่มีcommitsใหม่
- Agy adapter-source worktree clean
- เมื่อปิดงานพบ out-of-scope modifications/untracked filesใน **original Cursor source** ได้แก่ installer/hooks/docs/testsและLICENSE; laneนี้ไม่ได้เขียนไฟล์เหล่านั้นและไม่restore/stage/commitแทน
- จึงไม่อ้างว่า original Cursor source cleanหรือworktreeทั้งหมด unchanged ผลintegrationนี้ครอบคลุม archived `f21fc28` ไม่ใช่ latest dirty source
- Before integrationกลับrepoจริงต้องอ่าน/reconcile changesล่าสุดและrerun affected seams ไม่ blind-apply scratch patch

## Limits

- ไม่มีsuccessful native CLI commitหรือreflection apply proof เพราะการสร้างcommitไม่อยู่ในapproval
- Testsเป็นwriter self-checks ไม่ใช่fresh independent acceptance
- ไม่ใช่same-UID anti-tamper boundaryและไม่ห้ามผู้ใช้ใช้Git/FSโดยตรง
- ไม่มีfull native overlay, provider reflection, lifecycle, concurrent writerหรือwhole-project scope proof
- Bulk revert/restoreถูกblockแบบconservative ยังไม่ได้ทำshared-safe history migration
- Proposal-required errorsยังไม่มีpersistent inbox/approval/integrationกลับLetta
- ยังไม่มีinstalled featureหรือglobal configเปลี่ยน

## Artifacts และ next decision

Ignored workspace `.agent-state/tmp/shared-memory-entrypoint-proof-20261002/` มี pinned source copy, sparse fixture, new guard, real-entrypoint tests, TAP, isolated patchและfinal-boundary metadata ไม่publishหรือcommit raw fixture store

**Seam proof complete, activation not ready.** มีevidenceเพียงพอว่า guardต้องอยู่ที่ editor + lower-level repository + atomic reflection preflight + bulk history paths ไม่ใช่เฉพาะprompt/frontmatter

ขั้นถัดไปที่เหมาะสมคือ narrow opt-in implementationสำหรับshared communication sourceในCursor repo หลังreconcile current changes โดยคงnative additionsและnative learningปกติ ส่วนlearningร่วมใหม่ต้องมีpending pathที่ใช้ง่าย ไม่ขยายไปAgyหรือfreeze preferencesทั้งstoreก่อนพิสูจน์เรื่องนี้

ดู [inventory/reconciliation](shared-memory-inventory-2026-10-02.md), [read proof](shared-memory-cursor-proof-2026-10-02.md), [overlay proof](shared-memory-overlay-proof-2026-10-02.md) และ [activation plan](portable-memory-read-adapters.md)
