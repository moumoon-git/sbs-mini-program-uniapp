<!--
 * @Author: your name
 * @Date: 2021-12-01 11:23:55
 * @LastEditTime: 2021-12-03 16:24:04
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sbs-mini-program-uniapp\src\pages\garbageClassification\siginByMap\components\SignRecord\components\SignDetail.vue
-->
<template>
  <view class="signDetail">
    <view
      class="userInfo"
      :style="{
        background: `url(${imgStaticUrl}/img/map/detailHeader.png)`,
        backgroundSize: `${cover}`,
      }"
    >
      <image :src="fileHost + avatar" mode="" class="avatar"></image>
      <view class="user">
        <view class="username">{{ name }}</view>
        <view class="role">{{ `${workUnit}/${position}` }}</view>
      </view>
    </view>
    <view class="sign-header">
      <view>{{ nowTime }}</view>
      <view>
        <text class="sign-num">签到次数:</text>
        <text>{{ dataList.length }}</text>
      </view>
    </view>
    <section class="sign-box" v-if="dataList.length > 0">
      <view class="item-two">
        <block v-for="(item, index) in dataList" :key="index">
          <view class="timeline">
            <view class="bigCircle">
              <view class="circle">
                <text class="num">{{ dataList.length - index }}</text>
              </view>
            </view>

            <view class="timeline-content">
              <view class="sign-list">
                <view class="time"> {{ item.clockInTime || '' }}</view>
                <view class="inspectAddress">{{ item.remark || '' }}</view>
                <view class="imgList">
                  <view class="card" v-for="(v, i) in item.imgList" :key="i">
                    <van-image
                      width="200rpx"
                      height="200rpx"
                      :src="fileHost + v.url"
                      :data-src="fileHost + v.url"
                      @click="handlePreviewImage"
                    />
                  </view>
                </view>
                <view class="signAddress">
                  <van-icon name="location-o" />
                  <text class="overflow-ellipsis">
                    {{ item.place || '暂无地址' }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </block>
      </view>
    </section>
    <block v-else>
      <van-empty class="empty" description="暂无数据" />
    </block>
  </view>
</template>

<script>
import config from '@/static/config/index.js';
import { getSignDetail } from '@/apis/index.js';
export default {
  data() {
    return {
      id: '',
      fileHost: config.fileHost,
      avatar: '',
      tagImg: '',
      dataList: [],
      contactId: '',
      mailContactorEntity: {},
      name: '',
      workUnit: '',
      position: '',
      nowTime: '',
      imgStaticUrl: this.$imgStaticUrl,
      cover: 'cover',
    };
  },
  onLoad(options) {
    this.id = options.id;
    console.log(this.id);
    const eventChannel = this.getOpenerEventChannel(); // 兼容APP-NVUE
    if (Object.keys(eventChannel).length) {
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('instanceEntitiesEvent', (data) => {
        console.log(data);
        this.contactId = data.data.contactId;
        this.mailContactorEntity = data.data.mailContactorEntity;
        this.avatar = this.mailContactorEntity.images;
        this.position = this.mailContactorEntity.position;
        this.workUnit = this.mailContactorEntity.workUnit;
        this.name = data.data.name;
        if (data.data.currentIndex == 0) {
          this.nowTime = data.data.currentTime;
        } else if (data.data.currentIndex == 1) {
          this.nowTime = data.data.weekTime;
        } else {
          this.nowTime = data.data.monthTime;
        }
      });
    }
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      getSignDetail({
        contactId: this.id,
      }).then((res) => {
        if (res.data.code === 0) {
          this.dataList = res.data.data;
        }
        console.log(res, 'res');
      });
    },
    // 预览图片
    handlePreviewImage(event) {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        event
      );
      wx.previewImage({
        current: event.currentTarget.dataset.src, // 当前显示图片的http链接
        urls: [event.currentTarget.dataset.src], // 需要预览的图片http链接列表
      });
    },
  },
};
</script>

<style lang="less" scoped>
.signDetail {
  padding-top: 20rpx;
  box-sizing: border-box;
  .userInfo {
    height: 210rpx;
    box-shadow: 0px 4px 40px -10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    align-items: center;
    position: relative;
    width: 710rpx;
    margin-left: 20rpx;
    .avatar {
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      position: absolute;
      margin-left: 20rpx;
      margin-top: 10rpx;
    }
    .user {
      font-size: 30rpx;
      position: absolute;
      margin-left: 200rpx;
      margin-top: -20rpx;
      color: #ffffff;
      .username {
        margin-bottom: 10rpx;
      }
      .img-tag {
        width: 80rpx;
        height: 80rpx;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
  .sign-header {
    margin: 40rpx 0 20rpx 0;
    display: flex;
    justify-content: space-between;
    padding: 0 20rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: #969799;
    .sign-num {
      margin-right: 10rpx;
    }
  }

  .sign-box {
    box-sizing: border-box;
    height: calc(100vh - 209rpx);
    overflow-y: auto;
    padding: 0 20rpx;
    .item-two {
      position: relative;
      width: 100%;
      min-height: 400rpx;
      box-sizing: border-box;
      padding: 0 32rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      padding-top: 26rpx;
      padding-bottom: 50rpx;
      font-size: 24rpx;
      box-shadow: 0px 4px 40px -10px rgba(0, 0, 0, 0.1);
      margin-top: 36rpx;
      .timeline {
        background: #fff;
        width: 100%;
        .bigCircle:not(first-child) {
          margin-top: 8rpx;
        }
        .bigCircle {
          border-radius: 50%;
          display: flex;
          margin-left: -15rpx;
          width: 64rpx;
          height: 64rpx;
          background: rgba(22, 200, 139, 0.2);
          margin-bottom: 8rpx;
          .circle {
            width: 44rpx;
            height: 44rpx;
            background: rgba(22, 200, 139, 0.8);
            border-radius: 50%;
            display: flex;
            position: absolute;
            margin-left: 10rpx;
            margin-top: 10rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            .num {
              padding: 4rpx 8rpx;
              color: #ffffff;
            }
          }
        }
        .timeline-content {
          position: relative;
          margin-left: 16rpx;
          border-left: 2rpx solid rgba(22, 200, 139, 0.2);
          min-height: 160rpx;
          .sign-list {
            transform: translate(0, -65rpx);
            min-height: 50rpx;
            padding-bottom: 30rpx;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            .time {
              width: 100%;
              padding-left: 55rpx;
              font-size: 30rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #323233;
            }
            .inspectAddress {
              margin-top: 10rpx;
              width: 100%;
              padding-left: 55rpx;
              font-size: 30rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #969799;
              max-width: 603rpx;
              word-wrap: break-word;
              word-break: normal;
              overflow-y: auto;
            }
            .imgList {
              padding-left: 55rpx;
              width: 100%;
              max-height: 217rpx;
              background: #fff;
              --tab-font-size: 32rpx;
              box-sizing: border-box;
              display: flex;
              overflow-x: auto;
              margin-top: 20rpx;
              margin-bottom: 15rpx;
              .card {
                display: inline-block;
                font-weight: 400;
                color: #646566;
                margin: 0rpx 10rpx 0px 0px;
              }
            }
            .signAddress {
              width: 100%;
              max-width: 603rpx;
              padding-left: 55rpx;
              font-size: 30rpx;
              font-weight: 400;
              color: #969799;
              word-wrap: break-word;
              word-break: normal;
              overflow-y: auto;
              // .overflow-ellipsis {
              //   max-width: 230rpx;
              // }
            }
          }
        }
      }
    }

    .item-two .timeline:last-child .timeline-content {
      border: none !important;
    }
  }
}
</style>
