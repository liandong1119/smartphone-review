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

// 根据环境变量判断是否启用模拟数据服务
if (import.meta.env.VITE_USE_MOCK === true) {
  try {
    console.log('正在初始化模拟数据服务...');
    const server = createMockServer();
    if (server) {
      console.log('模拟数据服务初始化成功');
    } else {
      console.warn('模拟数据服务初始化结果无效');
    }
  } catch (error) {
    console.error('初始化模拟数据服务失败:', error);
    // 继续加载应用，但没有模拟数据
  }
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
