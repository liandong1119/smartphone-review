<template>
  <div class="user-center">
    <el-row :gutter="20">
      <!-- 左侧用户信息卡片 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="6">
        <el-card class="user-info-card">
          <div class="user-avatar-container">
            <el-avatar :size="100" :src="userInfo.avatar"></el-avatar>
            <h2 class="username">{{ userInfo.username }}</h2>
            <p class="user-email">{{ userInfo.email }}</p>
            <el-tag v-if="userInfo.role === 'admin'" type="danger">管理员</el-tag>
            <el-tag v-else>普通用户</el-tag>
          </div>
          
          <el-divider />
          
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">{{ userStats.reviewCount }}</div>
              <div class="stat-label">已发布</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userStats.likeCount }}</div>
              <div class="stat-label">获赞</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userStats.viewCount }}</div>
              <div class="stat-label">阅读量</div>
            </div>
          </div>
          
          <div class="action-buttons">
            <el-button type="primary" @click="editProfile">编辑资料</el-button>
            <el-button @click="goToPost">发布评测</el-button>
          </div>
        </el-card>
      </el-col>
      
      <!-- 右侧内容区域 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="18">
        <el-card class="content-card">
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="我的评测" name="reviews">
              <div class="empty-placeholder" v-if="userReviews.length === 0">
                <el-empty description="暂无评测内容" />
                <el-button type="primary" @click="goToPost">发布第一篇评测</el-button>
              </div>
              
              <el-table
                v-else
                :data="userReviews"
                style="width: 100%"
                @row-click="viewReview"
                class="review-table"
              >
                <el-table-column label="标题" min-width="220">
                  <template #default="scope">
                    <div class="review-title-cell">
                      <div class="review-title">{{ scope.row.title }}</div>
                      <el-tag size="small" v-if="scope.row.status === 'draft'">草稿</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="publishTime" label="发布时间" width="180" sortable />
                <el-table-column prop="viewCount" label="阅读量" width="100" sortable />
                <el-table-column prop="likeCount" label="点赞数" width="100" sortable />
                <el-table-column prop="commentCount" label="评论数" width="100" sortable />
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="scope">
                    <el-button 
                      size="small" 
                      type="primary" 
                      @click.stop="editReview(scope.row)"
                    >
                      编辑
                    </el-button>
                    <el-button 
                      size="small" 
                      type="danger" 
                      @click.stop="deleteReview(scope.row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <div class="pagination-container" v-if="userReviews.length > 0">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[5, 10, 20]"
                  background
                  layout="total, sizes, prev, pager, next"
                  :total="totalItems"
                />
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="我的评论" name="comments">
              <div class="empty-placeholder" v-if="userComments.length === 0">
                <el-empty description="暂无评论内容" />
              </div>
              
              <div v-else class="comment-list">
                <div v-for="comment in userComments" :key="comment.id" class="comment-item">
                  <div class="comment-header">
                    <div class="comment-meta">
                      <span class="comment-review" @click="viewComment(comment)" style="cursor: pointer; color: #409EFF;">《{{ comment.reviewTitle }}》</span>
                      <span class="comment-time">{{ comment.commentTime }}</span>
                    </div>
                    <div class="comment-actions">
                      <el-button size="small" type="text" @click="editComment(comment)">
                        <el-icon><EditPen /></el-icon>
                      </el-button>
                      <el-button size="small" type="text" @click="deleteComment(comment)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                  <div class="comment-content">{{ comment.content }}</div>
                </div>
                
                <div class="pagination-container">
                  <el-pagination
                    v-model:current-page="commentPage"
                    v-model:page-size="commentPageSize"
                    :page-sizes="[5, 10, 20]"
                    background
                    layout="total, sizes, prev, pager, next"
                    :total="totalComments"
                  />
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="我的收藏" name="favorites">
              <div class="empty-placeholder" v-if="userFavorites.length === 0">
                <el-empty description="暂无收藏内容" />
              </div>
              
              <el-row v-else :gutter="20" class="favorites-grid">
                <el-col :xs="24" :sm="12" :md="8" v-for="item in userFavorites" :key="item.id">
                  <el-card class="favorite-card" shadow="hover" @click="viewReview(item)">
                    <img :src="item.cover" class="favorite-image" />
                    <div class="favorite-info">
                      <div class="favorite-title">{{ item.title }}</div>
                      <div class="favorite-meta">
                        <span>{{ item.author }}</span>
                        <span>{{ item.collectTime }}</span>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              
              <div class="pagination-container" v-if="userFavorites.length > 0">
                <el-pagination
                  v-model:current-page="favoritePage"
                  v-model:page-size="favoritePageSize"
                  :page-sizes="[6, 12, 24]"
                  background
                  layout="total, sizes, prev, pager, next"
                  :total="totalFavorites"
                />
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="收藏手机" name="favorite-phones">
              <div class="empty-placeholder" v-if="favoritePhones.length === 0">
                <el-empty description="暂无收藏的手机型号" />
              </div>
              
              <el-row v-else :gutter="20" class="favorites-grid">
                <el-col :xs="24" :sm="12" :md="8" v-for="phone in favoritePhones" :key="phone.id">
                  <el-card class="favorite-phone-card" shadow="hover" @click="viewPhone(phone.id)">
                    <img :src="phone.image" class="favorite-phone-image" />
                    <div class="favorite-phone-info">
                      <div class="favorite-phone-title">{{ phone.name }}</div>
                      <div class="favorite-phone-brand">{{ phone.brand.name }}</div>
                      <div class="favorite-phone-price">¥{{ phone.price }}</div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              
              <div class="pagination-container" v-if="favoritePhones.length > 0">
                <el-pagination
                  v-model:current-page="favoritePhonePage"
                  v-model:page-size="favoritePhonePageSize"
                  :page-sizes="[6, 12, 24]"
                  background
                  layout="total, sizes, prev, pager, next"
                  :total="totalFavoritePhones"
                />
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="账户安全" name="security">
              <div class="security-section">
                <h3 class="section-title">账户安全</h3>
                
                <div class="security-item">
                  <div class="security-item-info">
                    <div class="security-item-title">
                      <el-icon><Lock /></el-icon>
                      <span>登录密码</span>
                    </div>
                    <div class="security-item-desc">用于登录账户，建议定期更换</div>
                  </div>
                  <div class="security-item-action">
                    <el-button type="primary" @click="openChangePasswordDialog">修改</el-button>
                  </div>
                </div>
                
                <div class="security-item">
                  <div class="security-item-info">
                    <div class="security-item-title">
                      <el-icon><Message /></el-icon>
                      <span>绑定邮箱</span>
                    </div>
                    <div class="security-item-desc">{{ userInfo.email || '未绑定邮箱' }}</div>
                  </div>
                  <div class="security-item-action">
                    <el-button type="primary" @click="openEmailDialog">{{ userInfo.email ? '修改' : '绑定' }}</el-button>
                  </div>
                </div>
                
                <!-- <div class="security-item">
                  <div class="security-item-info">
                    <div class="security-item-title">
                      <el-icon><Iphone /></el-icon>
                      <span>绑定手机</span>
                    </div>
                    <div class="security-item-desc">{{ userInfo.phone ? hidePhone(userInfo.phone) : '未绑定手机' }}</div>
                  </div>
                  <div class="security-item-action">
                    <el-button type="primary" @click="openPhoneDialog">{{ userInfo.phone ? '修改' : '绑定' }}</el-button>
                  </div>
                </div>
                
                <div class="security-item">
                  <div class="security-item-info">
                    <div class="security-item-title">
                      <el-icon><Connection /></el-icon>
                      <span>第三方账号绑定</span>
                    </div>
                    <div class="security-item-desc">绑定第三方账号，快捷登录</div>
                  </div>
                  <div class="security-item-action" style="display: flex; gap: 10px;">
                    <el-button type="success" :disabled="userInfo.wechatBound" size="small">
                      <el-icon><ChatDotRound /></el-icon>
                      {{ userInfo.wechatBound ? '已绑定' : '绑定微信' }}
                    </el-button>
                    <el-button type="primary" :disabled="userInfo.qqBound" size="small">
                      <el-icon><Connection /></el-icon>
                      {{ userInfo.qqBound ? '已绑定' : '绑定QQ' }}
                    </el-button>
                  </div>
                </div> -->
                
                <div class="security-item">
                  <div class="security-item-info">
                    <div class="security-item-title">
                      <el-icon><Warning /></el-icon>
                      <span>账户注销</span>
                    </div>
                    <div class="security-item-desc danger-text">永久删除账户，无法恢复</div>
                  </div>
                  <div class="security-item-action">
                    <el-button type="danger" @click="handleDeleteAccount">申请注销</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 编辑个人资料对话框 -->
    <el-dialog v-model="profileDialogVisible" title="编辑个人资料" width="500px">
      <el-form :model="profileForm" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="#"
            :http-request="uploadAvatar"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="profileForm.avatarUrl" :src="profileForm.avatarUrl" class="avatar-image" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input
            v-model="profileForm.bio"
            type="textarea"
            rows="4"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="profileDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 修改密码对话框 -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="500px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-position="top">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input 
            v-model="passwordForm.currentPassword" 
            type="password" 
            show-password
            placeholder="请输入当前密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password" 
            show-password
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            show-password
            placeholder="请再次输入新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="changePassword">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 绑定/修改邮箱对话框 -->
    <el-dialog v-model="emailDialogVisible" :title="userInfo.email ? '修改邮箱' : '绑定邮箱'" width="500px">
      <el-form :model="emailForm" :rules="emailRules" ref="emailFormRef" label-position="top">
        <el-form-item label="新邮箱地址" prop="email">
          <el-input v-model="emailForm.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifyCode">
          <div class="verify-code-row">
            <el-input v-model="emailForm.verifyCode" placeholder="请输入验证码" class="verify-code-input"></el-input>
            <el-button 
              :disabled="codeSending || emailCountdown > 0" 
              @click="sendEmailCode" 
              class="send-code-button"
            >
              {{ emailCountdown > 0 ? `重新发送(${emailCountdown}s)` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="emailDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="bindEmail">确认</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 绑定/修改手机对话框 -->
    <!-- <el-dialog v-model="phoneDialogVisible" :title="userInfo.phone ? '修改手机号' : '绑定手机号'" width="500px">
      <el-form :model="phoneForm" :rules="phoneRules" ref="phoneFormRef" label-position="top">
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="phoneForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifyCode">
          <div class="verify-code-row">
            <el-input v-model="phoneForm.verifyCode" placeholder="请输入验证码" class="verify-code-input"></el-input>
            <el-button 
              :disabled="codeSending || phoneCountdown > 0" 
              @click="sendPhoneCode" 
              class="send-code-button"
            >
              {{ phoneCountdown > 0 ? `重新发送(${phoneCountdown}s)` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="phoneDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="bindPhone">确认</el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { EditPen, Delete, Plus, Lock, Message, Iphone, ChatDotRound, Connection, Warning } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createRules, validateEmail, validateMobile, validatePassword, validateConfirmPassword } from '@/utils/validate'
import userApi from '@/api/modules/user'
import phoneApi from '@/api/modules/phone'

const router = useRouter()
const activeTab = ref('reviews')
const profileDialogVisible = ref(false)
const passwordDialogVisible = ref(false)
const emailDialogVisible = ref(false)
const phoneDialogVisible = ref(false)
const submitting = ref(false)
const codeSending = ref(false)
const emailCountdown = ref(0)
const phoneCountdown = ref(0)
const passwordFormRef = ref(null)
const emailFormRef = ref(null)
const phoneFormRef = ref(null)

// 用户信息
const userInfo = ref({
  username: '用户名',
  email: 'user@example.com',
  phone: '13800138000',
  avatar: 'https://via.placeholder.com/100',
  role: 'user',
  bio: '这是一段个人简介',
  wechatBound: false,
  qqBound: false
})

// 用户统计信息
const userStats = ref({
  reviewCount: 5,
  likeCount: 120,
  viewCount: 3560
})

// 个人资料表单
const profileForm = ref({
  username: '',
  avatarUrl: '',
  bio: ''
})

// 评测列表
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const userReviews = ref([])

// 评论列表
const commentPage = ref(1)
const commentPageSize = ref(5)
const totalComments = ref(0)
const userComments = ref([])

// 收藏列表
const favoritePage = ref(1)
const favoritePageSize = ref(6)
const totalFavorites = ref(0)
const userFavorites = ref([])

// 收藏手机型号相关
const favoritePhonePage = ref(1)
const favoritePhonePageSize = ref(6)
const favoritePhones = ref([])
const totalFavoritePhones = ref(0)

// 修改密码表单
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 邮箱表单
const emailForm = ref({
  email: '',
  verifyCode: ''
})

// 手机号表单
const phoneForm = ref({
  phone: '',
  verifyCode: ''
})

// 表单校验规则
const passwordRules = createRules({
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        validateConfirmPassword(passwordForm.value.newPassword)(rule, value, callback)
      }, 
      trigger: 'blur' 
    }
  ]
})

const emailRules = createRules({
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码长度应为6位', trigger: 'blur' }
  ]
})

