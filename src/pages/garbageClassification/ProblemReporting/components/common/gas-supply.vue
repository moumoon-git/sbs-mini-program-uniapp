<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-01 19:56:37
 * @LastEditTime: 2022-05-07 16:36:36
-->
<template>
  <view class="process-mode">
    <view class="card card-line">
      <view class=" card-line-header cardRight" @click="showMode(true)">
        <view><text>供气方式</text></view>
        <view>
          <text class="supplyName">{{ dataFormMap[showIndex].supplyName?dataFormMap[showIndex].supplyName:'' }}</text>
          <van-icon class="little-icon vertical-right" name="arrow" v-if="!(mode == 'complete' || mode=='modify')" />
        </view>
      </view>
    </view>
    <van-action-sheet :show="modeShow" title="请选择供气方式" @close="showMode(false)" v-if="!(mode == 'complete' || mode=='modify')">
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
import { getRectificationType } from "@/apis/index.js";
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
      modeShow: false,
      columns: [],
      pickerVisible: false,
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
        code: "reporting_supply_gas_mode",
      };
      let headers = {
        "content-type": "application/x-www-form-urlencoded",
        token: wx.getStorageSync("token"),
      };
      getRectificationType(requset, headers).then((res) => {
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
      dataFormMap[showIndex.value].supplyName = e.detail.value.name;
      dataFormMap[showIndex.value].supplyGasModeId=e.detail.value.id
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
    border-bottom: 1px solid #d7d7d7;
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
}
</style>
