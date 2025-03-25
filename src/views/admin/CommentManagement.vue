<template>
  <div class="comment-management-container">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>评论管理</span>
          <div class="header-operations">
            <el-select v-model="statusFilter" placeholder="状态过滤" clearable style="width: 120px; margin-right: 15px;">
              <el-option label="全部" value="" />
              <el-option label="待审核" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已拒绝" value="rejected" />
            </el-select>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索评论内容/用户名"
              clearable
              @keyup.enter="handleSearch"
              style="width: 250px; margin-right: 15px;"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>搜索
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 表格内容 -->
      <el-table
        v-loading="loading"
        :data="commentList"
        border
        style="width: 100%"
        row-key="id"
      >
        <el-table-column type="index" width="60" align="center" label="序号" />
        <el-table-column label="用户信息" width="180">
          <template #default="scope">
            <div class="user-info">
              <el-avatar :size="32" :src="scope.row.user.avatar"></el-avatar>
              <span class="username">{{ scope.row.user.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评论内容" min-width="250" show-overflow-tooltip />
        <el-table-column label="所属文章" min-width="180" show-overflow-tooltip>
          <template #default="scope">
            <el-button link type="primary" @click="viewPost(scope.row.postId)">
              {{ scope.row.postTitle }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="评论时间" width="160" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status === 'approved'">已通过</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status === 'pending'">待审核</el-tag>
            <el-tag type="danger" v-else>已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button 
              size="small" 
              type="success" 
              @click="handleApprove(scope.row)"
              :disabled="scope.row.status === 'approved'"
            >通过</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleReject(scope.row)"
              :disabled="scope.row.status === 'rejected'"
            >拒绝</el-button>
            <el-button 
              size="small" 
              @click="handleViewDetail(scope.row)"
            >详情</el-button>
            <el-button 
              size="small" 
              type="danger" 
              plain
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
    
    <!-- 评论详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="评论详情"
      width="600px"
    >
      <div v-if="currentComment" class="comment-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="评论ID">{{ currentComment.id }}</el-descriptions-item>
          <el-descriptions-item label="用户信息">
            <div class="user-info">
              <el-avatar :size="32" :src="currentComment.user.avatar"></el-avatar>
              <span class="username">{{ currentComment.user.username }}</span>
              <span class="user-email">({{ currentComment.user.email }})</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="所属文章">
            <el-link type="primary" @click="viewPost(currentComment.postId)">
              {{ currentComment.postTitle }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="评论内容">
            <div class="comment-content">{{ currentComment.content }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="评论时间">{{ currentComment.createTime }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag type="success" v-if="currentComment.status === 'approved'">已通过</el-tag>
            <el-tag type="warning" v-else-if="currentComment.status === 'pending'">待审核</el-tag>
            <el-tag type="danger" v-else>已拒绝</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="dialog-actions" v-if="currentComment.status !== 'approved'">
          <el-button type="success" @click="handleApprove(currentComment)">通过此评论</el-button>
        </div>
        <div class="dialog-actions" v-if="currentComment.status !== 'rejected'">
          <el-button type="danger" @click="handleReject(currentComment, true)">拒绝此评论</el-button>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 拒绝评论对话框 -->
    <el-dialog
      v-model="rejectDialogVisible"
      title="拒绝评论"
      width="500px"
    >
      <el-form label-width="100px">
        <el-form-item label="拒绝原因">
          <el-select v-model="rejectReason" placeholder="请选择拒绝原因" style="width: 100%">
            <el-option label="含有广告内容" value="广告内容" />
            <el-option label="含有敏感内容" value="敏感内容" />
            <el-option label="含有攻击性语言" value="攻击性语言" />
            <el-option label="内容与主题无关" value="内容无关" />
            <el-option label="其他原因" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细说明" v-if="rejectReason === 'other'">
          <el-input 
            v-model="rejectDetail" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入详细拒绝原因"
          ></el-input>
        </el-form-item>
        <el-form-item label="通知用户">
          <el-switch v-model="notifyUser" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rejectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmReject">确认拒绝</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import adminApi from '@/api/modules/admin'

// 路由
const router = useRouter()

// 评论数据列表
const commentList = ref([])

// 表格相关状态
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const statusFilter = ref('')

// 对话框相关状态
const dialogVisible = ref(false)
const currentComment = ref(null)
const rejectDialogVisible = ref(false)
const rejectReason = ref('')
const rejectDetail = ref('')
const notifyUser = ref(true)
const commentToReject = ref(null)

// 初始化数据
onMounted(() => {
  fetchComments()
})

// 获取评论列表
const fetchComments = async () => {
  loading.value = true
  try {
    const response = await adminApi.getCommentList({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      status: statusFilter.value
    })
    
    if (response) {
      // 重新格式化数据，确保每条评论都有用户对象
      commentList.value = (response.records || []).map(comment => {
        return {
          ...comment,
          // 确保用户对象的存在
          user: {
            id: comment.userId,
            username: comment.username || '未知用户',
            avatar: comment.userAvatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
            email: comment.email || ''
          },
          // 确保状态属性
          status: comment.status || 'pending'
        }
      })
      total.value = response.total || 0
    }
  } catch (error) {
    console.error('获取评论列表失败:', error)
    ElMessage.error('获取评论列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchComments()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchComments()
}

// 处理每页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchComments()
}

// 查看文章
const viewPost = (postId) => {
  // 在新标签页打开文章详情
  const routeUrl = `/review/${postId}`
  window.open(routeUrl, '_blank')
}

// 查看评论详情
const handleViewDetail = (comment) => {
  currentComment.value = { ...comment }
  dialogVisible.value = true
}

// 通过评论
const handleApprove = async (comment) => {
  try {
    await ElMessageBox.confirm('确定要通过此评论吗?', '提示', {
      type: 'info'
    })
    
    const response = await adminApi.updateCommentStatus(comment.id, 'approved')
    
    if (response) {
      // 更新本地状态
      const index = commentList.value.findIndex(item => item.id === comment.id)
      if (index !== -1) {
        commentList.value[index].status = 'approved'
      }
      
      if (currentComment.value && currentComment.value.id === comment.id) {
        currentComment.value.status = 'approved'
      }
      
      ElMessage.success('评论已通过审核')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

// 拒绝评论
const handleReject = (comment, fromDetail = false) => {
  commentToReject.value = comment
  rejectReason.value = ''
  rejectDetail.value = ''
  notifyUser.value = true
  rejectDialogVisible.value = true
}

// 确认拒绝评论
const confirmReject = async () => {
  if (!rejectReason.value) {
    ElMessage.warning('请选择拒绝原因')
    return
  }
  
  if (rejectReason.value === 'other' && !rejectDetail.value) {
    ElMessage.warning('请输入详细拒绝原因')
    return
  }
  
  try {
    const reason = rejectReason.value === 'other' ? rejectDetail.value : rejectReason.value
    
    const response = await adminApi.updateCommentStatus(commentToReject.value.id, 'rejected', {
      reason: reason,
      notifyUser: notifyUser.value
    })
    
    if (response) {
      // 更新本地状态
      const index = commentList.value.findIndex(item => item.id === commentToReject.value.id)
      if (index !== -1) {
        commentList.value[index].status = 'rejected'
      }
      
      if (currentComment.value && currentComment.value.id === commentToReject.value.id) {
        currentComment.value.status = 'rejected'
      }
      
      ElMessage.success('评论已被拒绝')
      rejectDialogVisible.value = false
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 删除评论
const handleDelete = async (comment) => {
  try {
    await ElMessageBox.confirm('确定要删除此评论吗？删除后将无法恢复!', '警告', {
      type: 'warning'
    })
    
    const response = await adminApi.deleteComment(comment.id)
    
    if (response) {
      ElMessage.success('评论已删除')
      fetchComments() // 重新获取评论列表
      
      // 如果正在查看的评论被删除，关闭对话框
      if (dialogVisible.value && currentComment.value && currentComment.value.id === comment.id) {
        dialogVisible.value = false
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败:', error)
      ElMessage.error('删除评论失败')
    }
  }
}
</script>

<style scoped>
.comment-management-container {
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

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-weight: bold;
}

.user-email {
  color: #909399;
  margin-left: 5px;
}

.comment-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.comment-detail {
  padding: 10px;
}

.dialog-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 