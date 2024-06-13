import { ipcRenderer } from 'electron'
import { contextBridge } from 'electron'

const preloadList = [
    {
        name: 'FileNameModule',
        pingMethods: ['batchRenameFilesInDirectory', 'batchRenameFiles'],
    },
    {
        name: 'HandleImageModule',
        pingMethods: [
            'pressImageByBase64',
            'pressImageByPath',
            'pressAndResizeImageByPath',
            'batchPressImgAndOutputByPath',
            'pressImgAndOutputByDir',
        ],
    },
]

contextBridge.exposeInMainWorld('Electron', {
    minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
    closeWindow: () => ipcRenderer.send('closeWindow'),
})

preloadList.forEach((item) => {
    const { name, pingMethods } = item
    const ping = {}
    pingMethods.forEach((method) => {
        ping[method] = (...arg) => ipcRenderer.invoke(method, ...arg)
    })
    contextBridge.exposeInMainWorld(name, ping)
})
