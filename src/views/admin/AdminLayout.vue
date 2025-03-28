<template>
  <div class="admin-layout">
    <el-container class="admin-container">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
        <div class="logo-container">
          <router-link to="/">
            <img src="@/assets/logo.png" alt="Logo" class="logo" />
            <span class="logo-text" v-show="!isCollapse">手机评测管理系统</span>
          </router-link>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-menu-item index="/admin/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/posts">
            <el-icon><Document /></el-icon>
            <span>帖子管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/comments">
            <el-icon><ChatDotRound /></el-icon>
            <span>评论管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/announcements">
            <el-icon><Bell /></el-icon>
            <span>公告栏管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/phones">
            <el-icon><Cellphone /></el-icon>
            <span>手机型号管理</span>
          </el-menu-item>
          <el-menu-item index="/">
            <el-icon><Back /></el-icon>
            <span>返回前台</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 主体区域 -->
      <el-container class="main-container">
        <!-- 顶部导航 -->
        <el-header height="60px" class="header">
          <div class="header-left">
            <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown trigger="click">
              <div class="avatar-container">
                <el-avatar :size="32" :src="adminAvatar" />
                <span class="username">{{ adminName }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <!-- 内容区域 -->
        <el-main class="main">
          <router-view />
        </el-main>
        
        <!-- 页脚 -->
        <el-footer height="40px" class="footer">
          <div class="footer-content">
            © {{ new Date().getFullYear() }} 智能手机评测论坛管理系统
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  User, 
  ChatDotRound, 
  Bell, 
  Cellphone, 
  Back, 
  Fold, 
  Expand, 
  SwitchButton,
  Document
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)

// 获取当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})

// 获取当前页面标题
const currentTitle = computed(() => {
  return route.meta.title || '管理系统'
})

// 管理员信息
const adminName = ref('管理员')
const adminAvatar = ref('')

// 监听侧边栏折叠状态，更新CSS变量
watch(isCollapse, (newValue) => {
  document.documentElement.style.setProperty('--aside-width', newValue ? '64px' : '220px')
})

// 在组件挂载时检查管理员登录状态
onMounted(() => {
  // 初始化CSS变量
  document.documentElement.style.setProperty('--aside-width', isCollapse.value ? '64px' : '220px')
  
  const user = localStorage.getItem('user')
  if (user) {
    const userInfo = JSON.parse(user)
    if (userInfo.role === 'admin') {
      adminName.value = userInfo.username || '管理员'
      adminAvatar.value = userInfo.avatar || ''
    } else {
      // 如果不是管理员，跳转到首页
      ElMessage.error('您没有管理员权限')
      router.push('/')
    }
  } else {
    // 如果未登录，跳转到登录页
    ElMessage.error('请先登录')
    router.push('/login')
  }
})

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  ElMessage.success('已成功退出登录')
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.admin-container {
  height: 100vh;
  width: 100%;
}

.aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
  height: 100vh;
}

.logo-container {
  height: 60px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #263445;
  overflow: hidden;
}

.logo-container a {
  display: flex;
  align-items: center;
  text-decoration: none;
  width: 100%;
  justify-content: center;
}

.logo {
  height: 32px;
  margin-right: 5px;
}

.logo-text {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  transition: opacity 0.3s;
}

.el-menu-vertical {
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
  color: #606266;
}

.collapse-btn:hover {
  color: #409EFF;
}

.header-right {
  display: flex;
  align-items: center;
}

.avatar-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  color: #606266;
}

.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex: 1;
  width: calc(100% - var(--aside-width, 220px));
  transition: width 0.3s;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.footer {
  background-color: #fff;
  border-top: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  font-size: 12px;
}

.footer-content {
  text-align: center;
}
</style> 