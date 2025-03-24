<template>
  <div class="review-detail-container">
    <div class="review-detail-card" v-if="reviewDetail">
      <!-- 用户信息头部 -->
      <div class="user-info">
        <el-avatar 
          :size="36" 
          :src="reviewDetail.userAvatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
          @click="navigateToUserProfile(reviewDetail.userId)"
          class="clickable-avatar"
        ></el-avatar>
        <div class="user-meta">
          <span class="username clickable-username" @click="navigateToUserProfile(reviewDetail.userId)">{{ reviewDetail.username }}</span>
          <span class="datetime">{{ reviewDetail.datetime }}</span>
        </div>
      </div>
      
      <!-- 评测内容 -->
      <div class="content-text">{{ reviewDetail.content }}</div>
      
      <!-- 评测图片 -->
      <div class="review-images">
        <div 
          v-for="(image, index) in reviewDetail.images" 
          :key="index" 
          class="image-item"
          :style="{ backgroundImage: `url(${image})` }"
          @click="viewImage(image)"
        ></div>
      </div>
      
      <!-- 手机标签 -->
      <div class="phone-tags">
        <span class="phone-brand-tag">{{ reviewDetail.brand }}</span>
        <span class="phone-model-tag">{{ reviewDetail.phoneModel || reviewDetail.model }}</span>
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
          <h3>评论区 ({{ commentList.length }})</h3>
        </div>
        
        <div class="comment-list">
          <div class="comment-item" v-for="(comment, index) in commentList" :key="index">
            <div class="comment-main">
              <el-avatar 
                :size="32" 
                :src="comment.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                @click="navigateToUserProfile(comment.userId)"
                class="clickable-avatar"
              ></el-avatar>
              <div class="comment-content-wrapper">
                <div class="comment-user clickable-username" @click="navigateToUserProfile(comment.userId)">{{ comment.username }}</div>
                <div class="comment-content">{{ comment.content }}</div>
                <div class="comment-actions">
                  <span class="comment-time">{{ comment.time || '刚刚' }}</span>
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
                  :src="reply.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
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
                    <span class="comment-time">{{ reply.time || '刚刚' }}</span>
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
import { usePostStore } from '../../stores/post'
import { useUserStore } from '../../stores/user'
import commentApi from '../../api/modules/comment'

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
    if (result) {
      commentList.value = result
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    ElMessage.error('获取评论列表失败')
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
const replyComment = async (comment, replyContent, hideReplyForm) => {
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
  
  if (!replyContent.trim()) {
    ElMessage.warning('回复内容不能为空')
    return
  }
  
  try {
    const result = await commentApi.createComment(reviewId.value, {
      content: replyContent,
      parentId: comment.id
    })
    
    if (result) {
      // 添加新回复到评论的回复列表
      if (!comment.replies) {
        comment.replies = []
      }
      
      comment.replies.push({
        id: result.id,
        userId: userStore.userInfo.id,
        username: userStore.userInfo.username,
        userAvatar: userStore.userInfo.avatar,
        content: replyContent,
        createTime: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        replyTo: comment.username
      })
      
      // 隐藏回复表单
      if (hideReplyForm) {
        hideReplyForm()
      }
      
      ElMessage.success('回复发表成功')
    }
  } catch (error) {
    console.error('Failed to reply to comment:', error)
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

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-meta {
  margin-left: 10px;
}

.username {
  font-weight: bold;
  font-size: 14px;
  display: block;
  color: #333;
}

.datetime {
  color: #999;
  font-size: 12px;
}

.content-text {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin: 15px 0;
}

.review-images {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.image-item {
  width: 200px;
  height: 150px;
  background-color: #eee;
  border-radius: 5px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.image-item:hover {
  transform: scale(1.03);
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
</style> 