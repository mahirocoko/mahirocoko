import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { createApiApp } from './app'

const API_PORT = Number(process.env.PORT ?? 8787)
const isProd = process.env.NODE_ENV === 'production'
const clientBuildRoot = './build/client'
const clientIndexPath = join(process.cwd(), 'build', 'client', 'index.html')

const app = new Hono()

app.route('/api', createApiApp())

if (isProd) {
  app.use(
    '/*',
    serveStatic({
      root: clientBuildRoot,
    }),
  )
}

app.notFound((c) => {
  if (c.req.path.startsWith('/api')) {
    return c.json({ error: 'ไม่พบเส้นทาง' }, 404)
  }
  if (isProd) {
    try {
      return c.html(readFileSync(clientIndexPath, 'utf-8'))
    } catch {
      return c.text('ยังไม่ได้ build ส่วนหน้าเว็บ (build/client)', 500)
    }
  }
  return c.json({ error: 'not found' }, 404)
})

serve(
  {
    fetch: app.fetch,
    port: API_PORT,
  },
  (info) => {
    console.log(`Blue Ledger ที่ http://localhost:${info.port}`)
    if (isProd) {
      console.log('โหมด production: ให้บริการ API และไฟล์จาก ./build/client')
    } else {
      console.log('โหมด dev: รัน Vite แยกที่พอร์ตอื่น แล้ว proxy /api มาที่นี่')
    }
  },
)
