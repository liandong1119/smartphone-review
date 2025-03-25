import { createServer, Model } from 'miragejs';
import md5 from 'md5';

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: md5('password'),
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: 'admin',
    status: 1,
    isMuted: false,
    createTime: new Date('2023-05-01').toISOString(),
    postCount: 3,
    followerCount: 5,
    followingCount: 2
  },
  {
    id: 2,
    username: 'user',
    email: 'user@example.com',
    password: md5('password'),
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    role: 'user',
    status: 1,
    isMuted: false,
    createTime: new Date('2023-05-05').toISOString(),
    postCount: 2,
    followerCount: 1,
    followingCount: 3
  },
  {
    id: 3,
    username: '数码达人',
    email: 'tech@example.com',
    password: md5('password'),
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    role: 'user',
    status: 1,
    isMuted: false,
    createTime: new Date('2023-06-15').toISOString(),
    postCount: 8,
    followerCount: 12,
    followingCount: 5
  },
  {
    id: 4,
    username: '手机迷',
    email: 'phone@example.com',
    password: md5('password'),
    avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    role: 'user',
    status: 1,
    isMuted: true,  // 已禁言用户示例
    createTime: new Date('2023-07-20').toISOString(),
    postCount: 6,
    followerCount: 8,
    followingCount: 10
  },
  {
    id: 5,
    username: '摄影控',
    email: 'photo@example.com',
    password: md5('password'),
    avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    role: 'user',
    status: 0,  // 已禁用用户示例
    isMuted: false,
    createTime: new Date('2023-08-10').toISOString(),
    postCount: 4,
    followerCount: 6,
    followingCount: 9
  }
];

// 模拟帖子数据
const posts = [
  {
    id: 1,
    userId: 1,  // 修改为ID为1的用户（当前登录用户）
    title: 'iPhone 15 Pro 上手体验',
    content: '今天入手了全新的iPhone 15 Pro，手感非常不错，相机提升明显。尤其是新增的拍照按钮，使用起来非常顺手，暗光拍摄也有了很大提升。',
    images: [
      'https://img.alicdn.com/imgextra/i2/1979300282/O1CN01kqNFkQ1UiO7POzQO0_!!1979300282.jpg',
      'https://img.alicdn.com/imgextra/i1/1979300282/O1CN01aCGrpJ1UiO7UBLc1h_!!1979300282.jpg',
      'https://img.alicdn.com/imgextra/i2/1979300282/O1CN014XUzRi1UiO7QL3Jk5_!!1979300282.jpg'
    ],
    brandId: 1,
    modelId: 1,
    createTime: '2023-09-15',
    updateTime: '2023-09-15',
    likes: 45,
    comments: 23,
    views: 256,
    rating: 4.5,
    appearanceRating: 5,
    screenRating: 4,
    performanceRating: 5,
    cameraRating: 4.5,
    batteryRating: 4,
    systemRating: 4.5
  },
  {
    id: 2,
    userId: 1,  // 修改为ID为1的用户（当前登录用户）
    title: '小米14充电测试',
    content: '测试了小米14的充电速度，从0到100%只需35分钟！这应该是目前市面上充电最快的旗舰手机了，而且充电发热控制得不错。',
    images: [
      'https://img.alicdn.com/imgextra/i3/2088551213/O1CN01wBlMCX1TZiUiVCUAx_!!2088551213.jpg',
      'https://img.alicdn.com/imgextra/i2/2088551213/O1CN01NHwDOP1TZiUlWNBTd_!!2088551213.jpg',
      'https://img.alicdn.com/imgextra/i3/2088551213/O1CN01bNcXdK1TZiUm5U5o7_!!2088551213.jpg'
    ],
    brandId: 2,
    modelId: 4,
    createTime: '2023-09-10',
    updateTime: '2023-09-10',
    likes: 37,
    comments: 15,
    views: 189,
    rating: 4.2,
    appearanceRating: 4,
    screenRating: 4,
    performanceRating: 4.5,
    cameraRating: 3.5,
    batteryRating: 5,
    systemRating: 4
  },
  {
    id: 3,
    userId: 5,  // 摄影控
    title: '华为Mate60 Pro实测',
    content: '华为Mate60 Pro已经用了一周，国产芯片的表现确实让我惊艳。日常使用没有任何卡顿，信号也比之前的手机强不少。卫星通话在郊外测试了一下，清晰度超出预期！',
    images: [
      'https://img.alicdn.com/imgextra/i2/2201476544168/O1CN0108yQNR1IOqeBzsFHG_!!2201476544168.jpg',
      'https://img.alicdn.com/imgextra/i1/2201476544168/O1CN01XU4pU61IOqdsCz9ej_!!2201476544168.jpg',
      'https://img.alicdn.com/imgextra/i2/2201476544168/O1CN01aCSHG31IOqeAe4Vdw_!!2201476544168.jpg'
    ],
    brandId: 3,
    modelId: 7,
    createTime: '2023-09-05',
    updateTime: '2023-09-06',
    likes: 89,
    comments: 42,
    views: 542,
    rating: 4.8,
    appearanceRating: 4.5,
    screenRating: 5,
    performanceRating: 4.5,
    cameraRating: 5,
    batteryRating: 4.5,
    systemRating: 5
  },
  {
    id: 4,
    userId: 1,  // admin
    title: 'ROG Phone 7游戏体验',
    content: 'ROG Phone 7终于到手，打游戏真的爽！散热模块效果显著，玩原神一小时后机身温度才38度。背部的RGB灯效也很酷，就是有点费电。',
    images: [
      'https://img.alicdn.com/imgextra/i4/2212490451220/O1CN01VLU5w21qPyLIZRy3u_!!2212490451220.jpg',
      'https://img.alicdn.com/imgextra/i2/2212490451220/O1CN01F8cIhF1qPyL9Gtzn2_!!2212490451220.jpg',
      'https://img.alicdn.com/imgextra/i1/2212490451220/O1CN01SLbWlk1qPyLFkNVre_!!2212490451220.jpg'
    ],
    brandId: 5,
    modelId: 10,
    createTime: '2023-09-01',
    updateTime: '2023-09-01',
    likes: 32,
    comments: 18,
    views: 146,
    rating: 4.3,
    appearanceRating: 4.5,
    screenRating: 4.5,
    performanceRating: 5,
    cameraRating: 3.5,
    batteryRating: 3.5,
    systemRating: 4.5
  },
  {
    id: 5,
    userId: 2,  // user
    title: 'OPPO Find X7 Pro影像系统体验',
    content: '入手OPPO Find X7 Pro已经半个月了，影像系统表现确实一流！同时拥有超广角、主摄、人像和长焦四颗镜头，各种场景都能对付。',
    images: [
      'https://img.alicdn.com/imgextra/i1/2249892025/O1CN01KWlEZD28qeUgWMxGY_!!2249892025.jpg',
      'https://img.alicdn.com/imgextra/i3/2249892025/O1CN01FWH22i28qeUdbj6ej_!!2249892025.jpg',
      'https://img.alicdn.com/imgextra/i1/2249892025/O1CN0191I7JC28qeUeF9XWy_!!2249892025.jpg'
    ],
    brandId: 4,
    modelId: 9,
    createTime: '2023-08-28',
    updateTime: '2023-08-29',
    likes: 24,
    comments: 9,
    views: 113,
    rating: 4.6,
    appearanceRating: 4.5,
    screenRating: 4.5,
    performanceRating: 4,
    cameraRating: 5,
    batteryRating: 4.5,
    systemRating: 4.5
  },
  {
    id: 6,
    userId: 3,  // 数码达人
    title: '三星S23 Ultra半年使用感受',
    content: '三星S23 Ultra用了半年了，依然是安卓阵营中的相机之王！拍月亮的效果简直不可思议，100倍变焦虽然有涂抹感，但30倍内的成像已经超过很多数码相机了。',
    images: [
      'https://img.alicdn.com/imgextra/i3/741350240/O1CN01S0eIsh1NWVDh6z8vt_!!741350240.jpg',
      'https://img.alicdn.com/imgextra/i1/741350240/O1CN01EPmKxF1NWVDEbwXxe_!!741350240.jpg',
      'https://img.alicdn.com/imgextra/i4/741350240/O1CN01iKHuS11NWVDmHavzB_!!741350240.jpg'
    ],
    brandId: 6,
    modelId: 12,
    createTime: '2023-08-25',
    updateTime: '2023-08-25',
    likes: 29,
    comments: 13,
    views: 178,
    rating: 4.4,
    appearanceRating: 4,
    screenRating: 5,
    performanceRating: 4.5,
    cameraRating: 5,
    batteryRating: 4,
    systemRating: 4
  }
];

// 模拟评论数据
const comments = [
  { id: 1, postId: 1, userId: 2, content: '续航怎么样？日常使用能坚持一天吗？', createTime: '2023-09-15 10:15:00', likes: 3 },
  { id: 2, postId: 1, userId: 1, content: '完全没问题，轻度使用能撑两天', createTime: '2023-09-15 10:30:00', likes: 1 },
  { id: 3, postId: 1, userId: 2, content: '夜景样张可以分享一下吗？听说有很大进步', createTime: '2023-09-15 11:20:00', likes: 2 },
  { id: 4, postId: 1, userId: 1, content: '稍后会更新一组夜景图', createTime: '2023-09-15 12:05:00', likes: 0 },
  { id: 5, postId: 1, userId: 2, content: '价格确实有点贵，但感觉还是值得入手的', createTime: '2023-09-15 14:30:00', likes: 5 },
  
  { id: 6, postId: 2, userId: 1, content: '充电器是多少W的？满血快充吗？', createTime: '2023-09-10 09:45:00', likes: 2 },
  { id: 7, postId: 2, userId: 2, content: '120W的充电器，完全满血快充', createTime: '2023-09-10 10:15:00', likes: 1 },
  { id: 8, postId: 2, userId: 1, content: '续航能坚持一整天吗？快充虽好，但还是希望电池耐用', createTime: '2023-09-10 11:20:00', likes: 3 },
  
  { id: 9, postId: 3, userId: 2, content: '卫星通话怎么收费？准备去西藏旅游，那边信号不好', createTime: '2023-09-05 15:10:00', likes: 4 },
  { id: 10, postId: 3, userId: 1, content: '卫星通话是按照分钟收费的，具体可以去运营商官网查询', createTime: '2023-09-05 15:30:00', likes: 2 },
  { id: 11, postId: 3, userId: 2, content: '性能实测跑分多少？比骁龙8Gen2差多少？', createTime: '2023-09-05 16:25:00', likes: 1 },
  { id: 12, postId: 3, userId: 1, content: '安兔兔跑分约90万，日常使用完全感觉不到差距', createTime: '2023-09-05 17:40:00', likes: 3 },
  { id: 13, postId: 3, userId: 2, content: '拍照样张能分享一下吗？听说有徕卡加持', createTime: '2023-09-06 09:15:00', likes: 2 },
  { id: 14, postId: 3, userId: 1, content: '支持国产！华为加油！', createTime: '2023-09-06 10:20:00', likes: 8 }
];

// 手机品牌数据
const brands = [
  {
    id: 1,
    name: '苹果',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/505px-Apple_logo_black.svg.png',
    description: '全球知名的科技公司，iPhone系列手机的制造商',
    createTime: '2022-01-01'
  },
  {
    id: 2,
    name: '三星',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/640px-Samsung_Logo.svg.png',
    description: '韩国最大的电子企业，Galaxy系列手机的制造商',
    createTime: '2022-01-01'
  },
  {
    id: 3,
    name: '小米',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/768px-Xiaomi_logo_%282021-%29.svg.png',
    description: '中国知名科技公司，性价比高的手机制造商',
    createTime: '2022-01-01'
  },
  {
    id: 4,
    name: '华为',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Huawei_Logo.svg/1280px-Huawei_Logo.svg.png',
    description: '中国领先的通信设备制造商，Mate系列和P系列手机的制造商',
    createTime: '2022-01-01'
  },
  {
    id: 5,
    name: 'OPPO',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/OPPO_Logo.svg/640px-OPPO_Logo.svg.png',
    description: '中国主要的手机制造商之一，Find系列和Reno系列手机的制造商',
    createTime: '2022-01-01'
  },
  {
    id: 6,
    name: 'vivo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Vivo_logo_2019.svg/1200px-Vivo_logo_2019.svg.png',
    description: '中国主要的手机制造商之一，X系列和NEX系列手机的制造商',
    createTime: '2022-01-01'
  }
];

// 手机型号数据
const phoneModels = [
  {
    id: 1,
    brandId: 1,
    name: 'iPhone 15 Pro Max',
    image: 'https://img.alicdn.com/imgextra/i2/1979300282/O1CN01kqNFkQ1UiO7POzQO0_!!1979300282.jpg',
    description: 'iPhone 15 Pro Max采用钛金属边框，A17 Pro处理器，性能强劲，搭载iOS 17系统。',
    price: 8999,
    popularity: 98,
    releaseDate: '2023-09-22',
    createTime: '2023-09-22'
  },
  {
    id: 2,
    brandId: 1,
    name: 'iPhone 15',
    image: 'https://img.alicdn.com/imgextra/i1/1714128138/O1CN01TRBc4C29zFt2bS2oH_!!1714128138.jpg',
    description: 'iPhone 15采用玻璃材质，搭载A16仿生芯片，动态岛设计，提供多种鲜亮颜色选择。',
    price: 5999,
    popularity: 95,
    releaseDate: '2023-09-22',
    createTime: '2023-09-22'
  },
  {
    id: 3,
    brandId: 3,
    name: '小米14 Ultra',
    image: 'https://img.alicdn.com/imgextra/i1/2616970884/O1CN01QkEw801IOuMxfLS4U_!!2616970884.jpg',
    description: '小米14 Ultra搭载骁龙8 Gen3处理器，徕卡认证四摄，2K+分辨率OLED屏幕，拍照效果出色。',
    price: 6499,
    popularity: 92,
    releaseDate: '2024-02-25',
    createTime: '2024-02-25'
  },
  {
    id: 4,
    brandId: 3,
    name: '小米14',
    image: 'https://img.alicdn.com/imgextra/i4/2616970884/O1CN01pK5T8Q1IOuMoU5vhp_!!2616970884.jpg',
    description: '小米14搭载全新骁龙8 Gen3处理器，轻薄设计，徕卡光学镜头，新一代HyperOS系统。',
    price: 4299,
    popularity: 90,
    releaseDate: '2023-10-26',
    createTime: '2023-10-26'
  },
  {
    id: 5,
    brandId: 4,
    name: 'Mate60 Pro',
    image: 'https://img.alicdn.com/imgextra/i3/2838892713/O1CN01UYfFAW1PpKJCcGf9O_!!2838892713.jpg',
    description: '华为Mate60 Pro采用昆仑玻璃，麒麟9000S芯片，搭载鸿蒙系统，支持卫星通信。',
    price: 6999,
    popularity: 96,
    releaseDate: '2023-08-29',
    createTime: '2023-08-29'
  },
  {
    id: 6,
    brandId: 4,
    name: 'P60 Pro',
    image: 'https://img.alicdn.com/imgextra/i2/2838892713/O1CN01jQRPn91PpKJDDVA1t_!!2838892713.jpg',
    description: '华为P60 Pro搭载XMAGE影像系统，变光可调光圈，双重望远增强，全新配色设计。',
    price: 6488,
    popularity: 88,
    releaseDate: '2023-03-23',
    createTime: '2023-03-23'
  },
  {
    id: 7,
    brandId: 2,
    name: 'Galaxy S24 Ultra',
    image: 'https://img.alicdn.com/imgextra/i2/2212560018/O1CN01hkZgDz1oVx9Qqgz9h_!!2212560018.jpg',
    description: '三星Galaxy S24 Ultra采用钛金属边框，200MP摄像头，支持S Pen，搭载骁龙8 Gen3处理器。',
    price: 9999,
    popularity: 94,
    releaseDate: '2024-01-17',
    createTime: '2024-01-17'
  },
  {
    id: 8,
    brandId: 2,
    name: 'Galaxy Z Fold5',
    image: 'https://img.alicdn.com/imgextra/i1/2212560018/O1CN01UibVSx1oVx90QqBU3_!!2212560018.jpg',
    description: '三星Galaxy Z Fold5可折叠设计，内外双屏，支持S Pen，搭载骁龙8 Gen2处理器。',
    price: 12999,
    popularity: 85,
    releaseDate: '2023-07-26',
    createTime: '2023-07-26'
  },
  {
    id: 9,
    brandId: 5,
    name: 'Find X7 Ultra',
    image: 'https://img.alicdn.com/imgextra/i4/2201203103170/O1CN01Yz7CZY1KbPFuHwgk7_!!2201203103170.jpg',
    description: 'OPPO Find X7 Ultra搭载双长焦四摄系统，天玑9300旗舰芯片，2K超视网膜曲面屏。',
    price: 6499,
    popularity: 89,
    releaseDate: '2024-01-08',
    createTime: '2024-01-08'
  },
  {
    id: 10,
    brandId: 6,
    name: 'X100 Pro',
    image: 'https://img.alicdn.com/imgextra/i4/2210860234676/O1CN01XzNL761YpWvSUaQAq_!!2210860234676.jpg',
    description: 'vivo X100 Pro搭载天玑9300处理器，蔡司影像系统，专业大底主摄，5400mAh超大电池。',
    price: 5999,
    popularity: 91,
    releaseDate: '2023-11-13',
    createTime: '2023-11-13'
  }
];

