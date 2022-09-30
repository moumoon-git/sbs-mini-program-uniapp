<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-03 16:10:31
 * @LastEditTime: 2022-05-07 16:35:55
-->

<template>
  <view class="city-class">
    <view class="kind import">
      <view class="kind-name">
        <view class="title">产权单位（人）</view>
        <van-field style="margin-left: 33rpx;"  :value="dataFormMap[showIndex].propertyRight" @input="inputChange(0,$event)"  :disabled="(mode ==='complete' || mode==='modify')" placeholder="产权单位名称/负责人" />
      </view>
      <view class=" kind-contact">
        <view class="title">联系方式</view>
        <van-field :value="dataFormMap[showIndex].contactInformation" style="margin-left: 33rpx;margin-left: 126rpx;"  @input="inputChange(1,$event)" placeholder="产权单位/负责人联系方式" :disabled="(mode ==='complete' || mode=='modify')"/>
      </view>
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
  setup() {
    const { dataFormMap,showIndex} = useInit();
    function inputChange(type,e) {
      console.log(e,'产权')
      if(type===0){
        dataFormMap[showIndex.value].propertyRight=e.detail;
      }else{
        dataFormMap[showIndex.value].contactInformation=e.detail;
      }
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
  }
  .kind-name {
    display: flex;
    width: 96%;
    margin: 0 auto;
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
