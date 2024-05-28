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
