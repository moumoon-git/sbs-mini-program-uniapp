<template>
  <view class="content" style="background: #f5f5f5">
    <van-tabs title-active-color="#3F8EF7" v-model:active="active" animated  @change="handleTabChange" >
      <van-tab title="我的上报">
        <!-- 标题 -->
        <view class="header" v-for="(item, index) in pageList" :key="item.id">
          <view class="header-title" @click="expand(index)">
            <view :class="item.currentTypeName?'tag':'tag1'">{{ item.currentTypeName || '' }}</view>
            <view class="overflow-ellipsis"> {{ item.title }}</view>
            <van-icon
              :name="index === activeExpand ? 'arrow-up' : 'arrow-down'"
              class="ml-auto"
            />
          </view>

          <view class="detail" v-show="index === activeExpand">
            <view class="">
              <text class="label">报告人</text>
              <text class="desc name">{{ item.name ? item.name : "" }}</text>
            </view>
            <view>
              <text class="label">报告时间</text>
              <text class="desc">{{ item.reportTime ? item.reportTime : "" }}</text>
            </view>
            <view class="currentTypeName">
              <view class="label">隐患类型</view>
              <view class="desc">{{
                item.currentTypeName ? item.currentTypeName : ""
              }}</view>
            </view>
            <view class="dangerAddress">
              <text class="label">隐患地点</text>
              <text class="desc address">{{ item.address ? item.address : "" }}</text>
            </view>
            <!-- 图片 -->
            <view class="img">
              <view class="card" v-for="(ele, i) in item.attachments" :key="i">
                <ImageView
                  :src="fileHost+ele.url"
                  style="width:153rpx;height: 153rpx"
                >
                </ImageView>
              </view>
            </view>
            <view class="description">
              <text>{{ item.description ? item.description : "" }}</text>
            </view>
            <!-- 录音 -->
            <view class="voiceList">
              <view
                v-for="(ele, i) in item.recordingAttachments"
                :key="i"
                class="list-item"
              >
                <view
                  class="voice-right-inner"
                  @click="handleVoice(ele,'list')"
                  :style="{ width: item.width }"
                >
                  <!-- 语音图标 -->
                  <image
                    :src="`${imgStaticUrl}${
                      ele.isPlay
                        ? '/img/assistance/voice1.gif'
                        : '/img/inspection/voice.png'
                    }`"
                    class="voice-icon"
                    mode=""
                  ></image>
                  <view class="length">
                    <!-- 时长 -->
                    <text decode="true" class="chat-voice-length-right">{{
                      ele.len
                    }}</text>
                    <!-- 语音条主体 -->
                    <text class="chat-voice-second-right">s</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </van-tab>
      <van-tab title="全部上报" v-show="code">
        <view class="header" v-for="(item, index) in pageAllList" :key="item.id">
          <view class="header-title" @click="expand(index)">
            <text :class="item.currentTypeName?'tag':'tag1'">{{ item.currentTypeName || "" }}</text>
            <view class="overflow-ellipsis"> {{ item.title }}</view>
            <van-icon
              :name="index === activeExpand ? 'arrow-up' : 'arrow-down'"
              class="ml-auto"
            />
          </view>
          <view class="detail" v-show="index === activeExpand">
            <view class="">
              <text class="label">报告人</text>
              <text class="desc name">{{ item.name ? item.name : "" }}</text>
            </view>
            <view>
              <text class="label">报告时间</text>
              <text class="desc">{{ item.reportTime ? item.reportTime : "" }}</text>
            </view>
             <view class="currentTypeName">
              <view class="label">隐患类型</view>
              <view class="desc">{{
                item.currentTypeName ? item.currentTypeName : ""
              }}</view>
            </view>
            <view class="dangerAddress">
              <text class="label">隐患地点</text>
              <text class="desc address">{{ item.address ? item.address : "" }}</text>
            </view>
            <!-- 图片 -->
            <view class="img">
              <view class="card" v-for="(ele, i) in item.attachments" :key="i">
                <ImageView
                  :src="fileHost+ele.url"
                  style="width:153rpx;height: 153rpx"
                >
                </ImageView>
              </view>
            </view>
            <view class="description">
              <text>{{ item.description ? item.description : "" }}</text>
            </view>
            <!-- 录音 -->
            <view class="voiceList">
              <view
                v-for="(ele, i) in item.recordingAttachments"
                :key="i"
                class="list-item"
              >
                <view
                  class="voice-right-inner"
                  @click="handleVoice(ele, 'All')"
                  :style="{ width: item.width }"
                >
                  <!-- 语音图标 -->
                  <image
                    :src="`${imgStaticUrl}${
                      ele.isPlay
                        ? '/img/assistance/voice1.gif'
                        : '/img/inspection/voice.png'
                    }`"
                    class="voice-icon"
                    mode=""
                  ></image>

                  <view class="length">
                    <!-- 时长 -->
                    <text decode="true" class="chat-voice-length-right">{{
                      ele.len
                    }}</text>
                    <!-- 语音条主体 -->
                    <text class="chat-voice-second-right">s</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </van-tab>
    </van-tabs>
  </view>
</template>
<script>
import config from "@/static/config/index.js";
import { getLocation } from "@/utils/hooks/useHooks.js";
import { handleListPage } from "@/apis/index.js";
import ImageView from '@/pages/custom-components/ImageView/ImageView.vue';
import {
  getMenuByCode,
} from '@/apis/index.js';
import useHandleSound from "@/utils/handleSound/handleSound.js";
const { handleVoicePlay, handleWidth } = useHandleSound();
import store from "@/store";
const innerAudioContext = uni.createInnerAudioContext();
export default {
  components: {
    ImageView,
  },
  data() {
    return {
      isExpand: false,
      fileHost: config.fileHost,
      isUpdateAddress: wx.getStorageSync("GXZDWZ"),
      active: 0,
      pageList: [],
      imgStaticUrl: this.$imgStaticUrl,
      activeExpand: -1,
      pageAllList: [], //全部数据
      code:"",
    };
  },
  onLoad() {
    this.getList();
    this.getAllList();
    this.getCode();
  },
  methods: {
    getCode(){
      let code ="YHBG";
      // 权限按钮请求操作
      getMenuByCode(code).then((res) => {
        console.log(
          "数据",
          res
        );
        if(res.data.code===0){
          let data=res.data.data || [];
          data.forEach((v)=>{
            this.code=v.perms;
          })
        }
      });
    },
    /**
     * @description:获取我的上报数据
     */
    getList() {
      let request = {
        reportContactId: wx.getStorageSync("userId"),
      };
      handleListPage(request).then((res) => {
        if (res.data.code === 0) {
          res.data.page.list.forEach((v) => {
            v.width = handleWidth(v.recordingAttachments.length);
            v.isPlay = false;
          });
          this.pageList = res.data.page.list;
        }
      });
    },
    /**
     * @description：获取全部上报数据
     */
    getAllList() {
      let request = {
        reportContactId: "",
      };
      handleListPage(request).then((res) => {
        if (res.data.code === 0) {
          res.data.page.list.forEach((v) => {
            v.width = handleWidth(v.recordingAttachments.length);
            v.isPlay = false;
          });
          this.pageAllList = res.data.page.list;
        }
      });
    },
    /**
     * @description：展开列表
     */
    expand(index) {
      if (index === this.activeExpand) {
        this.activeExpand = -1;
        return;
      }
      this.isExpand = false;
      this.activeExpand = index;
    },
    // 当前tab改变时触发的回调函数
    handleTabChange(name, title) {
      console.log(name.detail.index,'name.detail.index')
      this.active = name.detail.index;
    },
    /**
     * @description:播放语音
     */
    handleVoice(item, type) {
      if (type === "All") {
        this.pageAllList.forEach((v) => {
          if (v.recordingAttachments) {
            v.recordingAttachments.forEach((ele) => {
              if (item.id !== ele.id) {
                ele.isPlay = false;
              } else {
                item.isPlay = !item.isPlay;
                handleVoicePlay(item);
              }
            });
          }
        });
      } else {
        this.pageList.forEach((v) => {
          if (v.recordingAttachments) {
            v.recordingAttachments.forEach((ele) => {
              if (item.id !== ele.id) {
                ele.isPlay = false;
              } else {
                item.isPlay = !item.isPlay;
                handleVoicePlay(item);
              }
            });
          }
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.header {
  width: 96%;
  margin: 20rpx auto;
  background-color: #fff;
  .header-title {
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    display: flex;
    align-items: center;
    padding-right: 15rpx;
    min-height: 92rpx;
    border-radius: 5px;
    color: #555555;
    font-size: 26rpx;
    .overflow-ellipsis {
      // white-space: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;
      display: inline-block;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      // line-height: 92rpx;   
      max-width: 385rpx;

    }
    .tag {
      border-radius: 6px;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0091ff;
      line-height: 33rpx;
      padding: 15rpx;
      margin: 0 30rpx;
      background-color:#e6efff;
      max-width: 167rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tag1 {
      border-radius: 6px;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0091ff;
      line-height: 33rpx;
      padding: 15rpx;
      margin: 0 30rpx;
      background-color:#ffffff;
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
  .detail:before {
    display: block;
    content: "";
    width: 100%;
    height: 1px;
    background: #dddddd;
    margin-bottom: 20rpx;
  }
  .detail {
    font-size: 24rpx;
    color: #7f7f7f;
    width: 94%;
    margin: 0 auto;
    padding-bottom: 10rpx;
    .label {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 60rpx;
      margin-left: 15rpx;
    }
    .desc {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 60rpx;
      margin-left: 68rpx;
    }
    .currentTypeName{
      display: flex;
      .label{
        width: 135rpx;
      }
      .desc{
        max-width: 452rpx;
        margin-left: 46rpx;
      }
    }
    .dangerAddress {
      display: flex;
      margin-bottom: 20rpx;
    }
    .img {
      display: flex;
      .card:first-child {
        margin-left: 10rpx;
      }
      .card:not(last-child) {
        margin-left: 20rpx;
      }
    }

    .name {
      margin-left: 94rpx;
    }
    .address {
      max-width: 479rpx;
    }
    .description {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 40rpx;
      margin: 20rpx 0 20rpx 10rpx;
      max-width: 670rpx;
    }
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
      & text:last-child {
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
    .voiceList {
      margin: 20rpx auto;
      width: 96%;
      // background-color: #fff;
      .list-item {
        display: flex;
        justify-content: space-between;
        // margin: 20rpx auto;
        background-color: #fff;
        // padding: 22rpx 0 22rpx 32rpx;
        // border: 1px solid #F5F5F5;
        .voice-right-inner {
          background: rgba(0, 145, 255, 0.12);
          border: 1px solid #0091ff;
          width: 20%;
          background: rgba(0, 145, 255, 0.12);
          border: 1px solid #0091ff;
          border-radius: 50rpx;
          display: flex;
          padding: 10rpx 0 10rpx 21rpx;
          .voice-icon {
            width: 25rpx;
            height: 30rpx;
            display: inline-block;
            margin-right: 15rpx;
            margin-top: 5rpx;
          }
          .length {
            maring-left: 11rpx;
            font-size: 28rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 40rpx;
          }
        }
        .delete {
          margin-right: 30rpx;
        }
      }
    }
  }
}
</style>
