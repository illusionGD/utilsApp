import { AnyObject, ImgTypeEnum } from '../types'

export function formatFilePath(path: string) {
    return path.replace(/\\/g, '/')
}

export function getBase64Size(base64: string, imgType: string) {
    // 减去头部的 `data:image/png;base64,` 部分
    const head = `data:${imgType};base64,`
    const headLength = head.length
    const realBase64Str = base64.substring(headLength)
    const sizeInBytes = realBase64Str.length * 0.75

    // 将文件大小转换为人类可读的格式
    return formatBytesSize(sizeInBytes)
}

export function formatBytesSize(size: number) {
    return {
        kb: formatDecimal(size / 1024, 2),
        mb: formatDecimal(size / (1024 * 1024), 2),
    }
}

export function formatDecimal(num: number, offset: number) {
    const unit = Math.pow(10, offset)
    return Math.round(unit * num) / unit
}

export function changeImgType(type: string): ImgTypeEnum | '' {
    const method: AnyObject = {
        jpg: 'jpeg',
        jpeg: 'jpeg',
        png: 'png',
        webp: 'webp',
        gif: 'gif',
    }

    return method[type] || ''
}
/**
 * 限制数值的取值范围
 * @param min 最小值
 * @param max 最大值
 * @param num 值
 */
export function mathClamp(min: number, max: number, num: number) {
    return Math.min(Math.max(num, min), max)
}
