<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-28 10:49:57
 * @LastEditTime: 2022-04-16 17:52:34
-->
<template>
  <view class="assistance">
    <view class="assistance_wrap">
      <view class="assistance_header">
        <view
          class="assistance_header_item"
          v-for="(item, index) in assistanceHeader"
          :key="index"
        >
          <text class="title">{{ item.title }}</text>
          <text class="desc">{{ item.desc }}</text>
        </view>
      </view>
      <view class="assistance_content">
        <view class="assistance_content_wrap" v-if="assistanceList.length > 0">
          <view
            class="assistance_content_item"
            v-for="item in assistanceList"
            :key="item.id"
          >
            <view class="content_item_time">
              <view class="item_time_wrap">
                <view :class="item.name === '本人' ? 'personage' : 'other'">
                  <text>{{ item.name }}</text>
                </view>
                <view class="time">
                  {{ item.helpTime }}
                </view>
              </view>
              <view
                class="operation"
                @click.stop="handleStopService(item.id)"
                v-if="item.status === 0 || item.status === 3"
              >
                <text>关闭需求</text>
              </view>
            </view>
            <!-- 标签 -->
            <view class="label-list">
              <span
                class="oneLabel"
                :style="{ background: ele.background }"
                v-for="ele in item.needTypeList"
                :key="ele.id"
              >
                <span class="label-item">
                  {{ ele.name }}
                </span>
              </span>
            </view>
            <!-- 录音/文字 -->
            <view
              class="phoneticWriting"
              v-if="item.recordingAttachments.length > 0 || item.description"
            >
              <view class="voiceList">
                <view
                  class="list-item"
                  v-for="(ele, i) in item.recordingAttachments"
                  :key="i"
                >
                  <view
                    class="voice-right-inner"
                    @tap="handleVoice(ele)"
                    :style="{ width: ele.width }"
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
              <view class="description">
                <text>{{ item.description || "" }}</text>
              </view>
            </view>
            <view class="tag">
              <image
                v-if="item.status || item.status === 0"
                :src="imgStaticUrl + imgSrc[item.status]"
                mode=""
                class="img"
              />
            </view>
          </view>
        </view>

        <view class="empty-box" v-else>
          <image :src="imgStaticUrl + '/img/inspection/empty.png'" mode="" class="img">
          </image>
          <view class="empty"> 暂无数据 </view>
        </view>
      </view>
    </view>

    <view class="assistance_voice">
      <voiceChat @refresh="getOneself"></voiceChat>
    </view>
    <van-dialog
      class="dialog"
      :show="showDialog"
      title="提示"
      show-cancel-button
      @cancel="handleCancel"
      @confirm="handleConfirm"
      message="是否关闭当前需求？"
    >
    </van-dialog>
  </view>
</template>

