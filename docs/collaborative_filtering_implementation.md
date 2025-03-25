# 协同过滤推荐算法实现方案

## 一、系统架构设计

### 1. 系统架构图

```
┌──────────────────┐     ┌───────────────────┐     ┌──────────────────┐
│                  │     │                   │     │                  │
│     前端应用      │────▶│   API网关/负载均衡  │────▶│   推荐服务API     │
│                  │     │                   │     │                  │
└──────────────────┘     └───────────────────┘     └────────┬─────────┘
                                                           │
                                                 ┌─────────▼──────────┐
                                                 │                    │
                                                 │  推荐算法服务        │
                                                 │                    │
                                                 └────────┬───────────┘
                                                          │
                                  ┌────────────────┬──────┴───────┬───────────────┐
                                  │                │              │               │
                          ┌───────▼──────┐  ┌──────▼─────┐  ┌─────▼─────┐  ┌──────▼─────┐
                          │              │  │            │  │           │  │            │
                          │ 用户行为数据库  │  │ 内容数据库   │  │ 特征数据库 │  │ 模型存储库  │
                          │              │  │            │  │           │  │            │
                          └──────────────┘  └────────────┘  └───────────┘  └────────────┘
```

### 2. 系统组件介绍

1. **前端应用**：用户界面，负责展示推荐内容和收集用户行为数据
2. **API网关/负载均衡**：请求路由、限流、认证
3. **推荐服务API**：对外提供RESTful接口
4. **推荐算法服务**：核心算法实现，包括协同过滤和混合推荐
5. **数据存储层**：
   - 用户行为数据库：存储用户交互行为
   - 内容数据库：存储评测帖子、品牌、型号等信息
   - 特征数据库：存储用户和内容的特征向量
   - 模型存储库：存储预计算的相似度矩阵

## 二、前端Mock实现

```javascript
// 协同过滤推荐算法实现
const performCollaborativeFiltering = (allPosts) => {
  // 模拟用户数据和交互历史
  const mockUserInteractions = generateMockUserInteractions(allPosts)
  
  // 当前用户ID（假设为1）
  const currentUserId = 1
  
  // 执行基于用户的协同过滤和基于物品的协同过滤
  const userBasedRecommendations = userBasedCF(currentUserId, mockUserInteractions, allPosts)
  const itemBasedRecommendations = itemBasedCF(currentUserId, mockUserInteractions, allPosts)
  
  // 混合两种推荐结果
  return hybridRecommendations(userBasedRecommendations, itemBasedRecommendations, allPosts)
}

// 生成模拟用户交互数据
const generateMockUserInteractions = (allPosts) => {
  // 模拟10个用户
  const users = Array.from({ length: 10 }, (_, i) => i + 1)
  
  // 为每个用户生成随机交互数据
  const interactions = {}
  
  users.forEach(userId => {
    interactions[userId] = {}
    
    // 每个用户随机与30%-70%的帖子有交互
    const interactionCount = Math.floor(allPosts.length * (0.3 + Math.random() * 0.4))
    
    // 随机选择帖子进行交互
    const selectedPosts = [...allPosts]
      .sort(() => Math.random() - 0.5)
      .slice(0, interactionCount)
    
    selectedPosts.forEach(post => {
      // 生成1-5的随机评分
      interactions[userId][post.id] = Math.floor(Math.random() * 5) + 1
    })
  })
  
  return interactions
}
```

## 三、数据库设计

### 1. 数据表设计

使用MySQL作为主数据库，设计以下核心表（添加字段注释，避免外键关联）：

**users表**：存储用户信息
```sql
CREATE TABLE `users` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID，主键',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名，唯一',
  `email` VARCHAR(255) NOT NULL UNIQUE COMMENT '邮箱地址，唯一',
  `password` VARCHAR(255) NOT NULL COMMENT '密码，加密存储',
  `avatar` VARCHAR(255) COMMENT '用户头像URL',
  `role` VARCHAR(20) DEFAULT 'user' COMMENT '用户角色：user-普通用户，admin-管理员',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `status` INT DEFAULT 1 COMMENT '状态：1-正常，0-禁用'
) COMMENT='用户信息表';
```

