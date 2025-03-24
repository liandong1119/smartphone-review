<template>
  <div class="notification-list-container">
    <el-card class="notification-card">
      <template #header>
        <div class="card-header">
          <h2 class="header-title">我的通知</h2>
          <div class="header-actions">
            <el-button-group>
              <el-button 
                type="primary" 
                :plain="activeType !== 'all'" 
                size="small" 
                @click="activeType = 'all'"
              >
                全部
              </el-button>
              <el-button 
                type="primary" 
                :plain="activeType !== 'unread'" 
                size="small" 
                @click="activeType = 'unread'"
              >
                未读
              </el-button>
              <el-button 
                type="primary" 
                :plain="activeType !== 'system'" 
                size="small" 
                @click="activeType = 'system'"
              >
                系统通知
              </el-button>
            </el-button-group>
            <el-button type="success" plain size="small" @click="markAllAsRead" :disabled="!hasUnread">
              全部标为已读
            </el-button>
          </div>
        </div>
      </template>
      
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="10" animated />
      </div>
      
      <div v-else-if="filteredNotifications.length === 0" class="empty-state">
        <el-empty description="暂无通知消息" />
      </div>
      
      <div v-else class="notification-list">
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id" 
          class="notification-item"
          :class="{ 'is-read': notification.isRead }"
        >
          <div class="notification-content" @click="handleNotificationClick(notification)">
            <div class="notification-icon">
              <el-avatar :size="40" :src="notification.senderAvatar" v-if="notification.senderAvatar"></el-avatar>
              <div v-else class="icon-container" :class="`icon-${notification.type || 'default'}`">
                <el-icon v-if="notification.type === 'system'"><Bell /></el-icon>
                <el-icon v-else-if="notification.type === 'comment' || notification.type === 'comment_reply'"><ChatLineRound /></el-icon>
                <el-icon v-else-if="notification.type === 'post_like' || notification.type === 'comment_like'"><Star /></el-icon>
                <el-icon v-else-if="notification.type === 'user_follow'"><User /></el-icon>
                <el-icon v-else><InfoFilled /></el-icon>
              </div>
            </div>
            <div class="notification-info">
              <div class="notification-title" v-if="notification.title">{{ notification.title }}</div>
              <div class="notification-message" v-html="notification.content"></div>
              <div class="notification-meta">
                <span class="notification-type" v-if="notification.type">{{ getTypeLabel(notification.type) }}</span>
                <span class="notification-time">{{ formatTime(notification.createTime) }}</span>
                <span v-if="!notification.isRead" class="unread-badge">未读</span>
              </div>
            </div>
          </div>
          <div class="notification-actions">
            <el-button 
              v-if="!notification.isRead" 
              type="primary" 
              plain 
              size="small" 
              @click.stop="markAsRead(notification.id)"
            >
              标为已读
            </el-button>
            <el-button 
              v-if="notification.link"
              type="success" 
              plain 
              size="small" 
              @click.stop="viewDetail(notification)"
            >
              查看详情
            </el-button>
            <el-button 
              type="danger" 
              plain 
              size="small" 
              @click.stop="confirmDelete(notification.id)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination-container" v-if="filteredNotifications.length > 0">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalNotifications"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useNotificationStore } from '@/stores/notification'
import { Bell, ChatLineRound, Star, User, InfoFilled } from '@element-plus/icons-vue'

const router = useRouter()
const notificationStore = useNotificationStore()
const activeType = ref('all')

// 计算属性
const notifications = computed(() => notificationStore.notifications)
const loading = computed(() => notificationStore.loading)
const currentPage = computed({
  get: () => notificationStore.currentPage,
  set: (val) => notificationStore.setPagination(val)
})
const pageSize = computed(() => notificationStore.pageSize)
const totalNotifications = computed(() => notificationStore.total)
const hasUnread = computed(() => notifications.value.some(n => !n.isRead))

// 筛选通知
const filteredNotifications = computed(() => {
  if (activeType.value === 'all') {
    return notifications.value;
  } else if (activeType.value === 'unread') {
    return notifications.value.filter(n => !n.isRead);
  } else if (activeType.value === 'system') {
    return notifications.value.filter(n => n.type === 'system');
  }
  return notifications.value;
})

// 获取通知类型的文本标签
const getTypeLabel = (type) => {
  switch (type) {
    case 'system': return '系统通知';
    case 'comment': return '评论通知';
    case 'comment_reply': return '回复通知';
    case 'post_like': return '点赞通知';
    case 'comment_like': return '评论点赞';
    case 'user_follow': return '关注通知';
    default: return '通知';
  }
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

// 获取通知列表
const fetchNotifications = async () => {
  await notificationStore.fetchNotifications()
}

// 标记为已读
const markAsRead = async (notificationId) => {
  await notificationStore.markAsRead(notificationId)
  ElMessage.success('已标记为已读')
}

// 标记全部已读
const markAllAsRead = async () => {
  ElMessageBox.confirm('确定要将所有通知标记为已读吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async () => {
    await notificationStore.markAllAsRead()
    ElMessage.success('所有通知已标记为已读')
  }).catch(() => {})
}

// 确认删除
const confirmDelete = (notificationId) => {
  ElMessageBox.confirm('确定要删除这条通知吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await notificationStore.deleteNotification(notificationId)
    ElMessage.success('通知已删除')
  }).catch(() => {})
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
  
  if (notification.link) {
    router.push(notification.link)
  }
}

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchNotifications()
}

// 监听类型变化
watch(activeType, () => {
  currentPage.value = 1
  fetchNotifications()
})

// 初始化
onMounted(() => {
  fetchNotifications()
})
</script>

<style scoped>
.notification-list-container {
  width: 100%;
}

.notification-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  margin: 0;
  font-size: 18px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.notification-list {
  margin-top: 20px;
}

.notification-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
  justify-content: space-between;
  align-items: flex-start;
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

.notification-content {
  display: flex;
  flex: 1;
  cursor: pointer;
}

.notification-icon {
  margin-right: 15px;
  flex-shrink: 0;
}

.icon-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f0f0f0;
  font-size: 18px;
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

.notification-info {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 500;
  margin-bottom: 5px;
  font-size: 15px;
  color: #333;
}

.notification-message {
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #909399;
}

.notification-type {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.notification-time {
  color: #909399;
}

.unread-badge {
  color: #f56c6c;
  font-weight: bold;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 90px;
}

.loading-state,
.empty-state {
  padding: 40px 0;
  text-align: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .notification-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .notification-content {
    margin-bottom: 12px;
    width: 100%;
  }
  
  .notification-actions {
    align-self: flex-end;
    flex-direction: row;
  }
}
</style> 