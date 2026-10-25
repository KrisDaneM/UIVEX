import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app/App'
import { UivexProvider } from './app/UivexContext'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UivexProvider><App /></UivexProvider>
    </BrowserRouter>
  </StrictMode>,
)
