<template>
  <div class="latest-reviews-container">
    <div class="page-header">
      <h1 class="page-title">最新评测</h1>
      <div class="page-description">查看用户最新发布的智能手机评测</div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
      <el-skeleton style="margin-top: 20px" :rows="3" animated />
    </div>
    
    <!-- 空数据状态 -->
    <el-empty v-else-if="posts.length === 0" description="暂无评测数据" />
    
    <!-- 评测列表 -->
    <div v-else class="posts-list">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <div class="post-image" v-if="post.coverImage" @click="viewDetail(post.id)">
          <img :src="post.coverImage" :alt="post.title" />
        </div>
        <div class="post-content">
          <h2 class="post-title" @click="viewDetail(post.id)">{{ post.title }}</h2>
          
          <div class="post-meta">
            <div class="author-info" @click.stop="navigateToUserProfile(post.userId)">
              <el-avatar :size="24" :src="post.userAvatar" class="author-avatar" />
              <span class="author-name">{{ post.username }}</span>
            </div>
            <div class="post-time">{{ formatDate(post.createTime) }}</div>
          </div>
          
          <div class="post-excerpt" @click="viewDetail(post.id)">{{ truncateText(post.content, 150) }}</div>
          
          <div class="post-tags">
            <el-tag size="small" type="info" v-if="post.brand">{{ post.brand }}</el-tag>
            <el-tag size="small" type="success" v-if="post.phoneModel">{{ post.phoneModel }}</el-tag>
          </div>
          
          <div class="post-interactions">
            <div class="interaction-item">
              <el-button 
                size="small" 
                circle
                :type="post.isLiked ? 'danger' : ''"
                @click.stop="toggleLike(post)"
              >
                <el-icon><CaretTop /></el-icon>
              </el-button>
              <span>{{ post.likes || 0 }}</span>
            </div>
            <div class="interaction-item">
              <el-button 
                size="small" 
                circle
                :type="post.isFavorited ? 'warning' : ''"
                @click.stop="toggleFavorite(post)"
              >
                <el-icon>
                  <star-filled v-if="post.isFavorited" />
                  <star v-else />
                </el-icon>
              </el-button>
              <span>{{ post.favorites || 0 }}</span>
            </div>
            <div class="interaction-item" @click="viewDetail(post.id)">
              <el-button size="small" circle>
                <el-icon><ChatLineRound /></el-icon>
              </el-button>
              <span>{{ post.comments || 0 }}</span>
            </div>
            <div class="interaction-item">
              <el-icon><View /></el-icon>
              <span>{{ post.views || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分页 -->
    <div class="pagination-container" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { View, ChatLineRound, Star, StarFilled, CaretTop } from '@element-plus/icons-vue'
import instance from '@/utils/http'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 用户登录状态
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 状态
const loading = ref(true)
const posts = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取最新评测
const fetchLatestReviews = async () => {
  loading.value = true
  try {
    const response = await instance.get('/posts', {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
        sortBy: 'createTime',
        sortOrder: 'desc'
      }
    })
    
    if (response && response.records) {
      posts.value = response.records
      total.value = response.total || 0
    } else if (response && response.data && response.data.records) {
      posts.value = response.data.records
      total.value = response.data.total || 0
    } else {
      posts.value = []
      total.value = 0
      ElMessage.warning('获取数据格式异常')
    }
    
    // 初始化交互状态
    initInteractionStates()
  } catch (error) {
    console.error('获取最新评测失败:', error)
    ElMessage.error('获取最新评测失败')
    posts.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 初始化交互状态
const initInteractionStates = () => {
  try {
    // 从localStorage获取数据，确保是数组格式
    const likedPostsStr = localStorage.getItem('likedPosts')
    const favoritedPostsStr = localStorage.getItem('favoritedPosts')
    
    const likedPosts = likedPostsStr ? JSON.parse(likedPostsStr) : []
    const favoritedPosts = favoritedPostsStr ? JSON.parse(favoritedPostsStr) : []
    
    // 确保数据是数组
    if (!Array.isArray(likedPosts)) {
      localStorage.setItem('likedPosts', '[]')
    }
    if (!Array.isArray(favoritedPosts)) {
      localStorage.setItem('favoritedPosts', '[]')
    }
    
    // 更新帖子的交互状态
    posts.value.forEach(post => {
      post.isLiked = Array.isArray(likedPosts) && likedPosts.includes(post.id)
      post.isFavorited = Array.isArray(favoritedPosts) && favoritedPosts.includes(post.id)
    })
  } catch (error) {
    console.error('初始化交互状态失败:', error)
    // 如果出错，重置localStorage
    localStorage.setItem('likedPosts', '[]')
    localStorage.setItem('favoritedPosts', '[]')
  }
}

// 点赞/取消点赞
const toggleLike = async (post) => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  try {
    const response = await instance.post(`/posts/${post.id}/like`)
    if (response && (response.success || response.code === 200)) {
      post.isLiked = !post.isLiked
      post.likes = post.isLiked ? (post.likes || 0) + 1 : (post.likes || 1) - 1
      
      // 更新localStorage
      const likedPostsStr = localStorage.getItem('likedPosts')
      let likedPosts = likedPostsStr ? JSON.parse(likedPostsStr) : []
      
      if (post.isLiked) {
        if (!likedPosts.includes(post.id)) {
          likedPosts.push(post.id)
        }
      } else {
        likedPosts = likedPosts.filter(id => id !== post.id)
      }
      
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
      ElMessage.success(post.isLiked ? '点赞成功' : '已取消点赞')
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 收藏/取消收藏
const toggleFavorite = async (post) => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  try {
    const response = await instance.post(`/posts/${post.id}/favorite`)
    if (response && (response.success || response.code === 200)) {
      post.isFavorited = !post.isFavorited
      post.favorites = post.isFavorited ? (post.favorites || 0) + 1 : (post.favorites || 1) - 1
      
      // 更新localStorage
      const favoritedPostsStr = localStorage.getItem('favoritedPosts')
      let favoritedPosts = favoritedPostsStr ? JSON.parse(favoritedPostsStr) : []
      
      if (post.isFavorited) {
        if (!favoritedPosts.includes(post.id)) {
          favoritedPosts.push(post.id)
        }
      } else {
        favoritedPosts = favoritedPosts.filter(id => id !== post.id)
      }
      
      localStorage.setItem('favoritedPosts', JSON.stringify(favoritedPosts))
      ElMessage.success(post.isFavorited ? '收藏成功' : '已取消收藏')
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 查看评测详情
const viewDetail = (postId) => {
  router.push(`/review/${postId}`)
}

// 导航到用户主页
const navigateToUserProfile = (userId) => {
  router.push(`/user/${userId}`)
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchLatestReviews()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchLatestReviews()
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 文本截断
const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 页面加载时获取数据
onMounted(() => {
  fetchLatestReviews()
})
</script>

<style scoped>
.latest-reviews-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  position: relative;
  padding-left: 15px;
  border-left: 4px solid #409EFF;
}

.page-description {
  color: #606266;
  font-size: 16px;
}

.loading-container {
  margin: 40px 0;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.post-card {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.post-image {
  flex: 0 0 200px;
  height: 200px;
  overflow: hidden;
  cursor: pointer;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.post-image:hover img {
  transform: scale(1.05);
}

.post-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.post-title {
  font-size: 20px;
  margin: 0 0 15px;
  font-weight: 600;
  color: #303133;
  cursor: pointer;
}

.post-title:hover {
  color: #409EFF;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.author-info:hover .author-name {
  text-decoration: underline;
}

.author-name {
  color: #409EFF;
}

.post-time {
  color: #909399;
}

.post-excerpt {
  flex: 1;
  margin-bottom: 15px;
  color: #606266;
  line-height: 1.6;
  cursor: pointer;
}

.post-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.post-interactions {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  color: #909399;
  font-size: 14px;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

@media (max-width: 768px) {
  .post-card {
    flex-direction: column;
  }
  
  .post-image {
    flex: 0 0 200px;
    width: 100%;
  }
  
  .post-interactions {
    flex-wrap: wrap;
    gap: 15px;
  }
}
</style> 