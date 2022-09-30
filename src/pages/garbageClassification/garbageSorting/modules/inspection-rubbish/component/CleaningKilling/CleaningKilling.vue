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
        <text class="header-title">今日保洁记录</text>
        <view class="header-statistics">
          <text class="header-statistics-name">保洁次数：</text>
          <text>{{ totalNum ? totalNum : 0 }}</text>
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
          <view class="card-content-left">
            <text>保洁时间</text>
            <text>{{ cardItem.cleanTimeString }}</text>
          </view>
          <view class="card-content-right">
            <text>保洁人员</text>
            <text>{{ cardItem.mailContactorName }}</text>
          </view>
          <van-icon name="arrow" />
        </view>
      </block>
      <block v-else>
        <van-empty description="暂无数据" />
      </block>
    </section>
    <van-button
      :class="!isInRange?'dis-start-cleaning-killing':'start-cleaning-killing'"
      round
      type="info"
      size="normal"
      @click="startCleaningKilling"
      >开始保洁</van-button
    >
    <van-action-sheet
      :show="actionSheetShow"
      :title="type == 1 ? '开始保洁' : '保洁详情'"
      round
      @close="handleActionSheetClose"
    >
      <view v-if="type == 0" class="cleaning-killing-record">
        <text class="cleaning-killing-record-date">{{
          `保洁时间：${form.cleanTimeString}`
        }}</text>
        <text class="cleaning-killing-record-personnel">{{
          form.mailContactorName
        }}</text>
      </view>
      <van-cell-group>
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
      <view v-if="type == 1" class="action-sheet-footer">
        <van-button
          class="action-sheet-footer-submit"
          round
          type="info"
          size="normal"
          @click="handleSubmit"
          >开始保洁</van-button
        >
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
  name: 'CleaningKilling',
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
        imgList: [],
        remark: '',
        cleanTimeString: '',
        mailContactorName: '',
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
          url: '/garbage/cleanRegister/listPage',
          data: {
            limit: 1000,
            page: 1,
            memberId: '',
            pointId: this.id,
          },
        })
        .then(({ data }) => {
          console.log('/garbage/cleanRegister/listPage data', data);
          if (data.code == 0) {
            this.cardList = data.data.list;
            this.totalNum = data.totalNum;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    startCleaningKilling() {
      if (!this.isInRange) {
        uni.showToast({
          title: '未进入保洁范围',
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
        imgList: [],
        remark: '',
        cleanTimeString: '',
        mailContactorName: '',
      };
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
                name: data.data[0].filename,
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
    handleViewCardDetail(event) {
      console.log('handleViewCardDetail event', event);
      this.$http
        .get({
          url: `/garbage/cleanRegister/info/${event.id}`,
        })
        .then(({ data }) => {
          console.log(`/garbage/cleanRegister/info/${event.id} data`, data);
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
            this.form.remark = data.data.remark;
            this.form.cleanTimeString = data.data.cleanTimeString;
            this.form.mailContactorName = data.data.mailContactorName;
            this.startCleaningKilling();
            this.type = 0;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    handleSubmit() {
      this.$http
        .post({
          url: '/garbage/cleanRegister/save',
          data: {
            memberId: wx.getStorageSync('userId'),
            pointId: this.id,
            remark: this.form.remark,
            pictureIds: this.form.imgList.map((item) => item.id),
          },
        })
        .then(({ data }) => {
          console.log('/garbage/cleanRegister/save data', data);
          if (data.code == 0) {
            wx.showToast({
              title: '保洁成功',
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
			display: flex;
			position: relative;
			box-sizing: border-box;
			margin-top: 20rpx;
			padding: 40rpx 60rpx;
			border-radius: 8rpx;
			background: #fff;
			box-shadow: 0 4px 40px -10px rgba(0, 0, 0, .1);
			&:first-of-type {
				margin-top: 0rpx;
			}
			.card-content-left,
			.card-content-right {
				color: #969799;
				& text {
					display: block;
				}
				& text:first-child {
					margin-bottom: 20rpx;
					color: #000;
				}
			}
			.card-content-right {
				margin-left: 60rpx;
			}
			/deep/ .van-icon.van-icon-arrow {
				position: absolute;
				right: 5%;
			}
		}
	}
	.start-cleaning-killing,
	.action-sheet-footer-submit {
		/deep/ .van-button {
			display: block;
			padding: 30rpx 0rpx;
			border-radius: 75px;
			width: 90%;
			height: initial;
			background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
			box-shadow: 0 6px 12px 0 rgba(12, 126, 161, .35);
			line-height: initial;
			font-size: 40rpx;
		}
	}
	.start-cleaning-killing {
		/deep/ .van-button {
			position: absolute;
			left: 50%;
			bottom: 3%;
			transform: translateX(-50%);
		}
	}
  .dis-start-cleaning-killing{
    	/deep/ .van-button {
        display: block;
        padding: 30rpx 0rpx;
        border-radius: 75px;
        width: 90%;
        height: initial;
        background: linear-gradient(360deg, #B3B3B3 0%, #E6E6E6 100%);
        box-shadow: 0 6px 12px 0 rgba(12, 126, 161, .35);
        line-height: initial;
        font-size: 40rpx;
      }
      /deep/ .van-button--info {
        border-color:#ddd ;
      }
  }

	/deep/ van-action-sheet {
		.cleaning-killing-record {
			display: flex;
			box-sizing: border-box;
			margin: 0rpx 30rpx;
			padding: 20rpx 30rpx;
			border-radius: 80rpx;
			background: #f2f3f5;
			color: #333;
			&-personnel {
				margin-left: auto;
			}
		}
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
			padding: 30rpx 0rpx;
			border-top: 1rpx solid #ddd;
		}
	}
}

</style>