const phoneRules = createRules({
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码长度应为6位', trigger: 'blur' }
  ]
})

// 切换标签页
const handleTabClick = async (tab) => {
  activeTab.value = tab.props.name;
  
  switch(activeTab.value) {
    case 'reviews':
      currentPage.value = 1;
      await fetchUserReviews();
      break;
    case 'comments':
      commentPage.value = 1;
      await fetchUserComments();
      break;
    case 'favorites':
      favoritePage.value = 1;
      await fetchUserFavorites();
      break;
    case 'favorite-phones':
      await fetchFavoritePhones();
      break;
  }
}

// 获取用户评测列表
const fetchUserReviews = async () => {
  try {
    console.log('开始获取用户评测列表');
    const response = await userApi.getUserReviews({
      page: currentPage.value,
      limit: pageSize.value
    });
    console.log('用户评测API响应:', response);

    if (response && response.records && Array.isArray(response.records)) {
      userReviews.value = response.records;
      totalItems.value = response.total || response.records.length;
      console.log('设置用户评测数据:', userReviews.value);
    } else if (response && Array.isArray(response)) {
      userReviews.value = response;
      totalItems.value = response.length;
    } else if (response && response.data) {
      if (Array.isArray(response.data.records)) {
        userReviews.value = response.data.records;
        totalItems.value = response.data.total || response.data.records.length;
      } else if (Array.isArray(response.data)) {
        userReviews.value = response.data;
        totalItems.value = response.data.length;
      }
    } else {
      userReviews.value = [];
      totalItems.value = 0;
    }
  } catch (error) {
    console.error('获取评测列表失败:', error);
    ElMessage.error('获取评测列表失败');
    userReviews.value = [];
    totalItems.value = 0;
  }
}

