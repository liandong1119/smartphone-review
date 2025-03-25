<template>
  <div class="phone-detail-container">
    <div class="container">
      <div v-if="loading" class="loading-container">
        <el-skeleton animated :rows="10" />
      </div>

      <div v-else-if="!phone" class="error-container">
        <el-empty description="未找到该手机型号" />
        <el-button @click="goBack" type="primary" plain>返回上一页</el-button>
      </div>

      <template v-else>
        <!-- 手机基本信息 -->
        <div class="phone-info-section">
          <div class="phone-gallery">
            <el-carousel height="400px" indicator-position="outside" arrow="always" v-if="phoneImages.length > 0">
              <el-carousel-item v-for="(image, index) in phoneImages" :key="index">
                <img :src="image" :alt="phone.name" class="carousel-image" />
              </el-carousel-item>
            </el-carousel>
            <div class="placeholder-image" v-else>
              <el-image src="@/assets/placeholder.png" fit="contain"></el-image>
            </div>
          </div>
          
          <div class="phone-info">
            <div class="phone-info-header">
              <div class="phone-brand-info" v-if="phone.brand">
                <img :src="phone.brand.logo" alt="品牌logo" class="brand-logo">
                <span class="brand-name">{{ phone.brand.name }}</span>
              </div>
              <div class="favorite-btn" :class="{ 'favorited': isFavorite }" @click="togglePhoneFavorite">
                <el-icon :size="20" :color="isFavorite ? '#ff9900' : '#909399'">
                  <star-filled v-if="isFavorite" />
                  <star v-else />
                </el-icon>
                <span>{{ isFavorite ? '已收藏' : '收藏' }}</span>
              </div>
            </div>
            
            <h1 class="phone-name">{{ phone.name }}</h1>
            
            <!-- 评分模块 -->
            <div class="phone-rating-card" v-if="phone.rating">
              <div class="phone-rating-header">
                <span class="rating-title">综合评分</span>
                <span class="rating-value">{{ phone.rating.toFixed(1) }}</span>
              </div>
              
              <el-rate 
                v-model="phone.rating" 
                disabled 
                :max="5" 
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']" 
                class="rating-stars"
              />
              
              <div class="rating-stats">
                <span class="review-count">{{ totalReviews || 0 }}条评测</span>
              </div>
            </div>
            
            <!-- 手机规格信息 -->
            <div class="phone-specs">
              <div class="spec-item">
                <div class="spec-label">价格</div>
                <div class="spec-value price-value">¥{{ phone.price }}</div>
              </div>
              <div class="spec-item" v-if="phone.releaseDate">
                <div class="spec-label">发布日期</div>
                <div class="spec-value">{{ formatDate(phone.releaseDate) }}</div>
              </div>
              <div class="spec-item" v-if="phone.description">
                <div class="spec-label">产品简介</div>
                <div class="spec-value description-value">{{ phone.description }}</div>
              </div>
            </div>
            
            <div class="action-buttons">
              <el-button type="primary" @click="goToPost">发布评测</el-button>
              <el-button @click="viewAllReviews">查看所有评测</el-button>
            </div>
          </div>
        </div>

        <!-- 手机详情部分 -->
        <el-tabs class="phone-tabs">
          <el-tab-pane label="产品详情">
            <div class="phone-description">
              <h2>产品介绍</h2>
              <div class="description-content">{{ phone.description }}</div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="用户评测">
            <div class="phone-reviews">
              <div class="reviews-header">
                <h2>用户评测</h2>
                <el-button type="primary" plain @click="goToPost">发布评测</el-button>
              </div>
              
              <div v-if="loadingReviews" class="loading-reviews">
                <el-skeleton :rows="3" animated />
              </div>
              
              <div v-else-if="reviews.length === 0" class="no-reviews">
                <el-empty description="暂无评测">
                  <template #description>
                    <p>暂时还没有人发布这款手机的评测</p>
                  </template>
                  <el-button type="primary" @click="goToPost">马上发布评测</el-button>
                </el-empty>
              </div>
              
              <div v-else class="reviews-list">
                <div v-for="review in reviews" :key="review.id" class="review-card">
                  <div class="review-header">
                    <div class="review-user-info">
                      <el-avatar :size="40" :src="review.userAvatar" @click="navigateToUserProfile(review.userId)" class="clickable-avatar"></el-avatar>
                      <div class="review-user-meta">
                        <div class="review-username clickable-username" @click="navigateToUserProfile(review.userId)">{{ review.username }}</div>
                        <div class="review-date">{{ formatDate(review.createTime) }}</div>
                      </div>
                    </div>
                    <div class="review-rating">
                      <span class="rating-value">{{ review.rating.toFixed(1) }}</span>
                      <el-rate v-model="review.rating" disabled :colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
                    </div>
                  </div>
                  
                  <div class="review-title" @click="viewFullReview(review.id)">{{ review.title }}</div>
                  <div class="review-content" @click="viewFullReview(review.id)">{{ review.content }}</div>
                  
                  <div v-if="review.images && review.images.length > 0" class="review-images">
                    <div 
                      v-for="(image, index) in review.images.slice(0, 3)" 
                      :key="index" 
                      class="preview-image"
                      :style="{ backgroundImage: `url(${image})` }"
                      @click="viewImage(image)"
                    ></div>
                    <div v-if="review.images.length > 3" class="more-images">
                      +{{ review.images.length - 3 }}
                    </div>
                  </div>
                  
                  <div class="card-footer">
                    <!-- 手机品牌和型号标签 -->
                    <div class="phone-tags">
                      <span v-if="review.brand" class="phone-tag brand-tag">{{ review.brand }}</span>
                      <span v-if="review.phoneModel" class="phone-tag model-tag">{{ review.phoneModel }}</span>
                    </div>
                    
                    <div class="interaction-stats">
                      <span class="stat-item">
                        <el-icon><View /></el-icon> {{ review.views || 0 }}
                      </span>
                      <span class="stat-item">
                        <el-button size="small" circle @click="viewFullReview(review.id)">
                          <el-icon><ChatLineRound /></el-icon>
                        </el-button>
                        <span>{{ review.commentCount || 0 }}</span>
                      </span>
                      <span class="stat-item">
                        <el-button 
                          size="small" 
                          circle
                          :type="review.isLiked ? 'danger' : ''"
                          @click="toggleLike(review)"
                        >
                          <el-icon><CaretTop /></el-icon>
                        </el-button>
                        <span>{{ review.likeCount || 0 }}</span>
                      </span>
                      <span class="stat-item">
                        <el-button 
                          size="small" 
                          circle
                          :type="review.isFavorited ? 'warning' : ''"
                          @click="toggleFavorite(review)"
                        >
                          <el-icon>
                            <star-filled v-if="review.isFavorited" />
                            <star v-else />
                          </el-icon>
                        </el-button>
                        <span>{{ review.favoriteCount || 0 }}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="pagination-container">
                  <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[5, 10, 20]"
                    layout="total, sizes, prev, pager, next"
                    :total="totalReviews"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  />
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="同品牌机型">
            <div class="related-phones">
              <h2>同品牌其他机型</h2>
              
              <div v-if="loadingRelated" class="loading-related">
                <el-skeleton :rows="1" animated />
              </div>
              
              <div v-else-if="relatedPhones.length === 0" class="no-related">
                <el-empty description="暂无相关机型"></el-empty>
              </div>
              
              <div v-else class="related-phones-grid">
                <div
                  v-for="relatedPhone in relatedPhones"
                  :key="relatedPhone.id"
                  class="related-phone-card"
                  @click="viewPhone(relatedPhone.id)"
                >
                  <img :src="relatedPhone.image" :alt="relatedPhone.name" class="related-phone-image" />
                  <div class="related-phone-info">
                    <div class="related-phone-name">{{ relatedPhone.name }}</div>
                    <div class="related-phone-price">¥{{ relatedPhone.price }}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ChatLineRound, CaretTop, Star, StarFilled, View } from '@element-plus/icons-vue'
