const sharp = require('sharp')

const method = {
    jpg: 'jpeg',
    jpeg: 'jpeg',
    png: 'png',
    webp: 'webp',
    gif: 'gif',
}

/**
 * 压缩buffer格式的图片，返回buffer
 * @param buffer
 * @param type 图片类型
 * @param quality 压缩质量
 */
export function pressImageByBuffer(
    buffer: string,
    type: string,
    quality: number
) {
    return sharp(buffer)[method[type]]({ quality }).toBuffer()
}
/**
 * 压缩并输出图片
 * @param buffer
 * @param type 图片类型
 * @param quality 压缩质量
 * @param outPath 输出图片位置
 */
export function pressAndOutImageByBuffer(
    buffer: string,
    type: string,
    quality: number,
    outPath: string
) {
    return sharp(buffer)[method[type]]({ quality }).toFile(outPath)
}
