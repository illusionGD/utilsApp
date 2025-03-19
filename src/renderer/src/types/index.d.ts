import { IMG_EXT_ENUM } from '@renderer/constants'

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
    /** 输出路径 */
    outputPath: string
    /** 图片路径 */
    inputPath: string
    /** 缩放倍率 */
    scale?: number
    /** 质量 */
    quality?: number
    /** 目标图片后缀 */
    targetExt?: IMG_EXT_ENUM
}
