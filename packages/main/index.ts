import {
  app,
  BrowserWindow,
  shell,
  dialog,
  ipcMain,
} from 'electron'
import { release } from 'os'
import { join } from 'path'
import { writeFile, readFile } from 'fs/promises'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1'))
  app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32')
  app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    minWidth: 920,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
    },
  })

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

    win.loadURL(url)
    // win.webContents.openDevTools()
  }

  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send(
      'main-process-message',
      new Date().toLocaleString()
    )
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  app.quit()
  // if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

ipcMain.on('print-to-pdf', async function (event, arg) {
  const pdfPath = await (dialog as any).showSaveDialog({
    defaultPath: 'raport.pdf',
  })
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
  })
  await win.loadURL(
    'data:text/html;charset=utf-8,' +
      encodeURIComponent(arg)
  )
  const printed = await win.webContents.printToPDF({
    printBackground: true,
    landscape: true,
    marginsType: 2,
  })
  win.destroy()

  await writeFile(pdfPath.filePath, printed)
  // shell.openExternal('file://' + pdfPath)
  // event.sender.send('wrote-pdf', pdfPath)
  event.reply('pdf-ok')
})

ipcMain.on('save-exported', async function (event, data) {
  const filePath = await (dialog as any).showSaveDialog({
    defaultPath: `baza-${
      new Date().toISOString().split('T')[0]
    }.json`,
  })
  if (!filePath.filePath) {
    return
  }
  await writeFile(filePath.filePath, data)
  event.reply('export-ok')
})

ipcMain.on('open-exported', async function (event) {
  const filePath = await (dialog as any).showOpenDialog({
    properties: ['openFile'],
  })
  if (!filePath.filePaths[0]) {
    return
  }
  const data = await readFile(
    filePath.filePaths[0],
    'utf-8'
  )
  event.reply('imported-data', data)
})
