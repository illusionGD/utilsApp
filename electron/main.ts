import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { ImgTypeEnum, RenameFileConfigType } from '../src/types'
import { batchRenameFiles, batchRenameFilesInDirectory } from './fileName'
import {
    pressAndResizeImageByPath,
    pressImageByBuffer,
    pressImageByPath,
} from './handleImage'

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged
    ? process.env.DIST
    : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

app.whenReady().then(() => {
    ipcMain.handle(
        'batchRenameFilesInDirectory',
        async (event: any, filePath: string, newName: string) => {
            await batchRenameFilesInDirectory(filePath, newName)
            return true
        }
    )

    ipcMain.handle(
        'batchRenameFiles',
        async (
            event: any,
            pathList: string[],
            config: RenameFileConfigType
        ) => {
            await batchRenameFiles(pathList, config)
            return true
        }
    )

    ipcMain.handle(
        'pressImageByBase64',
        async (
            event: any,
            base64: string,
            type: ImgTypeEnum,
            quality: number
        ) => {
            const buffer = Buffer.from(
                base64.replace(/^data:image\/\w+;base64,/, ''),
                'base64'
            )
            const newBuffer = await pressImageByBuffer(buffer, type, quality)
            return newBuffer
        }
    )
    ipcMain.handle(
        'pressImageByPath',
        async (event: any, path: string, quality: number) => {
            const newBuffer = await pressImageByPath(path, quality)
            return newBuffer
        }
    )
    ipcMain.handle(
        'pressAndResizeImageByPath',
        async (
            event: any,
            path: string,
            width: number,
            height: number,
            quality: number
        ) => {
            const newBuffer = await pressAndResizeImageByPath(
                path,
                width,
                height,
                quality
            )
            return newBuffer
        }
    )

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