import instance from '@/utils/http'
import { useUserStore } from '@/stores/user'
import phoneApi from '@/api/modules/phone'

const route = useRoute()
const router = useRouter()
const phoneId = route.params.id

// 手机数据
const phone = ref(null)
const loading = ref(true)

// 手机评测数据
const reviews = ref([])
const loadingReviews = ref(false)
const currentPage = ref(1)
const pageSize = ref(5)
const totalReviews = ref(0)

// 相关机型数据
const relatedPhones = ref([])
const loadingRelated = ref(false)

// 收藏状态
const isFavorite = ref(false)

// 用户商店
const userStore = useUserStore()

// 手机图片
const phoneImages = computed(() => {
  if (!phone.value || !phone.value.image) return []
  
  // 如果有多张图片，返回图片数组
  if (phone.value.images && Array.isArray(phone.value.images)) {
    return phone.value.images
  }
  
  // 否则返回单张图片作为数组
  return [phone.value.image]
})

// 获取手机详情
const fetchPhoneDetail = async () => {
  loading.value = true
  try {
    const response = await instance.get(`/phones/${phoneId}`)
    console.log('获取手机详情响应:', response)
    // HTTP拦截器已经处理了response.code，直接使用返回的数据
    phone.value = response
    if (phone.value) {
      checkFavoriteStatus()
      fetchRelatedPhones()
      fetchPhoneReviews()
    } else {
      ElMessage.error('获取手机详情失败')
    }
  } catch (error) {
    console.error('获取手机详情失败:', error)
    ElMessage.error('获取手机详情失败')
  } finally {
    loading.value = false
  }
}

