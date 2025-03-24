import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import postApi from '../api/modules/post'
import { ElMessage } from 'element-plus'

export const usePostStore = defineStore('post', () => {
  // 状态
  const postList = ref([])
  const currentPost = ref(null)
  const userPosts = ref([])
  const userFavorites = ref([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const sortBy = ref('createTime')
  const sortOrder = ref('desc')
  const likedPosts = ref({}) // 用户点赞的帖子ID映射
  const favoritedPosts = ref({}) // 用户收藏的帖子ID映射

  // 计算属性
  const displayPosts = computed(() => {
    return postList.value.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  })

  // 初始化点赞和收藏状态（从本地存储）
  function initLikesAndFavorites() {
    try {
      const storedLikes = localStorage.getItem('likedPosts')
      const storedFavorites = localStorage.getItem('favoritedPosts')
      
      if (storedLikes) {
        likedPosts.value = JSON.parse(storedLikes)
      }
      
      if (storedFavorites) {
        favoritedPosts.value = JSON.parse(storedFavorites)
      }
    } catch (error) {
      console.error('Failed to parse likes/favorites from localStorage:', error)
      likedPosts.value = {}
      favoritedPosts.value = {}
    }
  }

  // 获取评测列表
  async function fetchPosts(filters = {}) {
    try {
      loading.value = true
      const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        ...filters
      }
      
      const result = await postApi.getPosts(params)
      
      if (result) {
        postList.value = result.records || result
        total.value = result.total || result.length
        
        // 更新点赞和收藏状态
        postList.value.forEach(post => {
          post.isLiked = !!likedPosts.value[post.id]
          post.isFavorited = !!favoritedPosts.value[post.id]
        })
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      ElMessage.error('获取评测列表失败')
    } finally {
      loading.value = false
    }
  }

  // 获取评测详情
  async function fetchPostDetail(id) {
    try {
      loading.value = true
      const post = await postApi.getPostDetail(id)
      
      if (post) {
        // 更新点赞和收藏状态
        post.isLiked = !!likedPosts.value[post.id]
        post.isFavorited = !!favoritedPosts.value[post.id]
        currentPost.value = post
      }
    } catch (error) {
      console.error(`Failed to fetch post detail (id: ${id}):`, error)
      ElMessage.error('获取评测详情失败')
    } finally {
      loading.value = false
    }
  }

  // 获取用户发布的评测
  async function fetchUserPosts(params = {}) {
    try {
      loading.value = true
      const result = await postApi.getUserPosts(params)
      
      if (result) {
        userPosts.value = result.records || result
        
        // 更新点赞和收藏状态
        userPosts.value.forEach(post => {
          post.isLiked = !!likedPosts.value[post.id]
          post.isFavorited = !!favoritedPosts.value[post.id]
        })
      }
    } catch (error) {
      console.error('Failed to fetch user posts:', error)
      ElMessage.error('获取用户评测列表失败')
    } finally {
      loading.value = false
    }
  }

  // 获取用户收藏的评测
  async function fetchUserFavorites(params = {}) {
    try {
      loading.value = true
      const result = await postApi.getUserFavorites(params)
      
      if (result) {
        userFavorites.value = result.records || result
        
        // 设置收藏状态
        userFavorites.value.forEach(post => {
          post.isLiked = !!likedPosts.value[post.id]
          post.isFavorited = true // 收藏列表中的肯定是已收藏的
        })
      }
    } catch (error) {
      console.error('Failed to fetch user favorites:', error)
      ElMessage.error('获取收藏列表失败')
    } finally {
      loading.value = false
    }
  }

  // 发布评测
  async function createPost(postData) {
    try {
      loading.value = true
      const newPost = await postApi.createPost(postData)
      
      if (newPost) {
        ElMessage.success('评测发布成功')
        return newPost.id
      }
      return null
    } catch (error) {
      console.error('Failed to create post:', error)
      ElMessage.error('评测发布失败')
      return null
    } finally {
      loading.value = false
    }
  }

  // 更新评测
  async function updatePost(id, postData) {
    try {
      loading.value = true
      const updatedPost = await postApi.updatePost(id, postData)
      
      if (updatedPost) {
        // 如果是当前查看的评测，更新本地缓存
        if (currentPost.value && currentPost.value.id === id) {
          currentPost.value = { ...currentPost.value, ...updatedPost }
        }
        
        ElMessage.success('评测更新成功')
        return true
      }
      return false
    } catch (error) {
      console.error(`Failed to update post (id: ${id}):`, error)
      ElMessage.error('评测更新失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 删除评测
  async function deletePost(id) {
    try {
      loading.value = true
      await postApi.deletePost(id)
      
      // 从列表中删除
      postList.value = postList.value.filter(p => p.id !== id)
      userPosts.value = userPosts.value.filter(p => p.id !== id)
      userFavorites.value = userFavorites.value.filter(p => p.id !== id)
      
      ElMessage.success('评测已删除')
      return true
    } catch (error) {
      console.error(`Failed to delete post (id: ${id}):`, error)
      ElMessage.error('删除评测失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 点赞评测
  async function toggleLike(post) {
    if (!post) return false
    
    try {
      const isLiked = !!likedPosts.value[post.id]
      
      if (isLiked) {
        // 取消点赞
        await postApi.unlikePost(post.id)
        delete likedPosts.value[post.id]
        if (post.likes > 0) post.likes--
        post.isLiked = false
        ElMessage({
          message: '已取消点赞',
          type: 'info',
          duration: 1000
        })
      } else {
        // 点赞
        await postApi.likePost(post.id)
        likedPosts.value[post.id] = true
        post.likes++
        post.isLiked = true
        ElMessage({
          message: '点赞成功',
          type: 'success',
          duration: 1000
        })
      }
      
      // 更新本地存储
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts.value))
      return true
    } catch (error) {
      console.error(`Failed to toggle like for post (id: ${post.id}):`, error)
      ElMessage.error('操作失败，请稍后重试')
      return false
    }
  }

  // 收藏评测
  async function toggleFavorite(post) {
    if (!post) return false
    
    try {
      const isFavorited = !!favoritedPosts.value[post.id]
      
      if (isFavorited) {
        // 取消收藏
        await postApi.unfavoritePost(post.id)
        delete favoritedPosts.value[post.id]
        if (post.favorites > 0) post.favorites--
        post.isFavorited = false
        ElMessage({
          message: '已取消收藏',
          type: 'info',
          duration: 1000
        })
      } else {
        // 收藏
        await postApi.favoritePost(post.id)
        favoritedPosts.value[post.id] = true
        post.favorites = (post.favorites || 0) + 1
        post.isFavorited = true
        ElMessage({
          message: '收藏成功',
          type: 'success',
          duration: 1000
        })
      }
      
      // 更新本地存储
      localStorage.setItem('favoritedPosts', JSON.stringify(favoritedPosts.value))
      return true
    } catch (error) {
      console.error(`Failed to toggle favorite for post (id: ${post.id}):`, error)
      ElMessage.error('操作失败，请稍后重试')
      return false
    }
  }

  // 设置分页参数
  function setPagination(page, size) {
    currentPage.value = page
    if (size) pageSize.value = size
  }

  // 设置排序参数
  function setSorting(by, order) {
    sortBy.value = by
    sortOrder.value = order
  }

  // 暴露出去的属性和方法
  return {
    postList,
    currentPost,
    userPosts,
    userFavorites,
    loading,
    currentPage,
    pageSize,
    total,
    sortBy,
    sortOrder,
    displayPosts,
    initLikesAndFavorites,
    fetchPosts,
    fetchPostDetail,
    fetchUserPosts,
    fetchUserFavorites,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    toggleFavorite,
    setPagination,
    setSorting
  }
}) 