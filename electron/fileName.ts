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
    const getEnStr = (index: number) => {
        const enLen = 26
        if (enLen <= index) {
            let str = ''
            const num = Math.ceil(index / enLen)
            for (let i = 0; i < num; i++) {
                str += String.fromCharCode((i % 26) + 97)
            }
            str += String.fromCharCode((index % 26) + 97)
            return str
        }

        return String.fromCharCode((index % 26) + 97)
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
        const fileNames: string[] = []
        const newFileNames: string[] = []

        // 收集文件名
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const filePath = join(directoryPath, file)
            const isDir = await isDirectory(filePath)
            const { ext: oldExt } = parse(filePath)
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

            let newFilePath = join(directoryPath, _prefix + newName + _suffix)
            const { ext: newExt } = parse(newFilePath)
            if (!newExt) {
                newFilePath += oldExt
            }
            fileNames.push(filePath)
            newFileNames.push(newFilePath)

            if (isDir) {
                await batchRenameFilesInDirectory(filePath, newName)
            }
        }

        const modifyOperate = async (
            oldPaths: string[],
            newPaths: string[]
        ) => {
            const jobList = []
            const notModifyNames = []
            const hadModifyNames = []

            for (let j = 0; j < oldPaths.length; j++) {
                const filePath = oldPaths[j]
                const isDir = await isDirectory(filePath)
                const oldFilePath = oldPaths[j]

                const newFilePath = newPaths[j]

                // 如果是文件夹则跳过
                if (isDir) {
                    continue
                }

                const hadIndex = oldPaths.findIndex(
                    (name) => name === newFilePath
                )

                // 如果没有改名则跳过
                if (hadIndex === j) {
                    hadModifyNames.push(newFilePath)
                    continue
                }

                // 如果有同名文件，后面再更改
                if (hadIndex >= 0) {
                    notModifyNames.push(oldFilePath)
                    continue
                }
                hadModifyNames.push(newFilePath)
                jobList.push(modifySingleFileName(oldFilePath, newFilePath))
            }

            await Promise.all(jobList)

            // 剔除已修改的文件，如果有重名为修改的文件，递归执行
            hadModifyNames.forEach((name) => {
                const index = newPaths.findIndex((oldName) => oldName === name)
                index >= 0 && newPaths.splice(index, 1)
            })

            if (notModifyNames.length) {
                await modifyOperate(notModifyNames, [...newPaths])
            }
        }

        await modifyOperate(fileNames, newFileNames)
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
                // console.log(
                //     `${path}-已重命名文件：${getFileNameNotExt(
                //         path
                //     )} -> ${getFileNameNotExt(renamePath)}`
                // )
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
