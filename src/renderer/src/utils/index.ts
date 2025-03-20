import { AnyObject } from 'antd/es/_util/type'

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
    return data ? JSON.parse(data) : data
}

export function clamp(num: number, min?: number, max?: number) {
    const hasMin = !(min === undefined)
    const hasMax = !(max === undefined)
    if (!hasMin && !hasMax) {
        return num
    }

    if (hasMin && !hasMax) {
        return num > min ? num : min
    }

    if (!hasMin && hasMax) {
        return num > max ? max : num
    }
    if (hasMin && hasMax) return Math.min(Math.max(num, min), max)
}

export function formatFileSize(size: number): string {
    if (!size || size <= 0) return '0 B'

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    const base = 1024
    let index = 0

    while (size >= base && index < units.length - 1) {
        size /= base
        index++
    }

    return `${size.toFixed(2)} ${units[index]}`
}

/** 转大驼峰 */
export function toPascalCase(str: string) {
    return str.replace(/(^\w|_\w)/g, (match) => match.replace('_', '').toUpperCase())
}

/**
 * obj转ts类型
 * @param obj
 * @param name interface name
 * @returns string
 */
export function toTsInterface(obj: AnyObject, name: string = 'GeneratedType') {
    const stack: { name: string; value: string }[] = []
    let str = ''
    const addType = (key: string, type: string) => {
        return `    ${key}: ${type}\n`
    }

    const transform = (obj: AnyObject, name: string) => {
        let str = ''

        for (const key in obj) {
            const val = obj[key]
            if (typeof val === 'object') {
                if (val === null) {
                    str += addType(key, 'null')
                } else if (val instanceof Array) {
                    if (!val.length) {
                        str += addType(key, `Array<any>`)
                    } else {
                        if (typeof val[0] !== 'object') {
                            str += addType(key, `Array<${typeof val[0]}>`)
                        } else {
                            const newInterface = toPascalCase(key) + 'ArrayType'
                            str += addType(key, `Array<${newInterface}>`)
                            stack.push({
                                name: newInterface,
                                value: transform(val[0] as AnyObject, newInterface)
                            })
                        }
                    }
                } else if (val instanceof Function) {
                    str += addType(key, 'Function')
                } else {
                    const newInterface = toPascalCase(key) + 'Type'
                    stack.push({
                        name: newInterface,
                        value: transform(val as AnyObject, newInterface)
                    })
                    str += addType(key, newInterface)
                }
            } else {
                str += addType(key, typeof val)
            }
        }
        return `interface ${name} {\n${str}}`
    }

    str += transform(obj, name)
    stack.forEach(({ value }) => {
        str += `\n\n${value}`
    })
    return str
}