**posts表**：存储评测帖子
```sql
CREATE TABLE `posts` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '帖子ID，主键',
  `user_id` BIGINT NOT NULL COMMENT '发布用户ID',
  `title` VARCHAR(255) NOT NULL COMMENT '帖子标题',
  `content` TEXT NOT NULL COMMENT '帖子内容',
  `cover_image` VARCHAR(255) COMMENT '封面图片URL',
  `brand_id` BIGINT COMMENT '品牌ID',
  `model_id` BIGINT COMMENT '型号ID',
  `brand` VARCHAR(100) COMMENT '品牌名称',
  `model` VARCHAR(100) COMMENT '型号名称',
  `views` INT DEFAULT 0 COMMENT '浏览量',
  `likes` INT DEFAULT 0 COMMENT '点赞数',
  `comment_count` INT DEFAULT 0 COMMENT '评论数',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `status` INT DEFAULT 1 COMMENT '状态：1-正常，0-删除，2-置顶',
  KEY `idx_user_id` (`user_id`) COMMENT '用户ID索引',
  KEY `idx_brand_id` (`brand_id`) COMMENT '品牌ID索引',
  KEY `idx_model_id` (`model_id`) COMMENT '型号ID索引',
  KEY `idx_create_time` (`create_time`) COMMENT '创建时间索引'
) COMMENT='评测帖子表';
```

**user_interactions表**：存储用户交互数据
```sql
CREATE TABLE `user_interactions` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '交互ID，主键',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `post_id` BIGINT NOT NULL COMMENT '帖子ID',
  `interaction_type` VARCHAR(20) NOT NULL COMMENT '交互类型：VIEW-浏览，LIKE-点赞，COMMENT-评论，FAVORITE-收藏，RATING-评分',
  `rating` INT COMMENT '评分，1-5分',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `uk_user_post_type` (`user_id`, `post_id`, `interaction_type`) COMMENT '用户-帖子-交互类型唯一索引',
  KEY `idx_user_post` (`user_id`, `post_id`) COMMENT '用户-帖子组合索引',
  KEY `idx_post_type` (`post_id`, `interaction_type`) COMMENT '帖子-交互类型组合索引'
) COMMENT='用户交互表';
```

**item_similarities表**：存储物品相似度（预计算结果）
```sql
CREATE TABLE `item_similarities` (
  `item1_id` BIGINT NOT NULL COMMENT '物品1ID',
  `item2_id` BIGINT NOT NULL COMMENT '物品2ID',
  `similarity` FLOAT NOT NULL COMMENT '相似度，范围0-1',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`item1_id`, `item2_id`) COMMENT '物品1和物品2的组合主键',
  KEY `idx_item2` (`item2_id`) COMMENT '物品2索引'
) COMMENT='物品相似度表';
```

**user_similarities表**：存储用户相似度（预计算结果）
```sql
CREATE TABLE `user_similarities` (
  `user1_id` BIGINT NOT NULL COMMENT '用户1ID',
  `user2_id` BIGINT NOT NULL COMMENT '用户2ID',
  `similarity` FLOAT NOT NULL COMMENT '相似度，范围0-1',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`user1_id`, `user2_id`) COMMENT '用户1和用户2的组合主键',
  KEY `idx_user2` (`user2_id`) COMMENT '用户2索引'
) COMMENT='用户相似度表';
```

### 2. Caffeine缓存设计

使用Caffeine作为本地缓存，提高响应速度和性能：

```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                // 设置缓存初始容量
                .initialCapacity(100)
                // 设置缓存最大容量
                .maximumSize(1000)
                // 设置写入后过期时间
                .expireAfterWrite(30, TimeUnit.MINUTES)
                // 设置访问后过期时间
                .expireAfterAccess(15, TimeUnit.MINUTES)
                // 设置更新后刷新时间
                .refreshAfterWrite(10, TimeUnit.MINUTES)
                // 设置统计功能
                .recordStats());
        
        // 配置缓存名称和对应的配置
        cacheManager.setCacheNames(Arrays.asList(
                "userRecommendations", 
                "similarItems", 
                "userSimilarities", 
                "trendingPosts",
                "userInteractions"
        ));
        return cacheManager;
    }
}
```

**缓存使用示例**:

