import { createServer } from 'miragejs';

// 模拟用户数据
const users = [
  {
    id: 1,
    username: '手机爱好者',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    email: 'user1@example.com',
    signature: '热爱科技，分享生活',
    registerTime: '2023-01-15',
    stats: {
      posts: 32,
      likes: 128,
      favorites: 56
    },
    isAdmin: false
  },
  {
    id: 2,
    username: '数码博主',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    email: 'user2@example.com',
    signature: '专注手机评测十年，只为找到最适合你的那一款',
    registerTime: '2022-05-20',
    stats: {
      posts: 157,
      likes: 1205,
      favorites: 89
    },
    isAdmin: true
  }
];

// 模拟帖子数据
const posts = [
  {
    id: 1,
    userId: 1,
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
    views: 256
  },
  {
    id: 2,
    userId: 2,
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
    views: 189
  },
  {
    id: 3,
    userId: 1,
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
    views: 542
  },
  {
    id: 4,
    userId: 2,
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
    views: 146
  },
  {
    id: 5,
    userId: 1,
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
    views: 113
  },
  {
    id: 6,
    userId: 2,
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
    views: 178
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

// 模拟品牌数据
const brands = [
  { id: 1, name: 'Apple', logo: 'https://example.com/logo/apple.png' },
  { id: 2, name: '小米', logo: 'https://example.com/logo/xiaomi.png' },
  { id: 3, name: '华为', logo: 'https://example.com/logo/huawei.png' },
  { id: 4, name: 'OPPO', logo: 'https://example.com/logo/oppo.png' },
  { id: 5, name: '华硕', logo: 'https://example.com/logo/asus.png' },
  { id: 6, name: '三星', logo: 'https://example.com/logo/samsung.png' },
  { id: 7, name: 'vivo', logo: 'https://example.com/logo/vivo.png' },
  { id: 8, name: '一加', logo: 'https://example.com/logo/oneplus.png' }
];

// 模拟手机型号数据
const phoneModels = [
  { id: 1, brandId: 1, name: 'iPhone 15 Pro', releaseDate: '2023-09-01', price: 7999 },
  { id: 2, brandId: 1, name: 'iPhone 15', releaseDate: '2023-09-01', price: 5999 },
  { id: 3, brandId: 1, name: 'iPhone 14 Pro', releaseDate: '2022-09-01', price: 6999 },
  
  { id: 4, brandId: 2, name: '小米14', releaseDate: '2023-10-01', price: 4999 },
  { id: 5, brandId: 2, name: '小米13', releaseDate: '2022-12-01', price: 3999 },
  { id: 6, brandId: 2, name: '红米K60', releaseDate: '2023-01-01', price: 2999 },
  
  { id: 7, brandId: 3, name: 'Mate60 Pro', releaseDate: '2023-08-01', price: 6999 },
  { id: 8, brandId: 3, name: 'P60 Pro', releaseDate: '2023-03-01', price: 6499 },
  
  { id: 9, brandId: 4, name: 'Find X7 Pro', releaseDate: '2023-01-15', price: 5999 },
  
  { id: 10, brandId: 5, name: 'ROG Phone 7', releaseDate: '2023-05-01', price: 5499 },
  
  { id: 11, brandId: 6, name: 'Galaxy Z Fold5', releaseDate: '2023-08-01', price: 13999 },
  { id: 12, brandId: 6, name: 'Galaxy S23 Ultra', releaseDate: '2023-02-01', price: 8999 }
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
        id: parseInt(user.id)
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
        // 获取查询参数
        const queryParams = request.queryParams;
        const page = parseInt(queryParams['page'] || queryParams['params[page]'] || 1);
        const pageSize = parseInt(queryParams['pageSize'] || queryParams['params[pageSize]'] || 10);
        const sortBy = queryParams['sortBy'] || queryParams['params[sortBy]'] || 'createTime';
        const sortOrder = queryParams['sortOrder'] || queryParams['params[sortOrder]'] || 'desc';
        const filter = queryParams['filter'] || queryParams['params[filter]'];
        const search = queryParams['search'] || queryParams['params[search]'];
        
        console.log('请求参数:', { page, pageSize, sortBy, sortOrder, filter, search });
        
        let filteredPosts = schema.db.posts;
        
        // 筛选
        if (filter === 'followed') {
          // 模拟关注的用户帖子
          filteredPosts = filteredPosts.filter(post => post.userId === 2);
        } else if (filter === 'recommend') {
          // 模拟推荐帖子（点赞数高的）
          filteredPosts = filteredPosts.sort((a, b) => b.likes - a.likes);
        }
        
        // 搜索
        if (search) {
          filteredPosts = filteredPosts.filter(post => 
            post.title?.includes(search) || post.content?.includes(search)
          );
        }
        
        // 排序
        if (sortBy && sortOrder) {
          filteredPosts = filteredPosts.sort((a, b) => {
            if (sortOrder.toLowerCase() === 'desc') {
              return b[sortBy] > a[sortBy] ? 1 : -1;
            } else {
              return a[sortBy] > b[sortBy] ? 1 : -1;
            }
          });
        }
        
        // 分页
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedPosts = filteredPosts.slice(start, end);
        
        // 关联用户和手机信息
        const postsWithDetails = paginatedPosts.map(post => {
          const userId = parseInt(post.userId);
          const brandId = parseInt(post.brandId);
          const modelId = parseInt(post.modelId);
          
          // 查找用户
          const user = schema.db.users.findBy({ id: userId });
          // 查找品牌
          const brand = schema.db.brands.findBy({ id: brandId });
          // 查找型号
          const model = schema.db.phoneModels.findBy({ id: modelId });
          
          console.log(`处理帖子 ID=${post.id}，查找用户 ID=${userId}，用户: ${user ? '找到' : '未找到'}`);
          console.log(`处理帖子 ID=${post.id}，查找品牌 ID=${brandId}，品牌: ${brand ? '找到' : '未找到'}`);
          console.log(`处理帖子 ID=${post.id}，查找型号 ID=${modelId}，型号: ${model ? '找到' : '未找到'}`);

          // 返回带有关联数据的详细信息
          return {
            ...post,
            username: user?.username || 'Unknown',
            userAvatar: user?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            brand: brand?.name || 'Unknown Brand',
            phoneModel: model?.name || 'Unknown Model',
            brandId: brandId,
            modelId: modelId,
            createTime: post.createTime || new Date().toISOString()
          };
        });
        
        const result = {
          code: 200,
          message: '获取成功',
          data: {
            records: postsWithDetails,
            total: filteredPosts.length,
            page: page,
            pageSize: pageSize
          }
        };
        
        console.log('Posts API 返回结果:', JSON.stringify(result.data.records.slice(0, 2), null, 2));
        
        return result;
      });

      this.get('/posts/:id', (schema, request) => {
        const postId = parseInt(request.params.id);
        console.log(`获取帖子详情，ID=${postId}`);
        
        // 查找帖子
        const post = schema.db.posts.findBy({ id: postId });
        
        if (!post) {
          console.log(`帖子不存在，ID=${postId}`);
          return { code: 404, message: '帖子不存在' };
        }
        
        // 获取用户、品牌和型号信息
        const userId = parseInt(post.userId);
        const brandId = parseInt(post.brandId);
        const modelId = parseInt(post.modelId);
        
        // 查找用户
        const user = schema.db.users.findBy({ id: userId });
        // 查找品牌
        const brand = schema.db.brands.findBy({ id: brandId });
        // 查找型号
        const model = schema.db.phoneModels.findBy({ id: modelId });
        
        console.log(`帖子详情 ID=${postId}，查找用户 ID=${userId}，用户: ${user ? '找到' : '未找到'}`);
        console.log(`帖子详情 ID=${postId}，查找品牌 ID=${brandId}，品牌: ${brand ? brand.name : '未找到'}`);
        console.log(`帖子详情 ID=${postId}，查找型号 ID=${modelId}，型号: ${model ? model.name : '未找到'}`);
        
        // 获取评论列表
        const commentsData = schema.db.comments.where({ postId }).sort((a, b) => {
          return new Date(b.createTime) - new Date(a.createTime);
        });
        
        // 为每条评论关联用户信息
        const commentsWithUser = commentsData.map(comment => {
          const commentUserId = parseInt(comment.userId);
          const commentUser = schema.db.users.findBy({ id: commentUserId });
          
          return {
            ...comment,
            user: commentUser || { id: 0, username: 'Unknown User', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' }
          };
        });
        
        // 构建返回数据
        const result = {
          ...post,
          username: user?.username || 'Unknown',
          userAvatar: user?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          brand: brand?.name || 'Unknown Brand',
          phoneModel: model?.name || 'Unknown Model',
          brandId: brandId,
          modelId: modelId,
          comments: commentsWithUser.length,
          commentList: commentsWithUser.map(comment => ({
            ...comment,
            username: comment.user?.username,
            userAvatar: comment.user?.avatar,
            // 保留 user 对象以保持向后兼容性
          }))
        };
        
        console.log(`返回帖子详情数据：ID=${postId}, 评论数=${commentsWithUser.length}`);
        
        return {
          code: 200,
          message: '获取成功',
          data: result
        };
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
      this.get('/brands', (schema, request) => {
        const brandsList = schema.db.brands;
        console.log('获取所有品牌列表:', { count: brandsList.length });
        
        return {
          code: 200,
          message: '获取成功',
          data: brandsList
        };
      });
      
      this.get('/brands/:id/models', (schema, request) => {
        const brandId = parseInt(request.params.id);
        const modelsList = schema.db.phoneModels.where({ brandId });
        
        console.log(`获取品牌(ID=${brandId})的型号列表:`, { count: modelsList.length });
        
        return {
          code: 200,
          message: '获取成功',
          data: modelsList
        };
      });
      
      this.get('/phones/hot', (schema, request) => {
        // 返回热门手机型号（随机选择5个）
        const allModels = schema.db.phoneModels;
        const hotModels = [];
        
        // 确保至少返回5个或全部（如果总数少于5个）
        const count = Math.min(5, allModels.length);
        
        // 随机选择不重复的型号
        const indices = new Set();
        while (indices.size < count) {
          const randomIndex = Math.floor(Math.random() * allModels.length);
          indices.add(randomIndex);
        }
        
        // 构建热门型号列表
        indices.forEach(index => {
          const model = allModels[index];
          const brand = schema.db.brands.findBy({ id: model.brandId });
          
          hotModels.push({
            ...model,
            brandName: brand?.name || 'Unknown Brand'
          });
        });
        
        return {
          code: 200,
          message: '获取成功',
          data: hotModels
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
    }
  });
} 