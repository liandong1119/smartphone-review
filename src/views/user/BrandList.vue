<template>
  <div class="brand-list-container">
    <!-- 品牌分类 -->
    <el-card class="brand-category-card">
      <template #header>
        <div class="card-header">
          <span>手机品牌</span>
        </div>
      </template>
      
      <div class="brand-list">
        <div 
          v-for="brand in brands" 
          :key="brand.id" 
          class="brand-item"
          :class="{ 'active': selectedBrand === brand.id }"
          @click="selectBrand(brand.id)"
        >
          <div class="brand-logo">
            <img :src="brand.logo" :alt="brand.name" />
          </div>
          <div class="brand-name">{{ brand.name }}</div>
        </div>
      </div>
    </el-card>
    
    <!-- 手机型号列表 -->
    <el-card class="phone-list-card">
      <template #header>
        <div class="card-header">
          <span v-if="selectedBrand">{{ getBrandName(selectedBrand) }}系列机型</span>
          <span v-else>请选择品牌查看机型</span>
          
          <!-- 排序选项 -->
          <div class="sort-options">
            <el-select v-model="sortBy" placeholder="排序方式" size="small">
              <el-option label="发布时间" value="date" />
              <el-option label="价格" value="price" />
              <el-option label="热度" value="popularity" />
            </el-select>
          </div>
        </div>
      </template>
      
      <div v-if="!selectedBrand" class="select-brand-tip">
        <el-empty description="请先选择左侧品牌" />
      </div>
      
      <div v-else-if="filteredPhones.length === 0" class="empty-message">
        <el-empty description="暂无该品牌机型" />
      </div>
      
      <div v-else class="phone-grid">
        <div v-for="phone in filteredPhones" :key="phone.id" class="phone-card">
          <div class="phone-image">
            <img :src="phone.images[0]" :alt="phone.name" />
          </div>
          <div class="phone-info">
            <h3 class="phone-name">{{ phone.name }}</h3>
            <p class="phone-desc">{{ phone.content }}</p>
            <div class="phone-meta">
              <span class="phone-date">发布: {{ phone.date }}</span>
              <el-button type="primary" size="small" @click="viewPhoneReviews(phone.id)">查看评测</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedBrand = ref('')
const sortBy = ref('date')

