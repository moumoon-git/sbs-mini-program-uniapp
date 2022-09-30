<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-01 15:15:20
 * @LastEditTime: 2022-05-07 16:37:38
-->
<template>
  <view class="selectCampus">
    <view class="area area-line">
      <view class="area-line-header cardRight" @click="showMode(true)">
        <view class="school">
          <image 
          class="little-icon"
          :src="imgStaticUrl + '/img/ProblemReporting/school.png'" mode="" 
          style="width: 40rpx;height: 40rpx;margin-top: 32rpx;">
          </image>
          <text>学校</text>
        </view>
        <view>
          <text class="schoolCompanyName">{{ dataFormMap[showIndex].schoolCompanyName? dataFormMap[showIndex].schoolCompanyName:'' }}</text>
          <van-icon class="little-icon vertical-right" name="arrow" v-if="!(mode == 'complete' || mode=='modify')" />
        </view>
       
      </view>
    </view>
    <van-action-sheet :show="modeShow" title="请选择整改类型" @close="showMode(false)" v-if="!(mode == 'complete' || mode=='modify')">
      <van-picker
        v-if="pickerVisible"
        show-toolbar
        :columns="columns"
        value-key="name"
        @confirm="onConfirm"
        @cancel="onCancel"
        @change="onChange"
      />
    </van-action-sheet>
  </view>
</template>

<script>
import { getSchoolData } from "@/apis/index.js";
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
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl
    };
  },
    setup() {
    const { dataFormMap,showIndex} = useInit();
    const modeShow=ref(false);
    const columns=reactive([])
    const pickerVisible=ref(false)
    function showMode(flag) {
      if(flag){
        getModeList();
      }
      modeShow.value = flag;
      pickerVisible.value = true;
    }
    function getModeList() {
      columns.length=0;
      let requset = {
        type: 0,
      };
      let headers = {
        "content-type": "application/x-www-form-urlencoded",
        token: wx.getStorageSync("token"),
      };
      getSchoolData(requset, headers).then((res) => {
        if (res.data.code === 0) {
          let tempArr=res.data.data.map((v) => {
            return {
              id:v.id,
              name:v.name
            }
          });
          columns.push(...tempArr)
        }else{
          wx.showToast({
            title:  res.data.msg,
            icon: 'error'
          });
        }
        console.log(columns, "整改数据");
      });
    }
    function onConfirm(e){
      dataFormMap[showIndex.value].schoolCompanyName = e.detail.value.name;
      dataFormMap[showIndex.value].schoolCompanyId=e.detail.value.id;
      modeShow.value = false;
    }
    function onChange(e) {
      console.log(e,'7777')
    }
    function onCancel(e){
      modeShow.value = false;
    }

    return{
      dataFormMap,
      modeShow,
      columns,
      pickerVisible,
      showMode,
      getModeList,
      onConfirm,
      onCancel,
      onChange,
      showIndex
    }
  },
});
</script>
<style lang="less" scoped>
.selectCampus {
  .area {
    margin: 20rpx auto;
    width: 96%;
    background-color: #fff;
    .title {
      padding: 20rpx 0 20rpx 23rpx;
      line-height: 40rpx;
    }
  }
  .area-line {
    margin: 0 auto;
    border-bottom: 1px solid #d7d7d7;
    width: 94%;
    .area-line-header {
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
      .school{
        display: flex;
      }
    }
  }
}
</style>
