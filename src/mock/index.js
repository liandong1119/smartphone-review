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
      server.db.loadData({
        users,
        posts,
        comments,
        brands,
        phoneModels,
        announcements
      });
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
        return schema.db.users[0].stats;
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

      // 评测帖子相关接口
      this.get('/posts', (schema, request) => {
        const { filter, search, page = 1, limit = 10 } = request.queryParams;
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
            post.title.includes(search) || post.content.includes(search)
          );
        }
        
        // 分页
        const start = (page - 1) * limit;
        const end = start + parseInt(limit);
        const paginatedPosts = filteredPosts.slice(start, end);
        
        // 关联用户和手机信息
        const postsWithDetails = paginatedPosts.map(post => {
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
          message: '获取成功',
          data: {
            list: postsWithDetails,
            total: filteredPosts.length,
            page: parseInt(page),
            limit: parseInt(limit)
          }
        };
      });

      this.get('/posts/:id', (schema, request) => {
        const id = request.params.id;
        const post = schema.db.posts.find(id);
        
        if (!post) {
          return {
            code: 404,
            message: '评测不存在'
          };
        }
        
        const user = schema.db.users.find(post.userId);
        const brand = schema.db.brands.find(post.brandId);
        const model = schema.db.phoneModels.find(post.modelId);
        const postComments = schema.db.comments.filter(c => c.postId === parseInt(id));
        
        // 构建评论列表，包含用户信息
        const commentsWithUser = postComments.map(comment => {
          const commentUser = schema.db.users.find(comment.userId);
          return {
            ...comment,
            user: {
              id: commentUser.id,
              username: commentUser.username,
              avatar: commentUser.avatar
            }
          };
        });
        
        return {
          code: 200,
          message: '获取成功',
          data: {
            ...post,
            user: {
              id: user.id,
              username: user.username,
              avatar: user.avatar,
              signature: user.signature
            },
            brand: brand.name,
            phoneModel: model.name,
            comments: commentsWithUser
          }
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
      this.get('/posts/:postId/comments', (schema, request) => {
        const postId = parseInt(request.params.postId);
        const { page = 1, limit = 20 } = request.queryParams;
        
        // 获取评论
        let postComments = schema.db.comments.filter(c => c.postId === postId);
        
        // 按时间排序
        postComments = postComments.sort((a, b) => 
          new Date(b.createTime) - new Date(a.createTime)
        );
        
        // 分页
        const start = (page - 1) * limit;
        const end = start + parseInt(limit);
        const paginatedComments = postComments.slice(start, end);
        
        // 关联用户信息
        const commentsWithUser = paginatedComments.map(comment => {
          const user = schema.db.users.find(u => u.id === comment.userId);
          return {
            ...comment,
            user: {
              id: user.id,
              username: user.username,
              avatar: user.avatar
            }
          };
        });
        
        return {
          code: 200,
          message: '获取成功',
          data: {
            list: commentsWithUser,
            total: postComments.length,
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

      // 品牌相关接口
      this.get('/brands', (schema, request) => {
        return {
          code: 200,
          message: '获取成功',
          data: schema.db.brands
        };
      });

      this.get('/brands/:brandId/models', (schema, request) => {
        const brandId = parseInt(request.params.brandId);
        const models = schema.db.phoneModels.filter(model => model.brandId === brandId);
        
        return {
          code: 200,
          message: '获取成功',
          data: models
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
    }
  });
} 