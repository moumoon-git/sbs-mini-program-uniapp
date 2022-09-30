<template lang="">
  <div class="BucketSignIn">
    <div class="userInfo">
      <image
        :src="avatar ? avatar : defaultAvatar"
        mode=""
        class="avatar"
      ></image>
      <div>
        <div class="username">{{ name }}</div>
        <div class="role">{{ role }}</div>
      </div>
      <image :src="tagImg" class="img-tag"></image>
    </div>
    <div class="sigin-box">
      <div class="dec">
        考勤时间：
        <span v-for="(item, index) in siginTime" :key="index"
          >{{ item.startTime }}~{{ item.endTime
          }}{{ siginTime.length === index + 1 ? '' : '，' }}</span
        >
      </div>
      <div class="record-box">
        <div class="record" v-for="(item, index) in recordList" :key="index">
          <van-icon
            name="checked"
            style="color: #19be6b; margin-right: 10rpx"
          />
          {{ item.time }}
          {{ textMap[item.type] }}
        </div>
        <div
          class="record blueText"
          v-if="recordList.length > 0"
          @click="showPopup(true)"
        >
          <van-icon name="replay" /> 更新打卡
        </div>
      </div>
      <div
        :class="{
          circle: true,
          gray: status.type === -1,
          blue: status.type === 0 || status.type === 1,
          orange: status.type === 2,
        }"
        @click="showPopup(false)"
      >
        <div>{{ status.text }}</div>
        <div style="margin-top: 34rpx;">{{ time }}</div>
      </div>
      <div :class="{ 'location-box': true, green: isInRange }">
        <van-icon name="location-o" />
        <span>{{ location }}</span>
        <span v-if="isInRange">(已进入打卡范围)</span>
        <span v-else>(未进入打卡范围)</span>
      </div>
    </div>
    <van-action-sheet
      class="bottom"
      :show="show"
      :title="dialogText.title"
      @close="onClose"
    >
      <div class="pd-left">
        <upload
          v-model="form.fileList"
          :fileList="form.fileList"
          :settings="settings"
        ></upload>
      </div>
      <div style="margin-bottom: 30rpx">
        <div class="pd-left">备注（选填）</div>
        <van-field
          :value="form.remark"
          placeholder="请输入情况说明"
          style="padding: 0px;"
        />
      </div>
      <div class="operation-btn" @click="singin">{{ dialogText.button }}</div>
    </van-action-sheet>
  </div>
</template>
<script>
import { getDistance } from '@/utils/utils.js';
import { getLocation } from '@/utils/hooks/useHooks.js';
import config from '@/static/config/index.js';
import { getClockInRecordByPoint, saveClockIn } from '@/apis/index.js';
import store from '@/store';
import upload from '@/components/upload/upload.vue';

