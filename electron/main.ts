import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { batchRenameFilesInDirectory } from './fileName'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged
    ? process.env.DIST
    : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send(
            'main-process-message',
            new Date().toLocaleString()
        )
    })
    // 打开调试
    win.webContents.openDevTools()

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(process.env.DIST, 'index.html'))
    }
}

app.on('window-all-closed', () => {
    win = null
})

app.whenReady().then(() => {
    ipcMain.handle(
        'batchRenameFilesInDirectory',
        (event: any, filePath: string, newName: string) => {
            console.log('🚀 ~ file: main.ts:59 ~ event:', event)
            console.log('🚀 ~ file: main.ts:59 ~ newName:', newName)
            console.log('🚀 ~ file: main.ts:59 ~ filePath:', filePath)
            batchRenameFilesInDirectory(filePath, newName)
            return true
        }
    )
    createWindow()
})
