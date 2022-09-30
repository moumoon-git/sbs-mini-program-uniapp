<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-28 17:19:39
 * @LastEditTime: 2022-04-22 13:52:24
-->
<template>
  <view class="care">
    <view class="care_header">
      <view class="flex-box">
        <view
          v-for="(item, index) in list"
          :key="index"
          :class="{ 'second-box': true, activeBox: checkId === index }"
          @click="chooseArea(index, item)"
        >
          {{ item }}
        </view>
      </view>
      <view class="add" v-show="!isShow || checkItem == '其他'">
        <view class="careList">
          <view class="careList_item" v-for="(item, i) in addList" :key="item.id">
            <view class="careList_item_wrap" @click="handleSelect(item)">
              <view class="care_img">
                <image
                  v-if="item.images"
                  :class="{ care_item: true, activeSelect: selectIndex === item.id }"
                  :src="fileHost + item.images"
                />
                <image
                  v-else
                  :class="{ care_item: true, activeSelect: selectIndex === item.id }"
                  :src="imgStaticUrl + '/img/assistance/defaultImage.svg'"
                />
              </view>
              <view
                class="care_name"
                :style="{ width: selectIndex === item.id ? '156rpx' : '152rpx;' }"
              >
                <text class="name">{{ item.name }}</text>
              </view>

              <image
                @click="handleDelete(i)"
                class="care_close"
                :src="imgStaticUrl + '/img/assistance/clear.png'"
              />
            </view>
          </view>
        </view>
        <view class="addBtn" @click="handleAddCaring" v-if="checkItem == '其他'">
          <image class="care" :src="imgStaticUrl + '/img/assistance/care.png'" />
          <view class="careMsg">
            <van-icon name="plus" />
            <text>添加</text>
          </view>
        </view>
      </view>
      <view class="turnType">
        <view class="turnType_msg">
          <view class="msg">
            <text>求助人类型（最多选3项）</text>
          </view>
          <view class="turnType_msg_item">
            <view
              v-for="item in listByCode"
              :class="{ 'second-box': true, activeBox: item.isCheck === true }"
              :key="item.id"
              @click="chooseType(item)"
            >
              {{ item.name }}
            </view>
          </view>
        </view>
      </view>
      <view class="phoneticWriting" v-if="voiceList.length > 0 || chatm">
        <view class="voiceList" v-if="voiceList.length > 0">
          <view class="list-item" v-for="(ele, i) in voiceList" :key="i">
            <view
              class="voice-right-inner"
              @tap="handleVoice(ele)"
              :style="{ width: ele.width }"
            >
              <!-- 语音图标 -->
              <image
                :src="`${imgStaticUrl}${
                  ele.isPlay ? '/img/assistance/voice1.gif' : '/img/inspection/voice.png'
                }`"
                class="voice-icon"
                mode=""
              ></image>

              <view class="length">
                <!-- 时长 -->
                <text decode="true" class="chat-voice-length-right">{{ ele.len }}</text>
                <!-- 语音条主体 -->
                <text class="chat-voice-second-right">s</text>
              </view>
            </view>
          </view>
        </view>
        <view class="remark">
          <text>{{ chatm }}</text>
        </view>
      </view>
      <view class="opertion">
        <van-button class="cancel" @click="handleCancel" size="large">取消</van-button>
        <van-button type="info" class="submit" @click="handleConfirm" size="large"
          >确定发送</van-button
        >
      </view>
      <van-dialog
        class="dialog"
        title="提示"
        :show="showDialog"
        show-cancel-button
        @cancel="handleCancelDialog"
        @confirm="handleConfirmDialog"
        confirmButtonColor="#0093fd"
        confirmButtonText="继续发布"
        :message="isContinue"
      >
      </van-dialog>
    </view>
  </view>
</template>

<script>
import {
  getSysDictionaryListByCode,
  getServiceRequirements,
  getReleaseHistoryUser,
  getServiceRequirementsCheck,
} from "@/apis/index.js";
import config from "@/static/config/index.js";
import store from "@/store";
import useMiddleWare from "@/utils/hooks/useMiddleWare";
import useHandleSound from "@/utils/handleSound/handleSound.js";
import { defineComponent, onMounted, ref } from "vue";
const { handleVoicePlay, handleWidth } = useHandleSound();
export default defineComponent({
  components: {},
  props: {
    currentList: {
      type: Array,
    },
    chatm: {
      type: String,
    },
  },
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      checkId: -1,
      checkItem: "",
      list: [],
      listByCode: [], //用户需求类型
      chooseId: [],
      fileHost: config.fileHost,
      helpContactorId: wx.getStorageSync("userId"), //本人id
      duration: 0,
      isPlay: false, //是否播放
      voiceList: [],
      isShow: false,
      tempArr: [],
      showDialog: false,
      isContinue:
        "您当前存在未完成需求，可关闭上一条需求后再发布新需求，继续发布将自动关闭上一条需求。",
      notContinue: "该脆弱人群当前存在未完成需求，无法发布新需求。",
    };
  },
  watch: {
    isOutreach: {
      handler: function (newVal, oldVal) {
        if (newVal === 3) {
          this.list = ["本人", "其他"];
          this.isShow = true;
          this.chooseArea(0, this.list[0]);
        } else {
          this.list = ["其他"];
          this.isShow = false;
          this.chooseArea(0, this.list[0]);
        }
        console.log(newVal, "newVal", oldVal, "oldVal");
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    isOutreach() {
      return store.state.userInfo.isOutreach;
    },
  },
  mounted() {
    console.log("进来了");
    setTimeout(() => {
      this.voiceList = this.currentList;
      this.voiceList.forEach((v) => {
        v.isPlay = false;
        v.width = handleWidth(v.len);
      });
      console.log(this.currentList, "传过来的值");
    }, 1500);
    this.getReleaseHistory();
  },
  setup(props) {
    const addList = ref([]); //数组去重
    const selectIndex = ref(-1);
    const selectItem = ref({});
    const { $on_phy } = useMiddleWare();
    onMounted(() => {
      $on_phy("SEARCH_CARE_PEOPLE", (data) => {
        addList.value.push(data);
        let obj = {};
        addList.value = addList.value.reduce(function (item, next) {
          obj[next.id] ? "" : (obj[next.id] = true && item.push(next));
          return item;
        }, []);
        console.log(addList, "去重之后");
        handleSelect(addList.value[addList.value.length - 1]);
        console.log(
          "%c [ xxx ]",
          "font-size:13px; background:pink; color:#bf2c9f;",
          data
        );
      });
    });
    /**
     * @description:删除对应的脆弱人群
     */
    function handleDelete(index) {
      addList.value.splice(index, 1);
      selectIndex.value = -1;
    }
    /**
     * @description:是否选择脆弱人群
     */
    function handleSelect(item) {
      selectIndex.value = item ? item.id : -1;
      selectItem.value = item ? item : {};
    }
    return {
      addList,
      handleDelete,
      selectIndex,
      handleSelect,
      selectItem,
    };
  },

  methods: {
    /**
     * @description:获取小程序历史发布用户历史
     */
    getReleaseHistory() {
      getReleaseHistoryUser().then((res) => {
        if (res.data.code === 0) {
          this.addList = res.data.data;
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
      });
    },

    // 播放语音
    handleVoice(item) {
      console.log(this.voiceList, "点击播放");
      this.voiceList.forEach((ele) => {
        if (ele.duration === item.duration) {
          item.isPlay = !item.isPlay;
          handleVoicePlay(item);
        }
      });
      console.log(item, "当前的录音是他");
    },
    /**
     * @description:选择本人/其他
     */
    chooseArea(index, item) {
      console.log(index, item, "index,item");
      this.checkId = index;
      this.checkItem = item;
      console.log(item, "本人");
    },
    /**
     * @description：获取用户需求类型
     */
    getSys() {
      getSysDictionaryListByCode().then((res) => {
        if (res.data.code === 0) {
          res.data.data.forEach((v) => {
            v.isCheck = false;
          });
          this.listByCode = res.data.data;
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
        console.log(res, "用户类型");
      });
    },
    /**
     * @description：选择用户需求类型
     */
    chooseType(item) {
      console.log(item, "id");
      this.listByCode.forEach((v) => {
        if (v.id === item.id) {
          v.isCheck = !v.isCheck;
          const index = this.chooseId.indexOf(item.id);
          if (v.isCheck == true) {
            if (this.chooseId.length > 2) {
              wx.showToast({
                title: "只能选择三项",
                icon: "error",
              });
              v.isCheck = false;
              return false;
            } else {
              this.chooseId.push(item.id);
            }
          } else {
            this.chooseId.splice(index, 1);
          }
        }
      });
    },
    /**
     * @description:取消
     */
    handleCancel() {
      this.$emit("closeWindows", "cancel");
    },

    /**
     * @description:确定提交
     */
    async handleConfirm() {
      if (this.addList.length === 0 && (this.checkItem === "其他" || !this.checkItem)) {
        wx.showToast({
          title: "请选择脆弱人群",
          icon: "error",
        });
        return false;
      } else {
        if (this.selectItem) {
          console.log(this.selectItem, "this.selectItem");
          this.tempArr = this.addList.filter((v) => v.id === this.selectItem.id);
          this.tempArr = this.tempArr.map((v) => v.id);
          if (this.tempArr.length === 0 && this.checkItem === "其他") {
            wx.showToast({
              title: "请选择一位脆弱人群",
              icon: "none",
            });
            return false;
          }
        }
        await this.getCheck();
      }
    },
    /**
     * @description:添加其他脆弱人群
     */
    async handleAddCaring() {
      wx.navigateTo({
        url: "/pages/garbageClassification/mutualAssistance/components/searchCaregivers",
      });
    },
    /**
     * @description:校验求助人员是否已存在未完成需求
     */
    getCheck() {
      let request = {
        id: this.checkItem === "其他" ? this.tempArr[0] : this.helpContactorId,
      };
      getServiceRequirementsCheck(request).then((res) => {
        if (res.data.code === 0) {
          if (this.checkItem === "其他" && res.data.flag === 1) {
            wx.showToast({
              title: this.notContinue,
              icon: "none",
            });
            return false;
          } else if (this.checkItem === "本人" && res.data.flag === 1) {
            this.showDialog = true;
          } else {
            this.getServiceRequire();
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
        console.log(res, "校验求助人员是否已存在未完成需求");
      });
    },
    getServiceRequire() {
      let request = {
        helpContactorId: this.helpContactorId, //本人id
        needSource: 1,
        needTypeIds: this.chooseId, //需求类型
        ids: this.tempArr, //其他人id
        description: this.chatm, //情况描述
        recordingAttachments: this.currentList, //录音文件
      };
      getServiceRequirements(request).then((res) => {
        if (res.data.code === 0) {
          wx.showToast({
            title: "需求发布成功",
            icon: "success",
          });
          this.$emit("closeWindows", "submit");
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
        console.log(res, "提交后返回的");
      });
    },
    /**
     * @description:取消弹窗
     */
    handleCancelDialog() {
      this.showDialog = false;
      console.log("取消");
    },
    /**
     * @description:继续
     */
    handleConfirmDialog() {
      this.getServiceRequire();
    },
  },
  created() {},
});
</script>
<style lang="less" scoped>
.care {
  .care_header {
    // position: relative;
    .flex-box {
      display: flex;
      flex-wrap: wrap;
      padding-left: 25rpx;
      // height: 380rpx;
      // overflow-y: auto;
      .second-box {
        width: 222rpx;
        height: 70rpx;
        line-height: 70rpx;
        text-align: center;
        background-color: #f6f5f8;
        color: #474747;
        font-size: 24rpx;
        margin: 15rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .activeBox {
        background-color: #e1f4ff;
        color: #0093fd;
        position: relative;
      }
      .activeBox::before {
        content: "";
        width: 0;
        height: 0;
        border-top: 40rpx solid #0093fd;
        border-left: 40rpx solid transparent;
        position: absolute;
        right: 0;
        top: 0;
      }
      .activeBox::after {
        content: "√";
        color: #fff;
        position: absolute;
        right: 0;
        top: -32%;
        margin-right: 5rpx;
        transform: rotate(8deg);
      }
    }
    .add {
      .careList {
        // width: 152rpx;
        display: flex;
        flex-wrap: wrap;
        padding-left: 42rpx;
        margin-top: 25rpx;
        .careList_item {
          margin-right: 25rpx;
          margin-bottom: 20rpx;
          .careList_item_wrap {
            position: relative;
            .care_img {
              .care_item {
                width: 152rpx;
                height: 152rpx;
              }
              .activeSelect {
                border: 4rpx solid #0091ff;
              }
            }
            .care_name {
              position: absolute;
              text-align: center;
              margin-bottom: 11rpx;
              bottom: 0;
              // width: 152rpx;
              height: 44rpx;
              background: #000000;
              opacity: 0.51;
              .name {
                font-size: 24rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
              }
            }
            .care_close {
              width: 44rpx;
              height: 44rpx;
              position: absolute;
              top: 0;
              right: 0;
              margin-top: -16rpx;
              margin-right: -10rpx;
            }
          }
        }
      }
      .addBtn {
        width: 140rpx;
        height: 140rpx;
        border: 1rpx dashed #cccccc;
        text-align: center;
        margin: 6rpx 15rpx 15rpx 42rpx;
        .care {
          width: 53rpx;
          height: 58rpx;
          margin-top: 20rpx;
        }
        .careMsg {
          font-size: 26rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #999999;
          line-height: 28rpx;
        }
      }
    }
    .turnType {
      margin-bottom: 10rpx;
      .turnType_msg {
        .msg {
          font-size: 24rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 33rpx;
          margin: 30rpx 0rpx 21rpx 42rpx;
        }
      }
      .turnType_msg_item {
        display: flex;
        flex-wrap: wrap;
        .second-box {
          width: 222rpx;
          height: 70rpx;
          line-height: 70rpx;
          text-align: center;
          background-color: #f6f5f8;
          color: #474747;
          font-size: 24rpx;
          margin: 15rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .activeBox {
          background-color: #e1f4ff;
          color: #0093fd;
          position: relative;
        }
        .activeBox::before {
          content: "";
          width: 0;
          height: 0;
          border-top: 40rpx solid #0093fd;
          border-left: 40rpx solid transparent;
          position: absolute;
          right: 0;
          top: 0;
        }
        .activeBox::after {
          content: "√";
          color: #fff;
          position: absolute;
          right: 0;
          top: -28%;
          transform: rotate(8deg);
          maring-right: 10rpx;
        }
      }
    }
    .phoneticWriting {
      margin: 10rpx auto;
      width: 96%;
      background: #f5f6f7;
      padding: 22rpx 0 22rpx 32rpx;
      .voiceList {
        .list-item {
          display: flex;
          justify-content: space-between;
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
      .remark {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 42rpx;
        max-width: 688rpx;
        word-wrap: break-word;
      }
    }
    .opertion {
      display: flex;
      justify-content: space-around;
      // position: absolute;
      .cancel {
        width: 375rpx;
        height: 90rpx;
        background: #e8f2fc;
        text-align: center;
        line-height: 90rpx;
        color: #0091ff;
      }
      .submit {
        width: 375rpx;
        height: 90rpx;
        background: #0091ff;
        text-align: center;
        line-height: 90rpx;
        color: #ffffff;
      }
    }
  }
}
</style>
