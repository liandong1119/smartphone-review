import instance from '../../utils/http';

// 品牌和手机型号相关API
const phoneApi = {
  // 获取所有品牌
  getBrands() {
    return instance.get('/brands');
  },
  
  // 获取某品牌下的所有型号
  getModelsByBrand(brandId) {
    return instance.get(`/brands/${brandId}/models`);
  },
  
  // 获取某手机型号的详情
  getPhoneDetail(modelId) {
    return instance.get(`/phones/${modelId}`);
  },
  
  // 获取热门手机型号
  getHotPhones() {
    return instance.get('/phones/hot');
  },
  
  // 搜索手机
  searchPhones(params) {
    return instance.get('/phones', { params });
  },
  
  // 获取用户收藏的手机
  getFavoritePhones() {
    return instance.get('/user/favorites', { params: { type: 'phone' } });
  },
  
  // 收藏/取消收藏手机
  toggleFavoritePhone(phoneId, action) {
    return instance.post('/user/favorites', {
      type: 'phone',
      id: phoneId,
      action: action // 'add' 或 'remove'
    });
  },
  
  // 获取某手机的评论评测
  getPhoneReviews(phoneId, params) {
    return instance.get(`/phones/${phoneId}/reviews`, { params });
  },
  
  // 获取相关/推荐手机
  getRelatedPhones(phoneId, limit = 6) {
    return instance.get(`/phones/${phoneId}/related`, { params: { limit } });
  }
};

export default phoneApi; 