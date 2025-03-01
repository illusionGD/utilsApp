/** 图片后缀枚举 */
export enum IMG_EXT_ENUM {
    png = 'png',
    jpg = 'jpg',
    jpeg = 'jpeg',
    gif = 'gif',
    webp = 'webp',
    tiff = 'tiff'
}
function getImgExtList() {
    const imgExtList: string[] = []
    for (const key in IMG_EXT_ENUM) {
        if (Object.prototype.hasOwnProperty.call(IMG_EXT_ENUM, key)) {
            imgExtList.push(IMG_EXT_ENUM[key])
        }
    }

    return imgExtList
}
export const IMG_EXT_LIST = getImgExtList()

export const UTILS_CARD_STYLE = { width: '100%', marginBottom: '10px' }
export enum PrefixSuffixTypeEnum {
    NUMBER = 'number',
    LETTER = 'letter',
    EMPTY = ''
}
