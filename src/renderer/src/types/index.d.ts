export interface ShowOpenDialogType {
    /** 默认路径 */
    defaultPath?: string
    /** 文件过滤 */
    filters?: {
        name?: string
        extensions?: string[]
    }[]
    /** 是否多选 */
    multi?: boolean
}

export interface AnyObject {
    [key: string | number | symbol]: any
}

export interface PressImageParamsType {
    outputPath: string
    inputPath: string
    scale?: number
    quality?: number
}
