<template>
  <div class="search-result">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item,index) in list" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>
<script>
import { getSearchResult} from "@/api/search";

export default {
  props: {
    searchText: {
      type: String,
      required: true,
    }, 
  },
  name: "SearchResult",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, //页码
      perPage: 10, //每页大小
    };
  },

  methods: {
    async onLoad() {
      //请求获取数据

      const { data } = await getSearchResult({
        page: this.page, //页码
        per_page: this.perPage, //每页大小
        q: this.searchText, //搜索关键字
      });
      const { results } = data.data;
      //将数据放到数据列表中

      this.list.push(...results);
      //关闭本次的loading
      this.loading = false;
      //如果有 更新下一次的数据
      if (results.length) {
        this.page++;
      }
      //没有 把finished设置为true
      else {
        this.finished = true;
      }
    },
  },
};
</script>

<style scoped lang='less'>
.search-result {
  position: fixed;
  left: 0;
  right: 0;
  top: 54px;
  bottom: 0;
  overflow-y: auto;
}
</style>