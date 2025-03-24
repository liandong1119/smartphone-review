<template>
  <div class="user-management">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h3>用户管理</h3>
          <div class="header-actions">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索用户名/邮箱"
              prefix-icon="Search"
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
              style="width: 250px"
            />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="success" @click="handleExport">导出数据</el-button>
          </div>
        </div>
      </template>
      
      <!-- 用户列表表格 -->
      <el-table
        :data="userTableData"
        style="width: 100%"
        border
        v-loading="loading"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="用户信息" width="250">
          <template #default="scope">
            <div class="user-info-cell">
              <el-avatar :size="40" :src="scope.row.avatar"></el-avatar>
              <div class="user-info-detail">
                <div class="username">{{ scope.row.username }}</div>
                <div class="email">{{ scope.row.email }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" sortable width="180" />
        <el-table-column prop="lastLoginTime" label="最后登录" sortable width="180" />
        <el-table-column prop="articleCount" label="发布文章" width="100" sortable />
        <el-table-column prop="commentCount" label="评论数" width="100" sortable />
        <el-table-column label="账号状态" width="120">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === 1 ? 'success' : scope.row.status === 0 ? 'warning' : 'danger'"
            >
              {{ scope.row.status === 1 ? '正常' : scope.row.status === 0 ? '禁言' : '封禁' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 1"
              type="warning"
              size="small"
              @click="handleStatusChange(scope.row, 0)"
            >
              禁言
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="success"
              size="small"
              @click="handleStatusChange(scope.row, 1)"
            >
              解除禁言
            </el-button>
            <el-button
              v-if="scope.row.status !== -1"
              type="danger"
              size="small"
              @click="handleStatusChange(scope.row, -1)"
            >
              封禁
            </el-button>
            <el-button
              v-if="scope.row.status === -1"
              type="success"
              size="small"
              @click="handleStatusChange(scope.row, 1)"
            >
              解封
            </el-button>
            <el-dropdown trigger="click">
              <el-button size="small" plain>
                更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleViewDetails(scope.row)">查看详情</el-dropdown-item>
                  <el-dropdown-item @click="handleResetPassword(scope.row)">重置密码</el-dropdown-item>
                  <el-dropdown-item @click="handleSetAdmin(scope.row)" v-if="!scope.row.isAdmin">
                    设为管理员
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleRemoveAdmin(scope.row)" v-if="scope.row.isAdmin">
                    取消管理员
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleDeleteUser(scope.row)" divided>
                    <span style="color: #F56C6C">删除用户</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
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
    
    <!-- 用户详情对话框 -->
    <el-dialog v-model="dialogVisible" title="用户详情" width="600px">
      <div class="user-details" v-if="currentUser">
        <div class="user-profile">
          <el-avatar :size="100" :src="currentUser.avatar"></el-avatar>
          <h2>{{ currentUser.username }}</h2>
          <p>{{ currentUser.email }}</p>
          <el-tag type="info" v-if="currentUser.isAdmin">管理员</el-tag>
        </div>
        
        <el-divider />
        
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ currentUser.registerTime }}</el-descriptions-item>
          <el-descriptions-item label="最后登录">{{ currentUser.lastLoginTime }}</el-descriptions-item>
          <el-descriptions-item label="账号状态">
            <el-tag
              :type="currentUser.status === 1 ? 'success' : currentUser.status === 0 ? 'warning' : 'danger'"
            >
              {{ currentUser.status === 1 ? '正常' : currentUser.status === 0 ? '禁言' : '封禁' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        
        <el-divider />
        
        <el-descriptions title="活动信息" :column="2" border>
          <el-descriptions-item label="发布文章">{{ currentUser.articleCount }}篇</el-descriptions-item>
          <el-descriptions-item label="发表评论">{{ currentUser.commentCount }}条</el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ currentUser.lastIp }}</el-descriptions-item>
          <el-descriptions-item label="设备信息">{{ currentUser.deviceInfo }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 用户数据
const userTableData = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 当前选中的用户
const currentUser = ref(null)
const dialogVisible = ref(false)

// 获取用户列表
const fetchUserList = () => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    // 模拟数据
    const mockData = []
    for (let i = 1; i <= 50; i++) {
      mockData.push({
        id: i,
        username: `用户${i}`,
        email: `user${i}@example.com`,
        avatar: `https://via.placeholder.com/40?text=U${i}`,
        registerTime: '2023-0' + (i % 9 + 1) + '-' + (i % 28 + 1),
        lastLoginTime: '2023-09-' + (i % 28 + 1),
        articleCount: Math.floor(Math.random() * 20),
        commentCount: Math.floor(Math.random() * 50),
        status: Math.floor(Math.random() * 3) - 1, // -1封禁，0禁言，1正常
        isAdmin: i === 1, // 第一个用户是管理员
        lastIp: '192.168.1.' + i,
        deviceInfo: i % 2 === 0 ? 'iPhone 14 Pro, iOS 16' : 'Chrome 108, Windows 11'
      })
    }
    
    // 过滤搜索关键词
    const filteredData = searchKeyword.value
      ? mockData.filter(
          user =>
            user.username.includes(searchKeyword.value) ||
            user.email.includes(searchKeyword.value)
        )
      : mockData
    
    total.value = filteredData.length
    
    // 分页处理
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    userTableData.value = filteredData.slice(start, end)
    
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchUserList()
}

// 导出数据
const handleExport = () => {
  ElMessage.success('用户数据导出成功')
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchUserList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchUserList()
}

// 状态变更处理
const handleStatusChange = (user, status) => {
  const statusText = status === 1 ? '正常' : status === 0 ? '禁言' : '封禁'
  ElMessageBox.confirm(
    `确定要将用户 "${user.username}" 的状态改为 "${statusText}" 吗？`,
    '操作确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // 模拟API调用
      setTimeout(() => {
        const index = userTableData.value.findIndex(item => item.id === user.id)
        if (index !== -1) {
          userTableData.value[index].status = status
        }
        ElMessage.success(`已将用户 "${user.username}" 的状态改为 "${statusText}"`)
      }, 300)
    })
    .catch(() => {
      // 取消操作
    })
}

