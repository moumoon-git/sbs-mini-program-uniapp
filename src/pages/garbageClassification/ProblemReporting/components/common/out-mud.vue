<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-03 16:01:28
 * @LastEditTime: 2022-05-07 16:58:18
-->
<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-01 17:15:23
 * @LastEditTime: 2022-03-03 10:46:44
-->
<template>
  <view class="city-class">
    <view class="kind select-radio">
      <view class="check-unit" v-if="showIndex == 'REFUSE_CLASSIFICATION'">
        <view class="title">检查单位</view>
        <van-field
          :value="dataFormMap[showIndex].workSite"
          @input="changeInput"
          clearable
          style="margin-left: 80rpx"
          placeholder="请填写单位名称"
          :disabled="(mode === 'complete' || mode==='modify')"
        />
      </view>

      <view class="out-mud" v-if="showIndex == 'SITE_CLASS'">
        <view>是否已完成出泥</view>
        <view class="radio-group">
          <van-radio-group
            :value="dataFormMap[showIndex].completeMudOut"
            direction="horizontal"
            @change="handlerRadio(0, $event)"
            :disabled="(mode === 'complete' || mode==='modify')"
          >
            <van-radio :name="0">否</van-radio>
            <van-radio :name="1">是</van-radio>
          </van-radio-group>
        </view>
      </view>

      <view :class="showIndex == 'SITE_CLASS'?'existing-problem':'existing'">
        <view>是否存在问题</view>
        <view class="radio-group">
          <van-radio-group
            :value="dataFormMap[showIndex].existingProblems"
            direction="horizontal"
            @change="handlerRadio(1, $event)"
            :disabled="(mode === 'complete' || mode === 'modify')"
          >
            <van-radio :name="0">否</van-radio>
            <van-radio :name="1">是</van-radio>
          </van-radio-group>
        </view>
      </view>

      <view class="forfeit" v-if="showIndex == 'REFUSE_CLASSIFICATION'">
        <view class="title">罚款金额</view>
        <view class="filed">
          <van-field
            class="input-field"
            :value="dataFormMap[showIndex].fine"
            :integer="false"
            style="width:320rpx"
            input-align="right"
            placeholder="请填写整数罚款金额"
            @input="handleInput"
            :disabled="(mode === 'complete' || mode === 'modify')"
          />
          <text class="tip">元</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, defineComponent, reactive } from "vue";
import useInit from "../../useHooks/useInit";
export default defineComponent({
  props: {
    mode: {
      type: String,
      default: "",
    },
    placeData: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const { dataFormMap, showIndex } = useInit();
    const completeMudOut = ref(0);
    const existingPproblems = ref(0);
    function handlerRadio(type, e) {
      console.log(type, 666);
      if (type === 0) {
        dataFormMap[showIndex.value].completeMudOut = e.detail;
      } else {
        dataFormMap[showIndex.value].existingProblems = e.detail;
      }
      console.log(e.detail, "/*/*/*");
    }
    /**
     *
     * @param {*} data
     * @description:改变检查单位输入框的数据
     */
    function changeInput(data) {
      console.log(data.detail, "data.detail");
      dataFormMap[showIndex.value].workSite = data.detail;
    }
    /**
     *
     * @param {*} data
     * @description:改变罚款金额输入框的数据
     */
    function handleInput(data) {
      console.log(data.detail,'类型')
      dataFormMap[showIndex.value].fine = parseInt(data.detail);
    }

    return {
      dataFormMap,
      completeMudOut,
      existingPproblems,
      handlerRadio,
      showIndex,
      changeInput,
      handleInput,
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
  }
  .check-unit {
    display: flex;
    width: 96%;
    margin: 20rpx auto;
    border-bottom: 1rpx solid #d7d7d7;
    .title {
      padding: 20rpx 0 20rpx 0rpx;
      line-height: 50rpx;
    }
  }
  .out-mud {
    display: flex;
    justify-content: space-between;
    // width: 96%;
    margin: 20rpx auto;
    border-bottom: 1rpx solid #d7d7d7;
    padding: 30rpx 0 26rpx 17rpx;
    .radio-group {
      display: flex;
    }
  }
  .existing-problem {
    display: flex;
    justify-content: space-between;
    margin: 20rpx auto;
    padding: 0rpx 0 26rpx 17rpx;
    .radio-group {
      display: flex;
    }
  }
  .existing{
    display: flex;
    justify-content: space-between;
    margin: 20rpx auto;
    padding: 7rpx 0 7rpx 17rpx;
    .radio-group {
      display: flex;
    }
  }
  .forfeit {
    display: flex;
    justify-content: space-between;
    width: 96%;
    margin: 20rpx auto;
    border-top: 1rpx solid #d7d7d7;
    .title {
      padding: 20rpx 0 20rpx 0rpx;
      line-height: 50rpx;
    }
    .filed {
      display: flex;
      .tip {
        padding: 20rpx 0 20rpx 0rpx;
        line-height: 44rpx;
      }
    }
  }
}
</style>
