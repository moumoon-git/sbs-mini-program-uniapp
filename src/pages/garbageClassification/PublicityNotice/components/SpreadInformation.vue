<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-04-11 15:40:31
 * @LastEditTime: 2022-04-16 15:03:17
-->
<template>
  <view class="SpreadInformation">
    <scroll-view scroll-y="true" style="height: 100vh" @scrolltolower="lower">
      <section>
        <view class="list_item" v-for="item in PublicityEducationData" :key="item.id">
          <view class="concrete-time">{{ item.gmtCreate }}</view>
          <view class="content" @click="handleNavigate(item)">
            <view class="msg">
              <view class="img" v-if="item.image">
                <image :src="item.image"></image>
              </view>
              <view class="entry" v-else>
                <view class="prompt">{{ tabActive }}</view>
              </view>
            </view>
            <view class="remark">{{ item.title }}</view>
          </view>
        </view>
      </section>
    </scroll-view>
  </view>
</template>

<script>
import { debounce } from "@/utils/utils.js";
export default {
  name: "SpreadInformation",
  components: {},
  props: {
    PublicityEducationData: {
      type: Array,
    },
    tabActive: {
      type: String,
    },
    currentPage:{
      type:Number
    },
    totalPage:{
      type:Number,
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
     // 页面跳转
    handleNavigate(item) {
      uni.navigateTo({
        url: `/pages/garbageClassification/PublicityNotice/components/DetailedInformation`,
        success: (res) => {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('instanceEntitiesEvent', {
            data: {
              content:item
            },
          });
        },
        fail(err) {
          console.log(
            '%c [ err ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            err
          );
        },
      });
    },
    /**
     * @description:滑动加载页数
     */
    lower(e) {
      const debounceFn = debounce(() => {
        if (this.currentPage >= this.totalPage) {
          uni.showToast({
            title: "已加载完全部数据",
            icon: "none",
            duration: 2500,
          });
          return;
        }  
        uni.showLoading({
          title: "加载数据中...",
        });
        this.$emit('getPage')
      }, 500);
      debounceFn();
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.SpreadInformation {
    max-height: 83vh;
    overflow-y: scroll;
  section {
    .list_item {
      margin: 40rpx auto;
      width: 94%;
      .concrete-time {
        text-align: center;
        font-size: 22rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 30rpx;
      }
      .content {
        margin-top: 24rpx;
        background-color: #fff;
        .msg {
          .img {
            image {
              width: 100%;
            }
          }
          .entry {
            width: 705rpx;
            height: 285rpx;
            background: linear-gradient(330deg, #2b80ff 0%, #65bcff 100%);
            .prompt {
              padding: 71rpx 0;
              text-align: center;
              display: flex;
              justify-content: center;
              height: 124rpx;
              font-size: 90rpx;
              font-family: AlibabaPuHuiTiH;
              color: #ffffff;
              line-height: 124rpx;
            }
          }
        }
        .remark {
          padding-left: 29rpx;
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 100rpx;
        }
      }
    }
    // background-color: #fff;
  }
}
</style>
