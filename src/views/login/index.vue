<template>
  <div class="login-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="登录/注册"
      left-text="返回"
      @click-left="$router.back()"
      left-arrow
      class="app-nav-bar"
    />
    <!-- 登录表单 -->

    <van-cell-group>
      <van-field
        v-model="user.mobile"
        left-icon="shouji"
        class="iconfont"
        icon-prefix="toutiao"
        placeholder="请输入手机号"
      />
      <van-field
        v-model="user.code"
        clearable
        class="iconfont"
        left-icon="yanzhengma"
        icon-prefix="toutiao"
        placeholder="请输入验证码"
      >
        <template #button>
          <van-button size="mini" round class="send-btn">发送验证码</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <div class="login-btn-wrap">
      <van-button type="info" block class="login-btn" @click="onLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/user";
export default {
  name: "Login",
  data() {
    return {
      user: {
        //手机号
        mobile: "",
        //验证码
        code: "",
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    async onLogin() {
      try {
        const res = await login(this.user);
        console.log(res);
      } catch (error) {
        console.log(error);
        console.log("登录失败");
      }
    },
  },
};
</script>

<style scoped lang='less'>
.login-container {
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    color: #666;
  }
  .login-btn-wrap {
    padding: 26px 16px;

    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>