<template>
    <div class="handle-image">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="压缩图片" name="press">
                <press-image></press-image>
            </el-tab-pane>
            <el-tab-pane label="拼接图片" name="join"></el-tab-pane>
            <el-tab-pane label="位图字体" name="font"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeName = ref('press')

function handleClick() {}
</script>

<style lang="scss" scoped></style>
