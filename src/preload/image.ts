import { getResForm } from './utils'
const sharp = require('sharp')

interface PressOptType {
    scale?: number
    quality?: number
}

export async function pressSingleImg(input: string, output: string, opt: PressOptType) {
    const { scale, quality } = opt
    const { width, height, format } = await sharp(input).metadata()

    // 缩放
    const newWidth = (width || 0) * (scale || 1)
    const newHeight = (height || 0) * (scale || 1)

    if (!format) {
        return getResForm(null, '')
    }

    // 压缩
    return new Promise((resolve, reject) => {
        sharp(input)
            .resize({
                width: newWidth,
                height: newHeight
            })
            [format]({ quality })
            .toFile(output, (err, info) => {
                if (err) {
                    reject(getResForm(err, ''))
                } else {
                    resolve(info)
                }
            })
    })
}
