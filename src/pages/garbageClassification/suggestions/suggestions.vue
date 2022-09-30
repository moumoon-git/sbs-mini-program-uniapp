<template>
  <view class="problem-report">
    <view class="card card-top">
      <view class="card-line">
        <view class="card-line-header">
          <van-icon class="little-icon" name="location-o" />
          <text class="overflow-ellipsis">{{ address }}</text>
        </view>
      </view>

      <!-- <view class="card-line">
        <view class="card-line-header" @click="showActionTab(true)">
          <van-icon class="little-icon" name="warn-o" />
          <text style="color: #EC808D;">*</text>
          <text>{{ problemTypeData.name }}</text>
          <van-icon class="little-icon vertical-right" name="arrow" />
        </view>
      </view> -->
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
        placeholder="请在此描述问题内容、地点、时间等信息"
        v-model="remark"
      />
    </view>
    <view class="card">
      <view class="title">
        联系方式（选填）
      </view>
      <van-cell-group>
        <van-field
          v-model="username"
          label="姓名"
          placeholder="请输入您的姓名"
        />

        <van-field
          v-model="phone"
          label="手机号码"
          placeholder="请输入您的手机号码"
          :border="false"
        />
      </van-cell-group>
    </view>

    <van-action-sheet
      :show="problemAreaShow"
      title="请选择问题类型"
      @close="showActionTab(false)"
    >
      <ProblemType
        :problemType="problemType"
        @selectTypeData="selectTypeData"
      ></ProblemType>
    </van-action-sheet>

    <view class="operation-btn">
      <view class="btn cancle-btn" @click="back">
        取消
      </view>
      <view class="btn submit-btn" @click="save">
        提交
      </view>
    </view>
  </view>
</template>

<script>
import config from '@/static/config/index.js';
import ProblemType from './components/ProblemType.vue';
import { saveComplaintsSuggestions } from '@/apis/index.js';
import { getLocation } from '@/utils/hooks/useHooks.js';
import request from '@/utils/request/request.js';

export default {
  components: {
    ProblemType,
  },
  data() {
    return {
      platformId: '',
      problemAreaShow: false,
      fileList: [],
      picList: [],
      longitude: '',
      latitude: '',
      address: '',
      remark: '',
      problemAreaTree: [],
      reportId: wx.getStorageSync('userId'),
      problemType: [],
      problemTypeData: {
        typeId: '',
        name: '问题类型',
      },
      phone: '',
      username: '',
    };
  },
  onLoad(option) {
    console.log(
      '%c [ xxx ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      option
    );
    this.platformId = option.platformId;
    let that = this;
    request
      .get({
        url: '/work/workProperty/treelist',
        data: { module: 1, platformId: that.platformId },
      })
      .then((res) => {
        this.problemType = res.data.data;
      });
    this.refresh();
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    // 问题类型回调
    selectTypeData(data) {
      this.problemTypeData.typeId = data.id;
      this.problemTypeData.name = data.name;
      this.problemAreaShow = false;
    },
    // 上报问题
    save() {
      // if (!this.problemTypeData.typeId) {
      //   uni.showToast({
      //     title: '请选择问题类型',
      //     icon: 'none',
      //   });
      //   return;
      // }
      if (!this.remark.detail) {
        uni.showToast({
          title: '请填写问题简况',
          icon: 'none',
        });
        return;
      }

      const requestData = {
        platformId: this.platformId,
        // typeId: this.problemTypeData.typeId,
        remark: this.remark.detail,
        reportId: this.reportId,
        longitude: this.longitude,
        latitude: this.latitude,
        address: this.address,
        documentList: this.picList,
        reportName: this.username.detail,
        reportPhone: this.phone.detail,
      };
      saveComplaintsSuggestions(requestData).then((res) => {
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
    showActionTab(flag) {
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
  min-height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
  color: #474747;
  .vertical-right {
    margin-left: auto;
  }
  .overflow-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
  .card {
    width: 96%;
    margin: 20rpx auto;
    background-color: #fff;
    .title {
      line-height: 40rpx;
      padding: 20rpx 0 20rpx 23rpx;
    }
  }
  .card-top {
    .card-line:last-child {
      border-bottom: none;
    }
    .card-line {
      width: 94%;
      margin: 0 auto;
      border-bottom: 1px solid #d7d7d7;
      .card-line-header {
        line-height: 104rpx;
        display: flex;
        .little-icon {
          font-size: 40rpx;
          margin-right: 5rpx;
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
    max-height: 300rpx;
    overflow-y: auto;
  }
  .operation-btn {
    width: 100%;
    position: fixed;
    left: 50%;
    bottom: 35rpx;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
      width: 280rpx;
      height: 68rpx;
      line-height: 68rpx;
      border-radius: 6rpx;
      font-size: 28rpx;
      font-weight: 400;
      text-shadow: 0px 0px 5rpx 0px;
      text-align: center;
    }
    .cancle-btn {
      background-color: #fff;
      color: #646566;
      margin-right: 40rpx;
    }
    .submit-btn {
      background-color: #0091ff;
      color: #fff;
    }
  }
}
</style>
