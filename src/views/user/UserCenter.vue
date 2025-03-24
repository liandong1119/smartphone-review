<template>
  <div class="user-center">
    <el-row :gutter="20">
      <!-- 左侧用户信息卡片 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="6">
        <el-card class="user-info-card">
          <div class="user-avatar-container">
            <el-avatar :size="100" :src="userInfo.avatar"></el-avatar>
            <h2 class="username">{{ userInfo.username }}</h2>
            <p class="user-email">{{ userInfo.email }}</p>
            <el-tag v-if="userInfo.role === 'admin'" type="danger">管理员</el-tag>
            <el-tag v-else>普通用户</el-tag>
          </div>
          
          <el-divider />
          
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">{{ userStats.reviewCount }}</div>
              <div class="stat-label">已发布</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userStats.likeCount }}</div>
              <div class="stat-label">获赞</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userStats.viewCount }}</div>
              <div class="stat-label">阅读量</div>
            </div>
          </div>
          
          <div class="action-buttons">
            <el-button type="primary" @click="editProfile">编辑资料</el-button>
            <el-button @click="goToPost">发布评测</el-button>
          </div>
        </el-card>
      </el-col>
      
      <!-- 右侧内容区域 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="18">
        <el-card class="content-card">
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="我的评测" name="reviews">
              <div class="empty-placeholder" v-if="userReviews.length === 0">
                <el-empty description="暂无评测内容" />
                <el-button type="primary" @click="goToPost">发布第一篇评测</el-button>
              </div>
              
              <el-table
                v-else
                :data="userReviews"
                style="width: 100%"
                @row-click="viewReview"
                class="review-table"
              >
                <el-table-column label="标题" min-width="220">
                  <template #default="scope">
                    <div class="review-title-cell">
                      <div class="review-title">{{ scope.row.title }}</div>
                      <el-tag size="small" v-if="scope.row.status === 'draft'">草稿</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="publishTime" label="发布时间" width="180" sortable />
                <el-table-column prop="viewCount" label="阅读量" width="100" sortable />
                <el-table-column prop="likeCount" label="点赞数" width="100" sortable />
                <el-table-column prop="commentCount" label="评论数" width="100" sortable />
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="scope">
                    <el-button 
                      size="small" 
                      type="primary" 
                      @click.stop="editReview(scope.row)"
                    >
                      编辑
                    </el-button>
                    <el-button 
                      size="small" 
                      type="danger" 
                      @click.stop="deleteReview(scope.row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <div class="pagination-container" v-if="userReviews.length > 0">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[5, 10, 20]"
                  background
                  layout="total, sizes, prev, pager, next"
                  :total="totalItems"
                />
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="我的评论" name="comments">
              <div class="empty-placeholder" v-if="userComments.length === 0">
                <el-empty description="暂无评论内容" />
              </div>
              
              <div v-else class="comment-list">
                <div v-for="comment in userComments" :key="comment.id" class="comment-item">
                  <div class="comment-header">
                    <div class="comment-meta">
                      <span class="comment-review">《{{ comment.reviewTitle }}》</span>
                      <span class="comment-time">{{ comment.commentTime }}</span>
                    </div>
                    <div class="comment-actions">
                      <el-button size="small" type="text" @click="editComment(comment)">
                        <el-icon><EditPen /></el-icon>
                      </el-button>
                      <el-button size="small" type="text" @click="deleteComment(comment)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                  <div class="comment-content">{{ comment.content }}</div>
                </div>
                
                <div class="pagination-container">
                  <el-pagination
                    v-model:current-page="commentPage"
                    v-model:page-size="commentPageSize"
                    :page-sizes="[5, 10, 20]"
                    background
                    layout="total, sizes, prev, pager, next"
                    :total="totalComments"
                  />
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="我的收藏" name="favorites">
              <div class="empty-placeholder" v-if="userFavorites.length === 0">
                <el-empty description="暂无收藏内容" />
              </div>
              
              <el-row v-else :gutter="20" class="favorites-grid">
                <el-col :xs="24" :sm="12" :md="8" v-for="item in userFavorites" :key="item.id">
                  <el-card class="favorite-card" shadow="hover" @click="viewReview(item)">
                    <img :src="item.cover" class="favorite-image" />
                    <div class="favorite-info">
                      <div class="favorite-title">{{ item.title }}</div>
                      <div class="favorite-meta">
                        <span>{{ item.author }}</span>
                        <span>{{ item.collectTime }}</span>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              
              <div class="pagination-container" v-if="userFavorites.length > 0">
                <el-pagination
                  v-model:current-page="favoritePage"
                  v-model:page-size="favoritePageSize"
                  :page-sizes="[6, 12, 24]"
                  background
                  layout="total, sizes, prev, pager, next"
                  :total="totalFavorites"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 编辑个人资料对话框 -->
    <el-dialog v-model="profileDialogVisible" title="编辑个人资料" width="500px">
      <el-form :model="profileForm" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="#"
            :http-request="uploadAvatar"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="profileForm.avatarUrl" :src="profileForm.avatarUrl" class="avatar-image" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input
            v-model="profileForm.bio"
            type="textarea"
            rows="4"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="profileDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { EditPen, Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const activeTab = ref('reviews')
