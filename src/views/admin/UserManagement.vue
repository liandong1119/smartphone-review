<template>
  <div class="user-management-container">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <div class="header-operations">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索用户名/邮箱"
              clearable
              @keyup.enter="handleSearch"
              style="width: 250px; margin-right: 15px;"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleAddUser">
              <el-icon><Plus /></el-icon>新增用户
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 表格内容 -->
      <el-table
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%"
        row-key="id"
      >
        <el-table-column type="index" width="60" align="center" label="序号" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column label="头像" width="100" align="center">
          <template #default="scope">
            <el-avatar :size="40" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="120">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.role === 'admin'">管理员</el-tag>
            <el-tag v-else>普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" min-width="160" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="(val) => handleStatusChange(scope.row, val)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column label="禁言状态" width="100">
          <template #default="scope">
            <el-tag type="danger" v-if="scope.row.isMuted">已禁言</el-tag>
            <el-tag type="success" v-else>正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="warning"
              v-if="!scope.row.isMuted"
              @click="handleMuteChange(scope.row, true)"
            >禁言</el-button>
            <el-button
              size="small"
              type="success"
              v-else
              @click="handleMuteChange(scope.row, false)"
            >解除禁言</el-button>
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
    
    <!-- 编辑/添加用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="userForm.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="禁言" prop="isMuted">
          <el-switch
            v-model="userForm.isMuted"
            :active-value="true"
            :inactive-value="false"
            active-text="已禁言"
            inactive-text="正常"
          />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarChange"
          >
            <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import adminApi from '@/api/modules/admin'

// 用户数据列表
const userList = ref([])

// 表格相关状态
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')

// 对话框相关状态
const dialogVisible = ref(false)
const isEdit = ref(false)
const userFormRef = ref(null)
const userForm = reactive({
  id: '',
  username: '',
  email: '',
  password: '',
  role: 'user',
  status: 1,
  isMuted: false,
  avatar: ''
})

// 表单验证规则
const userFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: !isEdit.value, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 初始化数据
onMounted(() => {
  fetchUsers()
})

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await adminApi.getUserList({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    })
    if (response) {
      userList.value = response.records
      total.value = response.total
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchUsers()
}

// 处理每页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchUsers()
}

// 处理状态变化
const handleStatusChange = async (row, status) => {
  try {
    const response = await adminApi.updateUserStatus(row.id, status)
    if (response) {
      ElMessage.success(`已${status === 1 ? '启用' : '禁用'}用户: ${row.username}`)
    }
  } catch (error) {
    console.error('更新用户状态失败:', error)
    row.status = status === 1 ? 0 : 1 // 恢复状态
    ElMessage.error('更新用户状态失败')
  }
}

// 处理新增用户
const handleAddUser = () => {
  isEdit.value = false
  // 重置表单
  Object.assign(userForm, {
    id: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: 1,
    isMuted: false,
    avatar: ''
  })
  dialogVisible.value = true
}

// 处理编辑用户
const handleEdit = (row) => {
  isEdit.value = true
  // 填充表单数据
  Object.assign(userForm, {
    id: row.id,
    username: row.username,
    email: row.email,
    password: '', // 编辑时不需要填充密码
    role: row.role,
    status: row.status,
    isMuted: row.isMuted,
    avatar: row.avatar
  })
  dialogVisible.value = true
}

// 处理删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗?', '提示', {
      type: 'warning'
    })
    const response = await adminApi.deleteUser(row.id)
    if (response) {
      ElMessage.success('删除成功')
      fetchUsers()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败')
    }
  }
}

// 处理头像变化
const handleAvatarChange = async (file) => {
  // 在实际应用中，应该上传图片到服务器并获取URL
  try {
    const formData = new FormData()
    formData.append('file', file.raw)
    
    // 调用上传API
    const response = await adminApi.uploadAvatar(formData)
    
    if (response && response.code === 200) {
      userForm.avatar = response.data.url
    } else {
      // 如果API尚未实现，使用本地预览
      console.warn('上传API未实现，使用本地预览')
      userForm.avatar = URL.createObjectURL(file.raw)
    }
  } catch (error) {
    console.error('上传头像失败:', error)
    ElMessage.error('上传头像失败')
    // 使用本地预览作为回退
    userForm.avatar = URL.createObjectURL(file.raw)
  }
}

// 提交表单
const submitForm = async () => {
  if (!userFormRef.value) return
  
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let response
        if (userForm.value.id) {
          response = await adminApi.updateUser(userForm.value.id, userForm.value)
        } else {
          response = await adminApi.createUser(userForm.value)
        }
        if (response) {
          ElMessage.success(userForm.value.id ? '更新成功' : '创建成功')
          dialogVisible.value = false
          fetchUsers()
        }
      } catch (error) {
        console.error('提交表单失败:', error)
        ElMessage.error('操作失败')
      }
    }
  })
}

// 处理禁言状态变化
const handleMuteChange = async (row, isMuted) => {
  try {
    const response = await adminApi.updateUserMute(row.id, isMuted)
    if (response) {
      ElMessage.success(`已${isMuted ? '禁言' : '解除禁言'}用户: ${row.username}`)
      row.isMuted = isMuted
      fetchUsers()
    }
  } catch (error) {
    console.error('更新用户禁言状态失败:', error)
    ElMessage.error('更新用户禁言状态失败')
  }
}
</script>

<style scoped>
.user-management-container {
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
  height: 100px;
  display: block;
  object-fit: cover;
}
</style> 