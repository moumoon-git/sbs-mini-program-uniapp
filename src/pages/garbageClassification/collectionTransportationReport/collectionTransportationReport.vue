<template>
  <view class="container">
    <header>
      <div>
        <label>厨余收运点:</label>
        <span>{{ reportStatistics.kitchen }}</span>
      </div>
      <div>
        <label>普通收运点:</label>
        <span>{{ reportStatistics.normal }}</span>
      </div>
      <div>
        <label>今日收运次数:</label>
        <span>{{ reportStatistics.totalRecords }}</span>
      </div>
    </header>
    <main>
      <section v-for="(item, index) in reportList" :key="index">
        <i
          v-if="!item.isInArea"
          :style="{
            background: `url(${imgStaticUrl}/img/collectionTransportationReport/outRange-icon.png) no-repeat center/100% 100%`,
          }"
        ></i>
        <header>
          <span
            :class="{
              kitchen: item.typeName == '厨余收运点',
              normal: item.typeName == '普通收运点',
            }"
            >{{
              item.typeName == '厨余收运点' ? '厨余收运点' : '普通收运点'
            }}</span
          >
          <label>{{ item.name }}</label>
        </header>
        <main>
          <span>{{ `约${item.distance * 1000}米` }}</span>
          <span>{{ `今日收运数：${item.records}` }}</span>
        </main>
        <footer>
          <van-icon name="location" color="#CCCCCC" />
          <span>{{ item.place }}</span>
        </footer>
      </section>
    </main>
  </view>
</template>

<script>
import { defineComponent } from 'vue';
import { getDistance } from '@/utils/utils.js';
import { getLocation } from '@/utils/hooks/useHooks.js';

export default defineComponent({
  name: 'collectionTransportationReport',
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      reportList: [],
      longitude: '',
      latitude: '',
      reportStatistics: {},
    };
  },
  components: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // const that = this;
    getLocation().then((res) => {
      this.longitude = res.longitude;
      this.latitude = res.latitude;
      this.getReportList();
    });
  },
  methods: {
    // 获取收运报告列表
    getReportList() {
      this.$http
        .get({
          url: `/garbage/kitchenRegister/listAll`,
        })
        .then(({ data }) => {
          console.log(`/garbage/kitchenRegister/listAll data`, data);
          if (data.code === 0) {
            data.data.points.forEach((element) => {
              const { isInArea, distance } = this.isInArea(
                { latitude: this.latitude, longitude: this.longitude },
                element
              );
              if (isInArea) {
                element.isInArea = true;
              } else {
                element.isInArea = false;
              }
              element.distance = distance;
              this.reportList.push(element);
            });
            this.reportStatistics = data.data;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    isInArea(otherPoint, currentPointInfo) {
      const distance = getDistance(
        currentPointInfo.latitude,
        currentPointInfo.longitude,
        otherPoint.latitude,
        otherPoint.longitude
      );
      return {
        isInArea: distance <= currentPointInfo.clockInRange / 1000,
        distance,
      };
    },
  },
});
</script>

<style lang="less">
page {
  height: 100vh;
}
.container {
  height: 100%;
  display: block;
  padding: 0rpx;
  box-sizing: border-box;
  background: rgba(245, 245, 245, 0.8);
  overflow: auto;
  & > header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24rpx 0rpx;
    div {
      label,
      span {
        font-size: 28rpx;
        font-weight: 500;
        line-height: 40rpx;
      }
      label {
        color: #666666;
      }
      span {
        color: #333333;
        margin-left: 18rpx;
      }
      &:nth-child(2) {
        margin: 0rpx 24rpx;
        &::before,
        &::after {
          display: inline-block;
          content: '';
          width: 2rpx;
          height: 20rpx;
          background: rgba(153, 153, 153, 0.39);
          border-radius: 2rpx;
        }
      }
      &:nth-child(2)::before {
        margin-right: 24rpx;
      }
      &:nth-child(2)::after {
        margin-left: 24rpx;
      }
    }
  }
  & > main {
    section {
      background: #ffffff;
      border-radius: 4rpx;
      margin: 30rpx;
      padding: 32rpx;
      box-sizing: border-box;
      position: relative;
      &:first-child {
        margin-top: 0rpx;
      }
      i {
        width: 80rpx;
        height: 80rpx;
        // background: no-repeat center/100% 100%
        //   url(https://xc1.zeits.cn/WechatAppStatic/img/collectionTransportationReport/outRange-icon.png);
        position: absolute;
        right: 0%;
        top: 0%;
      }
      header {
        display: flex;
        align-items: center;
        span {
          font-size: 24rpx;
          font-weight: 400;
          line-height: 34rpx;
          padding: 2rpx 8rpx;
          border-radius: 6rpx;
          margin-left: 0rpx;
        }
        .normal {
          color: #0091ff;
          background: #e6efff;
        }
        .kitchen {
          color: #0bd295;
          background: rgba(22, 200, 139, 0.08);
        }
        label {
          font-size: 32rpx;
          font-weight: 500;
          color: #333333;
          line-height: 46rpx;
          margin-left: 16rpx;
          max-width: 474rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      main {
        margin: 20rpx 0rpx;
        span {
          font-size: 28rpx;
          font-weight: 400;
          color: #666666;
          line-height: 42rpx;
          margin-right: 30rpx;
        }
      }
      footer {
        display: flex;
        align-items: center;
        span {
          font-size: 24rpx;
          font-weight: 400;
          color: #999999;
          line-height: 34rpx;
          margin-left: 10rpx;
          max-width: 584rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
