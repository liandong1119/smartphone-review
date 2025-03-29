<template>
  <div class="review-detail-container">
    <div class="review-detail-card" v-if="reviewDetail">
      <!-- 用户信息头部 -->
      <div class="post-header">
        <div class="user-info">
          <el-avatar 
            :size="48" 
            :src="reviewDetail.userAvatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
            @click="navigateToUserProfile(reviewDetail.userId)"
            class="clickable-avatar"
          ></el-avatar>
          <div class="user-meta">
            <div class="username clickable-username" @click="navigateToUserProfile(reviewDetail.userId)">{{ reviewDetail.username }}</div>
            <div class="post-time">{{ reviewDetail.createTime }}</div>
          </div>
        </div>
        
        <!-- 在详情页，评分展示采用更加突出的样式 -->
        <div class="post-action-buttons">
          <el-button type="primary" plain size="small" v-if="reviewDetail.phoneModel" 
            @click="router.push(`/phone/${reviewDetail.modelId}`)">
            查看手机详情
          </el-button>
        </div>
      </div>
      
      <!-- 评测标题 -->
      <div class="post-title">
        <h1>{{ reviewDetail.title }}</h1>
      </div>
      
      <!-- 综合评分部分 -->
      <div class="overall-rating">
        <el-rate
          v-model="reviewDetail.rating"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value} 分"
        />
        <div class="rating-note">综合评分（由下方各项评分计算得出）</div>
      </div>
      
      <!-- 详情页的大型评分展示区域 -->
      <div class="detailed-rating-section" v-if="reviewDetail.rating">
        <div class="overall-rating-card">
          <div class="rating-label">综合评分</div>
          <div class="large-rating-value">{{ reviewDetail.rating.toFixed(1) }}</div>
          <div class="rating-stars">
            <el-rate 
              v-model="reviewDetail.rating" 
              disabled 
              :max="5" 
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']" 
              :size="24"
            />
          </div>
        </div>
        
        <!-- 各项分数的可视化展示 -->
        <div class="rating-breakdown" v-if="hasDetailedRatings">
          <div class="breakdown-row" v-if="reviewDetail.appearanceRating">
            <span class="breakdown-label">外观设计</span>
            <div class="breakdown-progress">
              <div class="breakdown-bar" :style="{width: `${(reviewDetail.appearanceRating/5)*100}%`}"></div>
            </div>
            <span class="breakdown-value">{{ reviewDetail.appearanceRating.toFixed(1) }}</span>
          </div>
          
          <div class="breakdown-row" v-if="reviewDetail.screenRating">
            <span class="breakdown-label">屏幕显示</span>
            <div class="breakdown-progress">
              <div class="breakdown-bar" :style="{width: `${(reviewDetail.screenRating/5)*100}%`}"></div>
            </div>
            <span class="breakdown-value">{{ reviewDetail.screenRating.toFixed(1) }}</span>
          </div>
          
          <div class="breakdown-row" v-if="reviewDetail.performanceRating">
            <span class="breakdown-label">性能体验</span>
            <div class="breakdown-progress">
              <div class="breakdown-bar" :style="{width: `${(reviewDetail.performanceRating/5)*100}%`}"></div>
            </div>
            <span class="breakdown-value">{{ reviewDetail.performanceRating.toFixed(1) }}</span>
          </div>
          
          <div class="breakdown-row" v-if="reviewDetail.cameraRating">
            <span class="breakdown-label">拍照效果</span>
            <div class="breakdown-progress">
              <div class="breakdown-bar" :style="{width: `${(reviewDetail.cameraRating/5)*100}%`}"></div>
            </div>
            <span class="breakdown-value">{{ reviewDetail.cameraRating.toFixed(1) }}</span>
          </div>
          
          <div class="breakdown-row" v-if="reviewDetail.batteryRating">
            <span class="breakdown-label">续航表现</span>
            <div class="breakdown-progress">
              <div class="breakdown-bar" :style="{width: `${(reviewDetail.batteryRating/5)*100}%`}"></div>
            </div>
            <span class="breakdown-value">{{ reviewDetail.batteryRating.toFixed(1) }}</span>
          </div>
          
          <div class="breakdown-row" v-if="reviewDetail.systemRating">
            <span class="breakdown-label">系统体验</span>
            <div class="breakdown-progress">
              <div class="breakdown-bar" :style="{width: `${(reviewDetail.systemRating/5)*100}%`}"></div>
            </div>
            <span class="breakdown-value">{{ reviewDetail.systemRating.toFixed(1) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 评测内容区域 -->
      <div class="content-text">{{ reviewDetail.content }}</div>
      
      <!-- 评测图片区域 -->
      <div class="review-images" v-if="reviewDetail.fileList && reviewDetail.fileList.length > 0">
        <div 
          v-for="(image, index) in reviewDetail.fileList"
          :key="index" 
          class="review-image"
          :style="{ backgroundImage: `url(${image})` }"
          @click="viewImage(image)"
        ></div>
      </div>
      
      <!-- 手机标签 -->
      <div class="phone-tags">
        <span class="phone-brand-tag" v-if="reviewDetail.brand">{{ reviewDetail.brand }}</span>
        <span class="phone-model-tag" v-if="reviewDetail.phoneModel">{{ reviewDetail.phoneModel }}</span>
        <span class="phone-model-tag" v-if="!reviewDetail.phoneModel && reviewDetail.model">{{ reviewDetail.model }}</span>
      </div>
      
      <!-- 互动区域 -->
      <div class="interaction-area">
        <div class="comments-count">
          <el-button size="small" circle @click="showComments = !showComments">
            <el-icon><ChatLineRound /></el-icon>
          </el-button>
          <span>{{ reviewDetail.comments }}</span>
        </div>
        <div class="likes-count">
          <el-button 
            size="small" 
            circle
            :type="isLiked ? 'danger' : ''"
            @click="toggleLike"
          >
            <el-icon><CaretTop /></el-icon>
          </el-button>
          <span>{{ likeCount }}</span>
        </div>
        <div class="favorites-count">
          <el-button 
            size="small" 
            circle
            :type="isFavorited ? 'warning' : ''"
            @click="toggleFavorite"
          >
            <el-icon>
              <star-filled v-if="isFavorited" />
              <star v-else />
            </el-icon>
          </el-button>
          <span>{{ favoriteCount }}</span>
        </div>
        <div class="share-button">
          <el-button size="small" circle>
            <el-icon><Share /></el-icon>
          </el-button>
          <span>分享</span>
        </div>
      </div>
      
      <!-- 评论区 -->
      <div class="comments-section" v-if="showComments">
        <div class="comment-header">
          <h3>评论区 ({{ reviewDetail.comments }})</h3>
        </div>
        
        <div class="comment-list">
          <div class="comment-item" v-for="(comment, index) in commentList" :key="index">
            <div class="comment-main">
              <el-avatar 
                :size="32" 
                :src="comment.userAvatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                @click="navigateToUserProfile(comment.userId)"
                class="clickable-avatar"
              ></el-avatar>
              <div class="comment-content-wrapper">
                <div class="comment-user clickable-username" @click="navigateToUserProfile(comment.userId)">{{ comment.username }}</div>
                <div class="comment-content">{{ comment.content }}</div>
                <div class="comment-actions">
                  <span class="comment-time">{{ comment.createTime || '刚刚' }}</span>
                  <span class="reply-btn" @click="replyToComment(comment, index)">回复</span>
                  <span class="like-button" :class="{ 'liked': comment.isLiked }" @click="toggleCommentLike(comment)">
                    <span class="custom-icon thumb-icon" :class="{ 'is-liked': comment.isLiked }">👍</span>
                    <span class="like-count">{{ comment.likes || 0 }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- 评论回复区域 -->
            <div class="reply-list" v-if="comment.replies && comment.replies.length > 0">
              <div class="reply-item" v-for="(reply, replyIndex) in comment.replies" :key="replyIndex">
                <el-avatar 
                  :size="28" 
                  :src="reply.userAvatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                  @click="navigateToUserProfile(reply.userId)"
                  class="clickable-avatar"
                ></el-avatar>
                <div class="reply-content-wrapper">
                  <div class="reply-user">
                    <span @click="navigateToUserProfile(reply.userId)" class="clickable-username">{{ reply.username }}</span>
                    <span class="reply-to" v-if="reply.replyTo">回复 
                      <span @click="navigateToUserProfile(reply.replyToUserId)" class="clickable-username">{{ reply.replyTo }}</span>
                    </span>
                  </div>
                  <div class="reply-content">{{ reply.content }}</div>
                  <div class="reply-actions">
                    <span class="comment-time">{{ reply.createTime || '刚刚' }}</span>
                    <span class="reply-btn" @click="replyToReply(comment, reply, index)">回复</span>
                    <span class="like-button" :class="{ 'liked': reply.isLiked }" @click="toggleReplyLike(reply)">
                      <span class="custom-icon thumb-icon" :class="{ 'is-liked': reply.isLiked }">👍</span>
                      <span class="like-count">{{ reply.likes || 0 }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 回复输入框，回复一级评论 -->
            <div class="reply-input" v-if="replyingToIndex === index">
              <el-input 
                v-model="replyComment" 
                :placeholder="`回复 ${replyToUsername}...`" 
                @keyup.enter="addReply"
                size="small"
              >
                <template #append>
                  <el-button @click="addReply" :disabled="!replyComment.trim()">发送</el-button>
                </template>
              </el-input>
            </div>
          </div>
          
          <div class="empty-comments" v-if="commentList.length === 0">
            暂无评论，快来发表你的看法吧！
          </div>
        </div>
        
        <!-- 添加评论 -->
        <div class="add-comment">
          <el-avatar :size="36" :src="userAvatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" class="comment-avatar"></el-avatar>
          <el-input 
            v-model="newComment" 
            placeholder="添加评论..." 
            @keyup.enter="addComment"
            size="small"
          >
            <template #append>
              <el-button @click="addComment" :disabled="!newComment.trim()">发送</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-else class="loading-state">
      <el-skeleton animated :rows="10" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChatLineRound, Share, Star, StarFilled, CaretTop } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'
import commentApi from '@/api/modules/comment'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const userStore = useUserStore()
const reviewId = ref(route.params.id)
const showComments = ref(true)
const newComment = ref('')
const commentList = ref([])
const loading = computed(() => postStore.loading)
const isLiked = computed(() => postStore.currentPost?.isLiked || false)
const likeCount = computed(() => postStore.currentPost?.likes || 0)
const isFavorited = computed(() => postStore.currentPost?.isFavorited || false)
const favoriteCount = computed(() => postStore.currentPost?.favorites || 0)

// 评测详情（从store中获取）
const reviewDetail = computed(() => postStore.currentPost)
const userAvatar = computed(() => userStore.userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

// 判断是否有详细评分
const hasDetailedRatings = computed(() => {
  const review = reviewDetail.value
  return review &&
    (review.appearanceRating > 0 || 
     review.screenRating > 0 || 
     review.performanceRating > 0 || 
     review.cameraRating > 0 || 
     review.batteryRating > 0 || 
     review.systemRating > 0)
})

// 添加回复相关的变量
const replyingToIndex = ref(-1) // 当前正在回复的评论索引
const replyToUsername = ref('') // 要回复的用户名
const replyComment = ref('') // 回复内容
const replyingToReply = ref(false) // 是否是回复中的回复
const currentReplyToId = ref(null) // 当前回复的ID

// 开发环境标志
const isDev = ref(import.meta.env.DEV)

// 点赞评测
const toggleLike = async () => {
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
  
  await postStore.toggleLike(reviewDetail.value)
}

// 收藏评测
const toggleFavorite = async () => {
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
  
  await postStore.toggleFavorite(reviewDetail.value)
}

// 获取评论列表
const fetchComments = async () => {
  try {
    const result = await commentApi.getComments(reviewId.value)
    if (result && result.records) {
      commentList.value = result.records
    } else if (Array.isArray(result)) {
      commentList.value = result
    } else {
      commentList.value = []
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    ElMessage.error('获取评论列表失败')
    commentList.value = []
  }
}

// 添加评论
const addComment = async () => {
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
    const result = await commentApi.createComment(reviewId.value, {
      content: newComment.value
    })
    
    if (result) {
      // 添加新评论到列表
      commentList.value.unshift({
        id: result.id,
        userId: userStore.userInfo.id,
        username: userStore.userInfo.username,
        userAvatar: userStore.userInfo.avatar,
        content: newComment.value,
        createTime: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        replies: []
      })
      
      // 清空输入框
      newComment.value = ''
      
      ElMessage.success('评论发表成功')
    }
  } catch (error) {
    console.error('Failed to add comment:', error)
    ElMessage.error('评论发表失败')
  }
}

// 回复评论
const replyToComment = (comment, index) => {
  replyingToIndex.value = index
  replyToUsername.value = comment.username
  replyComment.value = ''
  replyingToReply.value = false
  currentReplyToId.value = comment.id
}

// 添加回复
const addReply = async () => {
  if (!userStore.isLoggedIn) {
    ElMessageBox.confirm(
      '请先登录后再进行回复',
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
  
  if (!replyComment.value.trim()) {
    ElMessage.warning('回复内容不能为空')
    return
  }
  
  try {
    const commentIndex = replyingToIndex.value
    const currentComment = commentList.value[commentIndex]
    
    if (!currentComment) {
      ElMessage.error('评论不存在')
      return
    }
    
    const result = await commentApi.createComment(reviewId.value, {
      content: replyComment.value,
      parentId: currentComment.id
    })
    
    if (result) {
      // 添加新回复到评论的回复列表
      if (!currentComment.replies) {
        currentComment.replies = []
      }
      
      currentComment.replies.push({
        id: result.id,
        userId: userStore.userInfo?.id,
        username: userStore.userInfo?.username,
        userAvatar: userStore.userInfo?.avatar,
        content: replyComment.value,
        createTime: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        replyTo: replyingToReply.value ? replyToUsername.value : null,
        replyToUserId: replyingToReply.value ? currentReplyToId.value : null
      })
      
      // 清空输入并隐藏回复表单
      replyComment.value = ''
      replyingToIndex.value = -1
      
      ElMessage.success('回复发表成功')
    }
  } catch (error) {
    console.error('Failed to add reply:', error)
    ElMessage.error('回复发表失败')
  }
}

// 点赞评论或回复
const toggleCommentLike = async (comment) => {
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
  
  try {
    if (comment.isLiked) {
      // 取消点赞
      await commentApi.unlikeComment(reviewId.value, comment.id)
      comment.isLiked = false
      if (comment.likes > 0) {
        comment.likes--
      }
      ElMessage({
        message: '已取消点赞',
        type: 'info',
        duration: 1000
      })
    } else {
      // 点赞
      await commentApi.likeComment(reviewId.value, comment.id)
      comment.isLiked = true
      comment.likes++
      ElMessage({
        message: '点赞成功',
        type: 'success',
        duration: 1000
      })
    }
  } catch (error) {
    console.error('Failed to toggle like for comment:', error)
    ElMessage.error('操作失败')
  }
}

// 分享文章
const sharePost = () => {
  // 获取当前页面URL
  const url = window.location.href
  
  // 复制到剪贴板
  navigator.clipboard.writeText(url).then(() => {
    ElMessage.success('链接已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制链接')
  })
}

// 初始化方法
const init = async () => {
  // 获取文章详情
  await postStore.fetchPostDetail(reviewId.value)
  
  // 获取评论列表
  await fetchComments()
}

// 组件挂载时获取数据
onMounted(() => {
  init()
})

// 监听路由参数变化，重新获取数据
watch(() => route.params.id, (newId) => {
  if (newId !== reviewId.value) {
    reviewId.value = newId
    init()
  }
})

// 跳转到用户主页
const navigateToUserProfile = (userId) => {
  if (!userId) {
    ElMessage.warning('找不到此用户信息')
    return
  }
  
  // 调用API获取用户信息 (预留API接口)
  getUserProfile(userId)
    .then(response => {
      // 成功获取用户信息后跳转到用户主页
      router.push(`/user-profile/${userId}`)
    })
    .catch(error => {
      ElMessage.error('获取用户信息失败')
      console.error('获取用户信息失败:', error)
    })
}

// API接口：获取用户资料
const getUserProfile = (userId) => {
  // 这里是真实环境下会调用的API
  // return userApi.getUserProfile(userId)
  
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟返回数据
      resolve({
        id: userId,
        username: '用户_' + userId,
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        bio: '这是用户简介',
        followersCount: Math.floor(Math.random() * 100),
        followingCount: Math.floor(Math.random() * 50),
        postsCount: Math.floor(Math.random() * 20)
      })
    }, 300)
  })
}

// 查看大图
const viewImage = (imageUrl) => {
  // 这里可以实现查看大图的功能
  ElMessage.info('查看大图: ' + imageUrl)
}

// 回复二级评论
const replyToReply = (comment, reply, commentIndex) => {
  replyingToIndex.value = commentIndex
  replyToUsername.value = reply.username
  replyComment.value = ''
  replyingToReply.value = true
  currentReplyToId.value = reply.id
}

// 点赞回复
const toggleReplyLike = (reply) => {
  reply.isLiked = !reply.isLiked
  reply.likes = (reply.likes || 0) + (reply.isLiked ? 1 : -1)
  ElMessage({
    message: reply.isLiked ? '点赞成功' : '已取消点赞',
    type: reply.isLiked ? 'success' : 'info',
    duration: 1000
  })
}
</script>

<style scoped>
.review-detail-container {
  width: 100%;
}

.review-detail-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-meta {
  margin-left: 15px;
}

.username {
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 5px;
  cursor: pointer;
}

.username:hover {
  color: #409EFF;
}

.post-time {
  color: #909399;
  font-size: 13px;
}

.post-action-buttons {
  display: flex;
  gap: 10px;
}

.post-title {
  margin-bottom: 20px;
}

.post-title h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.content-text {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin: 20px 0;
  white-space: pre-wrap;
}

.review-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin: 20px 0;
}

.review-image {
  height: 180px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.review-image:hover {
  transform: scale(1.02);
}

.phone-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.phone-brand-tag, .phone-model-tag {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 12px;
  color: #666;
}

.phone-model-tag {
  background-color: #e8f4ff;
  border-color: #c0d9eb;
}

.interaction-area {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.comments-count, .likes-count, .favorites-count, .share-button {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.likes-count .el-button.is-danger {
  background-color: rgba(245, 108, 108, 0.1);
  border-color: #ff6b6b !important;
}

.favorites-count .el-button.is-warning {
  background-color: rgba(230, 162, 60, 0.1) !important;
  border-color: #e6a23c !important;
}

.comments-section {
  padding-top: 15px;
}

.comment-header {
  margin-bottom: 20px;
}

.comment-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.comment-list {
  max-height: none;
  margin-bottom: 20px;
}

.comment-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.comment-main {
  display: flex;
  margin-bottom: 10px;
}

.comment-content-wrapper {
  margin-left: 10px;
  flex: 1;
}

.comment-user {
  font-weight: bold;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.comment-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.comment-time {
  margin-right: 15px;
}

.reply-btn {
  cursor: pointer;
  margin-right: 15px;
}

.reply-btn:hover {
  color: #409EFF;
}

.like-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.like-button:hover {
  color: #ff6b6b;
}

.like-button.liked {
  color: #ff6b6b;
}

.like-count {
  margin-left: 4px;
}

.reply-list {
  margin-left: 42px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
}

.reply-item {
  display: flex;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.reply-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.reply-content-wrapper {
  margin-left: 8px;
  flex: 1;
}

.reply-user {
  font-weight: bold;
  font-size: 13px;
  color: #333;
  margin-bottom: 3px;
}

.reply-to {
  font-weight: normal;
  color: #409EFF;
  margin-left: 5px;
}

.reply-content {
  font-size: 13px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 6px;
}

.reply-actions {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.reply-input {
  margin-top: 10px;
  margin-left: 42px;
}

.add-comment {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-avatar {
  flex-shrink: 0;
}

.add-comment .el-input {
  flex: 1;
}

.empty-comments {
  text-align: center;
  color: #999;
  padding: 30px 0;
  font-size: 14px;
}

.loading-state {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
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

.comment-like-active {
  color: #ff6b6b;
  transform: scale(1.1);
}

.thumb-icon {
  font-size: 14px;
  transform: scale(0.9);
}

.thumb-icon.is-liked {
  transform: scale(1);
  color: #ff6b6b;
}

.favorite-icon {
  font-size: 16px;
  color: #999;
}

.favorite-icon.is-favorited {
  color: #ff6b6b;
  transform: scale(1.1);
}

.clickable-avatar {
  cursor: pointer;
  transition: transform 0.2s;
}

.clickable-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.clickable-username {
  cursor: pointer;
  transition: color 0.2s;
}

.clickable-username:hover {
  color: #409EFF;
  text-decoration: underline;
}

/* 移除旧版评分详情区样式，使用新的详情展示 */
.rating-details {
  display: none;
}

/* 媒体查询：在移动设备上调整评分区布局 */
@media (max-width: 768px) {
  .detailed-rating-section {
    flex-direction: column;
    gap: 15px;
  }
  
  .overall-rating-card {
    width: 100%;
  }
}

/* 添加详情页评分区块样式 */
.detailed-rating-section {
  display: flex;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  gap: 30px;
}

.overall-rating-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  min-width: 140px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rating-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.large-rating-value {
  font-size: 36px;
  font-weight: bold;
  color: #FF9900;
  line-height: 1;
  margin-bottom: 8px;
}

.rating-stars {
  margin-top: 5px;
}

.rating-breakdown {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.breakdown-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.breakdown-label {
  width: 80px;
  font-size: 14px;
  color: #606266;
}

.breakdown-progress {
  flex: 1;
  height: 10px;
  background-color: #EBEEF5;
  border-radius: 5px;
  margin: 0 15px;
  overflow: hidden;
}

.breakdown-bar {
  height: 100%;
  background: linear-gradient(90deg, #FFD666 0%, #FFA940 50%, #FF7A45 100%);
  border-radius: 5px;
}

.breakdown-value {
  font-size: 14px;
  font-weight: bold;
  color: #606266;
  width: 30px;
  text-align: right;
}

/* 评分样式 */
.overall-rating {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.rating-note {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style> 