import { ImgTypeEnum } from '../types'

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
    const kb = (sizeInBytes / 1024).toFixed(2)
    const mb = (sizeInBytes / (1024 * 1024)).toFixed(2)

    return {
        kb,
        mb,
    }
}

export function changeImgType(type: string): ImgTypeEnum | '' {
    const method = {
        jpg: 'jpeg',
        jpeg: 'jpeg',
        png: 'png',
        webp: 'webp',
        gif: 'gif',
    }

    for (const key in method) {
        if (type.includes(key)) {
            return method[key]
        }
    }

    return ''
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
