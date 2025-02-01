import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
    interface Window {
        electron: ElectronAPI
        api: WindowApiType
    }
}

export interface WindowApiType {
    [key: string]: <T>(arg?: any) => Promise<ApiResponseType>
}

export interface ApiResponseType {
    code: string
    data: T
}
