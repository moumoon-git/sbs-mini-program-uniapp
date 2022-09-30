<!--
 * @Author: your name
 * @Date: 2021-11-30 17:51:40
 * @LastEditTime: 2021-12-03 15:33:29
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sbs-mini-program-uniapp\src\pages\garbageClassification\siginByMap\components\SignRecord\AllRecord.vue
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
      <view class="signPeole">
        <text>签到人数：</text>
        <text>{{ `${signNum ? signNum: ""}` }}</text>
      </view>
      <view class="signNum">
        <text>签到次数：</text>
        <text>{{ `${signCount ? signCount : 0}` }}</text>
      </view>
    </view>
    <!-- 签到数据 -->
    <section class="signList" v-if="recordData.length > 0">
      <view
        v-for="(item, i) in recordData"
        :key="i"
        class="list-item"
        @click="handleViewCardDetail(item)"
      >
        <view class="card-content">
          <view class="card-content-left">
            <text>{{ item.name }}</text>
          </view>
          <view class="card-content-right">
            <text>签到次数:</text>
            <text>{{ `${item.num}` }}</text>
          </view>
        </view>
        <van-icon name="arrow" />
      </view>
    </section>
    <block v-else>
      <van-empty class="empty" description="暂无数据" />
    </block>
  </view>
</template>

