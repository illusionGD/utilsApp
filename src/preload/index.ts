import { contextBridge, dialog, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { pressSingleImg } from './image'
import { getResForm } from './utils'

/** main进程出来逻辑 */
export const api = {
    showOpenDialog: async (arg) => {
        const data = await dialog.showOpenDialog(arg)
        return getResForm(data)
    },
    pressSingleImg
}

/** 获取暴露给main进程的api，用invoke双通信 */
function getExposeInMainWorld() {
    const obj = {}
    for (const key in api) {
        if (Object.prototype.hasOwnProperty.call(api, key)) {
            obj[key] = (opt) => ipcRenderer.invoke(key, opt)
        }
    }
    return obj
}

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', getExposeInMainWorld())
    } catch (error) {
        console.error(error)
    }
}
