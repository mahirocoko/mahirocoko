import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppStudy } from './app-study'

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppStudy />
    </StrictMode>,
  )
}
