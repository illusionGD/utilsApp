import { createRouter, createWebHashHistory } from 'vue-router'
import { EditPen, Picture } from '@element-plus/icons-vue'
import { shallowRef } from 'vue'
export const menuRoutes = [
    {
        path: '/utils/fileNme',
        title: '修改文件名',
        Icon: shallowRef(EditPen),
        component: () => import('../views/fileName.vue'),
    },
    {
        path: '/utils/handleImage',
        title: '图片处理',
        Icon: shallowRef(Picture),
        component: () => import('../views/handleImage.vue'),
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
