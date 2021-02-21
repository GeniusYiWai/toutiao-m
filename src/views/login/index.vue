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
    <van-form
      @submit="onLogin"
      :show-error="false"
      :show-error-message="false"
      @failed="onFailed"
      ref="login-form"
    >
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          left-icon="shouji"
          class="iconfont"
          icon-prefix="toutiao"
          placeholder="请输入手机号"
          :rules="formRules.mobile"
          validate-first
          name="mobile"
        />
        <van-field
          v-model="user.code"
          clearable
          class="iconfont"
          left-icon="yanzhengma"
          icon-prefix="toutiao"
          placeholder="请输入验证码"
          :rules="formRules.code"
          name="code"
        >
          <!-- 倒计时结束 隐藏倒计时 显示发送按钮 -->
          <template #button>
            <van-count-down
              :time="time"
              format=" ss s"
              v-if="isCountDownShow"
              @finish="isCountDownShow = false"
            />
            <van-button
              size="mini"
              round
              class="send-btn"
              @click.prevent="onSendSms"
              v-else
              :loading="isSendSmsLoading"
              >发送验证码</van-button
            >
          </template>
        </van-field>
      </van-cell-group>
      <div class="login-btn-wrap">
        <van-button type="info" block class="login-btn">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { login, sendSms } from "@/api/user";
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
      //表单验证
      formRules: {
        mobile: [
          {
            required: "true",
            message: "请输入正确手机号",
            pattern: /^1[3|5|7|8]\d{9}$/,
          },
        ],
        code: [
          { required: "true", message: "请输入正确验证码", pattern: /\d{6}$/ },
        ],
      },
      time: 60 * 1000,
      //是否展示倒计时
      isCountDownShow: false,
      //发送验证码按钮的状态
      isSendSmsLoading: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations(["setUser"]),

    //登录按钮
    async onLogin() {
      try {
        const { data } = await login(this.user);
        this.$toast.success({
          message: "登录成功", //提示文本
          forbidClick: true, //禁止背景点击
          // duration: 0, //展示时长
        });
        this.setUser(data.data);
        this.$router.push(this.$route.query.redirect || "/");

        //清除layout缓存
        this.$store.commit("removeCachePage", "layout");
        // console.log(res);
      } catch (error) {
        console.log(error);
        this.$toast.fail({
          message: "登录失败",
          forbidClick: true,
        });
        // console.log("登录失败");
      }
    },
    //表单验证失败触发
    onFailed(error) {
      if (error.errors[0]) {
        this.$toast({ message: error.errors[0].message, position: "top" });
      }
    },
    //发送验证码
    async onSendSms() {
      try {
        //校验手机号码
        await this.$refs["login-form"].validate("mobile");
        //按钮loading状态
        this.isSendSmsLoading = true;

        //验证通过 发送验证码
        const res = await sendSms(this.user.mobile);
        //隐藏发送按钮 显示倒计时
        this.isCountDownShow = true;
      } catch (error) {
        //try里面任何代码错误 都会进入catch
        //不同错误需要不同提示 需要进行判断

        //发送验证码频繁
        let message = "";
        if (error && error.response && error.response.status == 429) {
          message = "发送太频繁了 请稍后重试";
          this.$toast.fail({
            message,
            forbidClick: true,
          });
          //手机号验证失败
        } else if (error.name === "mobile") {
          message = "请输入手机号";
          this.$toast.fail({
            message,
            forbidClick: true,
          });
          //未知错误
        } else {
          message = "发送失败 请稍后重试";
          this.$toast.fail({
            message,
            forbidClick: true,
          });
        }
      }
      //无论发送验证码成功还是失败都要关闭发送验证码按钮的loading状态
      this.isSendSmsLoading = false;
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