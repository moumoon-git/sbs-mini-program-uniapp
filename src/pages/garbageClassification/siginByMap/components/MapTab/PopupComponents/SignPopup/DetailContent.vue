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
        <upload
          v-model="fileList"
          :fileList="fileList"
          :settings="settings"
        ></upload>
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
import upload from '@/components/upload/upload.vue';

export default {
  components: {
    upload,
  },
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
  computed: {
    settings() {
      return {
        url: `${config.baseUrl}/upload/passImgWithLogo`,
        params: {
          name: 'file',
          address: this.address,
        },
      };
    },
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

    delUrlHost(url) {
      return url.replace(config.host, '');
    },

    getDetail(data) {
      this.detail = data;
    },
    submit() {
      const [longitude, latitude] = gcj02towgs84(this.longitude, this.latitude);
      const imgList = this.fileList.map((item) => {
        return {
          ...item,
          ...{ url: this.delUrlHost(item.backEndUrl || item.url) },
        };
      });
      console.log(
        '%c [ this.fileList ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        this.fileList
      );

      const requestData = {
        clockInTime: dateFormatter(new Date()),
        remark: this.remark.detail,
        imgList: imgList,
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
