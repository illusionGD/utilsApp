import { PressImageParamsType } from '@renderer/types'
import { checkError } from '.'
import { clamp } from '@renderer/utils'

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

export function getImageFiles() {}
