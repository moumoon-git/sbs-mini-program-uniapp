<template>
  <view class="inspection-start">
    <view class="swipper-box">
      <swiper :indicator-dots="true" @change="pageChange">
        <block v-for="item in task" :key="item.id">
          <swiper-item>
            <view
              class="swiper-item-box overflow-ellipsis"
              :style="{ backgroundImage: url }"
            >
              {{ item.name }}
              <!-- <image
						:src="item.allInforEntities[0].status == '1' ? (imgStaticUrl + '/img/inspection/haveInspected.png')
						: (imgStaticUrl + '/img/inspection/toBeInspected.png') "
						class="img-tag"
					></image> -->
            </view>
          </swiper-item>
        </block>
      </swiper>
    </view>
    <view class="location maring-box">
      <van-icon style="margin-left: 15rpx;" name="location-o" />
      <text class="overflow-ellipsis" style="width: 45%; font-size: 22rpx;">{{
        location
      }}</text>
      <text v-if="isInRange" style="font-size: 17rpx;">（已进入巡查范围）</text>
      <text v-else style="font-size: 17rpx;">（未进入巡查范围）</text>
      <van-loading
        class="refreshLoading"
        v-show="loadingRefresh"
        slot="loading"
        type="spinner"
        size="20"
        vertical
      />
      <view v-show="!loadingRefresh" class="refresh" @click="refresh"
        >刷新位置</view
      >
    </view>
    <view class="wrap-task-list">
      <view
        v-for="(item, index) in task[curIndex].allInforEntities[0]
          .allPointList[0].inforEntitys"
        :key="item.id"
      >
        <edit-tick
          :isExpand="activeExpand === index"
          :inspectionTaskItems="item"
          :editData="item.instanceInforEntity"
          :index="index"
          @expand="expand"
          @selectFlag="selectFlag"
          @remarkChange="remarkChange"
          @uploadImg="uploadImg"
          @deleteImg="deleteImg"
          :location="location"
        />
      </view>
    </view>

    <view class="submit-bar">
      <view class="left">
        <view class="">
          <van-icon name="checked" style="margin-right: 10rpx;color: #19be6b" />
          未发现问题：{{ normalNum }}
        </view>
        <view class="">
          <van-icon
            name="warning"
            style="margin-right: 10rpx;color: #fa7e7e; margin-left: 36rpx;"
          />
          存在问题：{{ unNormalNum }}
        </view>
      </view>
      <view
        :class="{ right: true, allowSubmit: isInRange }"
        @click="confirmSubmission"
      >
        确认提交
      </view>
    </view>
  </view>
</template>

<script>
import TitleBox from './component/TitleBox/TitleBox.vue';
import EditTick from './component/EditTick/EditTick.vue';
import {
  submitInvestigation,
  getInvestigationByCodeNum,
} from '@/apis/index.js';
import { getDistance } from '@/utils/utils.js';
import { getLocation } from '@/utils/hooks/useHooks.js';
import config from '@/static/config/index.js';

