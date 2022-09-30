<template>
  <view class="inispection-detail">
    <van-tabs color="#3F8EF7">
      <van-tab title="巡查信息">
        <view class="task-box">
          <view class="title">
            <text class="overflow-ellipsis" style="max-width: 80%"
              >任务名称：{{ detail.name || '' }}</text
            >
          </view>
          <image
            :src="
              imgStaticUrl &&
                (detail.instanceStatus === '1'
                  ? imgStaticUrl + '/img/inspection/haveInspected.png'
                  : imgStaticUrl + '/img/inspection/toBeInspected.png')
            "
            class="img-tag"
          ></image>
          <view class="dec">
            <view class="flex-box">
              <text class="left">巡查方式</text>
              <text class="right">{{
                detail.type === 0 ? '任务巡查' : '例行巡查'
              }}</text>
            </view>

            <!-- <view class="flex-box" v-if="detail.type === 1">
			  			<text class="left">巡查点</text>
						<text class="right" >{{detail.groupIdName || ''}}</text>
			  		</view> -->
            <view class="flex-box">
              <text class="left">参加人员</text>
              <text class="right">{{ detail.participantsManNames || '' }}</text>
            </view>
            <view class="flex-box" v-if="detail.type === 1">
              <text class="left">任务周期</text>
              <text class="right">{{
                detail.period == '1'
                  ? '每天'
                  : detail.period == '2'
                  ? '每周'
                  : detail.period == '3'
                  ? '每月'
                  : '每年'
              }}</text>
            </view>
            <view class="flex-box">
              <text class="left">任务期限</text>
              <text class="right"
                >{{ detail.startTime || '' }}至{{ detail.endTime || '' }}</text
              >
            </view>
            <view class="flex-box">
              <text class="left">检查清单</text>
              <view class="right">
                <text
                  v-for="(item, index) in detail.investigationInforEntities"
                  :key="index"
                >
                  {{ item.name
                  }}{{
                    index === detail.investigationInforEntities.length - 1
                      ? ''
                      : '；'
                  }}
                </text>
              </view>
            </view>
            <view class="flex-box">
              <text class="left">巡查要求</text>
              <text class="right">{{ detail.remark || '' }}</text>
            </view>
          </view>
        </view>

        <view class="position-wrap">
          <view>
            {{ `巡查点（${allPointList.length})` }}
          </view>
          <view
            class="position-list"
            v-for="(item, index) in allPointList"
            :key="index"
            @click="start(item)"
          >
            <view :class="{ left: true, inRange: !item.isOverRange }">
              <view class="overflow-ellipsis" style="max-width: 500rpx;">{{
                item.name
              }}</view>
              <view class="bottom">
                <van-icon name="location-o" />
                <text class="overflow-ellipsis" style="max-width: 230rpx;">{{
                  item.place || '暂无地址'
                }}</text>
                <text v-if="item.isOverRange">（未进入巡查范围）</text>
                <text v-else>（已进入巡查范围）</text>
              </view>
            </view>
            <view class="right">
              <van-icon name="checked" style="color: #19be6b" />
              <text>{{ item.normal }}</text>
              <van-icon
                name="warning"
                style="color: #fa7e7e; margin-left: 36rpx;"
              />
              <text>{{ item.abnormal }}</text>
            </view>
          </view>
        </view>
      </van-tab>
      <van-tab title="巡查记录">
        <view class="record-box">
          <view class="header">
            任务统计
          </view>
          <view class="flex-box">
            <view class="item-number">
              <view>{{ inspectionRecordTemp.checkedPointCount || 0 }}</view>
              <view>已巡数量</view>
            </view>
            <view class="item-number">
              <view>{{ inspectionRecordTemp.uncheckedPointCount || 0 }}</view>
              <view>待巡数量</view>
            </view>
            <view class="item-number">
              <view>{{ unNormalNum }}</view>
              <view>异常数量</view>
            </view>
          </view>
        </view>
        <view class="time-pick-box">
          <text style="font-family: PingFangSC-Medium;font-weight: 500;">{{
            transformDate
          }}</text>
          <van-icon
            name="notes-o"
            style="color:#3F8EF7;margin-left: 15rpx;"
            @click="handleClick"
          />
        </view>

        <view class="place-header">
          <text
            >巡查点总数：{{
              inspectionRecordTemp.allPointList
                ? inspectionRecordTemp.allPointList.length
                : 0
            }}</text
          >
          <text>
            已巡：{{ inspectionRecordTemp.checkedPointCount || 0 }} 未巡：{{
              inspectionRecordTemp.uncheckedPointCount || 0
            }}
          </text>
        </view>

        <view
          class="list-box"
          v-for="(item, index) in inspectionRecordTemp.allPointList"
          :key="index"
        >
          <view class="header-inspection" @click="expand(item)">
            <view class="overflow-ellipsis" style="max-width: 500rpx;">
              {{ item.name }}
            </view>
            <view>
              <van-icon name="checked" style="color: #19be6b" />
              <text>{{ item.normal }}</text>
              <van-icon
                name="warning"
                style="color: #fa7e7e; margin-left: 36rpx;"
              />
              <text>{{ item.abnormal }}</text>
            </view>
          </view>

          <view v-show="item.expandVisible" style="padding: 20rpx;">
            <view>
              <text
                style="font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(51,51,51,1);"
                >检查结果</text
              >
              <view style="padding: 1vh 0px 0px;">
                {{
                  item.instanceInforEntity
                    ? item.instanceInforEntity.status == '1'
                      ? '正常'
                      : '异常'
                    : ''
                }}
              </view>
            </view>

            <view>
              <text
                style="font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(51,51,51,1);"
                >情况说明</text
              >
              <view style="padding: 1vh 0px 0px;">
                {{
                  item.instanceInforEntity
                    ? item.instanceInforEntity.remark
                    : ''
                }}
              </view>
            </view>
            <view
              style="height:1px;background:rgba(221,221,221,1);margin: auto;"
            ></view>

            <view>
              <text
                style="font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(51,51,51,1);"
                >拍照说明</text
              >
              <view style="padding: 1vh 0px 0px;">
                <van-uploader
                  :disabled="true"
                  :deletable="false"
                  :file-list="
                    item.instanceInforEntity
                      ? item.instanceInforEntity.imgList
                      : []
                  "
                />
              </view>
            </view>
            <view
              style="height:1px;background:rgba(221,221,221,1);margin: auto;"
            ></view>

            <view>
              <text
                style="font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(51,51,51,1);"
                >巡查地址</text
              >
              <view style="padding: 1vh 0px 0px;">
                <van-icon name="location-o" />
                {{
                  item.instanceInforEntity ? item.instanceInforEntity.place : ''
                }}
              </view>
            </view>
          </view>
        </view>
        <van-datetime-picker-plus
          class="fixed-bottom"
          v-if="dateType !== 'week'"
          v-show="showCalendar"
          :type="dateType"
          :value="currentDate"
          @confirm="onCalendarConfirm"
          @cancel="onClose"
          :max-date="maxDate"
          :min-date="minDate"
        />
        <van-picker
          class="fixed-bottom"
          v-else
          show-toolbar
          v-show="showCalendar"
          :columns="weekData"
          @confirm="weekConfirm"
          @cancel="onClose"
        />
      </van-tab>
    </van-tabs>
  </view>
