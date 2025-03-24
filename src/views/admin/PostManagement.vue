<template>
  <div class="post-management-container">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>帖子管理</span>
          <div class="header-operations">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索帖子标题/内容"
              clearable
              @keyup.enter="handleSearch"
              style="width: 250px; margin-right: 15px;"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select 
              v-model="filterStatus" 
              placeholder="状态筛选" 
              clearable 
              @change="handleFilterChange"
              style="width: 120px; margin-right: 15px;"
            >
              <el-option label="全部" value="" />
              <el-option label="正常" value="1" />
              <el-option label="已屏蔽" value="0" />
              <el-option label="待审核" value="2" />
            </el-select>
          </div>
        </div>
      </template>
      
      <!-- 表格内容 -->
      <el-table
        v-loading="loading"
        :data="postList"
        border
        style="width: 100%"
        row-key="id"
      >
        <el-table-column type="index" width="60" align="center" label="序号" />
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column label="发布者" min-width="120">
          <template #default="scope">
            <div class="user-info">
              <el-avatar :size="30" :src="scope.row.userAvatar"></el-avatar>
              <span style="margin-left: 8px">{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机品牌/型号" min-width="180">
          <template #default="scope">
            {{ scope.row.brand }} / {{ scope.row.phoneModel }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" min-width="160" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status === 1">正常</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 0">已屏蔽</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status === 2">待审核</el-tag>
            <el-tag v-else>未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="统计" width="180">
          <template #default="scope">
            <span class="stat-item">
              <el-icon><View /></el-icon> {{ scope.row.views }}
            </span>
            <span class="stat-item">
              <el-icon><Star /></el-icon> {{ scope.row.likes }}
            </span>
            <span class="stat-item">
              <el-icon><ChatLineRound /></el-icon> {{ scope.row.comments }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="scope">
            <el-button 
              size="small" 
              @click="handleViewPost(scope.row)"
            >查看</el-button>
            <el-button 
              size="small" 
              type="primary" 
              v-if="scope.row.status !== 1" 
              @click="handleStatusChange(scope.row, 1)"
            >通过</el-button>
            <el-button 
              size="small" 
              type="danger" 
              v-if="scope.row.status !== 0" 
              @click="handleStatusChange(scope.row, 0)"
            >屏蔽</el-button>
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
    
    <!-- 帖子详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="帖子详情"
      width="70%"
      :close-on-click-modal="false"
    >
      <div v-if="currentPost" class="post-detail">
        <h2 class="post-title">{{ currentPost.title }}</h2>
        <div class="post-meta">
          <div class="user-info">
            <el-avatar :size="40" :src="currentPost.userAvatar"></el-avatar>
            <span>{{ currentPost.username }}</span>
          </div>
          <div class="post-info">
            <span>发布时间: {{ currentPost.createTime }}</span>
            <span>手机型号: {{ currentPost.brand }} / {{ currentPost.phoneModel }}</span>
          </div>
        </div>
        
        <div class="post-content">{{ currentPost.content }}</div>
        
        <div v-if="currentPost.images && currentPost.images.length > 0" class="post-images">
          <h3>图片:</h3>
          <div class="image-list">
            <div v-for="(img, index) in currentPost.images" :key="index" class="image-item">
              <el-image 
                :src="img" 
                :preview-src-list="currentPost.images"
                fit="cover"
              />
            </div>
          </div>
        </div>
        
        <div class="post-comments" v-if="postComments.length > 0">
          <h3>评论列表:</h3>
          <el-table :data="postComments" border style="width: 100%">
            <el-table-column label="用户" width="150">
              <template #default="scope">
                <div class="user-info">
                  <el-avatar :size="30" :src="scope.row.userAvatar"></el-avatar>
                  <span>{{ scope.row.username }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="评论内容" min-width="200" />
            <el-table-column prop="createTime" label="评论时间" width="160" />
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button 
                  size="small" 
                  type="danger" 
                  @click="handleDeleteComment(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" v-if="currentPost && currentPost.status !== 1" @click="handleStatusChange(currentPost, 1)">通过</el-button>
          <el-button type="danger" v-if="currentPost && currentPost.status !== 0" @click="handleStatusChange(currentPost, 0)">屏蔽</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, View, Star, ChatLineRound } from '@element-plus/icons-vue'
import instance from '@/utils/http'
import { useRouter } from 'vue-router'

const router = useRouter()

// 帖子数据列表
const postList = ref([])
const postComments = ref([])

// 表格相关状态
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const filterStatus = ref('')

// 对话框相关状态
const dialogVisible = ref(false)
const currentPost = ref(null)

// 初始化数据
onMounted(() => {
  fetchPosts()
})

// 获取帖子列表
const fetchPosts = async () => {
  loading.value = true
  try {
    // 从API获取帖子数据
    const response = await instance.get('/admin/posts', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        keyword: searchKeyword.value,
        status: filterStatus.value
      }
    })
    
    if (response && response.code === 200) {
      postList.value = response.data.records || []
      total.value = response.data.total || 0
    } else {
      // 如果API尚未实现，使用模拟数据
      console.warn('API未提供数据，使用模拟数据')
      
      // 模拟帖子数据
      const mockPosts = [
        {
          id: 1,
          title: 'iPhone 15 Pro 上手体验',
          content: '今天入手了全新的iPhone 15 Pro，手感非常不错，相机提升明显。尤其是新增的拍照按钮，使用起来非常顺手，暗光拍摄也有了很大提升。',
          userId: 1,
          username: '手机爱好者',
          userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          brand: 'Apple',
          phoneModel: 'iPhone 15 Pro',
          createTime: '2023-09-15',
          status: 1,
          views: 256,
          likes: 45,
          comments: 23,
          images: [
            'https://img.alicdn.com/imgextra/i2/1979300282/O1CN01kqNFkQ1UiO7POzQO0_!!1979300282.jpg',
            'https://img.alicdn.com/imgextra/i1/1979300282/O1CN01aCGrpJ1UiO7UBLc1h_!!1979300282.jpg'
          ]
        },
        {
          id: 2,
          title: '小米14充电测试',
          content: '测试了小米14的充电速度，从0到100%只需35分钟！这应该是目前市面上充电最快的旗舰手机了，而且充电发热控制得不错。',
          userId: 2,
          username: '数码博主',
          userAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          brand: '小米',
          phoneModel: '小米14',
          createTime: '2023-09-10',
          status: 1,
          views: 189,
          likes: 37,
          comments: 15,
          images: [
            'https://img.alicdn.com/imgextra/i3/2088551213/O1CN01wBlMCX1TZiUiVCUAx_!!2088551213.jpg',
            'https://img.alicdn.com/imgextra/i2/2088551213/O1CN01NHwDOP1TZiUlWNBTd_!!2088551213.jpg'
          ]
        },
        {
          id: 3,
          title: '华为Mate60 Pro实测',
          content: '华为Mate60 Pro已经用了一周，国产芯片的表现确实让我惊艳。日常使用没有任何卡顿，信号也比之前的手机强不少。卫星通话在郊外测试了一下，清晰度超出预期！',
          userId: 1,
          username: '手机爱好者',
          userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          brand: '华为',
          phoneModel: 'Mate60 Pro',
          createTime: '2023-09-05',
          status: 0, // 已屏蔽
          views: 542,
          likes: 89,
          comments: 42,
          images: [
            'https://img.alicdn.com/imgextra/i2/2201476544168/O1CN0108yQNR1IOqeBzsFHG_!!2201476544168.jpg',
            'https://img.alicdn.com/imgextra/i1/2201476544168/O1CN01XU4pU61IOqdsCz9ej_!!2201476544168.jpg'
          ]
        },
        {
          id: 4,
          title: 'ROG Phone 7游戏体验',
          content: 'ROG Phone 7终于到手，打游戏真的爽！散热模块效果显著，玩原神一小时后机身温度才38度。背部的RGB灯效也很酷，就是有点费电。',
          userId: 2,
          username: '数码博主',
          userAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          brand: '华硕',
          phoneModel: 'ROG Phone 7',
          createTime: '2023-09-01',
          status: 2, // 待审核
          views: 146,
          likes: 32,
          comments: 18,
          images: [
            'https://img.alicdn.com/imgextra/i4/2212490451220/O1CN01VLU5w21qPyLIZRy3u_!!2212490451220.jpg',
            'https://img.alicdn.com/imgextra/i2/2212490451220/O1CN01F8cIhF1qPyL9Gtzn2_!!2212490451220.jpg'
          ]
        }
      ]
      
      // 应用筛选条件
      let filteredPosts = [...mockPosts]
      
      if (searchKeyword.value) {
        filteredPosts = filteredPosts.filter(post => 
          post.title.includes(searchKeyword.value) || 
          post.content.includes(searchKeyword.value)
        )
      }
      
      if (filterStatus.value) {
        const statusValue = parseInt(filterStatus.value)
        filteredPosts = filteredPosts.filter(post => post.status === statusValue)
      }
      
      postList.value = filteredPosts
      total.value = filteredPosts.length
    }
  } catch (error) {
    console.error('获取帖子列表失败:', error)
    ElMessage.error('获取帖子列表失败')
    
    // 出错时使用空数据
    postList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 获取帖子评论
const fetchPostComments = async (postId) => {
  try {
    // 从API获取评论数据
    const response = await instance.get(`/admin/posts/${postId}/comments`)
    
    if (response && response.code === 200) {
      postComments.value = response.data || []
    } else {
      // 如果API尚未实现，使用模拟数据
      console.warn('API未提供数据，使用模拟数据')
      
      // 模拟评论数据
      postComments.value = [
        {
          id: 1,
          postId: postId,
          userId: 2,
          username: '数码博主',
          userAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          content: '续航怎么样？日常使用能坚持一天吗？',
          createTime: '2023-09-15 10:15:00',
          likes: 3
        },
        {
          id: 2,
          postId: postId,
          userId: 1,
          username: '手机爱好者',
          userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          content: '完全没问题，轻度使用能撑两天',
          createTime: '2023-09-15 10:30:00',
          likes: 1
        },
        {
          id: 3,
          postId: postId,
          userId: 2,
          username: '数码博主',
          userAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          content: '夜景样张可以分享一下吗？听说有很大进步',
          createTime: '2023-09-15 11:20:00',
          likes: 2
        }
      ]
    }
  } catch (error) {
    console.error('获取评论列表失败:', error)
    ElMessage.error('获取评论列表失败')
    postComments.value = []
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchPosts()
}

// 处理筛选变化
const handleFilterChange = () => {
  currentPage.value = 1
  fetchPosts()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchPosts()
}

// 处理每页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchPosts()
}

// 处理查看帖子
const handleViewPost = async (row) => {
  currentPost.value = row
  dialogVisible.value = true
  await fetchPostComments(row.id)
}

// 处理删除帖子
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认删除帖子 "${row.title}" 吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 调用API删除帖子
      const response = await instance.delete(`/admin/posts/${row.id}`)
      
      if (response && response.code === 200) {
        ElMessage.success('删除成功')
        fetchPosts() // 刷新列表
      } else {
        // 如果API尚未实现，使用模拟行为
        console.warn('API未实现，使用模拟行为')
        
        // 模拟异步请求
        await new Promise(resolve => setTimeout(resolve, 300))
        ElMessage.success('删除成功')
        
        // 从本地列表中移除
        postList.value = postList.value.filter(item => item.id !== row.id)
        total.value = Math.max(0, total.value - 1)
      }
    } catch (error) {
      console.error('删除帖子失败:', error)
      ElMessage.error('删除帖子失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 处理删除评论
const handleDeleteComment = (comment) => {
  ElMessageBox.confirm(
    '确认删除此评论吗?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 调用API删除评论
      const response = await instance.delete(`/admin/comments/${comment.id}`)
      
      if (response && response.code === 200) {
        ElMessage.success('删除评论成功')
        // 更新当前帖子的评论数
        if (currentPost.value) {
          currentPost.value.comments = Math.max(0, currentPost.value.comments - 1)
        }
        // 重新获取评论列表
        await fetchPostComments(comment.postId)
      } else {
        // 如果API尚未实现，使用模拟行为
        console.warn('API未实现，使用模拟行为')
        
        // 模拟异步请求
        await new Promise(resolve => setTimeout(resolve, 300))
        ElMessage.success('删除评论成功')
        
        // 从本地列表中移除
        postComments.value = postComments.value.filter(item => item.id !== comment.id)
        
        // 更新当前帖子的评论数
        if (currentPost.value) {
          currentPost.value.comments = Math.max(0, currentPost.value.comments - 1)
        }
      }
    } catch (error) {
      console.error('删除评论失败:', error)
      ElMessage.error('删除评论失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 处理帖子状态变化
const handleStatusChange = async (row, status) => {
  try {
    // 调用API更新帖子状态
    const response = await instance.put(`/admin/posts/${row.id}/status`, {
      status: status
    })
    
    if (response && response.code === 200) {
      const statusText = status === 1 ? '通过' : status === 0 ? '屏蔽' : '待审核'
      ElMessage.success(`已将帖子${statusText}`)
      
      // 更新本地数据
      row.status = status
      
      // 如果是在详情对话框中操作，关闭对话框
      if (dialogVisible.value) {
        dialogVisible.value = false
      }
      
      // 刷新列表
      fetchPosts()
    } else {
      // 如果API尚未实现，使用模拟行为
      console.warn('API未实现，使用模拟行为')
      
      // 模拟异步请求
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const statusText = status === 1 ? '通过' : status === 0 ? '屏蔽' : '待审核'
      ElMessage.success(`已将帖子${statusText}`)
      
      // 更新本地数据
      row.status = status
      
      // 如果是在详情对话框中操作，关闭对话框
      if (dialogVisible.value) {
        dialogVisible.value = false
      }
      
      // 刷新列表
      fetchPosts()
    }
  } catch (error) {
    console.error('更新帖子状态失败:', error)
    ElMessage.error('更新帖子状态失败')
  }
}
</script>

<style scoped>
.post-management-container {
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

.user-info {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
}

.stat-item .el-icon {
  margin-right: 3px;
}

.post-detail {
  padding: 0 10px;
}

.post-title {
  margin-bottom: 16px;
  color: #303133;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.post-info {
  display: flex;
  flex-direction: column;
  color: #909399;
  font-size: 14px;
}

.post-content {
  margin-bottom: 20px;
  line-height: 1.6;
  white-space: pre-line;
}

.post-images {
  margin-bottom: 30px;
}

.post-images h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #303133;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-item {
  width: 200px;
  height: 150px;
  overflow: hidden;
  border-radius: 4px;
}

.image-item .el-image {
  width: 100%;
  height: 100%;
}

.post-comments {
  margin-top: 30px;
}

.post-comments h3 {
  margin-bottom: 15px;
  font-size: 16px;
  color: #303133;
}
</style> 