<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-02-16 10:38:55
 * @LastEditTime: 2022-02-17 14:03:46
-->
<template>
  <view class="top-box" @click="$emit('click')">
    <view class="title">
      <!-- 头部 -->
      <view class="checked" v-show="inspectionTaskItems.status === '1'">
        <van-icon class="icon" name="checked" style="color: #19be6b" />
      </view>
      <view class="clear" v-show="inspectionTaskItems.status === '0'">
        <van-icon class="icon" name="clear" style="color: #fa7e7e" />
      </view>
      <text class="wrap-dec">{{ inspectionTaskItems.investigationInforName }}</text>
      <van-icon :name="isExpand ? 'arrow-up' : 'arrow-down'" />
    </view>
    <view class="bottom">
      <view class="dec">
        <!-- 内容 -->
        {{ inspectionTaskItems.investigationInforContent }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    inspectionTaskItems: {
      type: Object,
    },
    isExpand: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
    };
  },
  methods: {},
};
</script>

<style lang="less">
.noproblem,
.hasproblem {
  text-align: center;
  height: 49rpx;
  line-height: 49rpx;
  padding: 0 20rpx;
  background: rgba(22, 200, 139, 0.08);
  color: #0bd295;
  margin-right: 15rpx;
  font-size: 20rpx;
}
.hasproblem {
  background: rgba(200, 48, 22, 0.08);
  color: #f66e6e;
}
.top-box {
  width: 100%;
  background: #ffffff;
  position: relative;
}
.title {
  width: 630rpx;
  min-height: 112rpx;
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  margin: 0 auto;
  border-bottom: 1px solid #dddddd;
  display: flex;
  align-items: center;
  .wrap-dec {
    flex: 1;
    word-break: break-all;
    line-height: normal;
    font-weight: bolder;
  }
  .clear,
  .checked {
    margin-right: 13rpx;
  }
}
.bottom {
  width: 630rpx;
  margin: 20rpx auto;
}
.dec {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 36rpx;
  margin-bottom: 20rpx;
}
.img-tag {
  position: absolute;
  right: 0;
  top: 0;
  width: 100rpx;
  height: 100rpx;
}
</style>
