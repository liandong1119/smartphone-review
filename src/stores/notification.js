import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import notificationApi from '../api/modules/notification'
import { ElMessage } from 'element-plus'

export const useNotificationStore = defineStore('notification', () => {
  // 状态
  const notifications = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)

  // 计算属性
  const hasUnread = computed(() => unreadCount.value > 0)
  const displayNotifications = computed(() => {
    return notifications.value.slice(0, 5) // 显示最近5条
  })

  // 获取通知列表
  async function fetchNotifications(params = {}) {
    try {
      loading.value = true
      const result = await notificationApi.getNotifications({
        page: currentPage.value,
        pageSize: pageSize.value,
        ...params
      })
      
      if (result) {
        notifications.value = result.records || result
        total.value = result.total || result.length
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      ElMessage.error('获取通知列表失败')
    } finally {
      loading.value = false
    }
  }

  // 获取未读通知数量
  async function fetchUnreadCount() {
    try {
      const count = await notificationApi.getUnreadCount()
      unreadCount.value = count || 0
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  // 标记通知为已读
  async function markAsRead(notificationId) {
    try {
      await notificationApi.markAsRead(notificationId)
      
      // 更新本地状态
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification && !notification.isRead) {
        notification.isRead = true
        if (unreadCount.value > 0) {
          unreadCount.value--
        }
      }
      
      return true
    } catch (error) {
      console.error(`Failed to mark notification as read (id: ${notificationId}):`, error)
      ElMessage.error('标记已读失败')
      return false
    }
  }

  // 标记所有通知为已读
  async function markAllAsRead() {
    try {
      loading.value = true
      await notificationApi.markAllAsRead()
      
      // 更新本地状态
      notifications.value.forEach(n => {
        n.isRead = true
      })
      unreadCount.value = 0
      
      ElMessage.success('已将所有通知标记为已读')
      return true
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      ElMessage.error('操作失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 删除通知
  async function deleteNotification(notificationId) {
    try {
      await notificationApi.deleteNotification(notificationId)
      
      // 更新本地状态
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        const notification = notifications.value[index]
        if (!notification.isRead) {
          // 如果是未读通知，减少未读计数
          if (unreadCount.value > 0) {
            unreadCount.value--
          }
        }
        notifications.value.splice(index, 1)
      }
      
      ElMessage.success('通知已删除')
      return true
    } catch (error) {
      console.error(`Failed to delete notification (id: ${notificationId}):`, error)
      ElMessage.error('删除失败')
      return false
    }
  }

  // 设置分页
  function setPagination(page, size) {
    currentPage.value = page
    if (size) pageSize.value = size
  }

  // 暴露出去的属性和方法
  return {
    notifications,
    displayNotifications,
    unreadCount,
    hasUnread,
    loading,
    currentPage,
    pageSize,
    total,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    setPagination
  }
}) 