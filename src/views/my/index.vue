<template>
  <div class="my-container">
    <!-- 登录状态 -->
    <van-cell-group v-if="user" class="my-info">
      <van-cell center class="base-info" :border="false">
        <van-image
          width="50"
          height="50"
          slot="icon"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
          round
          fit="cover"
          class="avatar"
        />
        <div slot="title" class="name">{{ currentUser.name }}</div>
        <van-button size="small" round class="update-btn" to="/user/profile"
          >编辑资料</van-button
        >
      </van-cell>
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{ currentUser.art_count }}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{ currentUser.follow_count }}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{ currentUser.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{ currentUser.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- 未登录状态 -->

    <div v-else class="not-login">
      <div @click="$router.push('login')">
        <img src="./mobile.png" class="mobile mb-4" />
      </div>
      <div class="text">登录/注册</div>
    </div>
    <van-grid :column-num="2" class="nav-grid">
      <van-grid-item
        icon-prefix="toutiao"
        icon="shoucang"
        class="iconfont nav-grid-item mb-4"
        text="收藏"
      />
      <van-grid-item
        icon-prefix="toutiao"
        icon="lishi"
        class="iconfont nav-grid-item mb-4"
        text="历史"
      />
    </van-grid>
    <van-cell title="信息通知" is-link to="/" />
    <van-cell title="小智同学" is-link to="/user/chat" class="mb-4" />
    <van-cell
      title="退出登录"
      class="logout-ceil"
      v-if="user"
      @click="onLogout"
    />
    <div class="user-info">
      <div class="base-info"></div>
      <div class="data-info"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getCurrentUser } from "@/api/user";
export default {
  name: "My",
  data() {
    return {
      //当前用户信息
      currentUser: {},
    };
  },

  created() {
    this.loadCurrentUser();
  },
  computed: {
    ...mapState(["user"]),
  },

  methods: {
    //获取当前用户信息
    async loadCurrentUser() {
      const { data } = await getCurrentUser();
      this.currentUser = data.data;
    },
    //退出登录
    onLogout() {
      //提示用户确认
      this.$dialog
        .confirm({
          title: "退出提示",
          message: "确认退出吗?",
        }) //确认执行这里
        .then(() => {
          //将user设置为null
          this.$store.commit("setUser", null);
        })
        //取消执行这里
        .catch();
      //退出
    },
  },
};
</script>

<style scoped lang='less'>
.my-container {
  .not-login {
    height: 180px;
    background: url("./banner.png") no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      color: #fff;
      font-size: 14px;
    }
  }
  .my-info {
    background: url("./banner.png") no-repeat;
    background-size: cover;
    .base-info {
      background-color: unset;
      height: 115px;
      box-sizing: border-box;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        margin-right: 11px;
        border: 1px solid #fff;
      }
      .name {
        font-size: 15px;
        color: #fff;
      }
      .update-btn {
        height: 16px;
        font-size: 10px;
        color: #666666;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }

    //样式穿透
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }
  .nav-grid {
    .nav-grid-item {
      height: 70px;
      /deep/ .toutiao {
        font-size: 22px;
      }
      /deep/ .toutiao-shoucang {
        color: #eb5253;
      }
      /deep/ .toutiao-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333333;
      }
    }
  }
  .logout-ceil {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>