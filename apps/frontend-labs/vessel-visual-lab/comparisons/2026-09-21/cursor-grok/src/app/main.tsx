import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppStudy } from './app-study'
import '../styles/base.css'
import '../shared/optic-blade.css'
import './app.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Missing #root')
}

createRoot(root).render(
  <StrictMode>
    <AppStudy />
  </StrictMode>,
)