// 获取用户评论列表
const fetchUserComments = async () => {
  try {
    console.log('开始获取用户评论列表');
    const response = await userApi.getUserComments({
      page: commentPage.value,
      limit: commentPageSize.value
    });
    console.log('用户评论API响应:', response);

    if (response && response.records && Array.isArray(response.records)) {
      userComments.value = response.records;
      totalComments.value = response.total || response.records.length;
      console.log('设置用户评论数据:', userComments.value);
    } else if (response && Array.isArray(response)) {
      userComments.value = response;
      totalComments.value = response.length;
      console.log('设置用户评论数据(数组形式):', userComments.value);
    } else if (response && response.data) {
      if (Array.isArray(response.data.records)) {
        userComments.value = response.data.records;
        totalComments.value = response.data.total || response.data.records.length;
      } else if (Array.isArray(response.data)) {
        userComments.value = response.data;
        totalComments.value = response.data.length;
      }
      console.log('设置用户评论数据(嵌套形式):', userComments.value);
    } else {
      console.warn('用户评论数据格式不正确:', response);
      userComments.value = [];
      totalComments.value = 0;
    }
  } catch (error) {
    console.error('获取评论列表失败:', error);
    ElMessage.error('获取评论列表失败');
    userComments.value = [];
    totalComments.value = 0;
  }
}

