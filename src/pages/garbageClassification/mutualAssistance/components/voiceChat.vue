<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-28 15:34:07
 * @LastEditTime: 2022-04-20 09:37:24
-->
<template>
  <view class="content">
    <view class="submit">
      <view class="submit-chat">
        <view class="bt-img" @tap="records" v-if="!isDisplay">
          <image :src="`${imgStaticUrl}${isrecord ? recordeSrc : inputSrc}`"></image>
        </view>
        <!-- 文本框 -->
        <textarea
          v-if="!isDisplay"
          auto-height="true"
          class="chat-send btn"
          :class="{ displaynone: !isrecord }"
          @input="inputs"
          @focus="focus"
          v-model="msg"
        ></textarea>
        <view
          class="record btn"
          :class="{ displaynone: isrecord }"
          @touchstart="touchstart"
          @touchend="touchend"
          @touchmove="touchmove"
        >
          <image
            v-if="longPress == '2'"
            class="speak"
            :src="imgStaticUrl + '/img/inspection/audio.png'"
          />
          <text :class="longPress == '1' ? '' : 'loosen'">{{
            longPress == "1"
              ? `${!isDisplay ? "语音求助，按住说话" : "按住说话"}`
              : "松手发送"
          }}</text>
          <image
            v-if="longPress == '2'"
            class="speak"
            :src="imgStaticUrl + '/img/inspection/audio.png'"
          />
        </view>
        <view class="submitBtn" v-if="isrecord">
          <van-button type="info" v-if="!msg" disabled>发送</van-button>
          <van-button type="info" v-else @click="startRecord(true)">发送</van-button>
        </view>
      </view>
    </view>

    <view
      class="prompt-layer prompt-layer-1"
      :class="{ displaynone: !voicebg }"
      v-if="longPress == '2'"
    >
      <view class="prompt-loader">
        <view class="loader-item" v-for="(item, index) in 15" :key="index"></view>
      </view>
      <text class="residue">{{ vlength + "s" }}</text>
      <text class="endTape">{{ `手指上划 取消发送` }}</text>
    </view>
<!-- 
    <view class="voice-bg" :class="{ displaynone: !voicebg }">
      <view class="voice-bg-len">
        <view class="voice-bg-time" :style="{ width: vlength / 0.6 + '%' }">
          {{ vlength }}″
        </view>
        <view class="voice-del">上滑取消录音</view>
      </view>
    </view> -->
    <van-action-sheet
      :show="isShow"
      v-if="isShow && !isDisplay"
      title="脆弱人群"
      @close="closeWindows"
    >
      <carePeople
        @closeWindows="closeWindows"
        ref="care"
        :currentList="currentList"
        :chatm="chatm"
      ></carePeople>
    </van-action-sheet>
  </view>
</template>

