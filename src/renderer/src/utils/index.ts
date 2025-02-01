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
    return data ? JSON.parse(data): data
}