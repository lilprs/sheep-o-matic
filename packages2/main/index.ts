import os from 'os'
import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import * as db from './db.mjs'
import { seed } from './seed.mjs'

// https://stackoverflow.com/questions/42524606/how-to-get-windows-version-using-node-js
const isWin7 = os.release().startsWith('6.1')
if (isWin7) app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
    },
  })

  if (app.isPackaged) {
    win.loadFile(
      path.join(__dirname, '../renderer/index.html')
    )
  } else {
    const pkg = await import('../../package.json')
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${
      pkg.env.PORT
    }`

    win.loadURL(url)
    win.webContents.openDevTools()
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('second-instance', () => {
  if (win) {
    // someone tried to run a second instance, we should focus our window.
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

// @TODO
// auto update
/* if (app.isPackaged) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) =>
      // maybe you need to record some log files.
      console.error('Failed check update:', e)
    )
} */

ipcMain.on('db_query_sheep', (event, arg) => {
  const stmt_count = db.db.prepare(`
  select count(*) from "animals"
  where lower("registration_number") like :search
`)
  const count = stmt_count.get(arg)['count(*)']
  const stmt = db.db.prepare(`
  select * from "animals"
  where lower("registration_number") like :search
  order by ${arg.order_field} ${arg.order_sort}
  limit :offset, :limit
`)
  const list = stmt.all(arg)
  event.returnValue = {
    total: count,
    list,
  }
})

ipcMain.on('db_insert_animal', (event, arg) => {
  const stmt = db.db.prepare(`
  insert into "animals" (
    "type",
    "registration_number",
    "mother_registration_number",
    "birth_date",
    "marking_date",
    "father_registration_number",
    "genotype",
    "przybycie_date",
    "przybycie_type",
    "przybycie_place_info",
    "ubycie_date",
    "ubycie_type",
    "ubycie_place_info",
    "ubycie_carrier_info",
    "karyotype",
    "comments",
    "use_type"
  ) values (
    :type,
    :registration_number,
    :mother_registration_number,
    :birth_date,
    :marking_date,
    :father_registration_number,
    :genotype,
    :przybycie_date,
    :przybycie_type,
    :przybycie_place_info,
    :ubycie_date,
    :ubycie_type,
    :ubycie_place_info,
    :ubycie_carrier_info,
    :karyotype,
    :comments,
    :use_type
  )
`)
  console.log('asd', arg)
  stmt.run({
    ...arg,
    birth_date: arg.birth_date.toISOString(),
    marking_date: arg.marking_date.toISOString(),
  })
  event.returnValue = 'ok'
})

ipcMain.on('db_find_by_number', (event, arg) => {
  const stmt = db.db.prepare(`
  select * from "animals"
  where lower("registration_number") = :search
`)
  const found = stmt.all(arg)[0]
  event.returnValue = found
})

ipcMain.on('db_seed_sheep', (event, arg) => {
  const list = seed()
  event.returnValue = 'ok'
})
