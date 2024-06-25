import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
import { AnyObject, SelectPathType } from '../src/types'
import * as FileNameModule from './fileName'
import * as ImageModule from './handleImage'

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged
    ? process.env.DIST
    : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
app.whenReady().then(() => {
    const wind = createWindow()
    // 最小化
    ipcMain.on('minimizeWindow', () => {
        win.minimize()
    })
    // 关闭
    ipcMain.on('closeWindow', () => {
        win.close()
    })
    // 选择文件路径
    ipcMain.handle('selectPath', async (e, params: SelectPathType) => {
        const { isDir, multi } = params
        const properties = []

        properties.push(isDir ? 'openDirectory' : 'openFile')
        multi && properties.push('multiSelections')

        const result = await dialog.showOpenDialog(wind, {
            properties,
        })
        return result.filePaths
    })
    initMainHandle(wind, FileNameModule)
    initMainHandle(wind, ImageModule)
})

app.on('window-all-closed', () => {
    win = null
})

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(process.env.PUBLIC, 'logo.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        autoHideMenuBar: true,
        frame: false,
        titleBarStyle: 'hidden',
    })

    if (process.env.NODE_ENV.trim() === 'development') {
        // 打开调试
        win.webContents.openDevTools()
    }

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(process.env.DIST, 'index.html'))
    }

    return win
}

/** 初始化主线程模块处理函数 */
function initMainHandle(wind: BrowserWindow, module: AnyObject) {
    Object.keys(module).forEach((key) => [
        ipcMain.handle(key, async (event: any, ...arg) => {
            try {
                return await module[key](...arg)
            } catch (error) {
                // 向渲染进程发送错误消息
                wind.webContents.send(
                    'mainError',
                    typeof error === 'string' ? error : `${error}`
                )

                throw error
            }
        }),
    ])
}
