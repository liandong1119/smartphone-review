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
                                <el-icon>
                                    <Search/>
                                </el-icon>
                            </template>
                        </el-input>
                        <el-select
                                v-model="filterStatus"
                                placeholder="状态筛选"
                                clearable
                                @change="handleFilterChange"
                                style="width: 120px; margin-right: 15px;"
                        >
                            <el-option label="全部" value=""/>
                            <el-option label="正常" value="1"/>
                            <el-option label="已屏蔽" value="0"/>
                            <el-option label="待审核" value="2"/>
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
                <el-table-column type="index" width="60" align="center" label="序号"/>
                <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip/>
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
                <el-table-column prop="createTime" label="发布时间" min-width="160"/>
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
              <el-icon><View/></el-icon> {{ scope.row.views }}
            </span>
                        <span class="stat-item">
              <el-icon><Star/></el-icon> {{ scope.row.likes }}
            </span>
                        <span class="stat-item">
              <el-icon><ChatLineRound/></el-icon> {{ scope.row.comments }}
            </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240" fixed="right">
                    <template #default="scope">
                        <el-button
                                size="small"
                                @click="handleViewPost(scope.row)"
                        >查看
                        </el-button>
                        <el-button
                                size="small"
                                type="primary"
                                v-if="scope.row.status !== 1"
                                @click="handleStatusChange(scope.row, 1)"
                        >通过
                        </el-button>
                        <el-button
                                size="small"
                                type="danger"
                                v-if="scope.row.status !== 0"
                                @click="handleStatusChange(scope.row, 0)"
                        >屏蔽
                        </el-button>
                        <el-button
                                size="small"
                                type="danger"
                                @click="handleDelete(scope.row)"
                        >删除
                        </el-button>
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

                <div v-if="currentPost.fileList && currentPost.fileList.length > 0" class="post-images">
                    <h3>图片:</h3>
                    <div class="image-list">
                        <div v-for="(img, index) in currentPost.fileList" :key="index" class="image-item">
                            <el-image
                                    :src="img"
                                    :preview-src-list="currentPost.fileList"
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
                        <el-table-column prop="content" label="评论内容" min-width="200"/>
                        <el-table-column prop="createTime" label="评论时间" width="160"/>
                        <el-table-column label="操作" width="120">
                            <template #default="scope">
                                <el-button
                                        size="small"
                                        type="danger"
                                        @click="handleDeleteComment(scope.row)"
                                >删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" v-if="currentPost && currentPost.status !== 1"
                     @click="handleStatusChange(currentPost, 1)">通过</el-button>
          <el-button type="danger" v-if="currentPost && currentPost.status !== 0"
                     @click="handleStatusChange(currentPost, 0)">屏蔽</el-button>
        </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Search, View, Star, ChatLineRound} from '@element-plus/icons-vue'
import adminApi from '@/api/modules/admin'
import {useRouter} from 'vue-router'

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
        const response = await adminApi.getPostList({
            page: currentPage.value,
            pageSize: pageSize.value,
            keyword: searchKeyword.value,
            status: filterStatus.value
        })
        if (response) {
            postList.value = response.records
            total.value = response.total
        }
    } catch (error) {
        console.error('获取帖子列表失败:', error)
        ElMessage.error('获取帖子列表失败')
    } finally {
        loading.value = false
    }
}

// 获取帖子评论
const fetchComments = async (postId) => {
    try {
        const response = await adminApi.getPostComments(postId)
        if (response) {
            postComments.value = response.records
        }
    } catch (error) {
        console.error('获取评论失败:', error)
        ElMessage.error('获取评论失败')
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
    await fetchComments(row.id)
}

// 处理删除帖子
const handleDelete = async (row) => {
    try {
        await ElMessageBox.confirm('确定要删除该帖子吗?', '提示', {
            type: 'warning'
        })
        const response = await adminApi.deletePost(row.id)
        if (response) {
            ElMessage.success('删除成功')
            fetchPosts()
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除帖子失败:', error)
            ElMessage.error('删除帖子失败')
        }
    }
}

// 处理删除评论
const handleDeleteComment = async (comment) => {
    try {
        await ElMessageBox.confirm('确定要删除该评论吗?', '提示', {
            type: 'warning'
        })
        const response = await adminApi.deleteComment(comment.id)
        if (response) {
            ElMessage.success('删除成功')
            fetchComments(comment.postId)
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除评论失败:', error)
            ElMessage.error('删除评论失败')
        }
    }
}

// 处理帖子状态变化
const handleStatusChange = async (row, status) => {
    try {
        const response = await adminApi.updatePostStatus(row.id, status)
        if (response) {
            ElMessage.success('状态更新成功')

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