<template>
  <div class="inspection-history">
    <div class="tab-bar">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        @click="tabChange(index)"
        :class="{ 'tab-box': true, 'active-bar': active === index }"
      >
        {{ item }}
      </div>
    </div>
    <div class="total-box">
      <div>巡查次数: {{ total }}</div>
      <div>异常数：{{ unNormalNum }}</div>
    </div>
    <div class="history-list">
      <div class="header">
        <div>巡查时间：2020-05-04 07:50:50</div>
        <div style="margin-left: 15rpx;">巡查人：张三</div>
        <div class="icon-box">
          <div class="">
            <van-icon name="checked" style="color: #19be6b" />
            1
          </div>
          <div class="">
            <van-icon name="warning" style="color: #fa7e7e; " />
            2
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">是否存在sss</div>
        <div class="detail">
          <div>检查结果：是</div>
          <div>情况说明：未发现问题</div>
          <div>拍照说明：</div>
          <div class="imgList">
            <image
              src="http://xc1.zeits.cn/fastdfs/group1/M00/00/01/wKhj42GLiqKAJDbhAAKUi_xfCgA624.png"
            ></image>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabList: ['全部', '本月', '本年'],
      active: 0,
      total: 55,
      unNormalNum: 12,
    };
  },
  methods: {
    tabChange(i) {
      this.active = i;
    },
  },
};
</script>
<style lang="less" scoped>
.inspection-history {
  min-height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
  color: #474747;
  .tab-bar {
    width: 96%;
    margin: 20rpx auto;
    display: flex;
    background-color: #fff;
    font-size: 24rpx;
    .tab-box {
      padding: 12rpx 20rpx;
    }
    .active-bar {
      background-color: #0090fe;
      color: #fff;
      border-radius: 5px;
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
    > div:first-child {
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
