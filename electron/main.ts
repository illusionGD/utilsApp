import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { AnyObject } from '../src/types'
import * as FileNameModule from './fileName'
import * as ImageModule from './handleImage'

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged
    ? process.env.DIST
    : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

app.whenReady().then(() => {
    initMainHandle(FileNameModule)
    initMainHandle(ImageModule)
    createWindow()
})

app.on('window-all-closed', () => {
    win = null
})

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

function initMainHandle(module: AnyObject) {
    Object.keys(module).forEach((key) => [
        ipcMain.handle(key, async (event: any, ...arg) => {
            return await module[key](...arg)
        }),
    ])
}
