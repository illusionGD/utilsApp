import { ShowOpenDialogType } from '@renderer/types'
import { isSucCode } from '@renderer/utils'

/**
 * 获取文件 or 文件夹路径
 * @param param
 * @param isDir 是否为文件夹
 * @returns
 */
export async function getFileOrDirPath(
    { multi, filters }: ShowOpenDialogType,
    isDir: boolean = false
) {
    const properties: string[] = [isDir ? 'openFile' : 'openDirectory']

    if (multi) {
        properties.push('multiSelections')
    }
    
    const { code, data } = await window.api.showOpenDialog<{
        filePaths: string[]
    }>({
        filters,
        properties
    })

    if (isSucCode(code)) {
        return data.filePaths
    }

    return []
}
