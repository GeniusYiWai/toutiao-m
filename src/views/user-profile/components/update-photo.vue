<template>
  <div class="update-photo">
    <img :src="image" ref="image" class="image" />
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    ></van-nav-bar>
  </div>
</template>

<script>
import { updateUserPhoto } from "@/api/user";

//cropperjs 图片裁切
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

export default {
  props: {
    file: {
      type: File,
      required: true,
    },
  },
  name: "UpdatePhoto",
  data() {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null,
    };
  },
  mounted() {
    const image = this.$refs.image;
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true,
      crop(event) {},
    });
  },
  methods: {
    getCropperCanvas() {
      return new Promise((resovle) => {
        console.log(this.cropper);
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          resovle(blob);
        });
      });
    },
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true,
        duration: 0, //持续展示
      });
      const file = await this.getCropperCanvas();
      //如果要求content-type是multipart/*formdata 一定要提交formdata数据对象
      const fd = new FormData();
      fd.append("photo", file);

      await updateUserPhoto(fd);
      this.$toast.success("更新成功");
      this.$emit("update-photo", window.URL.createObjectURL(file));
      this.$emit("close");
    },
  },
};
</script>

<style scoped lang='less'>
.toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
.image {
  display: block;
  max-width: 100%;
}
</style>