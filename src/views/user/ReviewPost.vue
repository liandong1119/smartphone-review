<template>
  <div class="review-post-container">
    <div class="container">
      <div class="post-header">
        <h1>发布手机评测</h1>
        <p class="subtitle">分享您的使用体验和评测见解</p>
      </div>

      <el-form
        :model="postForm"
        :rules="rules"
        ref="postFormRef"
        label-position="top"
        class="post-form"
      >
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>

          <el-form-item label="评测标题" prop="title">
            <el-input v-model="postForm.title" placeholder="请输入评测标题" />
          </el-form-item>

          <div class="form-row">
            <el-form-item label="手机品牌" prop="brandId" class="brand-select">
              <el-select
                v-model="postForm.brandId"
                placeholder="请选择品牌"
                filterable
                :loading="loading"
              >
                <el-option
                  v-for="brand in brands"
                  :key="brand.id"
                  :label="brand.name"
                  :value="brand.id"
                >
                  <div class="brand-option">
                    <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
                    <span>{{ brand.name }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="手机型号" prop="phoneModelId" class="model-select">
              <el-select
                v-model="postForm.phoneModelId"
                placeholder="请选择型号"
                filterable
                :loading="modelLoading"
                :disabled="!postForm.brandId"
              >
                <el-empty v-if="phoneModels.length === 0 && !modelLoading" description="暂无型号" />
                <el-option
                  v-for="model in phoneModels"
                  :key="model.id"
                  :label="model.name"
                  :value="model.id"
                >
                  <div class="model-option">
                    <img :src="model.image" :alt="model.name" class="model-image" />
                    <div class="model-info">
                      <span class="model-name">{{ model.name }}</span>
                      <span class="model-price">¥{{ model.price }}</span>
                    </div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="综合评分" prop="rating">
              <div class="auto-rating-container">
                <el-rate
                  v-model="calculatedRating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value} 分"
                />
                <div class="auto-rating-note">（评分由下方详细评分自动计算得出）</div>
              </div>
            </el-form-item>
          </div>
        </el-card>

        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <span>详细评测</span>
            </div>
          </template>

          <el-form-item label="上传图片" prop="images">
            <el-upload
              v-model:file-list="fileList"
              action="/upload"
              list-type="picture-card"
              :limit="9"
              :auto-upload="false"
              :on-change="handleChange"
            >
              <el-icon><Plus /></el-icon>
              <template #file="{ file }">
                <div class="upload-item">
                  <img class="upload-image" :src="file.url" alt="" />
                  <div class="upload-actions">
                    <el-icon class="upload-delete" @click.stop="handleRemove(file)"><Delete /></el-icon>
                  </div>
                </div>
              </template>
            </el-upload>
            <div class="upload-tip">上传评测时的实拍图片，最多9张</div>
          </el-form-item>

          <el-form-item label="评测内容" prop="content">
            <el-input
              v-model="postForm.content"
              type="textarea"
              :rows="8"
              placeholder="分享您对这款手机的使用体验、优缺点分析等"
            />
          </el-form-item>

          <div class="detail-ratings">
            <div class="rating-title">详细评分</div>
            <div class="ratings-grid">
              <el-form-item label="外观设计" prop="appearanceRating">
                <el-rate v-model="postForm.appearanceRating" />
              </el-form-item>
              <el-form-item label="屏幕显示" prop="screenRating">
                <el-rate v-model="postForm.screenRating" />
              </el-form-item>
              <el-form-item label="性能体验" prop="performanceRating">
                <el-rate v-model="postForm.performanceRating" />
              </el-form-item>
              <el-form-item label="拍照效果" prop="cameraRating">
                <el-rate v-model="postForm.cameraRating" />
              </el-form-item>
              <el-form-item label="电池续航" prop="batteryRating">
                <el-rate v-model="postForm.batteryRating" />
              </el-form-item>
              <el-form-item label="系统体验" prop="systemRating">
                <el-rate v-model="postForm.systemRating" />
              </el-form-item>
            </div>
          </div>
        </el-card>

        <div class="form-actions">
          <el-button type="primary" @click="submitReview" :loading="submitting">发布评测</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import instance from '@/utils/http'

// 表单数据
const postFormRef = ref(null)
const postForm = ref({
  title: '',
  brandId: '',
  phoneModelId: '',
  rating: 0,
  content: '',
  images: [],
  appearanceRating: 0,
  screenRating: 0,
  performanceRating: 0,
    cameraRating: 0,
  batteryRating: 0,
  systemRating: 0
})

// 品牌和型号数据
const brands = ref([])
const phoneModels = ref([])
const loading = ref(false)
const modelLoading = ref(false)
const submitting = ref(false)
const fileList = ref([])

// 评分配置
const colors = ['#99A9BF', '#F7BA2A', '#FF9900']
const texts = ['失望', '一般', '满意', '推荐', '超赞']

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入评测标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度应在5到100个字符之间', trigger: 'blur' }
  ],
  brandId: [
    { required: true, message: '请选择手机品牌', trigger: 'change' }
  ],
  phoneModelId: [
    { required: true, message: '请选择手机型号', trigger: 'change' }
  ],
  rating: [
    { required: true, type: 'number', min: 1, message: '请对手机进行综合评分', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入评测内容', trigger: 'blur' },
    { min: 50, message: '评测内容至少需要50个字符', trigger: 'blur' }
  ]
}

