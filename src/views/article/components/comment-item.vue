<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title">
      <div class="title-wrap">
        <div class="name">
          {{ comment.aut_name }}
        </div>
        <div class="like-wrap">
          <van-icon
            name="good-job-o"
            class="like-icon"
            :class="{
              liked: comment.is_liking,
            }"
            @click="onCommentLike"
          ></van-icon>
          <span class="like-count">{{ comment.like_count }}</span>
        </div>
      </div>

      <div class="content">
        {{ comment.content }}
      </div>
      <div>
        <span class="pubdate">
          {{ comment.pubdate | datetime("MM:DD hh:ss") }}</span
        >
        <van-button round size="mini" class="reply-btn"
        @click="$emit('reply-click',comment)"
          >{{ comment.reply_count }}回复</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from "@/api/comment";
export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  name: "CommentItem",
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    async onCommentLike() {
      //已点赞 取消点赞
      const id = this.comment.com_id.toString();
      if (this.comment.is_liking) {
        await deleteCommentLike(id);
        //点赞数量减一
        this.comment.like_count--;
      } else {
        //点赞
        await addCommentLike(id);
        //点赞数量加一
        this.comment.like_count++;
      }
      this.comment.is_liking = !this.comment.is_liking;
    },
  },
};
</script>

<style scoped lang='less'>
.comment-item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 13px;
  }
  .content {
    font-size: 16px;
    color: #222222;
  }

  .pubdate {
    font-size: 10px;
    margin-right: 5px;
  }
  .name {
    color: #406599;
  }

  .title-wrap {
    display: flex;
    justify-content: space-between;
  }
  .liked {
    color: #ff69b4;
  }
}
</style>