<template>
  <view class="top-box" @click="$emit('click')">
    <view class="title">
      <van-icon v-if="!hasProblem" name="checked" class="status-icon green" />
      <van-icon v-else name="clear" class="status-icon red" />
      <view
        class="noproblem"
        v-if="inspectionTaskItems.instanceInforEntity.status === '1'"
        >未发现问题</view
      >
      <view
        class="hasproblem"
        v-if="inspectionTaskItems.instanceInforEntity.status === '0'"
        >存在问题</view
      >
      <text class="wrap-dec">{{ inspectionTaskItems.name }}</text>
      <van-icon :name="isExpand ? 'arrow-up' : 'arrow-down'" />
    </view>
    <view class="bottom">
      <view class="dec">
        {{ inspectionTaskItems.content }}
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
    hasProblem: {
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
	margin-right: 15rpx;
	padding: 0 20rpx;
	height: 49rpx;
	background: rgba(22, 200, 139, .08);
	line-height: 49rpx;
	text-align: center;
	font-size: 20rpx;
	color: #0bd295;
}
.hasproblem {
	background: rgba(200, 48, 22, .08);
	color: #f66e6e;
}
.top-box {
	position: relative;
	padding-bottom: 35rpx;
	width: 100%;
	background: #fff;
}
.title {
	display: flex;
	position: relative;
	align-items: center;
	margin: 0 auto;
	border-bottom: 1px solid #ddd;
	width: 630rpx;
	min-height: 112rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	font-size: 32rpx;
	color: #333;
	.status-icon {
		position: absolute;
		left: -34rpx;
		top: 43rpx;
	}
	.green {
		color: #19be6b;
	}
	.red {
		color: #fa7e7e;
	}
	.wrap-dec {
		flex: 1;
		line-height: normal;
		font-weight: bolder;
		word-break: break-all;
	}
}
.bottom {
	margin: 20rpx auto;
	width: 630rpx;
}
.dec {
	margin-bottom: 20rpx;
	line-height: 36rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	font-size: 28rpx;
	color: #666;
}
.img-tag {
	position: absolute;
	right: 0;
	top: 0;
	width: 100rpx;
	height: 100rpx;
}

</style>
