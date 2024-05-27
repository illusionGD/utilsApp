<template>
    <div class="side-bar flex-colum-start">
        <el-menu
            class="menu-list"
            text-color="#fff"
            @open="handleOpen"
            @close="handleClose"
        >
            <el-sub-menu index="1">
                <template #title>
                    <el-icon><Suitcase /></el-icon>
                    <span>工具</span>
                </template>
                <el-menu-item
                    v-for="(item, i) in menuList"
                    :key="i"
                    :index="item.index"
                >
                    <el-icon><component :is="item.Icon"></component></el-icon>
                    <span
                        ><router-link :to="item.path">{{
                            item.title
                        }}</router-link></span
                    >
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="2">
                <el-icon><Setting /></el-icon>
                <span><router-link to="/setting">设置</router-link></span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import {
    Document,
    Menu as IconMenu,
    EditPen,
    Setting,
    Suitcase,
} from '@element-plus/icons-vue'
import { MenuListType } from '../types'
import { menuRoutes } from '../router'
const menuList = ref<MenuListType[]>(
    menuRoutes.map((item) => {
        const { component, ...other } = item
        return {
            ...other,
            index: item.path,
        }
    })
)
function handleOpen() {}

function handleClose() {}
</script>

<style lang="scss" scoped>
.side-bar {
    height: 100%;
}
.setting {
    width: 50px;
    height: 50px;
    background-image: url('../assets/images/总体.png');
}
.menu-list {
    font-weight: bold;
    background-color: $GlobalThemeColor;
    color: $GlobalTextColor;
}
.el-menu-item.is-active {
    color: $GlobalActiveColor;
}
.el-menu {
    border: none;
}

a {
    color: inherit;
    text-decoration: none;
}
</style>
