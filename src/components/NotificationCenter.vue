<template>
  <div class="notification-center">
    <el-popover
      placement="bottom-end"
      :width="350"
      trigger="click"
      popper-class="notification-popover"
      @show="fetchNotifications"
    >
      <template #reference>
        <el-badge :value="notificationStore.unreadCount" :hidden="!notificationStore.hasUnread" class="notification-badge">
          <el-button circle>
            <el-icon><Bell /></el-icon>
          </el-button>
        </el-badge>
      </template>
      
      <div class="notification-header">
        <div class="notification-title">通知中心</div>
        <div class="notification-actions">
          <el-button link type="primary" size="small" @click="markAllAsRead" :disabled="!notificationStore.hasUnread">
            全部已读
          </el-button>
        </div>
      </div>
      
      <el-divider class="notification-divider" />
      
      <div v-if="notificationStore.loading" class="notification-loading">
        <el-skeleton :rows="3" animated />
      </div>
      
      <div v-else-if="displayNotifications.length === 0" class="notification-empty">
        <el-empty description="暂无通知" />
      </div>
      
      <el-scrollbar height="300px" v-else>
        <div class="notification-list">
          <div 
            v-for="notification in displayNotifications" 
            :key="notification.id" 
            class="notification-item"
            :class="{ 'is-read': notification.isRead }"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-avatar">
              <el-avatar :size="36" :src="notification.senderAvatar"></el-avatar>
            </div>
            <div class="notification-content">
              <div class="notification-message" v-html="notification.content"></div>
              <div class="notification-time">{{ notification.time }}</div>
            </div>
            <div class="notification-options">
              <el-dropdown trigger="click" @click.stop>
                <el-icon><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="!notification.isRead" @click.stop="markAsRead(notification.id)">
                      <el-icon><Check /></el-icon> 标为已读
                    </el-dropdown-item>
                    <el-dropdown-item @click.stop="deleteNotification(notification.id)">
                      <el-icon><Delete /></el-icon> 删除通知
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </el-scrollbar>
      
      <div v-if="displayNotifications.length > 0" class="notification-footer">
        <el-button link type="primary" @click="viewMoreNotifications">查看全部通知</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Bell, Check, Delete, MoreFilled } from '@element-plus/icons-vue'
import { useNotificationStore } from '../stores/notification'

const router = useRouter()
const notificationStore = useNotificationStore()

// 只显示前5条通知
const displayNotifications = computed(() => notificationStore.displayNotifications)

// 获取通知列表
const fetchNotifications = async () => {
  await notificationStore.fetchNotifications({ page: 1, pageSize: 5 })
}

// 标记通知为已读
const markAsRead = async (notificationId) => {
  const success = await notificationStore.markAsRead(notificationId)
  if (success) {
    ElMessage.success('已标记为已读')
  }
}

// 标记所有通知为已读
const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
}

// 删除通知
const deleteNotification = async (notificationId) => {
  await notificationStore.deleteNotification(notificationId)
}

// 处理通知点击
const handleNotificationClick = (notification) => {
  if (!notification.isRead) {
    markAsRead(notification.id)
  }
  
  // 根据通知类型跳转到相应页面
  if (notification.type === 'comment_reply') {
    router.push(`/review/${notification.postId}`)
  } else if (notification.type === 'post_like') {
    router.push(`/review/${notification.postId}`)
  } else if (notification.type === 'user_follow') {
    router.push(`/user-profile/${notification.senderId}`)
  } else if (notification.type === 'comment_like') {
    router.push(`/review/${notification.postId}`)
  } else if (notification.type === 'system') {
    // 系统通知可能无需跳转
  }
}

// 查看更多通知
const viewMoreNotifications = () => {
  router.push('/notifications')
}

// 首次获取数据
onMounted(async () => {
  await notificationStore.fetchUnreadCount()
  
  // 实际应用中可以添加轮询或WebSocket实时获取新通知
  // 这里简单模拟30秒检查一次新通知
  setInterval(() => {
    notificationStore.fetchUnreadCount()
  }, 30000)
})
</script>

<style scoped>
.notification-badge {
  cursor: pointer;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.notification-title {
  font-weight: bold;
  font-size: 16px;
}

.notification-actions {
  font-size: 14px;
}

.notification-divider {
  margin: 0;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f5f7fa;
}

.notification-item.is-read {
  opacity: 0.8;
}

.notification-item:not(.is-read)::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 4px;
  width: 6px;
  height: 6px;
  background-color: #409EFF;
  border-radius: 50%;
  transform: translateY(-50%);
}

.notification-avatar {
  margin-right: 12px;
}

.notification-content {
  flex: 1;
}

.notification-message {
  font-size: 14px;
  margin-bottom: 6px;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}

.notification-options {
  padding: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.notification-item:hover .notification-options {
  opacity: 1;
}

.notification-loading,
.notification-empty {
  padding: 20px;
}

.notification-footer {
  text-align: center;
  border-top: 1px solid #f0f0f0;
  padding: 10px 0;
}
</style> 