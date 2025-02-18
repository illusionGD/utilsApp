import { dirname, join, parse, resolve } from 'path'
import { MainResType } from '.'
import { getResForm } from './utils'
import { existsSync, mkdirSync, readdirSync, renameSync, statSync } from 'fs'
import { dialog } from 'electron'
// import sharp from 'sharp'
const sharp = require('sharp')

interface PressImageOptType {
    scale?: number
    quality?: number
}

interface pressImageListType {
    /** 输入路径 */
    input: string
    /** 输出路径 */
    output: string
    /** 压缩配置 */
    opt: PressImageOptType
}
const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif']

/** 压缩单张图片 */
export async function pressSingleImg(
    input: string,
    output: string,
    opt: PressImageOptType
): Promise<MainResType<any>> {
    try {
        const { scale, quality } = opt
        const { ext } = parse(input)
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

        if (!(res instanceof Error)) {
            renameSync(outPath, output)
        }

        return getResForm(res)
    } catch (error) {
        return getResForm(error, '')
    }
}

/** 批量压缩图片 */
export async function batchPressImage(list: pressImageListType[]) {
    // 校验输出路径
    const resList = await Promise.all(
        list.map((item) => pressSingleImg(item.input, item.output, item.opt))
    )
    let failCount = 0
    let successCount = 0

    resList.forEach(({ code }) => {
        if (code !== '100') {
            failCount += 1
        } else {
            successCount += 1
        }
    })

    return getResForm({ count: resList.length, successCount, failCount })
}

/**
 * 批量压缩图片到目标文件夹
 * @param list
 * @param dirPath 目标文件夹
 */
export async function batchPressImageToDir(
    list: Omit<pressImageListType, 'output'>[],
    dirPath: string
) {
    const pressList = list.map(({ input, opt }) => {
        const { base } = parse(input)
        const output = join(dirPath, base)
        return {
            input,
            output,
            opt
        }
    })
    return batchPressImage(pressList)
}

/**
 * 压缩文件夹下的图片
 * @param inputDir 输入文件夹路径
 * @param outputDir 输出文件夹路径
 * @param opt 压缩配置
 */
export async function pressDirImage(inputDir: string, outputDir: string, opt: PressImageOptType) {
    try {
        const pressQueue: pressImageListType[] = []
        const deepDir = function (inputDir: string, outputDir: string, opt: PressImageOptType) {
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
        return getResForm({ failCount: 0, successCount: 0, count: 0 }, '', error.message)
    }
}
