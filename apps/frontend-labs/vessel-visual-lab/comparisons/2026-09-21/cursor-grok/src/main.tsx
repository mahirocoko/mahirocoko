import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Launchpad } from './launchpad'
import './styles/base.css'
import './shared/optic-blade.css'
import './launchpad.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Missing #root')
}

createRoot(root).render(
  <StrictMode>
    <Launchpad />
  </StrictMode>,
)
