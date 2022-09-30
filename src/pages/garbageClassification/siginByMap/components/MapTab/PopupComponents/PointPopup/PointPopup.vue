<template lang="">
  <van-popup
    :show="popupShow"
    round
    position="bottom"
    custom-style="max-height: 40%;"
    @close="close"
  >
    <view class="content-wrap">
      <view
        class="list-box"
        v-for="(item, index) in detailList"
        :key="index"
        @click="toPoint(item)"
      >
        <image
          :src="
            item.status === 1
              ? imgStaticUrl + '/img/inspection/haveInspected.png'
              : imgStaticUrl + '/img/inspection/toBeInspected.png'
          "
          class="img-tag"
        ></image>
        <view class="left notInRange">
          <view class="list-title">
            <text class="title-tag">{{ item.titleTag }}</text>
            <text class="overflow-ellipsis" style="flex: 1;">{{
              item.name
            }}</text>
            <text :style="{ color: item.isInArea ? '#36CF9F' : '#969799' }">{{
              item.isInArea ? '[可巡]' : '[超范围]'
            }}</text>
          </view>
          <view style="font-size: 24rpx;">
            <van-icon name="location-o" />
            <text>{{ item.place }}</text>
          </view>
        </view>
        <view class="right">
          <van-icon name="arrow" />
        </view>
      </view>
    </view>
  </van-popup>
</template>
<script>
export default {
  props: {
    popupShow: {
      type: Boolean,
      default: false,
    },
    detailList: {
      type: Array,
    },
  },
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
    };
  },
  methods: {
    close() {
      this.$emit('onClose');
    },
    toPoint(item) {
      uni.navigateTo({
        url: `/pages/garbageClassification/garbageSorting/modules/inspection-rubbish/inspection-rubbish?id=${item.codeNum}&type=${item.pointType}`,
        success: (res) => {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('instanceEntitiesEvent', {
            data: {
              // 任务id
              taskId: item.id,
            },
          });
        },
        fail(err) {
          console.log(
            '%c [ err ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            err
          );
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content-wrap {
  .overflow-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
  .list-box {
    height: 160rpx;
    padding: 0 40rpx;
    border-top: 1px solid #dcdee0;
    display: flex;
    align-items: center;
    position: relative;
    .img-tag {
      position: absolute;
      right: 0;
      top: 0;
      width: 110rpx;
      height: 110rpx;
    }
    .left {
      width: 87%;

      color: #999999;
      .list-title {
        font-size: 30rpx;
        width: 90%;
        line-height: 60rpx;
        display: flex;
        align-items: center;
        .title-tag {
          display: inline-block;
          width: 136rpx;
          height: 38rpx;
          line-height: 38rpx;
          text-align: center;
          background-color: #e6efff;
          color: #0091ff;
          border-radius: 6px;
          font-size: 24rpx;
          margin-right: 10rpx;
        }
      }
    }
    .right {
      flex: 1;
      padding-left: 20rpx;
      color: #999999;
    }
  }
}
</style>
