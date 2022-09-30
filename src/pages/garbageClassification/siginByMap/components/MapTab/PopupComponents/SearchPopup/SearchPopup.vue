<template lang="">
  <van-popup :show="searchPopupShow" position="bottom" @close="close">
    <view class="content-wrap">
      <van-search
        :value="search"
        shape="round"
        placeholder="请搜索关键字"
        @search="onSearch"
        ref="search"
      />
      <view class="list-wrap">
        <view
          class="list-box"
          v-for="(item, index) in list"
          :key="index"
          @click="toPoint(item)"
        >
          <image
            :src="
              item.status === 1
                ? imgStaticUrl + '/img/inspection/haveInspected.png'
                : imgStaticUrl + '/img/inspection/toBeInspected.png'
            "
            class="img-tag"
          ></image>
          <view class="title ">
            <text class="overflow-ellipsis" style="flex: 1;">{{
              item.name
            }}</text>
          </view>
          <view class="place ">
            <van-icon name="location-o" />
            <text class="place-name overflow-ellipsis">{{ item.place }}</text>
          </view>
        </view>
      </view>
    </view>
  </van-popup>
</template>
<script>
import { getLJWxPointList } from '@/apis/index.js';
import { wgs84togcj02 } from '@/utils/mapTransformApi.js';
export default {
  props: {
    searchPopupShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      search: '',
      list: [],
    };
  },
  computed: {},
  methods: {
    close() {
      // 清空输入框
      setTimeout(() => {
        this.$refs.search.setData({ value: '' });
        this.list = [];
      }, 500);
      this.$emit('onClose');
    },
    onSearch(event) {
      getLJWxPointList(event.detail).then((res) => {
        if (res.data.code === 0) {
          this.list = res.data.data;
        }
      });
    },
    toPoint(item) {
      let [mglng, mglat] = wgs84togcj02(item.longitude, item.latitude);
      this.$emit('setCenter', {
        longitude: mglng,
        latitude: mglat,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content-wrap {
  .list-wrap {
    max-height: 400rpx;
    overflow-y: auto;
    .list-box {
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      border-radius: 2px;
      padding: 0 20rpx;
      width: 710rpx;
      height: 140rpx;
      margin: 0 auto;
      margin-bottom: 20rpx;
      background-color: #fff;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .img-tag {
        position: absolute;
        right: 0;
        top: 0;
        width: 90rpx;
        height: 90rpx;
      }
      .overflow-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
      }
      .title {
        font-size: 30rpx;
        width: 90%;
        line-height: 60rpx;
        display: flex;
        align-items: center;
      }
      .place {
        display: flex;
        color: #999999;
        font-size: 26rpx;
        .place-name {
          width: 70%;
        }
      }
    }
  }
}
</style>
