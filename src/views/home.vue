<template>
    <div class="home">
        <div class="module-list">
            <div class="item" v-for="(item, index) in moduleList" :key="index">
                <title>{{ item.title }}</title>
                <p>{{ item.desc }}</p>
            </div>
            <div class="module-item"></div>
            <div class="module-item"></div>
        </div>
        <el-input v-model="filePath" placeholder="Please input" />
        <el-button @click="modifyFileName">修改</el-button>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { formatFilePath } from '../utils'

const moduleList = reactive([
    {
        title: '文件模块',
        desc: '修改文件名、复制文件等文件操作',
    },
    {
        title: '图片模块',
        desc: '压缩图片、精灵图等图片操作',
    },
])

const filePath = ref()
function modifyFileName() {
    if (!filePath) {
        return
    }
    console.log(
        '🚀 ~ file: App.vue:16 ~ filePath:',
        formatFilePath(filePath.value)
    )

    window.fileName.batchRenameFilesInDirectory(filePath.value, '1')
}
</script>

<style lang="scss" scoped>
.module-list {
    @extend .flex-center;
    .item {
        width: 100px;
    }
}
</style>
