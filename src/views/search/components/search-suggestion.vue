<template>
  <div class="search-suggestion">
    <van-cell icon="search" v-for="(str,index) in suggestions" :key="index" @click="$emit('search',str)">
      <div slot="title" v-html="highlight(str,searchText)" ></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search";
import { debounce } from "lodash";
export default {
  name: "SearchSuggestion",
  props: {
    //搜索内容
    searchText: {
      type: String,
      requiredx: true,
    },
  },
  data() {
    return {
      //搜索联想建议
      suggestions: [],
    };
  },

  watch: {
    //监听搜索内容变化
    //    searchText(){
    //        console.log(1);
    //    }

    //watch的完整写法
    searchText: {
      //当数据发生变化 立即执行
      // debounce 函数
      // 参数1：函数
      // 参数2：防抖时间
      // 返回值：防抖之后的函数，和参数1功能是一样的
      handler: debounce(async function () {
        //请求获取数据
        const { data } = await getSearchSuggestions(this.searchText);
        this.suggestions = data.data.options;
        //处理响应结果
      }, 200),
      //侦听开始立即调用
      immediate: true,
    },
  },
  
  methods: {
    // 参数 source: 原始字符串
    // 参数 keyword: 需要高亮的关键词
    // 返回值：替换之后的高亮字符串
    highlight(source, keyword) {
      // /searchContent/ 正则表达式中的一切内容都会当做字符串使用
      // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生 JavaScript 的内置构造函数
      // 参数1：字符串，注意，这里不要加 //
      // 参数2：匹配模式，g 全局，i 忽略大小写
      const reg = new RegExp(keyword, "gi");
      return source.replace(
        reg,
        `<span style="color: #3296fa">${keyword}</span>`
      );
    },
  },
};
</script>

<style scoped lang='less'>
</style>