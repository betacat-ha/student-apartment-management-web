import { createApp } from 'vue'
import ElementPlus from 'element-plus'

// 引入Element Plus
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import axios from "./http"

// 路由
import router from "./router";

axios.defaults.baseURL = "http://localhost:8088/api"  // 修改默认配置 请求根路径

const app = createApp(App)
app.config.globalProperties.$axios = axios

app.config.errorHandler = function(error) {
    console.log("global", error)
};
app.use(ElementPlus)
app.use(router)
// 注册所有 element-plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')