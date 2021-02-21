import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  Dialog
} from 'vant'
import store from '../store'
Vue.use(VueRouter)

const routes = [{
    path: "/login",
    name: "login",
    component: () => import('@/views/login'),
    meta: {
      requirsAuth: false
    }
  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [{
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/views/home/'),
        meta: {
          requirsAuth: false
        }


      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/'),
        meta: {
          requirsAuth: false
        },

      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/'),
        meta: {
          requirsAuth: false
        },

      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/'),
        meta: {
          requirsAuth: false
        },

      },

    ]
  },
  {
    path: "/search",
    name: "search",
    component: () => import('@/views/search'),
    meta: {
      requirsAuth: false
    },

  },
  {
    path: "/article/:articleId",
    name: "article",
    component: () => import('@/views/article'),
    props: true,
    meta: {
      requirsAuth: false
    },

  },
  {
    path: "/user/profile",
    name: "user-profile",
    component: () => import('@/views/user-profile'),
    meta: {
      requirsAuth: true
    },

    props: true
  },
  {
    name: 'chat',
    path: '/user/chat',
    component: () => import('@/views/chat/'),
    meta: {
      requirsAuth: true
    }

  }

]

const router = new VueRouter({
  routes
})
//to要访问的页面信息
//from 来自哪个页面的路由信息
//next 放行
router.beforeEach((to, from, next) => {
  if (to.meta.requirsAuth) {
    if (store.state.user) {
      return next()
    }
    Dialog.confirm({
      title: '访问提示',
      message: '需要登录',
    }).then(() => {

      router.replace({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }).catch(() => {
      // 停止路由导航
      next(false)
    })

  } else {
    next()
  }
})

export default router