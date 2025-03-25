import instance from '../../utils/http';

// 管理端API
const adminApi = {
  // 用户管理
  getUserList(params) {
    return instance.get('/admin/users', { params });
  },
  
  createUser(data) {
    return instance.post('/admin/users', data);
  },
  
  updateUser(userId, data) {
    return instance.put(`/admin/users/${userId}`, data);
  },
  
  deleteUser(userId) {
    return instance.delete(`/admin/users/${userId}`);
  },
  
  updateUserStatus(userId, status) {
    return instance.put(`/admin/users/${userId}/status`, { status });
  },
  
  updateUserMute(userId, isMuted) {
    return instance.put(`/admin/users/${userId}/mute`, { isMuted });
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
    return instance.post('/admin/brands', data);
  },
  
  updateBrand(id, data) {
    return instance.put(`/admin/brands/${id}`, data);
  },
  
  deleteBrand(id) {
    return instance.delete(`/admin/brands/${id}`);
  },
  
  updateBrandStatus(id, status, reason = '') {
    return instance.put(`/admin/brands/${id}/status`, { status, reason });
  },
  
  // 手机型号管理
  getPhoneModelList(params) {
    return instance.get('/admin/phones', { params });
  },
  
  createPhoneModel(data) {
    return instance.post('/admin/phones', data);
  },
  
  updatePhoneModel(id, data) {
    return instance.put(`/admin/phones/${id}`, data);
  },
  
  deletePhoneModel(id) {
    return instance.delete(`/admin/phones/${id}`);
  },
  
  // 获取品牌列表（用于选择品牌）
  getBrandList() {
    return instance.get('/admin/brands');
  }
};

export default adminApi; 