```java
@Service
public class RecommendationCacheService {
    
    @Autowired
    private CacheManager cacheManager;
    
    /**
     * 获取用户推荐结果缓存
     */
    @Cacheable(value = "userRecommendations", key = "#userId + '-' + #limit")
    public List<PostDTO> getUserRecommendations(Long userId, int limit) {
        // 只有缓存未命中时才会执行此方法体
        return null; // 实际由缓存管理器负责返回
    }
    
    /**
     * 存储用户推荐结果
     */
    @CachePut(value = "userRecommendations", key = "#userId + '-' + #recommendations.size()")
    public List<PostDTO> storeUserRecommendations(Long userId, List<PostDTO> recommendations) {
        return recommendations;
    }
    
    /**
     * 获取相似帖子缓存
     */
    @Cacheable(value = "similarItems", key = "#itemId + '-' + #limit")
    public List<PostDTO> getSimilarPosts(Long itemId, int limit) {
        return null;
    }
    
    /**
     * 存储相似帖子
     */
    @CachePut(value = "similarItems", key = "#itemId + '-' + #similarPosts.size()")
    public List<PostDTO> storeSimilarPosts(Long itemId, List<PostDTO> similarPosts) {
        return similarPosts;
    }
    
    /**
     * 获取热门帖子
     */
    @Cacheable(value = "trendingPosts", key = "#limit")
    public List<PostDTO> getTrendingPosts(int limit) {
        return null;
    }
    
    /**
     * 存储热门帖子
     */
    @CachePut(value = "trendingPosts", key = "#limit")
    public List<PostDTO> storeTrendingPosts(List<PostDTO> trendingPosts, int limit) {
        return trendingPosts;
    }
    
    /**
     * 清除用户相关的所有缓存
     */
    @CacheEvict(value = {"userRecommendations", "userInteractions"}, key = "#userId", allEntries = true)
    public void clearUserCache(Long userId) {
        // 方法体为空，注解已经完成缓存清除操作
    }
    
    /**
     * 清除帖子相关的所有缓存
     */
    @CacheEvict(value = {"similarItems", "trendingPosts"}, allEntries = true)
    public void clearPostsCache() {
        // 方法体为空，注解已经完成缓存清除操作
    }
}
```

## 四、服务模块设计

### 1. 核心服务模块

**RecommendationController**：REST API接口
```java
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    
    @Autowired
    private RecommendationService recommendationService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDTO>> getUserRecommendations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        List<PostDTO> recommendations = recommendationService.getUserRecommendations(userId, limit);
        return ResponseEntity.ok(recommendations);
    }
    
    @GetMapping("/trending")
    public ResponseEntity<List<PostDTO>> getTrendingPosts(
            @RequestParam(defaultValue = "10") int limit) {
        List<PostDTO> trendingPosts = recommendationService.getTrendingPosts(limit);
        return ResponseEntity.ok(trendingPosts);
    }
    
    @GetMapping("/similar/post/{postId}")
    public ResponseEntity<List<PostDTO>> getSimilarPosts(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "5") int limit) {
        List<PostDTO> similarPosts = recommendationService.getSimilarPosts(postId, limit);
        return ResponseEntity.ok(similarPosts);
    }
}
```

**RecommendationService**：业务逻辑层
```java
@Service
public class RecommendationService {
    
    @Autowired
    private UserInteractionRepository interactionRepo;
    
    @Autowired
    private PostRepository postRepo;
    
    @Autowired
    private SimilarityService similarityService;
    
    @Autowired
    private RecommendationCacheService cacheService;
    
    @Autowired
    private RecommendationEngineService engineService;
    
    public List<PostDTO> getUserRecommendations(Long userId, int limit) {
        // 1. 尝试从缓存获取
        List<PostDTO> cachedRecommendations = cacheService.getUserRecommendations(userId, limit);
        if (cachedRecommendations != null && !cachedRecommendations.isEmpty()) {
            return cachedRecommendations;
        }
        
        // 2. 获取用户交互历史
        List<UserInteraction> userInteractions = interactionRepo.findByUserId(userId);
        
        // 3. 无交互历史，返回热门内容
        if (userInteractions.isEmpty()) {
            return getTrendingPosts(limit);
        }
        
        // 4. 计算推荐
        List<PostDTO> recommendations = engineService.computeRecommendations(userId, limit);
        
        // 5. 缓存结果
        cacheService.storeUserRecommendations(userId, recommendations);
        
        return recommendations;
    }
    
    public List<PostDTO> getSimilarPosts(Long postId, int limit) {
        // 1. 尝试从缓存获取
        List<PostDTO> cachedSimilarPosts = cacheService.getSimilarPosts(postId, limit);
        if (cachedSimilarPosts != null && !cachedSimilarPosts.isEmpty()) {
            return cachedSimilarPosts;
        }
        
        // 2. 计算相似帖子
        List<Long> similarPostIds = similarityService.getSimilarItems(postId, limit);
        List<PostDTO> similarPosts = postRepo.findPostsByIds(similarPostIds);
        
        // 3. 缓存结果
        cacheService.storeSimilarPosts(postId, similarPosts);
        
        return similarPosts;
    }
    
    public List<PostDTO> getTrendingPosts(int limit) {
        // 从缓存获取热门帖子
        return cacheService.getTrendingPosts(limit);
    }
} 
```

