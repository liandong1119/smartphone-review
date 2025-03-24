import instance from '../../utils/http';

// 公告相关API
const announcementApi = {
  // 获取公告列表
  getAnnouncements() {
    return instance.get('/announcements');
  }
};

export default announcementApi; 