import instance from '../../utils/http';

// 文件上传API
const uploadApi = {
  // 上传图片
  uploadImages(data) {
    const formData = new FormData();
    formData.append('file', data)
    return instance.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default uploadApi; 