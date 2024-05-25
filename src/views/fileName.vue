<template>
    <div class="file-name">
        <h2>文件名称配置</h2>
        <div class="flex-center">
            <el-input
                placeholder="新名称"
                v-model="config.newName"
                clearable
            ></el-input>
            <el-select
                v-model="config.preFix"
                class="m-l-10 m-r-10"
                placeholder="前缀"
                clearable
            >
                <el-option
                    v-for="item in fixList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
            <el-select v-model="config.sufFix" placeholder="后缀" clearable>
                <el-option
                    v-for="item in fixList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </div>
        <h2>批量修改文件夹文件</h2>
        <el-input
            v-model="curDirPath"
            placeholder="文件夹路径"
            clearable
            size="large"
        >
            <template #prepend>
                <div class="btn-file">
                    <el-button :icon="Folder" size="large" />
                    <input
                        type="file"
                        multiple
                        @change="onSelectDir"
                        webkitdirectory
                        directory
                    />
                </div>
            </template>
        </el-input>
        <el-button @click="modifyFileName">修改</el-button>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { formatFilePath } from '../utils'
import { Folder } from '@element-plus/icons-vue'
import { FileFixEnum, RenameFileConfigType, SelectType } from '../types'
const fixList = ref<SelectType[]>([
    {
        label: '数字',
        value: FileFixEnum.NUMBER,
    },
    {
        label: '英文',
        value: FileFixEnum.ENGLISH,
    },
])
const config = ref<RenameFileConfigType>({
    newName: '',
    preFix: '',
    sufFix: '',
})
const curDirPath = ref('')

function checkConfig(config: RenameFileConfigType) {
    const { preFix, sufFix } = config
    if (!preFix && !sufFix) {
        return false
    }
    return true
}
function parseDirPath(file: File) {
    const path = file.path
    return path.replace(file.webkitRelativePath.split('/')[1], '')
}

function onSelectDir(e) {
    const files = e.target.files as FileList
    const dirPath = files.length ? parseDirPath(files[0]) : ''
    curDirPath.value = dirPath

    if (!dirPath) {
        return
    }
    if (!checkConfig(config.value)) {
        return
    }
}

function onFileChange(e) {
    if (!checkConfig(config.value)) {
        return
    }
    const files = e.target.files as FileList
    const pathList: string[] = []
    for (let index = 0; index < files.length; index++) {
        const { path } = files[index]
        pathList.push(formatFilePath(path))
    }

    window.FileNameModule.batchRenameFiles(pathList, config)
}
function modifyFileName() {
    if (!checkConfig(config.value)) {
        return
    }
    const _config = JSON.parse(JSON.stringify(config.value))
    console.log('🚀 ~ _config:', _config)
    if (curDirPath.value) {
        if (!/\\/.test(curDirPath.value[curDirPath.value.length - 1])) {
            curDirPath.value += '\\'
        }

        window.FileNameModule.batchRenameFiles([curDirPath.value], _config)
    }
}
</script>

<style lang="scss" scoped>
.module-list {
    @extend .flex-center;
    .item {
        width: 100px;
    }
}
.btn-file {
    height: 100%;
    cursor: pointer;
    input {
        width: 100%;
        height: 100%;
        @extend .p-ab-center;
        opacity: 0;
        cursor: pointer;
    }
}
</style>
