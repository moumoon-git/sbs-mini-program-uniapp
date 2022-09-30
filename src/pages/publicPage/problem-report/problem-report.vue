<template>
  <view class="problem-report">
    <view class="card card-top">
      <view class="card-line">
        <view class="card-line-header">
          <van-icon class="little-icon" name="location-o" />
          <text class="overflow-ellipsis">{{ address }}</text>
        </view>
      </view>
      <view class="card-line">
        <view class="card-line-header" @click="showActionTab(0, true)">
          <van-icon class="little-icon" name="warn-o" />
          <text style="color: #EC808D;">*</text>
          <text>{{ araeData.name }}</text>
          <van-icon class="little-icon vertical-right" name="arrow" />
        </view>
      </view>
      <view class="card-line">
        <view class="card-line-header" @click="showActionTab(1, true)">
          <van-icon class="little-icon" name="warn-o" />
          <text style="color: #EC808D;">*</text>
          <text>{{ problemTypeData.name }}</text>
          <van-icon class="little-icon vertical-right" name="arrow" />
        </view>
      </view>
    </view>
    <view class="card card-upload">
      <view class="title">
        上传照片(最多4张)
      </view>
      <view class="pic-box">
        <van-uploader
          :file-list="fileList"
          :capture="['camera']"
          :max-count="4"
          @after-read="afterRead"
          upload-text="上传图片"
          @delete="deleteFile"
        />
      </view>
    </view>
    <view class="card card-remark">
      <view class="title">
        <text style="color: #EC808D;">*</text>问题简况
      </view>
      <van-field
        type="textarea"
        autosize
        placeholder="请在此描述问题内推、地点、时间等信息"
        v-model="remark"
      />
    </view>

    <van-action-sheet
      :show="problemAreaShow"
      :title="activeActionTab === 0 ? '请选择问题区域' : '请选择问题类型'"
      @close="showActionTab(activeActionTab, false)"
    >
      <ProblemArea
        v-show="activeActionTab === 0"
        :problemAreaTree="problemAreaTree"
        @selectGroupData="selectGroupData"
        ref="ProblemArea"
      ></ProblemArea>
      <ProblemType
        v-show="activeActionTab === 1"
        :problemType="problemType"
        @selectTypeData="selectTypeData"
      ></ProblemType>
    </van-action-sheet>

    <view class="submit-btn" @click="save">
      确认提交
    </view>
  </view>
</template>

<script>
import config from '@/static/config/index.js';
import ProblemArea from './components/ProblemArea.vue';
import ProblemType from './components/ProblemType.vue';
import {
  getInvestigationTaskGroupListTree,
  getInvestigationGroupListTree,
  getGarbageSortingTaskGroupListTree,
  geGarbageSortingGroupListTree,
  saveProblemReporting,
} from '@/apis/index.js';
import { getLocation } from '@/utils/hooks/useHooks.js';

