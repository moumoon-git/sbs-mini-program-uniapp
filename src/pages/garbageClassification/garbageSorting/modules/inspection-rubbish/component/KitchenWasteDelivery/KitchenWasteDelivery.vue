<template lang="">
<div class="deliveryContent">
    <LocationBox
      :location.sync="location"
      :longitude.sync="longitude"
      :latitude.sync="latitude"
      :isInRange.sync="isInRange"
      ref="LocationBox"
    ></LocationBox>
    <header>
      <view class="headerTips">
        <view class="deliveryRecord">
        今日收运记录
        </view>
        <view class='deliveryNum'>收运次数:<text class='deliveryNumItem'>{{ `${totalNum}`}}</text></view>
      </view>
    </header>
    <section class="content" v-if='cardList.length>0'>
      <view
        class="list" 
        v-for="(cardItem, cardIndex) in cardList"
        @click="handleViewCardDetail(cardItem)"
        :key="cardIndex"
      >
        <view class="card-content">
          <view class="card-content-left">
            <text>{{ cardItem.collectionTimeString }}</text>
          </view>
          <view class="card-content-right">
            <text>收运总量:</text>
            <text>{{ `${cardItem.sumWaste}(桶)` }}</text>
          </view>
        </view>
        <van-icon name="arrow" />
      </view>
	  </section>
    
    <block v-else>
			<van-empty class="empty" description="暂无数据" />
		</block>
    <view
      round
      type="info"
      size="normal"
      :class="!isInRange?'discollecting':'start-collecting-barrels'"
      @click='handleCollector'
      >开始收运</view
    >
    <van-action-sheet
      :show="actionSheetShow"
      :title="type == 1 ? '收运登记' : '收运详情'"
      round
      @close="handleActionSheetClose"
    >
      <van-cell-group>
        <van-cell title="厨余垃圾(桶)">
          <slot>
            <van-stepper
              :disabled="type == 0"
              :value="form.foodWaste"
              min="0"
              step="0.25"
              @change="handleFoodWasteChange"
            />
          </slot>
        </van-cell>
        <van-cell
          v-if="(type==0 && form.imgList.length != 0) || type==1"
          center
          title="拍照"
          use-label-slot
        >
          <view slot="label">
            <van-uploader
              v-if="type == 1"
              :capture="['camera']"
              :file-list="form.imgList"
              upload-icon="photograph"
              @after-read="afterRead"
            >
            </van-uploader>
            <block v-else>
              <van-image
                v-for="(imgItem, imgIndex) in form.imgList"
                :key="imgIndex"
                width="200rpx"
                height="200rpx"
                :src="imgItem.url"
              />
            </block>
          </view>
        </van-cell>
        <van-cell center title="备注" use-label-slot>
          <view slot="label">
            <van-field
              :disabled="type == 0"
              :value="form.remark"
              placeholder="请再次输入备注(选填)"
              :border="false"
              @change="handleRemarkChange"
            />
          </view>
        </van-cell>
      </van-cell-group>
      <view class="action-sheet-footer">
        <view class="action-sheet-footer-total">
          <text>总量</text>
          <text>{{
            `共${form.foodWaste +
              form.otherWaste +
              form.recyclableWaste +
              form.harmfulWaste}桶`
          }}</text>
        </view>
        <view
          v-if="type == 1"
          class="action-sheet-footer-submit"
          @click="handleSubmit"
        >
          确认
        </view>
      </view>
    </van-action-sheet>
      <van-overlay :show="uploadLoading">
      <view class="overlay-wrapper">
        <van-loading type="spinner" vertical color="white"
          >上传中...</van-loading
        >
      </view>
    </van-overlay>
  </div>
