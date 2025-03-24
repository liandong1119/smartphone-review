import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';

// 创建loading实例的存储对象
let loadingInstance;

// 创建axios实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000, // 增加超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 显示全局loading
    if (config.showLoading !== false) {
      loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }
    
    // 获取token，如果存在则添加到请求头中
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 开发环境打印请求日志
    if (import.meta.env.DEV) {
      console.log(`[HTTP Request] ${config.method.toUpperCase()} ${config.url}`, config.data || config.params);
    }
    
    return config;
  },
  error => {
    // 关闭loading
    if (loadingInstance) {
      loadingInstance.close();
    }
    
    ElMessage.error('请求配置错误');
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 关闭loading
    if (loadingInstance) {
      loadingInstance.close();
    }
    
    const res = response.data;

    // 开发环境打印响应日志
    if (import.meta.env.DEV) {
      console.log(`[HTTP Response] ${response.config.method.toUpperCase()} ${response.config.url}`, res);
    }
    
    // 根据后端返回的状态码进行处理
    if (res.code && res.code !== 200) {
      // 处理各种状态码
      switch (res.code) {
        case 401:
          // 未授权，清除token并重定向到登录页面
          ElMessage.error(res.message || '登录已过期，请重新登录');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
          break;
        case 403:
          ElMessage.error(res.message || '没有权限执行此操作');
          break;
        case 404:
          ElMessage.error(res.message || '请求的资源不存在');
          break;
        case 500:
          ElMessage.error(res.message || '服务器内部错误');
          break;
        default:
          ElMessage.error(res.message || '操作失败');
      }
      return Promise.reject(new Error(res.message || '操作失败'));
    }
    
    // 根据实际接口返回格式调整
    return res.data || res;
  },
  error => {
    // 关闭loading
    if (loadingInstance) {
      loadingInstance.close();
    }
    
    // 处理不同类型的错误
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
          break;
        case 403:
          ElMessage.error('没有权限执行此操作');
          break;
        case 404:
          ElMessage.error('请求的资源不存在');
          break;
        case 500:
          ElMessage.error('服务器内部错误');
          break;
        default:
          ElMessage.error(`请求失败: ${error.response.status}`);
      }
    } else if (error.request) {
      // 请求已发送但未收到响应
      if (error.message.includes('timeout')) {
        ElMessage.error('请求超时，请检查网络连接');
      } else {
        ElMessage.error('网络异常，无法连接到服务器');
      }
    } else {
      // 请求配置错误
      ElMessage.error('请求配置错误: ' + error.message);
    }
    
    return Promise.reject(error);
  }
);

// 封装常用请求方法
const http = {
  // GET请求
  get(url, params, config = {}) {
    return instance.get(url, { params, ...config });
  },
  
  // POST请求
  post(url, data, config = {}) {
    return instance.post(url, data, config);
  },
  
  // PUT请求
  put(url, data, config = {}) {
    return instance.put(url, data, config);
  },
  
  // DELETE请求
  delete(url, config = {}) {
    return instance.delete(url, config);
  },
  
  // 上传文件
  upload(url, formData, config = {}) {
    return instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    });
  },
  
  // 下载文件
  download(url, params, config = {}) {
    return instance.get(url, {
      params,
      responseType: 'blob',
      ...config
    });
  }
};

export default http; 