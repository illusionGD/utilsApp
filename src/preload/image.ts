import { dirname, join, parse, resolve } from 'path'
import { MainResType } from '.'
import { getResForm } from './utils'
import { existsSync, mkdirSync, readdirSync, renameSync, statSync } from 'fs'
// import sharp from 'sharp'
const sharp = require('sharp')

interface PressOptType {
    scale?: number
    quality?: number
}

interface pressListType {
    input: string
    output: string
    opt: PressOptType
}

/** 压缩单张图片 */
export async function pressSingleImg(
    input: string,
    output: string,
    opt: PressOptType
): Promise<MainResType<any>> {
    const { scale, quality } = opt
    const { ext } = parse(input)
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif']
    if (!supportedFormats.includes(ext)) {
        return getResForm(null, '')
    }

    const { width, height, format } = await sharp(input).metadata()
    if (!format) {
        return getResForm(null, '')
    }
    // 支持的图片格式
    // 缩放
    const newWidth = (width || 0) * (scale || 1)
    const newHeight = (height || 0) * (scale || 1)

    let outPath = output

    if (input === output) {
        const { name, ext, dir } = parse(output)
        outPath = join(dir, `${name}.temp${ext}`)
    } else {
        // 创建输出目录（如果不存在）
        const outputDir = dirname(output)
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true })
        }
    }

    // 压缩
    const res = await new Promise((resolve, reject) => {
        sharp(input)
            .resize({
                width: newWidth,
                height: newHeight
            })
            [format]({ quality })
            .toFile(outPath, (err, info) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            })
    })

    try {
        if (!(res instanceof Error)) {
            renameSync(outPath, output)
        }

        return getResForm(res)
    } catch (error) {
        return getResForm(error, '')
    }
}

/** 批量压缩图片 */
export async function batchPressImage(list: pressListType[]) {
    // 校验输出路径
    const resList = await Promise.all(
        list.map((item) => pressSingleImg(item.input, item.output, item.opt))
    )
    let errorCount = 0
    let successCount = 0

    resList.forEach(({ code }) => {
        if (code !== '100') {
            errorCount += 1
        } else {
            successCount += 1
        }
    })

    return getResForm({ count: resList.length, successCount, errorCount })
}

export async function pressDirImage(inputDir: string, outputDir: string, opt: PressOptType) {
    try {
        const pressQueue: pressListType[] = []
        const deepDir = function (inputDir: string, outputDir: string, opt: PressOptType) {
            const items = readdirSync(inputDir)

            items.forEach((item) => {
                const itemPath = join(inputDir, item)
                const outPath = join(outputDir, item)
                const stats = statSync(itemPath)

                if (stats.isDirectory()) {
                    // 如果是文件夹，递归处理
                    deepDir(itemPath, outPath, opt)
                } else if (stats.isFile()) {
                    pressQueue.push({
                        input: itemPath,
                        output: outPath,
                        opt
                    })
                }
            })
        }

        deepDir(inputDir, outputDir, opt)

        return batchPressImage(pressQueue)
    } catch (error: any) {
        return getResForm(error, '', error.message)
    }
}
