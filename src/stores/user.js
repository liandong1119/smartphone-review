import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import userApi from '../api/modules/user'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref(null)
  const userStats = ref(null)
  const isLoggedIn = computed(() => !!userInfo.value)
  const isAdmin = computed(() => userInfo.value?.role === 'admin')
  const token = ref('')
  const loading = ref(false)

  // 初始化用户信息（从本地存储加载）
  function initUserFromStorage() {
    try {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')
      
      if (storedUser) {
        userInfo.value = JSON.parse(storedUser)
      }
      
      if (storedToken) {
        token.value = storedToken
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error)
      clearUserData()
    }
  }

  // 登录
  async function login(credentials) {
    try {
      loading.value = true
      const response = await userApi.login(credentials)
      
      if (response && response.token) {
        token.value = response.token
        userInfo.value = response.user
        
        // 保存到本地存储
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        // 获取用户的统计数据
        fetchUserStats()
        
        ElMessage.success('登录成功')
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // 注册
  async function register(userData) {
    try {
      loading.value = true
      const response = await userApi.register(userData)
      
      if (response && response.token) {
        token.value = response.token
        userInfo.value = response.user
        
        // 保存到本地存储
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        ElMessage.success('注册成功')
        return true
      }
      return false
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // 登出
  function logout() {
    clearUserData()
    ElMessage.success('已成功退出登录')
  }

  // 清除用户数据
  function clearUserData() {
    userInfo.value = null
    userStats.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 获取用户统计数据
  async function fetchUserStats() {
    if (!isLoggedIn.value) return
    
    try {
      loading.value = true
      const stats = await userApi.getUserStats()
      userStats.value = stats
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
    } finally {
      loading.value = false
    }
  }

  // 更新用户信息
  async function updateProfile(profileData) {
    try {
      loading.value = true
      const updatedUser = await userApi.updateUserInfo(profileData)
      
      if (updatedUser) {
        userInfo.value = { ...userInfo.value, ...updatedUser }
        localStorage.setItem('user', JSON.stringify(userInfo.value))
        ElMessage.success('个人资料已更新')
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to update profile:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // 更新头像
  async function updateAvatar(formData) {
    try {
      loading.value = true
      const response = await userApi.updateAvatar(formData)
      
      if (response && response.avatar) {
        userInfo.value.avatar = response.avatar
        localStorage.setItem('user', JSON.stringify(userInfo.value))
        ElMessage.success('头像已更新')
        return response.avatar
      }
      return null
    } catch (error) {
      console.error('Failed to update avatar:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // 暴露出去的属性和方法
  return {
    userInfo,
    userStats,
    isLoggedIn,
    isAdmin,
    token,
    loading,
    initUserFromStorage,
    login,
    register,
    logout,
    fetchUserStats,
    updateProfile,
    updateAvatar
  }
}) 