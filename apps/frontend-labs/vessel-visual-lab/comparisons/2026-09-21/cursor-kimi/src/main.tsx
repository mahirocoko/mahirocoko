import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Launchpad } from './launchpad'

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Launchpad />
    </StrictMode>,
  )
}
