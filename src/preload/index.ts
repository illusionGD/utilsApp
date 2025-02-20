import { contextBridge, dialog, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import {
    batchPressImage,
    pressDirImage,
    pressSingleImg,
    batchPressImageToDir,
    bufferToImg,
    getDirImageBuffer
} from './image'
import { getFile } from './file'

export interface MainResType<T> {
    code: string
    data: T
    message: string
}

/** main进程出来逻辑api */
export const api = {
    showOpenDialog: async (arg) => {
        const data = await dialog.showOpenDialog(arg)
        return data
    },
    pressSingleImg,
    pressDirImage,
    batchPressImage,
    batchPressImageToDir,
    getFile,
    bufferToImg,
    getDirImageBuffer
}
type TransformReturnSync<T> = {
    [K in keyof T]: T[K] extends (...args: infer P) => any
        ? (
              ...args: P
          ) => Promise<{ code: string; data: Awaited<ReturnType<T[K]>>; message: string }>
        : never
}

/** 挂载到window上的api类型 */
export type WindowApiType = TransformReturnSync<typeof api>

/** 获取暴露给main进程的api，用invoke双通信 */
function getExposeInMainWorld() {
    const obj = {}
    for (const key in api) {
        if (Object.prototype.hasOwnProperty.call(api, key)) {
            obj[key] = (...args) => ipcRenderer.invoke(key, ...args)
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
