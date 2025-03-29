import instance from '../../utils/http';

// 管理端API
const adminApi = {
  // 用户管理
  getUserList(params) {
    return instance.get('/user/admin/list',  params );
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
    return instance.get('/posts/admin/list',  params );
  },
  
  getPostComments(postId) {
    return instance.get(`/posts/admin/${postId}/comments`);
  },
  
  deletePost(postId) {
    return instance.delete(`/posts/admin/${postId}`);
  },
  
  updatePostStatus(postId, status) {
    return instance.put(`/posts/admin/${postId}/status`, { status });
  },
  
  // 评论管理
  getCommentList(params) {
    return instance.get('/comments/admin/list',  params );
  },
  
  deleteComment(commentId) {
    return instance.delete(`/comments/admin/${commentId}`);
  },
  
  updateCommentStatus(commentId, status, options = {}) {
    return instance.put(`/comments/admin/${commentId}/status`, {
      status, 
      ...options 
    });
  },
  
  // 公告管理
  getAnnouncementList(params) {
    return instance.get('/announcement/admin/list',  params );
  },
  
  createAnnouncement(data) {
    return instance.post('/announcement/admin', data);
  },
  
  updateAnnouncement(id, data) {
    return instance.put(`/announcement/admin/${id}`, data);
  },
  
  deleteAnnouncement(id) {
    return instance.delete(`/announcement/admin/${id}`);
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
    return instance.get('/phones/admin/list',  params );
  },
  
  createPhoneModel(data) {
    return instance.post('/phones/admin/add', data);
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