import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WebsitePage } from './website-page'
import '../styles/base.css'
import '../shared/optic-blade.css'
import './website.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Missing #root')
}

createRoot(root).render(
  <StrictMode>
    <WebsitePage />
  </StrictMode>,
)
