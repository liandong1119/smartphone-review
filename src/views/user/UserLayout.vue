<template>
  <div class="user-layout">
    <!-- 顶部标题栏 -->
    <header class="header">
      <div class="container">
        <div class="logo-area">
          <router-link to="/" class="logo">
            <img src="@/assets/logo.png" alt="Logo" height="36" />
            <span class="logo-text">智能手机评测论坛</span>
          </router-link>
        </div>
        
        <!-- 右侧用户区域 -->
        <div class="user-actions">
          <template v-if="isLoggedIn">
            <!-- 添加通知中心组件 -->
            <notification-center v-if="isLoggedIn" class="notification-center-wrapper" />
            
            <el-dropdown trigger="click">
              <div class="avatar-wrapper">
                <el-avatar :size="36" :src="userAvatar"></el-avatar>
                <span class="username-display">{{ username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$router.push('/user-center')">
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item @click="$router.push('/post')">
                    <el-icon><EditPen /></el-icon>发布评测
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" size="small" @click="$router.push('/login')">登录</el-button>
            <el-button size="small" @click="$router.push('/register')">注册</el-button>
          </template>
        </div>
      </div>
    </header>

    <!-- 主体布局 -->
    <div class="main-layout">
      <!-- 左侧导航 -->
      <div class="left-sidebar">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          router
        >
          <el-menu-item index="/home">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/latest">
            <el-icon><Clock /></el-icon>
            <span>最新评测</span>
          </el-menu-item>
          <el-menu-item index="/hot">
            <el-icon><Histogram /></el-icon>
            <span>热门评测</span>
          </el-menu-item>
          <el-menu-item index="/brands">
            <el-icon><Cellphone /></el-icon>
            <span>手机品牌</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 中间内容区 -->
      <div class="content-area">
        <router-view />
      </div>

      <!-- 右侧信息栏 -->
      <div class="right-sidebar">
        <!-- 公告栏移到最上方 -->
        <el-card class="announcement-card">
          <div class="card-header">
            <span>公告栏</span>
          </div>
          <div class="card-content">
            系统公告：欢迎来到智能手机评测论坛，分享您的使用体验和评测心得！
          </div>
        </el-card>
        
        <!-- 用户信息卡片，添加更多详细内容 -->
        <el-card class="user-info-card">
          <div class="user-info-header">
            <el-avatar :size="42" icon="el-icon-user"></el-avatar>
            <div class="user-meta">
              <div class="username">{{ isLoggedIn ? username : '未登录' }}</div>
              <div class="join-time">{{ isLoggedIn ? '注册于2023-09-01' : '请登录账号' }}</div>
            </div>
          </div>
          
          <!-- 添加个性签名 -->
          <div class="user-signature" v-if="isLoggedIn">
            "热爱科技，分享生活，手机控一枚~"
          </div>
          
          <!-- 添加用户统计信息 -->
          <div class="user-stats" v-if="isLoggedIn">
            <div class="stat-item">
              <div class="stat-value">32</div>
              <div class="stat-label">帖子</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">128</div>
              <div class="stat-label">点赞</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">56</div>
              <div class="stat-label">收藏</div>
            </div>
          </div>
          
          <!-- 未登录状态显示登录按钮 -->
          <div class="login-buttons" v-if="!isLoggedIn">
            <el-button type="primary" size="small" @click="$router.push('/login')">登录</el-button>
            <el-button size="small" @click="$router.push('/register')">注册</el-button>
          </div>
        </el-card>
        
        <!-- 管理员卡片保持不变 -->
        <el-card class="admin-card" v-if="isAdmin">
          <div class="card-header">
            <span>管理员</span>
            <div class="join-time">日期时间</div>
          </div>
          <div class="card-content">
            内容
          </div>
        </el-card>
        
        <!-- 添加发布按钮在右侧底部 -->
        <div class="publish-button-container">
          <el-button type="primary" class="publish-button" @click="$router.push('/post')">
            <el-icon><Plus /></el-icon>发布新帖子
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowDown, User, EditPen, SwitchButton, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import NotificationCenter from '@/components/NotificationCenter.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 用户登录状态（从store中获取）
const isLoggedIn = computed(() => userStore.isLoggedIn)
const username = computed(() => userStore.userInfo?.username || '用户')
const userAvatar = computed(() => userStore.userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')
const isAdmin = computed(() => userStore.isAdmin)

// 获取当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})

// 处理退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.user-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  position: sticky;
  top: 0;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  height: 60px;
  display: flex;
  align-items: center;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
}

.logo-area {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.logo-text {
  margin-left: 10px;
  font-size: 18px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.notification-center-wrapper {
  margin-right: 5px;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.avatar-wrapper:hover {
  background-color: #f5f7fa;
}

.username-display {
  margin: 0 5px;
  font-size: 14px;
  color: #606266;
}

.main-layout {
  display: flex;
  flex: 1;
}

.left-sidebar {
  width: 180px;
  background-color: #fff;
  border-right: 1px solid #e8e8e8;
  padding: 20px 0;
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.05);
}

.el-menu-vertical {
  border-right: none;
}

.content-area {
  flex: 1;
  padding: 20px;
}

.right-sidebar {
  width: 250px;
  padding: 20px 15px;
  border-left: 1px solid #e8e8e8;
}

.user-info-card,
.announcement-card,
.admin-card {
  margin-bottom: 20px;
}

.user-info-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-meta {
  margin-left: 10px;
}

.username {
  font-weight: bold;
  font-size: 14px;
}

.join-time,
.sidebar-label {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.card-header {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 14px;
}

.card-content {
  color: #666;
  font-size: 13px;
}

.floating-action {
  position: fixed;
  right: 30px;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-button {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.action-label {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

/* 用户个性签名样式 */
.user-signature {
  font-size: 13px;
  color: #666;
  font-style: italic;
  margin: 10px 0;
  padding: 5px 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid #ddd;
}

/* 用户统计信息样式 */
.user-stats {
  display: flex;
  justify-content: space-around;
  margin: 15px 0 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

/* 登录按钮样式 */
.login-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

/* 右侧底部发布按钮样式 */
.publish-button-container {
  margin-top: 20px;
}

.publish-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

/* 移除浮动操作按钮的样式 */
.floating-action {
  display: none;
}

.sidebar-divider {
  font-size: 12px;
  color: #909399;
  padding: 20px 20px 10px 20px;
  position: relative;
}

.sidebar-divider:before {
  content: '';
  position: absolute;
  left: 20px;
  right: 20px;
  top: 50%;
  height: 1px;
  background: #f0f0f0;
  z-index: 0;
}

.sidebar-divider span {
  background-color: #fff;
  position: relative;
  z-index: 1;
  padding: 0 8px 0 0;
}
</style> 