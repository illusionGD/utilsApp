import { PressImageParamsType, ShowOpenDialogType } from '@renderer/types'
import { clamp, isSucCode } from '@renderer/utils'
import { message } from 'antd'

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

function formatPressImageParam(params: PressImageParamsType) {
    const { inputPath, outputPath, scale, quality } = params
    return {
        inputPath,
        outputPath,
        opt: { scale: clamp(scale || 100, 1, 100), quality: clamp(quality || 100, 1, 100) }
    }
}

export async function pressDirImageApi(params: PressImageParamsType) {
    const { inputPath, outputPath, opt } = formatPressImageParam(params)

    const res = await window.api.pressDirImage(inputPath, outputPath, opt)

    checkError(res)

    return res
}

/**
 * 批量压缩图片到目标文件夹
 * @param list
 * @param dirPath
 */
export async function batchPressImageToDirApi(list: PressImageParamsType[], dirPath: string) {
    const res = await window.api.batchPressImageToDir(
        list.map((item) => {
            const { inputPath, opt } = formatPressImageParam(item)
            return {
                input: inputPath,
                opt
            }
        }),
        dirPath
    )
    checkError(res)
    return res
}

export async function batchPressImageApi(list: PressImageParamsType[]) {
    const res = await window.api.batchPressImage(
        list.map((item) => {
            const { inputPath, outputPath, opt } = formatPressImageParam(item)
            return {
                input: inputPath,
                output: outputPath,
                opt
            }
        })
    )
    checkError(res)
    return res
}
