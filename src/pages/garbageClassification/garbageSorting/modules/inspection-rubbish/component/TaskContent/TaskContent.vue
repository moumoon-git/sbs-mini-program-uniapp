<template>
  <view class="task-content" v-if="task.length">
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
    <LocationBox
      :location.sync="location"
      :longitude.sync="longitude"
      :latitude.sync="latitude"
      :isInRange.sync="isInRange"
      ref="LocationBox"
    ></LocationBox>

    <view class="wrap-task-list">
      <view
        style="margin-bottom: 20rpx;"
        v-for="(item, index) in task[curIndex].allInforEntities[0].allPoints[0]
          .inforEntitys"
        :key="item.id"
      >
        <edit-tick
          :isExpand="activeExpand === index"
          :inspectionTaskItems="item"
          :editData="item.garbageSortingInstanceInforEntity"
          :index="index"
          :isSeeMode="task[curIndex].instanceStatus === '1'"
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
      <!-- <view class="left" @click="toHistory">
				巡查记录
      </view> -->
      <view class="left">
        <view class="">
          <van-icon name="checked" style="margin-right: 10rpx;color: #19be6b" />
          未发现问题：{{ normalNum }}
        </view>
        <view class="">
          <van-icon
            name="clear"
            style="margin-right: 10rpx;color: #fa7e7e; margin-left: 36rpx;"
          />
          存在问题：{{ unNormalNum }}
        </view>
      </view>
      <view
        :class="{ right: true, allowSubmit: isInRange }"
        @click="confirmSubmission"
        v-show="task[curIndex].instanceStatus !== '1'"
      >
        确认提交
      </view>
      <view
        :class="{ right: true, allowSubmit: true }"
        @click="editModeChange"
        v-show="task[curIndex].instanceStatus === '1'"
      >
        修改
      </view>
    </view>
  </view>
  <block v-else>
    <van-empty class="empty" description="暂无数据" />
  </block>
</template>

<script>
import TitleBox from './components/TitleBox/TitleBox.vue';
import EditTick from './components/EditTick/EditTick.vue';
import LocationBox from '@/pages/custom-components/location-box/LocationBox.vue';
import {
  submitGarbageSortingInvestigation,
  getGarbageSortingInvestigationByCodeNum,
} from '@/apis/index.js';
import config from '@/static/config/index.js';