</template>
<script>
import { getWasteCollection, saveKitchenRegister } from "@/apis/index.js";
import LocationBox from '@/pages/custom-components/location-box/LocationBox.vue';
import config from "@/static/config/index.js";
export default {
  props: {
    titleParams: {
      type: Object,
    },
  },
  data() {
    return {
      id: "",
      taskId: "",
      title: "",
      actionSheetShow: false,
      type: 1, //查看详情为0，新增为1
      cardList: [],
      totalNum: "",
      form: {
        foodWaste: 0,
        otherWaste: 0,
        recyclableWaste: 0,
        harmfulWaste: 0,
        imgList: [],
        remark: "",
      },
      uploadLoading: false,
      location: '',
      latitude: '',
      longitude: '',
      isInRange: false,
    };
  },
  components: {
    LocationBox,
  },
  methods: {
    // 请求数据
    init(id, taskId) {
      this.id = id;
      this.taskId = taskId;
      this.$nextTick(() => {
        this.$refs.LocationBox.refresh(this.titleParams);
      });
      this.getCardList();
    },
    getCardList() {
      const requestData = {
        limit: 1000,
        page: 1,
        startTime: "",
        endTime: "",
        type: "2",
        pointId: this.id,
      };
      getWasteCollection(requestData).then((data) => {
        if (data.data.code == 0) {
          this.cardList = data.data.data.pageUtils.list;
          this.totalNum = data.data.data.totalNum;
        } else {
          wx.showToast({
            title: data.msg,
            icon: "error",
          });
        }
      });
    },
    handleCollector() {
      if (!this.isInRange) {
        uni.showToast({
          title: '未进入收运范围',
          icon: 'error',
        });
        return;
      }
      this.actionSheetShow = true;
      this.type = 1;
    },
    // 关闭收运弹窗
    handleActionSheetClose(value) {
      this.actionSheetShow = false;
      setTimeout(()=>{
        this.form = {
          foodWaste: 0,
          otherWaste: 0,
          recyclableWaste: 0,
          harmfulWaste: 0,
          imgList: [],
          remark: "",
        };
      },500)

    },
    //确认
    handleSubmit() {
      const request = {
        foodWaste: this.form.foodWaste,
        otherWaste: this.form.otherWaste,
        recyclableWaste: this.form.recyclableWaste,
        harmfulWaste: this.form.harmfulWaste,
        memberId: wx.getStorageSync("userId"),
        pointId: this.id,
        remark: this.form.remark,
        pictureIds: this.form.imgList.map((item) => item.id),
        type: "2",
      };
      saveKitchenRegister(request).then(({ data }) => {
        if (data.code == 0) {
          wx.showToast({
            title: "收运成功",
            icon: "success",
          });
          this.getCardList();
          this.handleActionSheetClose();
        } else {
          wx.showToast({
            title: data.msg,
            icon: "error",
          });
        }
      });
    },
    handleFoodWasteChange(event) {
      this.form.foodWaste = event.detail;
    },
    handleOtherWasteChange(event) {
      this.form.otherWaste = event.detail;
    },
    handleRecyclableWasteChange(event) {
      this.form.recyclableWaste = event.detail;
    },
    handleHarmfulWasteChange(event) {
      this.form.harmfulWaste = event.detail;
    },
    handleRemarkChange(event) {
      this.form.remark = event.detail;
    },
    afterRead(event) {
      const { name, file } = event.detail;
      let uploadImages = [];
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      if (file instanceof Array) {
        uploadImages.push(...file);
      } else {
        uploadImages.push(file);
      }
      let that = this;
      uploadImages.forEach((item) => {
        that.uploadLoading = true;
        wx.uploadFile({
          url: `${config.host}/fileupload/appAttachment/fileUploadAttachments`, // 仅为示例，非真实的接口地址
          filePath: item.url,
          name: "files",
          header: {
            "content-type": "multipart/form-data",
            token: wx.getStorageSync("token"),
            type: 14,
          },
          formData: {
            "content-type": "multipart/form-data",
            charset: "utf-8",
            files: item.url,
            type: "14",
          },
          success: (res) => {
            let data = JSON.parse(res.data);

            if (data.errorcode === 0) {
              wx.showToast({
                title: "上传成功",
                icon: "success",
              });
              that.form.imgList.push({
                name: data.data[0].name,
                url: config.fileHost + data.data[0].url,
                id: data.data[0].id,
              });
            }
          },
          fail: (res) => {
            console.log("fail", res);
          },
          complete: (res) => {
            console.log("complete", res);
            that.uploadLoading = false;
          },
        });
      });
    },
    handleViewCardDetail(event) {
      this.$http
        .get({
          url: `/garbage/kitchenRegister/info/${event.id}`,
        })
        .then(({ data }) => {
          if (data.code == 0) {
            if (data.data.pictures) {
              this.form.imgList = data.data.pictures.map((item) => {
                return {
                  name: item.vcFilename,
                  url: config.fileHost + item.vcUrl,
                  id: item.iid,
                };
              });
            }
            this.form.foodWaste = data.data.foodWaste;
            this.form.otherWaste = data.data.otherWaste;
            this.form.recyclableWaste = data.data.recyclableWaste;
            this.form.harmfulWaste = data.data.harmfulWaste;
            this.form.remark = data.data.remark;
            this.handleCollector();
            this.type = 0;
          } else {
            wx.showToast({
              title: data.msg,
              icon: "error",
            });
          }
        });
    },
  },
};
</script>
<style lang="less">
.deliveryContent {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  .headerTips {
    display: flex;
    justify-content: space-between;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    margin-bottom: 20rpx;
    margin-top: 15rpx;
    .deliveryRecord::before {
      display: block;
      content: "";
      width: 6rpx;
      height: 28rpx;
      margin: 10rpx 10rpx 10rpx;
      background: #0091ff;
    }
    .deliveryRecord {
      display: flex;
      color: #333333;
      line-height: 50rpx;
      padding-left: 20rpx;
    }
    .deliveryNum {
      margin-right: 38rpx;
      color: #666666;
      .deliveryNumItem {
        color:#333333;
        margin-left: 8rpx;
      }
    }
  }
  .content {
    box-sizing: border-box;
    padding: 0rpx 30rpx;
    height: calc(100vh - 420rpx);
    overflow-y: auto;
    .list:not(last-child) {
      margin-bottom: 20rpx;
    }
    .list {
      background: #ffffff;
      box-shadow: 0px 4px 40px -10px rgba(0, 0, 0, 0.1);
      border-radius: 8rpx;
      box-sizing: border-box;
      padding: 40rpx 20rpx;
      margin-top: 20rpx;
      display: flex;
      justify-content: space-between;
      position: relative;
      .card-content{
        .card-content-left,
        .card-content-right {
          color: #333;
          margin-left: 16rpx;
        }
        .card-content-right {
          margin-top: 40rpx;
            & text:first-child {
            color: #999999;
            margin-bottom: 20rpx;
            margin-right: 10rpx;
          }
        }
      }
      /deep/ .van-icon.van-icon-arrow {
        position: absolute;
        right: 5%;
      }

    }
  }
  .empty{
    height: calc(100vh - 498rpx);
    display: block;
  }
  .discollecting{
    padding: 30rpx 0rpx;
    width: 90%;
    font-size: 40rpx;
    height: initial;
    line-height: initial;
    background: linear-gradient(360deg, #B3B3B3 0%, #E6E6E6 100%);
    box-shadow: 0px 6px 12px 0px rgba(12, 126, 161, 0.35);
    border-radius: 75px;
    color: #ffffff;
    text-align: center;
    margin-left: 37rpx;
    margin-bottom: 5rpx;
  }
  .start-collecting-barrels{
      padding: 30rpx 0rpx;
      width: 90%;
      font-size: 40rpx;
      height: initial;
      line-height: initial;
      background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
      box-shadow: 0px 6px 12px 0px rgba(12, 126, 161, 0.35);
      border-radius: 75px;
      color: #ffffff;
      text-align: center;
      margin-left: 37rpx;
      margin-bottom: 5rpx;
  }
  .action-sheet-footer {
    border-top: 1rpx solid #dddddd;
    display: flex;
    align-items: center;
    min-height: 120rpx;
    &-total {
      color: #999999;
      margin-left: 40rpx;
      & text:nth-of-type(2) {
        color: #0091ff;
        margin-left: 10rpx;
      }
    }
    &-submit {
      background: #0091ff;
      color: #ffffff;
      padding: 40rpx 80rpx;
      margin-left: auto;
    }
  }
}
</style>
