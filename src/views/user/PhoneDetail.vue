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
        <!-- 手机概览部分 -->
        <div class="phone-overview">
          <div class="phone-gallery">
            <el-carousel :interval="4000" type="card" height="400px">
              <el-carousel-item v-for="(image, index) in phoneImages" :key="index">
                <img :src="image" :alt="phone.name" class="carousel-image" />
              </el-carousel-item>
            </el-carousel>
          </div>

          <div class="phone-info">
            <div class="brand-tag">{{ phone.brandName }}</div>
            <h1 class="phone-name">{{ phone.name }}</h1>
            <div class="phone-price">¥{{ phone.price }}</div>
            
            <div class="phone-meta">
              <div class="meta-item">
                <span class="meta-label">上市日期：</span>
                <span class="meta-value">{{ formatDate(phone.releaseDate) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">评测数量：</span>
                <span class="meta-value">{{ phone.reviewCount || 0 }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">人气指数：</span>
                <span class="meta-value">
                  <el-rate v-model="phone.popularity" disabled show-score :max="5" />
                </span>
              </div>
            </div>

            <div class="phone-actions">
              <el-button type="primary" @click="goToPost">发布该机型评测</el-button>
              <el-button @click="addToFavorites" :icon="isFavorite ? 'StarFilled' : 'Star'">
                {{ isFavorite ? '已收藏' : '收藏' }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 手机详情部分 -->
        <el-tabs class="phone-tabs">
          <el-tab-pane label="产品详情">
            <div class="phone-description">
              <h2>产品介绍</h2>
              <div class="description-content">{{ phone.description }}</div>
              
              <h3>主要规格</h3>
              <div class="specs-grid">
                <div class="spec-item">
                  <div class="spec-label">处理器</div>
                  <div class="spec-value">{{ phone.processor || '暂无数据' }}</div>
                </div>
                <div class="spec-item">
                  <div class="spec-label">内存</div>
                  <div class="spec-value">{{ phone.ram || '暂无数据' }}</div>
                </div>
                <div class="spec-item">
                  <div class="spec-label">存储</div>
                  <div class="spec-value">{{ phone.storage || '暂无数据' }}</div>
                </div>
                <div class="spec-item">
                  <div class="spec-label">屏幕</div>
                  <div class="spec-value">{{ phone.screen || '暂无数据' }}</div>
                </div>
                <div class="spec-item">
                  <div class="spec-label">主摄像头</div>
                  <div class="spec-value">{{ phone.camera || '暂无数据' }}</div>
                </div>
                <div class="spec-item">
                  <div class="spec-label">电池</div>
                  <div class="spec-value">{{ phone.battery || '暂无数据' }}</div>
                </div>
                <div class="spec-item">
                  <div class="spec-label">操作系统</div>
                  <div class="spec-value">{{ phone.os || '暂无数据' }}</div>
                </div>
                <div class="spec-item">
                  <div class="spec-label">尺寸</div>
                  <div class="spec-value">{{ phone.dimensions || '暂无数据' }}</div>
                </div>
              </div>
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
                      <el-avatar :size="40" :src="review.userAvatar"></el-avatar>
                      <div class="review-user-meta">
                        <div class="review-username">{{ review.username }}</div>
                        <div class="review-date">{{ formatDate(review.createTime) }}</div>
                      </div>
                    </div>
                    <div class="review-rating">
                      <el-rate v-model="review.rating" disabled />
                      <span class="rating-text">{{ review.rating.toFixed(1) }}</span>
                    </div>
                  </div>
                  
                  <div class="review-title">{{ review.title }}</div>
                  <div class="review-content">{{ review.content }}</div>
                  
                  <div v-if="review.images && review.images.length > 0" class="review-images">
                    <el-image
                      v-for="(image, index) in review.images.slice(0, 3)"
                      :key="index"
                      :src="image"
                      fit="cover"
                      class="review-image"
                      :preview-src-list="review.images"
                    ></el-image>
                    <div v-if="review.images.length > 3" class="more-images">
                      +{{ review.images.length - 3 }}
                    </div>
                  </div>
                  
                  <div class="review-footer">
                    <el-button text @click="viewFullReview(review.id)">
                      查看完整评测
                    </el-button>
                    <div class="review-stats">
                      <span class="stat-item">
                        <el-icon><ChatLineRound /></el-icon>
                        {{ review.commentCount || 0 }}
                      </span>
                      <span class="stat-item">
                        <el-icon><CaretTop /></el-icon>
                        {{ review.likeCount || 0 }}
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChatLineRound, CaretTop, Star, StarFilled } from '@element-plus/icons-vue'
import instance from '@/utils/http'

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
const checkFavoriteStatus = () => {
  // 模拟从localStorage获取收藏状态
  const favoritePhones = JSON.parse(localStorage.getItem('favoritePhones') || '[]')
  isFavorite.value = favoritePhones.includes(Number(phoneId))
}

// 添加到收藏
const addToFavorites = () => {
  // 获取当前用户
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    ElMessage.warning('请先登录后再收藏')
    router.push('/login')
    return
  }
  
  // 从localStorage获取收藏列表
  const favoritePhones = JSON.parse(localStorage.getItem('favoritePhones') || '[]')
  
  if (isFavorite.value) {
    // 取消收藏
    const index = favoritePhones.indexOf(Number(phoneId))
    if (index > -1) {
      favoritePhones.splice(index, 1)
      localStorage.setItem('favoritePhones', JSON.stringify(favoritePhones))
      isFavorite.value = false
      ElMessage.success('已取消收藏')
    }
  } else {
    // 添加收藏
    favoritePhones.push(Number(phoneId))
    localStorage.setItem('favoritePhones', JSON.stringify(favoritePhones))
    isFavorite.value = true
    ElMessage.success('收藏成功')
  }
}

// 跳转到发布评测页面
const goToPost = () => {
  router.push({
    path: '/post',
    query: {
      brandId: phone.value.brandId,
      phoneModelId: phoneId
    }
  })
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
onMounted(() => {
  if (phoneId) {
    fetchPhoneDetail()
  } else {
    loading.value = false
    ElMessage.error('参数错误')
  }
})
</script>

<style scoped>
.phone-detail-container {
  padding: 20px 0;
}

.loading-container,
.error-container {
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

/* 手机概览部分 */
.phone-overview {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.phone-gallery {
  flex: 1;
  max-width: 600px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.phone-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.brand-tag {
  display: inline-block;
  background-color: #f0f0f0;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.phone-name {
  font-size: 28px;
  margin: 0 0 15px 0;
}

.phone-price {
  font-size: 24px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 20px;
}

.phone-meta {
  margin-bottom: 30px;
}

.meta-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.meta-label {
  width: 100px;
  color: #666;
}

.phone-actions {
  display: flex;
  gap: 15px;
  margin-top: auto;
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

.spec-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
}

.spec-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.spec-value {
  font-weight: 500;
}

/* 评测部分 */
.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  transition: box-shadow 0.3s;
}

.review-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
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
  gap: 10px;
}

.review-user-meta {
  display: flex;
  flex-direction: column;
}

.review-username {
  font-weight: 500;
}

.review-date {
  font-size: 12px;
  color: #999;
}

.review-rating {
  display: flex;
  align-items: center;
}

.rating-text {
  margin-left: 8px;
  font-weight: bold;
  color: #ff9900;
}

.review-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
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
}

.review-images {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  position: relative;
}

.review-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  object-fit: cover;
}

.more-images {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
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
  .phone-overview {
    flex-direction: column;
  }
  
  .phone-gallery {
    max-width: 100%;
  }
  
  .phone-info {
    padding: 0 15px;
  }
  
  .specs-grid {
    grid-template-columns: 1fr;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .review-images {
    flex-wrap: wrap;
  }
  
  .related-phones-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 