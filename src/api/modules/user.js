import instance from '../../utils/http';

// 用户相关API
const userApi = {
  // 用户登录
  login(data) {
    return instance.post('/user/login', data);
  },
  
  // 用户注册
  register(data) {
    return instance.post('/user/register', data);
  },
  
  // 获取用户信息
  getUserInfo() {
    return instance.get('/user/info');
  },
  
  // 更新用户信息
  updateUserInfo(data) {
    return instance.put('/user/info', data);
  },
  
  // 更新用户头像
  updateAvatar(data) {
    return instance.post('/user/avatar', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // 获取用户统计数据
  getUserStats() {
    return instance.get('/user/stats');
  },
  
  // 获取指定用户的个人主页信息
  getUserProfile(userId) {
    return instance.get(`/user/profile/${userId}`);
  },
  
  // 获取用户的评测列表
  getUserPosts(userId, params) {
    return instance.get(`/user/${userId}/posts`, { params });
  },
  
  // 关注用户
  followUser(userId) {
    return instance.post(`/user/follow/${userId}`);
  },
  
  // 取消关注用户
  unfollowUser(userId) {
    return instance.delete(`/user/follow/${userId}`);
  },
  
  // 获取用户的关注列表
  getUserFollowing(userId, params) {
    return instance.get(`/user/${userId}/following`, { params });
  },
  
  // 获取用户的粉丝列表
  getUserFollowers(userId, params) {
    return instance.get(`/user/${userId}/followers`, { params });
  },
  
  // 获取当前用户的评测列表
  getUserReviews(params) {
    const { page = 1, limit = 10 } = params || {};
    return instance.get(`/user/posts?page=${page}&limit=${limit}`);
  },
  
  // 获取当前用户的评论列表
  getUserComments(params) {
    const { page = 1, limit = 10 } = params || {};
    return instance.get(`/user/comments?page=${page}&limit=${limit}`);
  },
  
  // 获取当前用户的收藏列表
  getUserFavorites(params) {
    const { type = 'post' } = params || {};
    return instance.get(`/user/favorites?type=${type}`);
  },
  
  // 添加或移除收藏
  toggleFavorite(data) {
    return instance.post('/user/favorites', data);
  }
};

export default userApi; 