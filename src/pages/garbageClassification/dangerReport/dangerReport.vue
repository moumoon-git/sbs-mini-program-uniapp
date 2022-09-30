<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-15 11:34:57
 * @LastEditTime: 2022-04-24 15:58:58
-->
<template>
  <view class="mian">
    <view class="hidden-content" v-if="!isDisplay">
      <view
        class="dangerReport"
        :style="recordLength > 0 ? 'max-height: 82vh;' : 'height:100vh'"
      >
        <view class="card">
          <view class="card-line address">
            <view class="card-line-header-item">
              <van-icon class="little-icon" name="location-o" />
              <text class="overflow-ellipsis">{{ dataForm.address }}</text>
            </view>
            <view>
              <van-icon class="right_arrow" name="arrow" @click="handleJump" />
            </view>
          </view>
        </view>
        <view class="card">
          <view class="card-line" @click="showActionTab(true)">
            <view class="card-line-header">
              <view class="icon">
                <van-icon class="little-icon" name="warn-o" />
                <text>请选择隐患类型</text>
              </view>
              <view class="typeRight">
                <view class="typeName"
                  ><text>{{ dataForm.typeName }}</text></view
                >
                <view>
                  <van-icon class="little-icon vertical-right" name="arrow" />
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="card card-upload">
          <view class="title"> 上传照片(最多4张)</view>
          <view class="pic-box">
            <van-uploader
              :file-list="dataForm.attachments"
              :capture="['camera']"
              :max-count="4"
              @after-read="afterRead"
              upload-text="上传图片"
              @delete="deleteFile"
            />
          </view>
        </view>
        <view class="card">
          <view class="headline">
            <view class="danger-title">
              <text style="color: #ec808d">*</text>
              <text class="title">隐患标题</text>
            </view>
            <view class="filed">
              <van-field
                ref="input"
                placeholder="请输入隐患标题"
                clearable
                center
                v-model="dataForm.title"
                @input="inputChangeTitle"
              />
            </view>
          </view>
          <view class="card-remark">
            <view class="description">
              <text style="color: #ec808d">*</text>
              <text>隐患描述</text>
            </view>
            <view class="textarea">
              <van-field
                type="textarea"
                rows="10"
                autosize
                clearable
                center
                placeholder="请在此描述问题内容、地点、时间等信息"
                v-model="dataForm.description"
                @input="inputChange"
              />
            </view>
          </view>
          <view class="voice">
            <view class="voice-item">
              <view class="msg"> <text class="tips">注：最多只能上传一条</text></view>
              <image
                v-if="!(widthLength > 0)"
                @click="startRecord(true)"
                :src="imgStaticUrl + '/img/inspection/speak.png'"
                class="speak"
                mode=""
              ></image>
            </view>
          </view>
        </view>

        <view class="voiceList" v-if="recordLength > 0">
          <view
            v-for="(item, index) in dataForm.recordingAttachments"
            :key="index"
            class="list-item"
          >
            <view
              class="voice-right-inner"
              @tap="handleVoice(item)"
              :style="{ width: item.width }"
            >
              <!-- 语音图标 -->
              <image
                :src="`${imgStaticUrl}${
                  item.isPlay ? '/img/assistance/voice1.gif' : '/img/inspection/voice.png'
                }`"
                class="voice-icon"
                mode=""
              ></image>

              <view class="length">
                <!-- 时长 -->
                <text decode="true" class="chat-voice-length-right">{{ item.len }}</text>
                <!-- 语音条主体 -->
                <text class="chat-voice-second-right">"</text>
              </view>
            </view>
            <van-icon name="delete-o" class="delete" @click="handleDelte(index)" />
          </view>
        </view>
      </view>
      <view class="submit">
        <view class="sure" @click="save()">确定提交</view>
        <view class="report" @click="handleReport">上报记录</view>
      </view>
    </view>
    <view class="map" v-else>
      <LocationMap
        :latitude="dataForm.latitude"
        :longitude="dataForm.longitude"
        :address="dataForm.address"
        @getAddressData="getAddressData"
      ></LocationMap>
    </view>
    <!-- 隐患类型 弹窗-->
    <van-action-sheet
      :show="isShow"
      v-if="isShow"
      closeable
      title="请选择隐患类型"
      @close="showActionTab(false)"
    >
      <HazardType
        :problemType="problemType"
        @selectTypeData="selectTypeData"
        @handleTypeDate="handleTypeDate"
        ref="problemType"
      ></HazardType>
    </van-action-sheet>

    <van-action-sheet
      v-if="voiceReportShow"
      :show="voiceReportShow"
      :title="titleTip"
      @close="startRecord(false)"
    >
      <VoiceChat
        @getVoiceWidth="getVoiceWidth"
        @closeWindow="closeWindow"
        :isDisplay="true"
      >
      </VoiceChat>
    </van-action-sheet>
  </view>
</template>
<script>
import { getLocation } from "@/utils/hooks/useHooks.js";
import VoiceChat from "@/pages/garbageClassification/mutualAssistance/components/voiceChat.vue";
import config from "@/static/config/index.js";
import HazardType from "./components/HazardType";
import LocationMap from "./components/locationMap";
import { getListTree, getHiddenSourceId, handleSave } from "@/apis/index.js";
import useHandleSound from "@/utils/handleSound/handleSound.js";
const { handleVoicePlay, handleWidth } = useHandleSound();
import store from "@/store";
const innerAudioContext = uni.createInnerAudioContext();
export default {
  components: {
    VoiceChat,
    HazardType,
    LocationMap,
  },
  data() {
    return {
      fileHost: config.fileHost,
      imgStaticUrl: this.$imgStaticUrl,
      fileList: [],
      picList: [],
      dataForm: {
        id: "",
        title: "",
        longitude: "",
        latitude: "",
        address: "",
        typeName: "",
        areaId: "",
        description: "", //问题描述
        source: "", //隐患来源
        attachments: [],
        recordingAttachments: [], //录音数组
      },
      voiceReportShow: false,
      voiceLength: 0,
      isShow: false,
      cascaderValue: "",
      problemType: [],
      timer: null,
      currentTime: 0,
      duration: 0,
      isDisplay: false,
      recordLength: 0,
      widthLength: 0,
      titleTip: "语音上报",
    };
  },
  computed: {
    handlerDisplay() {
      console.log(this.$store.state.showMap, "88");
      if (this.$store.state.showMap == true) {
        return (this.isDisplay = true);
      } else {
        return (this.isDisplay = false);
      }
    },
  },
  onLoad() {
    this.refresh();
    this.getTreeData();
    this.getSourceId();
    this.handlerDisplay;
  },
  methods: {
    /**
     * @description：初始化数据
     */
    initData() {
      Object.assign(this.$data.dataForm, this.$options.data.call(this).dataForm);
      this.recordLength = 0;
      this.widthLength = 0;
    },
    /**
     * @description：手机定位数据
     */
    async refresh() {
      const { longitude, latitude, address } = await getLocation();
      this.dataForm.longitude = longitude;
      this.dataForm.latitude = latitude;
      if (address) {
        this.dataForm.address = address;
      } else {
        this.dataForm.address = "无法获取定位信息";
      }

      console.log(longitude, latitude, address, "地图");
    },
    /**
     * @description：文件上传
     */
    afterRead(event) {
      const { name, file } = event.detail;
       this.dataForm.attachments.push({
        name: "",
        url: file.url,
      });
      let upFiles = [];
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      if (file instanceof Array) {
        upFiles.push(...file);
      } else {
        upFiles.push(file);
      }
      upFiles.forEach((item) => {
        console.log(item);
        wx.uploadFile({
          url: `${this.fileHost}/fileupload/appAttachment/fileUploadPicture`, // 仅为示例，非真实的接口地址
          filePath: item.url,
          name: "file",
          header: {
            "content-type": "multipart/form-data",
            token: wx.getStorageSync("token"),
            type: 16,
          },
          formData: {
            "content-type": "multipart/form-data",
            charset: "utf-8",
            file: item.url,
            type: "16",
          },
          success: (res) => {
            let data = JSON.parse(res.data);
            if (data.errorcode === 0) {
              console.log(data.data, "(data.data");
              const obj = this.transformUrl(data.data);
              console.log(obj, "obj");
              // this.dataForm.attachments.push({
              //   name: obj.name,
              //   url: obj.fileUrl,
              // });
              console.log(this.dataForm.attachments, "图片");
              this.picList.push({
                name: obj.name,
                url: obj.url,
              });
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
      const fileUrl = data.filePath.replace(/\\/g, "/");
      //后台返回的地址有 \ 需要替换/ 不然渲染不出来 到时候回显同样需要这样做
      return {
        name: data.newFileName,
        fileUrl: this.fileHost + fileUrl,
        url: data.filePath,
      };
    },
    deleteFile(event) {
      const { index } = event.detail;
      this.dataForm.attachments.splice(index, 1);
      this.picList.splice(index, 1);
    },
    startRecord(type) {
      this.voiceReportShow = type;
    },
    getVoiceWidth(data) {
      data.forEach((v) => {
        v.width = handleWidth(v.len);
        v.isPlay = false;
      });
      this.dataForm.recordingAttachments = [];
      this.dataForm.recordingAttachments.push(...data);
      this.recordLength = this.dataForm.recordingAttachments.length;
      this.widthLength = this.dataForm.recordingAttachments.length;
      this.$forceUpdate();
      console.log(this.dataForm.recordingAttachments, "this.voiceList");
    },
    // 播放语音
    handleVoice(item) {
      this.dataForm.recordingAttachments
        ? this.dataForm.recordingAttachments.forEach((v) => {
            if (item.id !== v.id) {
              v.isPlay = false;
            } else {
              item.isPlay = !item.isPlay;
              handleVoicePlay(item);
            }
          })
        : [];
    },
    closeWindow() {
      console.log("进来了");
      this.startRecord(false);
    },
    /**
     * @description:删除录音
     */
    handleDelte(i) {
      this.dataForm.recordingAttachments.splice(i, 1);
      this.widthLength = this.dataForm.recordingAttachments.length;
    },
    /**
     * @description：展示隐患类型
     */
    showActionTab(type) {
      this.isShow = type;
      if (type) {
        this.$nextTick(() => {
          this.$refs.problemType.checkId = this.dataForm.areaId;
        });
      }
    },
    /**
     * @description:获取隐患类型
     */
    getTreeData() {
      getListTree().then((res) => {
        console.log(res, "//获取隐患类型");
        if (res.data.code === 0) {
          res.data.data.forEach((v) => {
            v.isCheck = false;
          });
          let tempObj = [
            {
              name: "全部",
              id: -1,
              children: res.data.data,
            },
          ];
          console.log(tempObj, "this.problemType");
          this.problemType = tempObj;
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
          return res.data.msg;
        }
        console.log(res, "数据");
      });
    },
    // 问题区域回调
    selectTypeData(data) {
      console.log(data, "选择数据");
      this.dataForm.areaId = data.id;
      this.dataForm.typeName = data.name;
      this.problemTypeShow = false;
      this.showActionTab(false);
    },
    handleTypeDate(data) {
      this.dataForm.areaId = data.id;
      this.dataForm.typeName = data.name;
      this.problemTypeShow = false;
      this.showActionTab(false);
      console.log(this.problemType, "数据点点");
    },
    /**
     * @description:获取隐患来源数据
     */
    getSourceId() {
      getHiddenSourceId().then((res) => {
        if (res.data.code === 0) {
          this.dataForm.source = res.data.source;
          console.log(this.dataForm.source, "this.dataForm.source");
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
      });
    },
    inputChange(e) {
      this.dataForm.description = e.detail;
    },
    inputChangeTitle(e) {
      this.dataForm.title = e.detail;
    },
    /**
     * @description:确定提交
     */
    save() {
      if (
        Object.keys(this.dataForm.address).length != 0 &&
        (this.dataForm.description || this.dataForm.recordingAttachments.length !== 0) &&
        this.dataForm.title
      ) {
        let requert = {
          reportContactorId: wx.getStorageSync("userId"),
          title: this.dataForm.title, //隐患标题
          type: this.dataForm.areaId, //隐患类型
          source: this.dataForm.source, //隐患来源
          address: this.dataForm.address,
          description: this.dataForm.description, //描述
          longitude: this.dataForm.longitude,
          latitude: this.dataForm.latitude,
          attachments: this.picList, //文件名
          recordingAttachments: this.dataForm.recordingAttachments, //录音数据
        };
        handleSave(requert).then((res) => {
          if (res.data.code === 0) {
            wx.showToast({
              title: "提交成功",
              icon: "success",
            });
            //清空数据
            this.initData();
            wx.switchTab({
              url: "/pages/home/home",
              fail: (err) => {
                console.log(err);
              },
            });
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "error",
            });
          }
          console.log(res, "保存数据");
        });
      } else {
        wx.showToast({
          title: `未填写${
            Object.keys(this.dataForm.address).length == 0
              ? "获取位置信息失败，无法提交！"
              : this.dataForm.description !== "" ||
                this.dataForm.recordingAttachments.length !== 0
              ? "隐患标题无法提交"
              : "隐患描述无法提交"
          }`,
          icon: "none",
        });
        return false;
      }
    },
    handleReport() {
      wx.navigateTo({
        url: `/pages/garbageClassification/dangerReport/components/reportedRecord`,
      });
    },
    /**
     * @description:页面跳转
     */
    handleJump() {
      this.$store.commit("SET_SHOW", true);
    },
    onUnload() {
      clearTimeout(this.timer);
    },
    handleDisplay() {
      this.isDisplay = false;
    },
    getAddressData(data) {
      console.log(data, "父组件拿到了");
      this.$nextTick(() => {
        this.dataForm.address = data.address;
        this.dataForm.longitude = data.longitude;
        this.dataForm.latitude = data.latitude;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.mian {
  .dangerReport {
    overflow-y: scroll;
    background-color: #f5f5f5;
    color: #474747;
    position: relative;
    .card-line-header-item {
      display: flex;
      // line-height: 104rpx;
      justify-content: space-between;
      .little-icon {
        margin-right: 5rpx;
        font-size: 40rpx;
      }
      .overflow-ellipsis {
        display: inline-block;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        max-width: 580rpx;
      }
    }

    .vertical-right {
      margin-left: auto;
    }
    .card {
      margin: 20rpx auto;
      width: 96%;
      background-color: #fff;
      .headline {
        padding-top: 8rpx;
        display: flex;
        margin: 0 auto;
        border-bottom: 1px solid #dddd;
        width: 94%;
        height: 100rpx;
        .danger-title {
          .title {
            font-size: 32rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 90rpx;
            margin-right: 20rpx;
          }
        }
      }
      .card-remark {
        margin: 0 auto;
        border-bottom: 1px solid #dddd;
        width: 94%;
        .description {
          margin-top: 19rpx;
        }
        .textarea {
          min-height: 185rpx;
        }
      }
    }
    .card-line:last-child {
      border-bottom: none;
    }
    .card-line {
      margin: 0 auto;
      border-bottom: 1px solid #d7d7d7;
      width: 94%;
      .card-line-header {
        display: flex;
        line-height: 104rpx;
        justify-content: space-between;
        .little-icon {
          margin-right: 5rpx;
          font-size: 40rpx;
        }
        .typeRight {
          display: flex;
          .typeName {
            max-width: 333rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .right_arrow {
        font-size: 40rpx;
      }
    }
    .address {
      display: flex;
      line-height: 60rpx;
      justify-content: space-between;
      padding-top: 10rpx;
    }
    .card-upload {
      .title {
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 45rpx;
        padding: 20rpx 0 20rpx 40rpx;
      }
      .pic-box {
        padding-left: 23rpx;
      }
    }
    .voice {
      .voice-item {
        display: flex;
        justify-content: space-between;
        height: 140rpx;
        .msg {
          margin-top: 42rpx;
          .voice-tips {
            font-size: 32rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 45rpx;
            margin-right: 25rpx;
            margin-left: 46rpx;
          }
          .tips {
            font-size: 26rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #cccccc;
            line-height: 37rpx;
            padding-left: 30rpx;
          }
        }

        .speak {
          width: 101rpx;
          height: 101rpx;
          display: inline-block;
          margin-right: 36rpx;
          margin-top: 18rpx;
        }
      }
    }
  }
  .submit {
    position: absolute;
    left: 50%;
    bottom: 35rpx;
    border-radius: 6rpx;
    line-height: 68rpx;
    text-align: center;
    text-shadow: 0 0 5rpx 0;
    font-weight: 400;
    font-size: 28rpx;
    color: #fff;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    width: 750rpx;
    height: 210rpx;
    background: #ffffff;
    box-shadow: 0rpx -1rpx 1rpx 0rpx rgba(116, 116, 116, 0.1);
    .sure {
      width: 640rpx;
      height: 90rpx;
      background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
      box-shadow: 0rpx 6rpx 12rpx 0rpx rgba(12, 126, 161, 0.35);
      border-radius: 75rpx;
      line-height: 90rpx;
      margin: 0 auto;
      margin-top: 30rpx;
      margin-bottom: 28rpx;
    }
    .report {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0091ff;
      line-height: 40rpx;
    }
  }
  .voiceList {
    margin: 20rpx auto;
    width: 96%;
    .list-item {
      display: flex;
      justify-content: space-between;
      margin: 20rpx auto;
      background-color: #fff;
      padding: 22rpx 0 22rpx 32rpx;
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
</style>
