<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-02-16 10:34:33
 * @LastEditTime: 2022-02-17 14:03:29
-->
<template>
  <view class="EditTick">
    <title-box
      v-if="
        inspectionTaskItems.investigationInforName &&
        inspectionTaskItems.investigationInforContent
      "
      :inspectionTaskItems="inspectionTaskItems"
      :isExpand="isExpand"
      @click="expand"
    />
    <view class="see-box" v-show="isExpand_temp && isSeeMode">
      <view class="result-card maring-box">
        <view>是否存在问题</view>
        <view
          v-show="editData.status === '1'"
          class="no-select"
          :style="
            editData.status === '1'
              ? 'border-color: rgb(22, 200, 139); color: rgb(22, 200, 139);'
              : ''
          "
        >
          否
          <van-icon class="icon" name="checked" style="color: #19be6b" />
        </view>
        <view
          class="select"
          v-show="editData.status === '0'"
          :style="
            editData.status === '0'
              ? 'border-color: rgb(246, 110, 110); color: rgb(246, 110, 110);'
              : ''
          "
        >
          是
          <van-icon class="icon" name="clear" style="color: #fa7e7e" />
        </view>
      </view>
      <view class="remark-card maring-box">
        <view>情况说明</view>
        <view class="remark-content">{{ editData.remark || "" }}</view>
      </view>
      <view class="img-card maring-box">
        <view>拍照说明</view>
        <image
          :src="fileHost + item.url"
          v-for="item in editData.documentList"
          :key="item.url"
          class="image-see"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>
import TitleBox from "../TitleBox/TitleBox.vue";
import config from "@/static/config/index.js";
export default {
  props: {
    isExpand: {
      type: Boolean,
      default: false,
    },
    inspectionTaskItems: {
      type: Object,
    },
    editData: {
      type: Object,
    },
    index: {
      type: Number,
    },
    isSeeMode: {
      type: Boolean,
    },
  },
  data() {
    return {
      isShow: false,
      fileHost: config.fileHost,
    };
  },
  computed: {
    isEmptyTick() {
      return (
        !this.inspectionTaskItems.investigationInforName &&
        !this.inspectionTaskItems.investigationInforContent
      );
    },
    isExpand_temp() {
      if (this.isEmptyTick) {
        return true;
      } else {
        return this.isExpand;
      }
    },
  },
  components: {
    TitleBox,
  },
  mounted() {
    console.log(this.inspectionTaskItems);
  },
  methods: {
    expand() {
      console.log(this.inspectionTaskItems);
      this.$emit("expand", this.index);
    },
  },
};
</script>

<style lang="less">
.EditTick {
  width: 94%;
  margin: 0 auto;
  background-color: #fff;
  overflow: hidden;
}
.other {
  width: 630rpx;
  margin: 0rpx auto;
  padding-bottom: 20rpx;
}
.radio-btn-group {
  display: flex;
  margin-top: 20rpx;
}
.select {
  width: 210rpx;
  height: 78rpx;
  line-height: 78rpx;
  font-size: 28rpx;
  border-radius: 8rpx;
  margin-right: 15rpx;
  text-align: center;
  position: relative;
  margin-top: 14rpx;
  background: rgba(211, 40, 40, 0.1);
  border: 2px solid #fa7e7e;
  color: #f66e6e;
}
.no-select {
  width: 210rpx;
  height: 78rpx;
  line-height: 78rpx;
  color: #16c88b;
  font-size: 28rpx;
  border-radius: 8rpx;
  margin-right: 15rpx;
  text-align: center;
  position: relative;
  margin-top: 14rpx;
  background: rgba(22, 200, 139, 0.1);
  border: 2px solid #16c88b;
}
.icon {
  position: absolute;
  right: -6px;
  bottom: -6px;
}
.pic-box {
  border-bottom: 1px solid #dddddd;
}
.more-information {
  display: flex;
  justify-content: center;
  color: #0091ff;
}

.maring-box {
  margin: 50rpx 0;
}
.see-box {
  width: 90%;
  margin: 50rpx auto;
  .remark-content {
    border-bottom: 1px solid #dddddd;
    height: 60rpx;
    display: flex;
    align-items: center;
  }
  .img-card {
    min-height: 160rpx;
    .image-see {
      width: 160rpx;
      height: 160rpx;
      margin-right: 20rpx;
    }
  }
}
</style>
