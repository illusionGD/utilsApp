/**
 * 是否为无效值
 * @param val
 */
export function isInvalid(val: any) {
    return [NaN, null, undefined, 'undefined'].includes(val)
}

/**
 * 是否为成功的code
 * @param code
 */
export function isSucCode(code: string) {
    return code === '100'
}

export function setLocalstorage(key: string, val: any) {
    localStorage.setItem(key, JSON.stringify(val))
}

export function getLocalstorage(key: string) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : data
}

export function clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max)
}

export function formatFileSize(size: number): string {
    if (size <= 0) return '0 B'

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    const base = 1024
    let index = 0

    while (size >= base && index < units.length - 1) {
        size /= base
        index++
    }

    return `${size.toFixed(2)} ${units[index]}`
}