**RecommendationEngineService**：推荐算法核心实现
```java
@Service
public class RecommendationEngineService {
    
    @Autowired
    private UserInteractionRepository interactionRepo;
    
    @Autowired
    private UserSimilarityRepository userSimilarityRepo;
    
    @Autowired
    private ItemSimilarityRepository itemSimilarityRepo;
    
    @Autowired
    private PostRepository postRepo;
    
    // 主要推荐计算方法
    public List<PostDTO> computeRecommendations(Long userId, int limit) {
        // 混合推荐策略
        List<RecommendationScore> itemScores = new ArrayList<>();
        
        // 1. 获取基于用户的协同过滤推荐
        List<RecommendationScore> userBasedScores = computeUserBasedRecommendations(userId, limit * 2);
        itemScores.addAll(userBasedScores);
        
        // 2. 获取基于物品的协同过滤推荐
        List<RecommendationScore> itemBasedScores = computeItemBasedRecommendations(userId, limit * 2);
        itemScores.addAll(itemBasedScores);
        
        // 3. 合并、去重、排序
        Map<Long, Double> scoreMap = new HashMap<>();
        for (RecommendationScore score : itemScores) {
            if (scoreMap.containsKey(score.getItemId())) {
                // 已存在则取较高分数
                double existingScore = scoreMap.get(score.getItemId());
                scoreMap.put(score.getItemId(), Math.max(existingScore, score.getScore()));
            } else {
                scoreMap.put(score.getItemId(), score.getScore());
            }
        }
        
        // 4. 获取用户已交互物品
        Set<Long> interactedItems = interactionRepo.findItemIdsByUserId(userId);
        
        // 5. 过滤掉已交互物品，按分数排序
        return scoreMap.entrySet().stream()
                .filter(entry -> !interactedItems.contains(entry.getKey()))
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit)
                .map(entry -> postRepo.findById(entry.getKey()).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
    
    // 基于用户的协同过滤推荐计算
    private List<RecommendationScore> computeUserBasedRecommendations(Long userId, int limit) {
        // 1. 获取相似用户
        List<UserSimilarity> similarities = userSimilarityRepo.findSimilarUsers(userId, 20);
        
        // 2. 获取用户已交互物品
        Set<Long> interactedItems = interactionRepo.findItemIdsByUserId(userId);
        
        // 3. 为每个物品计算预测分数
        Map<Long, Double> scoreMap = new HashMap<>();
        Map<Long, Double> similaritySum = new HashMap<>();
        
        for (UserSimilarity similarity : similarities) {
            Long similarUserId = (similarity.getUser1Id().equals(userId)) 
                    ? similarity.getUser2Id() : similarity.getUser1Id();
            double userSimilarity = similarity.getSimilarity();
            
            // 获取相似用户的交互
            List<UserInteraction> interactions = interactionRepo.findByUserId(similarUserId);
            
            for (UserInteraction interaction : interactions) {
                Long itemId = interaction.getPostId();
                
                // 跳过用户已交互的物品
                if (interactedItems.contains(itemId)) {
                    continue;
                }
                
                // 计算加权评分
                double rating = calculateRating(interaction);
                
                // 累加到物品分数
                scoreMap.putIfAbsent(itemId, 0.0);
                similaritySum.putIfAbsent(itemId, 0.0);
                
                scoreMap.put(itemId, scoreMap.get(itemId) + userSimilarity * rating);
                similaritySum.put(itemId, similaritySum.get(itemId) + userSimilarity);
            }
        }
        
        // 4. 归一化分数
        List<RecommendationScore> recommendationScores = new ArrayList<>();
        for (Map.Entry<Long, Double> entry : scoreMap.entrySet()) {
            Long itemId = entry.getKey();
            double sumScore = entry.getValue();
            double sumSimilarity = similaritySum.get(itemId);
            
            if (sumSimilarity > 0) {
                double normalizedScore = sumScore / sumSimilarity;
                recommendationScores.add(new RecommendationScore(itemId, normalizedScore));
            }
        }
        
        // 5. 排序并限制结果数量
        recommendationScores.sort(Comparator.comparing(RecommendationScore::getScore).reversed());
        return recommendationScores.stream().limit(limit).collect(Collectors.toList());
    }
    
    // 基于物品的协同过滤推荐计算
    private List<RecommendationScore> computeItemBasedRecommendations(Long userId, int limit) {
        // 1. 获取用户交互过的物品
        List<UserInteraction> userInteractions = interactionRepo.findByUserId(userId);
        
        // 2. 为每个物品计算预测分数
        Map<Long, Double> scoreMap = new HashMap<>();
        Map<Long, Double> similaritySum = new HashMap<>();
        
        for (UserInteraction interaction : userInteractions) {
            Long interactedItemId = interaction.getPostId();
            double userRating = calculateRating(interaction);
            
            // 获取相似物品
            List<ItemSimilarity> similarItems = itemSimilarityRepo.findSimilarItems(interactedItemId, 20);
            
            for (ItemSimilarity similarity : similarItems) {
                Long similarItemId = (similarity.getItem1Id().equals(interactedItemId)) 
                        ? similarity.getItem2Id() : similarity.getItem1Id();
                double itemSimilarity = similarity.getSimilarity();
                
                // 累加到物品分数
                scoreMap.putIfAbsent(similarItemId, 0.0);
                similaritySum.putIfAbsent(similarItemId, 0.0);
                
                scoreMap.put(similarItemId, scoreMap.get(similarItemId) + itemSimilarity * userRating);
                similaritySum.put(similarItemId, similaritySum.get(similarItemId) + itemSimilarity);
            }
        }
        
        // 3. 归一化分数
        List<RecommendationScore> recommendationScores = new ArrayList<>();
        for (Map.Entry<Long, Double> entry : scoreMap.entrySet()) {
            Long itemId = entry.getKey();
            double sumScore = entry.getValue();
            double sumSimilarity = similaritySum.get(itemId);
            
            if (sumSimilarity > 0) {
                double normalizedScore = sumScore / sumSimilarity;
                recommendationScores.add(new RecommendationScore(itemId, normalizedScore));
            }
        }
        
        // 4. 排序并限制结果数量
        recommendationScores.sort(Comparator.comparing(RecommendationScore::getScore).reversed());
        return recommendationScores.stream().limit(limit).collect(Collectors.toList());
    }
    
    // 根据交互类型计算评分
    private double calculateRating(UserInteraction interaction) {
        // 如果有显式评分，直接使用
        if (interaction.getRating() != null) {
            return interaction.getRating();
        }
        
        // 否则，根据交互类型推断隐式评分
        switch (interaction.getInteractionType()) {
            case "FAVORITE":
                return 5.0;
            case "LIKE":
                return 4.0;
            case "COMMENT":
                return 3.5;
            case "VIEW":
                return 2.0;
            default:
                return 1.0;
        }
    }
    
    // 推荐分数内部类
    @Data
    @AllArgsConstructor
    private static class RecommendationScore {
        private Long itemId;
        private double score;
    }
}
```

