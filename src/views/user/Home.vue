<template>
  <div class="home-container">
    <!-- 过滤栏
    <div class="filter-bar">
      <div class="filter-section">
        <el-radio-group v-model="currentFilter" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="followed">关注</el-radio-button>
          <el-radio-button label="recommend">推荐</el-radio-button>
        </el-radio-group>
      </div>
      <div class="search-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索评测内容..."
          prefix-icon="Search"
          clearable
          size="small"
          @keyup.enter="searchPosts"
        />
      </div>
    </div> -->

    <!-- 内容卡片列表 -->
    <div class="content-list">
      <!-- 加载状态 -->
      <div v-if="postStore.loading" class="loading-container">
        <el-skeleton :rows="3" animated />
        <el-skeleton style="margin-top: 20px" :rows="3" animated />
      </div>
      
      <!-- 空数据状态 -->
      <div v-else-if="displayPosts.length === 0" class="empty-data">
        暂无数据
      </div>
      
      <!-- 评测列表 -->
      <div v-else v-for="post in displayPosts" :key="post.id" class="content-card">
        <div class="card-header">
          <div class="user-info">
            <el-avatar :size="36" :src="post.userAvatar" @click="goToUserProfile(post)" class="clickable-avatar"></el-avatar>
            <div class="user-meta">
              <span class="username clickable-username" @click="goToUserProfile(post)">{{ post.username }}</span>
              <span class="datetime">{{ post.createTime }}</span>
            </div>
          </div>
          <div class="content-text" @click="viewDetail(post.id)">{{ post.content }}</div>
        </div>
        <div class="preview-images">
          <div 
            v-for="(image, index) in post.images" 
            :key="index" 
            class="preview-image"
            :style="{ backgroundImage: `url(${image})` }"
            @click="viewImage(image)"
          ></div>
        </div>
        <div class="card-footer">
          <!-- 添加调试信息 -->
          <!-- <div v-if="isDev" class="debug-info" style="font-size: 12px; color: #999; margin-bottom: 8px;">
            <pre>{{ JSON.stringify({ id: post.id, brand: post.brand, phoneModel: post.phoneModel, brandId: post.brandId, modelId: post.modelId }, null, 2) }}</pre>
          </div> -->
          <!-- 评分显示 -->
          <div class="phone-rating" v-if="post.rating">
            <span class="rating-text">综合评分:</span>
            <el-rate v-model="post.rating" disabled show-score :max="5" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
          </div>
          <div class="phone-tags">
            <span class="phone-brand-tag" v-if="post.brand">{{ post.brand }}</span>
            <span class="phone-model-tag" v-if="post.phoneModel">{{ post.phoneModel }}</span>
            <span class="phone-model-tag" v-if="!post.phoneModel && post.model">{{ post.model }}</span>
          </div>
          <div class="interaction-buttons">
            <div class="interaction-item">
              <el-button size="small" circle @click="toggleComment(post)">
                <el-icon><ChatLineRound /></el-icon>
              </el-button>
              <span class="count">{{ post.comments }}</span>
            </div>
            <div class="interaction-item">
              <el-button 
                size="small" 
                circle 
                :type="post.isLiked ? 'danger' : ''" 
                @click="toggleLike(post)"
              >
                <span class="custom-icon like-icon" :class="{ 'is-liked': post.isLiked }">♥</span>
              </el-button>
              <span class="count">{{ post.likes }}</span>
            </div>
            <div class="interaction-item">
              <el-button 
                size="small" 
                circle 
                :type="post.isFavorited ? 'warning' : ''" 
                @click="toggleFavorite(post)"
              >
                <el-icon>
                  <star-filled v-if="post.isFavorited" />
                  <star v-else />
                </el-icon>
              </el-button>
              <span class="count">{{ post.favorites || 0 }}</span>
            </div>
            <div class="interaction-item">
              <el-button 
                size="small" 
                type="primary" 
                @click="viewDetail(post.id)"
              >
                查看详情
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 评论区域（当点击评论按钮时显示） -->
        <div class="comments-area" v-if="post.showComments">
          <div class="comment-list">
            <div v-for="(comment, index) in post.commentList" :key="index" class="comment-item">
              <span class="comment-user">{{ comment.username }}:</span>
              <span class="comment-content">{{ comment.content }}</span>
            </div>
          </div>
          <div class="comment-input">
            <el-input 
              v-model="newComment" 
              placeholder="添加评论..." 
              @keyup.enter="addComment(post)"
              size="small"
            >
              <template #append>
                <el-button @click="addComment(post)">发送</el-button>
              </template>
            </el-input>
          </div>
        </div>
      </div>
      
      <!-- 分页组件 -->
      <div class="pagination-container" v-if="postStore.total > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="postStore.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ChatLineRound, Search, Share, Star, StarFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'
