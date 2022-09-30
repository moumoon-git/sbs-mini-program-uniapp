<template>
  <div class="entry-home">
    <div
      class="header-box"
      :style="{
        backgroundImage: `url(${imgStaticUrl}/img/home/home-bg.png)`,
      }"
    >
      <text class="header-text-h1">防灾宝移动应用</text>
    </div>

    <div class="content-box">
      <div class="gray-text">请选择平台</div>

      <div class="platform-wrap">
        <div
          class="platform-box"
          @click="toNormalPlatform"
          :style="{
            backgroundImage: `url(${imgStaticUrl}/img/home/Security-housekeeper.png)`,
          }"
        >
          <view class="text chinese">数智安全管家</view>
          <view class="text english">SECURITY HOUSEKEEPER</view>
        </div>
        <div
          class="platform-box"
          @click="toWebViewPlatform"
          :style="{
            backgroundImage: `url(${imgStaticUrl}/img/home/Intelligent-governan.png)`,
          }"
        >
          <view class="text chinese">智慧治理</view>
          <view class="text english">INTELLIGENT GOVERNANCE</view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'entryHome',
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
    };
  },
  methods: {
    toNormalPlatform() {
      uni.switchTab({
        url: '/pages/home/home',
      });
    },
    toWebViewPlatform() {
      uni.navigateTo({
        url: '/pages/webview/webview',
      });
    },
  },
};
</script>
<style lang="less" scoped>
.entry-home {
  background-color: #f5f5f5;
  width: 100%;
  height: 100vh;
  .header-box {
    width: 100%;
    height: 380rpx;
    background-size: 100vw 380rpx;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .header-text-h1 {
      font-size: 50rpx;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0rpx 10rpx 20rpx rgba(0, 0, 0, 0.5);
      white-space: nowrap;
    }
  }
  .content-box {
    padding-left: 80rpx;
    .gray-text {
      color: #666666;
      margin: 35rpx 0;
    }
    .platform-wrap {
      .platform-box {
        width: 92%;
        height: 408rpx;
        background: #ffffff;
        border-radius: 10px;
        margin-bottom: 60rpx;
        background-size: 100% 100%;
        overflow: hidden;
        .text {
          color: #fff;

          padding-left: 40rpx;
        }
        .chinese {
          font-family: PingFangSC-Semibold, PingFang SC;
          font-size: 60rpx;
          margin: 50rpx 0 8px 0;
          font-weight: bolder;
          text-shadow: 0px 1px 2px #0a569f;
        }
        .english {
          font-size: 26rpx;
          font-family: PingFangSC-Ultralight, PingFang SC;
        }
      }
    }
  }
}
</style>
