<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('update-histories',[])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow=false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow=true" />
    </van-cell>

    <van-cell
      :title="item"
      v-for="(item,index) in searchHistories"
      :key="index"
      @click="onDelete(item,index)"
    >
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
import { setItem } from "@/utils/storage";
export default {
  name: "SearchHistory",
  //props数据如果是引用类型（数组对象）可以修改
  //但是不能重新复制
  //如果想让prop数据等于新的数据 需要父组件自己修改
  props: {
    //搜索历史
    searchHistories: {
      type: Array,
      requiredx: true,
    },
  },
  data() {
    return {
      //删除的显示状态
      isDeleteShow: false,
    };
  },
  methods: {
    //删除历史记录
    onDelete(item, index) {
      //判断是否是删除状态
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1);
        //持久化
        //1修改本地存储数据
        //2删除线上数据
        //无论是否登录都把数据持久化到本地
        //如果已登录 删除线上的历史数据
        //没有删除单个历史记录
        //只有删除全部历史记录

        return;
      }
      //非删除状态 展示搜索结果
      this.$emit("search", item);
    },
  },
};
</script>

<style scoped lang='less'>
</style>