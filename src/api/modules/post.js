import instance from '../../utils/http';

// 评测帖子相关API
const postApi = {
  // 获取评测列表
  getPosts(params) {
    return instance.get('/posts', { params });
  },
  
  // 获取推荐评测
  getRecommendPosts(params) {
    return instance.get('/posts/recommend', { params });
  },
  
  // 获取评测详情
  getPostDetail(id) {
    return instance.get(`/posts/${id}`);
  },
  
  // 发布评测
  createPost(data) {
    return instance.post('/posts', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // 更新评测
  updatePost(id, data) {
    return instance.put(`/posts/${id}`, data);
  },
  
  // 删除评测
  deletePost(id) {
    return instance.delete(`/posts/${id}`);
  },
  
  // 点赞评测
  likePost(id) {
    return instance.post(`/posts/${id}/like`);
  },
  
  // 取消点赞
  unlikePost(id) {
    return instance.delete(`/posts/${id}/like`);
  },
  
  // 收藏评测
  favoritePost(id) {
    return instance.post(`/posts/${id}/favorite`);
  },
  
  // 取消收藏
  unfavoritePost(id) {
    return instance.delete(`/posts/${id}/favorite`);
  },
  
  // 获取用户发布的评测
  getUserPosts(params) {
    return instance.get('/user/posts', { params });
  },
  
  // 获取用户收藏的评测
  getUserFavorites(params) {
    return instance.get('/user/favorites', { params });
  }
};

export default postApi; 