// 模拟品牌数据
const brands = ref([
  { id: 'apple', name: '苹果', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/505px-Apple_logo_black.svg.png' },
  { id: 'samsung', name: '三星', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/640px-Samsung_Logo.svg.png' },
  { id: 'xiaomi', name: '小米', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/768px-Xiaomi_logo_%282021-%29.svg.png' },
  { id: 'huawei', name: '华为', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Huawei_Logo.svg/1280px-Huawei_Logo.svg.png' },
  { id: 'oppo', name: 'OPPO', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/OPPO_Logo.svg/640px-OPPO_Logo.svg.png' },
  { id: 'vivo', name: 'vivo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Vivo_logo_2019.svg/1200px-Vivo_logo_2019.svg.png' }
])

// 模拟手机型号数据
const phones = ref([
  {
    id: 1,
    brandId: 'apple',
    name: 'iPhone 15 Pro Max',
    images: [
      'https://img.alicdn.com/imgextra/i3/1917047079/O1CN01dPH3Wy22UbBZRRdP2_!!1917047079.png'
    ],
    content: 'iPhone 15 Pro Max采用钛金属边框，A17 Pro处理器，性能强劲，搭载iOS 17系统。',
    date: '2023-10-15',
    price: 8999,
    popularity: 98
  },
  {
    id: 2,
    brandId: 'apple',
    name: 'iPhone 15',
    images: [
      'https://img.alicdn.com/imgextra/i1/1714128138/O1CN01TRBc4C29zFt2bS2oH_!!1714128138.jpg'
    ],
    content: 'iPhone 15采用玻璃材质，搭载A16仿生芯片，动态岛设计，提供多种鲜亮颜色选择。',
    date: '2023-09-22',
    price: 5999,
    popularity: 95
  },
  {
    id: 3,
    brandId: 'xiaomi',
    name: '小米14 Ultra',
    images: [
      'https://img.alicdn.com/imgextra/i1/2616970884/O1CN01QkEw801IOuMxfLS4U_!!2616970884.jpg'
    ],
    content: '小米14 Ultra搭载骁龙8 Gen3处理器，徕卡认证四摄，2K+分辨率OLED屏幕，拍照效果出色。',
    date: '2024-02-25',
    price: 6499,
    popularity: 92
  },
  {
    id: 4,
    brandId: 'xiaomi',
    name: '小米14',
    images: [
      'https://img.alicdn.com/imgextra/i4/2616970884/O1CN01pK5T8Q1IOuMoU5vhp_!!2616970884.jpg'
    ],
    content: '小米14搭载全新骁龙8 Gen3处理器，轻薄设计，徕卡光学镜头，新一代HyperOS系统。',
    date: '2023-10-26',
    price: 4299,
    popularity: 90
  },
  {
    id: 5,
    brandId: 'huawei',
    name: 'Mate60 Pro',
    images: [
      'https://img.alicdn.com/imgextra/i3/2838892713/O1CN01UYfFAW1PpKJCcGf9O_!!2838892713.jpg'
    ],
    content: '华为Mate60 Pro采用昆仑玻璃，麒麟9000S芯片，搭载鸿蒙系统，支持卫星通信。',
    date: '2023-08-29',
    price: 6999,
    popularity: 96
  },
  {
    id: 6,
    brandId: 'huawei',
    name: 'P60 Pro',
    images: [
      'https://img.alicdn.com/imgextra/i2/2838892713/O1CN01jQRPn91PpKJDDVA1t_!!2838892713.jpg'
    ],
    content: '华为P60 Pro搭载XMAGE影像系统，变光可调光圈，双重望远增强，全新配色设计。',
    date: '2023-03-23',
    price: 6488,
    popularity: 88
  },
  {
    id: 7,
    brandId: 'samsung',
    name: 'Galaxy S24 Ultra',
    images: [
      'https://img.alicdn.com/imgextra/i2/2212560018/O1CN01hkZgDz1oVx9Qqgz9h_!!2212560018.jpg'
    ],
    content: '三星Galaxy S24 Ultra采用钛金属边框，200MP摄像头，支持S Pen，搭载骁龙8 Gen3处理器。',
    date: '2024-01-17',
    price: 9999,
    popularity: 94
  },
  {
    id: 8,
    brandId: 'samsung',
    name: 'Galaxy Z Fold5',
    images: [
      'https://img.alicdn.com/imgextra/i1/2212560018/O1CN01UibVSx1oVx90QqBU3_!!2212560018.jpg'
    ],
    content: '三星Galaxy Z Fold5可折叠设计，内外双屏，支持S Pen，搭载骁龙8 Gen2处理器。',
    date: '2023-07-26',
    price: 12999,
    popularity: 85
  },
  {
    id: 9,
    brandId: 'oppo',
    name: 'Find X7 Ultra',
    images: [
      'https://img.alicdn.com/imgextra/i4/2201203103170/O1CN01Yz7CZY1KbPFuHwgk7_!!2201203103170.jpg'
    ],
    content: 'OPPO Find X7 Ultra搭载双长焦四摄系统，天玑9300旗舰芯片，2K超视网膜曲面屏。',
    date: '2024-01-08',
    price: 6499,
    popularity: 89
  },
  {
    id: 10,
    brandId: 'vivo',
    name: 'X100 Pro',
    images: [
      'https://img.alicdn.com/imgextra/i4/2210860234676/O1CN01XzNL761YpWvSUaQAq_!!2210860234676.jpg'
    ],
    content: 'vivo X100 Pro搭载天玑9300处理器，蔡司影像系统，专业大底主摄，5400mAh超大电池。',
    date: '2023-11-13',
    price: 5999,
    popularity: 91
  }
])

// 根据选择的品牌过滤手机列表
const filteredPhones = computed(() => {
  if (!selectedBrand.value) return []
  
  let result = phones.value.filter(phone => phone.brandId === selectedBrand.value)
  
  // 根据排序选项排序
  if (sortBy.value === 'date') {
    result = result.sort((a, b) => new Date(b.date) - new Date(a.date))
  } else if (sortBy.value === 'price') {
    result = result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'popularity') {
    result = result.sort((a, b) => b.popularity - a.popularity)
  }
  
  return result
})

// 选择品牌
const selectBrand = (brandId) => {
  selectedBrand.value = brandId
}

// 获取品牌名称
const getBrandName = (brandId) => {
  const brand = brands.value.find(b => b.id === brandId)
  return brand ? brand.name : ''
}

// 查看手机评测
const viewPhoneReviews = (phoneId) => {
  // 实际应用中应跳转到该手机的评测列表
  router.push(`/phone/${phoneId}/reviews`)
}

// 组件挂载时可以从API获取数据
onMounted(() => {
  // 这里可以添加API调用，从后端获取数据
})
</script>

<style scoped>
.brand-list-container {
  width: 100%;
  display: flex;
  gap: 20px;
}

.brand-category-card {
  width: 200px;
  flex-shrink: 0;
}

.phone-list-card {
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.brand-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.brand-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.brand-item:hover {
  background-color: #f5f7fa;
}

.brand-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
}

.brand-logo {
  width: 40px;
  height: 40px;
  overflow: hidden;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.brand-name {
  font-size: 14px;
}

.phone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.phone-card {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
}

.phone-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.phone-image {
  height: 200px;
  overflow: hidden;
}

.phone-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.phone-info {
  padding: 15px;
}

.phone-name {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.phone-desc {
  color: #606266;
  font-size: 14px;
  margin-bottom: 15px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.phone-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.phone-date {
  color: #909399;
  font-size: 12px;
}

.select-brand-tip, .empty-message {
  padding: 40px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .brand-list-container {
    flex-direction: column;
  }
  
  .brand-category-card {
    width: 100%;
  }
  
  .brand-list {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .brand-item {
    width: 80px;
    flex-direction: column;
    text-align: center;
  }
  
  .brand-logo {
    margin-right: 0;
    margin-bottom: 5px;
  }
  
  .phone-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
</style> 