// 获取所有品牌
const fetchBrands = async () => {
  brandsLoading.value = true
  try {
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
    brandsLoading.value = false
  }
}

// 根据品牌ID获取手机型号
const fetchPhoneModels = async (brandId) => {
  modelsLoading.value = true
  try {
    const response = await instance.get(`/brands/${brandId}/models`)
    
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
      console.error(`无法识别的型号数据格式 (品牌ID: ${brandId}):`, response)
      phoneModels.value = []
      ElMessage.warning('获取型号数据格式异常')
    }
    
    console.log('处理后的型号数据:', phoneModels.value)
  } catch (error) {
    console.error('获取手机型号失败:', error)
    ElMessage.error('获取手机型号失败: ' + (error.message || '未知错误'))
    phoneModels.value = []
  } finally {
    modelsLoading.value = false
  }
}

// 监听品牌变化
watch(() => postForm.value.brandId, (newValue) => {
  postForm.value.phoneModelId = ''
  if (newValue) {
    fetchPhoneModels(newValue)
  }
})

// 图片上传处理
const handleChange = (file) => {
  // 这里可以添加图片预览逻辑
  postForm.value.images = fileList.value.map(file => file.url)
}

const handleRemove = (file) => {
  const index = fileList.value.indexOf(file)
  if (index !== -1) {
    fileList.value.splice(index, 1)
  }
  postForm.value.images = fileList.value.map(file => file.url)
}

// 自动计算综合评分
const calculatedRating = computed(() => {
  const {
    appearanceRating,
    screenRating,
    performanceRating,
    cameraRating,
    batteryRating,
    systemRating
  } = postForm.value;
  
  // 计算有效评分项的数量
  const validRatings = [
    appearanceRating,
    screenRating,
    performanceRating,
    cameraRating,
    batteryRating,
    systemRating
  ].filter(rating => rating > 0).length;
  
  // 计算总评分
  const totalRating = (
    appearanceRating +
    screenRating +
    performanceRating +
    cameraRating +
    batteryRating +
    systemRating
  );
  
  // 如果没有有效评分，返回0
  if (validRatings === 0) return 0;
  
  // 计算平均分，保留一位小数
  const avgRating = parseFloat((totalRating / validRatings).toFixed(1));
  
  // 自动更新表单中的rating字段
  postForm.value.rating = avgRating;
  
  return avgRating;
});

// 提交评测
const submitReview = () => {
  postFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.warning('请完善表单信息')
      return
    }

    if (fileList.value.length === 0) {
      ElMessageBox.confirm('您还没有上传任何图片，确定要继续发布吗？', '提示', {
        confirmButtonText: '继续发布',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveReview()
      }).catch(() => {})
    } else {
      saveReview()
    }
  })
}

const saveReview = async () => {
  submitting.value = true
  try {
    // 模拟上传成功
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里实现真实的API调用
    // const response = await instance.post('/posts', postForm.value)
    
    ElMessage.success('评测发布成功！')
    resetForm()
  } catch (error) {
    console.error('评测发布失败:', error)
    ElMessage.error('评测发布失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  postFormRef.value.resetFields()
  fileList.value = []
  postForm.value = {
    title: '',
    brandId: '',
    phoneModelId: '',
    rating: 0,
    content: '',
    images: [],
    appearanceRating: 0,
    screenRating: 0,
    performanceRating: 0,
    cameraRating: 0,
    batteryRating: 0,
    systemRating: 0
  }
}

// 初始化
onMounted(() => {
  fetchBrands()
})
</script>

<style scoped>
.review-post-container {
  padding: 20px 0;
}

.post-header {
  text-align: center;
  margin-bottom: 30px;
}

.post-header h1 {
  margin-bottom: 10px;
  font-size: 28px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.post-form {
  max-width: 900px;
  margin: 0 auto;
}

.form-card {
  margin-bottom: 30px;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.brand-select,
.model-select {
  flex: 1;
}

.upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 8px;
}

.upload-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.upload-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-actions {
  position: absolute;
  top: 5px;
  right: 5px;
}

.upload-delete {
  color: #f56c6c;
  font-size: 18px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 4px;
}

.detail-ratings {
  margin-top: 20px;
}

.rating-title {
  font-weight: bold;
  margin-bottom: 15px;
}

.ratings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.brand-option,
.model-option {
  display: flex;
  align-items: center;
}

.brand-logo {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  object-fit: contain;
}

.model-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-right: 10px;
  background-color: #f8f8f8;
}

.model-info {
  display: flex;
  flex-direction: column;
}

.model-name {
  font-size: 14px;
}

.model-price {
  font-size: 12px;
  color: #f56c6c;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .ratings-grid {
    grid-template-columns: 1fr;
  }
}

.auto-rating-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.auto-rating-note {
  font-size: 12px;
  color: #909399;
}
</style> 