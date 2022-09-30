<template>
  <view class="siginByMap">
    <van-tabs color="#3F8EF7">
      <van-tab title="签到地图">
        <MapTab
          v-if="pointList !== null"
          :pointList="pointList"
          :latitude="latitude"
          :longitude="longitude"
          :address="address"
          ref="MapTab"
        ></MapTab>
      </van-tab>
      <van-tab title="巡查点列表">
        <PointListTab
          :pointList="pointList"
          :hasInspectedNum="hasInspectedNum"
          :unInspectedNum="unInspectedNum"
        ></PointListTab>
      </van-tab>
    </van-tabs>
  </view>
</template>

<script>
import MapTab from './components/MapTab/MapTab.vue';
import PointListTab from './components/PointListTab.vue';
import { getCGWxPointList } from '@/apis/index.js';
import { getDistance } from '@/utils/utils.js';
import { wgs84togcj02 } from '@/utils/mapTransformApi.js';
import { getLocation } from '@/utils/hooks/useHooks.js';
export default {
  components: {
    MapTab,
    PointListTab,
  },
   // 定义在created的数据非响应式数据 优化性能
  created() {
    this.time = null;
  },
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      pointList:  [],
      latitude: 23.099994,
      longitude: 113.32452,
      address: '',
      unInspectedNum: 0,
      hasInspectedNum: 0,
    };
  },
  async onShow() {
    this.t = 20;
    this.l = 0;
    this.r = this.l + this.t;
    
    clearInterval(this.time);
    this.time = null;
    this.pointList = [];

    this.unInspectedNum = 0;
    this.hasInspectedNum = 0;
    await this.refreshLocation();
    let request={
      search:'',
    }
    let headers = {
      "content-type": "application/x-www-form-urlencoded",
      token: wx.getStorageSync("token"),
    };
    getCGWxPointList(request,headers).then((res1) => {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        res1
      );
      if (res1.data.code === 0) {
        console.log(res1.data.data,'res1.data.data')
        this.pointList = res1.data.data;
        let length = this.pointList.length;
        this.time = setInterval(() => {
          if (this.r >= length) {
            this.r = length;
            this.$refs.MapTab.addMarkers(
              this.dataProcess(this.pointList, this.l, this.r)
            );
            clearInterval(this.time);
            this.time = null;
            return;
          }
          this.$refs.MapTab.addMarkers(
            this.dataProcess(this.pointList, this.l, this.r)
          );
          this.l = this.r;
          this.r = this.r + this.t;
        },1000)
      }
    });
  },
  methods: {
    // 处理数据
    dataProcess(pointList, l, r) {
      const marker = {
        width: 30,
        height: 30,
        joinCluster: true, // 指定了该参数才会参与聚合
      };
      const pointMarkers = [];
      for (let i = l; i < r; i++) {
        let item = pointList[i];

        if (!item.longitude) {
          console.log(
            '%c [ 经度 ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            item
          );
          return;
        }
        let [mglng, mglat] = wgs84togcj02(item.longitude, item.latitude);
        item.longitude = mglng;
        item.latitude = mglat;
        // item.titleTag = this.pointTypeFactory(item.pointType, item.type);
        const { isInArea, distance } = this.getDis(item);
        item.isInArea = isInArea;
        console.log(
          '%c [ distance ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          distance
        );
        item.distance = distance;
        Object.assign(item, marker);

        if (item.status == '1') {
          this.hasInspectedNum++;
          item.iconPath = this.imgStaticUrl + '/img/map/map-green-point.png';
        } else if (item.status == '0') {
          this.unInspectedNum++;
          if (!item.isInArea) {
            item.iconPath = this.imgStaticUrl + '/img/map/map-gray-point.png';
          } else {
            item.iconPath = this.imgStaticUrl + '/img/map/map-blue-point.png';
          }
        }
        pointMarkers.push(item);
      }

      return pointMarkers;
    },
    // // 转换是什么类型的巡查点
    // pointTypeFactory(pointType, type) {
    //   const textMap = [
    //     ['定时投放点', '误时投放点'],
    //     ['厨余收运点'],
    //     ['机关单位'],
    //     ['普通收运点'],
    //     ['居住小区'],
    //   ];
    //   return textMap[pointType][type ? type : 0];
    // },

    async refreshLocation() {
      const { longitude, latitude, address } = await getLocation(true);
      this.latitude = latitude;
      this.longitude = longitude;
      this.address = address;
    },
    getDis(otherPoint) {
      const distance = getDistance(
        this.latitude,
        this.longitude,
        otherPoint.latitude,
        otherPoint.longitude
      );
      return {
        isInArea: distance <= otherPoint.clockInRange / 1000,
        distance: Number(distance).toFixed(2),
      };
    },
  },
};
</script>

<style>
.siginByMap {
  height: 100vh;
  background: #f5f5f5;
}
</style>
