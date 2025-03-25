<template>
  <div class="brand-detail-container">
    <div class="container">
      <!-- 品牌头部信息 -->
      <div v-if="brand" class="brand-header">
        <div class="brand-info">
          <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
          <div class="brand-title">
            <h1>{{ brand.name }} <span class="brand-name-en" v-if="brand.nameEn">({{ brand.nameEn }})</span></h1>
            <div class="brand-meta">
              <el-tag size="small">{{ brand.country || '未知国家' }}</el-tag>
              <span class="brand-founded" v-if="brand.founded">创立于: {{ brand.founded }}</span>
            </div>
            <div class="brand-description" v-if="brand.description">{{ brand.description }}</div>
          </div>
        </div>
        
        <!-- 品牌详细介绍 -->
        <div class="brand-detail-info">
          <el-divider content-position="left">品牌简介</el-divider>
          <p class="brand-history">
            {{ brand.history || brand.description || `${brand.name}是一家知名智能手机制造商，提供多种价位的智能手机产品，以满足不同消费者的需求。` }}
          </p>
          
          <!-- 品牌特点/荣誉 -->
          <div class="brand-features" v-if="brand.features || true">
            <el-divider content-position="left">品牌特点</el-divider>
            <ul class="feature-list">
              <li v-for="(feature, index) in brandFeatures" :key="index">{{ feature }}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- 加载中状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>
      
      <!-- 相关评测列表 -->
      <div v-else>
        <h2 class="section-title">{{ brand ? brand.name : '' }}相关评测</h2>
        
        <el-empty v-if="posts.length === 0" description="暂无相关评测" />
        
        <div v-else class="posts-list">
          <div v-for="post in posts" :key="post.id" class="post-card card-hover" @click="viewPost(post.id)">
            <div class="post-image" v-if="post.coverImage">
              <img :src="post.coverImage" :alt="post.title" />
            </div>
            <div class="post-content">
              <h3 class="post-title">{{ post.title }}</h3>
              <div class="post-excerpt">{{ truncate(post.content) }}</div>
              <div class="post-meta">
                <div class="post-author">
                  <el-avatar :size="24" :src="post.user?.avatar"></el-avatar>
                  <span>{{ post.user?.username || '匿名用户' }}</span>
                </div>
                <div class="post-stats">
                  <span><el-icon><View /></el-icon> {{ post.views || 0 }}</span>
                  <span><el-icon><ChatDotRound /></el-icon> {{ post.comments || 0 }}</span>
                  <span><el-icon><Star /></el-icon> {{ post.favorites || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="pagination-container" v-if="posts.length > 0">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { View, ChatDotRound, Star } from '@element-plus/icons-vue'
import instance from '@/utils/http'

const route = useRoute()
const router = useRouter()
const brandId = computed(() => route.params.id)

// 页面数据
const brand = ref(null)
const posts = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取品牌信息
const fetchBrand = async () => {
  try {
    const response = await instance.get(`/brands/${brandId.value}`);
    
    if (response && response.code === 200 && response.data) {
      brand.value = response.data;
    } else if (response && typeof response === 'object') {
      // 直接返回对象的情况
      brand.value = response;
    } else {
      ElMessage.error('获取品牌信息失败');
      brand.value = null;
    }
  } catch (error) {
    console.error('获取品牌信息失败:', error);
    ElMessage.error('获取品牌信息失败');
    brand.value = null;
  }
}

// 获取品牌相关评测
const fetchBrandPosts = async () => {
  loading.value = true
  try {
    const response = await instance.get('/posts', {
      params: {
        brandId: brandId.value,
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })
    
    if (response && response.records) {
      posts.value = response.records
      total.value = response.total || 0
    } else if (Array.isArray(response)) {
      posts.value = response
      total.value = response.length
    } else {
      posts.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取品牌评测列表失败:', error)
    ElMessage.error('获取评测列表失败')
    posts.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 查看评测详情
const viewPost = (postId) => {
  router.push(`/review/${postId}`)
}

// 监听页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchBrandPosts()
  window.scrollTo({top: 0, behavior: 'smooth'})
}

// 截断文本过滤器
const truncate = (text, length = 100) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// 品牌特点（如果没有则提供默认值）
const brandFeatures = computed(() => {
  if (brand.value && brand.value.features && Array.isArray(brand.value.features)) {
    return brand.value.features;
  }
  
  // 默认特点
  return [
    `${brand.value?.name || '该品牌'}以其优质的产品和创新技术闻名于世`,
    `产品覆盖多种价位，满足不同消费者需求`,
    `注重用户体验和产品质量`,
    `持续推出新的技术和功能`,
    `在全球智能手机市场占有一定份额`
  ];
})

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    currentPage.value = 1
    fetchBrand()
    fetchBrandPosts()
  }
})

// 初始化数据
onMounted(() => {
  if (brandId.value) {
    fetchBrand()
    fetchBrandPosts()
  }
})
</script>

<style scoped>
.brand-detail-container {
  padding: 30px 0;
}

.brand-header {
  background-color: #fff;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.brand-info {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.brand-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-right: 25px;
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.brand-title h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.brand-name-en {
  font-weight: normal;
  font-size: 18px;
  color: #606266;
}

.brand-meta {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.brand-founded {
  color: #606266;
  font-size: 14px;
}

.brand-description {
  color: #606266;
  line-height: 1.6;
  font-size: 15px;
  margin-top: 5px;
}

.brand-detail-info {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-top: 10px;
}

.brand-history {
  line-height: 1.8;
  color: #303133;
  text-align: justify;
}

.feature-list {
  padding-left: 20px;
  margin: 15px 0;
}

.feature-list li {
  margin-bottom: 10px;
  color: #303133;
  line-height: 1.6;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  margin: 30px 0 20px;
  position: relative;
  padding-left: 15px;
  border-left: 4px solid #409EFF;
  color: #303133;
}

.loading-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.posts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.post-card {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.post-image {
  height: 180px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.post-card:hover .post-image img {
  transform: scale(1.05);
}

.post-content {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px;
  color: #303133;
  line-height: 1.4;
}

.post-excerpt {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 15px;
  flex: 1;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
  font-size: 12px;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #409EFF;
}

.post-stats {
  display: flex;
  gap: 10px;
  color: #909399;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .brand-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .brand-logo {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .brand-meta {
    justify-content: center;
  }
  
  .posts-list {
    grid-template-columns: 1fr;
  }
}
</style> 