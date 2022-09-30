<template>
  <view class="content">
    <map
      id="map"
      class="map"
      :show-location="true"
      :latitude="latitude"
      :longitude="longitude"
      @markertap="markertap"
      @anchorpointtap="mapClick"
    ></map>
    <!-- <view class="illustration">
      <view class="little-box" @click="showHandler">图例说明</view>
      <view v-show="showIntro" class="introduce-book">
        <view class="book-item" v-for="(item, index) in introduce" :key="index">
          <image :src="item.img" mode=""> </image>
          <view>
            <view class="title">{{ item.name }}</view>
            <view v-if="item.desc" class="desc">{{ item.desc }}</view>
          </view>
        </view>
      </view>
    </view> -->

    <view class="signin-icon-box">
      <view class="little-box" @click="showHandler('signPopupShow')">
        <van-icon name="sign" />
        <view style="font-size: 24rpx">签到</view>
        <view class="number-box">{{ recordList.length }}</view>
      </view>
    </view>

    <view class="search-icon-box">
      <view @click="showHandler('searchPopupShow')">
        <van-icon name="search" />
        <view style="font-size: 24rpx">查询</view>
      </view>
    </view>

    <view class="othen-box">
      <view class="top" @click="currentPoint">
        <van-icon name="aim" />
        定位
      </view>
      <view class="bottom" @click="showHandler('introducePopupShow')">
        <van-icon name="info-o" />
        图例
      </view>
    </view>

    <PointPopup
      :popupShow="popupShow"
      :detailList="detailList"
      @onClose="onClose('popupShow')"
    ></PointPopup>

    <SignPopup
      :signPopupShow="signPopupShow"
      :address="address"
      :latitude="latitude"
      :longitude="longitude"
      :recordList="recordList"
      @onClose="onClose('signPopupShow')"
      @pushRecord="pushRecord"
    ></SignPopup>

    <IntroducePopup
      :introducePopupShow="introducePopupShow"
      @onClose="onClose('introducePopupShow')"
    ></IntroducePopup>

    <SearchPopup
      :searchPopupShow="searchPopupShow"
      @onClose="onClose('searchPopupShow')"
      @setCenter="setCenter"
    ></SearchPopup>
  </view>
</template>

<script>
import PointPopup from './PopupComponents/PointPopup/PointPopup.vue';
import SignPopup from './PopupComponents/SignPopup/SignPopup.vue';
import IntroducePopup from './PopupComponents/IntroducePopup/IntroducePopup.vue';
import SearchPopup from './PopupComponents/SearchPopup/SearchPopup.vue';
import { getRecordList } from '@/apis/index.js';

