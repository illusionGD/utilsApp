<template>
    <div class="header-menu flex-row-between">
        <div class="left flex-center">
            <img class="logo" src="../../public/logo.png" alt="" />
            <div class="drag-banner"></div>
        </div>
        <div class="btn-list flex-center">
            <el-icon class="btn-wind btn-min m-r-10" @click="minWind"
                ><SemiSelect
            /></el-icon>
            <el-icon class="btn-wind btn-close" @click="closeWind"
                ><CloseBold
            /></el-icon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SemiSelect, CloseBold } from '@element-plus/icons-vue'

function minWind() {
    window.Electron.minimizeWindow()
}
function closeWind() {
    window.Electron.closeWindow()
}
</script>

<style lang="scss" scoped>
.header-menu {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    padding: 0 20px;
}

.left {
    -webkit-app-region: drag;
    width: 100%;
    .logo {
        width: 30px;
        height: 30px;
        object-fit: contain;
    }
    .drag-banner {
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
}

.btn-list {
    flex: 1;
    .btn-wind {
        cursor: pointer;
    }
}
</style>
