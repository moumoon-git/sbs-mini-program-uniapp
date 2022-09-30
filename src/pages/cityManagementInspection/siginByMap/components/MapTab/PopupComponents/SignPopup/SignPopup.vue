<template>
  <van-popup
    :show="signPopupShow"
    position="bottom"
    custom-style="max-height: 40%;"
    @close="close"
  >
    <div class="content-wrap" v-show="!showDeatil">
      <div class="header">
        <div class="today-sign">今日签到</div>
        <div class="record-text" @click="toRecordPage">签到记录</div>
      </div>
      <div>
        <div class="sigin-box">
          <div class="record-box">
            <div
              class="record"
              v-for="(item, index) in recordList"
              :key="index"
              @click="toRecordDetail(item.id)"
            >
              <van-icon
                name="checked"
                style="color: #19be6b; margin-right: 10rpx"
              />
              {{ item.time }}签到
            </div>
          </div>
          <div class="circle" @click="toCreateRecord(true)">
            <div>打卡签到</div>
            <div style="margin-top: 34rpx;">{{ time }}</div>
          </div>
          <div class="location-box">
            <van-icon name="location-o" />
            <span>{{ address }}</span>
          </div>
        </div>
      </div>
    </div>
    <DetailContent
      ref="detailContent"
      :address="address"
      :latitude="latitude"
      :longitude="longitude"
      :seeMode="seeMode"
      v-show="showDeatil"
      @backHome="toCreateRecord"
      @submitAfter="submitAfter"
    ></DetailContent>
  </van-popup>
</template>
<script>
import DetailContent from './DetailContent.vue';
import { getRecordDeatail } from '@/apis/index.js';
import config from '@/static/config/index.js';

export default {
  props: {
    signPopupShow: {
      type: Boolean,
      default: false,
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
    recordList: {
      type: Array,
    },
  },
  components: {
    DetailContent,
  },
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      time: new Date()
        .toLocaleTimeString('chinese', { hour12: false })
        .replace('GMT+0800 (CST)', ''),
      timeFlag: null,
      showDeatil: false,
      seeMode: true,
    };
  },
  watch: {
    signPopupShow(newVal) {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        newVal
      );
      if (newVal) {
        this.init();
      } else {
        this.clearTimeIntervel();
        // 数据初始化
        setTimeout(() => {
          Object.assign(this.$data, this.$options.data());
        }, 200);
      }
    },
  },
  methods: {
    close() {
      this.$emit('onClose');
    },
    init() {
      this.clearTimeIntervel();
      this.timeFlag = setInterval(() => {
        this.time = new Date()
          .toLocaleTimeString('chinese', { hour12: false })
          .replace('GMT+0800 (CST)', '');
      }, 1000);
    },
    clearTimeIntervel() {
      if (this.timeFlag) {
        clearInterval(this.timeFlag);
      }
    },
    toCreateRecord(flag) {
      this.seeMode = true;
      this.showDeatil = flag;
    },
    submitAfter(data) {
      this.showDeatil = false;
      this.$emit('pushRecord', {
        time: data.time,
        id: data.id,
      });
    },
    toRecordDetail(id) {
      getRecordDeatail(id).then((res) => {
        console.log(
          '%c [ xxx ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          res
        );
        if (res.data.code === 0) {
          if (res.data.data.imgList) {
            res.data.data.imgList.forEach((item) => {
              item.url = config.fileHost + item.url.replaceAll('\\', '/');
            });
          }
          this.$refs.detailContent.getDetail(res.data.data);
          this.seeMode = false;
          this.showDeatil = true;
        }
      });
    },
    toRecordPage() {
      uni.navigateTo({
        url: `/pages/garbageClassification/siginByMap/components/SignRecord/SignRecord`,
        success: (res) => {},
        fail(err) {
          console.log(
            '%c [ err ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            err
          );
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content-wrap {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 38rpx;
    height: 100rpx;
    font-size: 26rpx;
    color: var(--text-color-gray);
    .today-sign {
      border-bottom: 2px solid var(--text-color-primary);
      width: 200rpx;
      height: 46rpx;
      text-align: center;
    }
    .record-text {
      color: var(--text-color-primary);
    }
  }
  .sigin-box {
    margin: 20rpx auto;
    padding-bottom: 40rpx;

    // height: 395rpx;
    border-radius: 5px;
    width: 96%;
    background-color: #fff;

    .record-box {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin: 0 auto;
      width: 94%;
      .record {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20rpx;
        margin-bottom: 30rpx;
        width: 31%;
        height: 89rpx;
        background-color: #f2f2f2;
        font-size: 26rpx;
      }
      .record:nth-child(3n + 3) {
        margin-right: 0;
      }
    }
    .circle {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 27rpx auto;
      border-radius: 50%;
      width: 210rpx;
      height: 210rpx;
      background-color: var(--text-color-primary);
      font-size: 26rpx;
      color: #fff;
    }
    .location-box {
      text-align: center;
      font-size: 26rpx;
      color: #7f7f7f;
    }
  }
}
</style>