<script>
import {
  getCurrentWeek,
  funGetDateStr,
  getCurrentMonth,
  getMonthDate,
  presentTime,
  nowMonth,
} from "../tool/comm";
export default {
  props: {
    recordData: {
      type: Array,
    },
    signCount: {
      type: String,
    },
    signNum: {
      type: String,
    },
  },
  data() {
    return {
      buttonList: [
        {
          id: 0,
          name: "日",
          type: "info",
          checked: true,
        },
        {
          id: 1,
          name: "周",
          type: "default",
          checked: false,
        },
        {
          id: 2,
          name: "月",
          type: "default",
          checked: false,
        },
      ],
      currentIndex: 0,
      index: 0,
      currentTime: "",
      weekTime: "",
      monthTime: "",
      monthIndex: 0,
      month: 0,
      startYear: "",
      startMonth: "",
      onceWeek: 7 * 24 * 3600 * 1000,
      onceDay: 24 * 60 * 60 * 1000,
      onceMonth: 30 * 24 * 3600 * 1000,
    };
  },
  computed: {
    futureMonth() {
      let nowMonth = new Date().toLocaleDateString();
      let arr = nowMonth.split("/");
      arr.pop();
      return new Date(arr.join("-")).getTime();
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
    this.currentTime = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`;
    this.weekTime = getCurrentWeek().time;
    this.monthTime = `${new Date().getFullYear()}.${new Date().getMonth() + 1}`;
  },
  methods: {
    choose(e) {
      let index = e.currentTarget.dataset.id;
      console.log(index, "index");
      this.currentIndex = e.currentTarget.dataset.id;
      this.buttonList.forEach((v, i) => {
        this.buttonList[i].checked = !this.buttonList[i].checked;
        v.id == index
          ? (this.buttonList[i].type = "info")
          : (this.buttonList[i].type = "default");
      });
      if (index == 0) {
        this.$emit("getTime", presentTime(), presentTime());
      } else if (index == 1) {
        this.$emit("getTime", getCurrentWeek().start, getCurrentWeek().end);
      } else {
        this.$emit(
          "getTime",
          nowMonth().firstDayOfCurMonth,
          nowMonth().lastDayOfCurMonth
        );
      }
      this.$emit("getSignecord");
    },
    prevDay() {
      let clickIndex = --this.index;
      if (funGetDateStr(clickIndex)) {
        this.currentTime = funGetDateStr(clickIndex).nowTime;
        this.$emit(
          "getTime",
          funGetDateStr(clickIndex).startTime,
          funGetDateStr(clickIndex).endTime
        );
        this.$emit("getSignecord");
      } else {
        this.currentTime = "";
      }
    },

    nextDay() {
      console.log(this.currentTime, this.futureDate, "99");
      console.log(
        "console.log: ",
        new Date(this.currentTime).getTime() + this.onceDay
      );

      if (
        new Date(this.currentTime).getTime() + this.onceDay >=
        this.futureDate
      ) {
        uni.showToast({
          title: "不可选未来日期",
          icon: "error",
        });
        return;
      }
      let clickIndex = ++this.index;
      if (funGetDateStr(clickIndex)) {
        this.currentTime = funGetDateStr(clickIndex).nowTime;
        this.$emit(
          "getTime",
          funGetDateStr(clickIndex).startTime,
          funGetDateStr(clickIndex).endTime
        );
        this.$emit("getSignecord");
      } else {
        this.currentTime = "";
      }
    },
    prevWeek() {
      let clickIndex = --this.month;
      if (getMonthDate(clickIndex)) {
        this.weekTime = getMonthDate(clickIndex).weekDate;
        this.$emit(
          "getTime",
          `${getMonthDate(clickIndex).startWeek}`,
          `${getMonthDate(clickIndex).endWeek}`
        );
        this.$emit("getSignecord");
      } else {
        this.weekTime = "";
      }
    },
    nextWeek() {
      let arr = this.weekTime.split("-");
      let temMonth = arr[1];
      let temYear = arr[0].split(".")[0];
      let fullTemp = temYear + "." + temMonth;
      console.log(fullTemp, "9");
      console.log(
        new Date(getCurrentWeek().end).getTime() + this.onceWeek,
        this.futureWeek,
        "4"
      );
      if (new Date(fullTemp).getTime() + this.onceWeek >= this.futureWeek) {
        this.month = 0;
        uni.showToast({
          title: "不可选未来日期",
          icon: "error",
        });
        return;
      }
      let clickIndex = ++this.month;
      if (getMonthDate(clickIndex)) {
        this.weekTime = getMonthDate(clickIndex).weekDate;
        this.$emit(
          "getTime",
          `${getMonthDate(clickIndex).startWeek}`,
          `${getMonthDate(clickIndex).endWeek}`
        );
        this.$emit("getSignecord");
      } else {
        this.weekTime = "";
      }
    },
    prevMonth() {
      let clickIndex = --this.monthIndex;
      if (getCurrentMonth(clickIndex)) {
        this.monthTime = getCurrentMonth(clickIndex).monthTime;
        this.$emit(
          "getTime",
          getCurrentMonth(clickIndex).startMonth,
          getCurrentMonth(clickIndex).endMonth
        );
        this.$emit("getSignecord");
      } else {
        this.monthTime = "";
      }
    },
    nextMonth() {
      console.log(this.monthTime, this.futureMonth);
      console.log(new Date(this.monthTime).getTime(), "44444");
      if (
        new Date(this.monthTime).getTime() + this.onceMonth >=
        this.futureMonth
      ) {
        uni.showToast({
          title: "不可选未来日期",
          icon: "error",
        });
        return;
      }
      let clickIndex = ++this.monthIndex;
      if (getCurrentMonth(clickIndex)) {
        this.monthTime = getCurrentMonth(clickIndex).monthTime;
        this.$emit(
          "getTime",
          getCurrentMonth(clickIndex).startMonth,
          getCurrentMonth(clickIndex).endMonth
        );
        this.$emit("getSignecord");
      } else {
        this.monthTime = "";
      }
    },

    handleViewCardDetail(event) {
      console.log(event, "event");
      wx.navigateTo({
        url: `/pages/garbageClassification/siginByMap/components/SignRecord/components/SignDetail?id=${event.contactId}`,
        success: (res) => {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit("instanceEntitiesEvent", {
            data: {
              contactId: event.contactId,
              mailContactorEntity: event.mailContactorEntity,
              name: event.name,
              currentTime: this.currentTime,
              monthTime: this.monthTime,
              weekTime: this.weekTime,
              currentIndex: this.currentIndex,
            },
          });
        },
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
    padding: 20rpx 20rpx;
    color: #969799;
  }
  .signList {
    box-sizing: border-box;
    height: calc(100vh - 209rpx);
    overflow-y: auto;
    padding:0rpx 20rpx 0 20rpx;
    .list-item:not(last-child) {
      margin-bottom: 20rpx;
    }
    .list-item {
      background: #ffffff;
      box-shadow: 0px 4px 40px -10px rgba(0, 0, 0, 0.1);
      border-radius: 8rpx;
      box-sizing: border-box;
      padding: 37rpx 20rpx;
      margin-top: 20rpx;
      display: flex;
      justify-content: space-between;
      position: relative;
      .card-content{
        .card-content-left,
        .card-content-right {
          color: #333;
          margin-left: 16rpx;
        }
        .card-content-right {
          margin-top: 40rpx;
            & text{
            color: #999999;
            margin-bottom: 20rpx;
            margin-right: 10rpx;
          }
        }
      }
      /deep/ .van-icon.van-icon-arrow {
        position: absolute;
        right: 5%;
      }
    }
  }
}
</style>