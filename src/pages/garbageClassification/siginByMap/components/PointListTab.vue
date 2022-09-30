<template>
  <view class="point-list">
    <view class="header">
      <view>巡查点数量：{{ totalCount }}</view>
      <view>
        待巡查点：<text style="color: #0a95ff">{{ unInspectedNum }}</text>
      </view>
      <view>
        已巡查点：<text style="color: #36D0A0">{{ hasInspectedNum }}</text>
      </view>
    </view>
    <view class="list">
      <scroll-view scroll-y="true" style="height: 100vh" @scrolltolower="lower">
        <view
          :class="{
            'list-box': true,
            'has-border': item.status !== 1,
          }"
          v-for="(item, index) in list"
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
          <view class="title ">
            <text class="title-tag">{{ item.titleTag }}</text>
            <text class="overflow-ellipsis" style="flex: 1;">{{
              item.name
            }}</text>
            <text :style="{ color: item.isInArea ? '#36CF9F' : '#969799' }">{{
              item.isInArea ? '[可巡]' : '[超范围]'
            }}</text>
          </view>
          <view class="place ">
            <van-icon name="location-o" />
            <text class="place-name overflow-ellipsis">{{ item.place }}</text>
            <text style="margin-left: auto;">约{{ item.distance }}千米</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script lang="ts">
import { debounce } from '@/utils/utils.js';

export default {
  props: {
    pointList: {
      type: Array,
    },
    hasInspectedNum: {
      type: Number,
    },
    unInspectedNum: {
      type: Number,
    },
  },
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      curentPage: 0, //当前页
      pageSize: 20,
    };
  },
  computed: {
    totalCount() {
      return this.pointList.length;
    },
    totalPage() {
      return Math.ceil(this.totalCount / this.pageSize);
    },
    list() {
      return this.pointList.slice(0, 20);
    },
  },
  methods: {
    lower(e) {
      const debounceFn = debounce(() => {
        this.curentPage++;
        let l = this.curentPage * this.pageSize;
        let r = this.curentPage * this.pageSize + this.pageSize;
        console.log(
          '%c [ xxx ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          l,
          r
        );

        if (this.curentPage > this.totalPage) {
          console.log(
            '%c [ xxx ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            this.list
          );
          uni.showToast({
            title: '已加载完全部数据',
            icon: 'none',
            duration: 2500,
          });
          return;
        }
        this.list.push(...this.pointList.slice(l, r));
      }, 500);
      debounceFn();
    },
    toPoint(item) {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        item
      );
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
.point-list {
  .header {
    display: flex;
    padding: 20rpx;
    color: #646566;
    font-size: 26rpx;
    view {
      width: 33%;
      border-right: 1px solid #dcdee0;
      text-align: center;
    }
    view:last-child {
      border-right: none;
    }
  }
  .list {
    height: calc(100vh - 163rpx);
    overflow: auto;
    .has-border {
      border-left: 2px solid #0a95ff;
    }
    .list-box {
      box-sizing: border-box;
      border-radius: 2px;
      padding: 0 20rpx;
      width: 710rpx;
      height: 140rpx;
      margin: 0 auto;
      margin-bottom: 20rpx;
      background-color: #fff;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .img-tag {
        position: absolute;
        right: 0;
        top: 0;
        width: 90rpx;
        height: 90rpx;
      }
      .overflow-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
      }
      .title {
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
      .place {
        display: flex;
        color: #999999;
        font-size: 26rpx;
        .place-name {
          width: 70%;
        }
      }
    }
  }
}
</style>
