<template>
  <view class="container">
    <van-tabs v-model:active="active" animated @change="handleTabChange">
      <van-tab title="工单信息">
        <view class="card-wrap">
          <view class="card">
            <i
              v-if="workOrderManagementDetail.status == 0"
              class="card-status-icon disposing"
            ></i>
            <i
              v-if="workOrderManagementDetail.status == 1"
              class="card-status-icon disposed"
            ></i>
            <i
              v-if="workOrderManagementDetail.status == -1"
              class="card-status-icon cancelled"
            ></i>
            <view class="card-header">
              <text class="card-header-title">基本详情</text>
            </view>
            <view class="card-content form">
              <view
                v-if="workOrderManagementDetail.pointName"
                class="form-item"
              >
                <text class="form-name">巡查点名称</text>
                <text class="form-value">{{
                  workOrderManagementDetail.pointName
                }}</text>
              </view>
              <view
                v-if="workOrderManagementDetail.pointArea"
                class="form-item"
              >
                <text class="form-name">所属区域</text>
                <text class="form-value">{{
                  workOrderManagementDetail.pointArea
                }}</text>
              </view>

              <view
                v-if="workOrderManagementDetail.workModuleString"
                class="form-item"
              >
                <text class="form-name">工单类型</text>
                <text class="form-value">{{
                  workOrderManagementDetail.workModuleString
                }}</text>
              </view>
              <view v-if="workOrderManagementDetail.name" class="form-item">
                <text class="form-name">工单名称</text>
                <text class="form-value">{{
                  workOrderManagementDetail.name
                }}</text>
              </view>
              <view
                v-if="workOrderManagementDetail.workPropertyString"
                class="form-item"
              >
                <text class="form-name">工单类别</text>
                <text class="form-value">{{
                  workOrderManagementDetail.workPropertyString
                }}</text>
              </view>
              <view
                v-if="workOrderManagementDetail.handleTarget"
                class="form-item"
              >
                <text class="form-name">处置对象</text>
                <text class="form-value">{{
                  workOrderManagementDetail.handleTarget
                }}</text>
              </view>
              <view
                v-if="workOrderManagementDetail.workPlace"
                class="form-item"
              >
                <text class="form-name">工单地点</text>
                <text class="form-value"
                  >{{ workOrderManagementDetail.workPlace }}A区东大门</text
                >
              </view>
              <view
                v-if="workOrderManagementDetail.gmtCreate"
                class="form-item"
              >
                <text class="form-name">工单时间</text>
                <text class="form-value">{{
                  workOrderManagementDetail.gmtCreate
                }}</text>
              </view>
              <view
                v-if="workOrderManagementDetail.timelimit"
                class="form-item"
              >
                <text class="form-name">完成时限</text>
                <text class="form-value">{{
                  workOrderManagementDetail.timelimit
                }}</text>
              </view>
              <view v-if="workOrderManagementDetail.remark" class="form-item">
                <text class="form-name">工单内容</text>
                <text class="form-value">{{
                  workOrderManagementDetail.remark || '-'
                }}</text>
              </view>
              <!-- <view v-if="workOrderManagementDetail.remark" class="form-item">
                <text class="form-name">审核意见</text>
                <text class="form-value">{{
                  workOrderManagementDetail.remark || '-'
                }}</text>
              </view> -->
              <view
                v-if="
                  workOrderManagementDetail.imgList.length != 0 ||
                    workOrderManagementDetail.fileList.length != 0
                "
                class="form-item annex"
              >
                <text class="form-name">附件</text>
                <swiper
                  v-if="workOrderManagementDetail.imgList.length != 0"
                  :indicator-dots="true"
                  :autoplay="true"
                  interval="3000"
                  duration="500"
                  :circular="true"
                >
                  <block
                    v-for="(imgItem,
                    imgIndex) in workOrderManagementDetail.imgList"
                    :key="imgIndex"
                  >
                    <swiper-item>
                      <image
                        class="swiper-image"
                        :src="imgItem.allUrl"
                        :data-src="imgItem.allUrl"
                        @click="handlePreviewImage"
                      ></image>
                    </swiper-item>
                  </block>
                </swiper>
                <view v-if="workOrderManagementDetail.fileList.length != 0">
                  <text
                    v-for="(fileItem,
                    fileIndex) in workOrderManagementDetail.fileList"
                    :key="fileIndex"
                    class="annex-file"
                    @click="downloadFile(fileItem)"
                    >{{ fileItem.documentName }}、</text
                  >
                </view>
              </view>
            </view>
          </view>
          <view class="card">
            <view class="card-header">
              <text class="card-header-title"
                >工单处置人员{{ `(${contactorList.length}人)` }}</text
              >
              <text
                v-if="workOrderManagementDetail.mailGroupName"
                class="card-header-department"
                >处置部门：{{ workOrderManagementDetail.mailGroupName }}</text
              >
            </view>
            <view
              v-if="contactorList.length != 0"
              class="card-content scroll-auto"
            >
              <view
                v-for="(contactorItem, contactorIndex) in contactorList"
                :key="contactorIndex"
                class="user-info"
              >
                <i class="sms-icon"></i>
                <text class="user-name">{{
                  contactorItem.contactorIdString
                }}</text>
                <text
                  class="user-role"
                  :class="{
                    leader: contactorItem.type == '1',
                    participant: contactorItem.type == '2',
                  }"
                  >{{
                    contactorItem.type == '1'
                      ? '负责人'
                      : contactorItem.type == '2'
                      ? '参与人'
                      : '抄送人'
                  }}</text
                >
                <!-- <text class="user-department"
                  >{{ contactorItem.position ? contactorItem.position : ''
                  }}{{
                    contactorItem.position && contactorItem.mailGroupName
                      ? '/'
                      : ''
                  }}{{
                    contactorItem.mailGroupName
                      ? contactorItem.mailGroupName
                      : ''
                  }}</text
                > -->

                <text class="user-department">{{ contactorItem.mobile1 }}</text>
                <i
                  class="phone-icon"
                  @click="makePhoneCall(contactorItem.mobile1)"
                ></i>
              </view>
            </view>
          </view>
        </view>
        <!-- 	<van-button class="forward-work-order" round  type="info" size="normal">转发工单</van-button> -->
        <view v-if="active == 0" class="fix-btn-bottom">
          <view
            class="fin-order-btn"
            v-if="
              workOrderManagementDetail.status == '0' &&
                userId == workOrderManagementDetail.contactorId
            "
            @click="orderHandler(1)"
          >
            完成工单
          </view>
          <view
            class="fin-order-btn"
            v-if="
              workOrderManagementDetail.status != '0' &&
                userId == workOrderManagementDetail.contactorId
            "
            style="background-color: #70B603;"
            @click="orderHandler(0)"
          >
            重启工单
          </view>
          <!-- <view
            class="cancle-order-btn"
            v-if="workOrderManagementDetail.status == '0' && userId == workOrderManagementDetail.contactorId"
            @click="orderHandler(-1)"
          >
            取消工单
          </view> -->
          <view
            class="forward-btn"
            @click="handleForward"
            v-if="
              workOrderManagementDetail.status == '0' &&
                userId == workOrderManagementDetail.contactorId
            "
            >转发</view
          >
        </view>
      </van-tab>
      <van-tab title="工单办理" @click="handlePanelClick">
        <block v-if="replyList.length != 0">
          <view class="reply-block-wrap">
            <block v-for="replyItem in replyList" :key="replyItem.id">
              <view
                v-if="replyItem.documentList.length != 0 || replyItem.remark"
                class="reply-block"
              >
                <text class="reply-time">{{ replyItem.gmtCreate }}</text>
                <view
                  v-if="replyItem.contactorEntity.contactorId != userId"
                  class="reply-container"
                >
                  <view class="user-information">
                    <text class="user-name">{{
                      replyItem.contactorEntity.contactorIdString
                    }}</text>
                    <text class="user-role">{{
                      replyItem.contactorEntity.type == '-1'
                        ? '管理员'
                        : replyItem.contactorEntity.type == '1'
                        ? '负责人'
                        : replyItem.contactorEntity.type == '2'
                        ? '参与人'
                        : '抄送人'
                    }}</text>
                  </view>
                  <view class="reply-information">
                    <text
                      v-if="replyItem.contactorEntity.mailGroupName"
                      class="user-department"
                      >{{ replyItem.contactorEntity.mailGroupName }}</text
                    >
                    <text class="reply-content" v-if="replyItem.remark">
                      {{ replyItem.remark }}
                    </text>
                    <van-image
                      v-if="replyItem.documentList.length"
                      width="200rpx"
                      height="200rpx"
                      :src="fileHost + replyItem.documentList[0].url"
                      :data-src="fileHost + replyItem.documentList[0].url"
                      @click="handlePreviewImage"
                    />
                  </view>
                </view>
                <view v-else class="reply-container-me">
                  <view class="reply-information">
                    <text class="reply-content" v-if="replyItem.remark">
                      {{ replyItem.remark }}
                    </text>
                    <van-image
                      v-if="replyItem.documentList.length"
                      width="200rpx"
                      height="200rpx"
                      :src="fileHost + replyItem.documentList[0].url"
                      :data-src="fileHost + replyItem.documentList[0].url"
                      @click="handlePreviewImage"
                    />
                    <text
                      v-if="!replyItem.remark && !replyItem.documentList.length"
                      class="reply-content"
                      >{{
                        replyItem.responseType === '-1'
                          ? '取消工单'
                          : replyItem.responseType === '0'
                          ? '重启工单'
                          : '完成工单'
                      }}</text
                    >
                  </view>
                  <view class="user-information">
                    <text class="user-name">我</text>
                    <text class="user-role">{{
                      replyItem.contactorEntity.type == '-1'
                        ? '管理员'
                        : replyItem.contactorEntity.type == '1'
                        ? '负责人'
                        : replyItem.contactorEntity.type == '2'
                        ? '参与人'
                        : '抄送人'
                    }}</text>
                  </view>
                </view>
              </view>
            </block>
          </view>
        </block>

        <view v-if="active == 1" class="reply-panel-wrap">
          <van-search
            :value="fieldValue"
            use-action-slot
            @change="handleFieldChange"
            @search="handleComment"
            left-icon=""
          >
            <view slot="action">
              <van-icon
                v-if="!fieldValue"
                name="add-o"
                size="60rpx"
                @click="handlePanelClick"
              />
              <view v-if="fieldValue" class="submit-btn" @click="handleComment"
                >发送</view
              >
            </view>
          </van-search>
          <view
            class="reply-panel"
            :class="{ 'reply-panel-active': popupVisible }"
          >
            <view class="reply-panel-item img-upload">
              <van-uploader
                :file-list="imgList"
                upload-icon="photo"
                @after-read="afterRead"
                @delete="deleteFile"
              />
              <text class="img-upload-label">图片</text>
            </view>
          </view>
        </view>
        <van-overlay :show="uploadLoading">
          <view class="overlay-wrapper">
            <van-loading type="spinner" vertical color="white"
              >上传中...</van-loading
            >
          </view>
        </van-overlay>
      </van-tab>
    </van-tabs>
  </view>
