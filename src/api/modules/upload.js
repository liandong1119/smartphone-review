import instance from '../../utils/http';

// 文件上传API
const uploadApi = {
  // 上传图片
  uploadImages(data) {
    return instance.post('/upload/images', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default uploadApi; 