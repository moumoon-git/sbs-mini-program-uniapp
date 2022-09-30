<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-01 15:40:48
 * @LastEditTime: 2022-05-07 16:38:07
-->
<template>
  <view class="city-class">
    <view class="kind kind-line">
      <view class="kind-name" v-if="showIndex === 'SITE_CLASS'">
        <view class="title">工地名称</view>
        <van-field
          :value="dataFormMap[showIndex].workSite"
          @input="changeInput"
          style="margin-left: 80rpx;"
          placeholder="请填写工地名称"
          :disabled="(mode == 'complete' || mode=='modify')"
        />
      </view>
      <!-- 学校 -->
      <selectCampus
        v-if="showIndex === 'CAMPUS_PERIMETER'"
        :mode="mode"
        :placeData="placeData"
      ></selectCampus>
      <!-- 所属区域 -->
      <regionArea
        ref="regionArea"
        :mode="mode"
        :placeData="placeData"
      ></regionArea>
      <!-- 处理方式 -->
      <processMode
        ref="handleId"
        :mode="mode"
        :placeData="placeData"
      ></processMode>
    </view>
    <view class="kind gasSupply" v-if="showIndex === 'GAS_LAW_ENFORCEMENT'">
      <!-- 供气方式 -->
      <gasSupply :mode="mode" :placeData="placeData"></gasSupply>
      <!-- 供气企业 -->
      <gasCompany :mode="mode" :placeData="placeData"></gasCompany>
    </view>
    <!-- 工地出泥 -->
    <view class="kind select-radio" v-if="showIndex === 'SITE_CLASS'">
      <outMud :mode="mode" :placeData="placeData"></outMud>
    </view>
     <!-- 垃圾分类 -->
    <view class="kind select-radio" v-if="showIndex === 'REFUSE_CLASSIFICATION'">
      <outMud :mode="mode" :placeData="placeData"></outMud>
    </view>

    <!-- 扣押无证车辆 -->
    <view class="kind carNum" v-if="showIndex === 'CONSTRUCTION_WASTE'">
      <view class="label">扣押无证车辆台数（台）</view>
      <view
        ><van-stepper
          :value="dataFormMap[showIndex].unlicensedCarNumber"
          @change="handleFoodWasteChange"
          :disabled="(mode === 'complete'|| mode=='modify')"
          :max="10000000"
      /></view>
    </view>
    <!-- 户外广告 -->
    <view class="kind" v-if="showIndex === 'UTDOOR_ADVERTISING'">
      <!-- 种类形式 -->
      <classType :mode="mode" :placeData="placeData"></classType>
      <!-- 现状描述 -->
      <statusDescription
        :mode="mode"
        :placeData="placeData"
      ></statusDescription>
    </view>
    <!-- 规格尺寸 -->
    <stepper
      v-if="showIndex === 'UTDOOR_ADVERTISING'"
      :mode="mode"
      :placeData="placeData"
    ></stepper>
    <!-- 发布内容 -->
    <publishContent
      v-if="showIndex === 'UTDOOR_ADVERTISING'"
      :mode="mode"
      :placeData="placeData"
    ></publishContent>
    <!-- 产权单位 -->
    <field
      v-if="
        showIndex === 'UTDOOR_ADVERTISING' ||
          showIndex === 'GAS_LAW_ENFORCEMENT'
      "
      :mode="mode"
      :placeData="placeData"
    ></field>
    <!-- 问题简况 -->
    <view class="kind kind-remark" v-if="showIndex !== 'UTDOOR_ADVERTISING'">
      <view class="title">问题简况</view>
      <van-field
        type="textarea"
        autosize
        :value="dataFormMap[showIndex].profile"
        placeholder="请在此描述问题内容、地点、时间等信息"
        @input="inputChange"
        clearable
        :disabled="(mode === 'complete' || mode==='modify')"
      />
    </view>
    <!-- 整改时限 -->
    <view
      class="kind abarbeitung"
      v-if="
        showIndex === 'UTDOOR_ADVERTISING' ||
          showIndex === 'GAS_LAW_ENFORCEMENT'
      "
    >
      <abarbeitung :mode="mode" :placeData="placeData"></abarbeitung>
      <lockNumber
        :placeData="placeData"
        v-if="showIndex === 'GAS_LAW_ENFORCEMENT'"
        :mode="mode"
      ></lockNumber>
    </view>
    <view class="kind-uplod">
      <filesUpload
        ref="filesUpload"
        :placeData="placeData"
        :mode="mode"
      ></filesUpload>
    </view>
  </view>
</template>

<script>
import { ref, defineComponent, watch, provide } from 'vue';
import regionArea from './common/region-area.vue';
import processMode from './common/process-mode.vue';
import selectCampus from './common/select-campus.vue';
import outMud from './common/out-mud.vue';
import filesUpload from './common/files-upload.vue';
import classType from './common/class-type.vue';
import statusDescription from './common/status-description.vue';
import abarbeitung from './common/abarbeitung.vue';
import field from './common/field.vue';
import stepper from './common/stepper.vue';
import publishContent from './common/publish-content.vue';
import lockNumber from './common/lock-number.vue';
import gasSupply from './common/gas-supply.vue';
import gasCompany from './common/gas-company.vue';
import useInit from '../useHooks/useInit';
export default defineComponent({
  components: {
    regionArea,
    processMode,
    filesUpload,
    outMud,
    selectCampus,
    classType,
    statusDescription,
    abarbeitung,
    field,
    stepper,
    publishContent,
    lockNumber,
    gasCompany,
    gasSupply,
  },
  props: {
    placeData: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: '',
    },
  },
  setup() {
    const { dataFormMap, showIndex } = useInit();
    /**
     *
     * @param {*} e
     * @description:改变输入框的数据
     */
    function inputChange(e) {
      dataFormMap[showIndex.value].profile = e.detail;
    }
    /**
     * @description:修改扣押无证车辆台数数据
     */
    function handleFoodWasteChange(event) {
      dataFormMap[showIndex.value].unlicensedCarNumber = event.detail;
    }
    /**
     *
     * @param {*} data
     * @description:改变工地名称输入框的数据
     */
    function changeInput(data) {
      console.log(data.detail, 'data.detail');
      dataFormMap[showIndex.value].workSite = data.detail;
    }

    watch(dataFormMap, (newVal, oldVal) => {
      if (newVal) {
        wx.setStorageSync('dataFormMap', dataFormMap);
      }
    });
    return {
      dataFormMap,
      inputChange,
      handleFoodWasteChange,
      gasSupply,
      changeInput,
      showIndex,
    };
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
  }
  .carNum {
    display: flex;
    justify-content: space-around;
    padding: 27rpx 0 22rpx 0rpx;
    .label {
      padding-top: 5rpx;
    }
  }
}
</style>
