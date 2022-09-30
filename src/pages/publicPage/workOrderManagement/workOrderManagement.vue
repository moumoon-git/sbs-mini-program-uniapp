<template>
  <view class="container">
    <header>
      <view
        style="display: flex;justify-content: space-evenly;align-items: center;"
      >
        <text class="screen" @click="handleScreenNavigate">筛选</text>
        <van-search
          :value="keyword"
          shape="round"
          placeholder="请搜索关键词"
          @focus="handleSearchFocus"
        />
        <text style="color: #0091ff;" @click="toForwardPage">转发</text>
      </view>
      <!-- 		<view style="display: flex;justify-content: space-evenly;align-items: center;font-size: 28rpx;">
			<text class="disposing-status">处置中：{{disposingNumber}}</text>
			<text class="disposed-status">已处置：{{disposedNumber}}</text>
			<text class="cancelled-status">已取消：{{cancelledNumber}}</text>
		</view> -->
    </header>
    <section class="content">
      <van-tabs
        v-model:active="active"
        @change="handleTabChange"
        animated
        title-active-color="#0091FF"
      >
        <van-tab
          v-for="(tabItem, tabIndex) in tabList"
          :key="tabIndex"
          :name="tabItem.name"
          :title="`${tabItem.title} (${tabItem.total})`"
        >
          <block v-if="workOrderManagementList.length != 0">
            <view
              class="card"
              v-for="(item, index) in workOrderManagementList"
              :key="index"
              :data-id="item.id"
              @click="handleWorkOrderManagementDetailNavigate"
            >
              <i v-if="item.status == 0" class="card-status-icon disposing"></i>
              <i v-if="item.status == 1" class="card-status-icon disposed"></i>
              <i
                v-if="item.status == -1"
                class="card-status-icon cancelled"
              ></i>
              <view class="card-header">
                <text v-if="item.name" class="card-header-title">{{
                  item.name
                }}</text>
                <text v-if="item.workModuleString" class="card-header-type">{{
                  item.workModuleString
                }}</text>
              </view>
              <view class="card-content">
                <view>
                  <text
                    v-if="item.workPropertyString"
                    class="card-content-type"
                    >{{ item.workPropertyString }}</text
                  >
                  <text v-if="item.remark" class="card-content-text">{{
                    item.remark
                  }}</text>
                </view>
                <view class="annex">
                  <swiper
                    v-if="item.imgList.length != 0"
                    :indicator-dots="true"
                    :autoplay="true"
                    interval="3000"
                    duration="500"
                    :circular="true"
                  >
                    <block
                      v-for="(imgItem, imgIndex) in item.imgList"
                      :key="imgIndex"
                    >
                      <swiper-item>
                        <image
                          class="swiper-image"
                          :src="imgItem.allUrl"
                        ></image>
                      </swiper-item>
                    </block>
                  </swiper>
                  <view v-if="item.fileList.length != 0">
                    <text
                      v-for="(fileItem, fileIndex) in item.fileList"
                      :key="fileIndex"
                      class="annex-file"
                      >{{ fileItem.documentName }}、</text
                    >
                  </view>
                </view>
              </view>
              <view class="card-footer">
                <text v-if="item.gmtCreate" class="card-footer-date">{{
                  item.gmtCreate
                }}</text>
                <view v-if="item.workPlace" class="card-footer-address">
                  <i></i>
                  <text>{{ item.workPlace }}</text>
                </view>
              </view>
            </view>
          </block>
          <block v-else>
            <van-empty description="暂无数据" />
          </block>
        </van-tab>
      </van-tabs>
    </section>
  </view>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'workOrderManagement',
  props: {},
  data() {
    return {
      keyword: '', //搜索关键词
      workOrderManagementList: [], // 工单列表
      disposingNumber: 0,
      disposedNumber: 0,
      cancelledNumber: 0,
      active: 0, //当前选中tab的标识符
      orderProperty: {
        id: '',
        name: '请选择工单类别',
      }, // 工单类别
    };
  },
  onLoad(options) {},
  onShow() {
    // 获取当前小程序的页面栈
    let pages = getCurrentPages();
    // 数组中索引最大的页面--当前页面
    let currentPage = pages[pages.length - 1];
    this.orderProperty = currentPage.data.orderProperty;
    this.getWorkOrderManagementList();
    this.getWorkOrderManagementStatusStatistics();
  },
  computed: {
    tabList() {
      return [
        {
          title: '处置中',
          name: 0,
          total: this.disposingNumber,
        },
        {
          title: '已处置',
          name: 1,
          total: this.disposedNumber,
        },
        {
          title: '已取消',
          name: -1,
          total: this.cancelledNumber,
        },
      ];
    },
  },
  methods: {
    toForwardPage() {
      wx.navigateTo({
        url: `/pages/publicPage/workOrderManagement/modules/workOrderForward`,
      });
    },
    handleSearchFocus() {
      wx.navigateTo({
        url: `/pages/custom-components/search/search?searchType=workOrderManagement`,
      });
    },
    // 筛选跳转
    handleScreenNavigate(event) {
      wx.navigateTo({
        url: `/pages/custom-components/screen/screen?orderProperty=${JSON.stringify(
          this.orderProperty
        )}`,
      });
    },
    // 工单详情跳转
    handleWorkOrderManagementDetailNavigate(event) {
      wx.navigateTo({
        url: `/pages/publicPage/workOrderManagement/modules/workOrderManagement-detail?id=${event.currentTarget.dataset.id}`,
      });
    },
    getWorkOrderManagementList() {
      this.$http
        .post({
          url: '/work/workSheet/wechatList',
          data: {
            page: 1,
            limit: 1000,
            groupIds: [],
            startTime: '',
            endTime: '',
            module: '',
            property: String(this.orderProperty.id),
            status: String(this.active),
            type: '',
            search: '',
          },
        })
        .then(({ data }) => {
          console.log('/work/workSheet/wechatList data', data);
          this.workOrderManagementList = [];
          if (data.code == 0) {
            data.page.list.forEach((listItem) => {
              listItem.imgList = [];
              listItem.fileList = [];

              if (listItem.documentList !== null) {
                listItem.documentList.forEach((documentItem) => {
                  if (/(.png|.jpg)$/.test(documentItem.url)) {
                    listItem.imgList.push(documentItem);
                  } else {
                    listItem.fileList.push(documentItem);
                  }
                });
              }
            });
            this.workOrderManagementList = data.page.list;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    getWorkOrderManagementStatusStatistics() {
      this.$http
        .post({
          url: '/work/workSheet/wechatStatistics',
        })
        .then(({ data }) => {
          console.log('/work/workSheet/wechatStatistics data', data);
          if (data.code == 0) {
            this.disposingNumber = data.data.underDisposal;
            this.disposedNumber = data.data.completed;
            this.cancelledNumber = data.data.cancelled;
          }
        });
    },
    updateKeyword(value) {
      this.keyword = value;
    },
    // 当前tab改变时触发的回调函数
    handleTabChange(name, title) {
      console.log('handleTabChange name, title', name, title);
      this.active = name.detail.name;
      this.getWorkOrderManagementList();
      this.getWorkOrderManagementStatusStatistics();
    },
  },
});
</script>
<style lang="less">
page {
  height: 100%;
}
.container {
  height: 100%;
  display: block;
  padding: 0rpx;
  box-sizing: border-box;
  background: rgba(245, 245, 245, 0.8);
  header {
    background: #ffffff;
    .screen {
      color: #0091ff;
      position: relative;
      left: 14rpx;
    }
    van-search {
      width: 75%;
    }
    .van-dropdown-menu {
      box-shadow: initial;
    }
    .disposing-status {
      color: #f2b626;
    }
    .disposed-status {
      color: #0bd295;
    }
    .van-tabs__nav van-tabs__nav--line .van-ellipsis.van-tab {
      .van-ellipsis {
        color: red !important;
      }
    }
    .cancelled-status {
      color: #999999;
    }
  }
  .content {
    display: block;
    .van-tab__pane {
      height: calc(100vh - 200rpx);
    }
    .card {
      background: white;
      margin: 20rpx;
      box-sizing: border-box;
      padding: 0rpx 30rpx;
      border-radius: 15rpx;
      position: relative;
      .card-status-icon {
        background: url(https://z3.ax1x.com/2021/10/21/5sz0fO.png) no-repeat;
        width: 80rpx;
        height: 80rpx;
        display: inline-block;
        background-size: 450rpx 200rpx;
        position: absolute;
        right: 0%;
        top: 0%;
        &.disposing {
          background-position: -10rpx -32rpx;
        }
        &.disposed {
          background-position: -100rpx -32rpx;
        }
        &.cancelled {
          background-position: -188rpx -32rpx;
        }
      }
      .card-header {
        padding: 30rpx 0rpx;
        .card-header-title {
          color: #333333;
          font-weight: 800;
          font-size: 34rpx;
        }
        .card-header-type {
          color: #ff7a45;
          background: #ffbb96;
          border-radius: 20rpx;
          font-size: 24rpx;
          padding: 4rpx 12rpx;
          margin-left: 15rpx;
        }
      }
      .card-content {
        font-size: 28rpx;
        .card-content-type {
          color: #0091ff;
          background: #e6efff;
          border-radius: 20rpx;
          font-size: 26rpx;
          padding: 6rpx 18rpx;
        }
        .card-content-text {
          color: #666666;
          margin-left: 15rpx;
          line-height: 50rpx;
        }
        .annex {
          display: initial;
          margin-top: 10rpx;
          swiper {
            height: 350rpx;
            margin-bottom: 15rpx;
            .swiper-image {
              height: 100%;
              width: 100%;
            }
          }
          .annex-file {
            color: #0091ff;
            margin-right: 15rpx;
          }
        }
      }
      .card-footer {
        position: relative;
        padding: 25rpx 0rpx;
        color: #999999;
        font-size: 26rpx;
        display: flex;
        align-items: center;
        .card-footer-address {
          position: absolute;
          right: 0%;
          display: flex;
          align-items: center;
          i {
            background: url(https://z3.ax1x.com/2021/10/21/5sz0fO.png) no-repeat;
            width: 30rpx;
            height: 35rpx;
            display: inline-block;
            background-position: -55rpx -215rpx;
            background-size: 600rpx 300rpx;
            margin-right: 6rpx;
          }
          text {
            width: 330rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
