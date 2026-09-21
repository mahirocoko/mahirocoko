import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WebsitePage } from './website-page'

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <WebsitePage />
    </StrictMode>,
  )
}
