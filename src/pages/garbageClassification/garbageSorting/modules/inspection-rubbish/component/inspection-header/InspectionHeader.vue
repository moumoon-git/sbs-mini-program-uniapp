<template>
  <view class="header">
    <view class="header-title" @click="expand">
      <text :class="titleParams.type?'tag':'tag1'">{{titleParams.type}}</text>
      <view
        class="overflow-ellipsis"
        style="max-width: 357rpx;margin-right: 10rpx;"
      >
        {{ titleParams.name }}</view
      >
      <van-icon v-if=" titleParams.start" name="star" style="color: #FDE689" />
      <van-icon :name="isExpand ? 'arrow-up' : 'arrow-down'" class="ml-auto" />
    </view>

    <view class="detail" v-show="isExpand">
      <view class="tab-panel">
        <view   
        class="card"
        v-for="(v, i) in (titleParams.img)"
        :key="i">
          <van-image
            width="200rpx"
            height="200rpx"
            :src="fileHost + v.vcUrl"
            :data-src="fileHost + v.vcUrl"
          />
        </view>
      </view>
      <view v-for="(item,index) in (titleParams.list)" :key="index">
        <view class="list-box">
          <text>{{ item.title }}</text>
          <text>{{ item.dec }}</text>
          <text v-if="(item.title=='地址:' || item.title=='地址：') && isUpdateAddress" style="color: #0091FF;" @click="handleUpdateAddress">更新</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import config from '@/static/config/index.js';
import { getLocation } from '@/utils/hooks/useHooks.js';

export default {
  props: {
    titleParams: {
      type: Object,
      default: () => ({
        name: '',
        type:'',
        img:[],
        start:'',
        list:[
          {
            title:'',
            dec:''
          },
        ]
      }),
    },
  },
  data() {
    return {
      isExpand: false,
      fileHost: config.fileHost,
      isUpdateAddress: wx.getStorageSync('GXZDWZ')
    };
  },
  mounted(){
    console.log(this.titleParams,'titleParams')
  },
  methods: {
    expand() {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        123
      );
      this.isExpand = !this.isExpand;
    },
    handleUpdateAddress() {
      let that = this;
      getLocation().then((res)=>{
        console.log('getLocation res', res);
        that.$parent.titleParams.longitude = res.longitude || wx.getStorageSync('longitude');
        that.$parent.titleParams.latitude = res.latitude || wx.getStorageSync('latitude');
        that.$parent.titleParams.address = res.address.toString() || wx.getStorageSync('address');

          that.$http.post({
              url: `/garbageSorting/point/updatePlace`,
              data: {
                id: that.titleParams.id,
                place: that.$parent.titleParams.address,
                longitude: that.$parent.titleParams.longitude,
                latitude: that.$parent.titleParams.latitude,
                pointTypeNum: that.titleParams.pointType,
              }
          })
          .then(({ data }) => {
              console.log(`/garbageSorting/point/updatePlace data`, data);
              if (data.code === 0) {
                wx.showToast({
                    title: '更新位置成功',
                    icon: 'success',
                });

                for(let i=0;i<that.titleParams.list.length;i++) {
                  if(that.titleParams.list[i].title.search('地址')!=-1) {
                    that.$parent.titleParams.list[i].dec = that.$parent.titleParams.address;
                    break;
                  }
                }
                that.$nextTick(() => {
                  let active = that.$parent.active;
                  if(that.$parent.$refs[active] && that.$parent.$refs[active][0].$refs.LocationBox) {
                    that.$parent.$refs[active][0].$refs.LocationBox.refresh(that.$parent.titleParams);
                  }
                });
              } else {
                  wx.showToast({
                      title: data.msg,
                      icon: 'error',
                  });
              }
          });
      })  
    }
  },
};
</script>
<style lang="less" scoped>
.header {
  width: 96%;
  margin: 20rpx auto;
  background-color: #fff;
  .header-title {
    display: flex;
    align-items: center;
    padding-right: 15rpx;
    height: 73rpx;
    border-radius: 5px;
    color: #555555;
    font-size: 26rpx;
    .overflow-ellipsis {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
    .tag {
      color: #fff;
      background-color: #70b603;
      padding: 10rpx;
      font-size: 20rpx;
      margin: 0 20rpx;
    }
    .tag1{
      font-size: 20rpx;
      margin: 0 10rpx;
    }
    .detail-btn {
      color: #fff;
      background-color: #0090fe;
      padding: 10rpx 35rpx;
      font-size: 23rpx;
      margin-left: auto;
      margin-right: 20rpx;
      border-radius: 5px;
    }
    .ml-auto {
      font-size: 35rpx;
      margin-left: auto;
    }
  }

  .detail {
    font-size: 24rpx;
    color: #7f7f7f;
    width: 94%;
    margin: 0 auto;
    .tab-panel {
      width: 100%;
      max-height: 217rpx;
      background: #fff;
      --tab-font-size: 32rpx;
      box-sizing: border-box;
      display: flex;
      overflow-x: auto;
      .card {
        display: inline-block;
        font-weight: 400;
        color: #646566;
        margin: 0rpx 10rpx 0px 0px;
      }
    }
    .list-box {
      height: 68rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e1e1e1;
      & text:nth-of-type(2) {
        max-width: 230px;
      }
      & text:last-child{
        word-wrap: break-word;
        word-break: normal;
        max-width: 445rpx;
        overflow-y: auto;
        max-height: 70rpx;
      }
    }
    .list-box:last-child {
      border-bottom: none;
    }
  }
}
</style>
