<!--
 * @Author: your name
 * @Date: 2021-11-17 19:09:53
 * @LastEditTime: 2022-02-10 15:37:39
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sbs-mini-program-uniapp\src\pages\garbageClassification\garbageSorting\modules\inspection-rubbish\inspection-rubbish.vue
-->
<template>
  <view class="inspection-start">
    <InspectionHeader
      :titleParams="titleParams"
      ref="InspectionHeader"
      v-if="showHeader"
    ></InspectionHeader>
    <van-tabs
      v-model:active="active"
      animated
      @change="handleTabChange"
      v-if="isComplete && menuList.length > 0"
    >
      <van-tab
        :title="item.name"
        :name="item.perms"
        v-for="(item, index) in menuList"
        :key="index"
      >
        <Cleaning
          ref="BJXS"
          :titleParams="titleParams"
          v-if="item.perms === 'BJXS'"
        ></Cleaning>
        <BucketRegister
          ref="STDJ"
          :titleParams="titleParams"
          v-else-if="item.perms === 'STDJ'"
        ></BucketRegister>
        <BucketSignIn
          ref="STQD"
          @updateInterval="updateInterval"
          :titleParams="titleParams"
          v-else-if="item.perms === 'STQD'"
        ></BucketSignIn>
        <TaskContent
          ref="RWXC"
          :titleParams="titleParams"
          v-else-if="item.perms === 'RWXC'"
        ></TaskContent>
        <GarbageDelivery
          ref="LJSY"
          :titleParams="titleParams"
          v-else-if="item.perms === 'LJSY'"
        ></GarbageDelivery>
        <KitchenWasteDelivery
          ref="CYSY"
          :titleParams="titleParams"
          v-else-if="item.perms === 'CYSY'"
        ></KitchenWasteDelivery>
      </van-tab>
    </van-tabs>
    <getPhoneButton
      ref="phoneButton"
      @reLogin="refreshPage"
      @bannerShow="bannerShow"
    ></getPhoneButton>
    <BannerSwiper
      v-if="showBanner"
      :imgList="imgList"
      :platformId="platformId"
    ></BannerSwiper>
  </view>
</template>

<script>
import InspectionHeader from './component/inspection-header/InspectionHeader.vue';
import Cleaning from './component/CleaningKilling/CleaningKilling.vue';
import BucketRegister from './component/BarrelReceivingRegistration/BarrelReceivingRegistration.vue';
import BucketSignIn from './component/BucketSignIn/BucketSignIn.vue';
import TaskContent from './component/TaskContent/TaskContent.vue';
import GarbageDelivery from './component/GarbageDelivery/GarbageDelivery.vue';
import KitchenWasteDelivery from './component/KitchenWasteDelivery/KitchenWasteDelivery.vue';
import getPhoneButton from '@/pages/custom-components/getPhoneButton/getPhoneButton.vue';
import BannerSwiper from './component/BannerSwiper/BannerSwiper';
import {
  getMenuByCode,
  getHeaderInfo,
  getBannerPictures,
} from '@/apis/index.js';
import { useLogin, compose } from '@/utils/hooks/useHooks';
import request from '@/utils/request/request.js';

