// import sharp from 'sharp'
import {
    BatchPressImgAndOutputByPathType,
    ImgTypeEnum,
    PressOutputConfig,
} from '../src/types'
import { changeImgType, mathClamp } from '../src/utils'
import { isDirectory } from './fileName'
import { parse } from 'path'
import { promises, writeFileSync, existsSync, mkdirSync } from 'fs'

const sharp = require('sharp')

/**判断并创建空文件夹 */
function ensureDirectoryExistence(folderPath) {
    if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true })
    }
}

async function getImgTypeByPath(path: string) {
    const isDir = await isDirectory(path)
    if (isDir) {
        return
    }
    const { ext } = parse(path)
    const type = ext.replace('.', '')

    return changeImgType(type)
}

function getBatchPressTask(configList: PressOutputConfig[]) {
    return configList.map(
        ({ path, width, height, type, quality, outDirPath, name }) => {
            return sharp(path)
                [type]({
                    quality: mathClamp(0, 100, Math.ceil(quality * 100)),
                })
                .resize(width, height)
                .toFile(outDirPath + name)
        }
    )
}

/**
 * 压缩buffer格式的图片，返回buffer
 * @param buffer
 * @param type 图片类型
 * @param quality 压缩质量
 */
export async function pressImageByBuffer(
    buffer: string | Buffer,
    type: ImgTypeEnum,
    quality: number
): Promise<Buffer> {
    const formatBuffer =
        buffer instanceof Buffer
            ? buffer
            : Buffer.from(
                  buffer.replace(/^data:image\/\w+;base64,/, ''),
                  'base64'
              )
    const config = { quality: mathClamp(0, 100, Math.ceil(quality * 100)) }
    return sharp(formatBuffer)[type](config).toBuffer(type)
}

/**
 * 压缩图片并重置宽高：读取路径文件
 * @param path 文件路径
 * @param width 宽
 * @param height 高
 * @param quality 质量
 */
export async function pressAndResizeImageByPath(
    path: string,
    width: number,
    height: number,
    quality: number
) {
    const type = (await getImgTypeByPath(path)) || ''
    if (!type) {
        return
    }
    const config = { quality: mathClamp(0, 100, Math.ceil(quality * 100)) }

    return sharp(path)[type](config).resize(width, height).toBuffer()
}

/**
 * 批量压缩并输出图片
 * @param configs
 */
export async function batchPressImgAndOutputByPath(
    configs: BatchPressImgAndOutputByPathType[]
) {
    const pressProcess: PressOutputConfig[] = []
    for (let index = 0; index < configs.length; index++) {
        const { path } = configs[index]
        const type = await getImgTypeByPath(path)
        const { name, ext } = await parse(path)
        if (!type) {
            return
        }
        pressProcess.push({
            ...configs[index],
            type,
            name: name + ext,
        })
    }

    return await Promise.all(getBatchPressTask(pressProcess))
}

/**
 * 压缩并输出文件夹下的图片
 * @param dirPath 文件夹
 * @param outDirPath 输出文件夹夹
 * @param scale 缩放比例
 * @param quality 质量
 */
export async function pressImgAndOutputByDir(
    dirPath: string,
    outDirPath: string,
    scale: number,
    quality: number
) {
    const isDir = await isDirectory(dirPath)
    if (!isDir) {
        return
    }

    const filePathList = await promises.readdir(dirPath)
    const imgList = []
    // 过滤文件夹&非图片文件
    for (let index = 0; index < filePathList.length; index++) {
        const path = dirPath + filePathList[index]
        const dir = await isDirectory(path)
        if (dir) {
            const output = outDirPath + filePathList[index] + '\\'
            ensureDirectoryExistence(output)
            await pressImgAndOutputByDir(path + '\\', output, scale, quality)
        }
        const type = await getImgTypeByPath(path)
        const { name, ext } = await parse(path)
        const fileName = name + ext
        type &&
            imgList.push({
                path,
                type,
                name: fileName,
                quality,
                outDirPath,
            })
    }

    if (!imgList.length) {
        return
    }

    const configList: PressOutputConfig[] = []

    // 获取图片宽高
    for (let i = 0; i < imgList.length; i++) {
        const { width, height } = await sharp(imgList[i].path).metadata()
        configList.push({
            ...imgList[i],
            width: scale * width,
            height: scale * height,
        })
    }
    return await Promise.all(getBatchPressTask(configList))
}

export function outputBase64Img(outPath: string, base64: string) {
    // 移除 URL 头部 (data:image/png;base64,)
    const matches = base64.match(/^data:(.+);base64,(.+)$/)
    if (matches === null) {
        throw new Error('Invalid base64 string')
    }
    const base64Data = matches[2] // 提取 Base64 数据

    // 将 Base64 编码字符串转换为 Buffer
    const buffer = Buffer.from(base64Data, 'base64')

    // 将 Buffer 写入文件
    return writeFileSync(outPath, buffer)
}