// 获取用户收藏列表
const fetchUserFavorites = async () => {
  try {
    console.log('开始获取用户收藏列表');
    const response = await userApi.getUserFavorites({
      type: 'post'
    });
    console.log('用户收藏API响应:', response);
    
    if (response && Array.isArray(response)) {
      // 直接是数组形式
      userFavorites.value = response;
      totalFavorites.value = response.length;
      console.log('设置用户收藏数据(数组形式):', userFavorites.value);
    } else if (response && response.data && Array.isArray(response.data)) {
      // 是包含data字段的对象
      userFavorites.value = response.data;
      totalFavorites.value = response.data.length;
      console.log('设置用户收藏数据(对象形式):', userFavorites.value);
    } else {
      console.warn('用户收藏数据格式不正确:', response);
      userFavorites.value = [];
      totalFavorites.value = 0;
    }
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    ElMessage.error('获取收藏列表失败');
    userFavorites.value = [];
    totalFavorites.value = 0;
  }
}

// 获取收藏的手机型号
const fetchFavoritePhones = async () => {
  try {
    console.log('开始获取收藏的手机型号');
    
    // 确保清空之前的数据，避免显示旧数据
    favoritePhones.value = [];
    totalFavoritePhones.value = 0;
    
    const response = await phoneApi.getFavoritePhones();
    console.log('收藏手机API响应类型:', typeof response, Array.isArray(response));
    console.log('收藏手机API响应详情:', response);
    
    // 响应处理增强版 - 更健壮的数据处理逻辑
    if (response) {
      if (Array.isArray(response)) {
        // 直接是数组形式
        favoritePhones.value = response;
        console.log('数组响应 - 数据长度:', response.length);
      } else if (typeof response === 'object') {
        if (response.data && Array.isArray(response.data)) {
          // 标准嵌套响应 { data: [...] }
          favoritePhones.value = response.data;
          console.log('对象嵌套数组响应 - 数据长度:', response.data.length);
        } else if (response.code === 200 && response.data) {
          // API风格响应 { code: 200, message: '成功', data: [...] }
          const dataArray = Array.isArray(response.data) ? response.data : [response.data];
          favoritePhones.value = dataArray;
          console.log('API风格响应 - 数据长度:', dataArray.length);
        } else {
          // 响应是对象但没有规范的数据结构，尝试转换为数组
          const dataArray = Object.values(response).filter(item => typeof item === 'object');
          if (dataArray.length > 0) {
            favoritePhones.value = dataArray;
            console.log('非标准对象响应 - 转换后数据长度:', dataArray.length);
          } else {
            console.warn('无法解析的对象响应:', response);
          }
        }
      }
      
      // 更新总数
      totalFavoritePhones.value = favoritePhones.value.length;
      console.log('最终设置的收藏手机数据:', favoritePhones.value);
      
      // 如果依然没有数据，尝试使用本地存储的备用数据
      if (favoritePhones.value.length === 0) {
        console.warn('API返回了空数据，将使用默认收藏手机数据');
        // 可以添加一些默认数据，但我们已经修改了mock API确保返回数据
      }
    } else {
      console.warn('收藏手机API响应为空');
    }
  } catch (error) {
    console.error('获取收藏的手机型号失败:', error);
    ElMessage.error('获取收藏的手机型号失败，将使用缓存数据');
    
    // 错误处理 - 可以尝试从localStorage读取缓存的收藏
    try {
      const cachedFavorites = localStorage.getItem('favoritePhones');
      if (cachedFavorites) {
        const favoriteIds = JSON.parse(cachedFavorites);
        console.log('从缓存读取收藏ID:', favoriteIds);
        // 这里可以添加逻辑根据ID获取手机详情
      }
    } catch (cacheError) {
      console.error('读取缓存收藏数据失败:', cacheError);
    }
  }
}

