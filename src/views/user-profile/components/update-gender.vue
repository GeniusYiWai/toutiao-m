<template>
  <div class="update-gender">
    <van-picker
      show-toolbar
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onGenderChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "UpdateGender",
  props: {
    //默认 接收父组件v-model传递的数据
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ["男", "女"],
      defaultIndex: this.value,
    };
  },

  methods: {
    onGenderChange(picker, value, index) {
      this.defaultIndex = index;
    },
    //点击完成
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true,
      });
      //请求提交更新用户性别
      try {
        await updateUserProfile({
          gender: this.defaultIndex,
        });
        //更新成功 修改父组件的gender 改变弹出层
        this.$toast.success("保存成功");
        this.$emit("close");
        //必须使用input
        this.$emit("input", this.defaultIndex);
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