<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-18 09:39:40
 * @LastEditTime: 2022-03-31 15:24:24
-->
<template>
  <view class="content">
    <map
      id="map"
      class="map"
      :show-location="true"
      :latitude="latitude"
      :longitude="longitude"
      @poitap="mapClick"
    ></map>
    <SearchPopup
      ref="searchPopup"
      :searchPopupShow="searchPopupShow"
      :address="address"
      @setCenter="setCenter"
    ></SearchPopup>
  </view>
</template>

<script>
import SearchPopup from "./SearchPopup";
export default {
  components: {
    SearchPopup,
  },
  props: {
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
      _mapContext: null,
      pointList: [],
      searchPopupShow: true,
    };
  },
  mounted() {
    this._mapContext = uni.createMapContext("map", this);
    // 仅调用初始化，才会触发 on.("markerClusterCreate", (e) => {})
    this._mapContext.initMarkerCluster({
      enableDefaultStyle: true, //使用默认样式聚合点
      zoomOnClick: false,
      gridSize: 60,
      success(res) {
        console.log("success", res);
      },
      fail(res) {
        console.log("fail", res);
      },
      complete(res) {
        console.log("initMarkerCluster", res);
      },
    });

    setTimeout(() => {
      this._mapContext.on("markerClusterCreate", (e) => {
        console.log("markerClusterCreate", e);
      });
      this._mapContext.on("markerClusterClick", (res) => {
        console.log(res, "111111");
        let markerIds = res.cluster.markerIds.map((item) => item * 1);
      });
    });
    this.addMarkers();
  },
  methods: {
    async mapClick(e) {
      console.log(
        "%c [ xxx ]",
        "font-size:13px; background:pink; color:#bf2c9f;",
        "地图",
        e
      );

      let tempObj = {
        address: e.detail.name,
        ...e.detail,
      };
      console.log(tempObj, "tempObj");
      this.$nextTick(() => {
        this.setCenter(tempObj);
      });
      await this.$refs.searchPopup.handleAddress(e.detail.name);
    },
    setCenter(item) {
      this.pointList = [];
      let obj = {
        longitude: item.longitude,
        latitude: item.latitude,
      };
      this.pointList.push(obj);
      this.addMarkers();
      this._mapContext.moveToLocation({
        longitude: item.longitude,
        latitude: item.latitude,
      });
      this.$emit("getAddressData", item);
    },
    addMarkers() {
      console.log(
        "%c [ pointList ]",
        "font-size:13px; background:pink; color:#bf2c9f;",
        this.pointList
      );
      this._mapContext.addMarkers({
        markers: this.pointList,
        clear: true,
        complete(res) {
          console.log("addMarkers", res);
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 100vh;
  background: #f5f5f5;
  position: relative;
  .map {
    width: 100%;
    height: calc(100vh - 89rpx);
  }
}
</style>