// 获取手机评测
const fetchPhoneReviews = async () => {
  loadingReviews.value = true
  try {
    const response = await instance.get('/posts', {
      params: {
        phoneModelId: phoneId,
        page: currentPage.value,
        limit: pageSize.value,
        status: 'published'
      }
    })
    
    console.log('获取评测列表响应:', response)
    // HTTP拦截器已经处理了response.code，直接使用返回的数据
    if (response) {
      reviews.value = response.records || response
      totalReviews.value = response.total || (response.records ? response.records.length : response.length)
    } else {
      ElMessage.error('获取评测列表失败')
    }
  } catch (error) {
    console.error('获取评测列表失败:', error)
    ElMessage.error('获取评测列表失败')
  } finally {
    loadingReviews.value = false
  }
}

// 获取相关机型
const fetchRelatedPhones = async () => {
  if (!phone.value || !phone.value.brandId) return
  
  loadingRelated.value = true
  try {
    const response = await instance.get(`/brands/${phone.value.brandId}/models`)
    
    console.log('获取相关机型响应:', response)
    // HTTP拦截器已经处理了response.code，直接使用返回的数据
    // 过滤掉当前手机
    relatedPhones.value = (response || []).filter(p => p.id !== phoneId)
  } catch (error) {
    console.error('获取相关机型失败:', error)
    ElMessage.error('获取相关机型失败')
  } finally {
    loadingRelated.value = false
  }
}

// 检查收藏状态
const checkFavoriteStatus = async () => {
  if (!userStore.isLoggedIn) {
    isFavorite.value = false
    return
  }
  
  try {
    const response = await phoneApi.getFavoritePhones()
    if (response && response.code === 200 && response.data) {
      // 检查当前手机是否在收藏列表中
      const favoriteIds = response.data.map(phone => phone.id)
      isFavorite.value = favoriteIds.includes(Number(phoneId))
      
      // 更新本地存储
      localStorage.setItem('favoritePhones', JSON.stringify(favoriteIds))
    } else {
      isFavorite.value = false
    }
  } catch (error) {
    console.error('Failed to check favorite status:', error)
    // 如果API调用失败，尝试从本地存储中获取
    const favoritePhones = JSON.parse(localStorage.getItem('favoritePhones') || '[]')
    isFavorite.value = favoritePhones.includes(Number(phoneId))
  }
}

// 切换收藏状态
const togglePhoneFavorite = async () => {
  if (!userStore.isLoggedIn) {
    ElMessageBox.confirm('请先登录后再收藏', '提示', {
      confirmButtonText: '去登录',
      cancelButtonText: '取消',
      type: 'info'
    }).then(() => {
      router.push('/login')
    }).catch(() => {})
    return
  }
  
  try {
    const action = isFavorite.value ? 'remove' : 'add'
    const response = await phoneApi.toggleFavoritePhone(phoneId, action)
    
    if (response && response.code === 200) {
      isFavorite.value = !isFavorite.value
      
      // 更新localStorage
      const favoritePhones = JSON.parse(localStorage.getItem('favoritePhones') || '[]')
      if (isFavorite.value) {
        if (!favoritePhones.includes(Number(phoneId))) {
          favoritePhones.push(Number(phoneId))
        }
      } else {
        const index = favoritePhones.indexOf(Number(phoneId))
        if (index !== -1) {
          favoritePhones.splice(index, 1)
        }
      }
      localStorage.setItem('favoritePhones', JSON.stringify(favoritePhones))
      
      ElMessage.success(isFavorite.value ? '已添加到收藏' : '已取消收藏')
    } else {
      ElMessage.error('操作失败，请稍后再试')
    }
  } catch (error) {
    console.error('Toggle favorite failed:', error)
    ElMessage.error('操作失败，请稍后再试')
  }
}

