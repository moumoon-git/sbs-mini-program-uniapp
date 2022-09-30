<template>
  <view class="inispection-detail">
    <scroll-view scroll-y="true" style="height: 100vh" @scrolltolower="lower">
      <van-tabs color="#3F8EF7" @click="switchTab">
        <van-tab title="巡查信息">
          <view class="task-box">
            <view class="title">
              <view>任务名称：</view>
              <view class="wrap-dec">{{ headerDeatil.name || '' }}</view>
            </view>
            <image
              :src="
                imgStaticUrl &&
                  (headerDeatil.instanceStatus === '1'
                    ? imgStaticUrl + '/img/inspection/haveInspected.png'
                    : imgStaticUrl + '/img/inspection/toBeInspected.png')
              "
              class="img-tag"
            ></image>
            <view class="dec">
              <view class="flex-box">
                <text class="left">巡查方式</text>
                <text class="right">{{
                  headerDeatil.type === 0 ? '专项巡查' : '例行巡查'
                }}</text>
              </view>

              <!-- <view class="flex-box" v-if="headerDeatil.type === 1">
			  			<text class="left">巡查点</text>
						<text class="right" >{{headerDeatil.groupIdName || ''}}</text>
			  		</view> -->
              <view class="flex-box">
                <text class="left">参加人员</text>
                <text class="right">{{
                  headerDeatil.participantsManNames || ''
                }}</text>
              </view>
              <view class="flex-box" v-if="headerDeatil.type === 1">
                <text class="left">任务周期</text>
                <text class="right">{{
                  headerDeatil.period == '1'
                    ? '每天'
                    : headerDeatil.period == '2'
                    ? '每周'
                    : headerDeatil.period == '3'
                    ? '每月'
                    : '每年'
                }}</text>
              </view>
              <view class="flex-box">
                <text class="left">任务期限</text>
                <text class="right"
                  >{{ headerDeatil.startTime || '' }}至{{
                    headerDeatil.endTime || ''
                  }}</text
                >
              </view>
              <!-- <view class="flex-box">
              <text class="left">检查清单</text>
              <view class="right">
                <text
                  v-for="(item, index) in headerDeatil.investigationInforEntities"
                  :key="index"
                >
                  {{ item.name
                  }}{{
                    index === headerDeatil.investigationInforEntities.length - 1
                      ? ''
                      : '；'
                  }}
                </text>
              </view>
            </view> -->
              <view class="flex-box">
                <text class="left">巡查要求</text>
                <text class="right">{{ headerDeatil.remark || '' }}</text>
              </view>
            </view>
          </view>

          <view class="position-wrap">
            <view class="position-header">
              <view
                :class="['tab-btn', { 'active-tab-btn': activeTab === '' }]"
                @click="changeTab('')"
              >
                <text class="positionName">全部：</text>
                <text class="positionNum">{{ totalCount }}</text>
              </view>
              <view
                :class="['tab-btn', { 'active-tab-btn': activeTab === '0' }]"
                @click="changeTab('0')"
              >
                <text class="positionName">待巡查：</text>
                <text class="positionNum">{{ uncheckedPointCount || 0 }}</text>
              </view>
              <view
                :class="['tab-btn', { 'active-tab-btn': activeTab === '1' }]"
                @click="changeTab('1')"
              >
                <text class="positionName">已巡查：</text>
                <text class="positionNum">{{ checkedPointCount || 0 }}</text>
              </view>
            </view>
            <view class="recent-box">
              进入最近一次浏览站点：{{ recentData.name || '暂无' }}
              <text class="recent-box-detail" @click="start(recentData)"
                >详情</text
              >
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
                  <text
                    class="overflow-ellipsis-addrress"
                    style="max-width: 420rpx;"
                    >{{ item.place || item.address || '暂无地址' }}</text
                  >
                  <!-- <text v-if="item.isOverRange">（未进入巡查范围）</text>
                <text v-else>（已进入巡查范围）</text> -->
                </view>
              </view>
              <view class="right">
                <van-icon
                  name="checked"
                  style="color: #19be6b;margin-right: 10rpx;"
                />
                <text>{{ item.normal }}</text>
                <van-icon
                  name="clear"
                  style="color: #fa7e7e; margin-left: 36rpx; margin-right: 10rpx;"
                />
                <text>{{ item.abnormal }}</text>
              </view>
              <image
                :src="
                  imgStaticUrl &&
                    (item.isCheck == 1
                      ? imgStaticUrl + '/img/inspection/haveInspected.png'
                      : imgStaticUrl + '/img/inspection/toBeInspected.png')
                "
                class="img-tip"
              ></image>
            </view>
          </view>
        </van-tab>

        <van-tab title="巡查记录">
          <view
            class="record-box"
            :style="{
              background: `url(${imgStaticUrl}/img/inspection/patrolHistory.png)`,
              backgroundSize: `${cover}`,
            }"
          >
            <view class="header">
              任务统计
            </view>
            <view class="flex-box">
              <view class="item-number">
                <view>{{ recordDetail.checkedPointCount || 0 }}</view>
                <view class="num">已巡数量</view>
              </view>
              <view class="item-number">
                <view>{{ recordDetail.uncheckedPointCount || 0 }}</view>
                <view class="num">待巡数量</view>
              </view>
              <view class="item-number">
                <view>{{ recordDetail.totalAbnormal }}</view>
                <view class="num">异常数量</view>
              </view>
            </view>
          </view>
          <view class="time-pick-box">
            <text style="font-family: PingFangSC-Medium;font-weight: 500;">{{
              transformDate
            }}</text>
            <van-icon
              name="arrow-down"
              style="margin-left: 15rpx;"
              @click="handleClick"
            />
          </view>

          <view class="place-header">
            <view class="totalPoints">
              <text class="tag">巡查点总数：</text>
              <text class="points">{{ recordDetail.totalPoints || 0 }}</text>
            </view>

            <view class="pointCount">
              <text class="checkedPointCount">
                已巡：{{ recordDetail.checkedPointCount || 0 }}
              </text>
              <text class="uncheckedPointCount">
                未巡：{{ recordDetail.uncheckedPointCount || 0 }}
              </text>
            </view>
          </view>

          <view
            class="list-box"
            v-for="(item, index) in recordDetail.pointList"
            :key="index"
            @click="jumpDetails(item)"
          >
            <view class="header-inspection" @click="expand(item)">
              <view class="overflow-ellipsis" style="max-width: 500rpx;">
                {{ item.name }}
              </view>
              <view class="patrolHistory">
                <van-icon
                  name="checked"
                  style="color: #19be6b; margin-right: 10rpx;"
                />
                <text>{{ item.normal }}</text>
                <van-icon
                  name="warning"
                  style="color: #fa7e7e; margin-left: 36rpx;margin-right: 10rpx;"
                />
                <text>{{ item.abnormal }}</text>
              </view>
            </view>
            <image
              :src="
                imgStaticUrl &&
                  (item.isCheck == 1
                    ? imgStaticUrl + '/img/inspection/haveInspected.png'
                    : imgStaticUrl + '/img/inspection/toBeInspected.png')
              "
              class="img-tip"
            ></image>

            <view v-show="item.expandVisible" style="padding: 20rpx;">
              <view>
                <text
                  style="font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(51,51,51,1);"
                  >检查结果</text
                >
                <view style="padding: 1vh 0px 0px;">
                  {{ item.status == '1' ? '正常' : '异常' }}
                </view>
              </view>

              <view>
                <text
                  style="font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(51,51,51,1);"
                  >情况说明</text
                >
                <view style="padding: 1vh 0px 0px;">
                  {{ item.remark || '' }}
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
                  <!-- <van-uploader
                    :disabled="true"
                    :deletable="false"
                    :file-list="item.imgList || []"
                  /> -->
                  <ImageView
                    :src="imgStaticUrl + '/img/inspection/haveInspected.png'"
                    mode=""
                    style="width: 75rpx;height: 75rpx;"
                  >
                  </ImageView>
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
                  {{ item.place || '' }}
                </view>
              </view>
            </view>
          </view>

          <van-overlay :show="showCalendar">
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
              :default-index="getDefaultIndex"
              @confirm="weekConfirm"
              @cancel="onClose"
            />
          </van-overlay>
        </van-tab>
      </van-tabs>
    </scroll-view>
  </view>
