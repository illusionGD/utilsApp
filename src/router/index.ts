import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../views/home.vue'),
    },
]

export const router = createRouter({
    routes,
    history: createWebHashHistory(),
})
