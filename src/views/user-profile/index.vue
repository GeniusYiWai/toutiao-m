<template>
  <div class="user-profile">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="个人信息"
      left-text="返回"
      @click-left="$router.back()"
      left-arrow
      class="app-nav-bar"
    />

    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image width="30" height="30" round fit="cover" :src="user.photo" />
    </van-cell>

    <input
      type="file"
      hidden
      accept="image/*"
      ref="file"
      @change="onFileChange"
    />

    <van-cell
      title="昵称"
      is-link
      :value="user.name"
      @click="isEditNameShow = true"
    />
    <van-cell
      title="性别"
      is-link
      :value="user.gender === 0 ? '男' : '女'"
      @click="isEditGenderShow = true"
    />
    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
      @click="isEditBirthdayShow = true"
    />
    <!-- 修改昵称弹出层 -->
    <van-popup
      v-model="isEditNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 当传递给子组件的数据既要修改又要使用 可以使用v-model简写 -->

      <!-- 默认 传递一个名叫value的数据 -->
      <!-- :value="user.name" -->
      <!-- 默认监听input事件 -->

      <!-- 如果有多个数据需要保持同步 使用.sync修饰符 :gender.sync="user.gender" ||
      :gender="user.gender" @update="user.gender=$event" -->
      <!-- 子组件必须触发$emit('update:gender')事件来更新父组件的gender -->

      <update-name
        @close="isEditNameShow = false"
        v-model="user.name"
        v-if="isEditNameShow"
      ></update-name>
    </van-popup>

    <!-- 修改性别 -->
    <van-popup
      v-model="isEditGenderShow"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <update-gender
        @close="isEditGenderShow = false"
        v-model="user.gender"
        v-if="isEditGenderShow"
      ></update-gender>
    </van-popup>
    <!-- 修改生日 -->
    <van-popup
      v-model="isEditBirthdayShow"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <update-birthday
        @close="isEditBirthdayShow = false"
        v-model="user.birthday"
        v-if="isEditBirthdayShow"
      ></update-birthday>
    </van-popup>

    <!-- 修改头像 -->
    <van-popup
      v-model="isEditPhotoShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-photo
        v-if="isEditPhotoShow"
        :file="previewImage"
        @close="isEditPhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import UpdateName from "./components/update-name";
import UpdateGender from "./components/update-gender";
import UpdateBirthday from "./components/update-birthday";
import UpdatePhoto from "./components/update-photo";
export default {
  name: "UserProfile",
  data() {
    return {
      user: {},
      //编辑昵称显示状态
      isEditNameShow: false,
      //编辑性别显示状态
      isEditGenderShow: false,
      //编辑生日显示状态
      isEditBirthdayShow: false,
      //编辑头像显示状态
      isEditPhotoShow: false,
      //上传预览图片
      previewImage: null,
    };
  },
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
  },
  created() {
    this.loadUserProfile();
  },
  mounted() {},
  methods: {
    onFileChange() {
      this.isEditPhotoShow = true;
      const file = this.$refs.file.files[0];
      // console.log(blob);
      this.previewImage = file;
      console.log(this.previewImage);

      //清空file的value 为了解决相同文件不触发change事件
      this.$refs.file.value = "";
    },

    //获取用户信息
    async loadUserProfile() {
      const { data } = await getUserProfile();
      console.log(data);
      this.user = data.data;
    },
  },
};
</script>

<style scoped lang='less'>
.van-popup {
  background-color: #f5f7f9;
}
</style>