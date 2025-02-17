import { ShowOpenDialogType } from '@renderer/types'
import { isSucCode } from '@renderer/utils'
import { message } from 'antd'
// 设置全局 message 配置
message.config({
    duration: 3, // 显示时间 2 秒
    maxCount: 3 // 最大同时显示 3 条
})
export function handleIpcMainRes<T>(res: { code: string; data: T; message?: string }) {
    // 统一处理报错
    if (!isSucCode(res.code)) {
        console.log('🚀 ~ error.message:', res.message)
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
export async function getFileOrDirPath(
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
        handleIpcMainRes<{
            canceled: boolean
            filePaths: string[]
        }>(res) || []

    return data.filePaths
}

export async function pressDirImageApi(params: {
    outputPath: string
    inputPath: string
    scale?: number
    quality?: number
}) {
    const { inputPath, outputPath, scale, quality } = params

    const res = await window.api.pressDirImage(inputPath, outputPath, { scale, quality })

    const data = handleIpcMainRes(res)

    return data
}
