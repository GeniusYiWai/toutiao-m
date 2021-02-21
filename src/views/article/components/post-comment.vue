<template>
  <div class="post-comment">
    <van-field
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入评论"
      show-word-limit
    />
    <van-button class="post" size="mini" @click="onPost" :disabled="!message">发布</van-button>
  </div>
</template>

<script>
import { addComment } from "@/api/comment";

export default {
  name: "PostComment",
  props: {
    target: {
      type: [Number, String, Object],
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      default: null,
    },
  },
  data() {
    return {
      message: "",
    };
  },
  created() {},
  mounted() {},
  methods: {
    //发布评论
    async onPost() {
      this.$toast.loading({
        message: "发布中",
        forbodclick: true,
      });
      const { data } = await addComment({
        //评论的目标id
        target: this.target.toString(),
        //评论内容
        content: this.message,
        //文章id
        art_id: this.articleId ? this.articleId.toString() : null,
      });

      //发布成功清空文本框内容
      this.message = "";
      this.$emit("post-success", data.data.new_obj);
    },
  },
};
</script>

<style scoped lang='less'>
.post-comment {
  display: flex;
  align-items: center;
  padding: 14px;
  .post {
    padding: 0;
    width: 50px;
  }
}
</style>