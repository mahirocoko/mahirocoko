import type { LedgerEntryType } from './types'

export const LEDGER_STORAGE_KEY = 'blue-ledger.entries.v1'
export const MAX_RECENT_ENTRIES = 8
export const STORAGE_RECOVERY_MESSAGE =
  'พบข้อมูลเดิมที่อ่านไม่ได้ ระบบจึงรีเซ็ตกลับเป็นรายการว่างอย่างปลอดภัยแล้ว'

export const STARTER_CATEGORIES: Record<LedgerEntryType, string[]> = {
  income: ['เงินเดือน', 'ฟรีแลนซ์', 'โบนัส', 'ขายของ', 'ดอกเบี้ย', 'อื่นๆ'],
  expense: ['อาหาร', 'เดินทาง', 'ของใช้', 'บิล', 'สุขภาพ', 'อื่นๆ'],
}