</template>

<script lang="ts">
import {
  getInvestigationById,
  searchInvestigationRecord,
} from '@/apis/index.js';
import config from '@/static/config/index.js';
import { getDistance } from '@/utils/utils.js';

export default {
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      id: '',
      detail: {},
      showCalendar: false,
      date: this.dateFormatter(new Date())
        .split(' ')[0]
        .split('-'),
      currentDate: new Date().getTime(),
      minDate: new Date().getTime(),
      maxDate: new Date().getTime(), // 今天
      inspectionTaskRecords: [],
      inspectionRecordTemp: {}, // 匹配日期的巡查记录
      allList: [],
      // 开始巡查按钮懒加载
      completeRequest: false,
      normalNum: 0,
      unNormalNum: 0,
      allPointList: [], // 任务点集合
      curPosition: {
        latitude: '',
        longitude: '',
      },
      dateType: null,
    };
  },
  computed: {
    transformDate() {
      let date = '';
      switch (this.dateType) {
        case 'year':
          date = this.date[0] + '年';
          break;
        case 'year-month':
          date = this.date[0] + '年' + this.date[1] + '月';
          break;
        case 'date':
          date =
            this.date[0] + '年' + this.date[1] + '月' + this.date[2] + '日';
          break;
        case 'week':
          date = this.date;
          break;
        default:
          break;
      }
      return date;
    },
    // 生成周数据
    weekData() {
      const res = [];
      const oneDay = 1000 * 60 * 60 * 24;
      const oneWeek = 7 * oneDay;
      const startDay = new Date(this.minDate);
      const sat = this.minDate + (6 - startDay.getDay()) * oneDay;
      const endDay = new Date(this.maxDate);
      const endSat = this.maxDate + (6 - endDay.getDay()) * oneDay;

      const _startDay = this.dateFormatter(startDay, false);
      const _sat = this.dateFormatter(sat, false);
      res.push({
        text: `第1周 ${_startDay.replaceAll('-', '.')}-${_sat.replaceAll(
          '-',
          '.'
        )}`,
        date: [_startDay + ' 00:00:00', _sat + ' 23:59:59'],
      });

      let count = 2;
      for (let i = sat + oneDay; i <= endSat; i += oneWeek) {
        const _s = this.dateFormatter(i, false);
        const _e = this.dateFormatter(i + 6 * oneDay, false);
        res.push({
          text: `第${count}周 ${_s.replaceAll('-', '.')}-${_e.replaceAll(
            '-',
            '.'
          )}`,
          date: [_s + ' 00:00:00', _e + ' 23:59:59'],
        });
        count++;
      }
      return res;
    },
  },
  watch: {
    curPosition: {
      handler: function(newVal, oldVal) {
        this.allPointList.forEach((item) => {
          const distance = getDistance(
            newVal.latitude,
            newVal.longitude,
            item.latitude,
            item.longitude
          );
          console.log(distance, 'distance');
          item.isOverRange = distance >= item.clockInRange / 1000;
        });
      },
      deep: true,
    },
  },
  onShow() {
    const pages = getCurrentPages();
    const id = pages[pages.length - 1].options.id;
    this.id = id;

    getInvestigationById(this.id).then((res) => {
      console.log(res);
      if (res.data.code === 0) {
        // 判断任务是什么期限任务 渲染日历模式
        let dateType = 'date';
        if (res.data.data.period == 2) {
          dateType = 'week';
        } else if (res.data.data.period == 3) {
          dateType = 'year-month';
        } else if (res.data.data.period == 4) {
          dateType = 'year';
        }
        this.dateType = dateType;

        this.detail = res.data.data;
        this.inspectionTaskRecords = res.data.data.allInforEntities;
        this.inspectionRecordTemp = this.inspectionTaskRecords[0];

        // 最小时间
        // this.minDate = new Date(this.inspectionRecordTemp.gmtCreate).getTime();
        this.minDate = new Date(res.data.data.startTime).getTime();


        this.allPointList = this.inspectionRecordTemp.allPointList;
        // this.allList.push(...this.allPointList.inforEntitys)

        this.unNormalNum = 0;
        this.normalNum = 0;
        const imgList = [];
        this.allPointList.forEach((item) => {
          item.expandVisible = false;
          this.unNormalNum += item.abnormal;
          this.normalNum += item.normal;
          item.isOverRange = true;
          /******** todo *******/
          // if(item.instanceInforEntity) {
          // 	item.instanceInforEntity.documentList && item.instanceInforEntity.documentList.forEach((item1) => {
          // 		imgList.push({
          // 			name: item1.name,
          // 			url: config.fileHost + item1.url.replace(/\\/g,"/")
          // 		})
          // 	})
          // 	item.instanceInforEntity.imgList = imgList
          // }
        });

        // 判断任务期限是否包含今天
        const startTime = new Date(this.detail.startTime).getTime();
        const endTime = new Date(this.detail.endTime + ' 23:59:59').getTime();
        const today = new Date().getTime();
        if (today > endTime || today < startTime) {
          uni.showToast({
            title: '当前时间不在任务期限内',
            icon: 'none',
            duration: 2500,
          });
          return;
        }
        this.getWxLocation();
        this.completeRequest = true;
      }
    });
  },
  methods: {
    getWxLocation() {
      // return new Promise((resolve, reject) => {
      //   const _locationChangeFn = (res) => {
      //     console.log('location change', res)
      //  this.curPosition = {
      //   latitude: res.latitude,
      //   longitude: res.longitude
      //  }
      //     wx.offLocationChange(_locationChangeFn)
      //   }
      //   wx.startLocationUpdate({
      //     success: (res) => {
      //   console.log(res, '位置更新')
      //       wx.onLocationChange(_locationChangeFn)
      //       resolve()
      //     },
      //     fail: (err) => {
      //       reject()
      //     }
      //   })
      // })
      uni.getLocation({
        // type: 'gcj02',
        geocode: true,
        altitude: true,
        success: (res) => {
          this.curPosition = {
            latitude: res.latitude,
            longitude: res.longitude,
          };
        },
        fail: (res) => {
          console.log('fail', res);
        },
        complete: () => {},
      });
    },
    start(item) {
      if (!this.completeRequest) {
        return;
      }
      // 城管巡查
      uni.navigateTo({
        url: `/pages/cityManagementInspection/inspection/modules/inspection-start/inspection-start?id=${item.codeNum}`,
        success: (res) => {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('instanceEntitiesEvent', {
            data: {
              // 开始巡查的任务列表数据
              // inspectionTaskItems: this.allList,
              // 任务id
              taskId: this.id,
              // 确认保存的数据
              // confirmData: this.inspectionTaskRecordsItem.instanceInforEntityEntity,
              // instanceId: this.inspectionTaskRecordsItem.id,
              // // 任务地点 用来判断位置是否超出范围
              // allPointList: this.detail.allPointList,
            },
          });
        },
      });
    },
    expand(item) {
      // item.expandVisible = !item.expandVisible
    },

    handleClick() {
      this.showCalendar = true;
      console.log(this.showCalendar);
    },
    onClose() {
      this.showCalendar = false;
    },
    weekConfirm(date) {
      console.log(date, 'date');
      this.showCalendar = false;
      this.date = date.detail.value.text;
      const start_end_date = date.detail.value.date;
      this.searchHttp(start_end_date);
    },

    searchHttp(date) {
      searchInvestigationRecord({
        id: this.id,
        startTime: date[0],
        endTime: date[1],
      }).then((res) => {
        console.log(
          '%c [ xxx ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          res
        );
        if (res.data.code === 0) {
          this.inspectionRecordTemp = res.data.data.allInforEntities.length
            ? res.data.data.allInforEntities[0]
            : {};
          this.unNormalNum = 0;
          this.normalNum = 0;
          const imgList = [];

          if (this.inspectionRecordTemp.allPointList) {
            this.inspectionRecordTemp.allPointList.forEach((item) => {
              item.expandVisible = false;
              this.unNormalNum += item.abnormal;
              this.normalNum += item.normal;
              item.isOverRange = true;
              /******** todo *******/
              // if(item.instanceInforEntity) {
              // 	item.instanceInforEntity.documentList && item.instanceInforEntity.documentList.forEach((item1) => {
              // 		imgList.push({
              // 			name: item1.name,
              // 			url: config.fileHost + item1.url.replace(/\\/g,"/")
              // 		})
              // 	})
              // 	item.instanceInforEntity.imgList = imgList
              // }
            });
          }
        }
      });
    },

    onCalendarConfirm(date) {
      console.log(date, 'date');
      this.showCalendar = false;
      let temp = this.dateFormatter(date.detail);
      this.date = temp.split(' ')[0].split('-');

      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        this.date
      );
      let start_end_date = [];
      if (this.dateType === 'year') {
        start_end_date.push(`${this.date[0]}-01-01 00:00:00`);
        start_end_date.push(`${this.date[0]}-12-31 23:59:59`);
      } else if (this.dateType === 'year-month') {
        start_end_date.push(temp);
        start_end_date.push(
          this.getLastDayOfMonth(this.date[0], this.date[1]) + ' 23:59:59'
        );
      } else if (this.dateType === 'date') {
        start_end_date.push(temp);
        start_end_date.push(temp.split(' ')[0] + ' 23:59:59');
      }
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        start_end_date
      );
      this.searchHttp(start_end_date);
    },

    //获取某年某月最后一天
    getLastDayOfMonth(year, month) {
      //获取本年本月的第一天日期
      var date = new Date(year, month - 1, '01');
      //设置日期
      date.setDate(1);
      //设置月份
      date.setMonth(date.getMonth() + 1);
      //获取本月的最后一天
      let cdate = new Date(date.getTime() - 1000 * 60 * 60 * 24);

      //返回结果
      return `${year}-${month}-${cdate.getDate()}`;
    },

    //格式化起始时间结束时间
    dateFormatter(str) {
      //默认返回yyyy-MM-dd HH-mm-ss
      var hasTime = arguments[1] != false ? true : false; //可传第二个参数false，返回yyyy-MM-dd
      var d = new Date(str);
      var year = d.getFullYear();
      var month =
        d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
      var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
      var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
      if (hasTime) {
        return (
          [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')
        );
      } else {
        return [year, month, day].join('-');
      }
    },
  },
};
</script>

