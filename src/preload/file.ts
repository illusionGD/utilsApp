import { existsSync, readFile, statSync } from 'fs'
import { parse } from 'path'

export async function getFile(path: string): Promise<{
    ext: string
    base: string
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
                reject(err)
            } else {
                const { ext, base } = parse(path)
                resolve({
                    ext,
                    base,
                    path,
                    data
                })
            }
        })
    })
}
