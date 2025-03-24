/**
 * 表单验证工具类
 * 提供常用的表单验证规则和方法
 */

// 用户名验证：4-20位字母、数字、下划线
export const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入用户名'))
  } else if (!/^[a-zA-Z0-9_]{4,20}$/.test(value)) {
    callback(new Error('用户名必须为4-20位字母、数字或下划线'))
  } else {
    callback()
  }
}

// 密码验证：6-20位，必须包含字母和数字
export const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 20) {
    callback(new Error('密码长度必须在6-20位之间'))
  } else if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d~!@#$%^&*()_+`\-={}:";'<>?,./]{6,20}$/.test(value)) {
    callback(new Error('密码必须包含字母和数字'))
  } else {
    callback()
  }
}

// 确认密码验证
export const validateConfirmPassword = (password) => {
  return (rule, value, callback) => {
    if (!value) {
      callback(new Error('请再次输入密码'))
    } else if (value !== password) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  }
}

// 邮箱验证
export const validateEmail = (rule, value, callback) => {
  const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (!value) {
    callback(new Error('请输入邮箱地址'))
  } else if (!emailRegex.test(value)) {
    callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}

// 手机号验证（中国大陆）
export const validateMobile = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

// URL验证
export const validateUrl = (rule, value, callback) => {
  if (!value) {
    callback()
    return
  }
  
  try {
    new URL(value)
    callback()
  } catch (error) {
    callback(new Error('请输入正确的URL地址'))
  }
}

// 字符长度验证
export const validateLength = (min, max) => {
  return (rule, value, callback) => {
    if (!value) {
      callback()
      return
    }
    
    if (value.length < min) {
      callback(new Error(`长度不能少于${min}个字符`))
    } else if (value.length > max) {
      callback(new Error(`长度不能超过${max}个字符`))
    } else {
      callback()
    }
  }
}

// 评测内容验证（不能为空且长度大于10）
export const validatePostContent = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入评测内容'))
  } else if (value.length < 10) {
    callback(new Error('评测内容不能少于10个字符'))
  } else {
    callback()
  }
}

// 生成常用规则集合
export const rules = {
  username: [
    { required: true, validator: validateUsername, trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  email: [
    { required: true, validator: validateEmail, trigger: 'blur' }
  ],
  mobile: [
    { required: true, validator: validateMobile, trigger: 'blur' }
  ],
  content: [
    { required: true, validator: validatePostContent, trigger: 'blur' }
  ],
  required: [
    { required: true, message: '此项不能为空', trigger: 'blur' }
  ]
}

// 创建表单校验规则
export const createRules = (config) => {
  const formRules = {}
  
  Object.keys(config).forEach(key => {
    const ruleType = config[key]
    if (typeof ruleType === 'string') {
      // 使用预定义规则
      formRules[key] = rules[ruleType] || rules.required
    } else if (Array.isArray(ruleType)) {
      // 使用自定义规则集合
      formRules[key] = ruleType
    } else if (typeof ruleType === 'object') {
      // 使用配置对象生成规则
      const { required, type, min, max, message, trigger } = ruleType
      
      let rule = {}
      if (required !== undefined) rule.required = required
      if (type) rule.type = type
      if (min !== undefined || max !== undefined) {
        rule.validator = validateLength(min || 0, max || Infinity)
      }
      if (message) rule.message = message
      if (trigger) rule.trigger = trigger
      
      formRules[key] = [rule]
    }
  })
  
  return formRules
}

export default {
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validateEmail,
  validateMobile,
  validateUrl,
  validateLength,
  validatePostContent,
  rules,
  createRules
} 