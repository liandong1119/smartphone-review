import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createMockServer } from './mock'
import { initAppState, setupRefreshStateHandling } from './utils/init'

import App from './App.vue'
import router from './router'

// 开发环境下启用模拟数据服务
if (import.meta.env.DEV) {
  createMockServer()
}

const app = createApp(App)
const pinia = createPinia()

// 注册所有的Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus, { size: 'default' })

// 初始化应用
const initApp = async () => {
  try {
    // 初始化应用状态
    await initAppState()
    
    // 设置页面刷新时保存状态
    setupRefreshStateHandling()
    
    // 挂载应用
    app.mount('#app')
  } catch (error) {
    console.error('Failed to initialize app:', error)
    // 即使初始化失败，也尝试挂载应用
    app.mount('#app')
  }
}

initApp()
