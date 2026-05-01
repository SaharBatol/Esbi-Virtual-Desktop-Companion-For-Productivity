import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import Database from 'better-sqlite3'
import { staggeredFunctionCalling } from './utils'
import { setUpDatabase, setUpIpcHandlers } from './ipcHandler'

let db = {}
let mainWindow

function createWindow() {
  let expanded = true

  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
  const scale = display.scaleFactor

  const { x, y, width, height } = display.workArea

  const minWidth = 576
  const minHeight = 412
  const expandedWidth = Math.floor(width * 0.3)
  // const expandedHeight = Math.floor(height * 0.4)
  const expandedHeight = Math.floor(height * 0.4) > minHeight ? Math.floor(height * 0.4) : minHeight
  const collapsedHeight = Math.floor(expandedHeight * 0.3)

  const win = new BrowserWindow({
    width: expandedWidth,
    height: expandedHeight,
    resizable: false,
    frame: false,
    show: false,
    transparent: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  mainWindow = win

  const posX = (x + width) * 0.6
  const posY = y + height - expandedHeight

  win.setBounds({
    x: posX,
    y: posY
  })

  win.on('ready-to-show', () => {
    win.setAlwaysOnTop(true, 'screen-saver')
    win.setMinimumSize(minWidth, minHeight)
    win.show()
    win.focus()

    const [w, h] = win.getSize()
    win.setSize(w, h)

    win.webContents.send('update-height', `${h}px`)
  })

  win.on('focus', () => {
    win.flashFrame(false)
  })

  ipcMain.on('flash-window', () => {
    if (!mainWindow) return

    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }

    if (mainWindow.isVisible()) {
      mainWindow.focus()
    } else {
      mainWindow.show()
    }

    mainWindow.flashFrame(true)
  })

  ipcMain.handle('collapse', () => {
    if (!mainWindow) return

    let targetHeight
    let newPosY
    let newMinHeight

    if (!expanded) {
      targetHeight = expandedHeight
      newMinHeight = minHeight
      newPosY = posY
    } else {
      newMinHeight = collapsedHeight
      targetHeight = collapsedHeight
      newPosY = posY + expandedHeight - collapsedHeight
    }

    const updateBodyHeight = () => {
      mainWindow.webContents.send(
        'update-height',
        `${targetHeight > newMinHeight ? targetHeight : newMinHeight}px`
      )
    }

    const updateWindowHeight = () => {
      mainWindow.setMinimumSize(minWidth, newMinHeight)
      mainWindow.setSize(expandedWidth, targetHeight, true)
      mainWindow.setPosition(posX, newPosY)
    }

    const funcOne = expanded ? updateBodyHeight : updateWindowHeight
    const delay = expanded ? 900 : 100

    staggeredFunctionCalling(funcOne, delay).then(() => {
      if (expanded) {
        updateBodyHeight()
      } else {
        updateWindowHeight()
      }
    })

    expanded = !expanded
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  const dbPath = join(app.getPath('userData'), 'app.db')

  console.log(dbPath)
  db = new Database(dbPath)
  setUpIpcHandlers(db)
  setUpDatabase(db)

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  screen.on('display-metrics-changed', () => {
    if (!mainWindow) return

    const display = screen.getDisplayNearestPoint(mainWindow.getBounds())
    const { width, height } = display.workAreaSize

    mainWindow.setSize(Math.floor(width * 0.3), Math.floor(height * 0.3))
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

ipcMain.on('app:quit', () => {
  app.quit()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