// 模拟公告数据
const announcements = [
  {
    id: 1,
    title: '欢迎来到智能手机评测论坛',
    content: '这里是最专业的手机评测社区，期待您的分享和讨论！',
    createTime: '2023-09-01',
    isTop: true
  },
  {
    id: 2,
    title: '论坛规则更新公告',
    content: '为了维护良好的讨论氛围，我们更新了论坛规则，请大家遵守。',
    createTime: '2023-08-15',
    isTop: false
  },
  {
    id: 3,
    title: '新增品牌分区',
    content: '应广大用户需求，我们新增了更多手机品牌的专区，欢迎前往讨论。',
    createTime: '2023-07-20',
    isTop: false
  }
];

// 模拟用户收藏数据
const userFavorites = [
  {
    id: 1,
    userId: 1,
    type: 'phone',
    itemId: 1, // iPhone 15 Pro
    createTime: '2023-10-15'
  },
  {
    id: 2,
    userId: 1,
    type: 'phone',
    itemId: 3, // Mate60 Pro
    createTime: '2023-10-10'
  },
  {
    id: 3,
    userId: 2,
    type: 'phone',
    itemId: 2, // 小米14
    createTime: '2023-10-12'
  },
  {
    id: 4,
    userId: 1,
    type: 'post',
    itemId: 2, // 小米14充电测试
    createTime: '2023-09-25'
  },
  {
    id: 5,
    userId: 1, 
    type: 'post',
    itemId: 3, // 华为Mate60 Pro实测
    createTime: '2023-09-20'
  }
];

