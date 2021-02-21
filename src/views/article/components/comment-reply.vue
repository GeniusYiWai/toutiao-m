<template>
  <div class="comment-reply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')"></van-icon>
    </van-nav-bar>
    <!-- 当前评论项 -->
    <comment-item :comment="comment"></comment-item>
    <!-- 所有评论回复 -->
    <van-cell title="所有评论回复"> </van-cell>
    <comment-list :source="comment.com_id" type="c" :list="commentList"></comment-list>
    <div class="footer">
      <van-button
        class="write-btn"
        type="default"
        size="small"
        @click="isPostShow = true"
        >写评论</van-button
      >
    </div>

    <!-- 发布回复 -->
    <van-popup v-model="isPostShow" position="bottom">
      <post-comment
        :target="comment.com_id"
        :article-id="articleId"
        @post-success="onPostSuccess"
      ></post-comment>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from "./comment-item";
import CommentList from "./comment-list";
import PostComment from "./post-comment";
export default {
  name: "CommentReply",
  data() {
    return {
      isPostShow: false,
      //评论的评论列表
      commentList: [],
    };
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  components: {
    CommentItem,
    CommentList,
    PostComment,
  },

  methods: {
    onPostSuccess(comment) {
      //将发布成功的评论放到评论列表的顶部
      this.commentList.unshift(comment);
      //更新评论的回复数量
      this.comment.reply_count++;

      //改变弹出层
      this.isPostShow = false;
    },
  },
};
</script>

<style scoped lang='less'>
.write-btn {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 44px;
  line-height: 44px;
}
</style>