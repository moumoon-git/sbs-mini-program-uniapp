<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-03 16:17:16
 * @LastEditTime: 2022-05-07 16:37:24
-->
<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-01 19:26:37
 * @LastEditTime: 2022-03-03 10:57:14
-->
<template>
  <view class="city-class">
    <view class="kind kind-remark">
      <view class="title">发布内容 </view>
      <van-field
        type="textarea"
        autosize
        placeholder="请在此发布内容"
        @input="inputChange"
        :value="dataFormMap[showIndex].publishContent"
        :disabled="(mode==='complete' || mode==='modify')"
      />
    </view>
  </view>
</template>

<script>
import { ref, defineComponent, reactive } from "vue";
import useInit from "../../useHooks/useInit";
export default defineComponent({
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
  data() {
    return {
      dataFormMap: {
        publishContent: "", //发布内容
      },
    };
  },
  setup() {
    const { dataFormMap,showIndex} = useInit();
    function inputChange(e) {
      console.log(e);
      dataFormMap[showIndex.value].publishContent = e.detail;
    }
    return{
      dataFormMap,
      inputChange,
      showIndex
    }
  },
});
</script>
<style lang="less" scoped>
.city-class {
  color: #474747;
  .kind {
    margin: 20rpx auto;
    width: 96%;
    background-color: #fff;
    .title {
      padding: 20rpx 0 20rpx 23rpx;
      line-height: 40rpx;
    }
  }
  .kind-line {
  }
  .carNum {
    display: flex;
    justify-content: space-around;
    padding: 27rpx 0 22rpx 0rpx;
    .label {
      padding-top: 5rpx;
    }
  }
  .kind-name {
    display: flex;
    width: 96%;
    margin: 20rpx auto;
    border-bottom: 1rpx solid #d7d7d7;
    .title {
      padding: 20rpx 0 20rpx 23rpx;
      line-height: 50rpx;
    }
  }
  .kind-contact {
    display: flex;
    width: 96%;
    margin: 20rpx auto;
    .title {
      padding: 20rpx 0 20rpx 23rpx;
      line-height: 50rpx;
    }
  }
}
</style>
