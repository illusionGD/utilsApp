import { rename, stat, promises } from 'fs'
import { join, parse } from 'path'
import { FileFixEnum, RenameFileConfigType } from '../src/types'

/**
 * @description: 批量修改文件夹里面的文件名
 * @param {string} directoryPath 路径
 * @param {string} newName 名称
 * @param {string} preFix 前缀
 * @param {string} sufFix 后缀
 */
export async function batchRenameFilesInDirectory(
    directoryPath: string,
    newName: string,
    preFix?: FileFixEnum | '',
    sufFix?: FileFixEnum | ''
) {
    const en = 'abcdefghijklmnopqrstuvwxyz'
    const enLen = en.length
    const getEnStr = (index: number) => {
        let str = en[index]
        while (!en[index]) {
            str += en[index % enLen]
        }
        return str
    }
    let _prefix = ''
    let _suffix = ''
    preFix && (preFix === FileFixEnum.NUMBER ? '0' : 'a')
    sufFix && (sufFix === FileFixEnum.NUMBER ? '0' : 'a')

    try {
        let files = null
        if (await isDirectory(directoryPath)) {
            files = await promises.readdir(directoryPath)
        } else {
            const newFilePath = join(directoryPath, newName)
            await modifySingleFileName(
                directoryPath,
                _prefix + newFilePath + _suffix
            )
        }
        // 判断是否有文件
        if (!files) {
            return
        }
        for (let i = 0; i < files.length; i++) {
            if (preFix === FileFixEnum.NUMBER) {
                _prefix = `${i}`
            } else if (preFix === FileFixEnum.ENGLISH) {
                _prefix = getEnStr(i)
            }

            if (sufFix === FileFixEnum.NUMBER) {
                _suffix = `${i}`
            } else if (sufFix === FileFixEnum.ENGLISH) {
                _suffix = getEnStr(i)
            }
            const file = files[i]
            const filePath = join(directoryPath, file)
            const isDir = await isDirectory(filePath)

            if (isDir) {
                await batchRenameFilesInDirectory(filePath, newName)
            } else {
                const newFilePath = join(
                    directoryPath,
                    _prefix + newName + _suffix
                )

                await modifySingleFileName(filePath, newFilePath)
            }
        }
    } catch (err) {
        console.error(err)
    }
}

/**
 * 批量修改文件名
 * @param pathList
 * @param config
 */
export async function batchRenameFiles(
    pathList: string[],
    config: RenameFileConfigType
) {
    const { newName, preFix, sufFix } = config

    for (let index = 0; index < pathList.length; index++) {
        const path = pathList[index]

        await batchRenameFilesInDirectory(path, newName, preFix, sufFix)
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