</template>
<script>
import { defineComponent } from 'vue';
import config from '@/static/config/index.js';
import { getLocation } from '@/utils/hooks/useHooks.js';
export default defineComponent({
  name: 'workOrderManagement-detail',
  props: {},
  data() {
    return {
      userId: wx.getStorageSync('userId'),
      id: '',
      active: 0, //当前选中tab的标识符
      imgList: [],
      workOrderManagementDetail: {},
      contactorList: [],
      popupVisible: false, //是否显示弹出层
      fieldValue: '', //当前输入的值
      replyList: [], //聊天消息列表
      uploadLoading: false,
      fileHost: config.fileHost,
      latitude: '',
      longitude: '',
      workPlace: '',
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    this.id = options.id;
    this.getWorkOrderManagementDetail();
    const { longitude, latitude, address } = await getLocation();
    this.longitude = longitude;
    this.latitude = latitude;
    this.workPlace = address;
    // wx.getLocation({
    //   isHighAccuracy: true,
    //   success: (res) => {
    //     this.latitude = res.latitude;
    //     this.longitude = res.longitude;
    //     // console.log('wx.getLocation',res)
    //     GD2Address(this.longitude, this.latitude, (res) => {
    //       console.log('wx.getLocation', res);
    //       this.workPlace = res;
    //     });
    //   },
    // });

    // let SocketTask = wx.connectSocket({
    //   url: 'ws://192.168.1.188:8066/endpointOyzc/512/c1jtalie/websocket',
    // });
    // console.log('SocketTask wx.connectSocket',SocketTask,wx.connectSocket)
    // SocketTask.onOpen((res)=>{
    // 	console.log('SocketTask.onOpen res',res);
    // });
    // SocketTask.onMessage((res)=>{
    // 	console.log('SocketTask.onMessage res',res);
    // });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getWorkOrderManagementDetail();
  },
  methods: {
    makePhoneCall(number) {
      if (number) {
        wx.makePhoneCall({
          phoneNumber: number, //仅为示例，并非真实的电话号码
          success(res) {
            console.log(
              '%c [ xxx ]',
              'font-size:13px; background:pink; color:#bf2c9f;',
              res
            );
          },
          fail(err) {
            console.log(
              '%c [ xxx ]',
              'font-size:13px; background:pink; color:#bf2c9f;',
              err
            );
          },
        });
      }
    },
    // 下载文件
    downloadFile(file) {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        file
      );
      wx.downloadFile({
        url: file.allUrl, //仅为示例，并非真实的资源
        success(res) {
          console.log(
            '%c [ xxx ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            res
          );
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            wx.openDocument({
              filePath: res.tempFilePath,
              success: function(res) {
                console.log('打开文档成功');
              },
            });
          }
        },
      });
    },

    // 当前tab改变时触发的回调函数
    handleTabChange(name, title) {
      console.log('handleTabChange name, title', name, title);
      this.active = name.detail.index;
    },

    orderHandler(responseType) {
      const data = {
        responseType, //-1取消 0重启工单 1已完成
        workId: this.id,
        workPlace: this.workPlace,
        latitude: this.latitude,
        longitude: this.longitude,
      };
      this.$http
        .post({
          url: '/work/workHandleResponse/wechatUpdateStatus',
          data,
        })
        .then((res) => {
          console.log(
            '%c [ xxx ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            res
          );
          if (res.data.code === 0) {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
            });
            this.getWorkOrderManagementDetail();
          }
        });
    },

    getWorkOrderManagementDetail() {
      this.$http
        .get({
          url: `/work/workSheet/info/${this.id}`,
        })
        .then(({ data }) => {
          console.log(`/work/workSheet/info/${this.id} data`, data);
          if (data.code == 0) {
            if (data.data.isEndtime == '0') {
              data.data.timelimit = '无限制';
            }
            if (data.data.isEndtime !== '0') {
              if (data.data.endDate) {
                data.data.timelimit = data.data.endDate;
              }
            }
            if (data.data.documentList !== null) {
              data.data.imgList = [];
              data.data.fileList = [];
              data.data.documentList.forEach((documentItem) => {
                if (/(.png|.jpg)$/.test(documentItem.url)) {
                  data.data.imgList.push(documentItem);
                } else {
                  data.data.fileList.push(documentItem);
                }
              });
            }
            data.data.handleResponseEntities.forEach((replyItem) => {
              replyItem.contactorEntity.contactorIdString = replyItem.contactorEntity.contactorIdString.slice(
                -2
              );
            });
            this.workOrderManagementDetail = data.data;
            this.contactorList = data.data.allContactorList;
            this.replyList = data.data.handleResponseEntities;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    // 发表评论
    handleComment() {
      this.$http
        .post({
          url: '/work/workHandleResponse/wechatReply',
          data: {
            workPlace: this.workPlace,
            longitude: this.longitude,
            latitude: this.latitude,
            remark: this.fieldValue,
            workId: this.workOrderManagementDetail.id,
            handleResponseId: 0,
            documentList: this.imgList,
          },
        })
        .then(({ data }) => {
          console.log('/work/workHandleResponse/wechatReply data', data);
          if (data.code === 0) {
            this.popupVisible = false;
            this.fieldValue = '';
            this.imgList = [];
            this.getWorkOrderManagementDetail();
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    handleFieldChange(event) {
      console.log('handleFieldChange', event);
      this.fieldValue = event.detail;
    },
    handlePanelClick() {
      this.popupVisible = !this.popupVisible;
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
          url: `${config.baseUrl}/upload/passImg`, // 仅为示例，非真实的接口地址
          filePath: item.url,
          name: 'file',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            token: wx.getStorageSync('token'),
          },
          formData: {
            'content-type': 'multipart/form-data',
            charset: 'utf-8',
            file: item.url,
          },
          success: (res) => {
            console.log('/upload/passImg res', res);
            let data = JSON.parse(res.data);

            if (data.code === 0) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
              });
              that.imgList.push(data.data);
              that.popupVisible = false;
              that.handleComment();
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
    deleteFile(event) {
      console.log('onDelete', event);
      const { index } = event.detail;
    },
    // 预览图片
    handlePreviewImage(event) {
      wx.previewImage({
        current: event.currentTarget.dataset.src, // 当前显示图片的http链接
        urls: [event.currentTarget.dataset.src], // 需要预览的图片http链接列表
      });
    },
    handleForward() {
      let that = this;
      wx.navigateTo({
        url: `/pages/publicPage/workOrderManagement/modules/forwardWorkOrderManagement?contactorId=${
          that.contactorList.filter((item) => {
            return item.type == '1';
          })[0].contactorId
        }&orderId=${JSON.stringify([that.workOrderManagementDetail.id])}`,
      });
    },
  },
});
</script>
<style lang="less">
page {
	min-height: 100%;
	background: rgba(245, 245, 245, .8);
}
.container {
	display: block;
	box-sizing: border-box;
	padding: 0rpx;
	height: 100vh;
	van-tab {
		position: relative;
		height: calc(100vh - 89rpx);
	}
	.card-wrap {
		overflow: auto;
		height: calc(100vh - 200rpx);
		.card {
			overflow-y: auto;
			position: relative;
			box-sizing: border-box;
			margin: 20rpx;
			padding: 0rpx 30rpx;
			border-radius: 15rpx;
			max-height: 610rpx;
			background: white;
			.card-status-icon {
				display: inline-block;
				position: absolute;
				right: 0;
				top: 0;
				width: 80rpx;
				height: 80rpx;
				background: url(https://z3.ax1x.com/2021/10/21/5sz0fO.png) no-repeat;
				background-size: 450rpx 200rpx;
				&.disposing {
					background-position: -10rpx -32rpx;
				}
				&.disposed {
					background-position: -100rpx -32rpx;
				}
				&.cancelled {
					background-position: -188rpx -32rpx;
				}
			}
			.card-header {
				position: relative;
				padding: 30rpx 0rpx;
				border-bottom: 1px solid rgba(221, 221, 221, .5);
				color: #333;
				.card-header-title {
					font-weight: 800;
				}
				.card-header-department {
					overflow: hidden;
					position: absolute;
					right: 0;
					width: 360rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.scroll-auto {
				overflow-y: auto;
				max-height: 444rpx;
			}
			.card-content {
				padding-bottom: 30rpx;
				font-size: 28rpx;
				.form-item {
					display: flex;
					margin: 30rpx 0rpx;
					.form-name {
						display: block;
						width: 25%;
						color: #999;
						white-space: nowrap;
					}
					.form-value {
						display: block;
						flex: 1;
						margin-left: 20rpx;
						color: #333;
					}
				}
				.annex {
					display: initial;
					margin-top: 10rpx;
					swiper {
						margin-bottom: 15rpx;
						height: 350rpx;
						.swiper-image {
							width: 100%;
							height: 100%;
						}
					}
					.annex-file {
						margin-right: 15rpx;
						color: #0091ff;
					}
				}
				.user-info {
					display: flex;
					position: relative;
					align-items: center;
					margin-top: 30rpx;
					.sms-icon {
						display: inline-block;
						width: 35rpx;
						height: 30rpx;
						background: url(https://z3.ax1x.com/2021/10/21/5sz0fO.png) no-repeat;
						background-position: -430rpx -90rpx;
						background-size: 600rpx 300rpx;
					}
					.user-name {
						margin-left: 15rpx;
						color: #333;
					}
					.user-role {
						margin-left: 15rpx;
						padding: 4rpx 16rpx;
						border-radius: 20rpx;
						background: rgba(240, 240, 240, 1);
						font-size: 24rpx;
						color: rgba(153, 153, 153, 1);
						&.leader {
							background: rgba(22, 200, 139, .08);
							color: rgba(22, 200, 139, 1);
						}
						&.participant {
							background: rgba(22, 141, 200, .08);
							color: rgba(0, 145, 255, 1);
						}
					}
					.user-department {
						margin-left: 25rpx;
						color: #666;
					}
					.phone-icon {
						display: inline-block;
						position: absolute;
						right: 0;
						width: 30rpx;
						height: 45rpx;
						background: url(https://z3.ax1x.com/2021/10/21/5sz0fO.png) no-repeat;
						background-position: -530rpx -70rpx;
						background-size: 600rpx 270rpx;
					}
				}
			}
		}
	}
	.forward-work-order .van-button {
		display: block;
		box-sizing: border-box;
		margin: 30rpx 50rpx;
		padding: 25rpx 0rpx;
		border: initial;
		border-radius: 150rpx;
		height: initial;
		background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
		box-shadow: 0rpx 12rpx 24rpx 0rpx rgba(12, 126, 161, .35);
		line-height: initial;
		font-size: 38rpx;
	}
	.reply-block-wrap {
		overflow: auto;
		height: calc(100vh - 200rpx);
		.reply-block {
			margin: 40rpx 0rpx;
			.reply-time {
				display: block;
				margin-bottom: 20rpx;
				text-align: center;
				font-size: 24rpx;
				color: #999;
			}
			.reply-container {
				display: flex;
				box-sizing: border-box;
				margin: 0rpx 60rpx 0rpx 30rpx;
				.user-information {
					color: #fff;
					.user-name {
						display: block;
						border-radius: 50%;
						width: 90rpx;
						height: 90rpx;
						background: #0bd295;
						line-height: 90rpx;
						text-align: center;
						color: #fff;
					}
					.user-role {
						display: block;
						margin-top: -20rpx;
						padding: 6rpx 0rpx;
						border-radius: 3px;
						background: rgba(0, 0, 0, .6);
						box-shadow: 0 -2px 7px 0 rgba(0, 0, 0, .1);
						text-align: center;
						font-size: 20rpx;
					}
				}
				.reply-information {
					margin: 0rpx 0rpx 0rpx 20rpx;
					.user-department {
						display: block;
						margin-bottom: 10rpx;
						font-size: 20rpx;
						color: #666;
					}
					.reply-content {
						display: block;
						box-sizing: border-box;
						padding: 20rpx;
						border-radius: 20rpx;
						background: #fff;
					}
					.reply-image {
						width: 200rpx;
						height: 200rpx;
					}
				}
			}
			.reply-container-me {
				display: flex;
				justify-content: flex-end;
				box-sizing: border-box;
				margin: 0rpx 30rpx 0rpx 60rpx;
				.user-information {
					color: #fff;
					.user-name {
						display: block;
						border-radius: 50%;
						width: 90rpx;
						height: 90rpx;
						background: #0091ff;
						line-height: 90rpx;
						text-align: center;
						color: #fff;
					}
					.user-role {
						display: block;
						margin-top: -20rpx;
						padding: 6rpx 0rpx;
						border-radius: 3px;
						background: rgba(0, 0, 0, .6);
						box-shadow: 0 -2px 7px 0 rgba(0, 0, 0, .1);
						text-align: center;
						font-size: 20rpx;
					}
				}
				.reply-information {
					margin: 0rpx 20rpx 0rpx 0rpx;
					.reply-content {
						display: block;
						box-sizing: border-box;
						padding: 20rpx;
						border-radius: 20rpx;
						background: #fff;
					}
					.reply-image {
						width: 200rpx;
						height: 200rpx;
					}
				}
			}
		}
	}
	.reply-panel-wrap {
		position: fixed;
		left: 0;
		bottom: 0;
		border-top: 1rpx solid #ecf2f2;
		width: 100%;
		.van-search {
			background: rgba(245, 245, 245, 1) !important;
			.van-search__content {
				background: white;
			}
			.van-search__action {
				line-height: 14rpx;
				.submit-btn {
					padding: 10rpx 25rpx;
					border-radius: 15rpx;
					background: #0bd295;
					line-height: initial;
					font-size: initial;
					color: white;
				}
			}
		}
		.reply-panel {
			margin-bottom: -400rpx;
			height: 400rpx;
			background: rgba(245, 245, 245, 1);
			transition: all .5s;
			&.reply-panel-active {
				margin-bottom: 0rpx;
			}
			.reply-panel-item {
				margin: 30rpx 60rpx;
			}
			.img-upload {
				display: inline-block;
				.van-uploader__upload {
					margin: 0rpx;
					width: 100rpx !important;
					height: 100rpx !important;
					background: white;
				}
				.img-upload-label {
					display: block;
					margin-top: 10rpx;
					text-align: center;
					font-size: 24rpx;
				}
			}
		}
	}
	.overlay-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.fix-btn-bottom {
		display: flex;
		position: absolute;
		left: 0;
		bottom: 0;
		flex-direction: row-reverse;
		width: 100%;
		background: #fff;
		line-height: 110rpx;
		.forward-btn {
			margin-left: 8%;
			margin-right: auto;
			color: #0091ff;
		}
		.fin-order-btn {
			padding: 0 50rpx;
			background-color: #0091ff;
			text-align: center;
			color: #fff;
		}
		.cancle-order-btn {
			padding: 0 50rpx;
			color: #ec808d;
		}
	}
}

</style>