export default {
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      id: '',
      taskId: '',
      task: {},
      editIndex: -1,
      normalNum: 0,
      unNormalNum: 0,
      loadingRefresh: false,
      location: '',
      latitude: '',
      longitude: '',
      curIndex: 0,
      isInRange: false,
      submitIdx: {
        instanceId: '',
        taskId: '',
        pointId: '',
      },
      activeExpand: -1, // 展开项 改成只能一次展开一个
    };
  },
  components: {
    TitleBox,
    EditTick,
  },
  computed: {
    url() {
      return `url(${this.imgStaticUrl}/img/inspection/inspection-0.png)`;
    },
  },
  // 上传图片不能用onShow 不然上传了图片会触发onShow
  onLoad(option) {
    this.id = option.id || option.scene;

    const eventChannel = this.getOpenerEventChannel(); // 兼容APP-NVUE
    console.log(
      '%c [ xxx ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      option
    );
    if (Object.keys(eventChannel).length) {
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('instanceEntitiesEvent', (data) => {
        console.log(data);
        this.taskId = data.data.taskId;
        // this.task.inspectionTaskItems.forEach((item) => {
        // 	if(item.instanceInforEntity && item.instanceInforEntity.status === '1') {
        // 		this.normalNum++
        // 	}else if(item.instanceInforEntity && item.instanceInforEntity.status === '0') {
        // 		this.unNormalNum++
        // 	}
        // 	item.isExpand = false
        // })
      });
    }

    getInvestigationByCodeNum(this.id, this.taskId).then((res) => {
      console.log(res, 'res');
      if (res.data.code === 0) {
        wx.setNavigationBarTitle({
          title: res.data.data[0].allInforEntities[0].allPointList[0].name, //页面标题
        });

        this.task = res.data.data;
        this.task.forEach((item) => {
          this.initData(item.allInforEntities[0].allPointList[0].inforEntitys);
        });

        this.calcNum(
          this.task[0].allInforEntities[0].allPointList[0].inforEntitys
        );
        // 初始第一项的提交id项
        this.submitIdx.taskId = this.task[0].id;
        this.submitIdx.instanceId = this.task[0].allInforEntities[0].id;
        this.submitIdx.pointId = this.task[0].allInforEntities[0].allPointList[0].id;

        this.refresh();
      }
    });
  },

  methods: {
    initData(inforEntitys, isCalcNum = false) {
      let normalNum = 0;
      let unNormalNum = 0;
      inforEntitys.forEach((item1) => {
        if (!item1.instanceInforEntity) {
          // 数据初始化
          item1.instanceInforEntity = {
            id: '',
            inforId: item1.id,
            documentList: [],
            fileList: [],
            isNotice: '1',
            place: '',
            latitude: '',
            longitude: '',
            remark: '',
            status: '1',
          };
        } else {
          item1.instanceInforEntity.inforId = item1.id;
          item1.instanceInforEntity.documentList = item1.instanceInforEntity
            .documentList
            ? item1.instanceInforEntity.documentList
            : [];
          item1.instanceInforEntity.fileList = item1.instanceInforEntity
            .documentList
            ? item1.instanceInforEntity.documentList.map((item2) => {
                if (item2.url.includes(config.fileHost)) {
                  return {
                    name: item2.name,
                    url: item2.url,
                  };
                }
                const obj = this.transformUrl(item2);
                return {
                  name: obj.name,
                  url: obj.fileUrl,
                };
              })
            : [];
          if (
            item1.instanceInforEntity.status === '1' ||
            item1.instanceInforEntity.status === null
          ) {
            item1.instanceInforEntity.status = '1';
            normalNum++;
          } else if (item1.instanceInforEntity.status === '0') {
            unNormalNum++;
          }
        }
      });
      console.log(
        '%c [ inforEntitys ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        inforEntitys
      );
      // 避免首次进来时计算正常异常数量不正确 因为那是一个循环task 每次都计算了最后一项了
      if (isCalcNum) {
        this.normalNum = normalNum;
        this.unNormalNum = unNormalNum;
      }
    },
    calcNum(inforEntitys) {
      let normalNum = 0;
      let unNormalNum = 0;
      inforEntitys.forEach((item) => {
        if (
          item.instanceInforEntity &&
          item.instanceInforEntity.status === '1'
        ) {
          normalNum++;
        } else if (
          item.instanceInforEntity &&
          item.instanceInforEntity.status === '0'
        ) {
          unNormalNum++;
        }
      });
      this.normalNum = normalNum;
      this.unNormalNum = unNormalNum;
    },
    allDone(inforEntitys) {
      let count = 0;
      let submitData = [];

      inforEntitys.forEach((item) => {
        if (
          item.instanceInforEntity && item.photograph === 1
            ? item.instanceInforEntity.documentList.length
            : true && item.instanceInforEntity.status !== ''
        ) {
          count++;
          submitData.push({
            id: item.instanceInforEntity.id,
            inforId: item.instanceInforEntity.inforId,
            documentList: item.instanceInforEntity.documentList,
            remark: item.instanceInforEntity.remark,
            status: item.instanceInforEntity.status,
            isNotice: '1',
            latitude: this.latitude,
            longitude: this.longitude,
            place: this.location,
            ...this.submitIdx,
          });
        }
      });
      return {
        allInput: count === inforEntitys.length,
        submitData,
      };
    },

    pageChange(e) {
      this.curIndex = e.detail.current;
      this.submitIdx.taskId = this.task[this.curIndex].id;
      this.submitIdx.instanceId = this.task[
        this.curIndex
      ].allInforEntities[0].id;
      this.submitIdx.pointId = this.task[
        this.curIndex
      ].allInforEntities[0].allPointList[0].id;
      this.activeExpand = -1;
      // 数据初始化
      this.initData(
        this.task[this.curIndex].allInforEntities[0].allPointList[0]
          .inforEntitys,
        true
      );
      this.refresh();
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

    /* -------------------------子组件自定义事件回调start------------------------------ */
    expand(index) {
      // this.task[this.curIndex].allInforEntities[0].allPointList[0].inforEntitys[
      //   index
      // ].isExpand = !this.task[this.curIndex].allInforEntities[0].allPointList[0]
      //   .inforEntitys[index].isExpand;
      if (index === this.activeExpand) {
        this.activeExpand = -1;
        return;
      }
      this.activeExpand = index;
    },
    selectFlag(index, flag) {
      console.log('index', flag);
      this.task[this.curIndex].allInforEntities[0].allPointList[0].inforEntitys[
        index
      ].instanceInforEntity.status = flag;
      this.calcNum(
        this.task[this.curIndex].allInforEntities[0].allPointList[0]
          .inforEntitys
      );
    },
    remarkChange(index, remark) {
      console.log(index, remark);
      this.task[this.curIndex].allInforEntities[0].allPointList[0].inforEntitys[
        index
      ].instanceInforEntity.remark = remark;
    },
    uploadImg(index, data) {
      const obj = this.transformUrl(data);
      this.task[this.curIndex].allInforEntities[0].allPointList[0].inforEntitys[
        index
      ].instanceInforEntity.documentList.push({
        name: obj.name,
        url: obj.url,
      });
      this.task[this.curIndex].allInforEntities[0].allPointList[0].inforEntitys[
        index
      ].instanceInforEntity.fileList.push({
        name: obj.name,
        url: obj.fileUrl,
      });
    },
    deleteImg(index, itemIndex) {
      this.task[this.curIndex].allInforEntities[0].allPointList[0].inforEntitys[
        index
      ].instanceInforEntity.documentList.splice(itemIndex, 1);
      this.task[this.curIndex].allInforEntities[0].allPointList[0].inforEntitys[
        index
      ].instanceInforEntity.fileList.splice(itemIndex, 1);
    },
    /* -------------------------子组件自定义事件回调end------------------------------ */

    isInArea(otherPoint) {
      const allPointList = this.task[this.curIndex].allInforEntities[0]
        .allPointList[0];
      const distance = getDistance(
        allPointList.latitude,
        allPointList.longitude,
        otherPoint.latitude,
        otherPoint.longitude
      );
      return distance <= allPointList.clockInRange / 1000;
    },

    async refresh() {
      this.loadingRefresh = true;
      const { longitude, latitude, address } = await getLocation();
      const isInArea = this.isInArea({ longitude, latitude });
      this.isInRange = isInArea;
      if (isInArea) {
        this.longitude = longitude;
        this.latitude = latitude;
      }
      this.location = address;
      setTimeout(() => {
        this.loadingRefresh = false;
      }, 1500);
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
      //   complete: () => {
      //     setTimeout(() => {
      //       this.loadingRefresh = false;
      //     }, 1500);
      //   },
      // });
    },

    confirmSubmission() {
      if (!this.isInRange) return;
      uni.showLoading({
        title: '提交中...',
      });
      // 判断是否满足提交
      const arr = this.task[this.curIndex].allInforEntities[0].allPointList[0]
        .inforEntitys;
      const { allInput, submitData } = this.allDone(arr);
      if (!allInput) {
        uni.showToast({
          title: '请全部填写完整',
          icon: 'none',
        });
        return;
      }

      const data = {
        investigationInstanceInfors: submitData,
        ...this.submitIdx,
      };
      console.log(data, 'data');

      submitInvestigation(data).then((res) => {
        console.log(res);
        wx.hideLoading();
        if (res.data.code === 0) {
          uni.showToast({
            title: '提交成功',
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
            duration: 1000,
          });
        }
      });
    },
  },
};
</script>

