<template>
  <div class="personalCenter">
    <div class="userInfo">
      <image
        :src="avatar ? avatar : defaultAvatar"
        mode=""
        class="avatar"
      ></image>
      <div>
        <div class="username">{{ name }}</div>
        <div class="role">{{ role }}</div>
      </div>
    </div>
    <div class="code-box" v-if="hasCode">
      <image
        :src="qrCodeImg"
        mode="heightFix"
        class="avatar"
        show-menu-by-longpress
      ></image>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import config from '@/static/config/index.js';
import store from '@/store';

export default defineComponent({
  name: 'userInfo',
  data() {
    return {
      defaultAvatar: this.$imgStaticUrl + '/img/home/default-avatar.png',
      name: store.state.userInfo.userName,
      role: store.state.userInfo.role,
      hasCode: wx.getStorageSync('invitation'),
      qrCodeImg: '',
    };
  },
  computed: {
    avatar() {
      let img = store.state.userInfo.avatar;
      return img
        ? img.startsWith('http')
          ? img
          : config.fileHost + img
        : null;
    },
  },
  onShow() {
    this.$http
      .get({
        url: '/mail/mailcontactor/getAgencyQrcode',
        data: {
          id: wx.getStorageSync('userId'),
        },
      })
      .then((res) => {
        this.qrCodeImg = res.data.url;
      });
  },
  methods: {},
});
</script>

<style lang="less">
.personalCenter {
  background: #f5f5f5;
  min-height: 100vh;
  overflow: hidden;
  .userInfo {
    width: 96%;
    height: 140rpx;
    margin: 20rpx auto;
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    align-items: center;
    position: relative;
    .avatar {
      margin: 0 20rpx;
      width: 95rpx;
      height: 95rpx;
      border-radius: 50%;
    }
    .username {
      margin-bottom: 10rpx;
    }
    .role {
      color: #999999;
    }
    .img-tag {
      width: 80rpx;
      height: 80rpx;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .code-box {
    text-align: center;
  }
}
</style>
