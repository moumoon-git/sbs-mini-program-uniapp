<!--
 * @Author: your name
 * @Date: 2021-11-30 16:43:34
 * @LastEditTime: 2021-12-02 17:41:09
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sbs-mini-program-uniapp\src\pages\garbageClassification\siginByMap\components\SignRecord\SignRecord.vue
-->
<template>
  <view class="siginRecord">
    <van-tabs
      color="#3F8EF7"
      v-model:active="active"
      animated
      @change="handleTabChange"
    >
      <van-tab title="全部记录" v-if="hasAllRecord">
        <all-record
          ref="allRecord"
          :recordData="recordData"
          :signCount="signCount"
          :signNum="signNum"
          @getTime="getTime"
          @getSignecord="getSignecord"
        ></all-record>
      </van-tab>
      <van-tab title="我的记录">
        <my-record
          ref="myRecord"
          :myRecordData="myRecordData"
          @getTime="getTime"
          @getSignDetail="getSignDetail"
        ></my-record>
      </van-tab>
    </van-tabs>
  </view>
</template>

<script>
import MyRecord from "./components/MyRecord.vue";
import AllRecord from "./components/AllRecord.vue";
import { presentTime } from "./tool/comm";
import { getSignecord, getSignDetail } from "@/apis/index.js";
export default {
  data() {
    return {
      active: 0,
      recordData: [],
      signCount: "",
      signNum: "",
      userId: wx.getStorageSync("userId"),
      myRecordData: [],
      startTime: "",
      endTime: "",
      currentTime: "",
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
      hasAllRecord: wx.getStorageSync("allRecord"),
    };
  },
  components: {
    MyRecord,
    AllRecord,
  },
  created() {
    this.startTime = `${presentTime()} 00:00:00`;
    this.endTime =`${presentTime()} 23:59:59`;
    this.currentTime = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`;
  },
  onShow() {
    this.getSignecord();
    this.getSignDetail();
  },
  methods: {
    getSignecord() {
      getSignecord({
        startTime: this.startTime,
        endTime: this.endTime,
      }).then((res) => {
        if (res.data.code === 0) {
          this.recordData = res.data.map;
          this.signCount = res.data.count;
          this.signNum = res.data.pNumber;
        }
      });
    },
    getSignDetail() {
      getSignDetail({
        startTime: this.startTime,
        endTime: this.endTime,
        contactId: String(this.userId),
      }).then((data) => {
        if (data.data.code === 0) {
          this.myRecordData = data.data.data;
        }
      });
    },
    // 当前tab改变时触发的回调函数
    handleTabChange(name, title) {
      this.active = name.detail.index;
      this.$refs.allRecord.currentIndex = "0";
      this.$refs.myRecord.currentIndex = "0";
      this.$refs.allRecord.buttonList = Object.assign(
        this.buttonList,
        this.$options.data().buttonList
      );
      this.$refs.myRecord.buttonList = Object.assign(
        this.buttonList,
        this.$options.data().buttonList
      );
      this.$refs.allRecord.currentTime = Object.assign(
        this.currentTime,
        this.$options.data().currentTime
      );
      this.$refs.myRecord.currentTime = Object.assign(
        this.currentTime,
        this.$options.data().currentTime
      );
    },
    getTime(startTime, endTime) {
      this.startTime = `${startTime} 00:00:00`;
      this.endTime = `${endTime} 23:59:59`;
    },
  },
};
</script>

<style>
</style>