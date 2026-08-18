export type SourceKind = 'ข้อความจากตอนนั้น' | 'Mahiro ยืนยันภายหลัง' | 'สรุปจากหลายบทสนทนา'

export interface IHistoryEvent {
  id: string
  date: string
  title: string
  summary: string
  details: string[]
  quote?: string
  quoteContext?: string
  after: string
  source: SourceKind
}