// 点赞交互
const toggleLike = async (review) => {
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
    const action = review.isLiked ? 'unlike' : 'like'
    const response = await instance.post(`/posts/${review.id}/${action}`)
    
    if (response && response.code === 200) {
      review.isLiked = !review.isLiked
      review.likeCount = review.isLiked ? (review.likeCount || 0) + 1 : (review.likeCount || 1) - 1
      ElMessage.success(review.isLiked ? '点赞成功' : '已取消点赞')
    } else {
      ElMessage.error('操作失败，请稍后重试')
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    
    // 备用方案：直接更新UI状态
    review.isLiked = !review.isLiked
    review.likeCount = review.isLiked ? (review.likeCount || 0) + 1 : (review.likeCount || 1) - 1
    ElMessage.success(review.isLiked ? '点赞成功' : '已取消点赞')
  }
}

// 收藏评测
const toggleFavorite = async (review) => {
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
    const action = review.isFavorited ? 'unfavorite' : 'favorite'
    const response = await instance.post(`/posts/${review.id}/${action}`)
    
    if (response && response.code === 200) {
      review.isFavorited = !review.isFavorited
      review.favoriteCount = review.isFavorited ? (review.favoriteCount || 0) + 1 : (review.favoriteCount || 1) - 1
      ElMessage.success(review.isFavorited ? '收藏成功' : '已取消收藏')
    } else {
      ElMessage.error('操作失败，请稍后重试')
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    
    // 备用方案：直接更新UI状态
    review.isFavorited = !review.isFavorited
    review.favoriteCount = review.isFavorited ? (review.favoriteCount || 0) + 1 : (review.favoriteCount || 1) - 1
    ElMessage.success(review.isFavorited ? '收藏成功' : '已取消收藏')
  }
}

// 查看大图
const viewImage = (imageUrl) => {
  // 实现图片预览功能
  if (window.viewerApi) {
    // 如果集成了图片预览组件
    window.viewerApi.view(imageUrl)
  } else {
    // 简单实现：在新窗口打开
    window.open(imageUrl, '_blank')
  }
}

// 跳转到用户主页
const navigateToUserProfile = (userId) => {
  if (!userId) return
  router.push(`/user-profile/${userId}`)
}

