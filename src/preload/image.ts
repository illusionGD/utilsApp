import { dirname, join, parse } from 'path'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFile } from 'fs'
import { forEachDir, getFile } from './file'
const sharp = require('sharp')

interface PressImageOptType {
    scale?: number
    quality?: number
    /** 后缀 */
    targetExt?: string
}

interface pressImageListType {
    /** 输入路径 */
    input: string
    /** 输出路径 */
    output: string
    /** 压缩配置 */
    opt: PressImageOptType
}
const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif', '.svg'] as const
type supportedFormatsType = (typeof supportedFormats)[number]

function isSupportedImage(type: string): type is supportedFormatsType {
    return supportedFormats.includes(type as supportedFormatsType)
}

/** 压缩单张图片 */
export async function pressSingleImg(
    input: string,
    output: string,
    opt: PressImageOptType
): Promise<any> {
    const { scale, quality, targetExt } = opt
    const { ext } = parse(input)
    if (!isSupportedImage(ext)) {
        return
    }

    const { width, height, format } = await sharp(input).metadata()
    if (!format) {
        return ''
    }
    // 缩放
    const newWidth = (width || 0) * (scale || 1)
    const newHeight = (height || 0) * (scale || 1)

    const outputDir = dirname(output)
    let outputPath = output
    // 替换后缀
    if (targetExt) {
        const { ext, base } = parse(output)
        outputPath = join(outputDir, base.replace(ext, targetExt))
    }

    if (input !== outputPath) {
        // 创建输出目录（如果不存在）
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true })
        }
    }

    const buffer = readFileSync(input)

    // 压缩
    const res = await new Promise((resolve, reject) => {
        const { ext } = parse(outputPath)
        const format = ext.replace('.', '')
        sharp(buffer)
            .resize(newWidth, newHeight) // 调整图像大小
            .toFormat(format === 'jpg' ? 'jpeg' : format, { quality }) // 转换为 JPEG 格式，设置质量
            .toBuffer()
            .then((outputBuffer) => {
                writeFile(outputPath, outputBuffer, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(outputPath)
                    }
                })
            })
            .catch((err) => {
                reject(err)
            })
    })

    return res
}

/** 批量压缩图片 */
export async function batchPressImage(list: pressImageListType[]) {
    // 校验输出路径
    const resList = await Promise.all(
        list.map((item) => pressSingleImg(item.input, item.output, item.opt))
    )
    let failCount = 0
    let successCount = 0

    resList.forEach((item) => {
        if (typeof item !== 'string') {
            failCount += 1
        } else {
            successCount += 1
        }
    })

    return { count: resList.length, successCount, failCount }
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
}

export function getImageBuffer(pathList: string[]) {
    return Promise.all(
        pathList.map((path) => {
            return getFile(path)
        })
    )
}

export async function getDirImageBuffer(dir: string) {
    const stat = statSync(dir)
    if (!stat.isDirectory()) {
        if (stat.isFile()) {
            const { ext } = parse(dir)

            return isSupportedImage(ext) ? getImageBuffer([dir]) : []
        }
        return []
    }

    const pathList: string[] = forEachDir(dir, undefined, Array.from(supportedFormats))

    return getImageBuffer(pathList)
}

/**
 * buffer转图片
 * @param buffer
 * @param path 输出路径：xxx\xxx\xx.png
 */
export function bufferToImg(buffer: ArrayBuffer, path: string) {
    return new Promise((resolve, reject) => {
        sharp(buffer)
            .toFile(path)
            .then(() => {
                resolve(true)
            })
            .catch((err) => {
                reject(false)
            })
    })
}
