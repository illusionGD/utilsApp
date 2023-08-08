import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import { router } from './router'

const app = createApp(App)
app.use(ElementPlus, { size: 'small', zIndex: 20 })
app.use(router)
app.mount('#app').$nextTick(() =>
    postMessage({ payload: 'removeLoading' }, '*')
)