</template>

<script>
import {
  getGarbageSortingInvestigationById,
  getGarbageSortinglistPageByTaskId,
  searchGarbageSortingInvestigationRecord,
  getBrowseHistory,
  createBrowseHistory,
} from '@/apis/index.js';
import { getDistance, debounce } from '@/utils/utils.js';
import ImageView from '@/pages/custom-components/ImageView/ImageView.vue';
import { getLocation } from '@/utils/hooks/useHooks.js';

export default {
  components: {
    ImageView,
  },
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      id: '',
      detail: {},
      headerDeatil: {},
      showCalendar: false,
      date: this.dateFormatter(new Date())
        .split(' ')[0]
        .split('-'),
      currentDate: new Date().getTime(),
      minDate: new Date().getTime(), // 取后台的任务开始时间
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

      recordDetail: {},

      pointType: 0,
      curentPage: 1, //当前页
      totalPage: 1, //总页数

      activeTitle: '巡查信息',
      cover: 'cover',
      uncheckedPointCount: '', //任务巡查未巡
      checkedPointCount: '', //任务巡查已巡
      recentData: {},
      activeTab: '',
    };
  },
  computed: {
    totalCount() {
      return this.uncheckedPointCount + this.checkedPointCount;
    },
    transformDate() {
      let date = '';
      console.log('this.date', this.date);
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
    getDefaultIndex() {
      let i = 0;
      for (i; i < this.weekData.length; i++) {
        if (this.date == this.weekData[i].text) {
          break;
        }
      }
      return i;
    },
  },

  async onShow() {
    const pages = getCurrentPages();
    const id = pages[pages.length - 1].options.id;
    this.id = id;
    this.allPointList = [];
    this.curentPage = 1;
    this.taskCurentPage=1;
    await this.getHeaderDeatail(this.id);
    await this.getPointList(this.id);
    await this.getRecentView(this.id);
  },
  methods: {
    changeTab(flag) {
      this.activeTab = flag;
      this.curentPage = 1;
      this.allPointList = [];
      this.getPointList(this.id);
    },
    async getRecentView(taskId) {
      const res = await getBrowseHistory(taskId);
      console.log(
        '%c [ res ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        res
      );
      if (res.data.data) {
        this.recentData = res.data.data;
      }
    },

    switchTab(name) {
      this.activeTitle = name.target.title;
      if (name.target.title === '巡查记录') {
        console.log(
          '%c [ xxx ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          this.weekData
        );

        if (this.dateType !== 'week') {
          this.onCalendarConfirm({ detail: new Date().getTime() });
        } else {
          this.weekConfirm({
            detail: { value: this.weekData[this.weekData.length - 1] },
          });
        }
      }
    },
    // 获取头部详细信息
    async getHeaderDeatail(id) {
      const res = await getGarbageSortingInvestigationById(id);
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        res
      );
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
        this.headerDeatil = res.data.data;
        this.pointType = this.headerDeatil.pointType;
        // 最小时间
        this.minDate = new Date(this.headerDeatil.startTime).getTime();

        // this.maxDate = this.headerDeatil.endTime;
        if (!this.expiredFn()) {
          return;
        }
        await this.getWxLocation();
        this.completeRequest = true;
      }
    },

    expiredFn() {
      // 判断任务期限是否包含今天
      const startTime = new Date(this.headerDeatil.startTime).getTime();
      const endTime = new Date(
        this.headerDeatil.endTime + ' 23:59:59'
      ).getTime();
      const today = new Date().getTime();
      if (today > endTime || today < startTime) {
        uni.showToast({
          title: '当前时间不在任务期限内',
          icon: 'none',
          duration: 2500,
        });
        return false;
      }
      return true;
    },

    // 获取点列表数据翻页
    async getPointList(id) {
      const requestData = {
        page: this.curentPage,
        limit: '10',
        taskId: id,
        pointType: this.pointType,
        status: this.activeTab,
      };
      const res = await getGarbageSortinglistPageByTaskId(requestData);
      if (res.data.code === 0) {
        console.log(res.data);
        this.uncheckedPointCount = res.data.uncheckedPointCount;
        this.checkedPointCount = res.data.checkedPointCount;
        console.log(this.checkedPointCount, 'this.checkedPointCount');
        this.curentPage = res.data.page.currPage;
        this.totalPage = res.data.page.totalPage;
        console.log(res.data.page, '数据');
        if (this.curPosition.latitude) {
          this.getItemDistance(res.data.page.list, this.curPosition);
        }
        this.allPointList.push(...res.data.page.list);
      }
      wx.hideLoading();

      console.log(
        '%c [ getGarbageSortinglistPageByTaskId ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        this.curPosition
      );
    },
    getItemDistance(list, otherPoint) {
      list.forEach((item) => {
        const distance = getDistance(
          otherPoint.latitude,
          otherPoint.longitude,
          item.latitude,
          item.longitude
        );
        console.log(distance, 'distance22211', item.clockInRange);
        item.isOverRange = distance >= item.clockInRange / 1000;
      });
    },

    lower(e) {
      const debounceFn = debounce(() => {
        if (this.activeTitle === '巡查信息') {
          this.curentPage++;
          if (this.curentPage > this.totalPage) {
            uni.showToast({
              title: '已加载完全部数据',
              icon: 'none',
              duration: 2500,
            });
            return;
          }
          uni.showLoading({
            title: '加载数据中...',
          });
          this.getPointList(this.id);
        }
      }, 500);
      debounceFn();
    },
    getWxLocation() {
      return getLocation().then((res) => {
        this.curPosition = {
          latitude: res.latitude,
          longitude: res.longitude,
        };
        wx.setStorageSync('address', res.address);
        wx.setStorageSync('latitude', res.latitude);
        wx.setStorageSync('longitude', res.longitude);
      });
    },
    async start(item) {
      console.log(
        '%c [ item ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        item
      );
      if (!this.expiredFn()) {
        return;
      }
      if (!this.completeRequest) {
        return;
      }
      if (!item.codeNum) return;

      const requestData = {
        taskId: this.id,
        codeNum: item.codeNum,
        name: item.name,
        pointTypeNum: item.pointTypeNum,
      };

      await createBrowseHistory(requestData);

      // 垃圾分类
      uni.navigateTo({
        url: `/pages/garbageClassification/garbageSorting/modules/inspection-rubbish/inspection-rubbish?id=${item.codeNum}&type=${item.pointTypeNum}`,
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
      // item.expandVisible = !item.expandVisible;
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
      searchGarbageSortingInvestigationRecord({
        pointType: this.pointType,
        taskId: this.id,
        startTime: date[0],
        endTime: date[1],
      }).then((res) => {
        console.log(
          '%c [ xxx ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          res
        );
        if (res.data.code === 0) {
          this.recordDetail = res.data.data;
        }
      });
    },

    onCalendarConfirm(date) {
      console.log(
        '%c [ date ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        date
      );
      this.showCalendar = false;
      let temp = this.dateFormatter(date.detail);
      this.date = temp.split(' ')[0].split('-');

      console.log(
        '%c [ dayOneByMonth ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        this.date
      );
      let start_end_date = [];
      if (this.dateType === 'year') {
        start_end_date.push(`${this.date[0]}-01-01 00:00:00`);
        start_end_date.push(`${this.date[0]}-12-31 23:59:59`);
      } else if (this.dateType === 'year-month') {
        start_end_date.push(`${this.date[0]}-${this.date[1]}-01 00:00:00`);
        start_end_date.push(
          this.getLastDayOfMonth(this.date[0], this.date[1]) + ' 23:59:59'
        );
      } else if (this.dateType === 'date') {
        start_end_date.push(temp.split(' ')[0] + ' 00:00:00');
        start_end_date.push(temp.split(' ')[0] + ' 23:59:59');
      }
      console.log(
        '%c [ start_end_date ]',
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
    /**
     * @description:跳转到巡查记录页面
     */
    jumpDetails(row) {
      console.log(row, '跳转到巡查记录页面');
      uni.navigateTo({
        url: `/pages/garbageClassification/garbageSorting/modules/inspection-history/inspection-history-record?id=${row.id}`,
        success: (res) => {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('patrolRecord', {
            data: {
              taskId: this.id,
              pointId: row.id,
              instanceId: row.instanceId,
              pointTypeNum: row.pointTypeNum,
            },
          });
        },
      });
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
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 0 15rpx;
  height: 104rpx;
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
  width: 80rpx;
  height: 80rpx;
}
.img-tip {
  position: absolute;
  right: 0;
  top: 0;
  width: 80rpx;
  height: 80rpx;
}
.img-little-tag {
  position: absolute;
  right: 0;
  top: 0;
  width: 75rpx;
  height: 75rpx;
}
.title {
  display: flex;
  position: relative;
  align-items: center;
  margin: 0 auto;
  border-bottom: 1px solid #ddd;
  width: 630rpx;
  height: auto;
  line-height: 112rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  font-size: 32rpx;
  color: #333;
  font-weight: bolder;
  .wrap-dec {
    max-width: 428rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
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
    .num {
      margin-top: 10rpx;
    }
  }
  .item-number:last-child {
    border-right: none;
  }
}
.flex-box:first-child {
  margin-top: 20rpx;
}
.dec .left {
  width: 220rpx;
  line-height: 40rpx;
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
  font-weight: 500;
  background: rgb(255, 255, 255);
  line-height: 150rpx;
  text-align: center;
  font-size: 38rpx;
}
.record-box {
  margin-top: 20rpx;
  height: 230rpx;
  color: #fff;
  font-weight: 500;
  margin-left: 20rpx;
  margin-right: 20rpx;
  .header {
    border-bottom: 1px solid #fff;
    padding-left: 20rpx;
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
  // border-left: 17rpx solid #02a7f0;
  height: 44rpx;
  line-height: 44rpx;
  font-size: 26rpx;
  .totalPoints {
    display: flex;
    .tag {
      color: #333;
    }
    .points {
      font-weight: 500;
      color: #333333;
    }
  }
  .pointCount {
    display: flex;
    color: #999;
    .uncheckedPointCount {
      margin-left: 28rpx;
    }
  }
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
  .recent-box {
    height: 100rpx;
    background: #ffffff;
    border-radius: 8px;
    color: #666;
    line-height: 100rpx;
    padding: 0 20rpx;
    font-size: 26rpx;
    display: flex;
    justify-content: space-between;
    &-detail {
      color: #0091ff;
    }
  }
  .position-header {
    display: flex;
    align-items: center;
    line-height: 100rpx;
    font-size: 26rpx;
    padding-left: 20rpx;
    margin-bottom: 15rpx;
    .tab-btn {
      display: flex;
      margin-right: 30rpx;
      border-bottom: 2px solid transparent;
      color: #999;
      // .positionName {
      //   color: #999;
      // }
      // .positionNum {
      //   color: #999;
      // }
    }
    .active-tab-btn {
      border-bottom: 2px solid #2396ee;
      color: #000;
    }
  }
}
.position-list {
  height: 156rpx;
  display: flex;
  position: relative;
  margin: 20rpx 0;
  padding: 15px 15rpx 10rpx 15rpx;
  background-color: #fff;
  .left {
    flex: 1;
    margin-top: 20rpx;
    .bottom {
      display: flex;
      line-height: 76rpx;
      font-size: 26rpx;
    }
  }
  .right {
    margin-top: 20rpx;
    margin-right: 23rpx;
  }
}
.overflow-ellipsis {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333333;
  font-weight: bolder;
}
.overflow-ellipsis-addrress {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #999;
  font-weight: 400;
}
.patrolHistory {
  margin-right: 30rpx;
}
</style>
