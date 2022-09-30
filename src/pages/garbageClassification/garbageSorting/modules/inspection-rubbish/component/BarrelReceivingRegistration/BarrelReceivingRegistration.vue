<template>
  <view class="container">
    <LocationBox
      :location.sync="location"
      :longitude.sync="longitude"
      :latitude.sync="latitude"
      :isInRange.sync="isInRange"
      ref="LocationBox"
    ></LocationBox>
    <header>
      <view class="header-pannel">
        <text class="header-title">今日收桶记录</text>
        <view class="header-statistics">
          <text class="header-statistics-name">垃圾总量：</text>
          <text>{{ `${totalNum ? totalNum : 0}桶` }}</text>
        </view>
      </view>
    </header>
    <section class="content">
      <block v-if="cardList.length != 0">
        <view
          class="card"
          v-for="(cardItem, cardIndex) in cardList"
          :key="cardIndex"
          @click="handleViewCardDetail(cardItem)"
        >
          <view class="card-header">
            <text class="card-header-date">{{
              `${cardItem.collectionTime}`
            }}</text>
            <text class="card-header-personnel">{{
              `当班人员：${cardItem.mailContactorEntity.name}`
            }}</text>
          </view>
          <view class="card-content">
            <view class="card-content-row">
              <text>{{ `厨余垃圾：${cardItem.foodWaste}桶` }}</text>
              <text>{{ `可回收垃圾：${cardItem.recyclableWaste}桶` }}</text>
            </view>
            <view class="card-content-row">
              <text>{{ `有害垃圾：${cardItem.harmfulWaste}桶` }}</text>
              <text>{{ `其他垃圾：${cardItem.otherWaste}桶` }}</text>
            </view>
          </view>
        </view>
      </block>
      <block v-else>
        <van-empty description="暂无数据" />
      </block>
    </section>
    <van-button
     :class="!isInRange?'dis-start-collecting-barrels':'start-collecting-barrels'"
      round
      type="info"
      size="normal"
      @click="startCollectingBarrels"
      >开始收桶</van-button
    >
    <van-action-sheet
      :show="actionSheetShow"
      :title="type == 1 ? '收桶登记' : '收桶详情'"
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
        <van-cell title="其他垃圾(桶)">
          <slot>
            <van-stepper
              :disabled="type == 0"
              :value="form.otherWaste"
              min="0"
              step="0.25"
              @change="handleOtherWasteChange"
            />
          </slot>
        </van-cell>
        <van-cell title="可回收垃圾(桶)">
          <slot>
            <van-stepper
              :disabled="type == 0"
              :value="form.recyclableWaste"
              min="0"
              step="0.25"
              @change="handleRecyclableWasteChange"
            />
          </slot>
        </van-cell>
        <van-cell title="有害垃圾(桶)">
          <slot>
            <van-stepper
              :disabled="type == 0"
              :value="form.harmfulWaste"
              min="0"
              step="0.25"
              @change="handleHarmfulWasteChange"
            />
          </slot>
        </van-cell>
        <van-cell
          v-if="(type == 0 && form.imgList.length != 0) || type == 1"
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
                :data-src="imgItem.url"
                @click="handlePreviewImage"
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
          确认收桶
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
  </view>
</template>

