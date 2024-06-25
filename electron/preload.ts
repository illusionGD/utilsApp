import { ipcRenderer } from 'electron'
import { contextBridge } from 'electron'

const preloadList = [
    {
        name: 'FileNameModule',
        pingMethods: [
            'batchRenameFilesInDirectory',
            'batchRenameFiles',
            'outputFile',
        ],
    },
    {
        name: 'HandleImageModule',
        pingMethods: [
            'pressImageByBase64',
            'pressImageByPath',
            'pressAndResizeImageByPath',
            'batchPressImgAndOutputByPath',
            'pressImgAndOutputByDir',
            'outputBase64Img',
        ],
    },
]

// 向主进程发送消息
contextBridge.exposeInMainWorld('Electron', {
    minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
    closeWindow: () => ipcRenderer.send('closeWindow'),
    selectPath: (...arg) => ipcRenderer.invoke('selectPath', ...arg),
    onMainError: (fn: (msg: string) => void) => {
        // 接收主进程的错误消息
        ipcRenderer.on('mainError', (event, message: string) => {
            fn(message)
        })
    },
})

// 主进程和渲染进程双向通信
preloadList.forEach((item) => {
    const { name, pingMethods } = item
    const ping = {}
    pingMethods.forEach((method) => {
        ping[method] = (...arg) => ipcRenderer.invoke(method, ...arg)
    })
    contextBridge.exposeInMainWorld(name, ping)
})