// 查看评测详情
const viewReview = (review) => {
  if (review.status === 'draft') {
    editReview(review)
  } else {
    router.push(`/review/${review.id}`)
  }
}

// 编辑评测
const editReview = (review) => {
  router.push(`/post?id=${review.id}`)
}

// 删除评测
const deleteReview = (review) => {
  ElMessageBox.confirm(
    `确定要删除评测"${review.title}"吗？此操作不可恢复。`,
    '警告',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟删除操作
    userReviews.value = userReviews.value.filter(item => item.id !== review.id)
    totalItems.value -= 1
    ElMessage.success('评测已删除')
  }).catch(() => {
    // 取消操作
  })
}

// 编辑评论
const editComment = (comment) => {
  ElMessageBox.prompt('编辑评论内容', '编辑评论', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: comment.content,
    inputType: 'textarea'
  }).then(({ value }) => {
    // 模拟更新评论
    const index = userComments.value.findIndex(item => item.id === comment.id)
    if (index !== -1) {
      userComments.value[index].content = value
      ElMessage.success('评论已更新')
    }
  }).catch(() => {
    // 取消操作
  })
}

// 删除评论
const deleteComment = (comment) => {
  ElMessageBox.confirm(
    '确定要删除这条评论吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟删除操作
    userComments.value = userComments.value.filter(item => item.id !== comment.id)
    totalComments.value -= 1
    ElMessage.success('评论已删除')
  }).catch(() => {
    // 取消操作
  })
}

