import { dirname, join, parse } from 'path'
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFile } from 'fs'
import { forEachDir, getFile } from './file'
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

enum IMG_FORMATS_ENUM {
    png = 'png',
    jpg = 'jpg',
    jpeg = 'jpeg',
    webp = 'webp',
    avif = 'avif',
    gif = 'gif',
}

const supportedFormats: string[] = []

for (const key in IMG_FORMATS_ENUM) {
    if (Object.prototype.hasOwnProperty.call(IMG_FORMATS_ENUM, key)) {
        supportedFormats.push('.' + IMG_FORMATS_ENUM[key])
    }
}

/** 压缩单张图片 */
export async function pressSingleImg(
    input: string,
    output: string,
    opt: PressImageOptType
): Promise<Error | string> {
    const { scale, quality } = opt
    const { ext } = parse(input)
    if (!supportedFormats.includes(ext)) {
        return ''
    }

    const { width, height, format } = await sharp(input).metadata()
    if (!format) {
        return ''
    }
    // 缩放
    const newWidth = (width || 0) * (scale || 1)
    const newHeight = (height || 0) * (scale || 1)

    const buffer = readFileSync(input)
    let image = sharp(buffer)
    const resizeConfig = {
        width: Math.round(newWidth),
        height: Math.round(newHeight)
    }
    const pressConfig = {quality}

    if (
        ext.includes(IMG_FORMATS_ENUM.jpeg) ||
        ext.includes(IMG_FORMATS_ENUM.jpg)
    ) {
        image = image.resize(resizeConfig).jpeg(pressConfig)
    } else {
        const format = ext.split('.')[ext.split('.').length - 1]
        image = image.resize(resizeConfig)[format](
            pressConfig
        )
    }

    if (input !== output) {
        // 创建输出目录（如果不存在）
        const outputDir = dirname(output)
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true })
        }
    }

    const compressedBuffer = await image.toBuffer()

    return new Promise((resolve, reject) => {
        writeFile(output, compressedBuffer, (err) => {
            if (err) {
                reject(err)
                return
            }
            resolve(output)
        })
    })
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

            return supportedFormats.includes(ext) ? getImageBuffer([dir]) : []
        }
        return []
    }

    const pathList: string[] = forEachDir(dir, undefined, supportedFormats)
    console.log('🚀 ~ pathList:', pathList)

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