<style lang="less">
.overflow-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
.swipper-box {
  swiper {
    height: 308rpx;
  }
  .swiper-item-box {
    width: 95%;
    height: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
    color: #fff;
    font-size: 40rpx;
    font-weight: bolder;
    display: flex;
    align-items: center;
    justify-content: center;
    .img-tag {
      position: absolute;
      right: 0;
      top: 0;
      width: 87rpx;
      height: 60rpx;
    }
  }
}
.maring-box {
  margin: 50rpx 0;
}
.refreshLoading {
  width: 100rpx;
  height: 50rpx;
  text-align: center;
  margin-left: auto;
}
.refresh {
  width: 100rpx;
  height: 30rpx;
  text-align: center;
  line-height: 30rpx;
  margin-left: auto;
  margin-right: 15rpx;
  font-size: 24rpx;
  background: #0090fe;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
}
.location {
  width: 92%;
  background: #fff;
  margin: 0 auto;
  padding: 15rpx 0;
  display: flex;
  align-items: center;
}
.wrap-task-list {
  max-height: calc(100vh - 519rpx);
  overflow-y: auto;
  margin-top: 20rpx;
}

.inspection-start {
  background: #f5f5f5;
  min-height: 100vh;
  overflow: hidden;
}
.detail-box {
  width: 90%;
  background: #ffffff;
  margin: 20rpx auto;
  padding-bottom: 20rpx;
}
.title {
  width: 630rpx;
  height: 112rpx;
  line-height: 112rpx;
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  margin: 0 auto;
  border-bottom: 1px solid #dddddd;
}
.bottom {
  width: 630rpx;
  margin: 20rpx auto;
}
.dec {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 36rpx;
  margin-bottom: 20rpx;
}
.submit-bar {
  width: 100%;
  height: 108rpx;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
}
.submit-bar .left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 25rpx;
}
.submit-bar .right {
  width: 250rpx;
  height: 108rpx;
  color: #fff;
  background: #ddd;
  line-height: 108rpx;
  text-align: center;
}
.submit-bar .allowSubmit {
  background: #0190ff;
}
</style>
