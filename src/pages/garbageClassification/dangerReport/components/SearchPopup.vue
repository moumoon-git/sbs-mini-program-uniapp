<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-18 09:46:32
 * @LastEditTime: 2022-04-01 15:49:43
-->
<template lang="">
  <van-popup :show="searchPopupShow" position="bottom" round :overlay="false">
    <view class="chose" @click="close">
      <view class="cancel">
        <text>取消</text>
      </view>
      <view class="sure" @click="handleSure">
       <text>确定</text>
      </view>
    </view>
    <view class="content-wrap">
      <van-search
        :value="search"
        shape="round"
        placeholder="搜索地点"
        @search="onSearch"
        @clear="handleClearSearch"
        ref="search"
      />
      <view class="list-wrap">
        <view class="list-box" v-for="(item, index) in list" :key="item.id">
          <view class="item" @click="handlePoint(item, index)">
            <view class="item_left">
              <view class="title">
                <text class="titleName overflow-ellipsis">{{
                  item.title
                }}</text>
              </view>
              <view class="place ">
                <van-icon name="location-o" />
                <text class="place-name overflow-ellipsis">{{
                  item.address
                }}</text>
              </view>
            </view>
            <view
              class="item_right"
              v-if="currentIndex == index ? true : false"
            >
              <van-icon name="success" style="color:green;" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </van-popup>
</template>
<script>
import { getLJWxPointList } from "@/apis/index.js";
import config from "@/static/config/index.js";
import store from "@/store";
export default {
  props: {
    searchPopupShow: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
  },
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      search: "",
      list: [],
      currentIndex: -1,
    };
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.handleAddress(this.address);
    });
  },
  methods: {
    close() {
      // 清空输入框
      setTimeout(() => {
        this.$refs.search.setData({ value: "" });
        this.list = [];
      }, 500);
      this.$emit("onClose");
      this.$store.commit("SET_SHOW", false);
    },
    /**
     * @description:确定按钮
     */
    handleSure() {
      this.$store.commit("SET_SHOW", false);
      console.log(this.$store.state.showMap);
    },
    /**
     * @description:取消按钮
     */
    handleClearSearch() {
      this.$refs.search.setData({ value: "" });
      this.list = [];
    },
    handlePoint(item, index) {
      this.currentIndex = index;
      console.log(item, "点击的值");
      this.$emit("setCenter", {
        longitude: item.location.lng,
        latitude: item.location.lat,
        address: item.address,
      });
    },
    /**
     * @description：地名搜索
     */
    onSearch(event) {
      this.search = event.detail;
      this.handleAddress(this.search);
    },
    /**
     * @description：获取根据地名搜索出来的数据
     */
    handleAddress(addr) {
      console.log('2')
      console.log(this.search, "this.search", this.address);
      wx.serviceMarket
        .invokeService({
          service: config.serviceId,
          api: config.apiName,
          data: {
            boundary: "region(广州,0)",
            page_size: "20",
            page_index: "1",
            keyword: addr?addr:this.address,
            orderby: "_distance",
          },
        })
        .then((res) => {
          this.list = res.data.data;
          console.log("invokeService success", this.list);
        })
        .catch((err) => {
          console.error("invokeService fail", err);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.chose {
  display: flex;
  justify-content: space-between;
  margin-bottom: 83rpx;
  .sure {
    display: flex;
    position: absolute;
    right: 27rpx;
    top: 14rpx;
    justify-content: center;
    align-items: center;
    border-radius: 10rpx;
    height: 80rpx;
    color: #0091fe;
    text-align: center;
    text{
      font-size:28rpx;
    }
  }
  .cancel {
    display: flex;
    position: absolute;
    left: 27rpx;
    top: 14rpx;
    justify-content: center;
    align-items: center;
    border-radius: 10rpx;
    width: 70rpx;
    height: 80rpx;
    text-align: center;
    text{
      font-size:28rpx;
    }
  }
}
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
      .item {
        display: flex;
        justify-content: space-between;
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
          // width: 90%;
          line-height: 60rpx;
          display: flex;
          align-items: center;
          .titleName{
            max-width:550rpx;
          }
        }
        .place {
          display: flex;
          color: #999999;
          font-size: 26rpx;
          .place-name {
            // width: 70%;
            max-width: 600rpx;
          }
        }
      }
    }
  }
}
</style>