// 添加查看所有评测的函数
const viewAllReviews = () => {
  // 获取tabs实例并激活评测选项卡
  const tabs = document.querySelector('.phone-tabs .el-tabs__nav')
  if (tabs) {
    const reviewsTab = tabs.querySelectorAll('.el-tabs__item')[1] // 第二个选项卡是评测
    if (reviewsTab) {
      reviewsTab.click()
      
      // 滚动到评测区域
      setTimeout(() => {
        const reviewsSection = document.querySelector('.phone-reviews')
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }
}

// 去发布评测
const goToPost = () => {
  if (!userStore.isLoggedIn) {
    ElMessageBox.confirm(
      '请先登录后再发布评测',
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
  
  // 如果用户喜欢这款手机，提示是否要收藏
  if (!isFavorite.value) {
    ElMessageBox.confirm(
      '看起来您还没有收藏这款手机，是否要先收藏再发布评测？',
      '提示',
      {
        confirmButtonText: '先收藏',
        cancelButtonText: '暂不收藏',
        type: 'info'
      }
    ).then(() => {
      togglePhoneFavorite().then(() => {
        router.push({
          path: '/post',
          query: {
            phoneId: phoneId,
            phoneName: phone.value?.name,
            brandId: phone.value?.brandId,
            brandName: phone.value?.brand?.name
          }
        })
      })
    }).catch(() => {
      router.push({
        path: '/post',
        query: {
          phoneId: phoneId,
          phoneName: phone.value?.name,
          brandId: phone.value?.brandId,
          brandName: phone.value?.brand?.name
        }
      })
    })
  } else {
    router.push({
      path: '/post',
      query: {
        phoneId: phoneId,
        phoneName: phone.value?.name,
        brandId: phone.value?.brandId,
        brandName: phone.value?.brand?.name
      }
    })
  }
}

// 查看完整评测
const viewFullReview = (reviewId) => {
  router.push(`/review/${reviewId}`)
}

// 查看其他手机详情
const viewPhone = (id) => {
  router.push(`/phone/${id}`)
}

// 处理分页变化
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchPhoneReviews()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchPhoneReviews()
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

// 组件挂载时获取数据
onMounted(async () => {
  checkFavoriteStatus() // 检查收藏状态
  await fetchPhoneDetail() // 获取手机详情
  await fetchPhoneReviews() // 获取手机评测
  await fetchRelatedPhones() // 获取相关手机
})
</script>

<style scoped>
.phone-detail-container {
  padding: 20px;
}

.phone-info-section {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.phone-gallery {
  flex: 1;
  max-width: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: white;
}

.placeholder-image {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.phone-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.phone-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.phone-brand-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.brand-name {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
}

.favorite-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 15px;
  border-radius: 20px;
  background-color: #f0f2f5;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.favorite-btn:hover {
  background-color: #e6eaf0;
}

.favorite-btn span {
  font-size: 14px;
}

.favorite-btn.favorited {
  background-color: #fff8e6;
  color: #ff9900;
}

.favorite-btn.favorited:hover {
  background-color: #fff0d1;
}

.phone-name {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.phone-rating-card {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}

.phone-rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.rating-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.rating-value {
  font-size: 28px;
  font-weight: bold;
  color: #FF9900;
}

.rating-stars {
  margin-bottom: 10px;
}

.rating-stats {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 13px;
}

.phone-specs {
  margin-bottom: 20px;
}

.spec-item {
  margin-bottom: 15px;
}

.spec-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.spec-value {
  font-size: 16px;
  color: #333;
}

.price-value {
  font-size: 22px;
  color: #f56c6c;
  font-weight: 500;
}

.description-value {
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

/* 手机详情选项卡 */
.phone-tabs {
  margin-bottom: 40px;
}

.phone-description h2,
.phone-reviews h2,
.related-phones h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 500;
}

.phone-description h3 {
  margin-top: 30px;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 500;
}

.description-content {
  line-height: 1.6;
  color: #333;
  white-space: pre-line;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.review-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  margin-bottom: 20px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.review-user-info {
  display: flex;
  align-items: center;
}

.review-user-meta {
  margin-left: 10px;
}

.review-username {
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 3px;
  cursor: pointer;
}

.clickable-avatar {
  cursor: pointer;
}

.clickable-username:hover {
  color: #409EFF;
  text-decoration: underline;
}

.review-date {
  font-size: 12px;
  color: #909399;
}

.review-rating {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 6px 10px;
}

.rating-value {
  font-size: 20px;
  font-weight: bold;
  color: #FF9900;
  margin-right: 8px;
}

.review-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  cursor: pointer;
}

.review-title:hover {
  color: #409EFF;
}

.review-content {
  color: #333;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.review-content:hover {
  background-color: #f5f7fa;
  text-decoration: underline;
  color: #409EFF;
}

.review-images {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.preview-image {
  width: 120px;
  height: 120px;
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

.phone-tag {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 12px;
  color: #666;
}

.interaction-stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 10px;
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

/* 移除旧的图标样式 */
.like-icon {
  display: none;
}

.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* 相关手机部分 */
.related-phones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.related-phone-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.related-phone-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.related-phone-image {
  width: 100%;
  height: 180px;
  object-fit: contain;
  background-color: #f8f8f8;
}

.related-phone-info {
  padding: 10px;
}

.related-phone-name {
  font-weight: 500;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-phone-price {
  color: #f56c6c;
  font-weight: 500;
}

@media (max-width: 768px) {
  .phone-info-section {
    flex-direction: column;
  }
  
  .phone-gallery {
    max-width: 100%;
  }
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style> 