// 日期处理函数
import dayjs from 'dayjs';
import Vue from 'vue'

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