// 查看用户详情
const handleViewDetails = (user) => {
  currentUser.value = { ...user }
  dialogVisible.value = true
}

// 重置密码
const handleResetPassword = (user) => {
  ElMessageBox.confirm(
    `确定要重置用户 "${user.username}" 的密码吗？重置后密码将发送到用户邮箱。`,
    '操作确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      ElMessage.success(`已重置用户 "${user.username}" 的密码，新密码已发送到用户邮箱`)
    })
    .catch(() => {
      // 取消操作
    })
}

// 设置为管理员
const handleSetAdmin = (user) => {
  ElMessageBox.confirm(
    `确定要将用户 "${user.username}" 设置为管理员吗？`,
    '操作确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // 模拟API调用
      setTimeout(() => {
        const index = userTableData.value.findIndex(item => item.id === user.id)
        if (index !== -1) {
          userTableData.value[index].isAdmin = true
        }
        ElMessage.success(`已将用户 "${user.username}" 设置为管理员`)
      }, 300)
    })
    .catch(() => {
      // 取消操作
    })
}

// 取消管理员
const handleRemoveAdmin = (user) => {
  ElMessageBox.confirm(
    `确定要取消用户 "${user.username}" 的管理员权限吗？`,
    '操作确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // 模拟API调用
      setTimeout(() => {
        const index = userTableData.value.findIndex(item => item.id === user.id)
        if (index !== -1) {
          userTableData.value[index].isAdmin = false
        }
        ElMessage.success(`已取消用户 "${user.username}" 的管理员权限`)
      }, 300)
    })
    .catch(() => {
      // 取消操作
    })
}

// 删除用户
const handleDeleteUser = (user) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${user.username}" 吗？此操作不可恢复，用户的所有内容也将被删除。`,
    '危险操作',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'error'
    }
  )
    .then(() => {
      // 模拟API调用
      setTimeout(() => {
        userTableData.value = userTableData.value.filter(item => item.id !== user.id)
        total.value -= 1
        ElMessage.success(`已删除用户 "${user.username}"`)
      }, 300)
    })
    .catch(() => {
      // 取消操作
    })
}

// 初始化
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-management {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.user-info-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info-detail {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
}

.email {
  font-size: 12px;
  color: #909399;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.user-details {
  padding: 10px;
}

.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.user-profile h2 {
  margin: 10px 0 5px;
}

.user-profile p {
  margin: 0 0 10px;
  color: #606266;
}
</style> 