**SimilarityService**：相似度计算服务
```java
@Service
public class SimilarityService {
    
    @Autowired
    private UserInteractionRepository interactionRepo;
    
    @Autowired
    private UserSimilarityRepository userSimilarityRepo;
    
    @Autowired
    private ItemSimilarityRepository itemSimilarityRepo;
    
    // 计算用户相似度矩阵
    @Scheduled(cron = "0 0 2 * * ?") // 每天凌晨2点执行
    public void computeUserSimilarityMatrix() {
        log.info("开始计算用户相似度矩阵...");
        
        // 1. 获取所有用户ID
        List<Long> userIds = interactionRepo.findAllUserIds();
        
        // 2. 获取用户-物品评分矩阵
        Map<Long, Map<Long, Double>> userItemRatings = new HashMap<>();
        for (Long userId : userIds) {
            Map<Long, Double> ratings = new HashMap<>();
            List<UserInteraction> interactions = interactionRepo.findByUserId(userId);
            
            for (UserInteraction interaction : interactions) {
                ratings.put(interaction.getPostId(), calculateRating(interaction));
            }
            
            userItemRatings.put(userId, ratings);
        }
        
        // 3. 计算每对用户之间的相似度
        for (int i = 0; i < userIds.size(); i++) {
            Long user1Id = userIds.get(i);
            Map<Long, Double> user1Ratings = userItemRatings.get(user1Id);
            
            for (int j = i + 1; j < userIds.size(); j++) {
                Long user2Id = userIds.get(j);
                Map<Long, Double> user2Ratings = userItemRatings.get(user2Id);
                
                // 计算皮尔逊相关系数
                double similarity = calculatePearsonCorrelation(user1Ratings, user2Ratings);
                
                // 存储相似度
                if (!Double.isNaN(similarity) && similarity > 0) {
                    UserSimilarity userSimilarity = new UserSimilarity();
                    userSimilarity.setUser1Id(user1Id);
                    userSimilarity.setUser2Id(user2Id);
                    userSimilarity.setSimilarity(similarity);
                    userSimilarityRepo.save(userSimilarity);
                }
            }
        }
        
        log.info("用户相似度矩阵计算完成");
    }
    
    // 计算物品相似度矩阵
    @Scheduled(cron = "0 0 3 * * ?") // 每天凌晨3点执行
    public void computeItemSimilarityMatrix() {
        log.info("开始计算物品相似度矩阵...");
        
        // 1. 获取所有物品ID
        List<Long> itemIds = interactionRepo.findAllItemIds();
        
        // 2. 获取物品-用户评分矩阵
        Map<Long, Map<Long, Double>> itemUserRatings = new HashMap<>();
        for (Long itemId : itemIds) {
            Map<Long, Double> ratings = new HashMap<>();
            List<UserInteraction> interactions = interactionRepo.findByPostId(itemId);
            
            for (UserInteraction interaction : interactions) {
                ratings.put(interaction.getUserId(), calculateRating(interaction));
            }
            
            itemUserRatings.put(itemId, ratings);
        }
        
        // 3. 计算每对物品之间的相似度
        for (int i = 0; i < itemIds.size(); i++) {
            Long item1Id = itemIds.get(i);
            Map<Long, Double> item1Ratings = itemUserRatings.get(item1Id);
            
            for (int j = i + 1; j < itemIds.size(); j++) {
                Long item2Id = itemIds.get(j);
                Map<Long, Double> item2Ratings = itemUserRatings.get(item2Id);
                
                // 计算余弦相似度
                double similarity = calculateCosineSimilarity(item1Ratings, item2Ratings);
                
                // 存储相似度
                if (!Double.isNaN(similarity) && similarity > 0) {
                    ItemSimilarity itemSimilarity = new ItemSimilarity();
                    itemSimilarity.setItem1Id(item1Id);
                    itemSimilarity.setItem2Id(item2Id);
                    itemSimilarity.setSimilarity(similarity);
                    itemSimilarityRepo.save(itemSimilarity);
                }
            }
        }
        
        log.info("物品相似度矩阵计算完成");
    }
    
    // 计算皮尔逊相关系数
    private double calculatePearsonCorrelation(Map<Long, Double> ratings1, Map<Long, Double> ratings2) {
        // 找出两个用户共同评分的物品
        Set<Long> commonItems = new HashSet<>(ratings1.keySet());
        commonItems.retainAll(ratings2.keySet());
        
        int n = commonItems.size();
        
        // 至少需要3个共同评分的物品
        if (n < 3) {
            return 0;
        }
        
        // 计算评分和
        double sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
        for (Long itemId : commonItems) {
            double r1 = ratings1.get(itemId);
            double r2 = ratings2.get(itemId);
            
            sum1 += r1;
            sum2 += r2;
            sum1Sq += r1 * r1;
            sum2Sq += r2 * r2;
            pSum += r1 * r2;
        }
        
        // 计算皮尔逊相关系数
        double num = pSum - (sum1 * sum2 / n);
        double den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
        
        if (den == 0) return 0;
        
        return num / den;
    }
    
    // 计算余弦相似度
    private double calculateCosineSimilarity(Map<Long, Double> ratings1, Map<Long, Double> ratings2) {
        // 找出两个物品共同被评分的用户
        Set<Long> commonUsers = new HashSet<>(ratings1.keySet());
        commonUsers.retainAll(ratings2.keySet());
        
        int n = commonUsers.size();
        
        // 至少需要2个共同评分的用户
        if (n < 2) {
            return 0;
        }
        
        // 计算评分和
        double dotProduct = 0, norm1 = 0, norm2 = 0;
        for (Long userId : commonUsers) {
            double r1 = ratings1.get(userId);
            double r2 = ratings2.get(userId);
            
            dotProduct += r1 * r2;
            norm1 += r1 * r1;
            norm2 += r2 * r2;
        }
        
        // 计算余弦相似度
        if (norm1 == 0 || norm2 == 0) return 0;
        
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
    
    // 根据交互类型计算评分
    private double calculateRating(UserInteraction interaction) {
        // 如果有显式评分，直接使用
        if (interaction.getRating() != null) {
            return interaction.getRating();
        }
        
        // 否则，根据交互类型推断隐式评分
        switch (interaction.getInteractionType()) {
            case "FAVORITE":
                return 5.0;
            case "LIKE":
                return 4.0;
            case "COMMENT":
                return 3.5;
            case "VIEW":
                return 2.0;
            default:
                return 1.0;
        }
    }
}
```

