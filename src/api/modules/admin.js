import instance from '../../utils/http';

// 管理端API
const adminApi = {
  // 用户管理
  getUserList(params) {
    return instance.get('/user/admin/list', { params });
  },
  // 管理员添加用户
  createUser(data) {
    return instance.post('/user/admin', data);
  },

  // 管理员更新用户
  updateUser(userId, data) {
    return instance.put(`/user/admin/${userId}`, data);
  },

  // 管理员删除用户
  deleteUser(userId) {
    return instance.delete(`/user/admin/${userId}`);
  },

  // 封禁用户
  updateUserStatus(userId, status) {
    return instance.put(`/user/admin/${userId}/status`, { status: status });
  },
  // 禁言/解禁
  updateUserMute(userId, isMuted) {
    return instance.put(`/user/admin/${userId}/mute`, {isMuted: isMuted });
  },
  
  // 帖子管理
  getPostList(params) {
    return instance.get('/admin/posts', { params });
  },
  
  getPostComments(postId) {
    return instance.get(`/admin/posts/${postId}/comments`);
  },
  
  deletePost(postId) {
    return instance.delete(`/admin/posts/${postId}`);
  },
  
  updatePostStatus(postId, status) {
    return instance.put(`/admin/posts/${postId}/status`, { status });
  },
  
  // 评论管理
  getCommentList(params) {
    return instance.get('/admin/comments', { params });
  },
  
  deleteComment(commentId) {
    return instance.delete(`/admin/comments/${commentId}`);
  },
  
  updateCommentStatus(commentId, status, options = {}) {
    return instance.put(`/admin/comments/${commentId}/status`, { 
      status, 
      ...options 
    });
  },
  
  // 公告管理
  getAnnouncementList(params) {
    return instance.get('/admin/announcements', { params });
  },
  
  createAnnouncement(data) {
    return instance.post('/admin/announcements', data);
  },
  
  updateAnnouncement(id, data) {
    return instance.put(`/admin/announcements/${id}`, data);
  },
  
  deleteAnnouncement(id) {
    return instance.delete(`/admin/announcements/${id}`);
  },
  
  // 品牌管理
  createBrand(data) {
    return instance.post('/brands/admin', data);
  },
  
  updateBrand(id, data) {
    return instance.put(`/brands/admin/${id}`, data);
  },
  
  deleteBrand(id) {
    return instance.delete(`/brands/admin/${id}`);
  },
  
  updateBrandStatus(id, status, reason = '') {
    return instance.put(`/brands/admin/${id}/status`, { status:status, reason });
  },
  
  // 手机型号管理
  getPhoneModelList(params) {
    return instance.get('/phones/admin', { params });
  },
  
  createPhoneModel(data) {
    return instance.post('/phones/admin', data);
  },
  
  updatePhoneModel(id, data) {
    return instance.put(`/phones/admin/${id}`, data);
  },
  
  deletePhoneModel(id) {
    return instance.delete(`phones/admin/${id}`);
  },
  
  // 获取品牌列表（用于选择品牌）
  getBrandList() {
    return instance.get('brands/admin/all');
  }
};

export default adminApi; 