<template>
  <view style="height: 100%;">
    <view v-if="platformCode=='CGXCPT'||platformCode=='LJFLPT'" class="container" @click="getSubscribeMessage">
      <header
        class="header"
        :style="{
          backgroundImage: `url(${imgStaticUrl}/img/home/home-bg.png)`,
        }"
      >
        <text class="header-text-h1">{{
          platformInfo.customName
            ? platformInfo.customName
            : platformInfo.platformName
        }}</text>
        <!-- <text class="header-text-h1">{{platformInfo.townName}}</text> -->
        <!-- <text class="header-text-h4">{{platformInfo.platformTitle}}</text> -->
      </header>
      <view class="userInfo">
        <!-- <text
          class="userInfo-icon"
          :style="{
            backgroundImage: `url(${avatar ? avatar : defaultAvatar})`,
          }"
        ></text> -->
        <image
          class="userInfo-icon"
          v-show="avatar !== 'init'"
          :src="avatar == null ? defaultAvatar : avatar"
          mode=""
        ></image>
        <text style="margin-left: 20rpx;">{{ `你好，${userInfo.name}` }}</text>
      </view>
      <view v-if="isComplete" class="content">
        <!-- <van-tabs
          v-model:active="active"
          animated
          @change="handleTabChange"
          
        > -->
        <!-- :title="active!=0?'城管巡查':''" v-if="platformCode === 'CGXCPT'" -->
        <view v-if="platformCode === 'CGXCPT'" title="城管巡查">
          <!-- v-if="active==0" -->
          <block>
            <!-- <view class="tab-active tab-active-left">
                <i class="tab-active-icon urban-management-patrol-icon"></i>
                <text>城管巡查</text>
              </view> -->
            <view class="tab-panel">
              <view
                class="card"
                v-for="(item, index) in menuList"
                :key="index"
                :data-redirectTo="item.url"
                @click="handleNavigate"
              >
                <i
                  :class="{
                    'card-icon': true,
                    'problem-reporting': item.className === 'problem-reporting',
                    notification: item.className === 'notification',
                    inspection: item.className === 'inspection',
                    'clock-in': item.className === 'clock-in',
                    workOrderManagement: item.className === 'workOrderManagement',
                    leaderBoard: item.className === 'leaderBoard',
                  }"
                  :style="{
                    backgroundImage: `url(${imgStaticUrl}/img/home/home-tab0-icon.png)`,
                  }"
                ></i>
                <text>{{ item.name }}</text>
              </view>
            </view>
          </block>
        </view>
        <!-- :title="active!=1?'垃圾分类':''" v-if="platformCode === 'LJFLPT'" -->
        <view v-if="platformCode === 'LJFLPT'" title="垃圾分类">
          <!-- v-if="active==1" -->
          <block>
            <!-- <view class="tab-active tab-active-center">
                <i class="tab-active-icon garbage-classification-icon"></i>
                <text>垃圾分类</text>
              </view> -->
            <view class="tab-panel" style="display:flex;padding: 0rpx 30rpx;">
              <view class="tab-panel-left">
                <view
                  v-for="(item, index) in tabPanelLeft"
                  :key="index"
                  :data-redirectTo="item.url"
                  @click="handleNavigate"
                  :class="{
                    'tab-panel-background': true,
                    'problem-reporting': item.className === 'problem-reporting',
                    workOrderManagement: item.className === 'workOrderManagement',
                    'clock-in': item.className === 'clock-in',
                  }"
                  :style="{
                    backgroundImage: `url(${imgStaticUrl}/img/home/home-tab1-icon.png)`,
                  }"
                >
                  <text>{{ item.name }}</text>
                </view>
              </view>
              <view class="tab-panel-right">
                <view
                  v-for="(item, index) in tabPanelRight"
                  :key="index"
                  :data-redirectTo="item.url"
                  @click="handleNavigate"
                  :class="{
                    'tab-panel-background': true,
                    inspection: item.className === 'inspection',
                    notification: item.className === 'notification',
                    collectionTransportationReport:
                      item.className === 'collectionTransportationReport',
                  }"
                  :style="{
                    backgroundImage: `url(${imgStaticUrl}/img/home/home-tab1-icon.png)`,
                  }"
                >
                  <text>{{ item.name }}</text>
                </view>
              </view>
            </view>
          </block>
        </view>
        <!-- <van-tab :title="active!=2?'疫情防控':''">
            <block v-if="active==2">
              <view class="tab-active tab-active-right">
                <i class="tab-active-icon epidemic-situation-control-icon"></i>
                <text>疫情防控</text>
              </view>
              <view class="tab-panel">
              </view>
            </block>
          </van-tab> -->
        <!-- </van-tabs> -->
      </view>
    </view>
    <DisasterPreventionHome v-if="platformCode == 'DISASTERMITIGATION'" :menuList="menuList" :platformInfo="platformInfo" />
    <getPhoneButton ref="phoneButton" @reLogin="login"></getPhoneButton>
  </view>
