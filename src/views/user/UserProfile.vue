<template>
  <div class="user-profile-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-skeleton animated :rows="10" />
    </div>
    
    <!-- 用户资料卡片 -->
    <div v-else class="profile-wrapper">
      <el-card class="profile-card">
        <!-- 用户基本信息 -->
        <div class="user-header">
          <div class="avatar-container">
            <el-avatar :size="100" :src="userProfile.avatar" />
          </div>
          <div class="user-info">
            <h2 class="username">{{ userProfile.username }}</h2>
            <p class="user-bio">{{ userProfile.bio || '这个人很懒，还没有填写个人简介' }}</p>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-value">{{ userProfile.postsCount }}</span>
                <span class="stat-label">发布</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ userProfile.totalLikes }}</span>
                <span class="stat-label">获赞</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ userProfile.viewCount }}</span>
                <span class="stat-label">浏览</span>
              </div>
            </div>
          </div>
          <!-- 编辑资料按钮 -->
          <div class="edit-actions" v-if="isCurrentUser">
            <el-button 
              type="primary" 
              plain
              @click="editProfile"
            >
              编辑资料
            </el-button>
          </div>
        </div>
      </el-card>
      
      <!-- 用户发布的评测列表 -->
      <el-card class="posts-card">
        <template #header>
          <div class="card-header">
            <span>发布的评测</span>
          </div>
        </template>
        
        <div v-if="userPosts.length > 0" class="posts-list">
          <div class="post-item" v-for="post in userPosts" :key="post.id">
            <div class="post-header">
              <span class="post-title">{{ post.content.substring(0, 30) }}{{ post.content.length > 30 ? '...' : '' }}</span>
              <span class="post-date">{{ post.createTime }}</span>
            </div>
            <div class="post-preview">
              <div class="preview-image" v-if="post.images && post.images.length > 0">
                <img :src="post.images[0]" alt="预览图" />
              </div>
              <div class="preview-content">
                <div class="post-stats">
                  <span class="stat">
                    <el-icon><View /></el-icon> {{ post.views || 0 }}
                  </span>
                  <span class="stat">
                    <el-icon><ChatDotRound /></el-icon> {{ post.comments || 0 }}
                  </span>
                  <span class="stat">
                    <el-icon><Star /></el-icon> {{ post.likes || 0 }}
                  </span>
                </div>
                <div class="action-buttons">
                  <el-button 
                    type="primary" 
                    size="small" 
                    plain
                    @click="goToReviewDetail(post.id)"
                  >查看详情</el-button>
                  <el-button 
                    v-if="isCurrentUser"
                    type="danger" 
                    size="small" 
                    plain
                    @click="deletePost(post.id)"
                  >删除</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 没有评测时的提示 -->
        <div v-else class="empty-posts">
          <el-empty description="暂无发布的评测" />
          <el-button v-if="isCurrentUser" type="primary" @click="goToPost">发布第一篇评测</el-button>
        </div>
        
        <!-- 分页器 -->
        <div class="pagination-container" v-if="userPosts.length > 0">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalPosts"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </div>

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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, ChatDotRound, Star, Plus } from '@element-plus/icons-vue'
import userApi from '../../api/modules/user'

