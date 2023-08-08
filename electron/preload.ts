import { ipcRenderer } from 'electron'

const { contextBridge } = require('electron')

const goldaList = [
    {
        name: 'fileName',
        ping: {
            batchRenameFilesInDirectory: (filePath: string, newName: string) =>
                ipcRenderer.invoke(
                    'batchRenameFilesInDirectory',
                    filePath,
                    newName
                ),
        },
    },
]

goldaList.forEach((item) => {
    const { name, ping } = item
    contextBridge.exposeInMainWorld(name, ping)
})
