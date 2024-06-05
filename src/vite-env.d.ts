/// <reference types="vite/client" />
/// <reference types="./types/index" />

declare module '*.vue' {
    import { ComponentOptions } from 'vue'
    const componentOptions: ComponentOptions
    export default componentOptions
}

interface Window {
    FileNameModule: {
        /**
         * @description: 批量修改文件名
         * @param {string} directoryPath 路径
         * @param {string} newName 名称
         * @param {string} preFix 前缀
         * @param {string} sufFix 后缀
         */
        batchRenameFilesInDirectory: (
            directoryPath: string,
            newName: string,
            preFix: string = '',
            sufFix: string = ''
        ) => void

        /**
         * 批量修改文件名
         * @param pathList
         * @param config
         */
        batchRenameFiles: (
            pathList: string[],
            config: RenameFileConfigType
        ) => void
    }
    HandleImageModule: {
        /**
         * 压缩base64格式的图片
         * @param base64
         * @param type 图片类型：jpeg|png|webp|...
         * @param quality 质量
         */
        pressImageByBase64: (
            base64: string,
            type: ImgTypeEnum,
            quality: number
        ) => Promise<buffer>
        /**
         * 压缩图片。传文件路径
         * @param path
         * @param quality 质量
         */
        pressImageByPath: (path: string, quality: number) => Promise<buffer>
        /**
         * 压缩&重置图片大小，传文件路径
         * @param path
         * @param width
         * @param height
         * @param quality
         */
        pressAndResizeImageByPath: (
            path: string,
            width: number,
            height: number,
            quality: number
        ) => Promise<buffer>
    }
}