<script>
import { defineComponent } from 'vue';
import config from '@/static/config/index.js';
import LocationBox from '@/pages/custom-components/location-box/LocationBox.vue';
export default defineComponent({
  name: 'BarrelReceivingRegistration',
  props: {
    titleParams: {
      type: Object,
    },
  },
  data() {
    return {
      id: '',
      taskId: '',
      cardList: [],
      totalNum: '',
      actionSheetShow: false,
      form: {
        foodWaste: 0,
        otherWaste: 0,
        recyclableWaste: 0,
        harmfulWaste: 0,
        imgList: [],
        remark: '',
      },
      uploadLoading: false,
      type: 1, //查看详情为0，新增为1
      location: '',
      latitude: '',
      longitude: '',
      isInRange: false,
    };
  },
  components: {
    LocationBox,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  methods: {
    // 请求数据
    init(id, taskId) {
      console.log(
        '%c [ this.titleParams ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        this.titleParams
      );
      this.id = id;
      this.taskId = taskId;
      this.$nextTick(() => {
        this.$refs.LocationBox.refresh(this.titleParams);
      });
      this.getCardList();
    },
    getCardList() {
      this.$http
        .post({
          url: '/garbage/collectionRegister/listPage',
          data: {
            limit: 1000,
            page: 1,
            memberId: '',
            pointId: this.id,
          },
        })
        .then(({ data }) => {
          console.log('/garbage/collectionRegister/listPage data', data);
          if (data.code == 0) {
            this.cardList = data.data.pageUtils.list;
            this.totalNum = data.data.sumWaste;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    startCollectingBarrels() {
      if (!this.isInRange) {
        uni.showToast({
          title: '未进入收桶范围',
          icon: 'error',
        });
        return;
      }
      this.actionSheetShow = true;
      this.type = 1;
    },
    handleActionSheetClose(value) {
      this.actionSheetShow = false;
      this.form = {
        foodWaste: 0,
        otherWaste: 0,
        recyclableWaste: 0,
        harmfulWaste: 0,
        imgList: [],
        remark: '',
      };
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
      console.log('afterRead', event);
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
        console.log(item);
        that.uploadLoading = true;
        wx.uploadFile({
          url: `${config.host}/fileupload/appAttachment/fileUploadAttachments`, // 仅为示例，非真实的接口地址
          filePath: item.url,
          name: 'files',
          header: {
            'content-type': 'multipart/form-data',
            token: wx.getStorageSync('token'),
            type: 14,
          },
          formData: {
            'content-type': 'multipart/form-data',
            charset: 'utf-8',
            files: item.url,
            type: '14',
          },
          success: (res) => {
            console.log(
              '/fileupload/appAttachment/fileUploadAttachments res',
              res
            );
            let data = JSON.parse(res.data);

            if (data.errorcode === 0) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
              });
              that.form.imgList.push({
                name: data.data[0].name,
                url: config.fileHost + data.data[0].url,
                id: data.data[0].id,
              });
            }
          },
          fail: (res) => {
            console.log('fail', res);
          },
          complete: (res) => {
            console.log('complete', res);
            that.uploadLoading = false;
          },
        });
      });
    },
    handleSubmit() {
      this.$http
        .post({
          url: '/garbage/collectionRegister/save',
          data: {
            foodWaste: this.form.foodWaste,
            otherWaste: this.form.otherWaste,
            recyclableWaste: this.form.recyclableWaste,
            harmfulWaste: this.form.harmfulWaste,
            memberId: wx.getStorageSync('userId'),
            pointId: this.id,
            remark: this.form.remark,
            pictureIds: this.form.imgList.map((item) => item.id),
          },
        })
        .then(({ data }) => {
          console.log('/garbage/collectionRegister/save data', data);
          if (data.code == 0) {
            wx.showToast({
              title: '收桶成功',
              icon: 'success',
            });
            this.getCardList();
            this.handleActionSheetClose();
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    handleViewCardDetail(event) {
      console.log('handleViewCardDetail event', event);
      this.$http
        .get({
          url: `/garbage/collectionRegister/info/${event.id}`,
        })
        .then(({ data }) => {
          console.log(
            `/garbage/collectionRegister/info/${event.id} data`,
            data
          );
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
            this.startCollectingBarrels();
            this.type = 0;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    // 预览图片
    handlePreviewImage(event) {
      wx.previewImage({
        current: event.currentTarget.dataset.src, // 当前显示图片的http链接
        urls: [event.currentTarget.dataset.src], // 需要预览的图片http链接列表
      });
    },
  },
});
</script>
<style lang="less" scoped>
.container {
	display: block;
	overflow: hidden;
	position: relative;
	box-sizing: border-box;
	padding: 0rpx;
	height: calc(100vh - 202rpx);
	background: rgba(245, 245, 245, .8);
	header {
		box-sizing: border-box;
		margin-top: 30rpx;
		padding: 0rpx 30rpx;
		.header-pannel {
			display: flex;
			position: relative;
			align-items: center;
			font-weight: 800;
			color: #333;
			&:before {
				display: inline-block;
				width: 4rpx;
				height: 30rpx;
				background: #0091ff;
				content: "";
			}
			.header-title {
				margin-left: 10rpx;
			}
			.header-statistics {
				position: absolute;
				right: 0;
				.header-statistics-name {
					color: #666;
				}
			}
		}
	}
	.content {
		overflow: auto;
		box-sizing: border-box;
		margin-top: 30rpx;
		padding: 0rpx 30rpx;
		height: 830rpx;
		.card {
			box-sizing: border-box;
			margin-top: 20rpx;
			padding: 0rpx 30rpx;
			border-radius: 8rpx;
			background: #fff;
			box-shadow: 0 4px 40px -10px rgba(0, 0, 0, .1);
			&:first-of-type {
				margin-top: 0rpx;
			}
			.card-header {
				position: relative;
				padding: 30rpx 0rpx;
				line-height: 28rpx;
				font-weight: 800;
				font-size: 28rpx;
				color: #333;
				&:after {
					display: block;
					position: absolute;
					bottom: 0;
					width: 100%;
					height: 2rpx;
					background: #eee;
					content: "";
				}
				.card-header-date {
					display: inline-block;
					overflow: hidden;
					width: 350rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.card-header-personnel {
					position: absolute;
					right: 0;
				}
			}
			.card-content {
				padding: 10rpx 0rpx;
				line-height: 24rpx;
				font-size: 24rpx;
				color: #999;
				.card-content-row {
					position: relative;
					margin: 20rpx 0rpx;
					text {
						&:nth-of-type(2) {
							position: absolute;
							right: 0;
						}
					}
				}
			}
		}
	}
	.start-collecting-barrels {
		/deep/ .van-button {
			position: absolute;
			left: 50%;
			bottom: 3%;
			padding: 30rpx 0rpx;
			border-radius: 75px;
			width: 90%;
			height: initial;
			background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
			box-shadow: 0 6px 12px 0 rgba(12, 126, 161, .35);
			line-height: initial;
			font-size: 40rpx;
			transform: translateX(-50%);
		}
	}
  .dis-start-collecting-barrels{
    	/deep/ .van-button {
        background: linear-gradient(360deg, #B3B3B3 0%, #E6E6E6 100%);
        left: 50%;
        bottom: 3%;
        padding: 30rpx 0rpx;
        border-radius: 75px;
        width: 90%;
        height: initial;
        box-shadow: 0 6px 12px 0 rgba(12, 126, 161, .35);
        line-height: initial;
        font-size: 40rpx;
        transform: translateX(-50%);
      }
      /deep/ .van-button--info {
        border-color:#ddd ;
      }
  }
	/deep/ van-action-sheet {
		.van-cell {
			& .van-cell__title {
				display: flex;
				align-items: center;
			}
			&.van-cell--center {
				& .van-cell__title {
					display: block;
				}
			}
			&.field-index--van-field {
				& .van-cell__title {
					flex: initial;
					margin-right: initial !important;
					min-width: initial !important;
					max-width: initial !important;
				}
			}
		}
		.action-sheet-footer {
			display: flex;
			align-items: center;
			border-top: 1rpx solid #ddd;
			min-height: 120rpx;
			&-total {
				margin-left: 40rpx;
				color: #999;
				& text:nth-of-type(2) {
					margin-left: 10rpx;
					color: #0091ff;
				}
			}
			&-submit {
				margin-left: auto;
				padding: 40rpx 80rpx;
				background: #0091ff;
				color: #fff;
			}
		}
	}
}

</style>
