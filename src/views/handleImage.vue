<template>
    <div class="handle-image">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="压缩图片" name="press">
                <div
                    class="tab-content overflow-auto-y scroll-small overflow-auto-y scroll-small overflow-auto-y scroll-small"
                >
                    <press-image></press-image>
                </div>
            </el-tab-pane>
            <el-tab-pane label="精灵图" name="font">
                <div
                    class="tab-content overflow-auto-y scroll-small overflow-auto-y scroll-small overflow-auto-y scroll-small"
                >
                    <sprite-image></sprite-image>
                </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="拼接图片" name="join">
                <div
                    class="tab-content overflow-auto-y scroll-small overflow-auto-y scroll-small overflow-auto-y scroll-small"
                >
                    <join-image></join-image>
                </div>
            </el-tab-pane> -->
        </el-tabs>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeName = ref('press')

function handleClick() {}
</script>

<style lang="scss" scoped>
.tab-content {
    max-height: calc(100vh - 140px);
}
</style>
