export function getResForm<T>(data: T, code: string = '100', message: string = '') {
    return {
        code: code || '500',
        data,
        message
    }
}
