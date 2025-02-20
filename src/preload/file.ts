import { existsSync, readdirSync, readFile, statSync } from 'fs'
import { join, parse } from 'path'

export async function getFile(path: string): Promise<{
    ext: string
    name: string
    path: string
    data: Buffer<ArrayBufferLike>
} | null> {
    const isExist = existsSync(path)
    const isDir = statSync(path).isDirectory()
    if (!isExist || isDir) {
        return null
    }
    return new Promise((resolve, reject) => {
        readFile(path, (err, data) => {
            if (err) {
                console.log('🚀 ~ err:', err)
                reject(null)
            } else {
                const { ext, base } = parse(path)
                resolve({
                    ext,
                    name: base,
                    path,
                    data
                })
            }
        })
    })
}

/**
 * 递归遍历文件夹的文件
 * @param inputDir 文件夹路径
 * @param callBack 每次遍历回调：filePath- 当前路径，name-当前名称，isDir-是否为文件夹
 * @param fileFilters 需要筛选的文件后缀，如：.png
 */
export function forEachDir(
    inputDir: string,
    callBack?: (filePath: string, name: string, isDir: boolean) => void,
    fileFilters?: string[]
) {
    const fileList: string[] = []
    const start = (
        inputDir: string,
        callBack?: (filePath: string, name: string, isDir: boolean) => void
    ) => {
        const items = readdirSync(inputDir)
        items.forEach((item) => {
            const itemPath = join(inputDir, item)
            const stats = statSync(itemPath)
            if (stats.isDirectory()) {
                callBack && callBack(itemPath, item, true)
                // 如果是文件夹，递归处理
                start(itemPath, callBack)
            } else if (stats.isFile()) {
                const { ext } = parse(item)
                if (fileFilters?.includes(ext)) {
                    fileList.push(itemPath)
                    callBack && callBack(itemPath, item, false)
                }
            }
        })
    }
    start(inputDir, callBack)

    return fileList
}
