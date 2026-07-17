import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from './app'

const renderAt = (initialEntries = ['/']) => render(
  <MemoryRouter initialEntries={initialEntries}>
    <App />
  </MemoryRouter>,
)

describe('Chiang Mai journal issue slice', () => {
  it('renders the Home issue spread and chapter index', () => {
    renderAt()

    expect(screen.getByRole('heading', { level: 1, name: 'เมืองที่ทำด้วยมือ' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'เริ่มอ่านบทที่ 01' })).toHaveAttribute('href', '/stories/city-lettering')
    expect(screen.getByRole('heading', { name: 'ตัวอักษรของเมือง' })).toBeVisible()
    expect(screen.getAllByText('กำลังจัดทำ')).toHaveLength(3)
  })

  it('navigates from Home to the complete article', async () => {
    const user = userEvent.setup()
    renderAt()

    await user.click(screen.getByRole('link', { name: 'เริ่มอ่านบทที่ 01' }))

    expect(screen.getByRole('heading', { level: 1, name: 'เมื่อชื่อร้านยังเริ่มจากปลายพู่กัน' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'เส้นที่เริ่มจากมือ' })).toBeVisible()
    expect(screen.getByText('ความไม่เท่ากันไม่ได้แปลว่างานยังไม่เสร็จ บางครั้งนั่นคือหลักฐานว่างานชิ้นนี้ผ่านมือใครมา')).toBeVisible()
  })

  it('renders article disclosure and back navigation', () => {
    renderAt(['/stories/city-lettering'])

    expect(screen.getByRole('link', { name: /กลับไปหน้าฉบับ/ })).toHaveAttribute('href', '/')
    expect(screen.getByRole('heading', { name: 'ที่มาของเนื้อหา' })).toBeVisible()
    expect(screen.getByText(/ไม่ได้บันทึกป้าย ร้าน หรือช่างทำป้ายรายใดจริง/)).toBeVisible()
  })

  it('connects the promoted desktop and mobile editorial assets', () => {
    const { unmount } = renderAt()
    const cover = screen.getByAltText('ภาพ collage เชิงแนวคิดของพื้นที่ทำงาน ป้ายเปล่า พู่กัน และพื้นผิวเมือง')

    expect(cover).toHaveAttribute('src', '/assets/editorial/issue-01/cover-collage-wide.webp')
    expect(cover.closest('picture')?.querySelector('source')).toHaveAttribute(
      'srcset',
      '/assets/editorial/issue-01/cover-collage-portrait.webp',
    )

    unmount()
    renderAt(['/stories/city-lettering'])

    expect(screen.getByAltText('ภาพ collage เชิงแนวคิดของโต๊ะทำป้ายเปล่า พู่กัน และรอยสี')).toHaveAttribute(
      'src',
      '/assets/editorial/issue-01/chapter-lettering-collage.webp',
    )

    const materialStudy = screen.getByAltText('ภาพวัตถุศึกษาเชิงแนวคิดของพู่กัน สี กระดาษ ไม้ และโลหะ')
    expect(materialStudy).toHaveAttribute('src', '/assets/editorial/issue-01/article-lettering-detail-wide.webp')
    expect(materialStudy.closest('picture')?.querySelector('source')).toHaveAttribute(
      'srcset',
      '/assets/editorial/issue-01/article-lettering-detail-portrait.webp',
    )
  })

  it('keeps caption and provenance when a promoted image is missing', () => {
    renderAt()

    fireEvent.error(screen.getByAltText('ภาพ collage เชิงแนวคิดของพื้นที่ทำงาน ป้ายเปล่า พู่กัน และพื้นผิวเมือง'))

    expect(screen.getByRole('img', { name: /ภาพยังไม่พร้อมใช้งาน/ })).toBeVisible()
    expect(screen.getByText('ภาพเปิดฉบับ · เมืองที่ทำด้วยมือ')).toBeVisible()
    expect(screen.getByText(/ไม่ใช่ภาพสารคดีเชียงใหม่จริง/)).toBeVisible()
  })
})