## 五、部署策略

### 1. 线上线下分离

为了保证系统性能和可用性，我们采用线上线下分离的策略：

* **线下计算**：
  * 相似度矩阵计算
  * 模型训练和更新
  * 数据分析和评估
  * 定时任务通过Cron调度

* **线上服务**：
  * API请求处理
  * 实时推荐生成
  * 缓存管理
  * 用户行为数据收集

### 2. 部署架构

```
┌─────────────────────────────────────────────────┐
│                线上服务                           │
│                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │ Web服务器  │    │ App服务器 │    │ API网关   │   │
│  └──────────┘    └──────────┘    └──────────┘   │
│         │             │               │         │
│         └─────────────┼───────────────┘         │
│                       │                         │
│               ┌───────▼──────┐                  │
│               │             │                   │
│               │ 推荐服务集群   │                  │
│               │             │                   │
│               └───────┬─────┘                   │
│                       │                         │
│         ┌─────────────┴────────────┐            │
│         │                          │            │
│  ┌──────▼─────┐            ┌──────▼─────┐       │
│  │            │            │            │       │
│  │ Redis集群   │            │ 读库(只读)   │       │
│  │            │            │            │       │
│  └────────────┘            └────────────┘       │
└─────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────┐
│                线下服务                           │
│                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │ ETL服务   │    │ 定时任务   │    │ 数据分析   │   │
│  └──────────┘    └──────────┘    └──────────┘   │
│         │             │               │         │
│         └─────────────┼───────────────┘         │
│                       │                         │
│               ┌───────▼──────┐                  │
│               │             │                   │
│               │ 算法计算集群   │                  │
│               │             │                   │
│               └───────┬─────┘                   │
│                       │                         │
│                       │                         │
│               ┌───────▼──────┐                  │
│               │             │                   │
│               │ 主库(读写)    │                  │
│               │             │                   │
│               └─────────────┘                   │
└─────────────────────────────────────────────────┘
```

