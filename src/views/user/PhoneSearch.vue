<template>
  <div class="phone-search-container">
    <div class="search-header">
      <h1>手机搜索</h1>
      <div class="search-input-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索手机品牌或型号..."
          class="search-input"
          clearable
          @input="debounceSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>
    
    <div class="filter-container">
      <div class="filter-section">
        <span class="filter-label">品牌筛选:</span>
        <el-select
          v-model="selectedBrand"
          placeholder="选择品牌"
          clearable
          @change="handleBrandChange"
        >
          <el-option
            v-for="brand in brands"
            :key="brand.id"
            :label="brand.name"
            :value="brand.id"
          />
        </el-select>
      </div>
      
      <div class="filter-section">
        <span class="filter-label">价格区间:</span>
        <el-select
          v-model="priceRange"
          placeholder="选择价格区间"
          clearable
          @change="handleSearch"
        >
          <el-option label="2000元以下" value="0-2000" />
          <el-option label="2000-3000元" value="2000-3000" />
          <el-option label="3000-4000元" value="3000-4000" />
          <el-option label="4000-5000元" value="4000-5000" />
          <el-option label="5000-6000元" value="5000-6000" />
          <el-option label="6000元以上" value="6000-99999" />
        </el-select>
      </div>
      
      <div class="filter-section">
        <span class="filter-label">排序方式:</span>
        <el-select
          v-model="sortOrder"
          placeholder="排序方式"
          @change="handleSearch"
        >
          <el-option label="最新发布" value="newest" />
          <el-option label="价格从低到高" value="price_asc" />
          <el-option label="价格从高到低" value="price_desc" />
          <el-option label="评分从高到低" value="rating_desc" />
        </el-select>
      </div>
    </div>
    
    <div class="search-results">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>
      
      <div v-else-if="phones.length === 0" class="empty-container">
        <el-empty description="未找到匹配的手机" />
      </div>
      
      <div v-else class="phones-grid">
        <div 
          v-for="phone in phones" 
          :key="phone.id" 
          class="phone-card"
          @click="viewPhoneDetail(phone.id)"
        >
          <div class="phone-image">
            <img :src="phone.image" :alt="phone.name" />
          </div>
          <div class="phone-info">
            <div class="phone-name">{{ phone.name }}</div>
            <div class="phone-brand">{{ phone.brand.name }}</div>
            <div class="phone-price">¥{{ phone.price }}</div>
            <div class="phone-rating" v-if="phone.rating">
              <el-rate 
                v-model="phone.rating" 
                disabled 
                :max="5" 
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']" 
              />
              <span class="rating-value">{{ phone.rating.toFixed(1) }}</span>
            </div>
          </div>
          <div class="favorite-icon" @click.stop="toggleFavorite(phone)">
            <el-icon :size="20" :color="isFavorite(phone) ? '#ff9900' : '#909399'">
              <star-filled v-if="isFavorite(phone)" />
              <star v-else />
            </el-icon>
          </div>
        </div>
      </div>
      
      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 36]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, Star, StarFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import instance from '@/utils/http'
import { useUserStore } from '@/stores/user'
import phoneApi from '@/api/modules/phone'
import _ from 'lodash'

const router = useRouter()
const userStore = useUserStore()

// 搜索和筛选状态
const searchKeyword = ref('')
const selectedBrand = ref('')
const priceRange = ref('')
const sortOrder = ref('newest')

// 分页
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

// 数据
const phones = ref([])
const brands = ref([])
const loading = ref(false)
const favoritePhones = ref([])

// 防抖搜索
const debounceSearch = _.debounce(() => {
  handleSearch()
}, 300)

// 获取所有品牌
const fetchBrands = async () => {
  try {
    const response = await phoneApi.getBrands()
    if (response && response.data) {
      brands.value = response.data
    }
  } catch (error) {
    console.error('获取品牌列表失败:', error)
  }
}

// 搜索手机
const handleSearch = async () => {
  loading.value = true
  
  try {
    // 构建查询参数
    const params = {
      page: currentPage.value,
      limit: pageSize.value
    }
    
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }
    
    if (selectedBrand.value) {
      params.brandId = selectedBrand.value
    }
    
    if (priceRange.value) {
      const [min, max] = priceRange.value.split('-')
      params.minPrice = min
      params.maxPrice = max
    }
    
    if (sortOrder.value) {
      params.sort = sortOrder.value
    }
    
    const response = await phoneApi.searchPhones(params)
    
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        phones.value = response.data
        total.value = response.data.length
      } else if (response.data.records) {
        phones.value = response.data.records
        total.value = response.data.total
      }
    } else {
      phones.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('搜索手机失败:', error)
    ElMessage.error('搜索失败，请稍后重试')
    phones.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 品牌筛选变化
const handleBrandChange = () => {
  currentPage.value = 1
  handleSearch()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  handleSearch()
}

// 页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  handleSearch()
}

// 查看手机详情
const viewPhoneDetail = (id) => {
  router.push(`/phone/${id}`)
}

// 获取用户收藏的手机
const fetchFavoritePhones = async () => {
  if (!userStore.isLoggedIn) return
  
  try {
    const response = await phoneApi.getFavoritePhones()
    
    if (response && response.data && Array.isArray(response.data)) {
      favoritePhones.value = response.data.map(item => item.id)
    } else {
      // 备用方案：从localStorage获取
      favoritePhones.value = JSON.parse(localStorage.getItem('favoritePhones') || '[]')
    }
  } catch (error) {
    console.error('获取收藏手机失败:', error)
    // 备用方案：从localStorage获取
    favoritePhones.value = JSON.parse(localStorage.getItem('favoritePhones') || '[]')
  }
}

// 检查手机是否已收藏
const isFavorite = (phone) => {
  return favoritePhones.value.includes(phone.id)
}

// 切换收藏状态
const toggleFavorite = async (phone) => {
  if (!userStore.isLoggedIn) {
    ElMessageBox.confirm(
      '请先登录后再收藏',
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
  
  const isFav = isFavorite(phone)
  const action = isFav ? 'remove' : 'add'
  
  try {
    const response = await phoneApi.toggleFavoritePhone(phone.id, action)
    
    if (response && response.code === 200) {
      if (isFav) {
        favoritePhones.value = favoritePhones.value.filter(id => id !== phone.id)
        // 同时更新localStorage
        localStorage.setItem('favoritePhones', JSON.stringify(favoritePhones.value))
      } else {
        favoritePhones.value.push(phone.id)
        // 同时更新localStorage
        localStorage.setItem('favoritePhones', JSON.stringify(favoritePhones.value))
      }
      ElMessage.success(isFav ? '已取消收藏' : '已添加到收藏')
    } else {
      ElMessage.error('操作失败，请稍后重试')
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

// 生命周期钩子
onMounted(() => {
  fetchBrands()
  fetchFavoritePhones()
  handleSearch()
})
</script>

<style scoped>
.phone-search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-header {
  margin-bottom: 30px;
  text-align: center;
}

.search-header h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #303133;
}

.search-input-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-weight: 500;
  color: #606266;
}

.phones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.phone-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
  cursor: pointer;
}

.phone-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.phone-image {
  height: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.phone-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.phone-info {
  padding: 15px;
}

.phone-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
  color: #303133;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.phone-brand {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.phone-price {
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
  margin-bottom: 10px;
}

.phone-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-value {
  font-size: 14px;
  color: #909399;
}

.favorite-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.favorite-icon:hover {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.loading-container,
.empty-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 