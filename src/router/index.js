import { createRouter, createWebHistory } from 'vue-router'

// 用户端组件
const UserLayout = () => import('../views/user/UserLayout.vue')
const Home = () => import('../views/user/Home.vue')
const BrandList = () => import('../views/user/BrandList.vue')
const ReviewPost = () => import('../views/user/ReviewPost.vue')
const UserCenter = () => import('../views/user/UserCenter.vue')
const ReviewDetail = () => import('../views/user/ReviewDetail.vue')
const UserProfile = () => import('../views/user/UserProfile.vue')
const NotificationList = () => import('../views/user/NotificationList.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')

// 管理端组件
// const AdminLayout = () => import('../views/admin/AdminLayout.vue')
// const UserManagement = () => import('../views/admin/UserManagement.vue')
// const CommentManagement = () => import('../views/admin/CommentManagement.vue')
// const AnnouncementManagement = () => import('../views/admin/AnnouncementManagement.vue')
// const PhoneModelManagement = () => import('../views/admin/PhoneModelManagement.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { title: '登录' }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { title: '注册' }
    },
    // 用户端路由
    {
      path: '/',
      component: UserLayout,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home,
          meta: { title: '首页' }
        },
        {
          path: 'brands',
          name: 'brands',
          component: BrandList,
          meta: { title: '品牌浏览' }
        },
        {
          path: 'post',
          name: 'post',
          component: ReviewPost,
          meta: { title: '发布评测', requireAuth: true }
        },
        {
          path: 'user-center',
          name: 'userCenter',
          component: UserCenter,
          meta: { title: '个人中心', requireAuth: true }
        },
        {
          path: 'review/:id',
          name: 'reviewDetail',
          component: ReviewDetail,
          meta: { title: '评测详情' }
        },
        {
          path: 'user-profile/:id',
          name: 'userProfile',
          component: UserProfile,
          meta: { title: '用户主页' }
        },
        {
          path: 'notifications',
          name: 'notificationList',
          component: NotificationList,
          meta: { title: '通知列表', requireAuth: true }
        }
      ]
    },
    {
      path: '',
      redirect: '/home'
    },
    // 管理端路由
    // {
    //   path: '/admin',
    //   component: AdminLayout,
    //   redirect: '/admin/users',
    //   meta: { requireAuth: true, requireAdmin: true },
    //   children: [
    //     {
    //       path: 'users',
    //       name: 'userManagement',
    //       component: UserManagement,
    //       meta: { title: '用户管理' }
    //     },
    //     {
    //       path: 'comments',
    //       name: 'commentManagement',
    //       component: CommentManagement,
    //       meta: { title: '评论管理' }
    //     },
    //     {
    //       path: 'announcements',
    //       name: 'announcementManagement',
    //       component: AnnouncementManagement,
    //       meta: { title: '公告栏管理' }
    //     },
    //     {
    //       path: 'phones',
    //       name: 'phoneModelManagement',
    //       component: PhoneModelManagement,
    //       meta: { title: '手机型号管理' }
    //     }
    //   ]
    // },
    // 404路由
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 智能手机评测论坛` : '智能手机评测论坛'
  
  // 登录和权限验证逻辑（后续可根据实际情况扩展）
  const isLoggedIn = localStorage.getItem('user') // 检查用户是否登录
  const userInfo = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null
  const isAdmin = userInfo && userInfo.role === 'admin' // 检查用户是否为管理员

  if (to.meta.requireAuth && !isLoggedIn) {
    // 需要登录但用户未登录
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requireAdmin && !isAdmin) {
    // 需要管理员权限但用户不是管理员
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
