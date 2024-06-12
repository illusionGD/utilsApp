// import * as sharp from 'sharp'
import { BatchPressImgAndOutputByPathType, ImgTypeEnum } from '../src/types'
import { changeImgType, mathClamp } from '../src/utils'
import { isDirectory } from './fileName'
import { parse } from 'path'

const sharp = require('sharp')

async function getImgTypeByPath(path: string) {
    const isDir = await isDirectory(path)
    if (isDir) {
        return
    }
    const { ext } = parse(path)
    const type = ext.replace('.', '')

    return changeImgType(type)
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
 * 压缩图片：读取路径文件
 * @param path
 * @param quality
 */
export async function pressImageByPath(
    path: string,
    quality: number
): Promise<Buffer> {
    const type = (await getImgTypeByPath(path)) || ''
    if (!type) {
        return
    }
    const config = { quality: mathClamp(0, 100, Math.ceil(quality * 100)) }
    return sharp(path)[type](config).toBuffer(type)
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

    return sharp(path)[type](config).resize(width, height).toBuffer(type)
}

/**
 * 压缩并输出图片：接收buffer类型图片数据
 * @param buffer
 * @param type 图片类型
 * @param quality 压缩质量
 * @param outPath 输出图片位置
 */
export function pressAndOutImageByBuffer(
    buffer: Buffer,
    type: ImgTypeEnum,
    quality: number,
    outPath: string
) {
    return sharp(buffer)[changeImgType(type)]({ quality }).toFile(outPath)
}

/**
 * 批量压缩并输出图片
 * @param configs
 */
export async function batchPressImgAndOutputByPath(
    configs: BatchPressImgAndOutputByPathType[]
) {
    const pressProcess = []
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
            fileName: name + ext,
        })
    }

    return await Promise.all(
        pressProcess.map(
            ({ path, width, height, type, quality, outPath, fileName }) => {
                return sharp(path)
                    [type]({
                        quality: mathClamp(0, 100, Math.ceil(quality * 100)),
                    })
                    .resize(width, height)
                    .toFile(outPath + fileName)
            }
        )
    )
}
