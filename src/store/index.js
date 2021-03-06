import Vue from 'vue'
import Vuex from 'vuex'

import {
  getItem,
  setItem
} from '@/utils/storage'
Vue.use(Vuex)
//防止出错 将本地存储名称设置为常量
const USER_KEY = 'toutiao-user'
export default new Vuex.Store({
  state: {
    //当前登录用户的登录状态 token等数据
    user: getItem(USER_KEY),
    //缓存页面
    cachePages: ['layout']
  },
  mutations: {
    setUser(state, data) {
      //为了防止刷新数据丢失 需要把数据存储到本地存储
      state.user = data;
      setItem(USER_KEY, data)
    },
    //添加缓存页面
    addCachePage(state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },
    //清除缓存页面
    removeCachePage(state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    },


  },
  actions: {

  },
  modules: {

  }
})