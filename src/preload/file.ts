import { existsSync, readdirSync, readFile, renameSync, statSync } from 'fs'
import { basename, extname, join, parse } from 'path'

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

type PrefixSuffixType = 'number' | 'letter'

interface RenameFilesOptions {
    dir: string // 目标文件夹路径
    newName: string // 新的文件名（中间部分）
    prefixType?: PrefixSuffixType | '' // 前缀类型 ('number' | 'letter')
    suffixType?: PrefixSuffixType | '' // 后缀类型 ('number' | 'letter')
    startNumber?: number // 数字递增起始值
    step?: number // 递增步长
    extensions?: string[] // 需要修改的文件类型（可选）
}

/**
 * 批量重命名文件
 * @param options RenameFilesOptions
 */
export function renameFiles(options: RenameFilesOptions) {
    const {
        dir,
        newName,
        prefixType,
        suffixType,
        startNumber = 1,
        step = 1,
        extensions = []
    } = options

    if (!existsSync(dir)) {
        console.error('❌ 目录不存在:', dir)
        return null
    }

    const files = readdirSync(dir).filter(
        (file) => extensions.length === 0 || extensions.includes(extname(file).toLowerCase())
    )

    let num = startNumber
    let letterIndex = 0

    files.forEach((file) => {
        const ext = extname(file) // 获取文件后缀

        // 生成前缀
        const prefix = prefixType === 'number' ? num.toString() : getLetterIndex(letterIndex)
        // 生成后缀
        const suffix = suffixType === 'number' ? num.toString() : getLetterIndex(letterIndex)

        // 构造基础文件名
        const newFileName = `${prefixType ? prefix : ''}${newName}${suffixType ? suffix : ''}${ext}`
        const oldPath = join(dir, file)
        let newPath = join(dir, newFileName)

        // 检查文件是否已存在，避免覆盖
        newPath = getUniqueFileName(dir, newFileName)

        try {
            renameSync(oldPath, newPath)
            console.log(`✅ ${file} -> ${basename(newPath)}`)

            // 递增逻辑
            if (prefixType === 'number' || suffixType === 'number') num += step
            if (prefixType === 'letter' || suffixType === 'letter') letterIndex++
        } catch (error) {
            console.error(`❌ 重命名失败: ${file}`, error)
        }
    })
}

/**
 * 根据索引获取字母递增序列（a, b, c, ..., z, aa, ab, ...）
 * @param index number
 * @returns string
 */
function getLetterIndex(index: number): string {
    let result = ''
    while (index >= 0) {
        result = String.fromCharCode((index % 26) + 97) + result
        index = Math.floor(index / 26) - 1
    }
    return result
}

/**
 * 确保文件名唯一，防止覆盖已有文件
 * @param dir 目录路径
 * @param fileName 原始文件名
 * @returns string 唯一文件名
 */
function getUniqueFileName(dir: string, fileName: string): string {
    let counter = 1
    let uniqueName = fileName
    let filePath = join(dir, uniqueName)

    while (existsSync(filePath)) {
        const ext = extname(fileName)
        const nameWithoutExt = fileName.replace(ext, '')
        uniqueName = `${nameWithoutExt}_${counter}${ext}`
        filePath = join(dir, uniqueName)
        counter++
    }

    return filePath
}
