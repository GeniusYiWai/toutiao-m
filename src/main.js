import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//自动设置rem基准值
import 'amfe-flexible'
//加载vant ui
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

//加载全局样式 在vant的样式后面加载否则会被覆盖
import './styles/index.less'

// 日期处理函数
import dayjs from 'dayjs';
//配置使用中文语言包
import 'dayjs/locale/zh-cn'
import rTime from 'dayjs/plugin/relativeTime';
//配置使用处理相对时间
dayjs.extend(rTime)
dayjs.locale('zh-cn')
//添加全局过滤器
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
Vue.filter('datetime', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(format)
})






Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)

}).$mount('#app')