export default {
  components: {
    upload,
  },
  props: {
    titleParams: {
      type: Object,
      default: () => ({
        name: '',
        place: '',
        latitude: '',
        longitude: '',
        clockInRange: 0,
        remark: '',
        principal: '',
        phone: '',
      }),
    },
  },
  data() {
    return {
      defaultAvatar: this.$imgStaticUrl + '/img/home/default-avatar.png',
      imgStaticUrl: this.$imgStaticUrl,
      id: '',
      taskId: '',
      name: store.state.userInfo.userName,
      userId: wx.getStorageSync('userId'),
      role: store.state.userInfo.role,
      time: new Date()
        .toLocaleTimeString('chinese', { hour12: false })
        .replace('GMT+0800 (CST)', ''),
      timeFlag: null,
      isInRange: false,
      location: '',
      latitude: '',
      longitude: '',
      show: false,
      form: {
        fileList: [],
        remark: '',
      },
      recordList: [],
      siginTime: [],

      dialogText: {
        title: '签到打卡',
        button: '签到打卡',
      },

      textMap: ['签到打卡', '更新打卡', '离岗打卡'],
      tagImg: '',
    };
  },

  computed: {
    settings() {
      return {
        url: `${config.host}/fileupload/appAttachment/fileUploadAttachments`,
        params: {
          name: 'files',
          type: '13',
        },
      };
    },
    status() {
      if (!this.isInRange) {
        return {
          text: '超出打卡范围',
          type: -1,
        };
      }
      if (
        this.recordList.length === 0 ||
        this.recordList[this.recordList.length - 1].type === 2
      ) {
        return {
          text: '打卡签到',
          type: 0,
        };
      } else if (
        this.recordList.length > 0 &&
        this.recordList[this.recordList.length - 1].type === 0
      ) {
        return {
          text: '离岗登记',
          type: 2,
        };
      } else {
        // 更新打卡逻辑
        for (let i = this.recordList.length - 1; i >= 0; i--) {
          if (this.recordList[i].type === 1) continue;
          if (this.recordList[i].type === 0) {
            return {
              text: '离岗登记',
              type: 2,
            };
          }
          return {
            text: '打卡签到',
            type: 0,
          };
        }
      }
    },
    avatar() {
      let img = store.state.userInfo.avatar;
      return img
        ? img.startsWith('http')
          ? img
          : config.fileHost + img
        : null;
    },
  },
  methods: {
    // 请求数据
    init(id, taskId) {
      if (this.timeFlag) {
        clearInterval(this.timeFlag);
      }
      this.timeFlag = setInterval(() => {
        this.time = new Date()
          .toLocaleTimeString('chinese', { hour12: false })
          .replace('GMT+0800 (CST)', '');
        console.log(
          '%c [ xxx ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          this.time
        );
        this.$emit('updateInterval', this.timeFlag);
        this.refresh();
      }, 1000);

      this.id = id;
      this.taskId = taskId;
      this.recordList = [];
      getClockInRecordByPoint({
        codeNum: this.id,
        contactId: this.userId,
      }).then((res) => {
        console.log(
          '%c [ xxx ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          res
        );
        if (res.data.code === 0) {
          if (res.data.data.clockIns) {
            res.data.data.clockIns.forEach((item) => {
              this.recordList.push({ time: item.clockInTime, type: item.type });
            });
            this.siginTime = res.data.data.times;
          }
        }
        this.tagImg = this.getStatusIterator(this.recordList);
      });
    },

    // 获取人员状态
    getStatusIterator(recordList) {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        12312313
      );
      for (let i = recordList.length - 1; i >= 0; i--) {
        if (recordList[i].type === 1) continue;
        if (recordList[i].type === 0) {
          return this.imgStaticUrl + '/img/inspection/online.png';
        }
        return this.imgStaticUrl + '/img/inspection/offline.png';
      }
    },

    isInArea(otherPoint) {
      const distance = getDistance(
        this.titleParams.latitude,
        this.titleParams.longitude,
        otherPoint.latitude,
        otherPoint.longitude
      );
      return distance <= this.titleParams.clockInRange / 1000;
    },

    async refresh() {
      const { longitude, latitude, address } = await getLocation();
      if (!longitude && !latitude) {
        return;
      }
      const isInArea = this.isInArea({ longitude, latitude });
      this.isInRange = isInArea;
      if (isInArea) {
        this.longitude = longitude;
        this.latitude = latitude;
      }
      this.location = address;

      // uni.getLocation({
      //   // type: 'gcj02',
      //   geocode: true,
      //   altitude: true,
      //   success: (res) => {
      //     const isInArea = this.isInArea(res);
      //     this.isInRange = isInArea;

      //     if (isInArea) {
      //       this.longitude = res.longitude;
      //       this.latitude = res.latitude;
      //     }

      //     GD2Address(res.longitude, res.latitude, (location) => {
      //       this.location = location;
      //     });
      //   },
      //   fail: (res) => {
      //     console.log('fail', res);
      //   },
      //   complete: () => {},
      // });
    },
    showPopup(isUpdate) {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        isUpdate
      );
      if (!this.isInRange) return;
      this.form.fileList = [];
      if (isUpdate) {
        this.dialogText = {
          title: '更新签到打卡',
          button: '更新',
        };
        this.show = true;
        return;
      }
      if (this.status.type === 0) {
        this.dialogText = {
          title: '签到打卡',
          button: '签到打卡',
        };
      } else if (this.status.type === 2) {
        this.dialogText = {
          title: '离岗打卡',
          button: '确认打卡',
        };
      } else {
        this.dialogText = {
          title: '更新签到打卡',
          button: '更新',
        };
      }

      this.show = true;
    },

    // 确认打卡
    singin() {
      const requestData = {
        codeNum: this.id, // 巡查点id
        contactId: this.userId, // 打卡人id
        contactName: this.name, // 打卡人姓名
        clockInDate: new Date().toLocaleDateString().replaceAll('/', '-'), // 打卡日期
        clockInTime: this.time, // 打卡时间
        type: this.dialogText.button === '更新' ? 1 : this.status.type, //打卡类型（0：签到打卡，1：更新打卡，2：离岗打卡）
        remark: this.form.remark, // 备注
        pictureIds: this.form.fileList.map((item) => item.id), // 附件id
        place: this.location, // 打卡位置
        longitude: this.longitude, // 经度
        latitude: this.latitude, // 纬度
      };
      saveClockIn(requestData).then((res) => {
        console.log(
          '%c [ xxx ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          requestData.type
        );
        if (res.data.code === 0) {
          uni.showToast({
            title: '打卡成功',
          });
          this.show = false;
          this.recordList.push({ time: this.time, type: requestData.type });

          this.tagImg = this.getStatusIterator(this.recordList);
        } else {
          uni.showToast({
            title: '打卡失败',
            icon: 'error',
          });
        }
      });
    },

    onClose() {
      this.show = false;
    },
  },
};
</script>
<style lang="less" scoped>
.BucketSignIn {
  padding-top: 20rpx;
  box-sizing: border-box;
  .userInfo {
    width: 96%;
    height: 140rpx;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    align-items: center;
    position: relative;
    .avatar {
      margin: 0 20rpx;
      width: 80rpx;
      height: 95rpx;
    }
    .username {
      margin-bottom: 10rpx;
    }
    .role {
      color: #999999;
    }
    .img-tag {
      width: 80rpx;
      height: 80rpx;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .sigin-box {
    width: 96%;
    // height: 395rpx;
    border-radius: 5px;
    margin: 20rpx auto;
    background-color: #fff;
    padding-bottom: 40rpx;
    .dec {
      color: #aaaaaa;
      line-height: 90rpx;
      text-indent: 0.5em;
      font-size: 26rpx;
    }

    .record-box {
      width: 94%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .record {
        width: 320rpx;
        height: 89rpx;
        background-color: #f2f2f2;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 30rpx;
        font-size: 26rpx;
      }
      .blueText {
        color: #02a7f0;
      }
    }
    .circle {
      width: 210rpx;
      height: 210rpx;
      border-radius: 50%;
      background-color: #aaaaaa;
      color: #fff;
      font-size: 26rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 27rpx auto;
    }

    .gray {
      background-color: #aaaaaa;
    }

    .blue {
      background-color: #02a7f0;
    }

    .orange {
      background-color: #f59a23;
    }

    .location-box {
      font-size: 26rpx;
      text-align: center;
      color: #7f7f7f;
    }
    .green {
      color: #70b603;
    }
  }
  .bottom {
    .pd-left {
      padding-left: 27rpx;
    }
    .operation-btn {
      margin: 0 auto;
      width: 423rpx;
      height: 62rpx;
      text-align: center;
      line-height: 62rpx;
      border-radius: 12px;
      font-size: 25rpx;
      background-color: #02a7f0;
      color: #fff;
    }
  }
}
</style>
