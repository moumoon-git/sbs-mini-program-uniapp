<template lang="">
  <van-popup :show="introducePopupShow" round position="bottom" @close="close">
    <view class="content-wrap">
      <view class="header">图例说明</view>
      <view class="introduce-book">
        <view class="book-item" v-for="(item, index) in introduce" :key="index">
          <image :src="item.img" mode=""> </image>
          <view class="title">{{ item.name }}</view>
        </view>
      </view>
    </view>
  </van-popup>
</template>
<script>
export default {
  props: {
    introducePopupShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
    };
  },
  computed: {
    introduce() {
      return [
        {
          name: '您当前的位置',
          img: this.imgStaticUrl + '/img/map/current-point.png',
        },
        {
          name: '当前已进入签到范围的巡查点',
          img: this.imgStaticUrl + '/img/map/map-blue-point.png',
        },
        {
          name: '当前位置存在多个可巡查点',
          img: this.imgStaticUrl + '/img/map/map-many-points.png',
        },
        {
          name: '已完成巡查的地点',
          img: this.imgStaticUrl + '/img/map/map-green-point.png',
        },
        {
          name: '当前未进入签到范围的巡查点',
          img: this.imgStaticUrl + '/img/map/map-gray-point.png',
        },
      ];
    },
  },
  methods: {
    close() {
      this.$emit('onClose');
    },
  },
};
</script>
<style lang="less" scoped>
.content-wrap {
	.header {
		margin-top: 20rpx;
		text-align: center;
	}
	.introduce-book {
		padding: 0 40rpx;
		.book-item {
			display: flex;
			align-items: center;
			border-bottom: 1px solid #dcdee0;
			width: 100%;
			height: 120rpx;
			image {
				margin-right: 15rpx;
				width: 64rpx;
				height: 64rpx;
			}
			.title {
				font-size: 26rpx;
			}
		}
		.book-item:last-child {
			border-bottom: none;
		}
	}
}

</style>
