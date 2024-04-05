import { createRouter, createWebHashHistory } from 'vue-router'
import { EditPen } from '@element-plus/icons-vue'
export const menuRoutes = [
    {
        path: '/utils/fileNme',
        title: '修改文件名',
        Icon: EditPen,
        component: () => import('../views/fileName.vue'),
    },
]
const routes = [
    {
        path: '/',
        component: () => import('../views/home.vue'),
    },
    {
        path: '/setting',
        component: () => import('../views/setting.vue'),
    },
    ...menuRoutes,
]

export const router = createRouter({
    routes,
    history: createWebHashHistory(),
})
