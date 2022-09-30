<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-02-15 17:56:43
 * @LastEditTime: 2022-02-17 13:46:47
-->
<template>
  <view class="inspection-history-record" v-if="inforEntitys && inforEntitys.length > 0">
    <view class="tab-bar">
      <view class="title">{{ title }}</view>
      <view class="content">
        <view class="flex-box" v-for="(item, index) in tempObj" :key="index">
          <text class="left">{{ item.title }}</text>
          <text class="right">{{ item.dec }}</text>
        </view>
      </view>
      <view class="result">
        <text class="left">检查结果</text>
        <view class="right">
          <view>
            <van-icon name="checked" style="color: #19be6b; margin-right: 10rpx" />
            <text>{{ usual || 0 }}</text>
          </view>
          <view>
            <van-icon
              name="clear"
              style="color: #fa7e7e; margin-left: 36rpx; margin-right: 10rpx"
            />
            <text> {{ unusual || 0 }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="wrap-task-list">
      <view
        style="margin-bottom: 20rpx"
        v-for="(item, index) in inforEntitys"
        :key="item.id"
      >
        <edit-tick
          :isExpand="activeExpand === index"
          :inspectionTaskItems="item"
          :editData="item"
          :index="index"
          :isSeeMode="item.instanceStatus === '1'"
          @expand="expand"
        />
      </view>
    </view>
  </view>
  <block v-else>
    <van-empty class="empty" description="暂无数据" />
  </block>
</template>
<script>
import EditTick from "./components/EditTick/EditTick.vue";
import { getInspeCtionHistory } from "@/apis/index.js";
export default {
  data() {
    return {
      active: 0,
      imgStaticUrl: this.$imgStaticUrl,
      tempObj: [],
      activeExpand: -1, // 展开项 改成只能一次展开一个
      location: "",
      taskId: "",
      pointId: "",
      instanceId: "",
      pointTypeNum: "",
      title: "",
      unusual: "",
      usual: "",
      inforEntitys: [],
    };
  },
  components: {
    EditTick,
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel(); // 兼容APP-NVUE
    if (Object.keys(eventChannel).length) {
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on("patrolRecord", (data) => {
        this.taskId = data.data.taskId;
        this.pointId = data.data.pointId;
        this.instanceId = data.data.instanceId;
        this.pointTypeNum = data.data.pointTypeNum ? data.data.pointTypeNum : 0;
        this.$nextTick(()=>{
          this.getHistory();
        })
        
      });
      console.log(this.taskId,this.pointId,this.instanceId,this.pointTypeNum)
     
    }
     
  },
  methods: {
    tabChange(i) {
      this.active = i;
    },
    // 只能展开一个选项
    expand(index) {
      if (index === this.activeExpand) {
        this.activeExpand = -1;
        return;
      }
      this.activeExpand = index;
    },
    // 获取巡查记录详情接口
    getHistory() {
     getInspeCtionHistory({
        taskId: this.taskId,
        pointId: this.pointId,
        instanceId: this.instanceId,
        pointTypeNum: this.pointTypeNum,
      }).then((res) => {
        console.log("%c [ xxx ]", "font-size:13px; background:pink; color:#bf2c9f;", res);
        if (res.data.code === 0) {
          console.log(res.data.data, "获取巡查记录数据");
          let data = res.data.data;
          this.inforEntitys = res.data.data;
          this.title = data[0].pointName;
          this.unusual = res.data.unusual;
          this.usual = res.data.usual;
          this.tempObj = [
            {
              title: "巡查时间",
              dec: data[0].gmtModified?data[0].gmtModified:"",
            },
            {
              title: "巡查人",
              dec: `${data[0].contactName?data[0].contactName:''} (${data[0].contactPosition?data[0].contactPosition:''})`
            },
            {
              title: "巡查地址",
              dec: data[0].place?data[0].place:'',
            },
          ];
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.inspection-history-record {
  min-height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
  color: #474747;

  .tab-bar {
    overflow-y: scroll;
    background-color: #fff;
    height: 375rpx;
    padding: 0 40rpx;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    .title {
      color: #333;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bolder;
      padding-top: 28rpx;
    }
    .tab-box {
      padding: 12rpx 20rpx;
    }

    .active-bar {
      background-color: #0090fe;
      color: #fff;
      border-radius: 5px;
    }
    .content {
      margin-top: 18rpx;
      font-size: 28rpx;
      .flex-box {
        line-height: 40rpx;
        display: flex;
        align-items: center;
        padding: 10rpx 0;
        .left {
          width: 150rpx;
          line-height: 40rpx;
          font-weight: 400;
          color: #999;
        }
        .right {
          flex: 1;
          max-width: 540rpx;
          word-break: break-all;
        }
      }
    }
    .result {
      display: flex;
      padding: 10rpx 0;
      .left {
        width: 150rpx;
        line-height: 40rpx;
        font-weight: 400;
        color: #999;
        font-size: 28rpx;
      }
      .right {
        display: flex;
      }
    }
  }
  .total-box {
    width: 96%;
    height: 95rpx;
    margin: 20rpx auto;
    border-radius: 10px;
    background: linear-gradient(180deg, #81d3f8, #02a7f0);
    color: #fff;
    display: flex;
    align-items: center;
    > view:first-child {
      margin: 0 60rpx 0 10rpx;
    }
  }

  .history-list {
    width: 96%;
    margin: 20rpx auto;

    .header {
      width: 100%;
      height: 75rpx;
      box-sizing: border-box;
      padding-left: 20rpx;
      display: flex;
      align-items: center;
      background-color: #fff;
      font-size: 24rpx;
      .icon-box {
        display: flex;
        margin-left: auto;
        width: 100rpx;
        justify-content: space-between;
        margin-right: 20rpx;
      }
    }
  }
}
</style>
