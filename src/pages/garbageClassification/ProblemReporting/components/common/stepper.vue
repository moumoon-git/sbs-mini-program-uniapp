<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-03 16:14:16
 * @LastEditTime: 2022-05-07 16:37:57
-->
<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-01 19:26:37
 * @LastEditTime: 2022-03-03 10:57:14
-->
<template>
  <view class="city-class">
    <view class="kind carNum">
      <view class="label">规格尺寸（平方米)</view>
      <view
        ><van-stepper
          :max="10000000"
          :value="dataFormMap[showIndex].specs"
          @change="handleSteepChange"
          :disabled="(mode === 'complete' || mode==='modify')"
      /></view>
    </view>
  </view>
</template>

<script>
import { ref, defineComponent, reactive } from 'vue';
import useInit from '../../useHooks/useInit';
export default defineComponent({
  props: {
    mode: {
      type: String,
      default: '',
    },
    placeData: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const { dataFormMap, showIndex } = useInit();
    function handleSteepChange(event) {
      dataFormMap[showIndex.value].specs = event.detail;
    }
    return {
      dataFormMap,
      handleSteepChange,
      showIndex,
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
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

  .carNum {
    display: flex;
    justify-content: space-between;
    padding: 27rpx 0 22rpx 0rpx;
    .label {
      padding-top: 5rpx;
      margin-left: 27rpx;
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
}
</style>
