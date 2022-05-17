import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { openDatabase } from './database'
import './styles/index.css'

openDatabase().then(() => {
  const root = createRoot(document.getElementById('root')!)

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )

  window.removeLoading()
})
