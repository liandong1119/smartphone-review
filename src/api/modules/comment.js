import instance from '../../utils/http';

// 评论相关API
const commentApi = {
  // 获取评论列表
  getComments(postId, params) {
    return instance.get(`/posts/${postId}/comments`, { params });
  },
  
  // 发表评论
  createComment(postId, data) {
    return instance.post(`/posts/${postId}/comments`, data);
  },
  
  // 删除评论
  deleteComment(postId, commentId) {
    return instance.delete(`/posts/${postId}/comments/${commentId}`);
  },
  
  // 点赞评论
  likeComment(postId, commentId) {
    return instance.post(`/posts/${postId}/comments/${commentId}/like`);
  },
  
  // 取消评论点赞
  unlikeComment(postId, commentId) {
    return instance.delete(`/posts/${postId}/comments/${commentId}/like`);
  }
};

export default commentApi; 