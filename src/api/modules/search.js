import instance from '../../utils/http';

// 搜索相关API
const searchApi = {
  // 搜索评测
  searchPosts(params) {
    return instance.get('/search/posts', { params });
  }
};

export default searchApi; 