const profileDialogVisible = ref(false)

// 用户信息
const userInfo = ref({
  username: '用户名',
  email: 'user@example.com',
  avatar: 'https://via.placeholder.com/100',
  role: 'user',
  bio: '这是一段个人简介'
})

// 用户统计信息
const userStats = ref({
  reviewCount: 5,
  likeCount: 120,
  viewCount: 3560
})

// 个人资料表单
const profileForm = ref({
  username: '',
  avatarUrl: '',
  bio: ''
})

// 评测列表
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const userReviews = ref([])

// 评论列表
const commentPage = ref(1)
const commentPageSize = ref(5)
const totalComments = ref(0)
const userComments = ref([])

// 收藏列表
const favoritePage = ref(1)
const favoritePageSize = ref(6)
const totalFavorites = ref(0)
const userFavorites = ref([])

// 切换标签页
const handleTabClick = (tab) => {
  switch(tab.props.name) {
    case 'reviews':
      fetchUserReviews()
      break
    case 'comments':
      fetchUserComments()
      break
    case 'favorites':
      fetchUserFavorites()
      break
  }
}

// 获取用户评测列表
const fetchUserReviews = () => {
  // 模拟API调用
  setTimeout(() => {
    // 模拟数据
    userReviews.value = [
      {
        id: 1,
        title: 'iPhone 15 Pro 全面评测：从设计到性能的全方位分析',
        publishTime: '2023-09-25',
        viewCount: 1580,
        likeCount: 67,
        commentCount: 23,
        status: 'published'
      },
      {
        id: 2,
        title: '华为Mate60 Pro使用体验：重返巅峰？',
        publishTime: '2023-09-15',
        viewCount: 1280,
        likeCount: 53,
        commentCount: 19,
        status: 'published'
      },
      {
        id: 3,
        title: '小米14 Ultra相机深度评测（草稿）',
        publishTime: '尚未发布',
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        status: 'draft'
      }
    ]
    totalItems.value = userReviews.value.length
  }, 300)
}

// 获取用户评论列表
const fetchUserComments = () => {
  // 模拟API调用
  setTimeout(() => {
    // 模拟数据
    userComments.value = [
      {
        id: 1,
        reviewTitle: 'Galaxy S23 Ultra评测',
        content: '这篇评测非常全面，尤其是相机部分的分析很专业，对我选购手机很有帮助。',
        commentTime: '2023-08-15'
      },
      {
        id: 2,
        reviewTitle: 'OPPO Find X6 Pro深度体验',
        content: '作为一个OPPO的老用户，非常认同这篇评测的观点，尤其是关于屏幕素质的评价很客观。',
        commentTime: '2023-07-22'
      }
    ]
    totalComments.value = userComments.value.length
  }, 300)
}

// 获取用户收藏列表
const fetchUserFavorites = () => {
  // 模拟API调用
  setTimeout(() => {
    // 模拟数据
    userFavorites.value = [
      {
        id: 1,
        title: '一加12全面评测：真旗舰的回归',
        author: '手机评测员',
        cover: 'https://via.placeholder.com/300x200',
        collectTime: '2023-09-10'
      },
      {
        id: 2,
        title: 'vivo X100 Pro+相机评测：蔡司加持的影像旗舰',
        author: '摄影大师',
        cover: 'https://via.placeholder.com/300x200',
        collectTime: '2023-08-25'
      }
    ]
    totalFavorites.value = userFavorites.value.length
  }, 300)
}

