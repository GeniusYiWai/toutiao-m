<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
import dayjs from "dayjs";
export default {
  name: "UpdateBirthday",
  props: {
    //默认 接收父组件v-model传递的数据
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    };
  },

  methods: {
    //点击完成
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true,
      });
      //请求提交更新用户性别
      try {
        const date = dayjs(this.currentDate).format('YYYY-MM-DD');
        console.log(date);
        await updateUserProfile({
          birthday: date,
        });
        //更新成功 修改父组件的gender 改变弹出层
        this.$toast.success("保存成功");
        this.$emit("close");
        //必须使用input
        this.$emit("input", date);
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail("未知错误");
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