export default {
  data() {
    return {
      id: '',
      platformId: '',
      taskId: '',
      title: '',
      active: 'BJXS', //当前选中tab的标识符
      isComplete: false,
      showBanner: false, // 显示banner图 只有群众会有
      pointType: 0,
      menuList: [],
      timeFlag: null,
      titleParams: {
        name: '',
        latitude: '',
        longitude: '',
        clockInRange: 0,
        type: '',
        img: [],
        start: '',
        list: [
          {
            title: '',
            dec: '',
          },
        ],
        id: '',
        pointType: '',
      },
      // 缓存页面路径 方便刷新
      pageUrl: '',
      imgList: [],
      userInfo: 'init',
      showHeader: false,
    };
  },
  components: {
    InspectionHeader,
    Cleaning,
    BucketRegister,
    BucketSignIn,
    TaskContent,
    GarbageDelivery,
    KitchenWasteDelivery,
    getPhoneButton,
    BannerSwiper,
  },
  async onLoad(option) {
    this.pageUrl = option;
    console.log(
      '%c [ option ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      option
    );
    // 扫码的进来的逻辑
    if (option.scene) {
      this.userInfo = await useLogin(request);
      await this.getMenuByContacts();
      let params = decodeURIComponent(option.scene).split(':');
      console.log(
        '%c [ params ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        params
      );
      this.id = params[0];
      this.pointType = params[1];
    } else {
      this.id = option.id || option.scene;
      this.pointType = option.type;
    }
    const titleMap = [
      '垃圾分类投放点',
      '厨余垃圾收运点',
      '机关单位',
      '普通垃圾收运点',
      '居住小区',
    ];
    wx.setNavigationBarTitle({
      title: titleMap[this.pointType], //页面标题
    });

    const eventChannel = this.getOpenerEventChannel();
    if (Object.keys(eventChannel).length) {
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('instanceEntitiesEvent', (data) => {
        console.log(data);
        this.taskId = data.data.taskId;
      });
    }

    // 获取头部信息@return platformId => 获取banner图@return 判断是否同平台 流程
    const process = compose(
      {
        firstParams: {
          id: this.id,
          pointType: this.pointType,
        },
        getHeaderInfo,
        getBannerPictures,
        getHeaderHttpCallBack: this.getHeaderHttpCallBack,
      },
      this.getHeaderHttp,
      this.getBannerHttp
    );
    const finishData = await process();
    this.imgList = finishData.imgList;
    // 判断是否是同一个平台的人
    if (!finishData.isSamePlatform) {
      this.$nextTick(() => {
        this.$refs.InspectionHeader.isExpand = true;
        this.showBanner = true;
      });
      return;
    }
    if (!this.userInfo) {
      this.$nextTick(() => {
        this.$refs.phoneButton.visible = true;
        // this.$refs.InspectionHeader.isExpand = true;
      });
      return;
    }
    this.showHeader = true;
    this.init();
  },
  onUnload() {
    // 清除定时器
    this.clearTimer();
  },
  methods: {
    // 获取菜单 这里是为了获取站点更新位置按钮权限
    async getMenuByContacts() {
      const res = await request.get({
        url: '/mail/mailcontactor/getMenuByContacts',
        data: {
          token: wx.getStorageSync('token'),
        },
      });
      if (res.data.code === 0) {
        let count = 0;
        for (const item of res.data.data) {
          if (item.perms == 'GXZDWZ') {
            count++;
            break;
          }
        }
        if (count === 0) {
          wx.setStorageSync('GXZDWZ', false);
        } else {
          wx.setStorageSync('GXZDWZ', true);
        }
      }
      return null;
    },
    bannerShow() {
      this.showBanner = true;
    },
    // 1. 获取头部信息
    async getHeaderHttp(payload, { getHeaderInfo, getHeaderHttpCallBack }) {
      const res = await getHeaderInfo(
        payload.id,
        payload.pointType,
        payload.taskId
      );

      if (res.data.code === 0) {
        getHeaderHttpCallBack(res.data.data);
        return res.data.data.platformId;
      }
      return null;
    },

    getHeaderHttpCallBack(info) {
      this.platformId = info.platformId;
      let tempNum = this.pointType !== '0' ? '' : String(info.type);
      tempNum =
        tempNum || tempNum == '0'
          ? tempNum == '1'
            ? '误时投放点'
            : '定时投放点'
          : '';
      this.titleParams = {
        name: info.name,
        latitude: info.latitude,
        longitude: info.longitude,
        clockInRange: info.clockInRange || 0,
        type: tempNum,
        img:
          this.pointType == '2' || this.pointType == '4'
            ? ''
            : info.rels.pictures
            ? info.rels.pictures
            : '',
        start: info.isStar ? info.isStar : '',
        list: [],
      };
      let titleList = [
        //投放点
        [
          {
            title: '名称:',
            dec: info.name,
          },
          {
            title: '所属村居:',
            dec: info.groupName ? info.groupName : '',
          },
          {
            title: '单元类型:',
            dec: info.unitTypeName ? info.unitTypeName : '',
          },
          {
            title: '编号:',
            dec: info.number ? info.number : '',
          },
          {
            title: '地址:',
            dec: info.place ? info.place : '',
          },
          {
            title: '类型:',
            dec: tempNum,
          },
          {
            title: '投放时间:',
            dec: info.rels
              ? info.rels.times
                ? info.rels.times.map((v) => {
                    return `${v.startTime}~${v.endTime}`;
                  })
                : ''
              : '',
          },
          {
            title: '责任单位:',
            dec: info.rels
              ? info.rels.units
                ? info.rels.units[0].name
                : ''
              : '',
          },
          {
            title: '主责人:',
            dec: info.principal ? info.principal : '',
          },
          {
            title: '手机号码:',
            dec: info.phone ? info.phone : '',
          },

          {
            title: '备注',
            dec: info.remark ? info.remark : '',
          },
        ],
        //厨余收运点
        [
          {
            title: '所属村居：',
            dec: info.groupName ? info.groupName : '',
          },
          {
            title: '收运点类型：',
            dec: info.typeName ? info.typeName : '',
          },
          {
            title: '编号:',
            dec: info.number ? info.number : '',
          },
          {
            title: '收运时间：',
            dec: info.rels
              ? info.rels.times
                ? info.rels.times.map((v) => {
                    return `${v.startTime}~${v.endTime}`;
                  })
                : ''
              : '',
          },
          {
            title: '责任单位：',
            dec: info.rels
              ? info.rels.units
                ? info.rels.units[0].name
                : ''
              : '',
          },
          {
            title: '主责人：',
            dec: `${info.principal ? info.principal : ''}`,
          },
          {
            title: '手机号码：',
            dec: `${info.phone ? info.phone : ''}`,
          },
          {
            title: '地址：',
            dec: info.place ? info.place : '',
          },
          {
            title: '备注：',
            dec: info.remark ? info.remark : '',
          },
        ],
        //机关单位
        [
          {
            title: '名称：',
            dec: info.name,
          },
          {
            title: '所属分组：',
            dec: info.groupName ? info.groupName : '',
          },
          {
            title: '所属村居：',
            dec: info.rusticateName ? info.rusticateName : '',
          },
          {
            title: '单元类型：',
            dec: info.typeName ? info.typeName : '',
          },
          {
            title: '地址：',
            dec: info.address ? info.address : '',
          },
          {
            title: '责任人：',
            dec: info.responsible ? info.responsible : '',
          },
          {
            title: '手机号码：',
            dec: info.responsiblePhone ? info.responsiblePhone : '',
          },
          {
            title: '备注：',
            dec: info.remark ? info.remark : '',
          },
        ],
        //普通收运点
        [
          {
            title: '所属村居：',
            dec: info.groupName ? info.groupName : '',
          },
          {
            title: '收运点类型',
            dec: info.typeName ? info.typeName : '',
          },
          {
            title: '编号:',
            dec: info.number ? info.number : '',
          },
          {
            title: '收运时间：',
            dec: info.rels
              ? info.rels.times
                ? info.rels.times.map((v) => {
                    return `${v.startTime}~${v.endTime}`;
                  })
                : ''
              : '',
          },
          {
            title: '责任单位：',
            dec: info.rels
              ? info.rels.units
                ? info.rels.units[0].name
                : ''
              : '',
          },
          {
            title: '主责人：',
            dec: `${info.principal ? info.principal : ''}`,
          },
          {
            title: '手机号码：',
            dec: `${info.phone ? info.phone : ''}`,
          },
          {
            title: '地址：',
            dec: info.place ? info.place : '',
          },
          {
            title: '备注',
            dec: info.remark ? info.remark : '',
          },
        ],
        //居住小区
        [
          {
            title: '名称：',
            dec: info.name,
          },
          {
            title: '所属分组：',
            dec: info.groupName ? info.groupName : '',
          },
          {
            title: '所属村居：',
            dec: info.rusticateName ? info.rusticateName : '',
          },
          {
            title: '单元类型：',
            dec: info.typeName ? info.typeName : '',
          },
          {
            title: '地址：',
            dec: info.address ? info.address : '',
          },
          {
            title: '责任人：',
            dec: info.responsible ? info.responsible : '',
          },
          {
            title: '手机号码：',
            dec: info.responsiblePhone ? info.responsiblePhone : '',
          },
          {
            title: '备注：',
            dec: info.remark ? info.remark : '',
          },
        ],
      ];
      this.titleParams.list = titleList[Number(this.pointType)];
      this.titleParams.id = info.id;
      this.titleParams.pointType = this.pointType;
    },

    // 2. 获取banner
    async getBannerHttp(platformId, { getBannerPictures }) {
      const res = await getBannerPictures(platformId);
      if (res.data.code === 0) {
        console.log(
          '%c [ this.userInfo ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          platformId,
          this.userInfo
        );

        /* 无userInfo 证明没有此人 是群众
         * userInfo === 'init' 证明不是扫码进来的 一步一步点进来的 肯定是同平台
         * this.userInfo.platformId === platformId 证明同个平台
         */

        if (
          !this.userInfo ||
          this.userInfo === 'init' ||
          this.userInfo.platformId === platformId
        ) {
          return { imgList: res.data.data, isSamePlatform: true };
        }

        return { imgList: res.data.data, isSamePlatform: false };
      }
      return { imgList: [], isSamePlatform: false };
    },

    refreshPage() {
      // 刷新页面;
      getCurrentPages()[getCurrentPages().length - 1].onLoad(this.pageUrl);
    },

    init() {
      // 权限按钮请求操作
      getMenuByCode(this.pointType).then((res) => {
        console.log(
          '%c [ xxx ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          res
        );
        if (res.data.code === 0) {
          this.menuList = res.data.data;
          if (this.menuList.length === 0) {
            this.$refs.InspectionHeader.isExpand = true;
          }
        }
        this.isComplete = true;
        this.$nextTick(() => {
          if (this.menuList.length > 0) {
            this.handleTabChange({
              detail: {
                name: this.menuList[0].perms,
              },
            });
          }
        });
      });
    },

    handleTabChange(e) {
      const refName = e.detail.name;
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        this.$refs[refName]
      );
      this.clearTimer();
      this.$refs[refName][0].init(this.id, this.taskId);
      this.active = e.detail.name;
    },
    updateInterval(timeFlag) {
      this.timeFlag = timeFlag;
    },
    clearTimer() {
      if (this.timeFlag) {
        clearInterval(this.timeFlag);
      }
    },
  },
};
</script>

<style lang="less">
.inspection-start {
  background: #f5f5f5;
  min-height: 100vh;
  overflow: hidden;
  // .van-tabs__wrap {
  //   z-index: none !important;
  //   height: 0 !important;
  // }
}
</style>
