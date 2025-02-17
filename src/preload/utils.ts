export function getResForm(data: any, code: string = '100', message: string = '') {
    return {
        code: code || '500',
        data,
        message
    }
}