const route = useRoute()
const router = useRouter()
const userId = ref(route.params.id)
const userProfile = ref({})
const userPosts = ref([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(5)
const totalPosts = ref(0)
const profileDialogVisible = ref(false)
const profileForm = ref({
  username: '',
  avatarUrl: '',
  bio: ''
})

// 判断是否是当前登录用户
const isCurrentUser = computed(() => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  return currentUser.id === userId.value
})

// 获取用户资料
const fetchUserProfile = async () => {
  loading.value = true
  try {
    // 这里在真实环境中会调用API
    const response = await userApi.getUserProfile(userId.value)
    
    // 模拟API调用
    // const response = await new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve({
    //       id: userId.value,
    //       username: '用户_' + userId.value,
    //       avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    //       bio: '热爱数码产品的科技爱好者',
    //       postsCount: 12,
    //       totalLikes: 245,
    //       viewCount: 1250,
    //     })
    //   }, 500)
    // })
    
    userProfile.value = response
    
    // 获取用户评测
    fetchUserPosts()
  } catch (error) {
    ElMessage.error('获取用户资料失败')
    console.error('获取用户资料失败:', error)
    loading.value = false
  }
}

// 获取用户发布的评测
const fetchUserPosts = async () => {
  try {
    // 这里在真实环境中会调用API
    // const response = await userApi.getUserPosts(userId.value, { 
    //   page: currentPage.value, 
    //   pageSize: pageSize.value 
    // })
    
    // 模拟API调用
    const response = await new Promise(resolve => {
      setTimeout(() => {
        // 生成模拟数据
        const mockPosts = []
        const totalCount = 12
        
        for (let i = 0; i < Math.min(pageSize.value, totalCount - (currentPage.value - 1) * pageSize.value); i++) {
          const postId = (currentPage.value - 1) * pageSize.value + i + 1
          mockPosts.push({
            id: postId.toString(),
            content: `这是用户${userId.value}发布的第${postId}篇评测，内容很丰富，包含了详细的使用体验和测试数据...`,
            createTime: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
            images: [
              `https://via.placeholder.com/300/4FC3F7/FFFFFF?text=Review+${postId}`
            ],
            views: Math.floor(Math.random() * 1000),
            comments: Math.floor(Math.random() * 50),
            likes: Math.floor(Math.random() * 100),
            brand: '示例品牌',
            phoneModel: '示例型号'
          })
        }
        
        resolve({
          list: mockPosts,
          total: totalCount,
          page: currentPage.value,
          pageSize: pageSize.value
        })
      }, 500)
    })
    
    userPosts.value = response.list
    totalPosts.value = response.total
    loading.value = false
  } catch (error) {
    ElMessage.error('获取用户评测失败')
    console.error('获取用户评测失败:', error)
    loading.value = false
  }
}

// 分页器页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchUserPosts()
}

// 跳转到评测详情
const goToReviewDetail = (reviewId) => {
  router.push(`/review/${reviewId}`)
}

// 跳转到发布评测页面
const goToPost = () => {
  router.push('/post')
}

// 删除评测
const deletePost = (postId) => {
  ElMessageBox.confirm(
    '确定要删除这篇评测吗？删除后无法恢复',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 实际环境中应调用API
    // await userApi.deletePost(postId)
    userPosts.value = userPosts.value.filter(post => post.id !== postId)
    userProfile.value.postsCount -= 1
    ElMessage.success('评测已删除')
  }).catch(() => {
    // 用户取消操作
  })
}

// 编辑个人资料
const editProfile = () => {
  profileForm.value = {
    username: userProfile.value.username,
    avatarUrl: userProfile.value.avatar,
    bio: userProfile.value.bio || ''
  }
  profileDialogVisible.value = true
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

// 保存个人资料
const saveProfile = async () => {
  // 模拟保存操作
  // 实际环境中应调用API
  await userApi.updateUserInfo(profileForm.value)
  
  userProfile.value.username = profileForm.value.username
  userProfile.value.avatar = profileForm.value.avatarUrl
  userProfile.value.bio = profileForm.value.bio
  
  ElMessage.success('个人资料已更新')
  profileDialogVisible.value = false
}

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  if (newId && newId !== userId.value) {
    userId.value = newId
    fetchUserProfile()
  }
})

onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
.user-profile-container {
  width: 100%;
}

.profile-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.user-header {
  display: flex;
  padding: 10px;
  position: relative;
}

.avatar-container {
  margin-right: 24px;
}

.user-info {
  flex: 1;
}

.username {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #303133;
}

.user-bio {
  color: #606266;
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.5;
}

.user-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.edit-actions {
  position: absolute;
  top: 12px;
  right: 16px;
}

.posts-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-item {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 16px;
}

.post-item:last-child {
  border-bottom: none;
}

.post-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.post-title {
  font-weight: bold;
  color: #303133;
  font-size: 16px;
}

.post-date {
  color: #909399;
  font-size: 12px;
}

.post-preview {
  display: flex;
  gap: 16px;
}

.preview-image {
  width: 120px;
  height: 90px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-stats {
  display: flex;
  gap: 16px;
  color: #909399;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.loading-state {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.empty-posts {
  padding: 40px 0;
  text-align: center;
}

.empty-posts .el-button {
  margin-top: 20px;
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
  .user-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .avatar-container {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .user-stats {
    justify-content: center;
  }

  .edit-actions {
    position: static;
    margin-top: 20px;
  }
}
</style> 