// 创建模拟服务器
export function createMockServer() {
  try {
    console.log('开始创建模拟服务器...');
    
    const server = createServer({
      models: {
        users: Model,
        brands: Model,
        phoneModels: Model,
        posts: Model,
        comments: Model,
        userFavorites: Model,
        announcements: Model,
        notifications: Model,  // 添加通知模型
        logs: Model,  // 添加日志模型
        settings: Model,  // 添加设置模型
        backups: Model  // 添加备份模型
      },
      
      seeds(server) {
        try {
          if (!server || !server.db) {
            console.error('初始化种子数据失败: server或server.db未定义');
            return;
          }

          // 创建品牌
          try {
            server.db.brands.insert([
              { id: 1, name: 'Apple', logo: 'https://www.apple.com/favicon.ico', description: '美国科技公司' },
              { id: 2, name: 'Samsung', logo: 'https://www.samsung.com/favicon.ico', description: '韩国电子企业' },
              { id: 3, name: 'Huawei', logo: 'https://www.huawei.com/favicon.ico', description: '中国通信技术公司' },
              { id: 4, name: 'Xiaomi', logo: 'https://www.mi.com/favicon.ico', description: '中国智能手机制造商' },
              { id: 5, name: 'OPPO', logo: 'https://www.oppo.com/favicon.ico', description: '中国知名手机品牌' }
            ]);
            console.log('品牌数据创建成功');
          } catch (error) {
            console.error('创建品牌数据失败:', error);
          }
          
          // 创建手机型号
          try {
            server.db.phoneModels.insert([
              { id: 1, brandId: 1, name: 'iPhone 15 Pro Max', releaseDate: '2023-09', price: 9999, image: 'https://img.alicdn.com/imgextra/i2/1979300282/O1CN01kqNFkQ1UiO7POzQO0_!!1979300282.jpg' },
              { id: 2, brandId: 1, name: 'iPhone 15', releaseDate: '2023-09', price: 5999, image: 'https://img.alicdn.com/imgextra/i1/1979300282/O1CN01aCGrpJ1UiO7UBLc1h_!!1979300282.jpg' },
              { id: 3, brandId: 2, name: 'Galaxy S23 Ultra', releaseDate: '2023-02', price: 8999, image: 'https://img.alicdn.com/imgextra/i3/2088551213/O1CN01wBlMCX1TZiUiVCUAx_!!2088551213.jpg' },
              { id: 4, brandId: 2, name: 'Galaxy Z Fold 5', releaseDate: '2023-07', price: 13999, image: 'https://img.alicdn.com/imgextra/i2/2088551213/O1CN01NHwDOP1TZiUlWNBTd_!!2088551213.jpg' },
              { id: 5, brandId: 3, name: 'P60 Pro', releaseDate: '2023-03', price: 6988, image: 'https://img.alicdn.com/imgextra/i2/2201476544168/O1CN01aCSHG31IOqeAe4Vdw_!!2201476544168.jpg' },
              { id: 6, brandId: 3, name: 'Mate X3', releaseDate: '2023-04', price: 12999, image: 'https://img.alicdn.com/imgextra/i1/2201476544168/O1CN01XU4pU61IOqdsCz9ej_!!2201476544168.jpg' },
              { id: 7, brandId: 3, name: 'Mate 60 Pro', releaseDate: '2023-08', price: 6999, image: 'https://img.alicdn.com/imgextra/i2/2201476544168/O1CN0108yQNR1IOqeBzsFHG_!!2201476544168.jpg' },
              { id: 8, brandId: 4, name: 'Xiaomi 13 Ultra', releaseDate: '2023-04', price: 5999, image: 'https://img.alicdn.com/imgextra/i1/2249892025/O1CN0191I7JC28qeUeF9XWy_!!2249892025.jpg' },
              { id: 9, brandId: 5, name: 'Find X6 Pro', releaseDate: '2023-03', price: 5999, image: 'https://img.alicdn.com/imgextra/i1/2249892025/O1CN01KWlEZD28qeUgWMxGY_!!2249892025.jpg' },
              { id: 10, brandId: 4, name: 'Redmi K60 Pro', releaseDate: '2022-12', price: 3899, image: 'https://img.alicdn.com/imgextra/i3/2249892025/O1CN01FWH22i28qeUdbj6ej_!!2249892025.jpg' }
            ]);
            console.log('手机型号数据创建成功');
          } catch (error) {
            console.error('创建手机型号数据失败:', error);
          }
          
          // 创建用户数据
          try {
            server.db.users.insert(users);
            console.log('用户数据创建成功');
          } catch (error) {
            console.error('创建用户数据失败:', error);
          }
          
          // 创建帖子数据
          try {
            if (!server.db.posts.length) {
              server.db.posts.insert(posts || [
                {
                  id: 1,
                  userId: 1,
                  title: 'iPhone 15 Pro首发评测',
                  content: '今天入手了新款iPhone 15 Pro，外观非常惊艳，相机也比上一代有明显提升。',
                  modelId: 1,
                  createTime: new Date('2023-09-20').toISOString(),
                  updateTime: new Date('2023-09-20').toISOString(),
                  views: 120,
                  likes: 35,
                  comments: 12
                },
                {
                  id: 2,
                  userId: 1,
                  title: 'Galaxy S23 Ultra评测',
                  content: 'S23 Ultra的拍照能力真的很强，尤其是夜景模式表现惊艳。',
                  modelId: 3,
                  createTime: new Date('2023-08-15').toISOString(),
                  updateTime: new Date('2023-08-16').toISOString(),
                  views: 98,
                  likes: 27,
                  comments: 8
                },
                {
                  id: 3,
                  userId: 1,
                  title: 'Mate 60 Pro使用体验',
                  content: '华为新旗舰值得称赞，国产芯片表现出色。',
                  modelId: 7,
                  createTime: new Date('2023-09-05').toISOString(),
                  updateTime: new Date('2023-09-05').toISOString(),
                  views: 150,
                  likes: 45,
                  comments: 18
                }
              ]);
              console.log('帖子数据创建成功');
            }
          } catch (error) {
            console.error('创建帖子数据失败:', error);
          }
          
          // 创建评论数据
          try {
            if (!server.db.comments.length) {
              server.db.comments.insert([
                {
                  id: 1,
                  userId: 1,
                  postId: 1,
                  content: '很详细的评测，谢谢分享！',
                  createTime: new Date('2023-09-21').toISOString(),
                  likes: 5
                },
                {
                  id: 2,
                  userId: 1,
                  postId: 2,
                  content: '请问电池续航如何？',
                  createTime: new Date('2023-08-17').toISOString(),
                  likes: 3
                },
                {
                  id: 3,
                  userId: 1,
                  postId: 3,
                  content: '拍照样张能多分享一些吗？',
                  createTime: new Date('2023-09-06').toISOString(),
                  likes: 7
                },
                {
                  id: 4,
                  userId: 1,
                  postId: 4,
                  content: '游戏性能怎么样？帧率稳定吗？',
                  createTime: new Date('2023-09-10').toISOString(),
                  likes: 2
                },
                {
                  id: 5,
                  userId: 1,
                  postId: 5,
                  content: '这个价位确实很有竞争力，考虑入手。',
                  createTime: new Date('2023-09-15').toISOString(),
                  likes: 4
                }
              ]);
              console.log('评论数据创建成功');
            }
          } catch (error) {
            console.error('创建评论数据失败:', error);
          }
          
          // 创建收藏数据
          try {
            if (!server.db.userFavorites.length) {
              server.db.userFavorites.insert([
                {
                  id: 1,
                  userId: 1,
                  itemId: 1,
                  type: 'post',
                  createTime: new Date().toISOString()
                },
                {
                  id: 2,
                  userId: 1,
                  itemId: 3,
                  type: 'post',
                  createTime: new Date().toISOString()
                },
                {
                  id: 3,
                  userId: 1,
                  itemId: 1,
                  type: 'phone',
                  createTime: new Date().toISOString()
                },
                {
                  id: 4,
                  userId: 1,
                  itemId: 7,
                  type: 'phone', 
                  createTime: new Date().toISOString()
                },
                {
                  id: 5,
                  userId: 1,
                  itemId: 3,
                  type: 'phone',
                  createTime: new Date().toISOString()
                }
              ]);
              console.log('收藏数据创建成功');
            }
          } catch (error) {
            console.error('创建收藏数据失败:', error);
          }
          
          // 创建公告数据
          try {
            if (!server.db.announcements.length) {
              server.db.announcements.insert(announcements || []);
              console.log('公告数据创建成功');
            }
          } catch (error) {
            console.error('创建公告数据失败:', error);
          }
          
          // 创建通知数据
          try {
            // 检查通知数据是否存在
            if (!server.db.notifications || !server.db.notifications.length) {
              server.db.notifications.insert([
                {
                  id: 1,
                  userId: 1,
                  title: '系统通知',
                  content: '欢迎使用智能手机评测论坛，请完善您的个人资料',
                  type: 'system',
                  isRead: false,
                  createTime: new Date('2023-09-25').toISOString(),
                  link: '/user-center'
                },
                {
                  id: 2,
                  userId: 1,
                  title: '新的评论',
                  content: '用户 <b>数码达人</b> 评论了您的帖子 <b>iPhone 15 Pro体验</b>',
                  type: 'comment',
                  isRead: true,
                  createTime: new Date('2023-09-23').toISOString(),
                  link: '/review/1'
                },
                {
                  id: 3,
                  userId: 1,
                  title: '点赞通知',
                  content: '用户 <b>手机迷</b> 点赞了您的评测 <b>华为Mate60 Pro实测</b>',
                  type: 'post_like',
                  isRead: false,
                  createTime: new Date('2023-09-21').toISOString(),
                  link: '/review/3'
                }
              ]);
              console.log('通知数据创建成功');
            }
          } catch (error) {
            console.error('创建通知数据失败:', error);
          }
          
          // 创建日志数据
          try {
            if (!server.db.logs.length) {
              server.db.logs.insert([
                {
                  id: 1,
                  type: 'user',
                  action: '注册',
                  description: '用户 admin 注册了新账号',
                  operator: 'admin',
                  createTime: new Date('2023-09-01').toISOString(),
                  ip: '127.0.0.1',
                  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                {
                  id: 2,
                  type: 'post',
                  action: '发布',
                  description: '用户 admin 发布了新帖子 "iPhone 15 Pro首发评测"',
                  operator: 'admin',
                  createTime: new Date('2023-09-20').toISOString(),
                  ip: '127.0.0.1',
                  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                {
                  id: 3,
                  type: 'comment',
                  action: '评论',
                  description: '用户 user 评论了帖子 "iPhone 15 Pro首发评测"',
                  operator: 'user',
                  createTime: new Date('2023-09-21').toISOString(),
                  ip: '127.0.0.1',
                  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
              ]);
              console.log('日志数据创建成功');
            }
          } catch (error) {
            console.error('创建日志数据失败:', error);
          }
          
          // 创建设置数据
          try {
            if (!server.db.settings.length) {
              server.db.settings.insert([
                {
                  id: 1,
                  siteName: '智能手机评测论坛',
                  siteDescription: '分享你的手机使用体验',
                  siteKeywords: '手机,评测,论坛,体验',
                  siteLogo: '/logo.png',
                  siteFavicon: '/favicon.ico',
                  allowRegister: true,
                  allowComment: true,
                  allowPost: true,
                  postReviewRequired: true,
                  commentReviewRequired: false,
                  maxPostLength: 5000,
                  maxCommentLength: 500,
                  maxImageSize: 5, // MB
                  allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif'],
                  maxUploadCount: 5,
                  defaultUserAvatar: '/default-avatar.png',
                  defaultPhoneImage: '/default-phone.png',
                  maintenanceMode: false,
                  maintenanceMessage: '系统维护中，请稍后再试',
                  contactEmail: 'admin@example.com',
                  contactPhone: '400-123-4567',
                  copyright: '© 2024 智能手机评测论坛. All rights reserved.',
                  icp: '京ICP备12345678号',
                  police: '京公网安备11010102001234号',
                  lastUpdateTime: new Date().toISOString()
                }
              ]);
              console.log('设置数据创建成功');
            }
          } catch (error) {
            console.error('创建设置数据失败:', error);
          }
          
        } catch (error) {
          console.error('初始化种子数据时出错:', error);
        }
      },

      routes() {
        try {
          console.log('配置API路由...');
          
          this.namespace = 'api';
          this.timing = 1000; // 增加响应延迟，模拟真实网络请求

          // 用户相关接口
          this.get('/user/info', (schema, request) => {
            try {
              console.log('用户信息请求:');
              // 检查用户是否登录
              let token = null;
              let userId = null;
              
              try {
                token = localStorage.getItem('token');
                userId = localStorage.getItem('userId');
              } catch (e) {
                console.warn('localStorage访问失败:', e);
              }
              
              if (!token) {
                return {
                  code: 401,
                  message: '请先登录'
                };
              }
              
              // 获取当前用户ID
              userId = userId ? parseInt(userId) : 1; // 默认返回ID为1的用户
              
              // 查找用户数据
              let user = null;
              try {
                user = schema.db.users.find(userId);
                if (!user && schema.db.users.length > 0) {
                  user = schema.db.users[0];
                }
              } catch (e) {
                console.error('用户数据查询失败:', e);
              }
              
              if (!user) {
                return {
                  code: 404,
                  message: '用户不存在'
                };
              }
              
              // 确保返回格式一致
              return {
                code: 200,
                message: '获取成功',
                data: {
                  id: user.id,
                  username: user.username || '用户',
                  email: user.email || 'user@example.com',
                  avatar: user.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
                  role: user.role || 'user',
                  status: user.status || 1,
                  bio: '这是一段个人简介',
                  phone: '13800138000',
                  wechatBound: false,
                  qqBound: false,
                  createTime: user.createTime || new Date().toISOString()
                }
              };
            } catch (error) {
              console.error('获取用户信息时出错:', error);
              return {
                code: 500,
                message: '服务器错误'
              };
            }
          });
          
          this.get('/user/stats', (schema, request) => {
            // 返回用户统计数据
            const userStats = {
              postsCount: 12,
              commentsCount: 48,
              likesCount: 128,
              followersCount: 34,
              followingCount: 56
            };
            
            return {
              code: 200,
              message: '获取成功',
              data: userStats
            };
          });

          this.post('/user/login', (schema, request) => {
            try {
              const attrs = JSON.parse(request.requestBody);
              const { username, password } = attrs;
              console.log('登录请求:', username);
              
              // 根据用户名查找对应的用户
              let user;

              if (username === 'admin') {
                // 查找管理员用户
                user = schema.db.users.findBy({ username: 'admin' });
                if (!user) {
                  // 如果没找到，指定返回第一个role为admin的用户
                  user = schema.db.users.findBy({ role: 'admin' });
                }
              } else if (username === 'user') {
                // 查找普通用户
                user = schema.db.users.findBy({ username: 'user' });
                if (!user) {
                  // 如果没找到，指定返回第一个role为user的用户
                  user = schema.db.users.findBy({ role: 'user' });
                }
              }
              
              // 输出查找到的用户信息
              if (user) {
                console.log('找到用户:', user.id, user.username, user.role);
              } else {
                console.log('未找到用户');
              }
              
              if (user && (password === 'password' || md5(password) === user.password)) {
                // 登录成功
                return {
                  code: 200,
                  message: '登录成功',
                  data: {
                    token: `mock-token-${user.id}-${Date.now()}`,
                    user: user
                  }
                };
              } else {
                // 登录失败
                return {
                  code: 401,
                  message: '用户名或密码错误'
                };
              }
            } catch (error) {
              console.error('登录处理出错:', error);
              return {
                code: 500,
                message: '服务器错误'
              };
            }
          });

          this.post('/user/register', (schema, request) => {
            const attrs = JSON.parse(request.requestBody);
            // 简单的注册验证
            return {
              code: 200,
              message: '注册成功'
            };
          });

          // 用户评测列表
          this.get('/user/posts', (schema, request) => {
            console.log('Mock API - 用户评测列表请求:', request.url);
            
            // 检查用户是否登录
            let token = null;
            let userId = null;
            
            try {
              token = localStorage.getItem('token');
              userId = localStorage.getItem('userId');
            } catch (e) {
              console.warn('localStorage访问失败:', e);
            }
            
            if (!token) {
              return {
                code: 401,
                message: '请先登录'
              };
            }
            
            // 获取当前用户ID
            userId = userId ? parseInt(userId) : 1; // 默认用户ID为1
            
            // 从URL或params获取分页参数
            let page = 1;
            let limit = 10;
            
            try {
              // 尝试从URL参数获取
              if (request.url && request.url.includes('?')) {
                const queryString = request.url.split('?')[1];
                const urlParams = new URLSearchParams(queryString);
                
                if (urlParams.has('page')) {
                  page = parseInt(urlParams.get('page') || '1');
                }
                
                if (urlParams.has('limit')) {
                  limit = parseInt(urlParams.get('limit') || '10');
                }
              }
              
              // 尝试从params对象获取
              if (request.queryParams) {
                if (request.queryParams.page) {
                  page = parseInt(request.queryParams.page);
                }
                
                if (request.queryParams.limit) {
                  limit = parseInt(request.queryParams.limit);
                }
              }
            } catch (error) {
              console.error('参数解析错误:', error);
              // 使用默认值
            }
            
            console.log('Mock API - 处理后的评测列表参数:', { page, limit, userId });
            
            // 查询用户发布的帖子
            const userPosts = schema.db.posts.where({ userId }).models || [];
            console.log(`找到用户ID=${userId}的评测数量:`, userPosts.length);
            
            // 如果没有找到评测，模拟一些数据
            if (userPosts.length === 0) {
              console.log('未找到用户评测，返回模拟数据');
              
              // 创建临时评测数据给当前用户
              const mockPosts = [];
              for (let i = 1; i <= 3; i++) {
                const modelId = i + 1;
                const model = schema.db.phoneModels.find(modelId);
                const brand = model && model.brandId ? schema.db.brands.find(model.brandId) : null;
                
                mockPosts.push({
                  id: 1000 + i,
                  userId: userId,
                  title: `${brand ? brand.name : '未知品牌'} ${model ? model.name : '未知型号'} 详细评测`,
                  content: `这是一个详细的${model ? model.name : '手机'}评测内容，包含了外观、性能、相机、电池等各方面的体验...`,
                  modelId: modelId,
                  model: model ? model.name : '未知型号',
                  brand: brand ? brand.name : '未知品牌',
                  createTime: new Date().toISOString(),
                  updateTime: new Date().toISOString(),
                  publishTime: new Date().toLocaleDateString(),
                  viewCount: Math.floor(Math.random() * 100),
                  likeCount: Math.floor(Math.random() * 30),
                  commentCount: Math.floor(Math.random() * 10),
                  status: 'published',
                  images: [
                    `https://img.alicdn.com/imgextra/i${i}/2088551213/O1CN01wBlMCX1TZiUiVCUAx_!!2088551213.jpg`
                  ],
                  route: `/review/${1000 + i}`,
                  detailUrl: `/review/${1000 + i}`, // 用于跳转的URL
                  rating: 4.5,
                  phoneInfo: {
                    id: modelId,
                    name: model ? model.name : '未知型号',
                    brand: brand ? brand.name : '未知品牌',
                    image: model && model.image ? model.image : `https://via.placeholder.com/300x300?text=${model ? model.name : 'Phone'}`
                  }
                });
              }
              
              // 返回模拟数据
              return {
                code: 200,
                message: '获取成功',
                data: {
                  records: mockPosts,
                  total: mockPosts.length,
                  page: page,
                  limit: limit
                }
              };
            }
            
            // 关联品牌和手机型号信息
            const postsWithDetails = userPosts.map(post => {
              const model = post.modelId ? schema.db.phoneModels.find(post.modelId) : null;
              const brand = model && model.brandId ? schema.db.brands.find(model.brandId) : null;
              
              return {
                ...post,
                model: model ? model.name : '未知型号',
                brand: brand ? brand.name : '未知品牌',
                publishTime: new Date(post.createTime || Date.now()).toLocaleDateString(),
                viewCount: post.views || 0,
                likeCount: post.likes || 0,
                commentCount: post.comments || 0,
                status: Math.random() > 0.8 ? 'draft' : 'published', // 随机一部分是草稿
                route: `/review/${post.id}`,
                detailUrl: `/review/${post.id}`, // 用于跳转的URL
                phoneInfo: {
                  id: post.modelId,
                  name: model ? model.name : '未知型号',
                  brand: brand ? brand.name : '未知品牌',
                  image: model && model.image ? model.image : post.images && post.images.length > 0 ? post.images[0] : `https://via.placeholder.com/300x300?text=Phone`
                }
              };
            });
            
            // 分页处理
            const startIndex = (page - 1) * limit;
            const paginatedPosts = postsWithDetails.slice(startIndex, startIndex + limit);
            
            console.log(`返回${paginatedPosts.length}条评测数据`);
            
            return {
              code: 200,
              message: '获取成功',
              data: {
                records: paginatedPosts,
                total: userPosts.length,
                page: page,
                limit: limit
              }
            };
          });
          
          // 用户收藏的评测
          this.get('/user/favorites', (schema, request) => {
            try {
              // 获取请求URL
              console.log('收藏列表请求URL:', request.url);
              const url = new URL(request.url, 'http://localhost');
              
              // 从URL参数中获取类型
              const type = url.searchParams.get('type') || 'post';
              console.log('收藏列表类型:', type);
              
              // 获取用户ID
              const userId = localStorage.getItem('userId') || 1;
              
              // 根据类型返回不同的收藏数据
              if (type === 'phone') {
                // 为手机类型总是返回固定的收藏手机数据，确保页面有内容显示
                console.log('返回固定的收藏手机数据');
                return [
                  {
                    id: 1,
                    name: 'iPhone 15 Pro Max',
                    brand: 'Apple',
                    brandId: 1,
                    modelId: 1,
                    image: 'https://via.placeholder.com/300x300?text=iPhone+15',
                    price: 9999,
                    releaseDate: '2023-09-15',
                    rating: 4.8,
                    specs: {
                      screen: '6.7英寸',
                      processor: 'A17 Pro',
                      camera: '48MP主摄',
                      battery: '4400mAh'
                    }
                  },
                  {
                    id: 2,
                    name: 'Mate 60 Pro',
                    brand: 'Huawei',
                    brandId: 2,
                    modelId: 7,
                    image: 'https://via.placeholder.com/300x300?text=Mate+60+Pro',
                    price: 6999,
                    releaseDate: '2023-08-29',
                    rating: 4.7,
                    specs: {
                      screen: '6.8英寸',
                      processor: '麒麟9000s',
                      camera: '50MP主摄',
                      battery: '5000mAh'
                    }
                  },
                  {
                    id: 3,
                    name: 'Galaxy S23 Ultra',
                    brand: 'Samsung',
                    brandId: 3,
                    modelId: 12,
                    image: 'https://via.placeholder.com/300x300?text=S23+Ultra',
                    price: 8999,
                    releaseDate: '2023-02-01',
                    rating: 4.6,
                    specs: {
                      screen: '6.8英寸',
                      processor: '骁龙8 Gen 2',
                      camera: '200MP主摄',
                      battery: '5000mAh'
                    }
                  }
                ];
              } else if (type === 'post') {
                // 处理收藏帖子的逻辑...
                // 保持原有逻辑不变
                
                const favoriteItemIds = [1, 3, 5]; // 模拟收藏的帖子ID
                const favoriteItems = [];
                
                for (const itemId of favoriteItemIds) {
                  const post = schema.db.posts.find(itemId);
                  if (post) {
                    const user = schema.db.users.find(post.userId);
                    favoriteItems.push({
                      id: post.id,
                      title: post.title,
                      cover: post.images && post.images.length > 0 ? post.images[0] : 'https://via.placeholder.com/300x200?text=No+Image',
                      author: user ? user.username : '未知用户',
                      collectTime: new Date(post.createTime || Date.now()).toLocaleDateString(),
                      content: post.content.substring(0, 100) + '...'
                    });
                  }
                }
                
                return {
                  code: 200,
                  message: '获取成功',
                  data: favoriteItems
                };
              }
              
              return {
                code: 400,
                message: '无效的收藏类型',
                data: []
              };
            } catch (error) {
              console.error('处理收藏列表请求时出错:', error);
              return {
                code: 500,
                message: '服务器错误'
              };
            }
          });

          // 评测帖子相关接口
          this.get('/posts', (schema, request) => {
            const { page = 1, limit = 10, userId, phoneModelId, keyword, sortBy = 'createTime', sortOrder = 'desc' } = request.queryParams
            
            // 获取所有帖子
            let posts = schema.db.posts.where({})
            
            // 根据参数筛选
            if (userId) {
              posts = posts.filter(post => post.userId === parseInt(userId))
            }
            
            if (phoneModelId) {
              posts = posts.filter(post => post.modelId === parseInt(phoneModelId))
            }
            
            if (keyword) {
              const lowerKeyword = keyword.toLowerCase()
              posts = posts.filter(post => 
                post.title.toLowerCase().includes(lowerKeyword) || 
                post.content.toLowerCase().includes(lowerKeyword)
              )
            }
            
            // 获取总数
            const total = posts.length
            
            // 排序
            const sortFn = (a, b) => {
              if (sortBy === 'createTime') {
                return sortOrder === 'desc' ? 
                  new Date(b.createTime) - new Date(a.createTime) : 
                  new Date(a.createTime) - new Date(b.createTime)
              } else if (sortBy === 'likes') {
                return sortOrder === 'desc' ? b.likes - a.likes : a.likes - b.likes
              } else if (sortBy === 'views') {
                return sortOrder === 'desc' ? b.views - a.views : a.views - b.views
              }
              return 0
            }
            
            posts = posts.sort(sortFn)
            
            // 分页
            const pageInt = parseInt(page)
            const limitInt = parseInt(limit)
            const start = (pageInt - 1) * limitInt
            const end = start + limitInt
            const paginatedPosts = posts.slice(start, end)
            
            // 关联用户信息和手机信息
            const extendedPosts = paginatedPosts.map(post => {
              const user = schema.db.users.find(post.userId)
              const phoneModel = schema.db.phoneModels.find(post.modelId)
              const brand = phoneModel ? schema.db.brands.find(phoneModel.brandId) : null
              
              // 模拟是否点赞和收藏状态
              const isLiked = Math.random() > 0.5
              const isFavorited = Math.random() > 0.7
              
              return {
                ...post,
                username: user ? user.username : 'Unknown User',
                userAvatar: user ? user.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
                brand: brand ? brand.name : '',
                phoneModel: phoneModel ? phoneModel.name : '',
                model: phoneModel ? phoneModel.name : '',  // 为了兼容性同时提供model字段
                brandId: brand ? brand.id : null,
                modelId: phoneModel ? phoneModel.id : null,
                isLiked: isLiked,
                isFavorited: isFavorited,
                likeCount: post.likes || 0,
                commentCount: post.comments || 0,
                favoriteCount: post.favorites || 0
              }
            })
            
            return {
              code: 200,
              message: '获取评测列表成功',
              data: {
                records: extendedPosts,
                total,
                page: pageInt,
                limit: limitInt
              }
            }
          });

          // 获取评测详情
          this.get('/posts/:id', (schema, request) => {
            const id = parseInt(request.params.id)
            const post = schema.db.posts.find(id)
            
            if (!post) {
              return {
                code: 404,
                message: '评测不存在'
              }
            }
            
            // 增加浏览次数
            post.views = (post.views || 0) + 1
            schema.db.posts.update(id, post)
            
            // 关联用户和手机信息
            const user = schema.db.users.find(post.userId)
            const phoneModel = schema.db.phoneModels.find(post.modelId)
            const brand = phoneModel ? schema.db.brands.find(phoneModel.brandId) : null
            
            // 获取用户是否已点赞或收藏
            // 这里只是模拟，实际应该根据当前登录用户状态返回
            const isLiked = Math.random() > 0.5
            const isFavorited = Math.random() > 0.7
            
            const postWithDetails = {
              ...post,
              username: user ? user.username : 'Unknown User',
              userAvatar: user ? user.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
              brand: brand ? brand.name : '',
              phoneModel: phoneModel ? phoneModel.name : '',
              model: phoneModel ? phoneModel.name : '',  // 为了兼容性同时提供model字段
              brandId: brand ? brand.id : null,
              modelId: phoneModel ? phoneModel.id : null,
              isLiked: isLiked,
              isFavorited: isFavorited,
              likeCount: post.likes || 0,
              commentCount: post.comments || 0,
              favoriteCount: post.favorites || 0
            }
            
            return {
              code: 200,
              message: '获取评测详情成功',
              data: postWithDetails
            }
          });

          this.post('/posts', (schema, request) => {
            // 新建评测
            return {
              code: 200,
              message: '发布成功',
              data: {
                id: 7 // 新评测ID
              }
            };
          });

          this.post('/posts/:id/like', (schema, request) => {
            const id = request.params.id;
            const post = schema.db.posts.find(id);
            
            if (!post) {
              return {
                code: 404,
                message: '评测不存在'
              };
            }
            
            // 模拟增加点赞
            post.likes += 1;
            schema.db.posts.update(id, post);
            
            return {
              code: 200,
              message: '点赞成功'
            };
          });

          this.delete('/posts/:id/like', (schema, request) => {
            const id = request.params.id;
            const post = schema.db.posts.find(id);
            
            if (!post) {
              return {
                code: 404,
                message: '评测不存在'
              };
            }
            
            // 模拟取消点赞
            post.likes = Math.max(0, post.likes - 1);
            schema.db.posts.update(id, post);
            
            return {
              code: 200,
              message: '取消点赞成功'
            };
          });

          // 评论相关接口
          this.get('/posts/:id/comments', (schema, request) => {
            const postId = parseInt(request.params.id);
            const { page = 1, limit = 20 } = request.queryParams;
            
            // 获取所有该帖子的评论
            const comments = schema.db.comments.where({ postId });
            const total = comments.length;
            
            // 关联用户信息
            const commentsWithUser = comments.map(comment => {
              const userId = parseInt(comment.userId);
              const user = schema.db.users.findBy({ id: userId });
              
              return {
                ...comment,
                username: user?.username || 'Unknown User',
                userAvatar: user?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
                // 保留 user 对象以保持向后兼容性
                user: user ? {
                  id: user.id,
                  username: user.username,
                  avatar: user.avatar
                } : null
              };
            });
            
            return {
              code: 200,
              message: '获取成功',
              data: {
                list: commentsWithUser,
                total,
                page: parseInt(page),
                limit: parseInt(limit)
              }
            };
          });

          this.post('/posts/:postId/comments', (schema, request) => {
            const postId = parseInt(request.params.postId);
            const attrs = JSON.parse(request.requestBody);
            const { content } = attrs;
            
            // 模拟添加评论
            const post = schema.db.posts.find(postId);
            
            if (!post) {
              return {
                code: 404,
                message: '评测不存在'
              };
            }
            
            // 更新评论数
            post.comments += 1;
            schema.db.posts.update(postId, post);
            
            // 创建新评论
            const newComment = {
              id: schema.db.comments.length + 1,
              postId,
              userId: 1, // 假设是当前登录用户
              content,
              createTime: new Date().toISOString(),
              likes: 0
            };
            
            schema.db.comments.insert(newComment);
            
            // 获取用户信息
            const user = schema.db.users.find(1);
            
            return {
              code: 200,
              message: '评论成功',
              data: {
                ...newComment,
                user: {
                  id: user.id,
                  username: user.username,
                  avatar: user.avatar
                }
              }
            };
          });

          // 手机品牌和型号相关API
          this.get('/brands', (schema) => {
            const brands = schema.db.brands;
            
            console.log('Mock服务器返回品牌数据:', brands);
            
            return {
              code: 200,
              message: '获取品牌列表成功',
              data: brands
            };
          });
          
          this.get('/brands/:id/models', (schema, request) => {
            const brandId = parseInt(request.params.id);
            const phoneModels = schema.db.phoneModels.filter(model => model.brandId === brandId);
            
            console.log(`获取品牌(ID=${brandId})的型号列表:`, { count: phoneModels.length });
            
            return {
              code: 200,
              message: '获取品牌型号列表成功',
              data: phoneModels
            };
          });
          
          this.get('/phones', (schema) => {
            const phoneModels = schema.db.phoneModels;
            
            return {
              code: 200,
              message: '获取手机型号列表成功',
              data: phoneModels
            };
          });
          
          this.get('/phones/hot', (schema) => {
            // 选择几个热门型号
            const hotPhoneIds = [1, 3, 5, 7, 9];
            const hotPhones = schema.db.phoneModels.filter(model => hotPhoneIds.includes(model.id));
            
            return {
              code: 200,
              message: '获取热门手机型号成功',
              data: hotPhones
            };
          });

          // 公告相关接口
          this.get('/announcements', (schema, request) => {
            return {
              code: 200,
              message: '获取成功',
              data: schema.db.announcements
            };
          });

          // 搜索接口
          this.get('/search/posts', (schema, request) => {
            const { keyword } = request.queryParams;
            let results = schema.db.posts;
            
            if (keyword) {
              results = results.filter(post => 
                post.title.includes(keyword) || post.content.includes(keyword)
              );
            }
            
            // 关联用户和手机信息
            const postsWithDetails = results.map(post => {
              const user = schema.db.users.find(u => u.id === post.userId);
              const brand = schema.db.brands.find(b => b.id === post.brandId);
              const model = schema.db.phoneModels.find(m => m.id === post.modelId);
              
              return {
                ...post,
                user: {
                  id: user.id,
                  username: user.username,
                  avatar: user.avatar
                },
                brand: brand.name,
                phoneModel: model.name
              };
            });
            
            return {
              code: 200,
              message: '搜索成功',
              data: postsWithDetails
            };
          });

          // 通知相关接口
          this.get('/notifications', (schema, request) => {
            const { page = 1, pageSize = 10 } = request.queryParams;
            
            // 获取当前用户的通知
            let userNotifications = schema.db.notifications.filter(n => n.userId === 1);
            
            // 按时间排序（最新的在前）
            userNotifications = userNotifications.sort((a, b) => 
              new Date(b.createTime) - new Date(a.createTime)
            );
            
            // 分页
            const start = (page - 1) * pageSize;
            const end = start + parseInt(pageSize);
            const paginatedNotifications = userNotifications.slice(start, end);
            
            return {
              code: 200,
              message: '获取成功',
              data: {
                records: paginatedNotifications,
                total: userNotifications.length,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
              }
            };
          });
          
          this.get('/notifications/unread-count', (schema, request) => {
            try {
              console.log('获取未读通知数量请求');
              
              // 检查用户是否登录
              if (!localStorage.getItem('token')) {
                return {
                  code: 401,
                  message: '请先登录'
                };
              }
              
              // 获取当前用户ID
              const userIdStr = localStorage.getItem('userId');
              const userId = userIdStr ? parseInt(userIdStr) : 1; // 默认用户ID为1
              
              // 如果通知表不存在或为空，返回0
              if (!schema.db.notifications) {
                console.log('通知表不存在，返回0');
                return {
                  code: 200,
                  message: '获取成功',
                  data: 0
                };
              }
              
              // 获取未读通知数量
              const unreadNotifications = schema.db.notifications.where(n => !n.isRead && n.userId === userId);
              const unreadCount = unreadNotifications ? unreadNotifications.length : 0;
              
              console.log(`未读通知数量: ${unreadCount}, 用户ID: ${userId}`);
              
              return {
                code: 200,
                message: '获取成功',
                data: unreadCount
              };
            } catch (error) {
              console.error('获取未读通知数量出错:', error);
              return {
                code: 200,
                message: '获取成功',
                data: 0
              };
            }
          });
          
          this.put('/notifications/:id/read', (schema, request) => {
            const notificationId = parseInt(request.params.id);
            
            // 标记单条通知为已读
            const notification = schema.db.notifications.find(notificationId);
            if (notification) {
              notification.isRead = true;
              schema.db.notifications.update(notificationId, notification);
            }
            
            return {
              code: 200,
              message: '标记已读成功'
            };
          });
          
          this.put('/notifications/read-all', (schema, request) => {
            // 标记所有通知为已读
            const userNotifications = schema.db.notifications.filter(n => n.userId === 1);
            
            userNotifications.forEach(notification => {
              notification.isRead = true;
              schema.db.notifications.update(notification.id, notification);
            });
            
            return {
              code: 200,
              message: '全部标记已读成功'
            };
          });
          
          this.delete('/notifications/:id', (schema, request) => {
            const notificationId = parseInt(request.params.id);
            
            // 删除通知
            schema.db.notifications.remove(notificationId);
            
            return {
              code: 200,
              message: '删除成功'
            };
          });

          // 收藏评测
          this.post('/posts/:id/favorite', (schema, request) => {
            const id = request.params.id;
            const post = schema.db.posts.find(id);
            
            if (!post) {
              return {
                code: 404,
                message: '评测不存在'
              };
            }
            
            // 模拟收藏成功
            post.favorites = (post.favorites || 0) + 1;
            schema.db.posts.update(id, post);
            
            return {
              code: 200,
              message: '收藏成功'
            };
          });
          
          // 取消收藏
          this.delete('/posts/:id/favorite', (schema, request) => {
            const id = request.params.id;
            const post = schema.db.posts.find(id);
            
            if (!post) {
              return {
                code: 404,
                message: '评测不存在'
              };
            }
            
            // 模拟取消收藏
            post.favorites = Math.max(0, (post.favorites || 0) - 1);
            schema.db.posts.update(id, post);
            
            return {
              code: 200,
              message: '取消收藏成功'
            };
          });
          
          // 取消收藏（POST方法版本）
          this.post('/posts/:id/unfavorite', (schema, request) => {
            const id = request.params.id;
            const post = schema.db.posts.find(id);
            
            if (!post) {
              return {
                code: 404,
                message: '评测不存在'
              };
            }
            
            // 模拟取消收藏
            post.favorites = Math.max(0, (post.favorites || 0) - 1);
            schema.db.posts.update(id, post);
            
            return {
              code: 200,
              message: '取消收藏成功'
            };
          });

          // ========== 管理接口 ==========
          
          // 管理仪表盘统计数据API
          this.get('/admin/statistics', (schema, request) => {
            // 获取所有数据
            const users = schema.db.users.all();
            const posts = schema.db.posts.all();
            const comments = schema.db.comments.all();
            const brands = schema.db.brands.all();
            const models = schema.db.phoneModels.all();
            
            // 计算统计数据
            const stats = {
              // 基础数据统计
              userCount: users.length,
              postCount: posts.length,
              commentCount: comments.length,
              brandCount: brands.length,
              modelCount: models.length,
              
              // 用户相关统计
              activeUsers: users.filter(u => u.status === 1).length,
              adminUsers: users.filter(u => u.role === 'admin').length,
              newUsers: users.filter(u => {
                const createTime = new Date(u.createTime);
                const now = new Date();
                return (now - createTime) <= 7 * 24 * 60 * 60 * 1000; // 7天内
              }).length,
              
              // 内容相关统计
              activePosts: posts.filter(p => p.status === 1).length,
              pendingPosts: posts.filter(p => p.status === 0).length,
              rejectedPosts: posts.filter(p => p.status === 2).length,
              totalViews: posts.reduce((sum, p) => sum + (p.viewCount || 0), 0),
              totalLikes: posts.reduce((sum, p) => sum + (p.likeCount || 0), 0),
              
              // 品牌相关统计
              activeBrands: brands.filter(b => b.status === 1).length,
              activeModels: models.filter(m => m.status === 1).length,
              
              // 最近数据
              recentPosts: posts
                .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
                .slice(0, 5)
                .map(p => ({
                  id: p.id,
                  title: p.title,
                  createTime: p.createTime,
                  status: p.status,
                  viewCount: p.viewCount || 0,
                  likeCount: p.likeCount || 0
                })),
              
              recentComments: comments
                .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
                .slice(0, 5)
                .map(c => ({
                  id: c.id,
                  content: c.content,
                  createTime: c.createTime,
                  status: c.status
                })),
              
              recentUsers: users
                .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
                .slice(0, 5)
                .map(u => ({
                  id: u.id,
                  username: u.username,
                  createTime: u.createTime,
                  status: u.status
                })),
              
              // 热门数据
              hotPosts: posts
                .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                .slice(0, 5)
                .map(p => ({
                  id: p.id,
                  title: p.title,
                  viewCount: p.viewCount || 0,
                  likeCount: p.likeCount || 0
                })),
              
              hotBrands: brands
                .sort((a, b) => (b.modelCount || 0) - (a.modelCount || 0))
                .slice(0, 5)
                .map(b => ({
                  id: b.id,
                  name: b.name,
                  modelCount: b.modelCount || 0
                })),
              
              // 评分统计
              ratingDistribution: {
                1: 0, 2: 0, 3: 0, 4: 0, 5: 0
              }
            };
            
            // 计算评分分布
            posts.forEach(post => {
              if (post.rating) {
                stats.ratingDistribution[post.rating]++;
              }
            });
            
            // 返回统计结果
            return {
              code: 200,
              data: stats
            };
          });
          
          // 用户管理接口
          this.get('/admin/users', (schema, request) => {
            const { page = 1, pageSize = 10, keyword = '' } = request.queryParams;
            
            let users = schema.db.users;
            
            // 应用搜索条件
            if (keyword) {
              users = users.filter(user => 
                user.username.includes(keyword) || 
                user.email.includes(keyword)
              );
            }
            
            // 计算分页
            const total = users.length;
            const start = (page - 1) * pageSize;
            const end = start + parseInt(pageSize);
            const records = users.slice(start, end);
            
            return {
              code: 200,
              message: '获取用户列表成功',
              data: {
                records,
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
              }
            };
          });
          
          this.post('/admin/users', (schema, request) => {
            const body = JSON.parse(request.requestBody);
            
            // 验证邮箱是否已存在
            const existingUser = schema.db.users.findBy({ email: body.email });
            if (existingUser) {
              return {
                code: 400,
                message: '该邮箱已被注册'
              };
            }
            
            const user = {
              id: schema.db.users.length + 1,
              ...body,
              password: md5(body.password),
              createTime: new Date().toISOString().split('T')[0],
              postCount: 0,
              followerCount: 0,
              followingCount: 0
            };
            
            schema.db.users.insert(user);
            
            return {
              code: 200,
              message: '添加用户成功',
              data: user
            };
          });
          
          this.put('/admin/users/:id', (schema, request) => {
            const id = request.params.id;
            const body = JSON.parse(request.requestBody);
            const user = schema.db.users.find(id);
            
            if (!user) {
              return {
                code: 404,
                message: '用户不存在'
              };
            }
            
            // 如果没有提供密码则不更新密码
            if (!body.password) {
              delete body.password;
            } else {
              body.password = md5(body.password);
            }
            
            const updatedUser = {
              ...user,
              ...body
            };
            
            schema.db.users.update(id, updatedUser);
            
            return {
              code: 200,
              message: '更新用户成功',
              data: updatedUser
            };
          });
          
          this.delete('/admin/users/:id', (schema, request) => {
            const id = request.params.id;
            const user = schema.db.users.find(id);
            
            if (!user) {
              return {
                code: 404,
                message: '用户不存在'
              };
            }
            
            // 不允许删除管理员
            if (user.role === 'admin') {
              return {
                code: 403,
                message: '不能删除管理员账户'
              };
            }
            
            schema.db.users.remove(id);
            
            return {
              code: 200,
              message: '删除用户成功'
            };
          });
          
          this.put('/admin/users/:id/status', (schema, request) => {
            const id = request.params.id;
            const { status } = JSON.parse(request.requestBody);
            const user = schema.db.users.find(id);
            
            if (!user) {
              return {
                code: 404,
                message: '用户不存在'
              };
            }
            
            // 不允许禁用管理员
            if (user.role === 'admin' && status === 0) {
              return {
                code: 403,
                message: '不能禁用管理员账户'
              };
            }
            
            // 更新用户状态
            schema.db.users.update(id, { status });
            
            // 检查当前登录用户是否为被操作用户，如果是且被禁用，则清除登录状态
            try {
              const currentUserId = localStorage.getItem('userId');
              if (currentUserId && parseInt(currentUserId) === parseInt(id) && status === 0) {
                console.log('当前登录用户被禁用，清除登录状态');
                // 清除登录状态，模拟强制登出
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // 不删除userId，以便于测试时查看效果
              }
            } catch (error) {
              console.error('检查登录状态出错:', error);
            }
            
            // 返回操作结果
            return {
              code: 200,
              message: status === 1 ? '启用用户成功' : '禁用用户成功',
              data: {
                id: parseInt(id),
                status,
                affectsCurrentUser: parseInt(localStorage.getItem('userId')) === parseInt(id)
              }
            };
          });
          
          // 更新用户禁言状态
          this.put('/admin/users/:id/mute', (schema, request) => {
            const id = request.params.id;
            const { isMuted } = JSON.parse(request.requestBody);
            const user = schema.db.users.find(id);
            
            if (!user) {
              return {
                code: 404,
                message: '用户不存在'
              };
            }
            
            // 不允许禁言管理员
            if (user.role === 'admin' && isMuted) {
              return {
                code: 403,
                message: '不能禁言管理员账户'
              };
            }
            
            schema.db.users.update(id, { isMuted });
            
            return {
              code: 200,
              message: isMuted ? '禁言用户成功' : '解除禁言成功'
            };
          });
          
          // 帖子管理API
          this.get('/admin/posts', (schema, request) => {
            const { page = 1, pageSize = 10, keyword = '', status = '' } = request.queryParams;
            
            let posts = schema.db.posts;
            
            // 应用搜索条件
            if (keyword) {
              posts = posts.filter(post => 
                post.title.includes(keyword) || 
                post.content.includes(keyword)
              );
            }
            
            // 根据状态筛选
            if (status !== '') {
              posts = posts.filter(post => post.status === parseInt(status));
            }
            
            // 获取用户信息和手机信息
            const records = posts.map(post => {
              const user = schema.db.users.find(post.userId);
              const brand = schema.db.brands.find(post.brandId);
              const phoneModel = schema.db.phoneModels.find(post.modelId);
              
              return {
                ...post,
                username: user ? user.username : '未知用户',
                userAvatar: user ? user.avatar : '',
                brand: brand ? brand.name : '未知品牌',
                phoneModel: phoneModel ? phoneModel.name : '未知型号'
              };
            }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
            
            // 计算分页
            const total = records.length;
            const start = (page - 1) * pageSize;
            const end = start + parseInt(pageSize);
            const paginatedRecords = records.slice(start, end);
            
            return {
              code: 200,
              message: '获取帖子列表成功',
              data: {
                records: paginatedRecords,
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
              }
            };
          });
          
          // 获取帖子评论
          this.get('/admin/posts/:id/comments', (schema, request) => {
            const postId = request.params.id;
            const post = schema.db.posts.find(postId);
            
            if (!post) {
              return {
                code: 404,
                message: '帖子不存在'
              };
            }
            
            const comments = schema.db.comments.filter(comment => comment.postId === parseInt(postId));
            
            // 获取用户信息
            const commentsWithUser = comments.map(comment => {
              const user = schema.db.users.find(comment.userId);
              
              return {
                ...comment,
                username: user ? user.username : '未知用户',
                userAvatar: user ? user.avatar : ''
              };
            }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
            
            return {
              code: 200,
              message: '获取帖子评论成功',
              data: commentsWithUser
            };
          });
          
          // 删除帖子
          this.delete('/admin/posts/:id', (schema, request) => {
            const id = request.params.id;
            const post = schema.db.posts.find(id);
            
            if (!post) {
              return {
                code: 404,
                message: '帖子不存在'
              };
            }
            
            // 删除帖子相关的评论
            schema.db.comments.where({ postId: parseInt(id) }).forEach(comment => {
              schema.db.comments.remove(comment.id);
            });
            
            // 删除帖子
            schema.db.posts.remove(id);
            
            return {
              code: 200,
              message: '删除帖子成功'
            };
          });
          
          // 更新帖子状态
          this.put('/admin/posts/:id/status', (schema, request) => {
            const id = request.params.id;
            const { status, reason } = JSON.parse(request.requestBody);
            const post = schema.db.posts.find(id);
            
            if (!post) {
              return {
                code: 404,
                message: '帖子不存在'
              };
            }
            
            // 更新帖子状态
            schema.db.posts.update(id, { 
              status,
              reviewTime: new Date().toISOString(),
              reviewReason: reason
            });
            
            // 如果是审核通过，增加帖子的可见性
            if (status === 1) {
              schema.db.posts.update(id, {
                isVisible: true,
                publishTime: new Date().toISOString()
              });
            }
            
            // 返回操作结果
            return {
              code: 200,
              message: status === 1 ? '审核通过成功' : '审核拒绝成功',
              data: {
                id: parseInt(id),
                status,
                reviewTime: new Date().toISOString(),
                reviewReason: reason,
                isVisible: status === 1
              }
            };
          });
          
          // 评论管理API
          this.get('/admin/comments', (schema, request) => {
            const { page = 1, pageSize = 10, keyword = '', status = '' } = request.queryParams;
            
            let comments = schema.db.comments;
            
            // 应用搜索条件
            if (keyword) {
              comments = comments.filter(comment => 
                comment.content.includes(keyword)
              );
            }
            
            // 根据状态筛选
            if (status !== '') {
              comments = comments.filter(comment => comment.status === status);
            }
            
            // 获取用户信息和帖子信息
            const records = comments.map(comment => {
              const user = schema.db.users.find(comment.userId);
              const post = schema.db.posts.find(comment.postId);
              
              return {
                ...comment,
                username: user ? user.username : '未知用户',
                userAvatar: user ? user.avatar : '',
                postTitle: post ? post.title : '未知帖子',
                status: comment.status || 'pending' // 确保状态字段存在
              };
            }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
            
            // 计算分页
            const total = records.length;
            const start = (page - 1) * pageSize;
            const end = start + parseInt(pageSize);
            const paginatedRecords = records.slice(start, end);
            
            return {
              code: 200,
              message: '获取评论列表成功',
              data: {
                records: paginatedRecords,
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
              }
            };
          });
          
          // 删除评论
          this.delete('/admin/comments/:id', (schema, request) => {
            const id = request.params.id;
            const comment = schema.db.comments.find(id);
            
            if (!comment) {
              return {
                code: 404,
                message: '评论不存在'
              };
            }
            
            // 更新帖子评论数
            const postId = comment.postId;
            const post = schema.db.posts.find(postId);
            if (post) {
              schema.db.posts.update(postId, {
                comments: Math.max(0, post.comments - 1)
              });
            }
            
            // 删除评论
            schema.db.comments.remove(id);
            
            return {
              code: 200,
              message: '删除评论成功'
            };
          });
          
          // 更新评论状态
          this.put('/admin/comments/:id/status', (schema, request) => {
            const id = request.params.id;
            const { status, reason, notifyUser } = JSON.parse(request.requestBody);
            const comment = schema.db.comments.find(id);
            
            if (!comment) {
              return {
                code: 404,
                message: '评论不存在'
              };
            }
            
            // 更新评论状态
            schema.db.comments.update(id, { 
              status,
              reviewTime: new Date().toISOString(),
              reviewReason: reason || ''
            });
            
            return {
              code: 200,
              message: status === 'approved' ? '评论审核通过成功' : '评论拒绝成功',
              data: {
                id: parseInt(id),
                status,
                reviewTime: new Date().toISOString(),
                reviewReason: reason || ''
              }
            };
          });
          
          // 公告管理API
          this.get('/admin/announcements', (schema, request) => {
            const { page = 1, pageSize = 10, keyword = '' } = request.queryParams;
            
            let announcements = schema.db.announcements || [];
            
            // 应用搜索条件
            if (keyword) {
              announcements = announcements.filter(announcement => 
                announcement.title.includes(keyword) || 
                announcement.content.includes(keyword)
              );
            }
            
            // 计算分页
            const total = announcements.length;
            const start = (page - 1) * pageSize;
            const end = start + parseInt(pageSize);
            const records = announcements.slice(start, end);
            
            return {
              code: 200,
              message: '获取公告列表成功',
              data: {
                records,
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
              }
            };
          });
          
          // 添加公告
          this.post('/admin/announcements', (schema, request) => {
            const announcement = JSON.parse(request.requestBody);
            const now = new Date().toISOString();
            
            // 创建新公告
            const id = schema.db.announcements.insert({
              ...announcement,
              createTime: now,
              updateTime: now,
              status: 1,
              isVisible: true,
              viewCount: 0
            });
            
            // 返回操作结果
            return {
              code: 200,
              message: '发布公告成功',
              data: { 
                id,
                createTime: now,
                status: 1,
                isVisible: true
              }
            };
          });
          
          // 更新公告
          this.put('/admin/announcements/:id', (schema, request) => {
            const id = request.params.id;
            const body = JSON.parse(request.requestBody);
            const announcement = schema.db.announcements.find(id);
            
            if (!announcement) {
              return {
                code: 404,
                message: '公告不存在'
              };
            }
            
            const updatedAnnouncement = {
              ...announcement,
              ...body,
              updateTime: new Date().toISOString()
            };
            
            schema.db.announcements.update(id, updatedAnnouncement);
            
            return {
              code: 200,
              message: '更新公告成功',
              data: updatedAnnouncement
            };
          });
          
          // 删除公告
          this.delete('/admin/announcements/:id', (schema, request) => {
            const id = request.params.id;
            const announcement = schema.db.announcements.find(id);
            
            if (!announcement) {
              return {
                code: 404,
                message: '公告不存在'
              };
            }
            
            schema.db.announcements.remove(id);
            
            return {
              code: 200,
              message: '删除公告成功'
            };
          });
          
          // 手机型号管理API
          this.get('/admin/phones', (schema, request) => {
            const { page = 1, pageSize = 10, keyword = '', brandId = '' } = request.queryParams;
            
            let phoneModels = schema.db.phoneModels;
            
            // 按品牌筛选
            if (brandId) {
              phoneModels = phoneModels.filter(model => model.brandId === parseInt(brandId));
            }
            
            // 应用搜索条件
            if (keyword) {
              phoneModels = phoneModels.filter(model => 
                model.name.includes(keyword) || 
                model.description.includes(keyword)
              );
            }
            
            // 获取品牌信息
            const records = phoneModels.map(model => {
              const brand = schema.db.brands.find(model.brandId);
              
              return {
                ...model,
                brandName: brand ? brand.name : '未知品牌'
              };
            });
            
            // 计算分页
            const total = records.length;
            const start = (page - 1) * pageSize;
            const end = start + parseInt(pageSize);
            const paginatedRecords = records.slice(start, end);
            
            return {
              code: 200,
              message: '获取手机型号列表成功',
              data: {
                records: paginatedRecords,
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
              }
            };
          });
          
          // 添加手机型号
          this.post('/admin/phones', (schema, request) => {
            const body = JSON.parse(request.requestBody);
            
            // 验证品牌是否存在
            const brand = schema.db.brands.find(body.brandId);
            if (!brand) {
              return {
                code: 400,
                message: '品牌不存在'
              };
            }
            
            const phoneModel = {
              id: schema.db.phoneModels.length + 1,
              ...body,
              createTime: new Date().toISOString()
            };
            
            schema.db.phoneModels.insert(phoneModel);
            
            return {
              code: 200,
              message: '添加手机型号成功',
              data: phoneModel
            };
          });
          
          // 更新手机型号
          this.put('/admin/phones/:id', (schema, request) => {
            const id = request.params.id;
            const body = JSON.parse(request.requestBody);
            const phoneModel = schema.db.phoneModels.find(id);
            
            if (!phoneModel) {
              return {
                code: 404,
                message: '手机型号不存在'
              };
            }
            
            // 验证品牌是否存在
            if (body.brandId) {
              const brand = schema.db.brands.find(body.brandId);
              if (!brand) {
                return {
                  code: 400,
                  message: '品牌不存在'
                };
              }
            }
            
            const updatedPhoneModel = {
              ...phoneModel,
              ...body
            };
            
            schema.db.phoneModels.update(id, updatedPhoneModel);
            
            return {
              code: 200,
              message: '更新手机型号成功',
              data: updatedPhoneModel
            };
          });
          
          // 删除手机型号
          this.delete('/admin/phones/:id', (schema, request) => {
            const id = request.params.id;
            const phoneModel = schema.db.phoneModels.find(id);
            
            if (!phoneModel) {
              return {
                code: 404,
                message: '手机型号不存在'
              };
            }
            
            // 检查是否有帖子使用此型号
            const postsUsingModel = schema.db.posts.where({ modelId: parseInt(id) });
            if (postsUsingModel.length > 0) {
              return {
                code: 400,
                message: '该手机型号已被评测文章引用，无法删除'
              };
            }
            
            schema.db.phoneModels.remove(id);
            
            return {
              code: 200,
              message: '删除手机型号成功'
            };
          });
          
          // 获取所有品牌（供选择）
          this.get('/admin/brands', (schema) => {
            const brands = schema.db.brands;
            
            return {
              code: 200,
              message: '获取品牌列表成功',
              data: brands
            };
          });
          
          // ================================
          // 文件上传API
          // ================================
          
          // 上传头像
          this.post('/upload/avatar', () => {
            // 模拟文件上传
            return {
              code: 200,
              message: '上传成功',
              data: {
                url: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
              }
            };
          });
          
          // 上传图片
          this.post('/upload/image', () => {
            // 模拟文件上传
            return {
              code: 200,
              message: '上传成功',
              data: {
                url: 'https://img.alicdn.com/imgextra/i2/1979300282/O1CN01kqNFkQ1UiO7POzQO0_!!1979300282.jpg'
              }
            };
          });
          
          // 获取手机详情
          this.get('/phones/:id', (schema, request) => {
            const id = parseInt(request.params.id)
            const phone = phoneModels.find(model => model.id === id)
            
            if (!phone) {
              return {
                code: 404,
                message: '未找到该手机型号',
                data: null
              }
            }
            
            // 获取品牌信息
            const brand = brands.find(brand => brand.id === phone.brandId)
            const phoneWithBrand = {
              ...phone,
              brandName: brand ? brand.name : '未知品牌',
              brandLogo: brand ? brand.logo : '',
              // 补充评测数量
              reviewCount: posts.filter(post => post.phoneModelId === id && post.status === 'published').length
            }
            
            return {
              code: 200,
              message: 'success',
              data: phoneWithBrand
            }
          });

          // 用户收藏/取消收藏手机型号
          this.post('/user/favorites', (schema, request) => {
            try {
              let requestBody = '';
              try {
                requestBody = request.requestBody;
              } catch (e) {
                console.warn('获取请求体失败:', e);
              }
              
              // 尝试解析请求体
              let body = {};
              try {
                body = JSON.parse(requestBody);
              } catch (e) {
                console.error('解析JSON失败:', e);
                return {
                  code: 400,
                  message: '无效的请求格式'
                };
              }
              
              const { type, id, action } = body;
              
              // 检查用户是否登录
              let token = null;
              let userId = null;
              
              try {
                token = localStorage.getItem('token');
                userId = localStorage.getItem('userId');
              } catch (e) {
                console.warn('localStorage访问失败:', e);
              }
              
              if (!token) {
                return {
                  code: 401,
                  message: '请先登录'
                };
              }
              
              // 获取当前用户ID
              userId = userId ? parseInt(userId) : null;
              
              if (!userId) {
                return {
                  code: 401,
                  message: '请先登录'
                };
              }
              
              // 验证参数
              if (!type || !id || !action) {
                return {
                  code: 400,
                  message: '参数不完整',
                  data: null
                };
              }
              
              if (action !== 'add' && action !== 'remove') {
                return {
                  code: 400,
                  message: '无效的操作类型'
                };
              }
              
              const itemId = parseInt(id);
              
              if (action === 'add') {
                // 添加收藏
                try {
                  const existingFavorite = schema.db.userFavorites.findBy({ userId, itemId, type });
                  
                  if (!existingFavorite) {
                    schema.db.userFavorites.create({
                      userId,
                      itemId,
                      type,
                      createTime: new Date().toISOString()
                    });
                  }
                  
                  return {
                    code: 200,
                    message: '收藏成功'
                  };
                } catch (e) {
                  console.error('添加收藏时出错:', e);
                }
              } else {
                // 移除收藏
                try {
                  const favorite = schema.db.userFavorites.findBy({ userId, itemId, type });
                  
                  if (favorite) {
                    favorite.destroy();
                  }
                  
                  return {
                    code: 200,
                    message: '取消收藏成功'
                  };
                } catch (e) {
                  console.error('移除收藏时出错:', e);
                }
              }
              
              return {
                code: 500,
                message: '操作失败'
              };
            } catch (error) {
              console.error('处理收藏操作时出错:', error);
              return {
                code: 500,
                message: '服务器错误'
              };
            }
          });

          // 获取用户收藏列表
          this.get('/user/favorites', (schema, request) => {
            const { queryParams } = request;
            const type = queryParams?.type || 'post';
            
            // 检查用户是否登录
            if (!localStorage.getItem('token')) {
              return {
                code: 401,
                message: '请先登录'
              };
            }
            
            // 获取当前用户ID
            const userIdStr = localStorage.getItem('userId');
            const userId = userIdStr ? parseInt(userIdStr) : null;
            
            if (!userId) {
              return {
                code: 401,
                message: '请先登录'
              };
            }
            
            if (type === 'post') {
              // 获取用户收藏的文章
              // 这里应该从数据库中查询，这里简化为返回几个模拟数据
              return {
                code: 200,
                message: '获取成功',
                data: [
                  {
                    id: 1,
                    title: 'iPhone 15 Pro 上手体验',
                    cover: 'https://img.alicdn.com/imgextra/i2/1979300282/O1CN01kqNFkQ1UiO7POzQO0_!!1979300282.jpg',
                    author: '数码达人',
                    collectTime: '2023-09-16'
                  },
                  {
                    id: 3,
                    title: '华为Mate60 Pro实测',
                    cover: 'https://img.alicdn.com/imgextra/i2/2201476544168/O1CN0108yQNR1IOqeBzsFHG_!!2201476544168.jpg',
                    author: '摄影控',
                    collectTime: '2023-09-07'
                  }
                ]
              };
            } else if (type === 'phone') {
              // 获取用户收藏的手机
              // 从localStorage获取收藏的手机ID列表
              const favoritePhoneIdsStr = localStorage.getItem('favoritePhones');
              let favoritePhoneIds = [];
              
              try {
                favoritePhoneIds = favoritePhoneIdsStr ? JSON.parse(favoritePhoneIdsStr) : [];
              } catch (e) {
                console.error('解析收藏手机列表失败:', e);
                favoritePhoneIds = [];
              }
              
              // 根据ID查找对应的手机详情
              const favoritePhones = [];
              const phoneModels = schema.db.phoneModels.where({});
              
              for (const phoneId of favoritePhoneIds) {
                const phone = phoneModels.find(p => p.id === parseInt(phoneId));
                if (phone) {
                  const brand = schema.db.brands.find(phone.brandId);
                  favoritePhones.push({
                    ...phone,
                    brand: brand || { name: '未知品牌' }
                  });
                }
              }
              
              return {
                code: 200,
                message: '获取成功',
                data: favoritePhones
              };
            }
            
            return {
              code: 400,
              message: '无效的请求参数'
            };
          });

          // 添加或移除收藏
          this.post('/user/favorites', (schema, request) => {
            const { requestBody } = request;
            const { type, id, action } = JSON.parse(requestBody);
            const itemId = parseInt(id);
            
            // 验证参数
            if (!type || !id || !action) {
              return {
                code: 400,
                message: '参数不完整',
                data: null
              };
            }
            
            // 验证ID是否存在
            if (type === 'phone') {
              const phone = schema.db.phoneModels.find(itemId);
              if (!phone) {
                return {
                  code: 404,
                  message: '未找到该手机型号',
                  data: null
                };
              }
              
              // 处理手机收藏
              const favoritePhones = JSON.parse(localStorage.getItem('favoritePhones') || '[]');
              
              if (action === 'add') {
                // 添加收藏
                if (!favoritePhones.includes(itemId)) {
                  favoritePhones.push(itemId);
                }
                localStorage.setItem('favoritePhones', JSON.stringify(favoritePhones));
              } else if (action === 'remove') {
                // 移除收藏
                const index = favoritePhones.indexOf(itemId);
                if (index > -1) {
                  favoritePhones.splice(index, 1);
                }
                localStorage.setItem('favoritePhones', JSON.stringify(favoritePhones));
              }
            } else if (type === 'post') {
              const post = schema.db.posts.find(itemId);
              if (!post) {
                return {
                  code: 404,
                  message: '未找到该评测',
                  data: null
                };
              }
              
              // 处理评测收藏
              const favoritePosts = JSON.parse(localStorage.getItem('favoritedPosts') || '[]');
              
              if (action === 'add') {
                // 添加收藏
                if (!favoritePosts.includes(itemId)) {
                  favoritePosts.push(itemId);
                }
                localStorage.setItem('favoritedPosts', JSON.stringify(favoritePosts));
              } else if (action === 'remove') {
                // 移除收藏
                const index = favoritePosts.indexOf(itemId);
                if (index > -1) {
                  favoritePosts.splice(index, 1);
                }
                localStorage.setItem('favoritedPosts', JSON.stringify(favoritePosts));
              }
            }
            
            return {
              code: 200,
              message: action === 'add' ? '添加收藏成功' : '取消收藏成功',
              data: null
            };
          });

          // 获取品牌列表
          this.get('/brands', (schema) => {
            const brands = schema.db.brands;
            return {
              code: 200,
              message: '获取成功',
              data: brands
            };
          });

          // 获取某品牌下的手机型号
          this.get('/brands/:id/models', (schema, request) => {
            const brandId = parseInt(request.params.id);
            const models = schema.db.phoneModels.where({ brandId });
            
            return {
              code: 200,
              message: '获取成功',
              data: models
            };
          });

          // 获取手机详情
          this.get('/phones/:id', (schema, request) => {
            const id = parseInt(request.params.id);
            const phone = schema.db.phoneModels.find(id);
            
            if (!phone) {
              return {
                code: 404,
                message: '手机型号不存在'
              };
            }
            
            // 获取品牌信息
            const brand = schema.db.brands.find(phone.brandId);
            
            // 查询相关评测数量
            const reviewCount = schema.db.posts.where({ modelId: id }).length;
            
            // 计算平均评分
            const reviews = schema.db.posts.where({ modelId: id });
            let avgRating = 0;
            
            if (reviews.length > 0) {
              const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
              avgRating = totalRating / reviews.length;
            }
            
            // 增加一些信息
            const phoneWithDetails = {
              ...phone,
              brand: brand ? { id: brand.id, name: brand.name, logo: brand.logo } : null,
              reviewCount,
              rating: avgRating
            };
            
            return {
              code: 200,
              message: '获取成功',
              data: phoneWithDetails
            };
          });

          // 搜索手机
          this.get('/phones', (schema, request) => {
            const { 
              keyword, 
              brandId, 
              minPrice, 
              maxPrice,
              sort,
              page = 1, 
              limit = 12 
            } = request.queryParams;
            
            let phones = schema.db.phoneModels.all().models;
            
            // 关键词搜索
            if (keyword) {
              const lowercaseKeyword = keyword.toLowerCase();
              phones = phones.filter(phone => {
                const phoneModel = phone.name.toLowerCase();
                const brand = schema.db.brands.find(phone.brandId);
                const brandName = brand ? brand.name.toLowerCase() : '';
                
                return phoneModel.includes(lowercaseKeyword) || 
                       brandName.includes(lowercaseKeyword);
              });
            }
            
            // 品牌筛选
            if (brandId) {
              const brandIdInt = parseInt(brandId);
              phones = phones.filter(phone => phone.brandId === brandIdInt);
            }
            
            // 价格区间筛选
            if (minPrice && maxPrice) {
              const min = parseInt(minPrice);
              const max = parseInt(maxPrice);
              phones = phones.filter(phone => phone.price >= min && phone.price <= max);
            } else if (minPrice) {
              const min = parseInt(minPrice);
              phones = phones.filter(phone => phone.price >= min);
            } else if (maxPrice) {
              const max = parseInt(maxPrice);
              phones = phones.filter(phone => phone.price <= max);
            }
            
            // 排序
            if (sort) {
              switch (sort) {
                case 'price_asc':
                  phones.sort((a, b) => a.price - b.price);
                  break;
                case 'price_desc':
                  phones.sort((a, b) => b.price - a.price);
                  break;
                case 'rating_desc':
                  // 需要计算每个手机的平均评分
                  phones.sort((a, b) => {
                    const aReviews = schema.db.posts.where({ modelId: a.id });
                    const bReviews = schema.db.posts.where({ modelId: b.id });
                    
                    let aRating = 0, bRating = 0;
                    
                    if (aReviews.length > 0) {
                      const totalRating = aReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
                      aRating = totalRating / aReviews.length;
                    }
                    
                    if (bReviews.length > 0) {
                      const totalRating = bReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
                      bRating = totalRating / bReviews.length;
                    }
                    
                    return bRating - aRating;
                  });
                  break;
                case 'newest':
                default:
                  // 默认按发布日期排序（最新的在前）
                  phones.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                  break;
              }
            }
            
            // 分页处理
            const pageInt = parseInt(page);
            const limitInt = parseInt(limit);
            const start = (pageInt - 1) * limitInt;
            const end = start + limitInt;
            const paginatedPhones = phones.slice(start, end);
            
            // 为每个手机添加品牌信息和评分
            const phonesWithDetails = paginatedPhones.map(phone => {
              const brand = schema.db.brands.find(phone.brandId);
              
              // 计算平均评分
              const reviews = schema.db.posts.where({ modelId: phone.id });
              let rating = 0;
              
              if (reviews.length > 0) {
                const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
                rating = totalRating / reviews.length;
              }
              
              return {
                ...phone,
                brand: brand ? { id: brand.id, name: brand.name, logo: brand.logo } : null,
                rating
              };
            });
            
            return {
              code: 200,
              message: '获取成功',
              data: {
                records: phonesWithDetails,
                total: phones.length,
                page: pageInt,
                limit: limitInt
              }
            };
          });

          // 获取热门手机
          this.get('/phones/hot', (schema) => {
            // 按照popularity排序，取前10个
            const hotPhones = schema.db.phoneModels
              .all()
              .models
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 10);
            
            // 添加品牌信息
            const phonesWithBrand = hotPhones.map(phone => {
              const brand = schema.db.brands.find(phone.brandId);
              return {
                ...phone,
                brand: brand ? { id: brand.id, name: brand.name, logo: brand.logo } : null
              };
            });
            
            return {
              code: 200,
              message: '获取成功',
              data: phonesWithBrand
            };
          });

          // 获取相关手机
          this.get('/phones/:id/related', (schema, request) => {
            const id = parseInt(request.params.id);
            const { limit = 6 } = request.queryParams;
            const limitInt = parseInt(limit);
            
            const phone = schema.db.phoneModels.find(id);
            
            if (!phone) {
              return {
                code: 404,
                message: '手机型号不存在'
              };
            }
            
            // 获取同品牌的其他手机
            const sameBrandPhones = schema.db.phoneModels
              .where({ brandId: phone.brandId })
              .filter(p => p.id !== id)
              .models;
            
            // 如果同品牌手机不够，再获取其他品牌但价格相近的手机
            let relatedPhones = [...sameBrandPhones];
            
            if (relatedPhones.length < limitInt) {
              const priceRange = 1000; // 价格相近范围
              const otherBrandPhones = schema.db.phoneModels
                .where(p => p.brandId !== phone.brandId && 
                           p.price >= phone.price - priceRange && 
                           p.price <= phone.price + priceRange)
                .models
                .slice(0, limitInt - relatedPhones.length);
              
              relatedPhones = [...relatedPhones, ...otherBrandPhones];
            }
            
            // 如果还不够，添加热门手机
            if (relatedPhones.length < limitInt) {
              const hotPhones = schema.db.phoneModels
                .all()
                .models
                .sort((a, b) => b.popularity - a.popularity)
                .filter(p => p.id !== id && !relatedPhones.some(rp => rp.id === p.id))
                .slice(0, limitInt - relatedPhones.length);
              
              relatedPhones = [...relatedPhones, ...hotPhones];
            }
            
            // 限制返回数量
            relatedPhones = relatedPhones.slice(0, limitInt);
            
            // 添加品牌信息
            const phonesWithBrand = relatedPhones.map(phone => {
              const brand = schema.db.brands.find(phone.brandId);
              return {
                ...phone,
                brand: brand ? { id: brand.id, name: brand.name, logo: brand.logo } : null
              };
            });
            
            return {
              code: 200,
              message: '获取成功',
              data: phonesWithBrand
            };
          });

          // 获取某手机的评测
          this.get('/phones/:id/reviews', (schema, request) => {
            const phoneId = parseInt(request.params.id);
            const { page = 1, limit = 10 } = request.queryParams;
            
            const posts = schema.db.posts.where({ modelId: phoneId }).models;
            const total = posts.length;
            
            // 分页
            const pageInt = parseInt(page);
            const limitInt = parseInt(limit);
            const start = (pageInt - 1) * limitInt;
            const end = start + limitInt;
            const paginatedPosts = posts.slice(start, end);
            
            // 添加用户信息
            const postsWithUser = paginatedPosts.map(post => {
              const user = schema.db.users.find(post.userId);
              const model = schema.db.phoneModels.find(post.modelId);
              const brand = model ? schema.db.brands.find(model.brandId) : null;
              
              return {
                ...post,
                user: user ? {
                  id: user.id,
                  username: user.username,
                  avatar: user.avatar
                } : null,
                brand: brand ? brand.name : '',
                model: model ? model.name : ''
              };
            });
            
            return {
              code: 200,
              message: '获取成功',
              data: {
                records: postsWithUser,
                total,
                page: pageInt,
                limit: limitInt
              }
            };
          });

          // 获取用户收藏
          this.get('/user/favorites', (schema, request) => {
            const { queryParams } = request;
            const type = queryParams?.type || 'post';
            
            // 检查用户是否登录
            if (!localStorage.getItem('token')) {
              return {
                code: 401,
                message: '请先登录'
              };
            }
            
            // 获取当前用户ID
            const userIdStr = localStorage.getItem('userId');
            const userId = userIdStr ? parseInt(userIdStr) : null;
            
            if (!userId) {
              return {
                code: 401,
                message: '请先登录'
              };
            }
            
            if (type === 'post') {
              // 获取用户收藏的文章
              // 这里应该从数据库中查询，这里简化为返回几个模拟数据
              return {
                code: 200,
                message: '获取成功',
                data: [
                  {
                    id: 1,
                    title: 'iPhone 15 Pro 上手体验',
                    cover: 'https://img.alicdn.com/imgextra/i2/1979300282/O1CN01kqNFkQ1UiO7POzQO0_!!1979300282.jpg',
                    author: '数码达人',
                    collectTime: '2023-09-16'
                  },
                  {
                    id: 3,
                    title: '华为Mate60 Pro实测',
                    cover: 'https://img.alicdn.com/imgextra/i2/2201476544168/O1CN0108yQNR1IOqeBzsFHG_!!2201476544168.jpg',
                    author: '摄影控',
                    collectTime: '2023-09-07'
                  }
                ]
              };
            } else if (type === 'phone') {
              // 获取用户收藏的手机
              // 从localStorage获取收藏的手机ID列表
              const favoritePhoneIdsStr = localStorage.getItem('favoritePhones');
              let favoritePhoneIds = [];
              
              try {
                favoritePhoneIds = favoritePhoneIdsStr ? JSON.parse(favoritePhoneIdsStr) : [];
              } catch (e) {
                console.error('解析收藏手机列表失败:', e);
                favoritePhoneIds = [];
              }
              
              // 根据ID查找对应的手机详情
              const favoritePhones = [];
              const phoneModels = schema.db.phoneModels.where({});
              
              for (const phoneId of favoritePhoneIds) {
                const phone = phoneModels.find(p => p.id === parseInt(phoneId));
                if (phone) {
                  const brand = schema.db.brands.find(phone.brandId);
                  favoritePhones.push({
                    ...phone,
                    brand: brand || { name: '未知品牌' }
                  });
                }
              }
              
              return {
                code: 200,
                message: '获取成功',
                data: favoritePhones
              };
            }
            
            return {
              code: 400,
              message: '无效的请求参数'
            };
          });

          // 添加/删除收藏
          this.post('/user/favorites', (schema, request) => {
            const attrs = JSON.parse(request.requestBody);
            const { type, id, action } = attrs;
            
            // 默认为当前登录用户
            const userId = 1;
            
            if (action === 'add') {
              // 检查是否已收藏
              const existingFavorite = schema.db.userFavorites.findBy({ 
                userId, 
                type, 
                itemId: parseInt(id) 
              });
              
              if (existingFavorite) {
                return {
                  code: 400,
                  message: '已经收藏过了'
                };
              }
              
              // 添加收藏
              schema.db.userFavorites.insert({
                userId,
                type,
                itemId: parseInt(id),
                createTime: new Date().toISOString()
              });
              
              return {
                code: 200,
                message: '收藏成功'
              };
            } else if (action === 'remove') {
              // 查找收藏记录
              const favorite = schema.db.userFavorites.findBy({ 
                userId, 
                type, 
                itemId: parseInt(id) 
              });
              
              if (!favorite) {
                return {
                  code: 400,
                  message: '收藏不存在'
                };
              }
              
              // 删除收藏
              schema.db.userFavorites.remove(favorite.id);
              
              return {
                code: 200,
                message: '取消收藏成功'
              };
            }
            
            return {
              code: 400,
              message: '无效的操作'
            };
          });

          // 用户评论列表
          this.get('/user/comments', (schema, request) => {
            console.log('Mock API - 用户评论列表请求:', request.url);
            
            // 检查用户是否登录
            let token = null;
            let userId = null;
            
            try {
              token = localStorage.getItem('token');
              userId = localStorage.getItem('userId');
            } catch (e) {
              console.warn('localStorage访问失败:', e);
            }
            
            if (!token) {
              return {
                code: 401,
                message: '请先登录'
              };
            }
            
            // 获取当前用户ID
            userId = userId ? parseInt(userId) : 1; // 默认用户ID为1
            
            // 从URL或params获取分页参数
            let page = 1;
            let limit = 10;
            
            try {
              // 尝试从URL参数获取
              if (request.url && request.url.includes('?')) {
                const queryString = request.url.split('?')[1];
                const urlParams = new URLSearchParams(queryString);
                
                if (urlParams.has('page')) {
                  page = parseInt(urlParams.get('page') || '1');
                }
                
                if (urlParams.has('limit')) {
                  limit = parseInt(urlParams.get('limit') || '10');
                }
              }
              
              // 尝试从params对象获取
              if (request.queryParams) {
                if (request.queryParams.page) {
                  page = parseInt(request.queryParams.page);
                }
                
                if (request.queryParams.limit) {
                  limit = parseInt(request.queryParams.limit);
                }
              }
            } catch (error) {
              console.error('参数解析错误:', error);
              // 使用默认值
            }
            
            console.log('Mock API - 处理后的评论列表参数:', { page, limit, userId });
            
            // 查询用户的评论
            const userComments = schema.db.comments.where({ userId }).models || [];
            console.log(`找到用户ID=${userId}的评论数量:`, userComments.length);
            
            // 如果没有找到评论，创建默认评论数据
            if (userComments.length === 0) {
              console.log('未找到用户评论，返回模拟数据');
              
              // 创建临时评论数据
              const mockComments = [];
              for (let i = 1; i <= 5; i++) {
                const postId = i;
                const post = schema.db.posts.find(postId) || {
                  id: postId,
                  title: `测试评测 ${i}`,
                  userId: 2,
                  modelId: i + 1
                };
                
                const model = post.modelId ? schema.db.phoneModels.find(post.modelId) : null;
                const brand = model && model.brandId ? schema.db.brands.find(model.brandId) : null;
                
                mockComments.push({
                  id: 1000 + i,
                  postId: postId,
                  reviewTitle: post.title || `${brand ? brand.name : ''}${model ? model.name : ''} 评测`,
                  content: `这款手机${model ? model.name : ''}的${i % 2 === 0 ? '性能非常出色' : '相机效果很好'}，${i % 3 === 0 ? '电池续航令人满意' : '屏幕显示效果出色'}。`,
                  commentTime: new Date().toLocaleDateString(),
                  detailUrl: `/review/${postId}`, // 用于跳转的URL
                  postUrl: `/review/${postId}`,
                  rating: 4 + (i % 2) * 0.5,
                  likes: Math.floor(Math.random() * 10)
                });
              }
              
              // 返回模拟数据
              return {
                code: 200,
                message: '获取成功',
                data: {
                  records: mockComments,
                  total: mockComments.length,
                  page: page,
                  limit: limit
                }
              };
            }
            
            // 关联帖子信息
            const commentsWithDetails = userComments.map(comment => {
              const post = comment.postId ? schema.db.posts.find(comment.postId) : null;
              const model = post && post.modelId ? schema.db.phoneModels.find(post.modelId) : null;
              const brand = model && model.brandId ? schema.db.brands.find(model.brandId) : null;
              
              return {
                id: comment.id,
                postId: comment.postId,
                reviewTitle: post ? post.title : '未知评测',
                content: comment.content || '评论内容',
                commentTime: new Date(comment.createTime || Date.now()).toLocaleDateString(),
                detailUrl: `/review/${comment.postId}`, // 用于跳转的URL
                postUrl: `/review/${comment.postId}`,
                phoneInfo: post && post.modelId ? {
                  id: post.modelId,
                  name: model ? model.name : '未知型号',
                  brand: brand ? brand.name : '未知品牌'
                } : null,
                likes: comment.likes || 0,
                isAuthor: post && post.userId === userId
              };
            });
            
            // 分页处理
            const startIndex = (page - 1) * limit;
            const paginatedComments = commentsWithDetails.slice(startIndex, startIndex + limit);
            
            console.log(`返回${paginatedComments.length}条评论数据`);
            
            return {
              code: 200,
              message: '获取成功',
              data: {
                records: paginatedComments,
                total: userComments.length,
                page: page,
                limit: limit
              }
            };
          });

          this.put('/admin/comments/:id/status', (schema, request) => {
            const id = request.params.id;
            const { status, reason } = JSON.parse(request.requestBody);
            const comment = schema.db.comments.find(id);
            
            if (!comment) {
              return {
                code: 404,
                message: '评论不存在'
              };
            }
            
            // 更新评论状态
            schema.db.comments.update(id, { 
              status,
              reviewTime: new Date().toISOString(),
              reviewReason: reason
            });
            
            // 如果是审核通过，增加评论的可见性
            if (status === 1) {
              schema.db.comments.update(id, {
                isVisible: true,
                publishTime: new Date().toISOString()
              });
            }
            
            // 返回操作结果
            return {
              code: 200,
              message: status === 1 ? '审核通过成功' : '审核拒绝成功',
              data: {
                id: parseInt(id),
                status,
                reviewTime: new Date().toISOString(),
                reviewReason: reason,
                isVisible: status === 1
              }
            };
          });

          this.post('/admin/phone-models', (schema, request) => {
            const phoneModel = JSON.parse(request.requestBody);
            const now = new Date().toISOString();
            
            // 创建新手机型号
            const id = schema.db.phoneModels.insert({
              ...phoneModel,
              createTime: now,
              updateTime: now,
              status: 1,
              isVisible: true,
              viewCount: 0,
              reviewCount: 0,
              averageRating: 0
            });
            
            // 返回操作结果
            return {
              code: 200,
              message: '添加手机型号成功',
              data: { 
                id,
                createTime: now,
                status: 1,
                isVisible: true
              }
            };
          });

          this.put('/admin/phone-models/:id', (schema, request) => {
            const id = request.params.id;
            const phoneModel = JSON.parse(request.requestBody);
            const existingModel = schema.db.phoneModels.find(id);
            
            if (!existingModel) {
              return {
                code: 404,
                message: '手机型号不存在'
              };
            }
            
            // 更新手机型号
            const now = new Date().toISOString();
            schema.db.phoneModels.update(id, {
              ...phoneModel,
              updateTime: now,
              // 保留原有的统计数据
              viewCount: existingModel.viewCount || 0,
              reviewCount: existingModel.reviewCount || 0,
              averageRating: existingModel.averageRating || 0
            });
            
            // 返回操作结果
            return {
              code: 200,
              message: '更新手机型号成功',
              data: {
                id: parseInt(id),
                updateTime: now,
                status: phoneModel.status || existingModel.status,
                isVisible: phoneModel.isVisible !== undefined ? phoneModel.isVisible : existingModel.isVisible
              }
            };
          });

          this.delete('/admin/phone-models/:id', (schema, request) => {
            const id = request.params.id;
            const phoneModel = schema.db.phoneModels.find(id);
            
            if (!phoneModel) {
              return {
                code: 404,
                message: '手机型号不存在'
              };
            }
            
            // 检查是否有相关的帖子
            const relatedPosts = schema.db.posts.where({ phoneModelId: parseInt(id) });
            if (relatedPosts.length > 0) {
              return {
                code: 400,
                message: '该手机型号下有相关帖子，无法删除'
              };
            }
            
            // 删除手机型号
            schema.db.phoneModels.remove(id);
            
            // 返回操作结果
            return {
              code: 200,
              message: '删除手机型号成功',
              data: {
                id: parseInt(id),
                deletedAt: new Date().toISOString()
              }
            };
          });

          this.put('/admin/phone-models/:id/status', (schema, request) => {
            const id = request.params.id;
            const { status, reason } = JSON.parse(request.requestBody);
            const phoneModel = schema.db.phoneModels.find(id);
            
            if (!phoneModel) {
              return {
                code: 404,
                message: '手机型号不存在'
              };
            }
            
            // 更新手机型号状态
            const now = new Date().toISOString();
            schema.db.phoneModels.update(id, { 
              status,
              updateTime: now,
              statusReason: reason,
              isVisible: status === 1
            });
            
            // 返回操作结果
            return {
              code: 200,
              message: status === 1 ? '启用手机型号成功' : '禁用手机型号成功',
              data: {
                id: parseInt(id),
                status,
                updateTime: now,
                statusReason: reason,
                isVisible: status === 1
              }
            };
          });

          this.post('/admin/brands', (schema, request) => {
            const brand = JSON.parse(request.requestBody);
            const now = new Date().toISOString();
            
            // 检查品牌名称是否已存在
            const existingBrand = schema.db.brands.findBy({ name: brand.name });
            if (existingBrand) {
              return {
                code: 400,
                message: '该品牌名称已存在'
              };
            }
            
            // 创建新品牌
            const id = schema.db.brands.insert({
              ...brand,
              createTime: now,
              updateTime: now,
              status: 1,
              isVisible: true,
              modelCount: 0,
              reviewCount: 0,
              averageRating: 0
            });
            
            // 返回操作结果
            return {
              code: 200,
              message: '添加手机品牌成功',
              data: { 
                id,
                createTime: now,
                status: 1,
                isVisible: true
              }
            };
          });

          this.put('/admin/brands/:id', (schema, request) => {
            const id = request.params.id;
            const brand = JSON.parse(request.requestBody);
            const existingBrand = schema.db.brands.find(id);
            
            if (!existingBrand) {
              return {
                code: 404,
                message: '手机品牌不存在'
              };
            }
            
            // 检查品牌名称是否与其他品牌重复
            if (brand.name && brand.name !== existingBrand.name) {
              const nameExists = schema.db.brands.findBy({ name: brand.name });
              if (nameExists) {
                return {
                  code: 400,
                  message: '该品牌名称已存在'
                };
              }
            }
            
            // 更新品牌信息
            const now = new Date().toISOString();
            schema.db.brands.update(id, {
              ...brand,
              updateTime: now,
              // 保留原有的统计数据
              modelCount: existingBrand.modelCount || 0,
              reviewCount: existingBrand.reviewCount || 0,
              averageRating: existingBrand.averageRating || 0
            });
            
            // 返回操作结果
            return {
              code: 200,
              message: '更新手机品牌成功',
              data: {
                id: parseInt(id),
                updateTime: now,
                status: brand.status || existingBrand.status,
                isVisible: brand.isVisible !== undefined ? brand.isVisible : existingBrand.isVisible
              }
            };
          });

          this.delete('/admin/brands/:id', (schema, request) => {
            const id = request.params.id;
            const brand = schema.db.brands.find(id);
            
            if (!brand) {
              return {
                code: 404,
                message: '手机品牌不存在'
              };
            }
            
            // 检查是否有相关的手机型号
            const relatedModels = schema.db.phoneModels.where({ brandId: parseInt(id) });
            if (relatedModels.length > 0) {
              return {
                code: 400,
                message: '该品牌下有相关手机型号，无法删除'
              };
            }
            
            // 删除品牌
            schema.db.brands.remove(id);
            
            // 返回操作结果
            return {
              code: 200,
              message: '删除手机品牌成功',
              data: {
                id: parseInt(id),
                deletedAt: new Date().toISOString()
              }
            };
          });

          this.put('/admin/brands/:id/status', (schema, request) => {
            const id = request.params.id;
            const { status, reason } = JSON.parse(request.requestBody);
            const brand = schema.db.brands.find(id);
            
            if (!brand) {
              return {
                code: 404,
                message: '手机品牌不存在'
              };
            }
            
            // 更新品牌状态
            const now = new Date().toISOString();
            schema.db.brands.update(id, { 
              status,
              updateTime: now,
              statusReason: reason,
              isVisible: status === 1
            });
            
            // 如果禁用品牌，同时禁用该品牌下的所有手机型号
            if (status === 0) {
              const relatedModels = schema.db.phoneModels.where({ brandId: parseInt(id) });
              relatedModels.forEach(model => {
                schema.db.phoneModels.update(model.id, {
                  status: 0,
                  isVisible: false,
                  statusReason: `品牌${brand.name}被禁用`
                });
              });
            }
            
            // 返回操作结果
            return {
              code: 200,
              message: status === 1 ? '启用手机品牌成功' : '禁用手机品牌成功',
              data: {
                id: parseInt(id),
                status,
                updateTime: now,
                statusReason: reason,
                isVisible: status === 1,
                affectedModels: status === 0 ? relatedModels.length : 0
              }
            };
          });

          this.get('/admin/brands/:id/stats', (schema, request) => {
            const id = request.params.id;
            const brand = schema.db.brands.find(id);
            
            if (!brand) {
              return {
                code: 404,
                message: '手机品牌不存在'
              };
            }
            
            // 获取该品牌下的所有手机型号
            const models = schema.db.phoneModels.where({ brandId: parseInt(id) });
            
            // 计算统计数据
            const stats = {
              modelCount: models.length,
              reviewCount: 0,
              averageRating: 0,
              totalViews: 0,
              activeModels: 0,
              pendingReviews: 0,
              recentReviews: []
            };
            
            // 遍历所有型号计算详细统计
            models.forEach(model => {
              stats.totalViews += model.viewCount || 0;
              if (model.status === 1) stats.activeModels++;
              
              // 获取该型号的所有帖子
              const posts = schema.db.posts.where({ phoneModelId: model.id });
              stats.reviewCount += posts.length;
              
              // 计算平均评分
              let totalRating = 0;
              posts.forEach(post => {
                if (post.rating) totalRating += post.rating;
                if (post.status === 0) stats.pendingReviews++;
              });
              
              if (posts.length > 0) {
                stats.averageRating = totalRating / posts.length;
              }
              
              // 获取最近的5条评价
              const recentPosts = posts
                .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
                .slice(0, 5);
              
              recentPosts.forEach(post => {
                stats.recentReviews.push({
                  id: post.id,
                  title: post.title,
                  rating: post.rating,
                  createTime: post.createTime,
                  status: post.status
                });
              });
            });
            
            // 返回统计结果
            return {
              code: 200,
              data: {
                ...stats,
                averageRating: Number(stats.averageRating.toFixed(1))
              }
            };
          });

          this.get('/admin/phone-models/:id/stats', (schema, request) => {
            const id = request.params.id;
            const model = schema.db.phoneModels.find(id);
            
            if (!model) {
              return {
                code: 404,
                message: '手机型号不存在'
              };
            }
            
            // 获取该型号的所有帖子
            const posts = schema.db.posts.where({ phoneModelId: parseInt(id) });
            
            // 计算统计数据
            const stats = {
              reviewCount: posts.length,
              averageRating: 0,
              viewCount: model.viewCount || 0,
              pendingReviews: 0,
              approvedReviews: 0,
              rejectedReviews: 0,
              totalLikes: 0,
              totalComments: 0,
              recentReviews: [],
              ratingDistribution: {
                1: 0, 2: 0, 3: 0, 4: 0, 5: 0
              }
            };
            
            // 遍历所有帖子计算详细统计
            posts.forEach(post => {
              // 统计评分分布
              if (post.rating) {
                stats.ratingDistribution[post.rating]++;
                stats.averageRating += post.rating;
              }
              
              // 统计状态
              if (post.status === 0) stats.pendingReviews++;
              else if (post.status === 1) stats.approvedReviews++;
              else if (post.status === 2) stats.rejectedReviews++;
              
              // 统计点赞和评论
              stats.totalLikes += post.likeCount || 0;
              stats.totalComments += post.commentCount || 0;
            });
            
            // 计算平均评分
            if (posts.length > 0) {
              stats.averageRating = stats.averageRating / posts.length;
            }
            
            // 获取最近的5条评价
            const recentPosts = posts
              .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
              .slice(0, 5);
            
            recentPosts.forEach(post => {
              stats.recentReviews.push({
                id: post.id,
                title: post.title,
                rating: post.rating,
                createTime: post.createTime,
                status: post.status,
                likeCount: post.likeCount || 0,
                commentCount: post.commentCount || 0
              });
            });
            
            // 返回统计结果
            return {
              code: 200,
              data: {
                ...stats,
                averageRating: Number(stats.averageRating.toFixed(1))
              }
            };
          });

          this.get('/admin/users/:id/stats', (schema, request) => {
            const id = request.params.id;
            const user = schema.db.users.find(id);
            
            if (!user) {
              return {
                code: 404,
                message: '用户不存在'
              };
            }
            
            // 获取用户的所有帖子
            const posts = schema.db.posts.where({ userId: parseInt(id) });
            
            // 获取用户的所有评论
            const comments = schema.db.comments.where({ userId: parseInt(id) });
            
            // 获取用户的收藏
            const favorites = schema.db.favorites.where({ userId: parseInt(id) });
            
            // 计算统计数据
            const stats = {
              postCount: posts.length,
              commentCount: comments.length,
              favoriteCount: favorites.length,
              totalLikes: 0,
              totalViews: 0,
              averageRating: 0,
              activePosts: 0,
              pendingPosts: 0,
              rejectedPosts: 0,
              recentPosts: [],
              recentComments: [],
              favoritePhones: [],
              favoritePosts: []
            };
            
            // 统计帖子相关数据
            posts.forEach(post => {
              stats.totalViews += post.viewCount || 0;
              stats.totalLikes += post.likeCount || 0;
              
              if (post.rating) {
                stats.averageRating += post.rating;
              }
              
              if (post.status === 1) stats.activePosts++;
              else if (post.status === 0) stats.pendingPosts++;
              else if (post.status === 2) stats.rejectedPosts++;
            });
            
            // 计算平均评分
            if (posts.length > 0) {
              stats.averageRating = stats.averageRating / posts.length;
            }
            
            // 获取最近的5条帖子
            const recentPosts = posts
              .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
              .slice(0, 5);
            
            recentPosts.forEach(post => {
              stats.recentPosts.push({
                id: post.id,
                title: post.title,
                rating: post.rating,
                createTime: post.createTime,
                status: post.status,
                viewCount: post.viewCount || 0,
                likeCount: post.likeCount || 0
              });
            });
            
            // 获取最近的5条评论
            const recentComments = comments
              .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
              .slice(0, 5);
            
            recentComments.forEach(comment => {
              stats.recentComments.push({
                id: comment.id,
                content: comment.content,
                createTime: comment.createTime,
                status: comment.status,
                postId: comment.postId
              });
            });
            
            // 获取收藏的手机型号
            const favoritePhones = favorites
              .filter(f => f.type === 'phone')
              .map(f => {
                const model = schema.db.phoneModels.find(f.targetId);
                return model ? {
                  id: model.id,
                  name: model.name,
                  brand: model.brand,
                  favoriteTime: f.createTime
                } : null;
              })
              .filter(Boolean)
              .slice(0, 5);
            
            stats.favoritePhones = favoritePhones;
            
            // 获取收藏的帖子
            const favoritePosts = favorites
              .filter(f => f.type === 'post')
              .map(f => {
                const post = schema.db.posts.find(f.targetId);
                return post ? {
                  id: post.id,
                  title: post.title,
                  favoriteTime: f.createTime
                } : null;
              })
              .filter(Boolean)
              .slice(0, 5);
            
            stats.favoritePosts = favoritePosts;
            
            // 返回统计结果
            return {
              code: 200,
              data: {
                ...stats,
                averageRating: Number(stats.averageRating.toFixed(1))
              }
            };
          });

          // 添加日志记录函数
          function logAction(schema, type, action, description, operator, request, details = {}) {
            const now = new Date().toISOString();
            const log = {
              type,
              action,
              description,
              operator,
              createTime: now,
              ip: request.headers['x-forwarded-for'] || '127.0.0.1',
              userAgent: request.headers['user-agent'],
              details: {
                ...details,
                timestamp: now
              }
            };
            
            // 记录日志
            schema.db.logs.insert(log);
            
            // 如果是错误日志，同时记录到错误日志表
            if (type === 'error') {
              schema.db.errorLogs.insert({
                ...log,
                errorStack: details.errorStack,
                errorMessage: details.errorMessage,
                errorCode: details.errorCode
              });
            }
            
            // 如果是安全相关日志，同时记录到安全日志表
            if (type === 'security') {
              schema.db.securityLogs.insert({
                ...log,
                riskLevel: details.riskLevel,
                securityType: details.securityType,
                affectedResource: details.affectedResource
              });
            }
            
            // 如果是性能相关日志，同时记录到性能日志表
            if (type === 'performance') {
              schema.db.performanceLogs.insert({
                ...log,
                responseTime: details.responseTime,
                resourceUsage: details.resourceUsage,
                endpoint: details.endpoint
              });
            }
            
            // 如果是审计日志，同时记录到审计日志表
            if (type === 'audit') {
              schema.db.auditLogs.insert({
                ...log,
                resourceType: details.resourceType,
                resourceId: details.resourceId,
                oldValue: details.oldValue,
                newValue: details.newValue
              });
            }
            
            return log;
          }
          
          // 添加日志查询函数
          function queryLogs(schema, params) {
            const {
              type,
              action,
              operator,
              startTime,
              endTime,
              page = 1,
              limit = 10
            } = params;
            
            let logs = schema.db.logs || [];
            
            // 按类型筛选
            if (type) {
              logs = logs.filter(log => log.type === type);
            }
            
            // 按操作筛选
            if (action) {
              logs = logs.filter(log => log.action === action);
            }
            
            // 按操作者筛选
            if (operator) {
              logs = logs.filter(log => log.operator === operator);
            }
            
            // 按时间范围筛选
            if (startTime) {
              logs = logs.filter(log => new Date(log.createTime) >= new Date(startTime));
            }
            if (endTime) {
              logs = logs.filter(log => new Date(log.createTime) <= new Date(endTime));
            }
            
            // 按时间倒序排序
            logs.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
            
            // 分页
            const total = logs.length;
            const items = logs.slice((page - 1) * limit, page * limit);
            
            // 统计日志类型分布
            const typeDistribution = {
              user: 0,
              post: 0,
              comment: 0,
              brand: 0,
              model: 0,
              system: 0,
              error: 0,
              security: 0,
              performance: 0,
              audit: 0
            };
            
            logs.forEach(log => {
              if (typeDistribution[log.type] !== undefined) {
                typeDistribution[log.type]++;
              }
            });
            
            // 统计操作者分布
            const operatorDistribution = {};
            logs.forEach(log => {
              operatorDistribution[log.operator] = (operatorDistribution[log.operator] || 0) + 1;
            });
            
            return {
              total,
              items,
              typeDistribution,
              operatorDistribution,
              summary: {
                totalLogs: total,
                todayLogs: logs.filter(log => {
                  const logDate = new Date(log.createTime);
                  const today = new Date();
                  return logDate.toDateString() === today.toDateString();
                }).length,
                errorLogs: logs.filter(log => log.type === 'error').length,
                securityLogs: logs.filter(log => log.type === 'security').length,
                performanceLogs: logs.filter(log => log.type === 'performance').length,
                auditLogs: logs.filter(log => log.type === 'audit').length
              }
            };
          }

          this.get('/admin/logs', (schema, request) => {
            const params = {
              ...request.queryParams,
              page: parseInt(request.queryParams.page) || 1,
              limit: parseInt(request.queryParams.limit) || 10
            };
            
            // 使用日志查询函数获取结果
            const result = queryLogs(schema, params);
            
            return {
              code: 200,
              data: result
            };
          });
          
          this.get('/admin/logs/error', (schema, request) => {
            const params = {
              ...request.queryParams,
              type: 'error',
              page: parseInt(request.queryParams.page) || 1,
              limit: parseInt(request.queryParams.limit) || 10
            };
            
            // 使用日志查询函数获取错误日志
            const result = queryLogs(schema, params);
            
            return {
              code: 200,
              data: {
                ...result,
                errorSummary: {
                  totalErrors: result.total,
                  todayErrors: result.summary.errorLogs,
                  errorTypes: result.items.reduce((acc, log) => {
                    acc[log.details.errorCode] = (acc[log.details.errorCode] || 0) + 1;
                    return acc;
                  }, {})
                }
              }
            };
          });
          
          this.get('/admin/logs/security', (schema, request) => {
            const params = {
              ...request.queryParams,
              type: 'security',
              page: parseInt(request.queryParams.page) || 1,
              limit: parseInt(request.queryParams.limit) || 10
            };
            
            // 使用日志查询函数获取安全日志
            const result = queryLogs(schema, params);
            
            return {
              code: 200,
              data: {
                ...result,
                securitySummary: {
                  totalSecurityEvents: result.total,
                  todaySecurityEvents: result.summary.securityLogs,
                  riskLevels: result.items.reduce((acc, log) => {
                    acc[log.details.riskLevel] = (acc[log.details.riskLevel] || 0) + 1;
                    return acc;
                  }, {})
                }
              }
            };
          });
          
          this.get('/admin/logs/performance', (schema, request) => {
            const params = {
              ...request.queryParams,
              type: 'performance',
              page: parseInt(request.queryParams.page) || 1,
              limit: parseInt(request.queryParams.limit) || 10
            };
            
            // 使用日志查询函数获取性能日志
            const result = queryLogs(schema, params);
            
            // 计算性能指标
            const performanceMetrics = {
              averageResponseTime: 0,
              maxResponseTime: 0,
              slowEndpoints: {},
              resourceUsage: {
                cpu: 0,
                memory: 0,
                disk: 0
              }
            };
            
            result.items.forEach(log => {
              const responseTime = log.details.responseTime;
              performanceMetrics.averageResponseTime += responseTime;
              performanceMetrics.maxResponseTime = Math.max(performanceMetrics.maxResponseTime, responseTime);
              
              // 统计慢接口
              if (responseTime > 1000) { // 超过1秒的接口
                performanceMetrics.slowEndpoints[log.details.endpoint] = 
                  (performanceMetrics.slowEndpoints[log.details.endpoint] || 0) + 1;
              }
              
              // 统计资源使用
              performanceMetrics.resourceUsage.cpu += log.details.resourceUsage.cpu || 0;
              performanceMetrics.resourceUsage.memory += log.details.resourceUsage.memory || 0;
              performanceMetrics.resourceUsage.disk += log.details.resourceUsage.disk || 0;
            });
            
            // 计算平均值
            if (result.items.length > 0) {
              performanceMetrics.averageResponseTime /= result.items.length;
              performanceMetrics.resourceUsage.cpu /= result.items.length;
              performanceMetrics.resourceUsage.memory /= result.items.length;
              performanceMetrics.resourceUsage.disk /= result.items.length;
            }
            
            return {
              code: 200,
              data: {
                ...result,
                performanceMetrics
              }
            };
          });
          
          this.get('/admin/logs/audit', (schema, request) => {
            const params = {
              ...request.queryParams,
              type: 'audit',
              page: parseInt(request.queryParams.page) || 1,
              limit: parseInt(request.queryParams.limit) || 10
            };
            
            // 使用日志查询函数获取审计日志
            const result = queryLogs(schema, params);
            
            // 统计资源变更
            const resourceChanges = result.items.reduce((acc, log) => {
              const resourceType = log.details.resourceType;
              if (!acc[resourceType]) {
                acc[resourceType] = {
                  total: 0,
                  create: 0,
                  update: 0,
                  delete: 0
                };
              }
              
              acc[resourceType].total++;
              if (log.action === 'create') acc[resourceType].create++;
              else if (log.action === 'update') acc[resourceType].update++;
              else if (log.action === 'delete') acc[resourceType].delete++;
              
              return acc;
            }, {});
            
            return {
              code: 200,
              data: {
                ...result,
                resourceChanges
              }
            };
          });

          this.get('/admin/settings', (schema, request) => {
            // 获取系统设置
            const settings = schema.db.settings || {
              siteName: '智能手机评测论坛',
              siteDescription: '分享你的手机使用体验',
              siteKeywords: '手机,评测,论坛,体验',
              siteLogo: '/logo.png',
              siteFavicon: '/favicon.ico',
              allowRegister: true,
              allowComment: true,
              allowPost: true,
              postReviewRequired: true,
              commentReviewRequired: false,
              maxPostLength: 5000,
              maxCommentLength: 500,
              maxImageSize: 5, // MB
              allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif'],
              maxUploadCount: 5,
              defaultUserAvatar: '/default-avatar.png',
              defaultPhoneImage: '/default-phone.png',
              maintenanceMode: false,
              maintenanceMessage: '系统维护中，请稍后再试',
              contactEmail: 'admin@example.com',
              contactPhone: '400-123-4567',
              copyright: '© 2024 智能手机评测论坛. All rights reserved.',
              icp: '京ICP备12345678号',
              police: '京公网安备11010102001234号',
              lastUpdateTime: new Date().toISOString()
            };
            
            return {
              code: 200,
              data: settings
            };
          });
          
          this.put('/admin/settings', (schema, request) => {
            const settings = JSON.parse(request.requestBody);
            const now = new Date().toISOString();
            
            // 更新系统设置
            schema.db.settings = {
              ...schema.db.settings,
              ...settings,
              lastUpdateTime: now
            };
            
            // 记录日志
            schema.db.logs.insert({
              type: 'system',
              action: '更新系统设置',
              description: '管理员更新了系统设置',
              operator: 'admin',
              createTime: now,
              ip: request.headers['x-forwarded-for'] || '127.0.0.1',
              userAgent: request.headers['user-agent']
            });
            
            return {
              code: 200,
              message: '更新系统设置成功',
              data: {
                ...schema.db.settings,
                lastUpdateTime: now
              }
            };
          });

          this.post('/admin/backup', (schema, request) => {
            const now = new Date();
            const backupTime = now.toISOString();
            const backupId = now.getTime();
            
            // 创建备份数据
            const backupData = {
              id: backupId,
              createTime: backupTime,
              data: {
                users: schema.db.users.all(),
                posts: schema.db.posts.all(),
                comments: schema.db.comments.all(),
                brands: schema.db.brands.all(),
                models: schema.db.phoneModels.all(),
                settings: schema.db.settings,
                logs: schema.db.logs.all()
              },
              size: 0, // 实际大小将在保存时计算
              status: 'success',
              type: 'full',
              description: '系统完整备份'
            };
            
            // 保存备份数据
            schema.db.backups.insert(backupData);
            
            // 记录日志
            schema.db.logs.insert({
              type: 'system',
              action: '系统备份',
              description: '管理员创建了系统备份',
              operator: 'admin',
              createTime: backupTime,
              ip: request.headers['x-forwarded-for'] || '127.0.0.1',
              userAgent: request.headers['user-agent']
            });
            
            return {
              code: 200,
              message: '系统备份成功',
              data: {
                id: backupId,
                createTime: backupTime,
                type: 'full',
                description: '系统完整备份'
              }
            };
          });
          
          this.get('/admin/backups', (schema, request) => {
            const { page = 1, limit = 10 } = request.queryParams;
            const backups = schema.db.backups || [];
            
            // 按时间倒序排序
            backups.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
            
            // 分页
            const total = backups.length;
            const items = backups.slice((page - 1) * limit, page * limit);
            
            // 返回结果
            return {
              code: 200,
              data: {
                total,
                items: items.map(backup => ({
                  id: backup.id,
                  createTime: backup.createTime,
                  type: backup.type,
                  description: backup.description,
                  status: backup.status,
                  size: backup.size
                }))
              }
            };
          });
          
          this.delete('/admin/backups/:id', (schema, request) => {
            const id = request.params.id;
            const backup = schema.db.backups.find(id);
            
            if (!backup) {
              return {
                code: 404,
                message: '备份不存在'
              };
            }
            
            // 删除备份
            schema.db.backups.remove(id);
            
            // 记录日志
            schema.db.logs.insert({
              type: 'system',
              action: '删除备份',
              description: `管理员删除了备份 ${id}`,
              operator: 'admin',
              createTime: new Date().toISOString(),
              ip: request.headers['x-forwarded-for'] || '127.0.0.1',
              userAgent: request.headers['user-agent']
            });
            
            return {
              code: 200,
              message: '删除备份成功'
            };
          });
          
          this.post('/admin/backups/:id/restore', (schema, request) => {
            const id = request.params.id;
            const backup = schema.db.backups.find(id);
            
            if (!backup) {
              return {
                code: 404,
                message: '备份不存在'
              };
            }
            
            // 恢复备份数据
            const { data } = backup;
            schema.db.users = data.users;
            schema.db.posts = data.posts;
            schema.db.comments = data.comments;
            schema.db.brands = data.brands;
            schema.db.phoneModels = data.models;
            schema.db.settings = data.settings;
            schema.db.logs = data.logs;
            
            // 记录日志
            schema.db.logs.insert({
              type: 'system',
              action: '恢复备份',
              description: `管理员恢复了备份 ${id}`,
              operator: 'admin',
              createTime: new Date().toISOString(),
              ip: request.headers['x-forwarded-for'] || '127.0.0.1',
              userAgent: request.headers['user-agent']
            });
            
            return {
              code: 200,
              message: '恢复备份成功'
            };
          });

          this.post('/admin/notifications', (schema, request) => {
            const notification = JSON.parse(request.requestBody);
            const now = new Date().toISOString();
            
            // 创建通知
            const id = schema.db.notifications.insert({
              ...notification,
              createTime: now,
              status: 1,
              isRead: false,
              type: notification.type || 'system',
              priority: notification.priority || 'normal',
              targetUsers: notification.targetUsers || [],
              expireTime: notification.expireTime || null
            });
            
            // 记录日志
            schema.db.logs.insert({
              type: 'system',
              action: '发送通知',
              description: `管理员发送了通知: ${notification.title}`,
              operator: 'admin',
              createTime: now,
              ip: request.headers['x-forwarded-for'] || '127.0.0.1',
              userAgent: request.headers['user-agent']
            });
            
            return {
              code: 200,
              message: '发送通知成功',
              data: {
                id,
                createTime: now,
                status: 1,
                type: notification.type || 'system'
              }
            };
          });
          
          this.get('/admin/notifications', (schema, request) => {
            const { page = 1, limit = 10, type, status } = request.queryParams;
            let notifications = schema.db.notifications || [];
            
            // 按类型筛选
            if (type) {
              notifications = notifications.filter(n => n.type === type);
            }
            
            // 按状态筛选
            if (status !== undefined) {
              notifications = notifications.filter(n => n.status === parseInt(status));
            }
            
            // 按时间倒序排序
            notifications.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
            
            // 分页
            const total = notifications.length;
            const items = notifications.slice((page - 1) * limit, page * limit);
            
            // 统计通知类型分布
            const typeDistribution = {
              system: 0,
              user: 0,
              post: 0,
              comment: 0,
              other: 0
            };
            
            notifications.forEach(n => {
              if (typeDistribution[n.type] !== undefined) {
                typeDistribution[n.type]++;
              } else {
                typeDistribution.other++;
              }
            });
            
            // 返回结果
            return {
              code: 200,
              data: {
                total,
                items: items.map(n => ({
                  id: n.id,
                  title: n.title,
                  content: n.content,
                  type: n.type,
                  priority: n.priority,
                  status: n.status,
                  createTime: n.createTime,
                  expireTime: n.expireTime,
                  targetUsers: n.targetUsers,
                  readCount: n.readCount || 0
                })),
                typeDistribution,
                summary: {
                  totalNotifications: total,
                  activeNotifications: notifications.filter(n => n.status === 1).length,
                  expiredNotifications: notifications.filter(n => n.expireTime && new Date(n.expireTime) < new Date()).length
                }
              }
            };
          });
          
          this.put('/admin/notifications/:id', (schema, request) => {
            const id = request.params.id;
            const notification = JSON.parse(request.requestBody);
            const existingNotification = schema.db.notifications.find(id);
            
            if (!existingNotification) {
              return {
                code: 404,
                message: '通知不存在'
              };
            }
            
            // 更新通知
            const now = new Date().toISOString();
            schema.db.notifications.update(id, {
              ...notification,
              updateTime: now
            });
            
            // 记录日志
            schema.db.logs.insert({
              type: 'system',
              action: '更新通知',
              description: `管理员更新了通知: ${notification.title}`,
              operator: 'admin',
              createTime: now,
              ip: request.headers['x-forwarded-for'] || '127.0.0.1',
              userAgent: request.headers['user-agent']
            });
            
            return {
              code: 200,
              message: '更新通知成功',
              data: {
                id,
                updateTime: now,
                status: notification.status,
                type: notification.type
              }
            };
          });
          
          this.delete('/admin/notifications/:id', (schema, request) => {
            const id = request.params.id;
            const notification = schema.db.notifications.find(id);
            
            if (!notification) {
              return {
                code: 404,
                message: '通知不存在'
              };
            }
            
            // 删除通知
            schema.db.notifications.remove(id);
            
            // 记录日志
            schema.db.logs.insert({
              type: 'system',
              action: '删除通知',
              description: `管理员删除了通知: ${notification.title}`,
              operator: 'admin',
              createTime: new Date().toISOString(),
              ip: request.headers['x-forwarded-for'] || '127.0.0.1',
              userAgent: request.headers['user-agent']
            });
            
            return {
              code: 200,
              message: '删除通知成功'
            };
          });
        } catch (error) {
          console.error('配置API路由时出错:', error);
          return null;
        }
      }
    });
    
    console.log('模拟服务器创建成功!');
    return server;
  } catch (error) {
    console.error('创建模拟服务器失败，返回空对象:', error);
    // 返回一个最小的mock服务器，避免应用崩溃
    return {
      shutdown: () => console.log('关闭模拟服务器')
    };
  }
} 

// 获取公告位置描述
function getPositionDesc(position) {
  const positionMap = {
    'home': '网站首页',
    'review': '评测列表页',
    'phone': '手机列表页',
    'user': '用户中心',
    'global': '全站公告'
  };
  
  return positionMap[position] || '未知位置';
}