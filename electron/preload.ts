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

contextBridge.exposeInMainWorld('Electron', {
    minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
    closeWindow: () => ipcRenderer.send('closeWindow'),
    selectPath: (...arg) => ipcRenderer.invoke('selectPath', ...arg),
})

preloadList.forEach((item) => {
    const { name, pingMethods } = item
    const ping = {}
    pingMethods.forEach((method) => {
        ping[method] = (...arg) => ipcRenderer.invoke(method, ...arg)
    })
    contextBridge.exposeInMainWorld(name, ping)
})
