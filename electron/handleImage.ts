// import * as sharp from 'sharp'
import { ImgTypeEnum } from '../src/types'
import { changeImgType, mathClamp } from '../src/utils'
import { isDirectory } from './fileName'
import { parse } from 'path'

const sharp = require('sharp')

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

export async function pressImageByPath(
    path: string,
    quality: number
): Promise<Buffer> {
    const isDir = await isDirectory(path)
    if (isDir) {
        return
    }
    const { ext } = parse(path)
    const type = ext.replace('.', '')
    const config = { quality: mathClamp(0, 100, Math.ceil(quality * 100)) }
    return sharp(path)[changeImgType(type)](config).toBuffer(type)
}

export async function pressAndResizeImageByPath(
    path: string,
    width: number,
    height: number,
    quality: number
) {
    const isDir = await isDirectory(path)
    if (isDir) {
        return
    }
    const { ext } = parse(path)
    const type = ext.replace('.', '')
    const config = { quality: mathClamp(0, 100, Math.ceil(quality * 100)) }

    return sharp(path)
        [changeImgType(type)](config)
        .resize(width, height)
        .toBuffer(type)
}

/**
 * 压缩并输出图片
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
