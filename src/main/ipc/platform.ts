import { ipcMain } from 'electron'

ipcMain.handle('getPlatform', () => {
    return process.platform
})