</template>

<script>
import { defineComponent } from 'vue';
import getPhoneButton from '@/pages/custom-components/getPhoneButton/getPhoneButton.vue';
import DisasterPreventionHome from '@/pages/garbageClassification/DisasterPreventionHome/DisasterPreventionHome';
import { compose, useLogin } from '@/utils/hooks/useHooks';
import config from '@/static/config/index.js';
import store from '@/store';

export default defineComponent({
  name: 'home',
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      defaultAvatar: this.$imgStaticUrl + '/img/home/default-avatar.png',
      getPhoneNumberVisible: false,
      userInfo: { name: '' },
      platformInfo: {},
      requestSubscribeMessageAble: false,
      active: 0, //当前选中tab的标识符
      platformCode: '',
      platformMap: ['CGXCPT', 'LJFLPT', 'DISASTERMITIGATION'],
      menuMap: {
        CGXCPT: {
          WTSB: {
            name: '巡查报告',
            url: '/pages/garbageClassification/ProblemReporting/ProblemReporting',
            // '/pages/publicPage/problem-report/problem-report?platform=cgxc',
            className: 'problem-reporting',
          },
          XCRW: {
            name: '巡查任务',
            url: '/pages/cityManagementInspection/inspection/inspection-index',
            className: 'inspection',
          },
          GDGL: {
            name: '工单任务',
            url: '/pages/publicPage/workOrderManagement/workOrderManagement',
            className: 'workOrderManagement',
          },
          DKQD: {
            name: '打卡签到',
            url: '/pages/cityManagementInspection/siginByMap/siginByMap',
            className: 'clock-in',
          },
          TZGG: {
            name: '通知公告',
            url: '/pages/publicPage/notification/notification',
            className: 'notification',
          },
          LDKB: {
            name: '领导看板',
            url: '/pages/garbageClassification/LeaderBoard/LeaderBoard',
            className: 'leaderBoard',
          },
        },
        LJFLPT: {
          WTSB: {
            name: '巡查报告',
            url:
              '/pages/publicPage/problem-report/problem-report?platform=ljfl',
            className: 'problem-reporting',
          },
          GDGL: {
            name: '工单任务',
            url: '/pages/publicPage/workOrderManagement/workOrderManagement',
            className: 'workOrderManagement',
          },
          DKQD: {
            name: '打卡签到',
            url: '/pages/garbageClassification/siginByMap/siginByMap',
            className: 'clock-in',
          },
          SYBG: {
            name: '收运报告',
            url:
              '/pages/garbageClassification/collectionTransportationReport/collectionTransportationReport',
            className: 'collectionTransportationReport',
          },
          XCRW: {
            name: '巡查任务',
            url: '/pages/garbageClassification/garbageSorting/inspection-index',
            className: 'inspection',
          },
          TZGG: {
            name: '通知公告',
            url: '/pages/publicPage/notification/notification',
            className: 'notification',
          },
        },
        DISASTERMITIGATION: {
          YHBG: {
            name: '隐患报告',
            url: '/pages/garbageClassification/dangerReport/dangerReport',
            className: 'YHBG',
          },
          VOLUNTARY_SERVICE: {
            name: '志愿服务',
            url: '/pages/garbageClassification/VoluntaryService/VoluntaryService',
            className: 'VOLUNTARY_SERVICE',
          },
          TASK_MANAGEMENT: {
            name: '任务管理',
            url: '/pages/garbageClassification/taskManagement/taskManagement',
            className: 'TASK_MANAGEMENT',
          },
          CARE_AND_MUTUAL_ASSISTANCE: {
            name: '关爱互助',
            url: '/pages/garbageClassification/mutualAssistance/mutualAssistance',
            className: 'CARE_AND_MUTUAL_ASSISTANCE',
          },
          PUBLICITY_ANNOUNCEMENT: {
            name: '宣传公告',
            url: '/pages/garbageClassification/PublicityNotice/PublicityNotice',
            className: 'PUBLICITY_ANNOUNCEMENT',
          }
        },
      },
      menuList: [],
      isComplete: false,
    };
  },
  components: { getPhoneButton, DisasterPreventionHome},
  computed: {
    avatarImg() {
      return store.state.userInfo.avatar;
    },
    tabPanelLeft() {
      return this.menuList.slice(0, 3);
    },
    tabPanelRight() {
      return this.menuList.slice(3, 6);
    },
    avatar() {
      return this.avatarImg
        ? this.avatarImg.startsWith('http')
          ? this.avatarImg
          : config.fileHost + this.avatarImg
        : null;
    },
  },

  onLoad() {
    this.login();
  },
  mounted() {
    console.log('this.menuList', this.menuList, this.platformCode);
  },
  methods: {
    login() {
      useLogin(this.$http).then((userInfo) => {
        if (!userInfo) {
          this.$refs.phoneButton.visible = true;
          return false;
        }
        this.userInfo = userInfo;
        this.getPlatformMenu();
        this.getPlatformTitle();
        return true
      }).then((res) => {})
    },

    // 1. 获取所属平台
    async getPlatformType(
      { data, platformMap },
      { request, getPlatformTypeCallBack }
    ) {
      const res = await request.get({
        url: '/sys/platformtype/getPlatformType',
        data,
      });
      if (
        res.data.code === 0 &&
        platformMap.includes(res.data.sysPlatformType.code)
      ) {
        getPlatformTypeCallBack(res.data.sysPlatformType.code);
        return data;
      }
      return null;
    },

    // 2. 获取菜单
    async getMenuByContacts(data, { request, getMenuByContactsCallBack }) {
      const res = await request.get({
        url: '/mail/mailcontactor/getMenuByContacts',
        data,
      });
      if (res.data.code === 0) {
        getMenuByContactsCallBack(res.data.data);
      }
      return null;
    },

    // 获取菜单容器
    getPlatformMenu() {
      const firstParams = {
        data: { token: wx.getStorageSync('token') },
        platformMap: this.platformMap,
      };
      const process = compose(
        {
          firstParams,
          request: this.$http,
          getPlatformTypeCallBack: (payload) => {
            this.platformCode = payload;
            wx.setStorageSync('platformCode', payload);
          },
          getMenuByContactsCallBack: (payload) => {
            let curentMap = this.menuMap[this.platformCode];
            console.log('payload,curentMap', payload, curentMap);
            if (
              payload.filter((item) => {
                return item.perms == 'GXZDWZ';
              }).length != 0
            ) {
              wx.setStorageSync('GXZDWZ', true);
            } else {
              wx.setStorageSync('GXZDWZ', false);
            }
            const count = payload.filter((item) => {
              if( item.perms=='YHBG'){
                this.$store.commit("SET_Power_Code",item.perms);
              }
              return item.perms == 'QBDKJL';
            }).length;
            if (count > 0) {
              wx.setStorageSync('allRecord', true);
            } else {
              wx.setStorageSync('allRecord', false);
            }

            for (let key in this.menuMap[this.platformCode]) {
              if (
                payload.filter((item) => {
                  return item.perms == key;
                }).length != 0
              ) {
                this.menuList.push(curentMap[key]);
              }
            }
          },
        },
        this.getPlatformType,
        this.getMenuByContacts
      );
      process().then(() => {
        this.isComplete = true;
      });
    },

    // 页面跳转
    handleNavigate(event) {
      wx.navigateTo({
        url: event.currentTarget.dataset.redirectto,
      });
    },
    getPlatformTitle() {
      this.$http
        .get({
          url: '/sys/platform/queryByUserId',
          data: {
            userId: wx.getStorageSync('userId'),
          },
        })
        .then(({ data }) => {
          console.log('/sys/platform/queryByUserId data', data);
          if (data.code == 0) {
            this.platformInfo = data.platFormEntity;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    // 订阅消息
    subscribeMessage() {
      let that = this;
      wx.requestSubscribeMessage({
        tmplIds: ['EqqUmyDd81QjKtPo553rzrv0_1WMtUPok1m74MN3dEM'],
        success(res) {
          console.log('wx.requestSubscribeMessage res', res);
          that.requestSubscribeMessageAble = res.errMsg.includes('ok');
        },
      });
    },
    getSubscribeMessage() {
      if (!this.requestSubscribeMessageAble) {
        this.subscribeMessage();
      }
    },
    // 当前tab改变时触发的回调函数
    handleTabChange(name, title) {
      console.log('handleTabChange name, title', name, title);
      this.active = name.detail.index;
    },
  },
});
</script>

<style lang="less">
page {
  height: 100vh;
}
</style>
<style lang="less" scoped>
.container {
  height: 100vh;
  overflow: auto;
  display: block;
  padding: 0rpx;
  box-sizing: border-box;
  background: #f5f5f5;
  .get-phone-number-button {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0%;
    opacity: 0%;
    z-index: 999;
    display: block;
    padding: initial;
    box-sizing: border-box;
    background: #fff;
    line-height: initial;
    text-align: initial;
    font-size: initial;
    &::after {
      border: initial;
    }
  }
  .header {
    height: 380rpx;
    background-size: 100vw 380rpx;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .header-text-h1 {
      font-size: 50rpx;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0rpx 10rpx 20rpx rgba(0, 0, 0, 0.5);
      white-space: nowrap;
    }
    .header-text-h4 {
      font-size: 45rpx;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0rpx 10rpx 20rpx rgba(0, 0, 0, 0.5);
      white-space: nowrap;
      margin-top: 10rpx;
    }
  }
  .userInfo {
    padding: 16rpx 0rpx;
    background: #ffffff;
    box-shadow: 0rpx 10rpx 20rpx 0rpx rgba(0, 0, 0, 0.06);
    border-radius: 8rpx;
    font-weight: 400;
    color: #646566;
    display: flex;
    align-items: center;
    width: 90%;
    margin: -60rpx auto auto;

    .userInfo-icon {
      // background: url(https://z3.ax1x.com/2021/10/19/5w90mV.png) no-repeat;
      background-size: contain;
      width: 80rpx;
      height: 80rpx;
      display: inline-block;
      border-radius: 50%;
      // background-position: -25rpx -163rpx;
      // background-size: 725rpx 256rpx;
      margin-left: 20rpx;
    }
  }
  .content {
    display: block;
    box-sizing: border-box;
    border-radius: 16rpx;
    width: 90%;
    overflow: auto;
    max-height: 50vh;
    background: #fff;
    --tab-font-size: 32rpx;
    padding: 0rpx 8vw 8vw 8vw;
    margin: 30rpx auto auto;


    // .van-tabs__wrap {
    // 	border-radius: 18rpx 18rpx 0rpx 0rpx;
    // 	.van-tabs__nav.van-tabs__nav--line {
    // 		background: #EFF1F3;
    // 		.van-tabs__line {
    // 			display: none;
    // 		}
    // 		.van-ellipsis {
    // 			color: #999999;
    // 		}
    // 		.van-ellipsis.van-tab:nth-of-type(3) {
    // 			display: flex;
    // 			justify-content: center;
    // 			align-items: center;
    // 			position: relative;
    // 			&::before {
    // 				content: '';
    // 				display: inline-block;
    // 				background: #D8D8D8;
    // 				width: 4rpx;
    // 				height: 22rpx;
    // 				position: absolute;
    // 				left: 0%;
    // 			}
    // 			&::after {
    // 				content: '';
    // 				display: inline-block;
    // 				background: #D8D8D8;
    // 				width: 4rpx;
    // 				height: 22rpx;
    // 				position: absolute;
    // 				right: 0%;
    // 			}
    // 		}
    // 	}
    // }
    // .van-tabs__content {
    // 	overflow: initial;
    // }
    van-tab {
      position: relative;
    }
    .tab-active {
      background: #ffffff;
      width: 260rpx;
      height: 120rpx;
      z-index: 996;
      color: #0091ff;
      font-size: 32rpx;
      font-weight: 600;
      &-left {
        clip-path: polygon(0 0, 85% 0%, 100% 100%, 0% 100%);
        position: absolute;
        top: -24%;
        left: 0%;
        text {
          display: block;
          margin-left: 55rpx;
        }
      }
      &-center {
        clip-path: polygon(15% 0, 85% 0%, 100% 100%, 0% 100%);
        position: absolute;
        top: -15%;
        left: 50%;
        transform: translateX(-50%);
        text {
          display: block;
          margin-left: 68rpx;
        }
      }
      &-right {
        clip-path: polygon(15% 0, 100% 0%, 100% 100%, 0% 100%);
        position: absolute;
        top: -24%;
        right: 0%;
        text {
          display: block;
          margin-left: 75rpx;
        }
      }
      &-icon {
        // background: url(https://xc1.zeits.cn/WechatAppStatic/img/home/home-tabs-icon.png)
        //   no-repeat;
        width: 40rpx;
        height: 45rpx;
        display: block;
        background-size: 300rpx 150rpx;
      }
    }
    .urban-management-patrol-icon {
      margin: 20rpx 0rpx 5rpx 100rpx;
      background-position: -23rpx -20rpx;
    }
    .garbage-classification-icon {
      margin: 20rpx 0rpx 5rpx 110rpx;
      background-position: -75rpx -20rpx;
    }
    .epidemic-situation-control-icon {
      margin: 20rpx 0rpx 5rpx 120rpx;
      background-position: -130rpx -20rpx;
    }
    .tab-panel {
      width: 100%;
      min-height: 500rpx;
      background: #fff;
      --tab-font-size: 32rpx;
      box-sizing: border-box;
      padding: 0rpx 2.7vw 0rpx 4.8vw;
      .card {
        display: inline-block;
        font-weight: 400;
        color: #646566;
        margin: 3.2vw 2.7vw 0rpx 2.7vw;
        background: #fafafa;
        border-radius: 16rpx;
        text-align: center;
        padding: 5.3vw 4vw;
        &:nth-of-type(1),
        &:nth-of-type(3),
        &:nth-of-type(4),
        &:nth-of-type(6) {
          margin-left: auto;
          margin-right: auto;
        }
        i,
        text {
          display: block;
        }
        text {
          font-size: 4.2vw;
        }
        .card-icon {
          // background: url(https://xc1.zeits.cn/WechatAppStatic/img/home/home-tab0-icon.png)
          //   no-repeat;
          width: 8vw;
          height: 8vw;
          display: inline-block;
          background-size: 533rpx 87rpx;
          &.clock-in {
            background-position: -291rpx -12rpx;
          }
          &.problem-reporting {
            background-position: -8rpx -12rpx;
          }
          &.notification {
            background-position: -388rpx -12rpx;
          }
          &.inspection {
            background-position: -101rpx -12rpx;
          }
          &.workOrderManagement {
            background-position: -198rpx -12rpx;
          }
          &.leaderBoard {
            background-position: -464rpx -12rpx;
          }
        }
      }
      .tab-panel-background {
        // background: url(https://xc1.zeits.cn/WechatAppStatic/img/home/home-tab1-icon.png)
        //   no-repeat;
        // 6个模块的版本
        // background-size: 638rpx 758rpx;
        // 5个模块的版本
        background-size: 656rpx 781rpx;
        border-radius: 20rpx;
      }
      .tab-panel-right > view,
      .tab-panel-left > view {
        margin-top: 20rpx;
        &:first-child {
          margin-top: 30rpx;
        }
        &:last-child {
          margin-top: 20rpx;
          margin-bottom: 30rpx;
        }
      }
      .tab-panel-left {
        margin-right: auto;
        margin-left: 0rpx;
        .problem-reporting,
        .workOrderManagement,
        .clock-in {
          overflow: auto;
          text {
            display: block;
            margin: 20rpx 0rpx 0rpx 20rpx;
            color: #ffffff;
          }
        }
        .problem-reporting {
          // 6个模块的版本
          // width: 290rpx;
          // height: 199rpx;
          // 5个模块的版本
          width: 290rpx;
          height: 207rpx;
          background-position: -20rpx -20rpx;
          position: relative;
          &::after {
            display: inline-block;
            content: 'PROBLEM';
            font-size: 22rpx;
            color: rgba(255, 255, 255, 0.3);
            position: absolute;
            left: 7%;
            top: 31%;
          }
        }
        .workOrderManagement {
          // 6个模块的版本
          // width: 290rpx;
          // height: 259rpx;
          // 5个模块的版本
          width: 290rpx;
          height: 283rpx;
          background-position: -20rpx -250rpx;
          position: relative;
          &::after {
            display: inline-block;
            content: 'WORK ORDER TASK';
            font-size: 22rpx;
            color: rgba(255, 255, 255, 0.3);
            position: absolute;
            left: 7%;
            top: 24%;
          }
        }
        .clock-in {
          // 6个模块的版本
          // width: 290rpx;
          // height: 199rpx;
          // background-position: -20rpx -562rpx;
          // 5个模块的版本
          width: 290rpx;
          height: 209rpx;
          background-position: -20rpx -560rpx;
          position: relative;
          &::after {
            display: inline-block;
            content: 'PUNCH IN';
            font-size: 22rpx;
            color: rgba(255, 255, 255, 0.3);
            position: absolute;
            left: 7%;
            top: 31%;
          }
        }
      }
      .tab-panel-right {
        margin-left: auto;
        // margin-left: 20rpx;
        margin-right: 0rpx;
        .inspection,
        .notification,
        .collectionTransportationReport {
          overflow: auto;
          text {
            display: block;
            margin: 20rpx 0rpx 0rpx 20rpx;
            color: #ffffff;
          }
        }
        .collectionTransportationReport {
          width: 290rpx;
          height: 199rpx;
          background-position: -350rpx -20rpx;
          position: relative;
          &::after {
            display: inline-block;
            content: 'COLLECTION';
            font-size: 22rpx;
            color: rgba(255, 255, 255, 0.3);
            position: absolute;
            left: 7%;
            top: 31%;
          }
        }
        .inspection {
          // 6个模块的版本
          // width: 290rpx;
          // height: 259rpx;
          // background-position: -350rpx -264rpx;
          // 5个模块的版本
          width: 300rpx;
          height: 317rpx;
          background-position: -340rpx -20rpx;
          position: relative;
          &::after {
            display: inline-block;
            content: 'PATROL TASK';
            font-size: 22rpx;
            color: rgba(255, 255, 255, 0.3);
            position: absolute;
            left: 7%;
            top: 24%;
          }
        }
        .notification {
          // 6个模块的版本
          // width: 290rpx;
          // height: 199rpx;
          // background-position: -350rpx -562rpx;
          // 5个模块的版本
          width: 300rpx;
          height: 398rpx;
          background-position: -340rpx -360rpx;
          position: relative;
          &::after {
            display: inline-block;
            content: 'NOTICE';
            font-size: 22rpx;
            color: rgba(255, 255, 255, 0.3);
            position: absolute;
            left: 7%;
            top: 31%;
          }
        }
      }
    }
  }
}
</style>
