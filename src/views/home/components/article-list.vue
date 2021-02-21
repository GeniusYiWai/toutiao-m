<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 传入文章数据 -->
        <article-item
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
//引入文章列表组件
import ArticleItem from "@/components/article-item";
import { getArticles } from "@/api/article";
export default {
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  name: "ArticleList",
  data() {
    return {
      //数据
      articles: [],
      // 加载状态
      loading: false,
      // 数据是否全部加载完成
      finished: false,
      timestamp: null,
      //下拉刷新的loading状态
      isRefreshLoading: false,
      //下拉刷新的成功提示
      refreshSuccessText: " ",
    };
  },
  components: {
    "article-item": ArticleItem,
  },
  methods: {
    async onLoad() {
      //1请求获取数据
      const { data } = await getArticles({
        //频道id
        channel_id: this.channel.id,
        //时间戳
        timestamp: this.timestamp || Date.now(),
        //是否包含置顶
        with_top: 1,
      });
      const { results } = data.data;
      //2把数据放到list数组中
      this.articles.push(...results);
      //3数组本次加载状态结束
      this.loading = false;
      //4数据全部加载完毕
      if (results.length) {
        //更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp;
      } else {
        //没有数据了 结束加载
        this.finished = true;
      }
    },
    //下拉刷新事件
    async onRefresh() {
      //1请求获取数据
      const { data } = await getArticles({
        //频道id
        channel_id: this.channel.id,
        //时间戳
        timestamp: Date.now(),
        //是否包含置顶
        with_top: 1,
      });
      //2把数据放到数据列表中（顶部）
      const { results } = data.data;
      this.articles.unshift(...results);
      //3关闭刷新状态
      this.isRefreshLoading = false;
      this.refreshSuccessText = `更新了${results.length}条数据`;
    },
  },
};
</script>

<style scoped lang='less'>
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>