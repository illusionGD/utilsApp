<template>
    <div class="bitmap-fnt">
        <h4>位图配置</h4>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { nextTick, ref } from 'vue'
</script>

<style lang="scss" scoped>
.file-list {
    max-height: 200px;
    .file-item {
        height: 50px;
    }

    img {
        object-fit: contain;
        height: 100%;
        width: 50px;
    }
}
.preview-box {
    width: 100%;
    .preview-canvas {
        // border: 1px dashed #fff;
    }
}
</style>
