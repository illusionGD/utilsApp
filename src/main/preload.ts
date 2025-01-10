import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('$api', {
    platform: {
        getPlatform: async () => {
            return await ipcRenderer.invoke('getPlatform')
        },
    },
})
