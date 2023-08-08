<template>
    <div class="home">
        <el-input v-model="filePath" placeholder="Please input" />
        <el-button @click="modifyFileName">修改</el-button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { formatFilePath } from '../utils'

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

<style lang="scss" scoped></style>
