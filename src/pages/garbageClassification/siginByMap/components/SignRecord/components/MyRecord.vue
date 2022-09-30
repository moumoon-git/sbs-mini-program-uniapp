<!--
 * @Author: your name
 * @Date: 2021-11-30 17:52:03
 * @LastEditTime: 2021-12-03 16:23:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sbs-mini-program-uniapp\src\pages\garbageClassification\siginByMap\components\SignRecord\MyRecord.vue
-->
<template>
  <view class="detail">
    <!-- 时间选择器 -->
    <view class="detail-header">
      <view class="chooseType">
        <view
          v-for="(item, index) in buttonList"
          :key="index"
          :data-id="index"
          @click="choose"
          :class="
            item.checked ? 'chooseType-content-select' : 'chooseType-content'
          "
        >
          <van-button :type="item.type" size="small">{{
            item.name
          }}</van-button>
        </view>
      </view>
      <!-- 时间 -->
      <view class="timeSelector">
        <view class="daySelector" v-if="currentIndex == 0">
          <view class="operation-box prev-btn" @click="prevDay">
            <van-icon name="arrow-left" />
          </view>
          <view>{{ currentTime }}</view>
          <view class="operation-box next-btn" @click="nextDay">
            <van-icon name="arrow" />
          </view>
        </view>
        <view class="weekSelector" v-else-if="currentIndex == 1">
          <view class="operation-box prev-btn" @click="prevWeek">
            <van-icon name="arrow-left" />
          </view>
          <view>{{ weekTime }}</view>
          <view class="operation-box next-btn" @click="nextWeek">
            <van-icon name="arrow" />
          </view>
        </view>
        <view class="yearSelector" v-else>
          <view class="operation-box prev-btn" @click="prevMonth">
            <van-icon name="arrow-left" />
          </view>
          <view>{{ monthTime }}</view>
          <view class="operation-box next-btn" @click="nextMonth">
            <van-icon name="arrow" />
          </view>
        </view>
      </view>
    </view>
    <!-- 签到数据 -->
    <view class="signData">
      <view class="signNum">
        <text>签到次数：</text>
        <text>{{ `${myRecordData.length}` }}</text>
      </view>
    </view>
    <!-- 签到数据 -->
    <section class="sign-box" v-if="myRecordData.length > 0">
      <view class="item-two">
        <block v-for="(item, index) in myRecordData" :key="index">
          <view class="timeline">
            <view class="bigCircle">
              <view class="circle">
                <text class="num">{{ myRecordData.length - index }}</text>
              </view>
            </view>

            <view class="timeline-content">
              <view class="sign-list">
                <view class="time"> {{ item.clockInTime || '' }}</view>
                <view class="inspectAddress">{{ item.remark || '' }}</view>
                <view class="imgList">
                  <view class="card" v-for="(v, i) in item.imgList" :key="i">
                    <van-image
                      width="200rpx"
                      height="200rpx"
                      :src="fileHost + v.url"
                      :data-src="fileHost + v.url"
                      @click="handlePreviewImage"
                    />
                  </view>
                </view>
                <view class="signAddress">
                  <van-icon name="location-o" />
                  <text class="overflow-ellipsis">
                    {{ item.place || '暂无地址' }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </block>
      </view>
    </section>
    <block v-else>
      <van-empty class="empty" description="暂无数据" />
    </block>
  </view>
</template>

<script>
import config from '@/static/config/index.js';
import {
  getCurrentWeek,
  funGetDateStr,
  getCurrentMonth,
  getMonthDate,
  presentTime,
  nowMonth,
} from '../tool/comm';
export default {
  props: {
    myRecordData: {
      type: Array,
    },
  },
  data() {
    return {
      fileHost: config.fileHost,
      buttonList: [
        {
          id: '0',
          name: '日',
          type: 'info',
          checked: true,
        },
        {
          id: '1',
          name: '周',
          type: 'default',
          checked: false,
        },
        {
          id: '2',
          name: '月',
          type: 'default',
          checked: false,
        },
      ],
      currentIndex: 0,
      index: 0,
      currentTime: '',
      weekTime: '',
      monthTime: '',
      yearIndex: 0,
      month: 0,
      onceWeek: 7 * 24 * 3600 * 1000,
      onceDay: 24 * 60 * 60 * 1000,
      onceMonth: 31 * 24 * 3600 * 1000,
    };
  },
  computed: {
    futureMonth() {
      let nowMonth = new Date().toLocaleDateString();
      let arr = nowMonth.split('/');
      arr.pop();
      return new Date(arr.join('-')).getTime();
    },
    futureDate() {
      let nowDate = new Date().toLocaleDateString();
      return new Date(nowDate).getTime() + this.onceDay;
    },
    futureWeek() {
      let nowDate = new Date().toLocaleDateString();
      return new Date(nowDate).getTime() + this.onceWeek;
    },
  },
  created() {
    this.currentTime = `${new Date().getFullYear()}-${new Date().getMonth() +
      1}-${new Date().getDate()}`;
    this.monthTime = `${new Date().getFullYear()}.${new Date().getMonth() + 1}`;
    console.log(getCurrentWeek().time, 'getCurrentWeek()');
    this.weekTime = getCurrentWeek().time;
  },
  mounted() {},
  methods: {
    choose(e) {
      let index = e.currentTarget.dataset.id;
      this.currentIndex = e.currentTarget.dataset.id;
      this.buttonList.forEach((v, i) => {
        this.buttonList[i].checked = !this.buttonList[i].checked;
        v.id == index
          ? (this.buttonList[i].type = 'info')
          : (this.buttonList[i].type = 'default');
      });
      if (index == 0) {
        console.log(presentTime(), ' presentTime()');
        this.$emit('getTime', presentTime(), presentTime());
      } else if (index == 1) {
        console.log(getCurrentWeek().start, getCurrentWeek().end, '66666');
        this.$emit('getTime', getCurrentWeek().start, getCurrentWeek().end);
      } else {
        this.$emit(
          'getTime',
          nowMonth().firstDayOfCurMonth,
          nowMonth().lastDayOfCurMonth
        );
      }
      this.$emit('getSignDetail');
    },
    prevDay() {
      let clickIndex = --this.index;
      if (funGetDateStr(clickIndex)) {
        this.currentTime = funGetDateStr(clickIndex).nowTime;

        this.$emit(
          'getTime',
          funGetDateStr(clickIndex).startTime,
          funGetDateStr(clickIndex).endTime
        );
        this.$emit('getSignDetail');
      } else {
        this.currentTime = '';
      }
    },
    nextDay() {
      if (
        new Date(this.currentTime).getTime() + this.onceDay >=
        this.futureDate
      ) {
        uni.showToast({
          title: '不可选未来日期',
          icon: 'error',
        });
        return;
      }
      let clickIndex = ++this.index;
      if (funGetDateStr(clickIndex)) {
        this.currentTime = funGetDateStr(clickIndex).nowTime;
        this.$emit(
          'getTime',
          funGetDateStr(clickIndex).startTime,
          funGetDateStr(clickIndex).endTime
        );
        this.$emit('getSignDetail');
      } else {
        this.currentTime = '';
      }
    },
    prevWeek() {
      let clickIndex = --this.month;
      if (getMonthDate(clickIndex)) {
        this.weekTime = getMonthDate(clickIndex).weekDate;
        this.$emit(
          'getTime',
          `${getMonthDate(clickIndex).startWeek}`,
          `${getMonthDate(clickIndex).endWeek}`
        );
        this.$emit('getSignDetail');
      } else {
        this.weekTime = '';
      }
    },
    nextWeek() {
      let arr = this.weekTime.split('-');
      let temMonth = arr[1];
      let temYear = arr[0].split('.')[0];
      let fullTemp = temYear + '.' + temMonth;
      console.log(fullTemp, '9');
      console.log(
        new Date(getCurrentWeek().end).getTime() + this.onceWeek,
        this.futureWeek,
        '4'
      );
      if (new Date(fullTemp).getTime() + this.onceWeek >= this.futureWeek) {
        this.month = 0;
        uni.showToast({
          title: '不可选未来日期',
          icon: 'error',
        });
        return;
      }
      let clickIndex = ++this.month;
      if (getMonthDate(clickIndex)) {
        this.weekTime = getMonthDate(clickIndex).weekDate;
        this.$emit(
          'getTime',
          `${getMonthDate(clickIndex).startWeek}`,
          `${getMonthDate(clickIndex).endWeek}`
        );
        this.$emit('getSignDetail');
      } else {
        this.weekTime = '';
      }
    },
    prevMonth() {
      let clickIndex = --this.yearIndex;
      console.log(getCurrentMonth(clickIndex));
      if (getCurrentMonth(clickIndex)) {
        this.monthTime = getCurrentMonth(clickIndex).monthTime;
        this.$emit(
          'getTime',
          getCurrentMonth(clickIndex).startMonth,
          getCurrentMonth(clickIndex).endMonth
        );
        this.$emit('getSignDetail');
      } else {
        this.monthTime = '';
      }
    },
    nextMonth() {
      console.log(this.monthTime, this.futureMonth);
      if (
        new Date(this.monthTime).getTime() + this.onceMonth >=
        this.futureMonth
      ) {
        uni.showToast({
          title: '不可选未来日期',
          icon: 'error',
        });
        return;
      }
      let clickIndex = ++this.yearIndex;
      console.log(getCurrentMonth(clickIndex));
      if (getCurrentMonth(clickIndex)) {
        this.monthTime = getCurrentMonth(clickIndex).monthTime;
        this.$emit(
          'getTime',
          getCurrentMonth(clickIndex).startMonth,
          getCurrentMonth(clickIndex).endMonth
        );
        this.$emit('getSignDetail');
      } else {
        this.monthTime = '';
      }
    },
    // 预览图片
    handlePreviewImage(event) {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        event
      );
      wx.previewImage({
        current: event.currentTarget.dataset.src, // 当前显示图片的http链接
        urls: [event.currentTarget.dataset.src], // 需要预览的图片http链接列表
      });
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  margin-top: 20rpx;
  .detail-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    box-shadow: 0px 4px 40px -10px rgba(0, 0, 0, 0.1);
    padding: 20rpx 20rpx;
    .chooseType {
      display: flex;
    }
    .timeSelector {
      display: flex;
      .daySelector {
        display: flex;
      }
      .weekSelector {
        display: flex;
      }
      .yearSelector {
        display: flex;
      }
    }
  }
  .signData {
    display: flex;
    justify-content: space-between;
    padding: 10rpx 20rpx 10rpx 20rpx;
    font-weight: 400;
    color: #969799;
  }
  .sign-box {
    box-sizing: border-box;
    height: calc(100vh - 209rpx);
    overflow-y: auto;
    padding: 0 20rpx;
    .item-two {
      position: relative;
      width: 100%;
      min-height: 400rpx;
      box-sizing: border-box;
      padding: 0 32rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      padding-top: 26rpx;
      padding-bottom: 50rpx;
      font-size: 24rpx;
      box-shadow: 0px 4px 40px -10px rgba(0, 0, 0, 0.1);
      margin-top: 36rpx;
      .timeline {
        background: #fff;
        width: 100%;
        .bigCircle:not(first-child) {
          margin-top: 8rpx;
        }
        .bigCircle {
          border-radius: 50%;
          display: flex;
          margin-left: -15rpx;
          width: 64rpx;
          height: 64rpx;
          background: rgba(22, 200, 139, 0.2);
          margin-bottom: 8rpx;
          .circle {
            width: 44rpx;
            height: 44rpx;
            background: rgba(22, 200, 139, 0.8);
            border-radius: 50%;
            display: flex;
            position: absolute;
            margin-left: 10rpx;
            margin-top: 10rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            .num {
              padding: 4rpx 8rpx;
              color: #ffffff;
            }
          }
        }
        .timeline-content {
          position: relative;
          margin-left: 16rpx;
          border-left: 2rpx solid rgba(22, 200, 139, 0.2);
          min-height: 160rpx;
          .sign-list {
            transform: translate(0, -65rpx);
            min-height: 50rpx;
            padding-bottom: 30rpx;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            .time {
              width: 100%;
              padding-left: 55rpx;
              font-size: 30rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #323233;
            }
            .inspectAddress {
              margin-top: 10rpx;
              width: 100%;
              padding-left: 55rpx;
              font-size: 30rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #969799;
              max-width: 603rpx;
              word-wrap: break-word;
              word-break: normal;
              overflow-y: auto;
            }
            .imgList {
              padding-left: 55rpx;
              width: 100%;
              max-height: 217rpx;
              background: #fff;
              --tab-font-size: 32rpx;
              box-sizing: border-box;
              display: flex;
              overflow-x: auto;
              margin-top: 20rpx;
              margin-bottom: 15rpx;
              .card {
                display: inline-block;
                font-weight: 400;
                color: #646566;
                margin: 0rpx 10rpx 0px 0px;
              }
            }
            .signAddress {
              width: 100%;
              max-width: 603rpx;
              padding-left: 55rpx;
              font-size: 30rpx;
              font-weight: 400;
              color: #969799;
              word-wrap: break-word;
              word-break: normal;
              overflow-y: auto;
              // .overflow-ellipsis {
              //   max-width: 230rpx;
              // }
            }
          }
        }
      }
    }

    .item-two .timeline:last-child .timeline-content {
      border: none !important;
    }
  }
}
</style>
