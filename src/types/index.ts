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