### 3. 扩展策略

* **水平扩展**：
  * 增加服务器节点
  * Redis集群分片
  * 数据库读写分离
  * 负载均衡

* **垂直扩展**：
  * 优化算法复杂度
  * 增强硬件配置
  * 细化服务粒度
  * 引入专用计算资源

## 六、冷启动策略

### 1. 新用户冷启动

对于没有交互历史的新用户，我们采用以下策略：

1. **基于人口统计学推荐**：
   * 根据注册时收集的用户基本信息（如年龄、性别、兴趣爱好）分组
   * 向用户推荐该分组中最受欢迎的内容

2. **热门内容推荐**：
   * 向新用户展示全站热门内容
   * 按不同分类展示热门内容，增加多样性

3. **引导式交互**：
   * 引导用户完成初始评分
   * 引导用户选择感兴趣的品牌或机型
   * 基于上述选择快速构建用户画像

### 2. 新内容冷启动

对于新发布的评测内容，我们采用以下策略：

1. **基于内容推荐**：
   * 提取内容特征（品牌、型号、关键词等）
   * 向对相似内容感兴趣的用户推荐

2. **曝光策略**：
   * 给新内容一定的曝光机会
   * 设置衰减曝光比例，结合内容质量和时间因素
   * A/B测试不同的曝光策略

