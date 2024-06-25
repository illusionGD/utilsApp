/** 获取本地缓存localStorage */
export function getLocalStorage<T>(key: string): T {
    const str = localStorage.getItem(key)
    return str ? JSON.parse(str) : ''
}

/** 设置本地缓存localStorage */
export function setLocalStorage(key: string, val: any) {
    if (!val) {
        return
    }
    localStorage.setItem(
        key,
        typeof val === 'string' ? val : JSON.stringify(val)
    )
}
