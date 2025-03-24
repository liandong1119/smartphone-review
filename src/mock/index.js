import { createServer } from 'miragejs';
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
    userId: 3,  // 数码达人
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
    userId: 4,  // 手机迷
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
    image: 'https://img.alicdn.com/imgextra/i3/1917047079/O1CN01dPH3Wy22UbBZRRdP2_!!1917047079.png',
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

// 创建模拟服务器
export function createMockServer() {
  return createServer({
    seeds(server) {
      console.log('正在初始化模拟数据...');
      
      // 修复ID到数字类型
      const fixedBrands = brands.map(brand => ({
        ...brand,
        id: parseInt(brand.id)
      }));
      
      const fixedPhoneModels = phoneModels.map(model => ({
        ...model,
        id: parseInt(model.id),
        brandId: parseInt(model.brandId)
      }));

      const fixedUsers = users.map(user => ({
        ...user,
        id: parseInt(user.id),
        // 确保role字段存在
        role: user.role || 'user'
      }));

      const fixedPosts = posts.map(post => ({
        ...post,
        id: parseInt(post.id),
        userId: parseInt(post.userId),
        brandId: parseInt(post.brandId),
        modelId: parseInt(post.modelId),
        createTime: post.createTime || new Date().toISOString()
      }));

      const fixedComments = comments.map(comment => ({
        ...comment,
        id: parseInt(comment.id),
        postId: parseInt(comment.postId),
        userId: parseInt(comment.userId),
        createTime: comment.createTime || new Date().toISOString()
      }));

      // 初始化通知数据
      const notifications = [
        { 
          id: 1, 
          userId: 1, 
          title: '评论回复通知',
          content: '<strong>用户二</strong>回复了您对<strong>iPhone 15 Pro</strong>的评论: "完全没问题，轻度使用能撑两天"', 
          type: 'comment_reply', 
          postId: 1,
          commentId: 2,
          senderId: 2,
          senderAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          isRead: false, 
          link: '/review/1',
          createTime: '2023-09-15 14:30:00'
        },
        { 
          id: 2, 
          userId: 1, 
          title: '点赞通知',
          content: '<strong>用户二</strong>点赞了您的<strong>华为Mate60 Pro</strong>评测文章', 
          type: 'post_like', 
          postId: 3,
          senderId: 2,
          senderAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          isRead: true, 
          link: '/review/3',
          createTime: '2023-09-13 09:45:00'
        },
        { 
          id: 3, 
          userId: 1, 
          title: '系统通知',
          content: '您的账号已完成实名认证，现在可以使用全部功能了', 
          type: 'system', 
          senderAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          isRead: false, 
          createTime: '2023-09-12 10:30:00'
        },
        { 
          id: 4, 
          userId: 1, 
          title: '评论通知',
          content: '<strong>用户二</strong>评论了您的<strong>iPhone 15 Pro</strong>评测: "夜景样张可以分享一下吗？听说有很大进步"', 
          type: 'comment', 
          postId: 1,
          commentId: 3,
          senderId: 2,
          senderAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          isRead: false, 
          link: '/review/1',
          createTime: '2023-09-15 11:20:00'
        },
        { 
          id: 5, 
          userId: 1, 
          title: '关注通知',
          content: '<strong>用户二</strong>关注了您', 
          type: 'user_follow', 
          senderId: 2,
          senderAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          isRead: false, 
          link: '/user-profile/2',
          createTime: '2023-09-10 16:20:00'
        },
        { 
          id: 6, 
          userId: 1, 
          title: '点赞通知',
          content: '<strong>用户二</strong>点赞了您对<strong>华为Mate60 Pro</strong>的评论', 
          type: 'comment_like', 
          postId: 3,
          commentId: 10,
          senderId: 2,
          senderAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          isRead: true, 
          link: '/review/3',
          createTime: '2023-09-08 08:15:00'
        },
        { 
          id: 7, 
          userId: 1, 
          title: '系统通知',
          content: '智能手机评测论坛已上线全新版本，新增了更多功能，欢迎体验！', 
          type: 'system', 
          senderAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          isRead: true, 
          createTime: '2023-09-01 00:00:00'
        }
      ];

      console.log(`初始化的数据统计：
        品牌: ${fixedBrands.length} 条
        手机型号: ${fixedPhoneModels.length} 条
        用户: ${fixedUsers.length} 条
        帖子: ${fixedPosts.length} 条
        评论: ${fixedComments.length} 条
        通知: ${notifications.length} 条
      `);

      // 打印一些数据样本进行确认
      console.log('品牌样本:', fixedBrands.slice(0, 2));
      console.log('型号样本:', fixedPhoneModels.slice(0, 2));
      console.log('用户样本:', fixedUsers.slice(0, 2));
      console.log('帖子样本:', fixedPosts.slice(0, 2));

      // 加载数据到服务器
      server.db.loadData({
        brands: fixedBrands,
        phoneModels: fixedPhoneModels,
        users: fixedUsers,
        posts: fixedPosts,
        comments: fixedComments,
        notifications: notifications
      });

      console.log('模拟数据初始化完成');
      
      // 打印数据库表名和记录数
      console.log('数据库表信息:', {
        brands: server.db.brands.length,
        phoneModels: server.db.phoneModels.length,
        users: server.db.users.length,
        posts: server.db.posts.length,
        comments: server.db.comments.length
      });
      
      // 打印第一个品牌和型号，验证数据结构
      if (server.db.brands.length > 0) {
        console.log('第一个品牌示例:', server.db.brands[0]);
      }
      
      if (server.db.phoneModels.length > 0) {
        console.log('第一个型号示例:', server.db.phoneModels[0]);
      }
    },

    routes() {
      this.namespace = 'api';
      this.timing = 1000; // 增加响应延迟，模拟真实网络请求

      // 用户相关接口
      this.get('/user/info', (schema, request) => {
        // 模拟已登录用户，返回第一个用户的信息
        return schema.db.users[0];
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
        const attrs = JSON.parse(request.requestBody);
        const { username, password } = attrs;
        
        // 简单的登录验证
        if (username === 'admin' && password === 'password') {
          return {
            code: 200,
            message: '登录成功',
            data: {
              token: 'mock-token-123456',
              user: schema.db.users[1] // 返回管理员用户
            }
          };
        } else if (username === 'user' && password === 'password') {
          return {
            code: 200,
            message: '登录成功',
            data: {
              token: 'mock-token-abcdef',
              user: schema.db.users[0] // 返回普通用户
            }
          };
        } else {
          return {
            code: 401,
            message: '用户名或密码错误'
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

      // 用户发布的评测
      this.get('/user/posts', (schema, request) => {
        const { page = 1, pageSize = 10 } = request.queryParams;
        
        // 获取当前用户的评测
        let userPosts = schema.db.posts.filter(p => p.userId === 1);
        
        // 按时间排序（最新的在前）
        userPosts = userPosts.sort((a, b) => 
          new Date(b.createTime) - new Date(a.createTime)
        );
        
        // 分页
        const start = (page - 1) * pageSize;
        const end = start + parseInt(pageSize);
        const paginatedPosts = userPosts.slice(start, end);
        
        // 关联用户和手机信息
        const postsWithDetails = paginatedPosts.map(post => {
          const user = schema.db.users.find(u => u.id === post.userId);
          
          // 确保 brandId 和 modelId 是有效的数字
          const brandId = typeof post.brandId === 'number' ? post.brandId : parseInt(post.brandId);
          const modelId = typeof post.modelId === 'number' ? post.modelId : parseInt(post.modelId);
          
          // 修改查找方式，确保正确比较ID
          const brand = schema.db.brands.findBy({ id: brandId });
          const model = schema.db.phoneModels.findBy({ id: modelId });
          
          console.log(`处理帖子 ID=${post.id}:`, { 
            userId: post.userId,
            userFound: !!user,
            username: user?.username || 'Unknown',
            brandId, 
            modelId,
            brandFound: !!brand,
            modelFound: !!model,
            brand: brand?.name || 'Unknown Brand', 
            model: model?.name || 'Unknown Model' 
          });
          
          // 构建帖子详情
          const postDetail = {
            ...post,
            username: user?.username || 'Unknown',
            userAvatar: user?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
          };
          
          // 添加品牌和型号信息
          if (brand) {
            postDetail.brand = brand.name;
            // 保留brandId用于调试
            postDetail.brandId = brandId;
          } else {
            postDetail.brand = 'Unknown Brand';
            postDetail.brandId = brandId;
            console.warn(`找不到帖子(ID=${post.id})的品牌(brandId=${brandId})`);
          }
          
          if (model) {
            postDetail.phoneModel = model.name;
            // 保留modelId用于调试
            postDetail.modelId = modelId;
          } else {
            postDetail.phoneModel = 'Unknown Model';
            postDetail.modelId = modelId;
            console.warn(`找不到帖子(ID=${post.id})的型号(modelId=${modelId})`);
          }
          
          return postDetail;
        });
        
        return {
          code: 200,
          message: '获取成功',
          data: {
            records: postsWithDetails,
            total: userPosts.length,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
          }
        };
      });
      
      // 用户收藏的评测
      this.get('/user/favorites', (schema, request) => {
        const { page = 1, pageSize = 10 } = request.queryParams;
        
        // 模拟收藏的帖子（随机选择3个）
        let favoritePosts = schema.db.posts.filter(p => p.id % 3 === 0);
        
        // 按时间排序
        favoritePosts = favoritePosts.sort((a, b) => 
          new Date(b.createTime) - new Date(a.createTime)
        );
        
        // 分页
        const start = (page - 1) * pageSize;
        const end = start + parseInt(pageSize);
        const paginatedPosts = favoritePosts.slice(start, end);
        
        // 关联用户和手机信息
        const postsWithDetails = paginatedPosts.map(post => {
          const user = schema.db.users.find(u => u.id === post.userId);
          const brand = schema.db.brands.find(b => b.id === post.brandId);
          const model = schema.db.phoneModels.find(m => m.id === post.modelId);
          
          return {
            ...post,
            username: user?.username || 'Unknown',
            userAvatar: user?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            brand: brand?.name || 'Unknown Brand',
            phoneModel: model?.name || 'Unknown Model'
          };
        });
        
        return {
          code: 200,
          message: '获取成功',
          data: {
            records: postsWithDetails,
            total: favoritePosts.length,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
          }
        };
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
          
          return {
            ...post,
            username: user ? user.username : 'Unknown User',
            userAvatar: user ? user.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            brand: brand ? brand.name : '',
            phoneModel: phoneModel ? phoneModel.name : '',
            model: phoneModel ? phoneModel.name : '',  // 为了兼容性同时提供model字段
            brandId: brand ? brand.id : null,
            modelId: phoneModel ? phoneModel.id : null
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
        
        const postWithDetails = {
          ...post,
          username: user ? user.username : 'Unknown User',
          userAvatar: user ? user.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          brand: brand ? brand.name : '',
          phoneModel: phoneModel ? phoneModel.name : '',
          model: phoneModel ? phoneModel.name : '',  // 为了兼容性同时提供model字段
          brandId: brand ? brand.id : null,
          modelId: phoneModel ? phoneModel.id : null
        }
        
        // 获取用户是否已点赞或收藏
        // 这里只是模拟，实际应该根据当前登录用户状态返回
        postWithDetails.isLiked = Math.random() > 0.5
        postWithDetails.isFavorited = Math.random() > 0.5
        
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
        // 获取未读通知数量
        const unreadCount = schema.db.notifications.filter(n => !n.isRead && n.userId === 1).length;
        
        return {
          code: 200,
          message: '获取成功',
          data: unreadCount
        };
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

      // ========== 管理接口 ==========
      
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
        
        schema.db.users.update(id, { status });
        
        return {
          code: 200,
          message: status === 1 ? '启用用户成功' : '禁用用户成功'
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
        const { status } = JSON.parse(request.requestBody);
        const post = schema.db.posts.find(id);
        
        if (!post) {
          return {
            code: 404,
            message: '帖子不存在'
          };
        }
        
        schema.db.posts.update(id, { status });
        
        let statusText = '更新';
        if (status === 0) statusText = '屏蔽';
        if (status === 1) statusText = '通过';
        if (status === 2) statusText = '设为待审核';
        
        return {
          code: 200,
          message: `${statusText}帖子成功`
        };
      });
      
      // 评论管理API
      this.get('/admin/comments', (schema, request) => {
        const { page = 1, pageSize = 10, keyword = '' } = request.queryParams;
        
        let comments = schema.db.comments;
        
        // 应用搜索条件
        if (keyword) {
          comments = comments.filter(comment => 
            comment.content.includes(keyword)
          );
        }
        
        // 获取用户信息和帖子信息
        const records = comments.map(comment => {
          const user = schema.db.users.find(comment.userId);
          const post = schema.db.posts.find(comment.postId);
          
          return {
            ...comment,
            username: user ? user.username : '未知用户',
            userAvatar: user ? user.avatar : '',
            postTitle: post ? post.title : '未知帖子'
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
        const body = JSON.parse(request.requestBody);
        
        const announcement = {
          id: schema.db.announcements ? schema.db.announcements.length + 1 : 1,
          ...body,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString()
        };
        
        schema.db.announcements.insert(announcement);
        
        return {
          code: 200,
          message: '添加公告成功',
          data: announcement
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
    }
  });
} 