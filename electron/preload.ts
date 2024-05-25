import { ipcRenderer } from 'electron'
import { RenameFileConfigType } from '../src/types'

const { contextBridge } = require('electron')

const goldaList = [
    {
        name: 'FileNameModule',
        ping: {
            batchRenameFilesInDirectory: (filePath: string, newName: string) =>
                ipcRenderer.invoke(
                    'batchRenameFilesInDirectory',
                    filePath,
                    newName
                ),

            batchRenameFiles: (
                pathList: string[],
                config: RenameFileConfigType
            ) => ipcRenderer.invoke('batchRenameFiles', pathList, config),
        },
    },
]

goldaList.forEach((item) => {
    const { name, ping } = item
    contextBridge.exposeInMainWorld(name, ping)
})
