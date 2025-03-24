<template>
  <div class="brand-list-container">
    <div class="container">
      <!-- 品牌列表 -->
      <div class="brand-nav">
        <div class="section-title">品牌导航</div>
        <el-scrollbar>
          <div class="brand-nav-list">
            <div
              v-for="brand in brands"
              :key="brand.id"
              class="brand-item"
              :class="{ 'active': selectedBrand && selectedBrand.id === brand.id }"
              @click="selectBrand(brand)"
            >
              <div class="brand-logo">
                <img :src="brand.logo" :alt="brand.name" class="brand-logo-img" />
              </div>
              <div class="brand-name">{{ brand.name }}</div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      
      <!-- 品牌详情 -->
      <div v-if="selectedBrand" class="brand-detail">
        <div class="brand-header">
          <div class="brand-info">
            <img :src="selectedBrand.logo" :alt="selectedBrand.name" class="brand-detail-logo" />
            <div class="brand-title">
              <h2>{{ selectedBrand.name }}</h2>
              <div class="brand-description">{{ selectedBrand.description }}</div>
            </div>
          </div>
          
          <div class="brand-sort">
            <span>排序方式:</span>
            <el-radio-group v-model="sortBy" size="small">
              <el-radio-button label="date">最新上市</el-radio-button>
              <el-radio-button label="popularity">人气最高</el-radio-button>
              <el-radio-button label="price">价格排序</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        
        <!-- 加载中状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="3" animated />
        </div>
        
        <!-- 手机型号列表 -->
        <div v-else>
          <el-empty v-if="filteredPhones.length === 0" description="暂无手机型号" />
          
          <div v-else class="phone-list">
            <div
              v-for="phone in filteredPhones"
              :key="phone.id"
              class="phone-card card-hover"
              @click="goToPhoneDetail(phone.id)"
            >
              <img :src="phone.image" :alt="phone.name" class="phone-image" />
              <div class="phone-info">
                <h3 class="phone-name">{{ phone.name }}</h3>
                <div class="phone-desc">{{ phone.description }}</div>
                <div class="phone-meta">
                  <div class="phone-price">¥{{ phone.price }}</div>
                  <div class="phone-date">{{ formatDate(phone.releaseDate || phone.createTime) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="no-brand-selected">
        <el-empty description="请选择一个品牌" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import instance from '@/utils/http'

const router = useRouter()
const selectedBrand = ref(null)
const sortBy = ref('date')

// 品牌和型号数据
const brands = ref([])
const phoneModels = ref([])
const loading = ref(false)

// 获取所有品牌
const fetchBrands = async () => {
  loading.value = true
  try {
    // 使用统一的API接口
    const response = await instance.get('/brands')
    
    console.log('品牌接口原始响应:', response)
    
    // 检查响应格式并处理数据
    if (response && Array.isArray(response)) {
      // 如果直接返回数组，说明拦截器已提取了data字段
      brands.value = response
    } else if (response && response.data && Array.isArray(response.data)) {
      // 如果返回的是包含data字段的对象
      brands.value = response.data
    } else if (response && response.code === 200 && Array.isArray(response.data)) {
      // 直接处理API响应格式
      brands.value = response.data
    } else {
      // 无法识别的响应格式，使用空数组
      console.error('无法识别的品牌数据格式:', response)
      brands.value = []
      ElMessage.warning('获取品牌数据格式异常')
    }
    
    console.log('处理后的品牌数据:', brands.value)
    
    // 如果有品牌，默认选择第一个
    if (brands.value.length > 0) {
      selectBrand(brands.value[0])
    } else {
      ElMessage.warning('没有可用的品牌数据')
    }
  } catch (error) {
    console.error('获取品牌列表失败:', error)
    ElMessage.error('获取品牌列表失败: ' + (error.message || '未知错误'))
    brands.value = []
  } finally {
    loading.value = false
  }
}

// 选择品牌并获取对应型号
const selectBrand = async (brand) => {
  selectedBrand.value = brand
  phoneModels.value = []
  loading.value = true
  
  try {
    // 使用统一的API接口获取品牌下的型号
    const response = await instance.get(`/brands/${brand.id}/models`)
    
    console.log('型号接口原始响应:', response)
    
    // 检查响应格式并处理数据
    if (response && Array.isArray(response)) {
      // 如果直接返回数组，说明拦截器已提取了data字段
      phoneModels.value = response
    } else if (response && response.data && Array.isArray(response.data)) {
      // 如果返回的是包含data字段的对象
      phoneModels.value = response.data
    } else if (response && response.code === 200 && Array.isArray(response.data)) {
      // 直接处理API响应格式
      phoneModels.value = response.data
    } else {
      // 无法识别的响应格式，使用空数组
      console.error(`无法识别的型号数据格式 (品牌ID: ${brand.id}):`, response)
      phoneModels.value = []
      ElMessage.warning('获取型号数据格式异常')
    }
    
    console.log('处理后的型号数据:', phoneModels.value)
  } catch (error) {
    console.error('获取型号列表失败:', error)
    ElMessage.error('获取型号列表失败: ' + (error.message || '未知错误'))
    phoneModels.value = []
  } finally {
    loading.value = false
  }
}

// 根据选择的品牌过滤手机列表
const filteredPhones = computed(() => {
  if (!selectedBrand.value) return []
  
  let result = phoneModels.value
  
  // 根据排序选项排序
  if (sortBy.value === 'price') {
    result = [...result].sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'popularity') {
    result = [...result].sort((a, b) => b.popularity - a.popularity)
  } else {
    // 默认按日期排序（新 -> 旧）
    result = [...result].sort((a, b) => new Date(b.releaseDate || b.createTime) - new Date(a.releaseDate || a.createTime))
  }
  
  return result
})

// 获取品牌名称
const getBrandName = (brandId) => {
  const brand = brands.value.find(b => b.id === brandId)
  return brand ? brand.name : '未知品牌'
}

// 查看手机评测
const viewPhoneReviews = (phoneId) => {
  // 实际应用中应跳转到该手机的评测列表
  router.push(`/phone/${phoneId}/reviews`)
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

// 跳转到手机详情页面
const goToPhoneDetail = (phoneId) => {
  router.push(`/phone/${phoneId}`)
}

// 在组件挂载时获取品牌列表
onMounted(() => {
  fetchBrands()
})
</script>

<style scoped>
.brand-list-container {
  padding: 20px 0;
}

.brand-nav {
  margin-bottom: 30px;
}

.brand-nav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 10px 0;
}

.brand-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  padding: 10px;
  border-radius: 8px;
  min-width: 100px;
  max-width: 120px;
}

.brand-item:hover {
  background-color: #f0f0f0;
}

.brand-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
}

.brand-logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.brand-logo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.brand-name {
  font-size: 14px;
  text-align: center;
}

.brand-detail {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.brand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.brand-info {
  display: flex;
  align-items: center;
}

.brand-detail-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-right: 20px;
}

.brand-title h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.brand-description {
  color: #666;
  font-size: 14px;
}

.brand-sort {
  display: flex;
  align-items: center;
}

.brand-sort span {
  margin-right: 10px;
  color: #666;
}

.loading-container {
  padding: 30px;
}

.phone-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.phone-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  cursor: pointer;
}

.phone-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: #f8f8f8;
}

.phone-info {
  padding: 15px;
}

.phone-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
}

.phone-desc {
  color: #666;
  font-size: 13px;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  height: 40px;
}

.phone-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.phone-price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.phone-date {
  color: #999;
  font-size: 12px;
}

.no-brand-selected {
  background: #fff;
  border-radius: 8px;
  padding: 50px;
  text-align: center;
}

@media (max-width: 768px) {
  .brand-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .brand-sort {
    margin-top: 15px;
  }
  
  .phone-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style> 