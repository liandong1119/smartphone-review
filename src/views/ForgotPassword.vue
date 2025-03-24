<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <div class="forgot-password-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h2>智能手机评测论坛</h2>
      </div>
      <div class="forgot-password-form">
        <h3>找回密码</h3>
        <el-steps :active="currentStep" finish-status="success" simple style="margin: 20px 0 30px;">
          <el-step title="验证身份" />
          <el-step title="设置新密码" />
          <el-step title="完成" />
        </el-steps>
        
        <!-- 步骤1：验证身份 -->
        <template v-if="currentStep === 1">
          <el-form
            ref="verifyFormRef"
            :model="verifyForm"
            :rules="verifyRules"
            label-position="top"
          >
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="verifyForm.email"
                placeholder="请输入注册时的邮箱"
                prefix-icon="Message"
              />
            </el-form-item>
            <div class="verify-code-row">
              <el-form-item label="验证码" prop="verifyCode" class="verify-code-input">
                <el-input
                  v-model="verifyForm.verifyCode"
                  placeholder="请输入验证码"
                  prefix-icon="Key"
                />
              </el-form-item>
              <el-button 
                :disabled="codeSending || countdown > 0" 
                @click="sendVerifyCode" 
                class="send-code-button"
              >
                {{ countdown > 0 ? `重新发送(${countdown}s)` : '发送验证码' }}
              </el-button>
            </div>
            <el-button
              type="primary"
              class="next-button"
              :loading="verifying"
              @click="verifyIdentity"
            >
              下一步
            </el-button>
          </el-form>
        </template>
        
        <!-- 步骤2：设置新密码 -->
        <template v-else-if="currentStep === 2">
          <el-form
            ref="resetFormRef"
            :model="resetForm"
            :rules="resetRules"
            label-position="top"
          >
            <el-form-item label="新密码" prop="password">
              <el-input
                v-model="resetForm.password"
                type="password"
                placeholder="请输入新密码"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="resetForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            <el-button
              type="primary"
              class="next-button"
              :loading="resetting"
              @click="resetPassword"
            >
              重置密码
            </el-button>
          </el-form>
        </template>
        
        <!-- 步骤3：完成 -->
        <template v-else>
          <div class="success-message">
            <el-icon class="success-icon"><CircleCheck /></el-icon>
            <h4>密码重置成功!</h4>
            <p>您的密码已经重置，请使用新密码登录。</p>
            <el-button type="primary" @click="$router.push('/login')">
              前往登录
            </el-button>
          </div>
        </template>
        
        <div class="back-to-login">
          <el-link type="primary" @click="$router.push('/login')">返回登录</el-link>
        </div>
      </div>
    </div>
    <div class="forgot-password-footer">
      <p>© {{ new Date().getFullYear() }} 智能手机评测论坛. 保留所有权利.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CircleCheck, Message, Key, Lock } from '@element-plus/icons-vue'
import { createRules, validateEmail, validatePassword, validateConfirmPassword } from '@/utils/validate'

const router = useRouter()
const currentStep = ref(1)
const verifyFormRef = ref(null)
const resetFormRef = ref(null)
const verifying = ref(false)
const resetting = ref(false)
const codeSending = ref(false)
const countdown = ref(0)

// 验证表单
const verifyForm = reactive({
  email: '',
  verifyCode: ''
})

// 重置密码表单
const resetForm = reactive({
  password: '',
  confirmPassword: ''
})

// 验证规则
const verifyRules = createRules({
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码长度应为6位', trigger: 'blur' }
  ]
})

// 重置密码规则
const resetRules = createRules({
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        validateConfirmPassword(resetForm.password)(rule, value, callback)
      }, 
      trigger: 'blur' 
    }
  ]
})

// 发送验证码
const sendVerifyCode = async () => {
  if (!verifyForm.email) {
    ElMessage.warning('请先输入邮箱地址')
    return
  }
  
  if (!validateEmail.test(verifyForm.email)) {
    ElMessage.warning('请输入正确的邮箱格式')
    return
  }
  
  try {
    codeSending.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 发送成功后开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
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

// 验证身份
const verifyIdentity = async () => {
  if (!verifyFormRef.value) return
  
  verifyFormRef.value.validate(async valid => {
    if (!valid) return
    
    try {
      verifying.value = true
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 验证成功，进入第二步
      currentStep.value = 2
      
    } catch (error) {
      console.error('Failed to verify identity:', error)
      ElMessage.error('验证失败，请检查邮箱和验证码是否正确')
    } finally {
      verifying.value = false
    }
  })
}

// 重置密码
const resetPassword = async () => {
  if (!resetFormRef.value) return
  
  resetFormRef.value.validate(async valid => {
    if (!valid) return
    
    try {
      resetting.value = true
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 重置成功，进入第三步
      currentStep.value = 3
      
    } catch (error) {
      console.error('Failed to reset password:', error)
      ElMessage.error('重置密码失败，请稍后重试')
    } finally {
      resetting.value = false
    }
  })
}

// 监听步骤变化，重置表单
watch(currentStep, (newStep) => {
  if (newStep === 1) {
    if (verifyFormRef.value) {
      verifyFormRef.value.resetFields()
    }
  } else if (newStep === 2) {
    if (resetFormRef.value) {
      resetFormRef.value.resetFields()
    }
  }
})
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.forgot-password-box {
  width: 420px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.forgot-password-header {
  padding: 30px 0;
  text-align: center;
  background-color: #f5f7fa;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.forgot-password-form {
  padding: 30px;
}

.forgot-password-form h3 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
  font-size: 1.5rem;
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
  align-self: flex-end;
}

.next-button {
  width: 100%;
  margin-top: 20px;
  height: 45px;
  font-size: 16px;
}

.back-to-login {
  text-align: center;
  margin-top: 20px;
}

.success-message {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 60px;
  color: #67c23a;
  margin-bottom: 20px;
}

.success-message h4 {
  font-size: 20px;
  margin-bottom: 10px;
}

.success-message p {
  color: #606266;
  margin-bottom: 20px;
}

.forgot-password-footer {
  margin-top: 20px;
  color: #999;
  font-size: 12px;
}

@media (max-width: 480px) {
  .forgot-password-box {
    width: 90%;
    max-width: 360px;
  }
  
  .verify-code-row {
    flex-direction: column;
  }
  
  .send-code-button {
    width: 100%;
  }
}
</style> 