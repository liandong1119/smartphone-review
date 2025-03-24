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
            <div class="notification-icon">
              <el-avatar :size="36" :src="notification.senderAvatar" v-if="notification.senderAvatar"></el-avatar>
              <div v-else class="icon-container" :class="`icon-${notification.type || 'default'}`">
                <el-icon v-if="notification.type === 'system'"><Bell /></el-icon>
                <el-icon v-else-if="notification.type === 'comment' || notification.type === 'comment_reply'"><ChatLineRound /></el-icon>
                <el-icon v-else-if="notification.type === 'post_like' || notification.type === 'comment_like'"><Star /></el-icon>
                <el-icon v-else-if="notification.type === 'user_follow'"><User /></el-icon>
                <el-icon v-else><InfoFilled /></el-icon>
              </div>
            </div>
            <div class="notification-content">
              <div class="notification-title-text" v-if="notification.title">{{ notification.title }}</div>
              <div class="notification-message" v-html="notification.content"></div>
              <div class="notification-time">{{ formatTime(notification.createTime) }}</div>
            </div>
            <div class="notification-options">
              <el-dropdown trigger="click" @click.stop>
                <el-icon><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="!notification.isRead" @click.stop="markAsRead(notification.id)">
                      <el-icon><Check /></el-icon> 标为已读
                    </el-dropdown-item>
                    <el-dropdown-item v-if="notification.link" @click.stop="viewDetail(notification)">
                      <el-icon><View /></el-icon> 查看详情
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
import { Bell, Check, Delete, MoreFilled, ChatLineRound, User, Star, InfoFilled, View } from '@element-plus/icons-vue'
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

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  
  // 简单处理，仅显示日期
  const date = new Date(time)
  if (isNaN(date.getTime())) return ''
  
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天 ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

// 查看详情
const viewDetail = (notification) => {
  if (notification.link) {
    router.push(notification.link)
  }
}

// 处理通知点击
const handleNotificationClick = async (notification) => {
  if (!notification.isRead) {
    await markAsRead(notification.id)
  }
  
  // 根据通知类型跳转到相应页面
  if (notification.link) {
    router.push(notification.link)
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

.notification-icon {
  margin-right: 12px;
}

.icon-container {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f0f0f0;
}

.icon-system {
  background-color: #e1f3d8;
  color: #67c23a;
}

.icon-comment, .icon-comment_reply {
  background-color: #e6f7ff;
  color: #1890ff;
}

.icon-post_like, .icon-comment_like {
  background-color: #fff7e6;
  color: #faad14;
}

.icon-user_follow {
  background-color: #f0f2ff;
  color: #722ed1;
}

.icon-default {
  background-color: #f4f4f5;
  color: #909399;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title-text {
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 14px;
  color: #333;
}

.notification-message {
  font-size: 13px;
  margin-bottom: 6px;
  line-height: 1.4;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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

:deep(.el-icon) {
  vertical-align: middle;
}
</style> 