<style lang="less">
.fixed-bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.inRange {
  color: #13984e;
}

.header-inspection {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15rpx;
  height: 90rpx;
}

.inispection-detail {
  overflow: hidden;
  min-height: 100vh;
  background: #f5f5f5;
}
.task-box,
.prev-box {
  position: relative;
  margin: 20rpx auto;
  padding-bottom: 20rpx;
  width: 90%;
  background: #fff;
}
.img-tag {
  position: absolute;
  right: 0;
  top: 0;
  width: 150rpx;
  height: 150rpx;
}
.img-little-tag {
  position: absolute;
  right: 0;
  top: 0;
  width: 75rpx;
  height: 75rpx;
}
.title {
  position: relative;
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
.prev-box .title {
  color: #bbb;
}
.dec {
  margin: 0 auto;
  width: 630rpx;
  font-size: 28rpx;
}
.flex-box {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
  .item-number {
    border-right: 1px solid #fff;
    width: 33%;
    text-align: center;
    font-weight: bolder;
  }
  .item-number:last-child {
    border-right: none;
  }
}
.dec .left {
  width: 220rpx;
  line-height: 78rpx;
  font-weight: 400;
  color: #999;
}
.dec .right {
  flex: 1;
}
.link-text {
  margin-top: 45rpx;
  line-height: 42rpx;
  text-align: center;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #0091ff;
}
.time-pick-box {
  margin-top: 20rpx;
  width: 100%;
  height: 150rpx;
  background: rgb(255, 255, 255);
  line-height: 150rpx;
  text-align: center;
  font-size: 38rpx;
}
.record-box {
  margin-top: 20rpx;
  height: 220rpx;
  background: #3c8aff;
  color: #fff;
  .header {
    border-bottom: 1px solid #fff;
    height: 100rpx;
    line-height: 100rpx;
    text-indent: 20rpx;
    font-size: 40rpx;
  }
}
.place-header {
  display: flex;
  justify-content: space-between;
  margin: 14rpx 23rpx;
  padding-left: 12rpx;
  border-left: 17rpx solid #02a7f0;
  height: 44rpx;
  line-height: 44rpx;
  font-size: 26rpx;
}
.list-box {
  position: relative;
  margin: 20rpx auto;
  width: 93%;
  background-color: #fff;
}
.list-box .title {
  padding-left: 32rpx;
  border-bottom: 1px solid #ededed;
  width: 100%;
  height: unset;
  min-height: 80rpx;
  line-height: 80rpx;
}
.list-box .dec {
  height: unset;
  min-height: 80rpx;
  line-height: 80rpx;
}

.position-wrap {
  position: relative;
  margin: 20rpx auto;
  padding-bottom: 20rpx;
  width: 90%;
}
.position-list {
  display: flex;
  margin: 15rpx 0;
  padding: 15px 15rpx 10rpx 15rpx;
  background-color: #fff;
  .left {
    flex: 1;
    .bottom {
      display: flex;
      line-height: 76rpx;
      font-size: 26rpx;
    }
  }
}
.overflow-ellipsis {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
