<template>
  <div class="phone-model-management-container">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 品牌管理标签页 -->
      <el-tab-pane label="品牌管理" name="brand">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">
              <span>品牌列表</span>
              <div class="header-operations">
                <el-input
                  v-model="brandSearchKeyword"
                  placeholder="搜索品牌名称"
                  clearable
                  @keyup.enter="handleBrandSearch"
                  style="width: 250px; margin-right: 15px;"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
                <el-button type="primary" @click="handleAddBrand">
                  <el-icon><Plus /></el-icon>新增品牌
                </el-button>
              </div>
            </div>
          </template>
          
          <!-- 品牌表格 -->
          <el-table
            v-loading="brandLoading"
            :data="brandList"
            border
            style="width: 100%"
            row-key="id"
          >
            <el-table-column type="index" width="60" align="center" label="序号" />
            <el-table-column prop="id" label="品牌ID" width="80" />
            <el-table-column label="品牌Logo" width="120" align="center">
              <template #default="scope">
                <el-image 
                  style="width: 80px; height: 40px" 
                  :src="scope.row.logo" 
                  fit="contain"
                  :preview-src-list="[scope.row.logo]"
                />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="品牌名称" min-width="120" />
            <el-table-column prop="nameEn" label="英文名称" min-width="120" />
            <el-table-column prop="country" label="所属国家" width="120" />
            <el-table-column prop="createTime" label="创建时间" width="160" />
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="(val) => handleBrandStatusChange(scope.row, val)"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="230" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="handleEditBrand(scope.row)">编辑</el-button>
                <el-button size="small" type="primary" @click="handleManageModels(scope.row)">型号管理</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDeleteBrand(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 品牌分页 -->
          <div class="pagination-container">
            <el-pagination
              background
              v-model:current-page="brandCurrentPage"
              v-model:page-size="brandPageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="brandTotal"
              @size-change="handleBrandSizeChange"
              @current-change="handleBrandCurrentChange"
            />
          </div>
        </el-card>
      </el-tab-pane>
      
      <!-- 型号管理标签页 -->
      <el-tab-pane label="型号管理" name="model">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <span>手机型号列表</span>
                <el-select 
                  v-model="modelFilterBrandId" 
                  placeholder="选择品牌过滤" 
                  clearable 
                  style="margin-left: 15px; width: 200px"
                  @change="handleModelBrandFilter"
                >
                  <el-option 
                    v-for="brand in brandOptions" 
                    :key="brand.id" 
                    :label="brand.name" 
                    :value="brand.id" 
                  />
                </el-select>
              </div>
              <div class="header-operations">
                <el-input
                  v-model="modelSearchKeyword"
                  placeholder="搜索型号名称/特性"
                  clearable
                  @keyup.enter="handleModelSearch"
                  style="width: 250px; margin-right: 15px;"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
                <el-button type="primary" @click="handleAddModel">
                  <el-icon><Plus /></el-icon>新增型号
                </el-button>
              </div>
            </div>
          </template>
          
          <!-- 型号表格 -->
          <el-table
            v-loading="modelLoading"
            :data="modelList"
            border
            style="width: 100%"
            row-key="id"
          >
            <el-table-column type="index" width="60" align="center" label="序号" />
            <el-table-column prop="id" label="型号ID" width="80" />
            <el-table-column label="手机图片" width="120" align="center">
              <template #default="scope">
                <el-image 
                  style="width: 60px; height: 60px" 
                  :src="scope.row.image" 
                  fit="cover"
                  :preview-src-list="[scope.row.image]"
                />
              </template>
            </el-table-column>
            <el-table-column label="所属品牌" width="120">
              <template #default="scope">
                <div class="brand-info">
                  <el-image 
                    style="width: 60px; height: 30px" 
                    :src="scope.row.brand.logo" 
                    fit="contain"
                  />
                  <span>{{ scope.row.brand.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="型号名称" min-width="150" />
            <el-table-column prop="release" label="发布日期" width="120" />
            <el-table-column prop="price" label="参考价格" width="120">
              <template #default="scope">
                ¥{{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="(val) => handleModelStatusChange(scope.row, val)"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="handleEditModel(scope.row)">编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDeleteModel(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 型号分页 -->
          <div class="pagination-container">
            <el-pagination
              background
              v-model:current-page="modelCurrentPage"
              v-model:page-size="modelPageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="modelTotal"
              @size-change="handleModelSizeChange"
              @current-change="handleModelCurrentChange"
            />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 品牌编辑/新增对话框 -->
    <el-dialog
      v-model="brandDialogVisible"
      :title="isEditBrand ? '编辑品牌' : '新增品牌'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="brandFormRef"
        :model="brandForm"
        :rules="brandFormRules"
        label-width="80px"
      >
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="brandForm.name" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="英文名称" prop="nameEn">
          <el-input v-model="brandForm.nameEn" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="所属国家" prop="country">
          <el-select v-model="brandForm.country" placeholder="请选择国家" style="width: 100%">
            <el-option label="中国" value="中国" />
            <el-option label="美国" value="美国" />
            <el-option label="韩国" value="韩国" />
            <el-option label="日本" value="日本" />
            <el-option label="芬兰" value="芬兰" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌Logo" prop="logo">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleBrandLogoChange"
          >
            <img v-if="brandForm.logo" :src="brandForm.logo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议上传品牌Logo，尺寸比例为 2:1</div>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="brandForm.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入品牌描述（可选）"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="brandForm.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="brandDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBrandForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 型号编辑/新增对话框 -->
    <el-dialog
      v-model="modelDialogVisible"
      :title="isEditModel ? '编辑型号' : '新增型号'"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="modelFormRef"
        :model="modelForm"
        :rules="modelFormRules"
        label-width="100px"
      >
        <el-divider content-position="center">基本信息</el-divider>
        
        <el-form-item label="所属品牌" prop="brandId">
          <el-select v-model="modelForm.brandId" placeholder="请选择品牌" filterable>
            <el-option 
              v-for="brand in brandOptions" 
              :key="brand.id" 
              :label="brand.name" 
              :value="brand.id" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="型号名称" prop="name">
          <el-input v-model="modelForm.name" placeholder="请输入型号名称" />
        </el-form-item>
        
        <div class="form-row">
          <el-form-item label="发布日期" prop="release" class="form-col">
            <el-date-picker
              v-model="modelForm.release"
              type="date"
              placeholder="选择发布日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="参考价格" prop="price" class="form-col">
            <el-input-number v-model="modelForm.price" :min="0" :step="100" controls-position="right" />
          </el-form-item>
        </div>
        
        <el-form-item label="型号图片" prop="image">
          <el-upload
            class="avatar-uploader"
            action="/upload/image"
            :show-file-list="false"
            :on-success="(res) => modelForm.image = res.data.url"
            :before-upload="beforeUpload"
          >
            <img v-if="modelForm.image" :src="modelForm.image" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="型号描述" prop="description">
          <el-input 
            v-model="modelForm.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入型号描述信息"
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="modelForm.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="modelDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitModelForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import adminApi from '@/api/modules/admin'

// 标签页
const activeTab = ref('brand')

// 品牌表格相关
const brandList = ref([])

// 品牌选项
const brandOptions = computed(() => {
  return brandList.value.filter(brand => brand.status === 1).map(brand => ({
    id: brand.id,
    name: brand.name
  }))
})

const brandLoading = ref(false)
const brandCurrentPage = ref(1)
const brandPageSize = ref(10)
const brandTotal = ref(0)
const brandSearchKeyword = ref('')

// 型号表格相关
const modelList = ref([])

const modelLoading = ref(false)
const modelCurrentPage = ref(1)
const modelPageSize = ref(10)
const modelTotal = ref(0)
const modelSearchKeyword = ref('')
const modelFilterBrandId = ref('')

// 对话框相关状态
const brandDialogVisible = ref(false)
const isEditBrand = ref(false)
const brandFormRef = ref(null)
const brandForm = reactive({
  id: '',
  name: '',
  nameEn: '',
  country: '中国',
  logo: '',
  description: '',
  status: 1
})

// 品牌表单验证规则
const brandFormRules = {
  name: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  nameEn: [
    { required: true, message: '请输入英文名称', trigger: 'blur' },
    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
  ],
  country: [
    { required: true, message: '请选择所属国家', trigger: 'change' }
  ]
}

// 型号对话框相关状态
const modelDialogVisible = ref(false)
const isEditModel = ref(false)
const modelFormRef = ref(null)
const modelForm = reactive({
  id: '',
  brandId: '',
  name: '',
  release: '',
  price: 0,
  image: '',
  description: '',
  status: 1
})

// 型号表单验证规则
const modelFormRules = {
  brandId: [
    { required: true, message: '请选择所属品牌', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入型号名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  release: [
    { required: true, message: '请选择发布日期', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入参考价格', trigger: 'blur' }
  ]
}

// 初始化数据
onMounted(() => {
  fetchBrands()
  fetchModels()
})

// 获取品牌列表
const fetchBrands = async () => {
  brandLoading.value = true
  try {
    const response = await adminApi.getBrandList()
    
    if (response && response.records) {
      brandList.value = response.records.map(brand => ({
        ...brand,
        logo: brand.logo || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // 设置默认logo
        status: brand.status !== undefined ? brand.status : 1  // 确保状态字段存在，默认启用
      }))
      brandTotal.value = response.total || 0
    } else if (Array.isArray(response)) {
      // 处理直接返回数组的情况
      brandList.value = response.map(brand => ({
        ...brand,
        logo: brand.logo || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // 设置默认logo
        status: brand.status !== undefined ? brand.status : 1  // 确保状态字段存在，默认启用
      }))
      brandTotal.value = response.length
    } else {
      brandList.value = []
      brandTotal.value = 0
    }
  } catch (error) {
    console.error('获取品牌列表失败:', error)
    ElMessage.error('获取品牌列表失败')
    brandList.value = []
    brandTotal.value = 0
  } finally {
    brandLoading.value = false
  }
}

// 获取型号列表
const fetchModels = async () => {
  modelLoading.value = true
  try {
    const response = await adminApi.getPhoneModelList({
      page: modelCurrentPage.value,
      pageSize: modelPageSize.value,
      keyword: modelSearchKeyword.value,
      brandId: modelFilterBrandId.value
    })
    
    if (response && response.records) {
      // 确保每个型号都有品牌信息和状态字段
      modelList.value = response.records.map(model => ({
        ...model,
        status: model.status !== undefined ? model.status : 1,  // 确保状态字段存在，默认启用
        image: model.image || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // 设置默认图片
        brand: model.brand || {
          id: model.brandId,
          name: model.brandName || '未知品牌',
          logo: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        }
      }))
      modelTotal.value = response.total || 0
    } else {
      modelList.value = []
      modelTotal.value = 0
    }
  } catch (error) {
    console.error('获取手机型号列表失败:', error)
    ElMessage.error('获取手机型号列表失败')
    modelList.value = []
    modelTotal.value = 0
  } finally {
    modelLoading.value = false
  }
}

// 品牌相关方法

// 品牌搜索
const handleBrandSearch = () => {
  brandCurrentPage.value = 1
  fetchBrands()
}

// 品牌分页
const handleBrandSizeChange = (size) => {
  brandPageSize.value = size
  brandCurrentPage.value = 1
  fetchBrands()
}

const handleBrandCurrentChange = (page) => {
  brandCurrentPage.value = page
  fetchBrands()
}

// 品牌状态变更
const handleBrandStatusChange = async (row, status) => {
  try {
    // 通过API更新品牌状态
    const response = await adminApi.updateBrandStatus(row.id, status)
    
    if (response) {
      ElMessage.success(`已${status === 1 ? '启用' : '禁用'}品牌: ${row.name}`)
    }
  } catch (error) {
    console.error('更新品牌状态失败:', error)
    row.status = status === 1 ? 0 : 1 // 恢复状态
    ElMessage.error('更新品牌状态失败')
  }
}

// 添加品牌
const handleAddBrand = () => {
  isEditBrand.value = false
  // 重置表单
  Object.assign(brandForm, {
    id: '',
    name: '',
    nameEn: '',
    country: '中国',
    logo: '',
    description: '',
    status: 1
  })
  brandDialogVisible.value = true
}

// 编辑品牌
const handleEditBrand = (row) => {
  isEditBrand.value = true
  // 填充表单数据
  Object.assign(brandForm, { ...row })
  brandDialogVisible.value = true
}

// 直接进入型号管理（并过滤指定品牌）
const handleManageModels = (row) => {
  activeTab.value = 'model'
  modelFilterBrandId.value = row.id
  fetchModels()
}

// 删除品牌
const handleDeleteBrand = (row) => {
  ElMessageBox.confirm(
    `确认删除品牌 "${row.name}" 吗? 删除后其关联的所有型号也将被删除。`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 通过API删除品牌
      const response = await adminApi.deleteBrand(row.id)
      
      if (response) {
        ElMessage.success('删除成功')
        fetchBrands() // 刷新列表
      }
    } catch (error) {
      console.error('删除品牌失败:', error)
      ElMessage.error('删除品牌失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 品牌Logo变更
const handleBrandLogoChange = (file) => {
  // 在实际应用中，应该上传图片到服务器并获取URL
  brandForm.logo = URL.createObjectURL(file.raw)
}

// 提交品牌表单
const submitBrandForm = () => {
  brandFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    try {
      let response;
      
      if (isEditBrand.value) {
        response = await adminApi.updateBrand(brandForm.id, brandForm)
      } else {
        response = await adminApi.createBrand(brandForm)
      }
      
      if (response) {
        ElMessage.success(isEditBrand.value ? '编辑成功' : '添加成功')
        brandDialogVisible.value = false
        fetchBrands() // 刷新列表
      }
    } catch (error) {
      console.error('保存品牌失败:', error)
      ElMessage.error('保存品牌失败')
    }
  })
}

// 型号相关方法

// 型号搜索
const handleModelSearch = () => {
  modelCurrentPage.value = 1
  fetchModels()
}

// 型号品牌过滤
const handleModelBrandFilter = () => {
  modelCurrentPage.value = 1
  fetchModels()
}

// 型号分页
const handleModelSizeChange = (size) => {
  modelPageSize.value = size
  modelCurrentPage.value = 1
  fetchModels()
}

const handleModelCurrentChange = (page) => {
  modelCurrentPage.value = page
  fetchModels()
}

// 型号状态变更
const handleModelStatusChange = async (row, status) => {
  try {
    // 通过API更新型号状态
    const response = await adminApi.updatePhoneModel(row.id, {
      ...row,
      status: status
    })
    
    if (response) {
      ElMessage.success(`已${status === 1 ? '启用' : '禁用'}型号: ${row.name}`)
    }
  } catch (error) {
    console.error('更新型号状态失败:', error)
    row.status = status === 1 ? 0 : 1 // 恢复状态
    ElMessage.error('更新型号状态失败')
  }
}

// 添加型号
const handleAddModel = () => {
  isEditModel.value = false
  // 重置表单
  Object.assign(modelForm, {
    id: '',
    brandId: modelFilterBrandId.value || '', // 如果有选中的品牌，则预填充
    name: '',
    release: '',
    price: 0,
    image: '',
    description: '',
    status: 1
  })
  modelDialogVisible.value = true
}

// 编辑型号
const handleEditModel = (row) => {
  isEditModel.value = true
  // 填充表单数据
  Object.assign(modelForm, {
    ...row,
    brandId: row.brandId
  })
  modelDialogVisible.value = true
}

// 删除型号
const handleDeleteModel = (row) => {
  ElMessageBox.confirm(
    `确认删除型号 "${row.name}" 吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 通过API删除型号
      const response = await adminApi.deletePhoneModel(row.id)
      
      if (response) {
        ElMessage.success('删除成功')
        fetchModels() // 刷新列表
      }
    } catch (error) {
      console.error('删除型号失败:', error)
      ElMessage.error('删除型号失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 型号图片变更
const handleModelImageChange = (file) => {
  // 在实际应用中，应该上传图片到服务器并获取URL
  modelForm.image = URL.createObjectURL(file.raw)
}

// 提交型号表单
const submitModelForm = () => {
  modelFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    try {
      let response;
      
      if (isEditModel.value) {
        response = await adminApi.updatePhoneModel(modelForm.id, modelForm)
      } else {
        response = await adminApi.createPhoneModel(modelForm)
      }
      
      if (response) {
        ElMessage.success(isEditModel.value ? '编辑成功' : '添加成功')
        modelDialogVisible.value = false
        fetchModels() // 刷新列表
      }
    } catch (error) {
      console.error('保存型号失败:', error)
      ElMessage.error('保存型号失败')
    }
  })
}
</script>

<style scoped>
.phone-model-management-container {
  padding: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
}

.header-operations {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.brand-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 50px;
  display: block;
  object-fit: contain;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.model-image {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-col {
  flex: 1;
}
</style> 