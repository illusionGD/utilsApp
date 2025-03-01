import { PrefixSuffixTypeEnum } from '@renderer/constants'
import { PressImageParamsType, ShowOpenDialogType } from '@renderer/types'
import { clamp, isSucCode } from '@renderer/utils'
import { message } from 'antd'
export * from './image'

export function checkError<T>(res: { code: string; data: T; message?: string }) {
    // 统一处理报错
    if (!isSucCode(res.code)) {
        console.log('🚀 ~ res:', res)
        message.error(res.message)
    }

    return res.data
}

/**
 * 获取文件 or 文件夹路径
 * @param param
 * @param isDir 是否为文件夹
 * @returns
 */
export async function getFileOrDirPathApi(
    { multi, filters }: ShowOpenDialogType,
    isDir: boolean = false
) {
    const properties: string[] = [isDir ? 'openDirectory' : 'openFile']

    if (multi) {
        properties.push('multiSelections')
    }

    const res = await window.api.showOpenDialog({
        filters,
        properties
    })
    const data =
        checkError<{
            canceled: boolean
            filePaths: string[]
        }>(res) || []

    return data.filePaths
}

interface RenameFilesOptions {
    dir: string // 目标文件夹路径
    newName: string // 新的文件名（中间部分）
    prefixType?: PrefixSuffixTypeEnum // 前缀类型 ('number' | 'letter')
    suffixType?: PrefixSuffixTypeEnum // 后缀类型 ('number' | 'letter')
    startNumber?: number // 数字递增起始值
    step?: number // 递增步长
    extensions?: string[] // 需要修改的文件类型（可选）
}
export async function renameFilesApi(options: RenameFilesOptions) {
    return window.api.renameFiles(options)
}
