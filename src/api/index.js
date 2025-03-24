// 导入各个API模块
import userApi from './modules/user';
import postApi from './modules/post';
import commentApi from './modules/comment';
import phoneApi from './modules/phone';
import uploadApi from './modules/upload';
import announcementApi from './modules/announcement';
import searchApi from './modules/search';
import notificationApi from './modules/notification';

// 导出各个模块的API
export { 
  userApi, 
  postApi, 
  commentApi, 
  phoneApi, 
  uploadApi, 
  announcementApi, 
  searchApi,
  notificationApi 
};

// 导出默认API对象
export default {
  user: userApi,
  post: postApi,
  comment: commentApi,
  phone: phoneApi,
  upload: uploadApi,
  announcement: announcementApi,
  search: searchApi,
  notification: notificationApi
}; 