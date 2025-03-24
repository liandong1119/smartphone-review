<template>
  <div class="announcement-management-container">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>公告管理</span>
          <div class="header-operations">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索公告标题/内容"
              clearable
              @keyup.enter="handleSearch"
              style="width: 250px; margin-right: 15px;"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleAddAnnouncement">
              <el-icon><Plus /></el-icon>新增公告
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 表格内容 -->
      <el-table
        v-loading="loading"
        :data="announcementList"
        border
        style="width: 100%"
        row-key="id"
      >
        <el-table-column type="index" width="60" align="center" label="序号" />
        <el-table-column prop="title" label="公告标题" min-width="200" show-overflow-tooltip />
        <el-table-column label="公告内容" min-width="250" show-overflow-tooltip>
          <template #default="scope">
            <span v-html="previewContent(scope.row.content)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column prop="publishTime" label="发布时间" width="160">
          <template #default="scope">
            {{ scope.row.publishTime || '未发布' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status === 'published'">已发布</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status === 'draft'">草稿</el-tag>
            <el-tag type="info" v-else-if="scope.row.status === 'scheduled'">定时发布</el-tag>
            <el-tag type="danger" v-else>已过期</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.priority === 'high'" type="danger">高</el-tag>
            <el-tag v-else-if="scope.row.priority === 'medium'" type="warning">中</el-tag>
            <el-tag v-else type="info">低</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button 
              size="small" 
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button 
              size="small" 
              type="success" 
              @click="handlePublish(scope.row)"
              v-if="scope.row.status === 'draft'"
            >发布</el-button>
            <el-button 
              size="small" 
              type="warning" 
              @click="handleUnpublish(scope.row)"
              v-if="scope.row.status === 'published'"
            >下线</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 编辑/新增公告对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑公告' : '新增公告'"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="announcementFormRef"
        :model="announcementForm"
        :rules="announcementFormRules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="announcementForm.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input 
            v-model="announcementForm.content" 
            type="textarea" 
            :rows="8" 
            placeholder="请输入公告内容，支持HTML格式"
          />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="announcementForm.priority" placeholder="请选择优先级">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示位置" prop="position">
          <el-checkbox-group v-model="announcementForm.position">
            <el-checkbox label="home" border>首页</el-checkbox>
            <el-checkbox label="forum" border>论坛页</el-checkbox>
            <el-checkbox label="post" border>文章详情页</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="发布类型" prop="publishType">
          <el-radio-group v-model="announcementForm.publishType">
            <el-radio label="now">立即发布</el-radio>
            <el-radio label="later">定时发布</el-radio>
            <el-radio label="draft">保存为草稿</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布时间" prop="scheduledTime" v-if="announcementForm.publishType === 'later'">
          <el-date-picker
            v-model="announcementForm.scheduledTime"
            type="datetime"
            placeholder="选择发布时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="过期时间" prop="expireTime">
          <el-date-picker
            v-model="announcementForm.expireTime"
            type="datetime"
            placeholder="选择过期时间（可选）"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 预览公告对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="公告预览"
      width="700px"
    >
      <div class="announcement-preview">
        <h2 class="announcement-title">{{ announcementForm.title }}</h2>
        <div class="announcement-info">
          <span>优先级: 
            <el-tag v-if="announcementForm.priority === 'high'" type="danger" size="small">高</el-tag>
            <el-tag v-else-if="announcementForm.priority === 'medium'" type="warning" size="small">中</el-tag>
            <el-tag v-else type="info" size="small">低</el-tag>
          </span>
          <span>发布时间: {{ announcementForm.publishType === 'now' ? '立即发布' : announcementForm.publishType === 'later' ? announcementForm.scheduledTime : '保存为草稿' }}</span>
        </div>
        <div class="announcement-content" v-html="announcementForm.content"></div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="submitAfterPreview">确认发布</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

// 模拟公告数据
const announcementList = ref([
  {
    id: 1,
    title: '系统维护通知',
    content: '<p>尊敬的用户，系统将于<strong>2023年6月15日</strong>凌晨2:00-4:00进行维护升级，期间网站将暂停访问，给您带来不便，敬请谅解。</p>',
    createTime: '2023-06-10 15:30:45',
    publishTime: '2023-06-10 16:00:00',
    status: 'published',
    priority: 'high',
    position: ['home', 'forum', 'post'],
    expireTime: '2023-06-16 00:00:00'
  },
  {
    id: 2,
    title: '新版本功能上线公告',
    content: '<p>我们很高兴地宣布，新版本V2.0已经上线，<em>主要更新了以下功能</em>：</p><ul><li>全新的界面设计</li><li>评论点赞功能</li><li>用户关注系统</li></ul>',
    createTime: '2023-06-12 09:15:22',
    publishTime: null,
    status: 'draft',
    priority: 'medium',
    position: ['home', 'forum'],
    expireTime: null
  },
  {
    id: 3,
    title: '社区行为规范更新',
    content: '<p>为了维护良好的社区氛围，我们更新了<a href="#/rules">社区行为规范</a>，请各位用户遵守，共同营造健康的讨论环境。</p>',
    createTime: '2023-06-05 22:45:10',
    publishTime: '2023-06-06 08:00:00',
    status: 'published',
    priority: 'low',
    position: ['forum'],
    expireTime: '2023-12-31 23:59:59'
  }
])

// 表格相关状态
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const searchKeyword = ref('')

// 对话框相关状态
const dialogVisible = ref(false)
const previewDialogVisible = ref(false)
const isEdit = ref(false)
const announcementFormRef = ref(null)
const announcementForm = reactive({
  id: '',
  title: '',
  content: '',
  priority: 'medium',
  position: ['home'],
  publishType: 'draft',
  scheduledTime: '',
  expireTime: '',
  status: ''
})

// 表单验证规则
const announcementFormRules = {
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ],
  position: [
    { required: true, message: '请选择至少一个显示位置', trigger: 'change' }
  ],
  publishType: [
    { required: true, message: '请选择发布类型', trigger: 'change' }
  ],
  scheduledTime: [
    { 
      required: true, 
      message: '请选择定时发布时间', 
      trigger: 'change',
      validator: (rule, value, callback) => {
        if (announcementForm.publishType === 'later' && !value) {
          callback(new Error('请选择定时发布时间'))
        } else {
          callback()
        }
      }
    }
  ]
}

// 初始化数据
onMounted(() => {
  fetchAnnouncements()
})

// 获取公告列表
const fetchAnnouncements = async () => {
  loading.value = true
  try {
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 实际项目中应从API获取数据
    // const response = await announcementService.getAnnouncements({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   keyword: searchKeyword.value
    // })
    // announcementList.value = response.records
    // total.value = response.total
    
    // 这里简单展示模拟数据
  } catch (error) {
    console.error('获取公告列表失败:', error)
    ElMessage.error('获取公告列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchAnnouncements()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchAnnouncements()
}

// 处理每页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchAnnouncements()
}

// 截取内容预览
const previewContent = (content) => {
  const div = document.createElement('div')
  div.innerHTML = content
  const text = div.textContent || div.innerText || ''
  return text.length > 50 ? text.substring(0, 50) + '...' : text
}

// 处理新增公告
const handleAddAnnouncement = () => {
  isEdit.value = false
  // 重置表单
  Object.assign(announcementForm, {
    id: '',
    title: '',
    content: '',
    priority: 'medium',
    position: ['home'],
    publishType: 'draft',
    scheduledTime: '',
    expireTime: '',
    status: ''
  })
  dialogVisible.value = true
}

// 处理编辑公告
const handleEdit = (row) => {
  isEdit.value = true
  // 填充表单数据
  Object.assign(announcementForm, {
    id: row.id,
    title: row.title,
    content: row.content,
    priority: row.priority,
    position: row.position,
    publishType: row.status === 'published' ? 'now' : row.status === 'scheduled' ? 'later' : 'draft',
    scheduledTime: row.publishTime,
    expireTime: row.expireTime,
    status: row.status
  })
  dialogVisible.value = true
}

// 处理发布公告
const handlePublish = (row) => {
  ElMessageBox.confirm(
    `确认立即发布公告 "${row.title}" 吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(async () => {
    try {
      // 模拟异步请求
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 实际项目中应调用API发布公告
      // await announcementService.publishAnnouncement(row.id)
      
      // 更新本地状态
      const index = announcementList.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        announcementList.value[index].status = 'published'
        announcementList.value[index].publishTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      
      ElMessage.success('公告已发布')
    } catch (error) {
      console.error('发布公告失败:', error)
      ElMessage.error('发布公告失败')
    }
  }).catch(() => {
    // 用户取消发布
  })
}

// 处理下线公告
const handleUnpublish = (row) => {
  ElMessageBox.confirm(
    `确认下线公告 "${row.title}" 吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 模拟异步请求
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 实际项目中应调用API下线公告
      // await announcementService.unpublishAnnouncement(row.id)
      
      // 更新本地状态
      const index = announcementList.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        announcementList.value[index].status = 'draft'
      }
      
      ElMessage.success('公告已下线')
    } catch (error) {
      console.error('下线公告失败:', error)
      ElMessage.error('下线公告失败')
    }
  }).catch(() => {
    // 用户取消下线
  })
}

