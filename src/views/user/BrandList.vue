<template>
  <div class="brand-list-container">
    <div class="container">
      <h1 class="page-title">品牌浏览</h1>
      
      <!-- 品牌列表 -->
      <div class="brand-grid">
        <!-- 加载中状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="3" animated />
        </div>
        
        <!-- 品牌卡片 -->
        <template v-else>
          <router-link 
            v-for="brand in brands" 
            :key="brand.id" 
            :to="`/brands/${brand.id}`"
            class="brand-card card-hover"
          >
            <div class="brand-logo">
              <img :src="brand.logo" :alt="brand.name" class="brand-logo-img" />
            </div>
            <div class="brand-name">{{ brand.name }}</div>
          </router-link>
        </template>
      </div>
      
      <!-- 无数据状态 -->
      <el-empty v-if="brands.length === 0 && !loading" description="暂无品牌数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import instance from '@/utils/http'

// 品牌数据
const brands = ref([])
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
  } catch (error) {
    console.error('获取品牌列表失败:', error)
    ElMessage.error('获取品牌列表失败: ' + (error.message || '未知错误'))
    brands.value = []
  } finally {
    loading.value = false
  }
}

// 在组件挂载时获取品牌列表
onMounted(() => {
  fetchBrands()
})
</script>

<style scoped>
.brand-list-container {
  padding: 30px 0;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  padding-left: 12px;
  border-left: 4px solid #409EFF;
}

.brand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.brand-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  text-decoration: none;
  color: inherit;
}

.brand-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.brand-logo {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 10px;
}

.brand-logo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.brand-name {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

.loading-container {
  grid-column: 1 / -1;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .brand-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
  
  .brand-logo {
    width: 80px;
    height: 80px;
  }
  
  .brand-name {
    font-size: 14px;
  }
}
</style> 