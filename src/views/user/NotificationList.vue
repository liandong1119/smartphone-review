<template>
  <div class="notification-list-container">
    <el-card class="notification-card">
      <template #header>
        <div class="card-header">
          <h2 class="header-title">我的通知</h2>
          <div class="header-actions">
            <el-button type="primary" plain size="small" @click="markAllAsRead" :disabled="notifications.every(n => n.isRead) || notifications.length === 0">
              全部标为已读
            </el-button>
          </div>
        </div>
      </template>
      
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="10" animated />
      </div>
      
      <div v-else-if="notifications.length === 0" class="empty-state">
        <el-empty description="暂无通知消息" />
      </div>
      
      <div v-else class="notification-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id" 
          class="notification-item"
          :class="{ 'is-read': notification.isRead }"
        >
          <div class="notification-content" @click="handleNotificationClick(notification)">
            <div class="notification-avatar">
              <el-avatar :size="40" :src="notification.senderAvatar"></el-avatar>
            </div>
            <div class="notification-info">
              <div class="notification-message" v-html="notification.content"></div>
              <div class="notification-meta">
                <span class="notification-time">{{ notification.time }}</span>
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
              @click="markAsRead(notification.id)"
            >
              标为已读
            </el-button>
            <el-button 
              type="danger" 
              plain 
              size="small" 
              @click="deleteNotification(notification.id)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination-container" v-if="notifications.length > 0">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { notificationApi } from '../../api'

const router = useRouter()
const notifications = ref([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)
const totalNotifications = ref(0)

// 获取通知列表
const fetchNotifications = async () => {
  loading.value = true
  try {
    // 实际环境下调用API
    // const response = await notificationApi.getNotifications({ 
    //   page: currentPage.value, 
    //   limit: pageSize.value 
    // })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockData = generateMockNotifications()
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    
    notifications.value = mockData.slice(startIndex, endIndex)
    totalNotifications.value = mockData.length
    
    loading.value = false
  } catch (error) {
    console.error('获取通知失败', error)
    ElMessage.error('获取通知失败')
    loading.value = false
  }
}

// 标记通知为已读
const markAsRead = async (notificationId) => {
  try {
    // 实际环境下调用API
    // await notificationApi.markAsRead(notificationId)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 更新本地状态
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
    
    ElMessage.success('已标记为已读')
  } catch (error) {
    ElMessage.error('操作失败')
    console.error('标记已读失败', error)
  }
}

// 标记所有通知为已读
const markAllAsRead = async () => {
  ElMessageBox.confirm('确定要将所有通知标记为已读吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async () => {
    try {
      // 实际环境下调用API
      // await notificationApi.markAllAsRead()
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 更新本地状态
      notifications.value.forEach(notification => {
        notification.isRead = true
      })
      
      ElMessage.success('全部标记为已读')
    } catch (error) {
      ElMessage.error('操作失败')
      console.error('标记全部已读失败', error)
    }
  }).catch(() => {
    // 用户取消操作
  })
}

// 删除通知
const deleteNotification = async (notificationId) => {
  ElMessageBox.confirm('确定要删除此通知吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 实际环境下调用API
      // await notificationApi.deleteNotification(notificationId)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 更新本地状态
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        notifications.value.splice(index, 1)
      }
      
      ElMessage.success('通知已删除')
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('删除通知失败', error)
    }
  }).catch(() => {
    // 用户取消操作
  })
}

// 处理通知点击
const handleNotificationClick = (notification) => {
  if (!notification.isRead) {
    markAsRead(notification.id)
  }
  
  // 根据通知类型跳转到相应页面
  if (notification.type === 'comment_reply' || notification.type === 'post_like') {
    router.push(`/review/${notification.postId}`)
  } else if (notification.type === 'user_follow') {
    router.push(`/user-profile/${notification.senderId}`)
  }
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchNotifications()
}

// 生成模拟通知数据
const generateMockNotifications = () => {
  const notifications = []
  
  // 评论回复通知
  for (let i = 1; i <= 7; i++) {
    notifications.push({
      id: `comment_${i}`,
      type: 'comment_reply',
      content: `<strong>用户${i}</strong> 回复了你的评论：这是第${i}条回复，感谢您的分享！`,
      senderAvatar: `https://cube.elemecdn.com/${i % 3}/88/03b0d39583f48206768a7534e55bcpng.png`,
      senderId: `user_${100 + i}`,
      postId: `${i % 5 + 1}`,
      time: i <= 2 ? `${i}小时前` : `${i-2}天前`,
      isRead: i > 3
    })
  }
  
  // 点赞通知
  for (let i = 1; i <= 5; i++) {
    notifications.push({
      id: `like_${i}`,
      type: 'post_like',
      content: `<strong>点赞用户${i}</strong> 赞了你的评测文章《手机评测${i}》`,
      senderAvatar: `https://cube.elemecdn.com/${(i+1) % 3}/88/03b0d39583f48206768a7534e55bcpng.png`,
      senderId: `user_${200 + i}`,
      postId: `${i % 5 + 1}`,
      time: i <= 2 ? `${i+3}小时前` : `${i}天前`,
      isRead: i > 2
    })
  }
  
  // 关注通知
  for (let i = 1; i <= 3; i++) {
    notifications.push({
      id: `follow_${i}`,
      type: 'user_follow',
      content: `<strong>关注用户${i}</strong> 关注了你`,
      senderAvatar: `https://cube.elemecdn.com/${(i+2) % 3}/88/03b0d39583f48206768a7534e55bcpng.png`,
      senderId: `user_${300 + i}`,
      time: `${i+5}天前`,
      isRead: true
    })
  }
  
  // 按时间排序，最新的在前
  return notifications.sort((a, b) => {
    const aTime = a.time.includes('小时') ? parseInt(a.time) : parseInt(a.time) * 24
    const bTime = b.time.includes('小时') ? parseInt(b.time) : parseInt(b.time) * 24
    return aTime - bTime
  })
}

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
  font-weight: bold;
}

.loading-state,
.empty-state {
  padding: 40px 0;
  text-align: center;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item.is-read {
  opacity: 0.8;
}

.notification-content {
  display: flex;
  flex: 1;
  cursor: pointer;
}

.notification-content:hover {
  opacity: 0.9;
}

.notification-avatar {
  margin-right: 16px;
}

.notification-info {
  flex: 1;
}

.notification-message {
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.5;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}

.unread-badge {
  font-size: 12px;
  background-color: #409EFF;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
}

.notification-actions {
  display: flex;
  gap: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
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
  }
}
</style> 