export default {
  data() {
    return {
      title: '',
      imgStaticUrl: this.$imgStaticUrl,
      id: '',
      taskId: '',
      task: [],
      editIndex: -1,
      normalNum: 0, //正常数 不知道后面还要不要 暂留
      unNormalNum: 0, //异常数 不知道后面还要不要 暂留
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
    LocationBox,
  },
  computed: {
    url() {
      return `url(${this.imgStaticUrl}/img/inspection/inspection-0.png)`;
    },
    currentPointInfo() {
      const currentPointInfo = {
        latitude: '',
        longitude: '',
        clockInRange: 0,
      };
      if (this.task.length) {
        const allPointList = this.task[this.curIndex].allInforEntities[0]
          .allPoints[0];
        Object.keys(currentPointInfo).forEach((key) => {
          currentPointInfo[key] = allPointList[key];
        });
      }
      console.log(
        '%c [ currentPointInfo ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        currentPointInfo
      );
      return currentPointInfo;
    },
  },

  methods: {
    editModeChange() {
      this.task[this.curIndex].instanceStatus = '0';
    },
    init(id, taskId) {
      this.id = id;
      this.taskId = taskId;
      getGarbageSortingInvestigationByCodeNum(id, taskId).then((res) => {
        console.log(res, 'res');
        if (res.data.code === 0) {
          // wx.setNavigationBarTitle({
          //   title: res.data.data[0].pointList[0].name //页面标题
          // })
          this.task = res.data.data;

          // 数据结构太复杂了 重新组装数据 渲染
          res.data.data.forEach((item) => {
            this.initData(item.allInforEntities[0].allPoints[0].inforEntitys);
          });

          this.calcNum(
            this.task[0].allInforEntities[0].allPoints[0].inforEntitys
          );
          // 初始第一项的提交id项
          this.submitIdx.taskId = this.task[0].id;
          this.submitIdx.instanceId = this.task[0].allInforEntities[0].id;
          this.submitIdx.pointId = this.task[0].allInforEntities[0].allPoints[0].id;
          console.log(
            '%c [ this.submitIdx ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            this.submitIdx
          );
          this.$nextTick(() => {
            this.$refs.LocationBox.refresh(this.currentPointInfo);
          });
        } else {
          uni.showToast({
            title: '接口报错',
            icon: 'error',
          });
        }
      });
    },

    initData(inforEntitys, isCalcNum = false) {
      let normalNum = 0;
      let unNormalNum = 0;
      inforEntitys.forEach((item1) => {
        if (!item1.garbageSortingInstanceInforEntity) {
          // 数据初始化
          item1.garbageSortingInstanceInforEntity = {
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
          item1.garbageSortingInstanceInforEntity.inforId = item1.id;
          item1.garbageSortingInstanceInforEntity.documentList = item1
            .garbageSortingInstanceInforEntity.documentList
            ? item1.garbageSortingInstanceInforEntity.documentList
            : [];
          item1.garbageSortingInstanceInforEntity.fileList = item1
            .garbageSortingInstanceInforEntity.documentList
            ? item1.garbageSortingInstanceInforEntity.documentList.map(
                (item2) => {
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
                }
              )
            : [];
          if (
            item1.garbageSortingInstanceInforEntity.status === '1' ||
            item1.garbageSortingInstanceInforEntity.status === null
          ) {
            item1.garbageSortingInstanceInforEntity.status = '1';
            normalNum++;
          } else if (item1.garbageSortingInstanceInforEntity.status === '0') {
            unNormalNum++;
          }
        }
      });
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
          item.garbageSortingInstanceInforEntity &&
          item.garbageSortingInstanceInforEntity.status === '1'
        ) {
          normalNum++;
        } else if (
          item.garbageSortingInstanceInforEntity &&
          item.garbageSortingInstanceInforEntity.status === '0'
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
          item.garbageSortingInstanceInforEntity && item.photograph === 1
            ? item.garbageSortingInstanceInforEntity.documentList.length
            : true && item.garbageSortingInstanceInforEntity.status !== ''
        ) {
          count++;
          submitData.push({
            id: item.garbageSortingInstanceInforEntity.id,
            inforId: item.garbageSortingInstanceInforEntity.inforId,
            documentList: item.garbageSortingInstanceInforEntity.documentList,
            remark: item.garbageSortingInstanceInforEntity.remark,
            status: item.garbageSortingInstanceInforEntity.status,
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
      ].allInforEntities[0].allPoints[0].id;
      this.activeExpand = -1;
      // 数据初始化
      this.initData(
        this.task[this.curIndex].allInforEntities[0].allPoints[0].inforEntitys,
        true
      );
      this.$nextTick(() => {
        this.$refs.LocationBox.refresh(this.currentPointInfo);
      });
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
      if (index === this.activeExpand) {
        this.activeExpand = -1;
        return;
      }
      this.activeExpand = index;
    },
    selectFlag(index, flag) {
      console.log('index', flag);
      this.task[this.curIndex].allInforEntities[0].allPoints[0].inforEntitys[
        index
      ].garbageSortingInstanceInforEntity.status = flag;
      this.calcNum(
        this.task[this.curIndex].allInforEntities[0].allPoints[0].inforEntitys
      );
    },
    remarkChange(index, remark) {
      console.log(index, remark);
      this.task[this.curIndex].allInforEntities[0].allPoints[0].inforEntitys[
        index
      ].garbageSortingInstanceInforEntity.remark = remark;
    },
    uploadImg(index, data) {
      const obj = this.transformUrl(data);
      this.task[this.curIndex].allInforEntities[0].allPoints[0].inforEntitys[
        index
      ].garbageSortingInstanceInforEntity.documentList.push({
        name: obj.name,
        url: obj.url,
      });
      this.task[this.curIndex].allInforEntities[0].allPoints[0].inforEntitys[
        index
      ].garbageSortingInstanceInforEntity.fileList.push({
        name: obj.name,
        url: obj.fileUrl,
      });
    },
    deleteImg(index, itemIndex) {
      this.task[this.curIndex].allInforEntities[0].allPoints[0].inforEntitys[
        index
      ].garbageSortingInstanceInforEntity.documentList.splice(itemIndex, 1);
      this.task[this.curIndex].allInforEntities[0].allPoints[0].inforEntitys[
        index
      ].garbageSortingInstanceInforEntity.fileList.splice(itemIndex, 1);
    },
    /* -------------------------子组件自定义事件回调end------------------------------ */

    toHistory() {
      uni.navigateTo({
        url: `/pages/garbageClassification/garbageSorting/modules/inspection-history/inspection-history`,
        success: (res) => {},
      });
    },

    confirmSubmission() {
      if (!this.isInRange) {
        uni.showToast({
          title: '未进入巡查范围',
          icon: 'error',
        });
        return;
      }
      uni.showLoading({
        title: '提交中...',
      });
      // 判断是否满足提交
      const arr = this.task[this.curIndex].allInforEntities[0].allPoints[0]
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
      data.areaId = this.task[
        this.curIndex
      ].allInforEntities[0].allPoints[0].areaId;
      console.log(data, 'data');

      submitGarbageSortingInvestigation(data).then((res) => {
        console.log(res);
        wx.hideLoading();
        if (res.data.code === 0) {
          this.task[this.curIndex].instanceStatus = '1'
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
.task-content {
	overflow: hidden;
	position: relative;
	box-sizing: border-box;
	padding-top: 20rpx;
	min-height: calc(100vh - 201rpx);
	background: #f5f5f5;
	.overflow-ellipsis {
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.swipper-box {
		swiper {
			height: 200rpx;
		}
		.swiper-item-box {
			display: flex;
			position: absolute;
			left: 50%;
			top: 50%;
			justify-content: center;
			align-items: center;
			width: 95%;
			height: 100%;
			background-repeat: no-repeat;
			background-position: center;
			background-size: 100%;
			font-weight: bolder;
			font-size: 40rpx;
			color: #fff;
			transform: translate(-50%, -50%);
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

	.wrap-task-list {
		overflow-y: auto;
		margin-top: 20rpx;
		max-height: calc(100vh - 650rpx);
	}

	.detail-box {
		margin: 20rpx auto;
		padding-bottom: 20rpx;
		width: 90%;
		background: #fff;
	}
	.title {
		margin: 0 auto;
		border-bottom: 1px solid #ddd;
		width: 630rpx;
		height: 112rpx;
		line-height: 112rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		font-size: 32rpx;
		color: #333;
	}
	.bottom {
		margin: 20rpx auto;
		width: 630rpx;
	}
	.dec {
		margin-bottom: 20rpx;
		line-height: 36rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		font-size: 28rpx;
		color: #666;
	}
	.submit-bar {
		display: flex;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 109rpx;
		background-color: #fff;
	}
	.submit-bar .left {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex: 1;
		margin-right: 40rpx;
		font-size: 25rpx;
		color: #0090fe;
	}
	.submit-bar .right {
		width: 250rpx;
		height: 108rpx;
		background: #ddd;
		line-height: 108rpx;
		text-align: center;
		color: #fff;
	}
	.submit-bar .allowSubmit {
		background: #0190ff;
	}
}

</style>
