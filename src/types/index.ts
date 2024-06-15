export interface MenuListType {
    title: string
    index: string
    path: string
    Icon: any
}

export interface RenameFileConfigType {
    newName: string
    preFix: FileFixEnum | ''
    sufFix: FileFixEnum | ''
}

export interface SelectType {
    value: string | number
    label: string
}

export enum FileFixEnum {
    NUMBER = 'number',
    ENGLISH = 'english',
}

export enum ImgTypeEnum {
    jpeg = 'jpeg',
    png = 'png',
    webp = 'webp',
    gif = 'gif',
}

export interface AnyObject {
    [key: string | number | symbol]: any
}

export interface BatchPressImgAndOutputByPathType {
    /**文件路径 */
    path: string
    width: number
    height: number
    /**质量 */
    quality: number
    /**输出路径 */
    outDirPath: string
}

export interface PressOutputConfig extends BatchPressImgAndOutputByPathType {
    /**图片类型 */
    type: string
    /**图片名称 */
    name: string
}

export interface SelectImageFile extends File {
    width: number
    height: number
}

export interface SelectPathType {
    isDir?: boolean
    multi?: boolean
}
