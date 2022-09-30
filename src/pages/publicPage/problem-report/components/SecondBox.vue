<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2021-11-17 19:09:53
 * @LastEditTime: 2022-04-08 10:08:55
-->
<template>
  <view :class="{ 'flex-box': true, 'block-box': isProblemType }">
    <view
      v-for="item in list"
      :key="item.id"
      :class="{
        'second-box': true,
        fullWidth: isProblemType,
        activeBox: checkId === item.id,
      }"
      @click="chooseArea(item)"
    >
      {{ item.name }}
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    checkId: {
      type: Number,
    },
    list: {
      type: Array,
      default: () => [],
    },
    isProblemType: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    chooseArea(data) {
      this.$emit('selectId', data);
    },
  },
};
</script>

<style>
.flex-box {
  display: flex;
  flex-wrap: wrap;
  height: 380rpx;
  overflow-y: auto;
}
.block-box {
  display: block;
}
.second-box {
  width: 222rpx;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  background-color: #f6f5f8;
  color: #474747;
  font-size: 24rpx;
  margin: 15rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fullWidth {
  width: 94%;
  margin: 15rpx auto;
}
.activeBox {
  background-color: #e1f4ff;
  color: #0093fd;
  position: relative;
}
.activeBox::before {
  content: '';
  width: 0;
  height: 0;
  border-top: 40rpx solid #0093fd;
  border-left: 40rpx solid transparent;
  position: absolute;
  right: 0;
  top: 0;
}
.activeBox::after {
  content: '√';
  color: #fff;
  position: absolute;
  right: 0;
  top: -27%;
}
</style>
