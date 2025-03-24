<template>
  <div class="review-post-container">
    <!-- 发布评测表单 -->
    <el-card class="post-card">
      <div class="post-header">
        <h3>发布评测</h3>
      </div>
      
      <el-form :model="postForm" label-position="top">
        <!-- 评测内容 -->
        <el-form-item label="评测内容">
          <el-input
            v-model="postForm.content"
            type="textarea"
            :rows="4"
            placeholder="分享你对这款手机的使用体验..."
          ></el-input>
        </el-form-item>
        
        <!-- 上传图片 -->
        <el-form-item label="上传图片">
          <div class="upload-area">
            <div class="upload-preview" v-for="(url, index) in previewUrls" :key="index">
              <img :src="url" class="preview-image" />
              <div class="delete-preview" @click="removeImage(index)">
                <el-icon><Delete /></el-icon>
              </div>
            </div>
            
            <div class="upload-button" v-if="previewUrls.length < 3">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleImageChange"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        
        <!-- 手机品牌和型号 -->
        <div class="form-row">
          <el-form-item label="手机品牌" class="form-half">
            <el-select v-model="postForm.brand" placeholder="选择品牌">
              <el-option
                v-for="brand in brands"
                :key="brand.id"
                :label="brand.name"
                :value="brand.id"
              ></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="手机型号" class="form-half">
            <el-select 
              v-model="postForm.model" 
              placeholder="选择型号"
              :disabled="!postForm.brand"
            >
              <el-option
                v-for="model in filteredModels"
                :key="model.id"
                :label="model.name"
                :value="model.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitPost">发布评测</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'

const router = useRouter()
const postForm = ref({
  content: '',
  brand: '',
  model: '',
  images: []
})
const previewUrls = ref([])

// 模拟品牌数据
const brands = ref([
  { id: 'apple', name: '苹果' },
  { id: 'samsung', name: '三星' },
  { id: 'xiaomi', name: '小米' },
  { id: 'huawei', name: '华为' },
  { id: 'oppo', name: 'OPPO' },
  { id: 'vivo', name: 'vivo' }
])

// 模拟手机型号数据
const phoneModels = ref([
  { id: 'iphone15', brandId: 'apple', name: 'iPhone 15' },
  { id: 'iphone15pro', brandId: 'apple', name: 'iPhone 15 Pro' },
  { id: 'iphone15promax', brandId: 'apple', name: 'iPhone 15 Pro Max' },
  { id: 's23', brandId: 'samsung', name: 'Galaxy S23' },
  { id: 's23ultra', brandId: 'samsung', name: 'Galaxy S23 Ultra' },
  { id: 'xiaomi14', brandId: 'xiaomi', name: '小米14' },
  { id: 'xiaomi14ultra', brandId: 'xiaomi', name: '小米14 Ultra' },
  { id: 'mate60', brandId: 'huawei', name: 'Mate 60' },
  { id: 'mate60pro', brandId: 'huawei', name: 'Mate 60 Pro' },
  { id: 'findx7', brandId: 'oppo', name: 'Find X7' },
  { id: 'findx7ultra', brandId: 'oppo', name: 'Find X7 Ultra' },
  { id: 'vivox100', brandId: 'vivo', name: 'X100' },
  { id: 'vivox100pro', brandId: 'vivo', name: 'X100 Pro' }
])

// 根据选择的品牌过滤型号
const filteredModels = computed(() => {
  if (!postForm.value.brand) return []
  return phoneModels.value.filter(model => model.brandId === postForm.value.brand)
})

// 处理图片上传
const handleImageChange = (file) => {
  // 实际应用中会上传到服务器并获取URL
  // 这里为了演示，使用本地文件URL
  const url = URL.createObjectURL(file.raw)
  previewUrls.value.push(url)
  postForm.value.images.push(file.raw)
}

// 移除图片
const removeImage = (index) => {
  previewUrls.value.splice(index, 1)
  postForm.value.images.splice(index, 1)
}

// 提交评测
const submitPost = () => {
  if (!postForm.value.content.trim()) {
    ElMessage.warning('请输入评测内容')
    return
  }
  
  if (!postForm.value.brand) {
    ElMessage.warning('请选择手机品牌')
    return
  }
  
  if (!postForm.value.model) {
    ElMessage.warning('请选择手机型号')
    return
  }
  
  // 这里应该发送数据到服务器
  // 模拟提交
  ElMessage.success('评测发布成功！')
  router.push('/')
}
</script>

<style scoped>
.review-post-container {
  width: 100%;
}

.post-card {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}

.post-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.post-header h3 {
  margin: 0;
  font-size: 18px;
}

.upload-area {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.upload-preview {
  width: 100px;
  height: 100px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-preview {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-half {
  flex: 1;
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
</style> 