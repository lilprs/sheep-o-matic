import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import toast from 'react-hot-toast'
import App from './App'
import {
  openDatabase,
  saveDatabase,
  store,
} from './database'
import './styles/index.css'

window.ipcRenderer.on('imported-data', (event, data) => {
  try {
    const parsed = JSON.parse(data)
    if (parsed._version !== 1) {
      toast.error(
        'Nie można zaimportować bazy danych: niezgodna wersja'
      )
      return
    }
    store.setState({
      animals: parsed.animals,
      settings: parsed.settings,
    })
    saveDatabase()
  } catch (e: any) {
    toast.error(
      'Nie można zaimportować bazy danych: ' + e?.message ??
        'nieznany błąd'
    )
    return
  }
  toast.success('Pomyślnie zaimportowano bazę danych')
})

window.ipcRenderer.on('export-ok', (event) => {
  toast.success(
    'Pomyślnie wyeksportowano bazę danych do pliku'
  )
})

window.ipcRenderer.on('pdf-ok', (event) => {
  toast.success('Pomyślnie wygenerowano raport')
})

openDatabase().then(() => {
  const root = createRoot(document.getElementById('root')!)

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )

  window.removeLoading()
})
