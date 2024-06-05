// import * as sharp from 'sharp'
import { ImgTypeEnum } from '../src/types'
import { mathClamp } from '../src/utils'

const sharp = require('sharp')

/**
 * 压缩buffer格式的图片，返回buffer
 * @param buffer
 * @param type 图片类型
 * @param quality 压缩质量
 */
export async function pressImageByBuffer(
    buffer: Buffer,
    type: ImgTypeEnum,
    quality: number
): Promise<Buffer> {
    const config = { quality: mathClamp(0, 100, Math.ceil(quality * 100)) }
    return sharp(buffer)[type](config).toBuffer(type)
}

export async function pressImageByPath(
    path: string,
    type: ImgTypeEnum,
    quality: number
) {
    const config = { quality: mathClamp(0, 100, Math.ceil(quality * 100)) }
    return sharp(path)[type](config).toBuffer(type)
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
    return sharp(buffer)[type]({ quality }).toFile(outPath)
}