<script>
const innerAudioContext = uni.createInnerAudioContext();
import { getSelfPublish, handleDelete } from "@/apis/index.js";
import useHandleSound from "@/utils/handleSound/handleSound.js";
import voiceChat from "./components/voiceChat";
const { handleVoicePlay, handleWidth } = useHandleSound();
export default {
  components: { voiceChat },
  props: {},
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      assistanceHeader: [], //需求总数
      assistanceList: [], //需求数据列表
      imgSrc: [
        "/img/assistance/forService.png",
        "/img/assistance/serviceIng.png",
        "/img/assistance/finished.png",
        '/img/assistance/forService.png',
        "/img/assistance/cancel.png",
      ],
      showDialog: false,
      ids: "", //当前点击id
    };
  },
  watch: {},
  computed: {},
  onLoad() {
    this.getOneself();
  },
  methods: {
    /**
     * @description:获取本人发布的需求
     */
    getOneself() {
      getSelfPublish().then((res) => {
        if (res.data.code === 0) {
          this.assistanceHeader = [
            {
              title: "待服务：",
              desc: Number(res.data.count.pendingService)+ Number(res.data.count.pending),
            },
            {
              title: "服务中：",
              desc: res.data.count.serving,
            },

            {
              title: "已完成：",
              desc: res.data.count.completed,
            },
            {
              title: "已关闭：",
              desc: res.data.count.close,
            },
          ];
          res.data.data.forEach((v) => {
            if (v.recordingAttachments && v.recordingAttachments.length > 0) {
              v.recordingAttachments.forEach((ele) => {
                ele.width = handleWidth(ele.len);
                ele.isPlay = false;
              });
            }
          });
          this.assistanceList = res.data.data;
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
      });
    },
    /**
     * @description:取消服务
     */
    handleStopService(id) {
      this.showDialog = true;
      this.ids = id;
      this.getOneself();
    },
    handleCancel() {
      this.showDialog = false;
    },
    /**
     * @description:确定取消服务
     */
    handleConfirm() {
      let request = {
        id: this.ids,
        status:'4'
      };
      handleDelete(request).then((res) => {
        if (res.data.code === 0) {
          wx.showToast({
            title: "关闭需求成功",
            icon: "success",
          });
          this.getOneself();
          this.showDialog=false;
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
          this.showDialog=false;
        }
      });
    },
    /**
     * @description:取消服务需要调整
     */
    handleVoice(item) {
      this.assistanceList.forEach((v) => {
        if (v.recordingAttachments && v.recordingAttachments.length > 0) {
          v.recordingAttachments.forEach((ele) => {
            if (item.id !== ele.id) {
              ele.isPlay = false;
            }else{
              item.isPlay = !item.isPlay;
              handleVoicePlay(item);
            }
          });
        }
      });
    },
  }
};
</script>
<style lang="less" scoped>
.assistance {
  min-height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
  color: #474747;
  position: relative;
  .assistance_wrap {
    .assistance_header {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 28rpx;
      display: flex;
      justify-content: space-around;
      background: #ffffff;
      padding: 36rpx 34rpx 36rpx 20rpx;
      .assistance_header_item:first-child {
        color: #f2b626;
      }
      .assistance_header_item:nth-child(2) {
         color: #0091ff;
      }
      .assistance_header_item:nth-child(3) {
        color: #0bd295;
      }
      .assistance_header_item:last-child {
        color: #d1d1d1;
      }
    }
    .assistance_content {
      .assistance_content_wrap {
        max-height: 83vh;
        overflow-y: scroll;
        .assistance_content_item {
          margin: 20rpx auto;
          width: 96%;
          background-color: #fff;
          padding-bottom: 10rpx;
          position: relative;
          .content_item_time {
            padding-top: 24rpx;
            display: flex;
            justify-content: space-between;
            .item_time_wrap {
              display: flex;
              margin-left: 27rpx;
              .personage {
                font-size: 26rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #fdb428;
                line-height: 36rpx;
                margin-right: 17rpx;
                text {
                  border-radius: 4px;
                  border: 1px solid #fdb428;
                  padding: 0 16rpx;
                }
              }
              .other {
                font-size: 26rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #0094ee;
                line-height: 36rpx;
                margin-right: 17rpx;
                text {
                  border-radius: 4px;
                  border: 1px solid #0094ee;
                  padding: 0 16rpx;
                }
              }

              .time {
                font-size: 28rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #333333;
                //   line-height: 90rpx;
              }
            }
            .operation {
              font-size: 24rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #f66e6e;
              margin-right: 51rpx;
            }
          }
          .label-list {
            margin: 21rpx 0px 8rpx 25rpx;
            word-wrap: break-word;
            max-width: 353px;
            .oneLabel {
              font-size: 24rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              background: #f2f2f2;
              border-radius: 27rpx;
              border: 1px solid #dcdee0;
              padding: 2rpx 17rpx;
              margin-right: 15rpx;
              margin-bottom: 16rpx;
              display: inline-block;
              .label-item {
                z-index: 0;
              }
            }
          }
          .phoneticWriting {
            margin: 10rpx auto;
            width: 88%;
            background: #f5f6f7;
            padding: 22rpx 0 22rpx 32rpx;
            .voiceList {
              .list-item {
                display: flex;
                justify-content: space-between;
                background: #f5f6f7;
                // padding: 22rpx 0 22rpx 32rpx;
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
            .description {
              font-size: 28rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 42rpx;
              max-width: 610rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .tag {
            position: absolute;
            top: 0;
            right: 0;
            .img {
              width: 80rpx;
              height: 80rpx;
            }
          }
        }
      }

      .empty-box {
        position: absolute;
        left: 50%;
        top: 35%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .img {
          width: 150rpx;
          height: 150rpx;
        }
        .empty {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 28rpx;
        }
      }
    }
  }
  .dialog {
    /deep/ .van-dialog__message {
      margin-top: 26rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 48rpx;
    }
  }
}
</style>
