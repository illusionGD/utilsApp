/// <reference types="vite/client" />
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
         * @description: 修改单个文件名
         * @param {string} path
         * @param {string} newPath
         */
        modifySingleFileName: (path: string, newPath: string) => void
    }
}
