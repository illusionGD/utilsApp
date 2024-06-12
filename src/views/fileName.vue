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
        <dir-select-input v-model="curDirPath"></dir-select-input>
        <el-button class="m-t-10" type="success" @click="modifyFileName"
            >修改</el-button
        >
    </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
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

async function modifyFileName() {
    if (!checkConfig(config.value)) {
        return
    }
    const _config = JSON.parse(JSON.stringify(config.value))
    if (curDirPath.value) {
        try {
            await window.FileNameModule.batchRenameFiles(
                [curDirPath.value],
                _config
            )
            ElMessage.success({
                message: '成功',
            })
        } catch (error) {
            ElMessage.error({
                message: `${error}`,
            })
        }
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
</style>