// 编辑个人资料
const editProfile = () => {
  profileForm.value = {
    username: userInfo.value.username,
    avatarUrl: userInfo.value.avatar,
    bio: userInfo.value.bio
  }
  profileDialogVisible.value = true
}

// 保存个人资料
const saveProfile = () => {
  // 模拟保存操作
  userInfo.value.username = profileForm.value.username
  userInfo.value.avatar = profileForm.value.avatarUrl
  userInfo.value.bio = profileForm.value.bio
  
  ElMessage.success('个人资料已更新')
  profileDialogVisible.value = false
}

// 头像上传相关
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('头像必须是图片格式!')
  }
  
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过2MB!')
  }
  
  return isImage && isLt2M
}

const uploadAvatar = (options) => {
  // 模拟上传
  const reader = new FileReader()
  reader.readAsDataURL(options.file)
  reader.onload = () => {
    profileForm.value.avatarUrl = reader.result
    options.onSuccess()
  }
}

// 前往发布评测页面
const goToPost = () => {
  router.push('/post')
}

// 打开修改密码对话框
const openChangePasswordDialog = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordDialogVisible.value = true
}

// 修改密码
const changePassword = () => {
  if (!passwordFormRef.value) return
  
  passwordFormRef.value.validate(async valid => {
    if (!valid) return
    
    try {
      submitting.value = true
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      ElMessage.success('密码修改成功')
      passwordDialogVisible.value = false
    } catch (error) {
      console.error('Failed to change password:', error)
      ElMessage.error('密码修改失败，请稍后重试')
    } finally {
      submitting.value = false
    }
  })
}

// 打开邮箱绑定/修改对话框
const openEmailDialog = () => {
  emailForm.value = {
    email: userInfo.value.email || '',
    verifyCode: ''
  }
  emailDialogVisible.value = true
}

