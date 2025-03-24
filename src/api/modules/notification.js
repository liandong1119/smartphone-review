import instance from '../../utils/http';

// 通知相关API
const notificationApi = {
  // 获取用户通知列表
  getNotifications(params) {
    return instance.get('/notifications', { params });
  },
  
  // 标记通知为已读
  markAsRead(notificationId) {
    return instance.put(`/notifications/${notificationId}/read`);
  },
  
  // 标记所有通知为已读
  markAllAsRead() {
    return instance.put('/notifications/read-all');
  },
  
  // 删除通知
  deleteNotification(notificationId) {
    return instance.delete(`/notifications/${notificationId}`);
  },
  
  // 获取未读通知数量
  getUnreadCount() {
    return instance.get('/notifications/unread-count');
  }
};

export default notificationApi; 