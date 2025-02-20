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
