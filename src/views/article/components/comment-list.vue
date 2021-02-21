<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 评论项 -->
      <comment-item
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
        @reply-click="$emit('reply-click', $event)"
      >
      </comment-item>
    </van-list>
  </div>
</template>

<script>
import CommentItem from "./comment-item";
import { getComments } from "@/api/comment";
export default {
  name: "CommentList",
  props: {
    //如果获取文章评论 传递文章id
    //获取评论回复 传递评论id
    source: {
      type: [Number, String, Object],
      required: true,
    },
    //评论数据
    list: {
      type: Array,
      //数组或对象的默认值必须通过函数返回
      default: function () {
        return [];
      },
    },
    //获取文章评论 a
    //获取评论回复 c
    type: {
      type: String,
      default: "a",
    },
  },
  components: {
    CommentItem,
  },
  data() {
    return {
      //loading
      loading: false,
      //是否全部加载
      finished: false,
      offset: null,
      limit: 10,
    };
  },
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      //请求获取数据
      const { data } = await getComments({
        //评论类型
        type: this.type,
        //文章id或者评论id
        source: this.source.toString(),
        //页码
        offset: this.offset,
        //每页大小
        limit: this.limit,
      });
      //把数据添加到列表中

      //向父组件传递评论总数量
      this.$emit("update-total-count", data.data.total_count);

      const { results } = data.data;
      this.list.push(...results);
      this.loading = false;

      //loading关闭
      //判断是否还有数据 如果有 获取下一页数据 没有 将finished设置为true
      if (results.length) {
        this.offset = data.data.last_id;
      } else {
        this.finished = true;
      }
    },
  },
};
</script>

<style scoped lang='less'>
</style>