import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppWorkbench } from './app-workbench.tsx'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <AppWorkbench />
    </React.StrictMode>
  )
}