export default {
  components: {
    ProblemArea,
    ProblemType,
  },
  data() {
    return {
      problemAreaShow: false,
      activeActionTab: 0,
      fileList: [],
      picList: [],
      longitude: '',
      latitude: '',
      address: '',
      remark: '',
      problemAreaTree: [],
      reportId: wx.getStorageSync('userId'),
      platformId: wx.getStorageSync('platformId'),

      araeData: {
        groupId: '',
        name: '问题区域',
      },
      problemType: [{ id: -1, name: '请选择', children: [] }],
      problemTypeData: {
        typeId: '',
        name: '问题类型',
      },

      // 区分垃圾分类的http请求
      platformHttp: {
        ljfl: [
          getGarbageSortingTaskGroupListTree,
          geGarbageSortingGroupListTree,
        ],
        cgxc: [
          getInvestigationTaskGroupListTree,
          getInvestigationGroupListTree,
        ],
      },
    };
  },
  onShow() {
    const pages = getCurrentPages();
    const platform = pages[pages.length - 1].options.platform;
    const httpList = this.platformHttp[platform];
    this.problemType[0].children.length = 0;
    this.refresh();
    Promise.all([httpList[0](), httpList[1]()]).then((res) => {
      console.log(res);
      this.problemAreaTree = res[0].data.data;
      this.problemType[0].children.push(...res[1].data.data);
    });
  },
  methods: {
    // 问题区域回调
    selectGroupData(data) {
      this.araeData.groupId = data.id;
      this.araeData.name = data.name;
      this.problemAreaShow = false;
    },
    // 问题类型回调
    selectTypeData(data) {
      this.problemTypeData.typeId = data.id;
      this.problemTypeData.name = data.name;
      this.problemAreaShow = false;
    },
    // 上报问题
    save() {
      if (!this.araeData.groupId) {
        uni.showToast({
          title: '请选择问题区域',
          icon: 'none',
        });
        return;
      }
      if (!this.problemTypeData.typeId) {
        uni.showToast({
          title: '请选择问题类型',
          icon: 'none',
        });
        return;
      }
      if (!this.remark.detail) {
        uni.showToast({
          title: '请填写问题简况',
          icon: 'none',
        });
        return;
      }

      const requestData = {
        platformId: this.platformId,
        groupId: this.araeData.groupId,
        typeId: this.problemTypeData.typeId,
        remark: this.remark.detail,
        reportId: this.reportId,
        longitude: this.longitude,
        latitude: this.latitude,
        address: this.address,
        documentList: this.picList,
      };
      saveProblemReporting(requestData).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          uni.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000,
            complete: () => {
              setTimeout(() => {
                uni.navigateBack();
              }, 1000);
            },
          });
        } else {
          uni.showToast({
            title: '提交失败',
            icon: 'error',
          });
        }
      });
    },
    showActionTab(params, flag) {
      if (flag && params === 0) {
        this.$refs.ProblemArea.resize();
      }
      this.activeActionTab = params;
      this.problemAreaShow = flag;
    },
    transformUrl(data) {
      const fileUrl = data.url.replace(/\\/g, '/');
      //后台返回的地址有 \ 需要替换/ 不然渲染不出来 到时候回显同样需要这样做
      return {
        name: data.name,
        fileUrl: config.fileHost + fileUrl,
        url: data.url,
      };
    },
    async refresh() {
      const { longitude, latitude, address } = await getLocation();
      this.longitude = longitude;
      this.latitude = latitude;
      this.address = address;
      // uni.getLocation({
      //   // type: 'gcj02',
      //   geocode: true,
      //   altitude: true,
      //   success: (res) => {
      //     this.longitude = res.longitude;
      //     this.latitude = res.latitude;
      //     GD2Address(res.longitude, res.latitude, (location) => {
      //       this.address = location;
      //     });
      //   },
      //   fail: (res) => {
      //     console.log('fail', res);
      //   },
      //   complete: () => {},
      // });
    },
    afterRead(event) {
      console.log('afterRead', event);
      const { name, file } = event.detail;
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
          url: `${config.baseUrl}/upload/passImgWithLogo`, // 仅为示例，非真实的接口地址
          // url: 'https://scg.chinaemt.com/ser/upload/passImg',
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
            address: this.address,
          },
          success: (res) => {
            let data = JSON.parse(res.data);

            if (data.code === 0) {
              const obj = this.transformUrl(data.data);
              this.fileList.push({
                name: obj.name,
                url: obj.fileUrl,
              });
              this.picList.push({
                name: obj.name,
                url: obj.url,
              });
            }
          },
          fail: (res) => {
            console.log('fail', res);
          },
          complete: (res) => {
            console.log('complete', res);
          },
        });
      });
    },
    deleteFile(event) {
      console.log('onDelete', event);
      const { index } = event.detail;
      this.fileList.splice(index, 1);
      this.picList.splice(index, 1);
    },
  },
};
</script>

<style lang="less">
.problem-report {
	overflow: hidden;
	min-height: 100vh;
	background-color: #f5f5f5;
	color: #474747;
	.vertical-right {
		margin-left: auto;
	}
	.overflow-ellipsis {
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.card {
		margin: 20rpx auto;
		width: 96%;
		background-color: #fff;
		.title {
			padding: 20rpx 0 20rpx 23rpx;
			line-height: 40rpx;
		}
	}
	.card-top {
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
				.little-icon {
					margin-right: 5rpx;
					font-size: 40rpx;
				}
			}
		}
	}
	.card-upload {
		.pic-box {
			padding-left: 23rpx;
		}
	}
	.card-remark {
		min-height: 300rpx;
	}
	.submit-btn {
		position: fixed;
		left: 50%;
		bottom: 35rpx;
		border-radius: 6rpx;
		width: 680rpx;
		height: 68rpx;
		background-color: #0091ff;
		line-height: 68rpx;
		text-align: center;
		text-shadow: 0 0 5rpx 0;
		font-weight: 400;
		font-size: 28rpx;
		color: #fff;
		transform: translateX(-50%);
	}
}

</style>