import commentApi from '@/api/modules/comment'

const router = useRouter()
const postStore = usePostStore()
const userStore = useUserStore()

// 是否为开发环境
const isDev = import.meta.env.DEV

// 筛选和搜索
const currentFilter = ref('all')
const searchKeyword = ref('')
const newComment = ref('')

// 分页相关 - 绑定到store
const currentPage = computed({
  get: () => postStore.currentPage,
  set: (val) => postStore.setPagination(val)
})
const pageSize = computed({
  get: () => postStore.pageSize,
  set: (val) => postStore.setPagination(currentPage.value, val)
})

// 计算当前页显示的帖子
const displayPosts = computed(() => postStore.displayPosts)

// 处理筛选变化
const handleFilterChange = (filter) => {
  // 重置分页
  postStore.setPagination(1)
  fetchPosts()
}

// 初始化方法
const initPage = async () => {
  // 初始化点赞和收藏状态
  postStore.initLikesAndFavorites()
  
  // 获取评测列表
  await fetchPosts()
}

// 获取评测列表
const fetchPosts = async () => {
  // 根据筛选条件构建请求参数
  const params = {}
  
  if (currentFilter.value === 'followed') {
    params.filterType = 'followed'
  } else if (currentFilter.value === 'recommend') {
    params.filterType = 'recommend'
  }
  
  if (searchKeyword.value) {
    params.keyword = searchKeyword.value
  }
  
  // 调用store方法获取数据
  await postStore.fetchPosts(params)
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  postStore.setPagination(1, size)
  fetchPosts()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  postStore.setPagination(page)
  fetchPosts()
}

// 查看详情页
const viewDetail = (postId) => {
  router.push(`/review/${postId}`)
}

// 跳转到用户个人主页
const goToUserProfile = (post) => {
  const userId = post.userId || post.id
  router.push(`/user-profile/${userId}`)
}

// 搜索帖子
const searchPosts = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage({
      message: '请输入搜索关键词',
      type: 'warning'
    })
    return
  }
  
  // 重置分页
  postStore.setPagination(1)
  fetchPosts()
}

