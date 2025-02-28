import { PressImageParamsType } from '@renderer/types'
import { checkError, getFileOrDirPathApi } from '.'
import { clamp, formatFileSize } from '@renderer/utils'
import { IMG_EXT_ENUM, IMG_EXT_LIST } from '@renderer/constants'

function formatPressImageParam(params: PressImageParamsType) {
    const { inputPath, outputPath, scale, quality } = params
    return {
        inputPath,
        outputPath,
        opt: { scale: clamp(scale || 100, 1, 100), quality: clamp(quality || 100, 1, 100) }
    }
}

/**
 * 压缩文件夹下的图片
 */
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

/**
 * 批量压缩图片
 * @param list
 * @param dirPath
 */
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

/** 选择图片 */
export async function selectImageFiles() {
    const pathList = await getFileOrDirPathApi(
        {
            multi: true,
            filters: [
                {
                    extensions: IMG_EXT_LIST
                }
            ]
        },
        false
    )

    const { data } = await window.api.getImageBuffer(pathList)
    return data.map((item) => {
        if (item) {
            const { ext, name, data, path } = item
            const type = `image/${ext.replace('.', '')}`
            const blob = new Blob([data], { type })
            return { name, data: blob, path, size: blob.size, type }
        }
        return null
    })
}