// 发送邮箱验证码
const sendEmailCode = async () => {
  if (!emailForm.value.email) {
    ElMessage.warning('请先输入邮箱地址')
    return
  }
  
  if (!validateEmail) {
    ElMessage.warning('请输入正确的邮箱格式')
    return
  }
  
  try {
    codeSending.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 发送成功后开始倒计时
    emailCountdown.value = 60
    const timer = setInterval(() => {
      emailCountdown.value--
      if (emailCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    ElMessage.success('验证码已发送到您的邮箱，请注意查收')
  } catch (error) {
    console.error('Failed to send verification code:', error)
    ElMessage.error('发送验证码失败，请稍后重试')
  } finally {
    codeSending.value = false
  }
}

// 绑定/修改邮箱
const bindEmail = () => {
  if (!emailFormRef.value) return
  
  emailFormRef.value.validate(async valid => {
    if (!valid) return
    
    try {
      submitting.value = true
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 更新本地用户信息
      userInfo.value.email = emailForm.value.email
      
      ElMessage.success('邮箱' + (userInfo.value.email ? '修改' : '绑定') + '成功')
      emailDialogVisible.value = false
    } catch (error) {
      console.error('Failed to bind email:', error)
      ElMessage.error('操作失败，请稍后重试')
    } finally {
      submitting.value = false
    }
  })
}

// 打开手机号绑定/修改对话框
const openPhoneDialog = () => {
  phoneForm.value = {
    phone: userInfo.value.phone || '',
    verifyCode: ''
  }
  phoneDialogVisible.value = true
}

// 发送手机验证码
const sendPhoneCode = async () => {
  if (!phoneForm.value.phone) {
    ElMessage.warning('请先输入手机号码')
    return
  }
  
  if (!validateMobile) {
    ElMessage.warning('请输入正确的手机号格式')
    return
  }
  
  try {
    codeSending.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 发送成功后开始倒计时
    phoneCountdown.value = 60
    const timer = setInterval(() => {
      phoneCountdown.value--
      if (phoneCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    ElMessage.success('验证码已发送到您的手机，请注意查收')
  } catch (error) {
    console.error('Failed to send verification code:', error)
    ElMessage.error('发送验证码失败，请稍后重试')
  } finally {
    codeSending.value = false
  }
}

// 绑定/修改手机号
const bindPhone = () => {
  if (!phoneFormRef.value) return
  
  phoneFormRef.value.validate(async valid => {
    if (!valid) return
    
    try {
      submitting.value = true
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 更新本地用户信息
      userInfo.value.phone = phoneForm.value.phone
      
      ElMessage.success('手机号' + (userInfo.value.phone ? '修改' : '绑定') + '成功')
      phoneDialogVisible.value = false
    } catch (error) {
      console.error('Failed to bind phone:', error)
      ElMessage.error('操作失败，请稍后重试')
    } finally {
      submitting.value = false
    }
  })
}

// 处理账号注销
const handleDeleteAccount = () => {
  ElMessageBox.confirm(
    '您确定要申请注销账号吗？此操作将永久删除您的账户数据，且无法恢复。',
    '危险操作',
    {
      confirmButtonText: '确认注销',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(() => {
    // 二次确认
    ElMessageBox.confirm(
      '请再次确认您的操作。注销后，所有个人数据将被清除且无法恢复。',
      '最终确认',
      {
        confirmButtonText: '确认注销',
        cancelButtonText: '放弃',
        type: 'danger'
      }
    ).then(() => {
      // 模拟注销操作
      ElMessage({
        type: 'success',
        message: '您的注销申请已提交，系统将在3个工作日内处理'
      })
    }).catch(() => {})
  }).catch(() => {})
}

// 隐藏部分手机号
const hidePhone = (phone) => {
  if (!phone || phone.length < 11) return phone
  return phone.substr(0, 3) + '****' + phone.substr(7)
}

// 跳转到手机详情页
const viewPhone = (phoneId) => {
  router.push(`/phone/${phoneId}`)
}

// 查看评论对应的评测
const viewComment = (comment) => {
  if (comment.detailUrl) {
    router.push(comment.detailUrl);
  } else if (comment.postId) {
    router.push(`/review/${comment.postId}`);
  }
}

// 监听评测分页参数变化
watch([currentPage, pageSize], () => {
  if (activeTab.value === 'reviews') {
    fetchUserReviews();
  }
});

// 监听评论分页参数变化
watch([commentPage, commentPageSize], () => {
  if (activeTab.value === 'comments') {
    fetchUserComments();
  }
});

// 监听收藏分页参数变化
watch([favoritePage, favoritePageSize], () => {
  if (activeTab.value === 'favorites') {
    fetchUserFavorites();
  }
});

// 监听收藏手机分页参数变化
watch([favoritePhonePage, favoritePhonePageSize], () => {
  if (activeTab.value === 'favorite-phones') {
    fetchFavoritePhones();
  }
});

// 在组件加载时初始化数据
onMounted(async () => {
  // 获取用户数据
  try {
    const response = await userApi.getUserInfo();
    console.log('用户信息:', response);
    if (response) {
      const userData = response;
      userInfo.value = userData;
      userInfo.value.avatar = userData.avatar || 'https://via.placeholder.com/100';
      userInfo.value.role = userData.role || 'user';
      
      // 设置用户ID到localStorage，以便API可以检查登录状态
      if (userData.id) {
        localStorage.setItem('userId', userData.id);
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    ElMessage.error('获取用户信息失败');
  }
  
  // 获取用户评测列表
  fetchUserReviews();
  
  // 获取用户评论列表
  fetchUserComments();
  
  // 获取用户收藏列表
  fetchUserFavorites();
  
  // 获取用户收藏的手机列表
  fetchFavoritePhones();
});
</script>

<style scoped>
.user-center {
  padding-bottom: 40px;
}

.user-info-card {
  margin-bottom: 20px;
}

.user-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.username {
  margin: 15px 0 5px;
  font-size: 18px;
}

.user-email {
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0 10px;
}

.content-card {
  min-height: 500px;
}

.empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.empty-placeholder .el-button {
  margin-top: 20px;
}

.review-table {
  cursor: pointer;
}

.review-title-cell {
  display: flex;
  align-items: center;
}

.review-title {
  margin-right: 10px;
  flex: 1;
}

.comment-list {
  padding: 10px 0;
}

.comment-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-meta {
  font-size: 14px;
}

.comment-review {
  font-weight: bold;
  margin-right: 10px;
}

.comment-time {
  color: #909399;
}

.comment-content {
  line-height: 1.6;
  color: #606266;
}

.favorites-grid {
  margin-bottom: 20px;
}

.favorite-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.favorite-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.favorite-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.favorite-info {
  padding: 10px 0;
}

.favorite-title {
  font-weight: 500;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favorite-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 12px;
}

/* 收藏手机样式 */
.favorite-phone-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}

.favorite-phone-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.favorite-phone-image {
  width: 100%;
  height: 180px;
  object-fit: contain;
  background-color: #f8f8f8;
}

.favorite-phone-info {
  padding: 15px 10px;
}

.favorite-phone-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favorite-phone-brand {
  color: #606266;
  font-size: 14px;
  margin-bottom: 5px;
}

.favorite-phone-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 500;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.security-section {
  padding: 10px 0;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.security-item:last-child {
  border-bottom: none;
}

.security-item-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.security-item-desc {
  color: #909399;
  font-size: 14px;
}

.danger-text {
  color: #F56C6C;
}

.verify-code-row {
  display: flex;
  gap: 10px;
}

.verify-code-input {
  flex: 1;
}

.send-code-button {
  min-width: 120px;
}

@media (max-width: 768px) {
  .user-stats {
    margin: 10px 0;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .content-card {
    margin-top: 0;
  }
  
  .security-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .security-item-action {
    margin-top: 10px;
    width: 100%;
  }
  
  .verify-code-row {
    flex-direction: column;
  }
  
  .send-code-button {
    width: 100%;
    margin-top: 10px;
  }
}
</style> 