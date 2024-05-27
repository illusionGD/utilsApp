<template>
    <div class="press-image">
        <h4>压缩配置</h4>
        <el-form :inline="true" :model="pressConfig" class="press-config">
            <el-form-item label="压缩倍率">
                <el-input
                    v-model="pressConfig.rate"
                    placeholder="压缩倍率"
                    type="number"
                ></el-input>
            </el-form-item>
            <el-form-item label="缩放倍率">
                <el-input
                    v-model="pressConfig.scale"
                    type="number"
                    placeholder="缩放倍率"
                ></el-input>
            </el-form-item>
        </el-form>
        <h4>选择图片</h4>
        <dir-select-input
            v-model="curDirPath"
            :isShowSelect="true"
            :accept="'image/png, image/jpeg'"
        ></dir-select-input>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const pressConfig = ref({
    scale: 1.0,
    rate: 0.5,
})
const curDirPath = ref('')
</script>

<style lang="scss" scoped></style>
