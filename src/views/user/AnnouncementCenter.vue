<template>
  <div class="announcement-center">
    <div class="container">
      <h1 class="page-title">公告中心</h1>
      
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>
      
      <div v-else-if="announcements.length === 0" class="empty-container">
        <el-empty description="暂无公告" />
      </div>
      
      <div v-else class="announcements-list">
        <el-card v-for="announcement in announcements" :key="announcement.id" class="announcement-card">
          <div class="announcement-header">
            <h2 class="announcement-title">
              <el-tag v-if="announcement.isTop" size="small" type="danger" class="top-tag">置顶</el-tag>
              {{ announcement.title }}
            </h2>
            <div class="announcement-meta">
              <el-icon><Clock /></el-icon>
              <time>{{ formatDate(announcement.createTime) }}</time>
            </div>
          </div>
          
          <div class="announcement-content">{{ announcement.content }}</div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'
import announcementApi from '@/api/modules/announcement'

// 状态变量
const loading = ref(true)
const announcements = ref([])

// 获取公告列表
const fetchAnnouncements = async () => {
  loading.value = true
  try {
    const response = await announcementApi.getAnnouncements()
    if (response) {
      announcements.value = response
      
      // 按置顶和时间排序
      announcements.value.sort((a, b) => {
        // 首先按照是否置顶排序
        if (a.isTop !== b.isTop) {
          return a.isTop ? -1 : 1
        }
        // 其次按照创建时间排序（新的在前）
        return new Date(b.createTime) - new Date(a.createTime)
      })
    } else {
      ElMessage.error('获取公告失败')
    }
  } catch (error) {
    console.error('获取公告失败:', error)
    ElMessage.error('获取公告失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 在组件挂载时获取数据
onMounted(() => {
  fetchAnnouncements()
})
</script>

<style scoped>
.announcement-center {
  padding: 20px 0;
}

.page-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  padding-left: 15px;
  border-left: 4px solid #409EFF;
}

.loading-container,
.empty-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.announcement-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.announcement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.announcement-header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.announcement-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-tag {
  font-size: 12px;
}

.announcement-meta {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 13px;
  gap: 5px;
}

.announcement-content {
  line-height: 1.6;
  color: #606266;
  white-space: pre-line;
  font-size: 14px;
}
</style> 