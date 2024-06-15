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
                <div class="btn-file" @click="selectDir">
                    <el-button :icon="Folder" size="large" />
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
import { SelectPathType } from '../../types'
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

function onPathChange() {
    if (curDirPath.value && isDir.value) {
        if (!/\\/.test(curDirPath.value[curDirPath.value.length - 1])) {
            curDirPath.value += '\\'
        }
    }
    emits('update:modelValue', curDirPath.value)
    emits('onChange', curDirPath.value)
}

async function selectDir() {
    const paths = await window.Electron.selectPath({
        isDir: isDir.value,
    } as SelectPathType)
    curDirPath.value = paths[0]?.replace('\\\\', '\\') || curDirPath.value
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
