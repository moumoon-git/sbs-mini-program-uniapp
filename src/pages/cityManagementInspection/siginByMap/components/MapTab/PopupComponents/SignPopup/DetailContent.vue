<template lang="">
  <div class="content-wrap">
    <div class="header">
      <van-icon
        name="arrow-left"
        class="back-icon"
        @click="$emit('backHome', false)"
      />
      <div>
        打卡签到
      </div>
    </div>
    <div v-if="seeMode">
      <div class="upload-box">
        <van-uploader
          :file-list="fileList"
          :capture="['camera']"
          :max-count="4"
          @after-read="afterRead"
          upload-text="上传图片"
          @delete="deleteFile"
        />
      </div>
      <div class="remark">
        <div class="title">
          备注（选填）
        </div>
        <van-field ref="input" placeholder="请输入备注" v-model="remark" />
      </div>
      <div class="submit" @click="submit">提交</div>
    </div>
    <div v-else class="detail">
      <div>签到时间：{{ detail.clockInTime }}</div>
      <div class="img-list">
        <image
          class="img-box"
          :src="item.url"
          v-for="item in detail.imgList"
          :key="item.id"
          mode=""
        ></image>
      </div>
      <div class="dec">备注：{{ detail.remark || '' }}</div>
    </div>
  </div>
</template>
<script>
import config from '@/static/config/index.js';
import { saveSignIn } from '@/apis/index.js';
import { dateFormatter } from '@/utils/utils.js';
import { gcj02towgs84 } from '@/utils/mapTransformApi.js';

export default {
  props: {
    seeMode: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  data() {
    return {
      fileList: [],
      picList: [],
      remark: '',
      detail: {},
    };
  },
  methods: {
    transformUrl(data) {
      const fileUrl = data.url.replace(/\\/g, '/');
      //后台返回的地址有 \ 需要替换/ 不然渲染不出来 到时候回显同样需要这样做
      return {
        name: data.name,
        fileUrl: config.fileHost + fileUrl,
        url: data.url,
      };
    },

    afterRead(event) {
      console.log('afterRead', event);
      const { name, file } = event.detail;
      this.fileList.push({
        name: '',
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
          url: `${config.baseUrl}/upload/passImgWithLogo`, // 仅为示例，非真实的接口地址
          // url: 'https://scg.chinaemt.com/ser/upload/passImgWithLogo',
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
    getDetail(data) {
      this.detail = data;
    },
    submit() {
      const [longitude, latitude] = gcj02towgs84(this.longitude, this.latitude);
      const requestData = {
        clockInTime: dateFormatter(new Date()),
        remark: this.remark.detail,
        imgList: this.picList,
        place: this.address,
        longitude,
        latitude,
      };
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        requestData,
        this.longitude,
        this.latitude
      );
      saveSignIn(requestData).then((res) => {
        if (res.data.code === 0) {
          this.$emit('submitAfter', {
            time: requestData.clockInTime.split(' ')[1],
            id: res.data.id,
          });
          // 数据初始化
          setTimeout(() => {
            Object.assign(this.$data, this.$options.data());
            // input框清空要用这个
            this.$refs.input.setData({ innerValue: '' });
          }, 200);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content-wrap {
  padding: 0 38rpx;
  color: var(--text-color-gray);
  .header {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    height: 100rpx;
    font-size: 26rpx;

    .back-icon {
      position: absolute;
      left: -10px;
      top: 50%;
      font-size: 46rpx;
      transform: translateY(-50%);
    }
  }
  .remark {
    font-size: 26rpx;
  }
  .submit {
    border-radius: 5px;
    height: 58rpx;
    background: var(--text-color-primary);
    line-height: 58rpx;
    text-align: center;
    font-size: 26rpx;
    color: #fff;
  }

  .detail {
    font-size: 26rpx;
    .img-list {
      display: flex;
      align-items: center;
      .img-box {
        margin-right: 20rpx;
        width: 100rpx;
        height: 100rpx;
      }
    }
  }
}
</style>
