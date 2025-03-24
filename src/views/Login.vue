<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h2>智能手机评测论坛</h2>
      </div>
      <div class="login-form">
        <h3>用户登录</h3>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
        >
          <el-form-item label="用户名/邮箱" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名或邮箱"
              prefix-icon="User"
              :disabled="userStore.loading"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
              :disabled="userStore.loading"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <div class="form-options">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            <el-link type="primary" :underline="false" @click="$router.push('/forgot-password')">忘记密码?</el-link>
          </div>
          <el-button
            type="primary"
            class="login-button"
            :loading="userStore.loading"
            @click="handleLogin"
          >
            登录
          </el-button>
          <div class="register-link">
            还没有账号? <el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
          </div>
        </el-form>
        <div class="login-divider">
          <span>其他登录方式</span>
        </div>
        <div class="social-login">
          <el-button circle>
            <el-icon><HomeFilled /></el-icon>
          </el-button>
          <el-button circle>
            <el-icon><Location /></el-icon>
          </el-button>
          <el-button circle>
            <el-icon><Iphone /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
    <div class="login-footer">
      <p>© {{ new Date().getFullYear() }} 智能手机评测论坛. 保留所有权利.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, HomeFilled, Location, Iphone } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { createRules, validateUsername } from '@/utils/validate'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loginFormRef = ref(null)
const rememberMe = ref(false)

// 登录表单
const loginForm = ref({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = createRules({
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ]
})

// 处理登录
const handleLogin = () => {
  loginFormRef.value.validate(async valid => {
    if (!valid) return
    
    // 使用store的login方法
    const success = await userStore.login(loginForm.value)
    
    if (success) {
      // 如果记住我，可以在本地存储一个标记
      localStorage.setItem('rememberMe', rememberMe.value)
      
      // 如果有重定向地址，则跳转到该地址；否则跳转到首页
      const redirectPath = route.query.redirect || '/'
      router.push(redirectPath)
    }
  })
}

// 初始化方法
onMounted(() => {
  // 如果之前选择了记住我，则从localStorage中获取用户名
  if (localStorage.getItem('rememberMe') === 'true') {
    rememberMe.value = true
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.username) {
      loginForm.value.username = user.username
    }
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-box {
  width: 420px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-header {
  padding: 30px 0;
  text-align: center;
  background-color: #f5f7fa;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.login-form {
  padding: 30px;
}

.login-form h3 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
  font-size: 1.5rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  margin-bottom: 20px;
  height: 45px;
  font-size: 16px;
}

.register-link {
  text-align: center;
  margin-bottom: 20px;
}

.login-divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #999;
  font-size: 14px;
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #eee;
}

.login-divider span {
  padding: 0 15px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.login-footer {
  margin-top: 20px;
  color: #999;
  font-size: 12px;
}

@media (max-width: 480px) {
  .login-box {
    width: 90%;
    max-width: 360px;
  }
}
</style> 