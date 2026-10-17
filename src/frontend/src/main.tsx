import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Set browser tab title from env — falls back to 'Workshop App'
document.title = import.meta.env.VITE_APP_NAME || 'Workshop App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
