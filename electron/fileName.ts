import { rename, stat, promises } from 'fs'
import { join, parse } from 'path'

/**
 * @description: 批量修改文件名
 * @param {string} directoryPath 路径
 * @param {string} newName 名称
 * @param {string} preFix 前缀
 * @param {string} sufFix 后缀
 */
export async function batchRenameFilesInDirectory(
    directoryPath: string,
    newName: string,
    preFix: string = '',
    sufFix: string = ''
) {
    try {
        let files = null
        if (await isDirectory(directoryPath)) {
            files = await promises.readdir(directoryPath)
        } else {
            const newFilePath = join(directoryPath, newName)
            await modifySingleFileName(
                directoryPath,
                preFix + newFilePath + sufFix
            )
        }
        if (!files) {
            return
        }
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const filePath = join(directoryPath, file)
            const isDir = await isDirectory(filePath)

            if (isDir) {
                await batchRenameFilesInDirectory(filePath, newName)
            } else {
                const _sufFix = sufFix || `_${i}`
                const newFilePath = join(directoryPath, newName + _sufFix)

                await modifySingleFileName(filePath, newFilePath)
            }
        }
    } catch (err) {
        console.error(err)
    }
}

/**
 * @description: 修改单个文件名
 * @param {string} path
 * @param {string} newPath
 */
export function modifySingleFileName(path: string, newPath: string) {
    return new Promise((resolve, reject) => {
        const { ext: oldExt } = parse(path)
        const { ext: newExt } = parse(newPath)
        const renamePath = newExt ? newPath : newPath + oldExt
        console.log('🚀 ~ file: fileName.ts:49 ~ renamePath:', renamePath)
        rename(path, renamePath, (err: any) => {
            if (err) {
                reject(err)
            } else {
                console.log(
                    `${path}-已重命名文件：${getFileNameNotExt(
                        path
                    )} -> ${getFileNameNotExt(renamePath)}`
                )
                resolve(true)
            }
        })
    })
}

/**
 * @description: 判断路径是否为文件夹
 * @param {string} filePath
 */
export function isDirectory(filePath: string) {
    return new Promise((resolve, reject) => {
        stat(filePath, (err: any, stats) => {
            if (err) {
                reject(err)
                return
            }
            resolve(stats.isDirectory())
        })
    })
}

/**
 * @description: 获取无后缀文件名
 * @param {string} filePath
 */
export function getFileNameNotExt(filePath: string) {
    const parsedPath = parse(filePath)
    return parsedPath.name
}