export default {
  components: {
    PointPopup,
    SignPopup,
    IntroducePopup,
    SearchPopup,
  },
  props: {
    pointList: {
      type: Array,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    address: {
      type: String,
    },
  },
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      showIntro: false,
      popupShow: false,
      detailList: [],
      signPopupShow: false,
      introducePopupShow: false,
      recordList: [],
      _mapContext: null,
      searchPopupShow: false,
    };
  },

  mounted() {
    this._mapContext = uni.createMapContext('map', this);
    // 设置定位点样式
    // this._mapContext.setLocMarkerIcon({
    //   iconPath: this.imgStaticUrl + '/img/map/current-point.png',
    // });
    // 仅调用初始化，才会触发 on.("markerClusterCreate", (e) => {})
    this._mapContext.initMarkerCluster({
      enableDefaultStyle: true, //使用默认样式聚合点
      zoomOnClick: false,
      gridSize: 60,
      success(res) {
        console.log('success', res);
      },
      fail(res) {
        console.log('fail', res);
      },
      complete(res) {
        console.log('initMarkerCluster', res);
      },
    });

    setTimeout(() => {
      this._mapContext.on('markerClusterCreate', (e) => {
        console.log('markerClusterCreate', e);
      });
      this._mapContext.on('markerClusterClick', (res) => {
        console.log(res, '111111');
        let markerIds = res.cluster.markerIds.map((item) => item * 1);
        this.detailList = this.pointList.reduce((acc, cur) => {
          if (markerIds.includes(cur.id)) {
            acc.push(cur);
          }
          return acc;
        }, []);
        this.popupShow = true;
      });
    });

    // this.addMarkers(this.pointList);
    this.getRecordListWrap();
  },
  methods: {
    // 获取打卡记录
    getRecordListWrap() {
      getRecordList().then((res) => {
        console.log(
          '%c [ xxx ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          res
        );
        this.recordList = [];
        if (res.data.code === 0) {
          res.data.data.forEach((item) => {
            this.recordList.push({
              time: item.clockInTime.split(' ')[1],
              id: item.id,
            });
          });
        }
      });
    },
    // 打卡签到提交后的回调 将一条打卡记录推入
    pushRecord(data) {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        data
      );
      this.recordList.push(data);
    },
    mapClick(e) {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        e
      );
    },
    currentPoint() {
      this._mapContext.moveToLocation({
        longitude: this.longitude,
        latitude: this.latitude,
      });
    },
    setCenter(item) {
      this._mapContext.moveToLocation({
        longitude: item.longitude,
        latitude: item.latitude,
      });
    },

    onClose(popupShowKey) {
      this[popupShowKey] = false;
    },
    showHandler(popupShowKey) {
      this[popupShowKey] = true;
    },

    // 地图标记点点击事件
    markertap(e) {
      console.log(123, e);
      this.detailList = this.pointList.filter((item) => {
        return item.id === e.detail.markerId;
      });
      this.popupShow = true;
    },
    addMarkers(pointList) {
      console.log(
        '%c [ pointList ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        pointList
      );
      this._mapContext.addMarkers({
        markers: pointList,
        clear: false,
        complete(res) {
          console.log('addMarkers', res);
        },
      });
    },
  },
};
</script>

<style lang="less">
.content {
  position: relative;
  .map {
    width: 100%;
    height: calc(100vh - 89rpx);
  }
  .signin-icon-box {
    display: flex;
    position: absolute;
    right: 27rpx;
    top: 50rpx;
    justify-content: center;
    align-items: center;
    border-radius: 10rpx;
    width: 70rpx;
    height: 80rpx;
    background-color: #fff;
    text-align: center;
    .number-box {
      position: absolute;
      right: -6rpx;
      top: -6rpx;
      border-radius: 50%;
      width: 30rpx;
      height: 30rpx;
      background-color: #07c160;
      line-height: 30rpx;
      text-align: center;
      font-size: 20rpx;
      color: #fff;
    }
  }
  .search-icon-box {
    display: flex;
    position: absolute;
    right: 27rpx;
    top: 147rpx;
    justify-content: center;
    align-items: center;
    border-radius: 10rpx;
    width: 70rpx;
    height: 80rpx;
    background-color: #fff;
    text-align: center;
  }
  .othen-box {
    display: flex;
    position: absolute;
    right: 27rpx;
    bottom: 50rpx;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    width: 66rpx;
    height: 194rpx;
    background: #fff;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    font-size: 24rpx;
    .top,
    .bottom {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
    .top {
      border-bottom: 1px solid #eee;
    }
  }
  .illustration {
    position: absolute;
    right: 118rpx;
    top: 50rpx;
    width: 500rpx;
    .little-box {
      display: flex;
      position: absolute;
      right: 0;
      top: 0;
      align-items: center;
      border-radius: 5px;
      width: 73rpx;
      height: 100rpx;
      background-color: #fff;
      text-align: center;
      font-size: 26rpx;
      color: #646566;
      transform: translateX(100%);
    }
    .introduce-book {
      padding: 0 40rpx;
      background-color: #fff;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
      .book-item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #dcdee0;
        width: 100%;
        height: 120rpx;
        image {
          margin-right: 15rpx;
          width: 64rpx;
          height: 64rpx;
        }
        .title {
          font-size: 26rpx;
        }
        .desc {
          font-size: 22rpx;
          color: #969799;
        }
      }
      .book-item::last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