// 点赞交互
const toggleLike = async (post) => {
  if (!userStore.isLoggedIn) {
    ElMessageBox.confirm(
      '请先登录后再进行操作',
      '提示',
      {
        confirmButtonText: '去登录',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(() => {
      router.push('/login')
    }).catch(() => {})
    return
  }
  
  await postStore.toggleLike(post)
}

// 收藏交互
const toggleFavorite = async (post) => {
  if (!userStore.isLoggedIn) {
    ElMessageBox.confirm(
      '请先登录后再进行操作',
      '提示',
      {
        confirmButtonText: '去登录',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(() => {
      router.push('/login')
    }).catch(() => {})
    return
  }
  
  await postStore.toggleFavorite(post)
}

// 评论交互
const toggleComment = (post) => {
  // 如果未登录，提示登录
  if (!userStore.isLoggedIn && !post.showComments) {
    ElMessageBox.confirm(
      '请先登录后再进行评论',
      '提示',
      {
        confirmButtonText: '去登录',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(() => {
      router.push('/login')
    }).catch(() => {})
    return
  }
  
  post.showComments = !post.showComments
}

// 添加评论
const addComment = async (post) => {
  if (!userStore.isLoggedIn) {
    ElMessageBox.confirm(
      '请先登录后再进行评论',
      '提示',
      {
        confirmButtonText: '去登录',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(() => {
      router.push('/login')
    }).catch(() => {})
    return
  }
  
  if (!newComment.value.trim()) {
    ElMessage.warning('评论内容不能为空')
    return
  }
  
  try {
    const result = await commentApi.createComment(post.id, {
      content: newComment.value
    })
    
    if (result) {
      // 更新评论列表
      if (!post.commentList) {
        post.commentList = []
      }
      
      post.commentList.push({
        id: result.id,
        userId: userStore.userInfo.id,
        username: userStore.userInfo.username,
        content: newComment.value,
        createTime: new Date().toISOString()
      })
      
      // 更新评论数
      post.comments += 1
      newComment.value = ''
      
      ElMessage.success('评论发表成功')
    }
  } catch (error) {
    console.error('Failed to add comment:', error)
    ElMessage.error('评论发表失败')
  }
}

// 查看大图
const viewImage = (imageUrl) => {
  // 实现图片预览功能
  if (window.viewerApi) {
    // 如果集成了图片预览组件(例如v-viewer)
    window.viewerApi.view(imageUrl)
  } else {
    // 简单实现：在新窗口打开
    window.open(imageUrl, '_blank')
  }
}

// 在组件挂载时获取数据
onMounted(() => {
  initPage()
})

// 监听搜索关键词变化，自动搜索
watch(searchKeyword, (newVal, oldVal) => {
  if (newVal === '' && oldVal) {
    // 当清空搜索框时，重新加载全部数据
    fetchPosts()
  }
})
</script>

<style scoped>
.home-container {
  width: 100%;
}

/* 过滤栏样式 */
.filter-bar {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-section {
  width: 300px;
}

/* 加载状态 */
.loading-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 内容列表样式 */
.content-list {
  width: 100%;
}

.empty-data {
  text-align: center;
  padding: 50px 0;
  color: #909399;
  font-size: 14px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.content-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  margin-bottom: 20px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-meta {
  margin-left: 10px;
}

.username {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.clickable-avatar {
  cursor: pointer;
}

.clickable-username {
  cursor: pointer;
}

.username:hover, .clickable-username:hover {
  color: #409EFF;
  text-decoration: underline;
}

.datetime {
  color: #999;
  font-size: 12px;
  margin-left: 10px;
}

.content-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-top: 10px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.content-text:hover {
  background-color: #f5f7fa;
  text-decoration: underline;
  color: #409EFF;
}

.preview-images {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.preview-image {
  width: 150px;
  height: 150px;
  background-color: #eee;
  border-radius: 5px;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  transition: transform 0.2s;
}

.preview-image:hover {
  transform: scale(1.03);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.phone-tags {
  display: flex;
  gap: 8px;
}

.phone-brand-tag, .phone-model-tag {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 12px;
  color: #666;
}

/* 评分样式 */
.phone-rating {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.rating-text {
  font-size: 13px;
  color: #666;
  margin-right: 10px;
}

.interaction-buttons {
  display: flex;
  gap: 15px;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.count {
  font-size: 13px;
  color: #666;
}

/* 评论区域样式 */
.comments-area {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.comment-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.comment-item {
  padding: 5px 0;
  font-size: 13px;
  line-height: 1.5;
}

.comment-user {
  font-weight: bold;
  color: #409EFF;
  margin-right: 5px;
}

.comment-content {
  color: #333;
}

.comment-input {
  margin-top: 10px;
}

/* 分页容器样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.custom-icon {
  font-style: normal;
  line-height: 1;
  transition: color 0.3s, transform 0.2s;
  display: inline-block;
}

.like-icon {
  font-size: 16px;
  color: #999;
}

.like-icon.is-liked {
  color: #ff6b6b;
  transform: scale(1.1);
}

/* 修改点赞按钮样式 */
.el-button.is-danger {
  background-color: rgba(245, 108, 108, 0.1) !important;
  border-color: #ff6b6b !important;
}

/* 修改收藏按钮样式 */
.el-button.is-warning {
  background-color: rgba(230, 162, 60, 0.1) !important;
  border-color: #e6a23c !important;
}
</style> 