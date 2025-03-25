/**
 * 应用初始化工具
 * 用于在应用启动时自动加载必要的数据和配置
 */

// 导入所需的store
import { useUserStore } from '../stores/user'
import { usePostStore } from '../stores/post'
import { useNotificationStore } from '../stores/notification'

// 初始化用户状态
export const initUserState = async () => {
  const userStore = useUserStore()
  userStore.initUserFromStorage()
  
  // 如果已登录，获取用户统计数据
  if (userStore.isLoggedIn) {
    await userStore.fetchUserStats()
    
    // 确保userId存在于localStorage中
    if (userStore.userInfo && userStore.userInfo.id && !localStorage.getItem('userId')) {
      localStorage.setItem('userId', userStore.userInfo.id)
    }
  }
  
  return userStore
}

// 初始化文章状态
export const initPostState = async () => {
  const postStore = usePostStore()
  postStore.initLikesAndFavorites()
  return postStore
}

// 初始化通知状态
export const initNotificationState = async () => {
  const notificationStore = useNotificationStore()
  const userStore = useUserStore()
  
  // 只有登录用户才获取通知
  if (userStore.isLoggedIn) {
    await notificationStore.fetchUnreadCount()
  }
  
  return notificationStore
}

// 初始化所有状态
export const initAppState = async () => {
  try {
    const userStore = await initUserState()
    const postStore = await initPostState()
    const notificationStore = userStore.isLoggedIn ? await initNotificationState() : null
    
    return {
      userStore,
      postStore,
      notificationStore
    }
  } catch (error) {
    console.error('Failed to initialize app state:', error)
    throw error
  }
}

// 为页面刷新时保存状态
export const setupRefreshStateHandling = () => {
  // 在页面即将被刷新时保存必要的状态
  window.addEventListener('beforeunload', () => {
    // 可以在这里添加保存状态的代码
  })
}

export default {
  initUserState,
  initPostState,
  initNotificationState,
  initAppState,
  setupRefreshStateHandling
} 