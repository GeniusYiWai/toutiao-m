<template>
  <div class="article-container">
    <van-nav-bar
      title="文章详情"
      left-text="返回"
      @click-left="$router.back()"
      left-arrow
      class="app-nav-bar"
    />

    <div class="article-wrap">
      <!-- 标题 -->
      <h1 class="title">{{ article.title }}</h1>
      <!-- 作者详情 -->
      <van-cell center class="user-info">
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <div slot="label" class="pubdate">
          {{ article.pubdate | relativeTime }}
        </div>
        <van-image
          slot="icon"
          round
          :src="article.aut_photo"
          class="avatar"
        ></van-image>
        <van-button
          :type="article.is_followed ? 'default' : 'info'"
          round
          size="small"
          class="follow-btn"
          :icon="article.is_followed ? '' : 'plus'"
          @click="onFollow"
          :loading="isFollowLoading"
          >{{ article.is_followed ? "已关注" : "关注" }}</van-button
        >
      </van-cell>
      <div
        class="markdown-body"
        ref="article-content"
        v-html="article.content"
      ></div>
      <!-- 底部区域 -->
      <div class="footer">
        <van-button
          class="write-btn"
          type="default"
          round
          size="small"
          @click="isPostShow = true"
          >写评论</van-button
        >
        <van-icon
          class="comment-icon"
          name="comment-o"
          :info="totalCommentCount"
        />

        <van-icon
          :color="article.is_collected ? 'orange' : ''"
          :name="article.is_collected ? 'star' : 'star-o'"
          @click="onCollect"
        />
        <van-icon
          :color="article.attitude === 1 ? '#e5645f' : ''"
          :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
          @click="onLike"
        />
      </div>
      <comment-list
        :source="articleId"
        :list="commentList"
        @update-total-count="totalCommentCount = $event"
        @reply-click="onReplyClick"
      ></comment-list>
    </div>
    <!-- 发布评论 -->

    <van-popup v-model="isPostShow" position="bottom">
      <post-comment
        :target="articleId"
        @post-success="onPostSuccess"
      ></post-comment>
    </van-popup>
    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom">
      <comment-reply
        :comment="replyComment"
        @close="isReplyShow = false"
        v-if="isReplyShow"
        :articleId="articleId"
      ></comment-reply>
    </van-popup>
  </div>
</template>

<script>
import { addFollow, deleteFollow } from "@/api/user";

import {
  getArticleById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike,
} from "@/api/article";
import { ImagePreview } from "vant";
import "./github-markdown.css";
import CommentList from "./components/comment-list";
import PostComment from "./components/post-comment";
import CommentReply from "./components/comment-reply";

export default {
  //接收路由参数
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  name: "Article",
  components: {
    CommentList,
    PostComment,
    CommentReply,
  },
  data() {
    return {
      article: {},
      //关注用户按钮的loading状态
      isFollowLoading: false,
      //收藏文章按钮的loading状态
      isCollectLoading: false,
      //发布评论弹出层
      isPostShow: false,
      //回复评论弹出层
      isReplyShow: false,
      //评论列表
      commentList: [],
      //评论总数量
      totalCommentCount: 0,
      //当前评论回复对象
      replyComment: {},
    };
  },
  created() {
    this.loadArtilce();
  },
  mounted() {},
  methods: {
    //回复被点击触发
    onReplyClick(comment) {
      this.isReplyShow = true;
      this.replyComment = comment;
    },
    //发布评论成功 将评论添加到顶部
    onPostSuccess(comment) {
      this.commentList.unshift(comment);
      //改变评论组件
      this.isPostShow = false;
      //更新评论总数量
      this.totalCommentCount++;
    },
    //点赞文章
    async onLike() {
      //已经点赞 取消点赞
      if (this.article.attitude === 1) {
        await deleteLike(this.articleId);
        this.article.attitude = -1;
      }
      //没有点赞 添加点赞
      else {
        await addLike(this.articleId);
        this.article.attitude = 1;
      }

      this.$toast.success(`${this.article.attitude ? " " : "取消"}点赞成功`);
    },
    //收藏文章
    async onCollect() {
      //禁用收藏按钮
      this.isCollectLoading = true;
      //已经收藏 取消收藏
      if (this.article.is_collected) {
        await deleteCollect(this.articleId);
      }
      //没有收藏 添加收藏
      else {
        await addCollect(this.articleId);
      }
      this.$toast.success(
        `${this.article.is_collected ? " " : "取消"}收藏成功`
      );
      //更新视图
      this.article.is_collected = !this.article.is_collected;
      this.isCollectLoading = false;
    },
    //关注用户
    async onFollow() {
      //禁用按钮
      this.isFollowLoading = true;
      //已经关注 取消关注
      if (this.article.is_followed) {
        await deleteFollow(this.article.aut_id);
      }
      //没有关注 添加关注
      else {
        await addFollow(this.article.aut_id);
      }
      //更新视图
      this.article.is_followed = !this.article.is_followed;
      this.isFollowLoading = false;
      this.$toast.success(`${this.article.is_followed ? " " : "取消"}关注成功`);
    },
    async loadArtilce() {
      const { data } = await getArticleById(this.articleId);
      this.article = data.data;

      //数据改变影响视图更新 不是立即的
      //需要在修改数据后马上操作被改元素的dom 需要把代码放到$nextTick中
      this.$nextTick(() => {
        this.handlePreviewImage();
      });
    },
    handlePreviewImage() {
      //获取文章dom
      const articleContent = this.$refs["article-content"];
      //得到所有img标签
      const imgs = articleContent.querySelectorAll("img");
      const imgUrl = [];

      //循坏img标签 注册点击事件
      imgs.forEach((img, index) => {
        imgUrl.push(img.src);
        img.onclick = function () {
          ImagePreview({
            images: imgUrl,
            startPosition: index,
          });
        };
      });
      //调用ImagePreview方法
    },
  },
};
</script>

<style scoped lang='less'>
.article-container {
  .article-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 44px;
    overflow-y: auto;
  }
  .title {
    font-size: 20px;
    color: #3a3a3a;
    padding: 14px;
    background-color: #fff;
    margin: 0;
  }
  .user-info {
    .avatar {
      width: 35px;
      height: 35px;
      margin-right: 8px;
    }
    .name {
      font-size: 12px;
      color: #333;
    }
    .pubdate {
      font-size: 11px;
      color: #b4b4b4;
    }
    .follow-btn {
      width: 85px;
      height: 29px;
    }
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .write-btn {
      width: 160px;
    }
    .van-icon {
      font-size: 20px;
    }
    .comment-icon {
      bottom: -2px;
    }
    .share-icon {
      bottom: -2px;
    }
  }
}
ul {
  list-style: unset;
}
.markdown-body {
  padding: 14px;
  background-color: #fff;
}
</style>