<script>
// 录音
const recorderManager = uni.getRecorderManager();
import carePeople from "./carePeople";
import config from "@/static/config/index.js";
export default {
  data() {
    return {
      isrecord: false,
      voicebg: false,
      pageY: 0,
      msg: "",
      // 直接引用地址可能出不来，需要用require
      timer:null, //计时器
      vlength: 0,
      imgStaticUrl: this.$imgStaticUrl,
      recordeSrc: "/img/assistance/speak.png",
      inputSrc: "/img/assistance/allorder.png",
      longPress: "1", // 1显示 按住说话 2显示 说话中
      isShow: false,
      currentVoice: {},
      currentList: [],
      duration: 60000, //录音最大值ms 60000/1分钟
      chatm: "", //输入框内容
      iscancel:false
    };
  },
  props: {
    isDisplay: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    carePeople,
  },
  methods: {
    //获取高度方法
    getElementHeight() {
      const query = uni.createSelectorQuery().in(this);
      query
        .select(".submit")
        .boundingClientRect((data) => {
          this.$emit("heights", data.height);
        })
        .exec();
    },
    //切换音频
    records() {
      //切换高度
      setTimeout(() => {
        this.getElementHeight();
      }, 10);
      this.isrecord ? (this.isrecord = false) : (this.isrecord = true);
    },
    //文字发送
    inputs(e) {
      console.log(e.detail.value, "内容");
      this.msg=e.detail.value;
      this.chatm = e.detail.value;
    },
    // 输入框聚焦
    focus() {
      setTimeout(() => {
        this.getElementHeight();
      }, 10);
    },
    //音频处理
    //开始录音
    touchstart(e) {
      this.longPress = "2";
      console.log( e.changedTouches[0].pageY,' e.changedTouches[0].pageY')
      this.pageY = e.changedTouches[0].pageY;
      this.voicebg = true;
      this.countdown(1);
      const options = {
        duration: this.duration, // 指定录音的时长，单位 ms
        sampleRate: 16000, // 采样率
        numberOfChannels: 1, // 录音通道数
        encodeBitRate: 96000, // 编码码率
        format: "mp3", // 音频格式，有效值 aac/mp3
        frameSize: 10, // 指定帧大小，单位 KB
      };
      recorderManager.start(options);
      // 监听音频开始事件
      // recorderManager.onStart((res) => {
      //   //录音开始事件
      //   console.log(res, "78787878");
      // });
    },
    /**
     * @description:定时器
     */
    countdown(i) {
      this.timer = setInterval(() => {
        this.vlength = i;
        i++;
        console.log("计时器开始工作,第几秒", i);
        //结束计时
        if (i > 60) {
          wx.showToast({
            title: '停止录音',
            icon: "error",
          });
          clearInterval(this.timer);
          this.touchend();
        }
      }, 1000);
    },

    //手指滑开
    touchmove(e) {
      console.log("滑动到的y轴高度：", e.changedTouches[0].pageY);
      if (this.pageY - e.changedTouches[0].pageY > 100) {
        // 关闭录音界面
        this.voicebg = false;
        clearInterval(this.timer);
        this.iscancel=true;
        this.vlength = 0;
        this.longPress = "1";
        if(!this.isDisplay){
         this.startRecord(false)
        }else{
          this.$emit("closeWindow")
        }
        
      }
    },
    // 结束录音
    touchend() {
      if(this.iscancel){
        this.iscancel=false;
        return false;
      }
      this.longPress = "1";
      clearInterval(this.timer);
      this.timer=null;
      console.log(this.timer, "this.timer");
      recorderManager.stop();
      recorderManager.onStop((res) => {
        console.log(res,'录音文件')
        this.currentVoice = {
          url: res.tempFilePath,
          time: this.vlength,
          duration: res.duration,
        };
        this.uploadRecording();
        this.isDisplay?this.$emit("closeWindow"):'';
        this.vlength = 0;
        this.voicebg = false;
        this.startRecord(true);
        clearInterval(this.timer);
      });
      
      console.log(this.vlength,'this.vlength')
      // this.vlength = 0;
    },
    /**
     * @description:打开/关闭弹窗
     */
    startRecord(type) {
      this.isShow = type;
      console.log(this.isDisplay,'this.isDisplay')
      if (type && this.isDisplay==false) {
        this.$nextTick(() => {
          this.$refs.care.getSys();
        });
      }
    },
    uploadRecording() {
      let upFiles = [];
      upFiles.push(this.currentVoice);
      upFiles.forEach((item) => {
        wx.uploadFile({
          url: `${config.baseUrl}/upload/passImg`, // 仅为示例，非真实的接口地址
          filePath: item.url,
          name: "file",
          header: {
            "content-type": "application/x-www-form-urlencoded",
            token: wx.getStorageSync("token"),
          },
          formData: {
            "content-type": "multipart/form-data",
            charset: "utf-8",
            file: item.url,
          },
          success: (res) => {
            let data = JSON.parse(res.data);
            if (data.code === 0) {
              const obj = this.transformUrl(data.data);
              console.log(obj,'录音文件')
              this.currentList = [];
              this.$nextTick(()=>{
                this.currentList.push({
                  url: obj.fileUrl,
                  duration: item.duration,
                  len: item.time,
                  type: this.isDsplay ? "" : 1,
                });
                console.log( this.currentList,' this.currentList')
                this.$emit("getVoiceWidth", this.currentList);
              })
             
            }
          },
          fail: (res) => {
            console.log("fail", res);
          },
          complete: (res) => {
            console.log("complete", res);
          },
        });
      });
    },
    transformUrl(data) {
      const fileUrl = data.url.replace(/\\/g, "/");
      console.log(fileUrl, "fileUrl");
      //后台返回的地址有 \ 需要替换/ 不然渲染不出来 到时候回显同样需要这样做
      return {
        fileUrl: config.host + fileUrl,
        url: data.url,
      };
    },
    /**
     * @description:获取数据
     */
    closeWindows(type) {
      this.startRecord(false);
      this.currentList = [];
      this.chatm = "";
      this.msg = "";
      this.isrecord=false;
      type == "cancel" ? "" : this.$emit("refresh");
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  height:135rpx;
  margin:0 auto;
  .submit {
    background: #ffffff;
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 100;
    padding: 20rpx 0rpx 40rpx 0rpx;
  }

  .displaynone {
    display: none;
  }

  .submit-chat {
    width: 100%;
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    padding: 14rpx 14rpx;
    image {
      width: 56rpx;
      height: 56rpx;
      margin: 0 10rpx;
      flex: auto;
    }

    .btn {
      flex: auto;
      background-color: #fff;
      border-radius: 10rpx;
      padding: 15rpx 20rpx;
      max-height: 160rpx;
      margin: 0 10rpx;
    }

    .chat-send {
      line-height: 44rpx;
      border-radius: 64rpx;
      background: #f5f6f7;
    }

    .record {
      line-height: 44rpx;
      text-align: center;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      background: #f5f6f7;
      border-radius: 64rpx;
      .speak {
        width: 36rpx;
        height: 36rpx;
        margin-right: 4rpx;
        vertical-align: middle;
      }
      .loosen {
        color: #0091ff;
        margin: 0 63rpx;
      }
    }
    .submitBtn {
      width: 160rpx;
      /deep/ button{
        border-radius: 20rpx;
      }
    }
  }
  /* 提示小弹窗 */
  .prompt-layer {
    border-radius: 8px;
    background: #32c5ff;
    padding: 8px 16px;
    box-sizing: border-box;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    .prompt-loader {
      width: 96px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      .loader-item {
        display: block;
        background: #fff;
        width: 1px;
        height: 10%;
        margin-right: 2.5px;
        float: left;
      }
      .loader-item:last-child {
        margin-right: 0px;
      }
      .loader-item:nth-child(1) {
        animation: load 2.5s 1.4s infinite linear;
      }
      .loader-item:nth-child(2) {
        animation: load 2.5s 1.2s infinite linear;
      }
      .loader-item:nth-child(3) {
        animation: load 2.5s 1s infinite linear;
      }
      .loader-item:nth-child(4) {
        animation: load 2.5s 0.8s infinite linear;
      }
      .loader-item:nth-child(5) {
        animation: load 2.5s 0.6s infinite linear;
      }
      .loader-item:nth-child(6) {
        animation: load 2.5s 0.4s infinite linear;
      }
      .loader-item:nth-child(7) {
        animation: load 2.5s 0.2s infinite linear;
      }
      .loader-item:nth-child(8) {
        animation: load 2.5s 0s infinite linear;
      }
      .loader-item:nth-child(9) {
        animation: load 2.5s 0.2s infinite linear;
      }
      .loader-item:nth-child(10) {
        animation: load 2.5s 0.4s infinite linear;
      }
      .loader-item:nth-child(11) {
        animation: load 2.5s 0.6s infinite linear;
      }
      .loader-item:nth-child(12) {
        animation: load 2.5s 0.8s infinite linear;
      }
      .loader-item:nth-child(13) {
        animation: load 2.5s 1s infinite linear;
      }
      .loader-item:nth-child(14) {
        animation: load 2.5s 1.2s infinite linear;
      }
      .loader-item:nth-child(15) {
        animation: load 2.5s 1.4s infinite linear;
      }
      @keyframes load {
        0% {
          height: 10%;
        }
        50% {
          height: 100%;
        }
        100% {
          height: 10%;
        }
      }
    }
  }
  .prompt-layer::after {
    content: "";
    display: block;
    border: 6px solid rgba(0, 0, 0, 0);
    border-top-color: #32c5ff;
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
  }
  .prompt-layer-1 {
    font-size: 12px;
    width: 300rpx;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 50%;
    .residue {
      font-size: 56rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 78rpx;
      text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.25);
      margin-bottom: 8rpx;
    }
    .endTape {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 42rpx;
    }
  }
  .voice-bg {
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1001;

    .voice-bg-len {
      height: 84rpx;
      width: 600rpx;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 42rpx;
      text-align: center;
    }

    .voice-bg-time {
      display: inline-block;
      min-width: 120rpx;
      line-height: 84rpx;
      background-color: rgba(255, 228, 49, 1);
      border-radius: 42rpx;
    }

    .voice-del {
      position: absolute;
      bottom: -480rpx;
      width: 100%;
      text-align: center;
      color: #fff;
      font-size: 28rpx;
    }
  }
}
</style>
