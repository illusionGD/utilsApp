<template>
    <div class="dir-select-input">
        <el-input
            v-model="curDirPath"
            :placeholder="isDir ? '文件夹路径' : '文件路径'"
            clearable
            size="large"
            @change="onPathChange"
        >
            <template #prepend>
                <div class="btn-file">
                    <el-button :icon="Folder" size="large" />
                    <input
                        type="file"
                        @change="onChange"
                        :accept="accept || '*'"
                        :webkitdirectory="isDir"
                        :directory="isDir"
                    />
                </div>
            </template>
            <template #append v-if="isShowSelect">
                <el-select
                    v-model="isDir"
                    size="large"
                    style="width: 100px; border: none"
                >
                    <el-option label="文件夹" :value="true" />
                    <el-option label="文件" :value="false" />
                </el-select>
            </template>
        </el-input>
    </div>
</template>

<script setup lang="ts">
import { Folder } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
const props = defineProps<{
    modelValue: string
    accept?: string
    isShowSelect?: boolean
}>()
const isDir = ref(true)
const propValue = ref(props.modelValue)
const curDirPath = ref(props.modelValue)
const emits = defineEmits(['update:modelValue', 'onChange'])

watch(propValue, () => {
    curDirPath.value = propValue.value
})

function parseDirPath(file: File) {
    // @ts-ignore
    const path = file.path
    return path.replace(file.webkitRelativePath.split('/')[1], '')
}

function onPathChange() {
    emits('update:modelValue', curDirPath.value)
    emits('onChange', curDirPath.value)
}

function onChange(e) {
    const files = e.target.files as FileList
    const dirPath = files.length ? parseDirPath(files[0]) : ''
    curDirPath.value = dirPath
    onPathChange()
}
</script>

<style lang="scss" scoped>
.dir-select-input {
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
    .el-input-group__prepend {
        background-color: var(--el-fill-color-blank);
    }
}
</style>
