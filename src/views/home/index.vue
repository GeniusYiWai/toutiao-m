<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        icon="search"
        round
        type="info"
        size="small"
        class="search-btn"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- 文章频道列表 -->
    <van-tabs v-model="active" class="channel-tabs">
      <van-tab :title="channel.name" v-for="(channel,index) in channels" :key="index">
        <!-- 文章列表 -->
        <article-list :channel="channel"></article-list>
      </van-tab>
      <!-- 防止汉堡按钮挡住最后一个判断 添加一个占位元素 -->
      <div slot="nav-right" class="wap-nav-placeholder"></div>
      <div slot="nav-right" class="wap-nav-wrap" @click="isChannelEditShow=true">
        <van-icon name="wap-nav"></van-icon>
      </div>
    </van-tabs>

    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height:100%"
    >
      <!-- 在模板中 $event代表事件参数 -->
      <channel-edit
        :user-channel="channels"
        :active="active"
        @close="isChannelEditShow=false"
        @update-active="active=$event"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
//文章列表组件
import ArticleList from "./components/article-list";
//频道编辑组件

import ChannelEdit from "./components/channel-edit";

import { getUserChannels } from "@/api/user";

import { mapState } from "vuex";
import { getItem } from "@/utils/storage";
export default {
  data() {
    return {
      //默认选中的频道
      active: 0,
      //用户频道
      channels: [],
      //控制编辑频道的展示状态
      isChannelEditShow: false,
    };
  },
  components: { ArticleList, ChannelEdit },
  created() {
    this.loadChannels();
  
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    //请求获取用户频道数据
    async loadChannels() {
      //用户已登录 请求获取线上的用户频道列表数据
      let channels = [];
      if (this.user) {
        const { data } = await getUserChannels();
        channels = data.data.channels;
      } else {
        //用户没有登录 请求获取本地的用户频道列表数据
        //判断是否有本地数据
        const localChannels = getItem("user-channels");
        if (localChannels) {
          channels = localChannels;
        } else {
          //用户没有登录 也没有本地频道
          //请求默认频道列表
          const { data } = await getUserChannels();
          channels = data.data.channels;
        }
      }
      this.channels = channels;
    },
    //切换频道
    onUpdateActive(index) {
      this.active = index;
    },
  },
};
</script>

<style scoped lang='less'>
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background-color: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-nav-text {
      font-size: 14px;
    }
  }
  .channel-tabs {
    /deep/ .van-tabs__line {
      width: 15px !important;
      height: 3px !important;
      background-color: #3296fa;
      bottom: 20px;
    }
  }
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    height: 44px;

    background-color: #fff;
    opacity: 0.9;
    width: 33px;
    display: flex;
    align-items: center;
    justify-content: center;
    .van-icon {
      font-size: 22px;
    }
  }
  .wap-nav-placeholder {
    width: 33px;
    flex-shrink: 0;
  }
}
</style>