3. **内容创作者的粉丝**：
   * 向创作者粉丝优先推荐新内容
   * 利用已有的社交网络传播

## 七、评估与优化

### 1. 离线评估指标

* **准确率(Precision)**：推荐的内容有多少是用户真正感兴趣的
* **召回率(Recall)**：用户感兴趣的内容有多少被成功推荐
* **F1分数**：准确率和召回率的调和平均值
* **NDCG(归一化折损累积增益)**：评估排序质量
* **覆盖率**：推荐系统覆盖物品集合的比例
* **多样性**：推荐结果的差异程度

### 2. 在线评估指标

* **点击率(CTR)**：用户点击推荐内容的比例
* **转化率**：用户完成目标行为(评论、点赞等)的比例
* **用户停留时间**：用户在推荐内容上花费的时间
* **回访率**：用户再次访问系统的频率
* **用户满意度**：用户反馈和评分

### 3. A/B测试框架

```java
@RestController
@RequestMapping("/api/experiments")
public class ABTestController {
    
    @Autowired
    private ExperimentService experimentService;
    
    @GetMapping("/assign")
    public ResponseEntity<ExperimentGroup> assignUserToExperiment(
            @RequestParam Long userId,
            @RequestParam String experimentName) {
        ExperimentGroup group = experimentService.assignUserToExperiment(userId, experimentName);
        return ResponseEntity.ok(group);
    }
    
    @PostMapping("/log")
    public ResponseEntity<Void> logExperimentEvent(
            @RequestBody ExperimentEvent event) {
        experimentService.logEvent(event);
        return ResponseEntity.ok().build();
    }
}
```

## 八、生产环境启动步骤

### 1. 系统依赖安装

```bash
# 安装JDK 17
sudo apt-get update
sudo apt-get install openjdk-17-jdk

# 安装MySQL
sudo apt-get install mysql-server

# 安装Redis
sudo apt-get install redis-server

# 安装Nginx作为反向代理
sudo apt-get install nginx
```

### 2. 数据库初始化

```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE smartphone_review;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON smartphone_review.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;

# 运行初始化脚本
java -jar database-init.jar --spring.datasource.url=jdbc:mysql://localhost:3306/smartphone_review
```

### 3. 应用部署和启动

```bash
# 克隆代码仓库
git clone https://github.com/your-org/smartphone-review-forum.git
cd smartphone-review-forum

# 构建应用
./mvnw clean package -DskipTests

# 启动应用
java -jar target/recommendation-service.jar --spring.profiles.active=prod
```

### 4. 监控和维护

* **应用监控**：
  * 使用 Prometheus + Grafana 监控系统指标
  * ELK Stack 集中日志管理
  * 设置关键指标告警

* **系统维护**：
  * 定期数据库备份
  * 算法性能回测
  * 推荐质量人工评估

## 九、未来发展方向

### 1. 算法提升

* **深度学习模型**：
  * 引入神经协同过滤(NCF)
  * 使用深度兴趣网络(DIN)捕捉用户兴趣演变
  * 集成序列模型捕捉时间序列特征

* **多目标优化**：
  * 同时优化点击率、转化率和用户满意度等多个目标
  * 平衡推荐系统的商业价值和用户体验

### 2. 功能扩展

* **实时推荐**：
  * 基于当前会话行为实时调整推荐结果
  * 集成流处理框架处理实时数据

* **跨平台个性化**：
  * 整合不同平台的用户行为
  * 构建统一的用户画像

* **内容理解增强**：
  * 整合NLP技术分析评测文本
  * 提取深层内容特征增强推荐质量

## 十、总结

本文档详细介绍了智能手机评测论坛的协同过滤推荐系统实现方案，涵盖了系统架构、数据模型、核心算法、部署策略和发展方向。该方案综合考虑了系统性能、扩展性和用户体验，通过混合推荐策略提供个性化的内容推荐。

实现该系统后，预期能大幅提升用户粘性和内容消费效率，为用户提供更精准的评测内容推荐，同时为平台创造更多价值。通过持续优化算法和扩展功能，该推荐系统将不断适应用户需求变化，保持竞争力。