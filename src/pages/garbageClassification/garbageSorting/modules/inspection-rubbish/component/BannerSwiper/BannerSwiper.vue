<template lang="">
  <div class="banner-swiper">
    <div class="swiper">
      <div
        class="screen"
        :style="{ transform: `translateX(-${index * 100}vw)` }"
      >
        <image
          :src="fileHost + item.vcUrl"
          v-for="item in imgList"
          :key="item.iid"
          mode="widthFix"
        ></image>
      </div>

      <div
        class="operation-box prev-btn"
        @click="prev"
        v-if="imgList.length > 1"
      >
        <van-icon name="arrow-left" />
      </div>
      <div
        class="operation-box next-btn"
        @click="next"
        v-if="imgList.length > 1"
      >
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="suggestion-box" @click="toSuggestionPage">
      我来监督
    </div>
  </div>
</template>
<script>
import config from '@/static/config/index.js';

export default {
  props: {
    imgList: {
      type: Array,
      default: () => [],
    },
    platformId: {
      type: String,
    },
  },
  data() {
    return {
      fileHost: config.host,
      index: 0,
    };
  },
  methods: {
    toSuggestionPage() {
      uni.navigateTo({
        url: `/pages/garbageClassification/suggestions/suggestions?platformId=${this.platformId}`,
      });
    },
    prev() {
      if (this.index <= 0) {
        return;
      }
      this.index--;
    },
    next() {
      if (this.index >= this.imgList.length - 1) {
        return;
      }
      this.index++;
    },
  },
};
</script>
<style lang="less" scoped>
.banner-swiper {
  .swiper {
    width: 100%;
    height: auto;
    // overflow-x: auto;
    position: relative;
    .screen {
      width: max-content;
      display: flex;
      transition: all 0.5s ease;
      image {
        width: 100vw;
      }
    }
    .operation-box {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: #fff;
      font-size: 100rpx;
      background-color: rgba(221, 219, 219, 0.5);
    }
    .prev-btn {
      left: 0;
    }
    .next-btn {
      right: 0;
    }
  }
  .suggestion-box {
    position: fixed;
    right: 0;
    top: 52%;
    width: 160rpx;
    height: 60rpx;
    box-sizing: border-box;
    padding-left: 20rpx;
    text-align: center;
    color: #fff;
    line-height: 60rpx;
    background: #0091ff;
    box-shadow: 0px 3px 12px -6px #0c3a7f;
    border-radius: 150px 0px 0px 150px;
  }
}
</style>
