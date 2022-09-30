<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-04-11 17:35:20
 * @LastEditTime: 2022-04-12 11:13:56
-->
<template>
  <view class="DetailedInformation">
    <header>
      <text class="title">{{ information.title }}</text>
    </header>
    <view class="gmtCreate">{{ information.gmtCreate }}</view>
    <section>
      <rich-text :nodes="information.content"></rich-text>
    </section>
  </view>
</template>

<script>
export default {
  name: "DetailedInformation",
  components: {},
  props: {},
  data() {
    return {
      information: {},
    };
  },
  watch: {},
  computed: {},
  // 上传图片不能用onShow 不然上传了图片会触发onShow
  onLoad(option) {
    const eventChannel = this.getOpenerEventChannel(); // 兼容APP-NVUE
    console.log("%c [ xxx ]", "font-size:13px; background:pink; color:#bf2c9f;", option);
    if (Object.keys(eventChannel).length) {
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on("instanceEntitiesEvent", (data) => {
        console.log(data, "传过来的数据");
        this.information = data.data.content;
        console.log(this.information, "this.information");
      });
    }
  },
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.DetailedInformation {
  min-height: 100vh;
  background-color: #fff;
  overflow: hidden;
  color: #474747;
  position: relative;
  header {
    margin:22rpx 0rpx 20rpx 38rpx;
    .title {
      font-size: 45rpx;
      color: #333333;
      line-height: 63rpx;
    }
  }
  .gmtCreate {
    margin: 0rpx 0rpx 20rpx 38rpx;
    font-size: 22rpx;
    color: #999999;
    line-height: 36rpx;
  }
  section{
    margin: 0 38rpx;
  }
}
</style>
