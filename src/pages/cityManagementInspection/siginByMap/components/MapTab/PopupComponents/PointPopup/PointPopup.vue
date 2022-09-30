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
            item.investigationTaskPointBatchEntity.status === 1
              ? imgStaticUrl + '/img/inspection/haveInspected.png'
              : imgStaticUrl + '/img/inspection/toBeInspected.png'
          "
          class="img-tag"
        ></image>
        <view class="left notInRange">
          <view class="list-title">
            <text :class="{ gray: true, green: item.isInArea }">{{
              item.isInArea ? "签到范围" : "未进入签到范围"
            }}</text>
            <text :style="{ color: item.isInArea ? '#000' : '' }">{{
              item.name
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
      this.$emit("onClose");
    },
    toPoint(item) {
      uni.navigateTo({
        url: `/pages/cityManagementInspection/inspection/modules/inspection-start/inspection-start?id=${item.codeNum}`,
        success: (res) => {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit("instanceEntitiesEvent", {
            data: {
              // 任务id
              taskId: item.investigationTaskEntity.id,
            },
          });
        },
        fail(err) {
          console.log(
            "%c [ err ]",
            "font-size:13px; background:pink; color:#bf2c9f;",
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
          line-height: 80rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .gray {
            font-size: 24rpx;
            margin-right: 10rpx;
            border-radius: 6px;
            padding: 10rpx;
            background: rgba(175, 176, 179, 0.2);
            color: #afb0b3;
          }
          .green {
            background: rgba(54, 209, 161, 0.1);
            color: #36d1a1;
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
