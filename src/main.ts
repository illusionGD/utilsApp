import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import { router } from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.use(ElementPlus, { size: 'default', zIndex: 20 })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.mount('#app').$nextTick(() =>
    postMessage({ payload: 'removeLoading' }, '*')
)
