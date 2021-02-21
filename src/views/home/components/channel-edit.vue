<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button type="danger" plain size="small" @click="isEdit=!isEdit">{{isEdit?'完成':'编辑'}}</van-button>
    </van-cell>
    <!-- 我的频道 -->
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel,index) in userChannel"
        :key="index"
        :text="channel.name"
        :icon="(isEdit&&index!==0)?'clear':''"
        @click="onUserChannelClick(channel,index)"
        :class="{active:index===active}"
      />
    </van-grid>
    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
      <van-button type="danger" plain size="small">编辑</van-button>
    </van-cell>
    <!-- 频道推荐 -->
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel,index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from "@/api/channel";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";

export default {
  props: {
    //用户频道
    userChannel: {
      type: Array,
      required: true,
    },
    //当前选择频道
    active: {
      type: Number,
    },
  },
  data() {
    return {
      //所有频道
      allChannels: [],
      //控制编辑的显示状态
      isEdit: false,
    };
  },
  created() {
    this.loadAllChannels();
  },
  computed: {
    ...mapState(["user"]),
    //获取推荐频道 拿全部频道减去我的频道
    recommendChannels() {
      //查找满足条件的所有元素
      return this.allChannels.filter((e) => {
        //查找满足条件的单个元素
        return !this.userChannel.find((x) => {
          return x.id === e.id;
        });
      });
    },
  },
  methods: {
    //获取所有频道
    async loadAllChannels() {
      const { data } = await getAllChannels();
      this.allChannels = data.data.channels;
    },
    //添加到我的频道
    async onAdd(channel) {
      // console.log(channel);
      this.userChannel.push(channel);
      //数据持久化

      // 如果用户登录了 数据存储到服务器
      if (this.user) {
        await addUserChannel({
          channels: [{ id: channel.id, seq: this.userChannel.length }],
        });
      }
      // 如果没有登录 数据存储到本地
      else {
        setItem("user-channels", this.userChannel);
      }
    },
    //编辑状态 删除频道
    //非编辑 切换频道
    onUserChannelClick(channel, index) {
      if (this.isEdit) {
        this.deleteChannel(channel,index);
      } else {
        this.switchChannel(index);
      }
    }, //删除我的频道
    async deleteChannel(channel, index) {
      // 如果删除的是当前激活的频道之前的频道
      if (index <= this.active) {
        //更新激活频道的索引
        this.$emit("update-active", this.active - 1);
      }
      this.userChannel.splice(index, 1);

      //数据持久化

      // 如果用户登录了 数据存储到服务器
      if (this.user) {
        await deleteUserChannel(channel.id);
      }
      // 如果没有登录 数据存储到本地
      else {
        setItem("user-channels", this.userChannel);
      }
    },
    //切换我的频道
    switchChannel(index) {
      //子传父 关闭弹出层
      this.$emit("close");
      //子传父 切换频道
      this.$emit("update-active", index);
    },
  },
};
</script>

<style scoped lang='less'>
.channel-edit {
  padding-top: 54px;
  .channel-title {
    font-size: 16px;
    color: #333;
  }
  .grid-item {
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content {
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
      background-color: #f4f5f6;
    }
    /deep/ .van-grid-item__icon {
      position: absolute;
      right: -5px;
      top: -5px;
      font-size: 20px;
      color: #ccc;
    }
  }
  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>