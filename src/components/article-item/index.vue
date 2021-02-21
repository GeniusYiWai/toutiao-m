<template>
  <div class="article-item">
    <van-cell
      :to="{
      name:'article',
      params:{
        articleId:article.art_id
      }
    }"
    >
      <!-- 文章标题 -->
      <div slot="title" class="title van-multi-ellipsis--l3">{{article.title}}</div>
      <!-- 文章标识-->
      <div slot="label">
        <div class="cover-wrap" v-if="article.cover.type===3">
          <div class="cover-wrap-item" v-for="(img,index) in article.cover.images" :key="index">
            <van-image fit="cover" :src="img" />
          </div>
        </div>

        <div class="label-wrap">
          <!-- 文章作者 -->
          <span>{{article.aut_name}}</span>
          <!-- 文章评论数量 -->
          <span>{{article.comm_count}}</span>
          <!-- 发布时间 -->
          <span>{{article.pubdate | relativeTime}}</span>
        </div>
      </div>
      <!-- 默认插槽的名字叫default 可以省略 -->
      <van-image
        v-if="article.cover.type===1"
        class="right-cover"
        width="116"
        height="73"
        fit="cover"
        :src="article.cover.images[0]"
      />
    </van-cell>
  </div>
</template>

<script>
export default {
  //接收文章数据
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  name: "ArticleItem",
};
</script>

<style scoped lang='less'>
.article-item {
  .title {
    font-size: 16px;
    color: #3a3a3a;
  }
  /deep/ .van-cell__value {
    flex: unset;
    width: 116px;
    height: 73px;
    margin-left: 12px;
  }
  .right-cover {
    width: 116px;
    height: 73px;
  }
  .cover-wrap {
    display: flex;
    flex-wrap: nowrap;
    padding: 15px 0;
    .cover-wrap-item {
      flex: 1;
      height: 73px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item {
        width: 100%;
        height: 73px;
      }
    }
  }
  .label-wrap {
    font-size: 11px;
    color: #b4b4b4;
    span {
      margin-right: 12px;
    }
  }
}
</style>