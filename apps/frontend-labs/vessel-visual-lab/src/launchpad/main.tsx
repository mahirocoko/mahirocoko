import React from 'react'
import { createRoot } from 'react-dom/client'
import { LaunchpadApp } from './launchpad-app.tsx'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <LaunchpadApp />
    </React.StrictMode>
  )
}