// 查看评测详情
const viewReview = (review) => {
  if (review.status === 'draft') {
    editReview(review)
  } else {
    router.push(`/review/${review.id}`)
  }
}

// 编辑评测
const editReview = (review) => {
  router.push(`/post?id=${review.id}`)
}

// 删除评测
const deleteReview = (review) => {
  ElMessageBox.confirm(
    `确定要删除评测"${review.title}"吗？此操作不可恢复。`,
    '警告',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟删除操作
    userReviews.value = userReviews.value.filter(item => item.id !== review.id)
    totalItems.value -= 1
    ElMessage.success('评测已删除')
  }).catch(() => {
    // 取消操作
  })
}

// 编辑评论
const editComment = (comment) => {
  ElMessageBox.prompt('编辑评论内容', '编辑评论', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: comment.content,
    inputType: 'textarea'
  }).then(({ value }) => {
    // 模拟更新评论
    const index = userComments.value.findIndex(item => item.id === comment.id)
    if (index !== -1) {
      userComments.value[index].content = value
      ElMessage.success('评论已更新')
    }
  }).catch(() => {
    // 取消操作
  })
}

// 删除评论
const deleteComment = (comment) => {
  ElMessageBox.confirm(
    '确定要删除这条评论吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟删除操作
    userComments.value = userComments.value.filter(item => item.id !== comment.id)
    totalComments.value -= 1
    ElMessage.success('评论已删除')
  }).catch(() => {
    // 取消操作
  })
}

// 编辑个人资料
const editProfile = () => {
  profileForm.value = {
    username: userInfo.value.username,
    avatarUrl: userInfo.value.avatar,
    bio: userInfo.value.bio
  }
  profileDialogVisible.value = true
}

// 保存个人资料
const saveProfile = () => {
  // 模拟保存操作
  userInfo.value.username = profileForm.value.username
  userInfo.value.avatar = profileForm.value.avatarUrl
  userInfo.value.bio = profileForm.value.bio
  
  ElMessage.success('个人资料已更新')
  profileDialogVisible.value = false
}

// 头像上传相关
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('头像必须是图片格式!')
  }
  
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过2MB!')
  }
  
  return isImage && isLt2M
}

const uploadAvatar = (options) => {
  // 模拟上传
  const reader = new FileReader()
  reader.readAsDataURL(options.file)
  reader.onload = () => {
    profileForm.value.avatarUrl = reader.result
    options.onSuccess()
  }
}

// 前往发布评测页面
const goToPost = () => {
  router.push('/post')
}

// 组件加载时初始化数据
onMounted(() => {
  // 从localStorage获取用户信息
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const userData = JSON.parse(storedUser)
    userInfo.value.username = userData.username || '用户名'
    userInfo.value.email = userData.email || 'user@example.com'
    userInfo.value.avatar = userData.avatar || 'https://via.placeholder.com/100'
    userInfo.value.role = userData.role || 'user'
  }
  
  // 获取用户评测列表
  fetchUserReviews()
})
</script>

<style scoped>
.user-center {
  padding-bottom: 40px;
}

.user-info-card {
  margin-bottom: 20px;
}

.user-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.username {
  margin: 15px 0 5px;
  font-size: 18px;
}

.user-email {
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0 10px;
}

.content-card {
  min-height: 500px;
}

.empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.empty-placeholder .el-button {
  margin-top: 20px;
}

.review-table {
  cursor: pointer;
}

.review-title-cell {
  display: flex;
  align-items: center;
}

.review-title {
  margin-right: 10px;
  flex: 1;
}

.comment-list {
  padding: 10px 0;
}

.comment-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-meta {
  font-size: 14px;
}

.comment-review {
  font-weight: bold;
  margin-right: 10px;
}

.comment-time {
  color: #909399;
}

.comment-content {
  line-height: 1.6;
  color: #606266;
}

.favorites-grid {
  margin-top: 20px;
}

.favorite-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.favorite-card:hover {
  transform: translateY(-5px);
}

.favorite-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.favorite-info {
  padding: 10px;
}

.favorite-title {
  font-weight: bold;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.favorite-meta {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 12px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .user-stats {
    margin: 10px 0;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .content-card {
    margin-top: 0;
  }
}
</style> 