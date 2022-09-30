<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-01 19:28:19
 * @LastEditTime: 2022-05-07 16:36:43
-->
<template>
  <view class="process-mode">
    <view class="card card-line">
      <view class="card-line-header cardRight" @click="showMode(true)">
        <view><text>请选择销号时间</text></view>
        <view>
          <text class="time">{{ dataFormMap[showIndex].subscriberDeletionTime? dataFormMap[showIndex].subscriberDeletionTime:"" }}</text>
          <van-icon class="little-icon vertical-right" name="arrow" v-if="!(mode == 'complete' || mode=='modify')" />
        </view>
        
      </view>
    </view>
     <van-overlay :show="modeShow">
      <van-datetime-picker-plus
        class="fixed-bottom"
        v-show="modeShow"
        type="date"
        :value="currentDate"
        @confirm="onCalendarConfirm"
        @cancel="onClose"
        :max-date="maxDate"
        :min-date="minDate"
      />
    </van-overlay>
  </view>
</template>

<script>
import { ref, defineComponent, reactive } from "vue";
import useInit from "../../useHooks/useInit";
export default defineComponent({
  components: {},
  props: {
    mode:{
      type:String,
      default: "",
    },
    placeData:{
      type:Object,
      default:()=>{}
    },
  },
  setup() {
    const { dataFormMap,showIndex} = useInit();
    const currentDate=ref(new Date().getTime())
    const minDate=ref(new Date().getTime())
    const maxDate=ref((new Date().getTime() + 24 * 60 * 60 * 1000 * 365))
    const modeShow=ref(false);
    const pickerVisible=ref(false)
    function showMode(flag) {
      modeShow.value = flag;
      pickerVisible.value = true;
    }
    function onCalendarConfirm(data){
      let temp = dateFormatter(data.detail);
      console.log(data.detail,'data.detail')
      dataFormMap[showIndex.value].subscriberDeletionTime=temp;
      modeShow.value = false;
      pickerVisible.value = false;
    }
    function onChange(e) {
      console.log(e,'7777')
    }
    function onClose(e){
      this.modeShow = false;
      this.pickerVisible = false;
    }
    //格式化起始时间结束时间
    function dateFormatter(str) {
      //默认返回yyyy-MM-dd HH-mm-ss
      var hasTime = arguments[1] != false ? true : false; //可传第二个参数false，返回yyyy-MM-dd
      var d = new Date(str);
      var year = d.getFullYear();
      var month = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      var minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      var second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
      if (hasTime) {
        return [year, month, day].join("-") + " " + [hour, minute, second].join(":");
      } else {
        return [year, month, day].join("-");
      }
    }
    return{
      dataFormMap,
      modeShow,
      pickerVisible,
      showMode,
      onCalendarConfirm,
      onClose,
      onChange,
      currentDate,
      minDate,
      maxDate,
      dateFormatter,
      showIndex
    }
  },

  watch: {},
  computed: {},
  created() {},
  mounted() {},
});
</script>
<style lang="less" scoped>
.process-mode {
  .card {
    margin: 20rpx auto;
    width: 96%;
    background-color: #fff;
    .title {
      padding: 20rpx 0 20rpx 23rpx;
      line-height: 40rpx;
    }
  }
  .card-line {
    margin: 0 auto;
    width: 94%;
    border-top: 1rpx solid #d7d7d7;
    .card-line-header {
      display: flex;
      line-height: 104rpx;
      .little-icon {
        margin-right: 5rpx;
        font-size: 40rpx;
      }
    }
    .cardRight{
      display: flex;
      justify-content: space-between;
    }
  }
  
  .fixed-bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>
