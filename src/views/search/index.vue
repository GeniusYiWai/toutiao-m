<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键字"
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        show-action
        @focus="isResultShow=false"
      ></van-search>
    </form>

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText"></search-result>
    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch"></search-suggestion>
    <!-- 历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories=$event"
    ></search-history>
  </div>
</template>

<script>
import SearchSuggestion from "./components/search-suggestion";
import SearchHistory from "./components/search-history";
import SearchResult from "./components/search-result";
import { setItem, getItem } from "@/utils/storage";
import { getSearchHistories } from "@/api/search";
import { mapState } from "vuex";

export default {
  name: "SearchIndex",
  data() {
    return {
      //搜索内容
      searchText: "",
      //控制搜索结果的显示状态
      isResultShow: false,
      //搜索历史记录 第一次赋值为空数组
      searchHistories: [],
    };
  },
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult,
  },
  watch: {
    //监听本地历史变化 更新本地
    searchHistories() {
      setItem("search-histories", this.searchHistories);
    },
  },
  created() {
    this.loadSearchHistories();
  },
  computed: {
    ...mapState(["user"]),
  },
  mounted() {},
  methods: {
    //获取搜索历史
    async loadSearchHistories() {
      //因为后端返回的历史记录只有4个
      //所以将本地的历史和线上的合并

      //获取本地历史
      let searchHistories = getItem("search-histories") || [];

      //如果用户已经登录
      if (this.user) {
        const { data } = await getSearchHistories();
        //利用set实现数组去重
        //合并数组 [...arr,...arr]
        //把set转化为数组 [...Set对象]
        searchHistories = [
          ...new Set([...searchHistories, ...data.data.keywords]),
        ];
      }

      this.searchHistories = searchHistories;
    },
    //搜索
    onSearch(searchText) {
      // 把输入框设置为要搜索的文本
      this.searchText = searchText;
      //显示搜索结果
      this.isResultShow = true;
      //记录搜索历史
      const index = this.searchHistories.indexOf(searchText);
      //判断是否已经存在
      if (index != -1) {
        return;
      }
      //用户没有登录 把搜索历史存储到本地

      this.searchHistories.unshift(searchText);
  
    },
  },
};
</script>

<style scoped lang='less'>
</style>