// 处理删除公告
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认删除公告 "${row.title}" 吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 模拟异步请求
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 实际项目中应调用API删除公告
      // await announcementService.deleteAnnouncement(row.id)
      
      // 更新本地状态
      announcementList.value = announcementList.value.filter(item => item.id !== row.id)
      
      ElMessage.success('删除成功')
    } catch (error) {
      console.error('删除公告失败:', error)
      ElMessage.error('删除公告失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 预览公告
const previewAnnouncement = () => {
  previewDialogVisible.value = true
}

// 提交表单
const submitForm = () => {
  announcementFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    // 先显示预览
    previewDialogVisible.value = true
  })
}

// 预览后确认提交
const submitAfterPreview = async () => {
  try {
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 构建保存数据
    const saveData = {
      ...announcementForm,
      status: announcementForm.publishType === 'now' ? 'published' : 
              announcementForm.publishType === 'later' ? 'scheduled' : 'draft',
      publishTime: announcementForm.publishType === 'now' ? 
                   new Date().toISOString().slice(0, 19).replace('T', ' ') : 
                   announcementForm.publishType === 'later' ? 
                   announcementForm.scheduledTime : null
    }
    
    // 实际项目中应调用API保存公告
    // if (isEdit.value) {
    //   await announcementService.updateAnnouncement(saveData)
    // } else {
    //   await announcementService.createAnnouncement(saveData)
    // }
    
    // 模拟保存成功
    if (isEdit.value) {
      const index = announcementList.value.findIndex(item => item.id === announcementForm.id)
      if (index !== -1) {
        announcementList.value[index] = { ...saveData }
      }
    } else {
      // 模拟生成ID
      const newId = Math.max(...announcementList.value.map(item => item.id)) + 1
      announcementList.value.unshift({
        ...saveData,
        id: newId,
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      })
    }
    
    ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
    dialogVisible.value = false
    previewDialogVisible.value = false
  } catch (error) {
    console.error('保存公告失败:', error)
    ElMessage.error('保存公告失败')
  }
}
</script>

<style scoped>
.announcement-management-container {
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

.header-operations {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.announcement-preview {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
}

.announcement-title {
  text-align: center;
  margin-bottom: 20px;
}

.announcement-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #909399;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.announcement-content {
  line-height: 1.6;
  font-size: 16px;
}

.announcement-content :deep(a) {
  color: #409EFF;
  text-decoration: none;
}

.announcement-content :deep(ul) {
  padding-left: 20px;
}
</style> 