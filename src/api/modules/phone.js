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
  }
};

export default phoneApi; 