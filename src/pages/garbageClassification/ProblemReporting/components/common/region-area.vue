<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-01 15:15:20
 * @LastEditTime: 2022-05-07 16:37:33
-->
<template>
  <view class="regionArea">
    <view class="area area-line">
      <view class="area-line-header cardRight" @click="showArea(true)">
        <view class="areaIcon"> 
          <image
            class="little-icon"
            :src="imgStaticUrl + '/img/ProblemReporting/area.png'"
            mode=""
            style="width: 40rpx;height: 40rpx;margin-top: 32rpx;"
          >
          </image>
          <text style="color: #ec808d">*</text>
          <text>所属区域</text>
        </view>
       <view><text class="name">{{ dataFormMap[showIndex].areaName}}</text>
        <van-icon class="little-icon vertical-right" name="arrow" v-if="!(mode == 'complete' || mode=='modify')"/></view>
      </view>
    </view>
    <van-action-sheet
      :show="areaShow"
      title="请选择所属区域"
      @close="showArea(false)"
      v-if="!(mode == 'complete' || mode=='modify')"
    >
      <ProblemArea
        :problemAreaTree="problemAreaTree"
        @selectGroupData="selectGroupData"
        ref="area"
      ></ProblemArea>
    </van-action-sheet>
  </view>
</template>

<script>
import ProblemArea from '@/pages/publicPage/problem-report/components/ProblemArea';
import { getGarbageSortingTaskGroupListTree } from '@/apis/index.js';
import { ref, defineComponent, reactive, nextTick } from 'vue';
import useInit from '../../useHooks/useInit';
export default defineComponent({
  components: { ProblemArea },
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
      imgStaticUrl: this.$imgStaticUrl,
    };
  },
  emits: ['getAreaData'],
  setup(prop, { emit }) {
    const { dataFormMap,showIndex } = useInit();
    const problemAreaTree = reactive([]);
    const areaShow = ref(false);
    const areaData = reactive({
      groupId: '',
      name: '',
    });
    // 问题区域回调
    function selectGroupData(data) {
      console.log(data);
      dataFormMap[showIndex.value].areaName = data.name;
      areaShow.value = false;
      dataFormMap[showIndex.value].areaId=data.id;
    }
    return {
      dataFormMap,
      areaShow,
      problemAreaTree,
      selectGroupData,
      showIndex
    };
  },
  methods: {
     showArea(flag) {
      if (flag) {
        this.getAreaData();
      }
      this.areaShow = flag;
    },
     getAreaData() {
      this.problemAreaTree.length = 0;
      getGarbageSortingTaskGroupListTree().then((res) => {
        console.log(res, '55555');
        if (res.data && res.data.data) {
          this.problemAreaTree.push(...res.data.data);
          this.$nextTick(() => {
            this.$refs.area.checkId = this.dataFormMap[this.showIndex].areaId;
          })
        } else {
          wx.showToast({
            title:  res.data.msg,
            icon: 'error'
          });
          return res.data.msg;
        }
      });
    }
  }
});
</script>
<style lang="less" scoped>
.regionArea {
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
      .name {
        margin-left: auto;
      }
    }
    .cardRight{
      display: flex;
      justify-content: space-between;
      .areaIcon{
        display: flex;
      }
    }
  }
}
</style>
