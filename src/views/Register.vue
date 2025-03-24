<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h2>智能手机评测论坛</h2>
      </div>
      <div class="register-form">
        <h3>用户注册</h3>
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-position="top"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请设置用户名，6-20个字符"
              prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱地址"
              prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请设置密码，不少于8个字符"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <div class="form-agreement">
            <el-checkbox v-model="agreeTerms">我已阅读并同意</el-checkbox>
            <el-link type="primary" @click="showTerms">《用户协议》</el-link>和
            <el-link type="primary" @click="showPrivacy">《隐私政策》</el-link>
          </div>
          
          <el-button
            type="primary"
            class="register-button"
            :loading="loading"
            :disabled="!agreeTerms"
            @click="handleRegister"
          >
            注册账号
          </el-button>
          
          <div class="login-link">
            已有账号? <el-link type="primary" @click="$router.push('/login')">返回登录</el-link>
          </div>
        </el-form>
      </div>
    </div>
    <div class="register-footer">
      <p>© {{ new Date().getFullYear() }} 智能手机评测论坛. 保留所有权利.</p>
    </div>
    
    <!-- 用户协议对话框 -->
    <el-dialog v-model="termsDialogVisible" title="用户协议" width="60%">
      <div class="terms-content">
        <h4>智能手机评测论坛用户协议</h4>
        <p>欢迎使用智能手机评测论坛！请您仔细阅读以下条款，使用本网站表示您已经接受了以下所有条款。</p>
        
        <h5>1. 账号注册与安全</h5>
        <p>1.1 用户在注册时应提供真实、准确、完整的个人资料，并及时更新。</p>
        <p>1.2 用户应妥善保管账号密码，因用户保管不善造成的损失由用户自行承担。</p>
        <p>1.3 用户不得将账号借给他人使用或用于任何非法目的。</p>
        
        <h5>2. 内容发布规范</h5>
        <p>2.1 用户在本站发布的内容应遵守国家法律法规。</p>
        <p>2.2 用户不得发布色情、暴力、歧视、诽谤、侮辱等违法或不良信息。</p>
        <p>2.3 用户应尊重他人知识产权，不得未经授权转载或抄袭他人作品。</p>
        
        <h5>3. 免责声明</h5>
        <p>3.1 本站不对用户发布的内容真实性负责。</p>
        <p>3.2 本站保留删除违规内容和终止违规用户使用权的权利。</p>
        <p>3.3 因不可抗力导致的服务中断或数据丢失，本站不承担责任。</p>
      </div>
    </el-dialog>
    
    <!-- 隐私政策对话框 -->
    <el-dialog v-model="privacyDialogVisible" title="隐私政策" width="60%">
      <div class="privacy-content">
        <h4>智能手机评测论坛隐私政策</h4>
        <p>本隐私政策描述了我们如何收集、使用和保护您的个人信息。请您仔细阅读。</p>
        
        <h5>1. 信息收集</h5>
        <p>1.1 我们收集的信息包括您提供的注册信息、浏览记录、设备信息等。</p>
        <p>1.2 我们仅收集为提供服务所必需的信息。</p>
        
        <h5>2. 信息使用</h5>
        <p>2.1 我们使用收集的信息来提供、维护和改进我们的服务。</p>
        <p>2.2 我们可能会使用您的信息向您发送服务通知或推荐内容。</p>
        
        <h5>3. 信息保护</h5>
        <p>3.1 我们采取多种安全措施保护您的个人信息。</p>
        <p>3.2 我们不会将您的个人信息出售给第三方。</p>
        <p>3.3 我们可能会根据法律要求披露您的信息。</p>
        
        <h5>4. Cookie使用</h5>
        <p>4.1 我们使用Cookie来改善用户体验和网站功能。</p>
        <p>4.2 您可以通过浏览器设置拒绝Cookie，但这可能影响某些功能的使用。</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Message, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const registerFormRef = ref(null)
const loading = ref(false)
const agreeTerms = ref(false)
const termsDialogVisible = ref(false)
const privacyDialogVisible = ref(false)

// 注册表单
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 表单验证规则
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (value.length < 8) {
      callback(new Error('密码不能少于8个字符'))
    }
    if (registerForm.value.confirmPassword !== '') {
      registerFormRef.value.validateField('confirmPassword')
    }
    callback()
  }
}

const validateConfirmPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const validateEmail = (rule, value, callback) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (value === '') {
    callback(new Error('请输入邮箱地址'))
  } else if (!emailRegex.test(value)) {
    callback(new Error('请输入有效的邮箱地址'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 20, message: '用户名长度为6-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPass, trigger: 'blur' }
  ]
}

// 处理注册
const handleRegister = () => {
  if (!agreeTerms.value) {
    ElMessage.warning('请先阅读并同意用户协议和隐私政策')
    return
  }
  
  registerFormRef.value.validate(valid => {
    if (!valid) return
    
    loading.value = true
    
    // 模拟注册API调用
    setTimeout(() => {
      // 模拟成功注册
      const userInfo = {
        id: Math.floor(Math.random() * 1000) + 1,
        username: registerForm.value.username,
        email: registerForm.value.email,
        avatar: 'https://via.placeholder.com/100',
        role: registerForm.value.username.includes('admin') ? 'admin' : 'user', // 如果用户名包含"admin"，就赋予管理员角色
        token: 'mock-token-' + Math.random().toString(36).substr(2)
      }
      
      // 将用户信息保存到localStorage
      localStorage.setItem('user', JSON.stringify(userInfo))
      
      // 显示注册成功提示
      ElMessage.success('注册成功，正在为您跳转...')
      
      loading.value = false
      
      // 跳转到首页
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }, 1500)
  })
}

// 显示用户协议
const showTerms = () => {
  termsDialogVisible.value = true
}

// 显示隐私政策
const showPrivacy = () => {
  privacyDialogVisible.value = true
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 0;
}

.register-box {
  width: 450px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.register-header {
  padding: 30px 0;
  text-align: center;
  background-color: #f5f7fa;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.register-form {
  padding: 30px;
}

.register-form h3 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
  font-size: 1.5rem;
}

.form-agreement {
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.register-button {
  width: 100%;
  margin-bottom: 20px;
  height: 45px;
  font-size: 16px;
}

.login-link {
  text-align: center;
  margin-bottom: 10px;
}

.register-footer {
  margin-top: 20px;
  color: #999;
  font-size: 12px;
}

.terms-content, .privacy-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 0 10px;
}

.terms-content h4, .privacy-content h4 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
}

.terms-content h5, .privacy-content h5 {
  margin-top: 20px;
  margin-bottom: 10px;
}

.terms-content p, .privacy-content p {
  margin-bottom: 10px;
  line-height: 1.5;
}

@media (max-width: 480px) {
  .register-box {
    width: 90%;
    max-width: 400px;
  }
}
</style> 