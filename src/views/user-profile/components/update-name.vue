<template>
  <div class="update-name">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="修改昵称"
      left-text="返回"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <div class="name-field-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "UpdateName",
  props: {
    //默认 接收父组件v-model传递的数据
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      //昵称
      localName: this.value,
    };
  },

  methods: {
    //点击完成
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true,
      });
      //请求提交更新用户昵称
      try {
        await updateUserProfile({
          name: this.localName,
        });
        //更新成功 修改父组件的name 改变弹出层
        this.$toast.success("保存成功");
        this.$emit("close");
        //必须使用input
        this.$emit("input", this.localName);
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail("昵称已存在");
        }
      }
    },
  },
};
</script>

<style scoped lang='less'>
.name-field-wrap {
  padding: 10px;
}
</style>