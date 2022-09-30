<template>
	<view class="ProblemReporting">
	    <header class="header">
            <view class="time-picker">
                <span :class="{'time-active':timeActive=='date'}" @click="handleTimePickerClick('date')">日</span>
                <span :class="{'time-active':timeActive=='week'}" @click="handleTimePickerClick('week')">周</span>
                <span :class="{'time-active':timeActive=='year-month'}" @click="handleTimePickerClick('year-month')">月</span>
            </view>
            <view class="date-picker-panel" >
                <p v-if="timeActive!='week'">
                    <view class="date-picker">
                        <span @click="handleDateClick('start')">{{ splitDateString[0] }}</span>
                        <van-icon name="play" />
                        <van-icon v-if="startFormatterDate!='开始日期'" name="clear" @click="handleDateClear('start')"/>
                    </view>
                    <span style="margin: 0rpx 8rpx;">-</span>
                    <view class="date-picker">
                        <span @click="handleDateClick('end')">{{ splitDateString[1] }}</span>
                        <van-icon name="play" />
                        <van-icon v-if="endFormatterDate!='结束日期'" name="clear" @click="handleDateClear('end')"/>
                    </view>
                </p>
                <p v-else @click="handleDateClick('start')"> 
                    <span>{{ splitDateString[0] }}</span>
                    <span style="margin: 0rpx 8rpx;">-</span>
                    <span>{{ splitDateString[1] }}</span>
                    <van-icon name="play" />
                    <van-icon v-if="endFormatterDate!='结束日期'" name="clear" @click="handleDateClear('week')"/>
                </p>
            </view>
            <view class="drafts-panel"  @click="handleDraftsClick">
                <i class="drafts-icon" :style="{backgroundImage:`url(${imgStaticUrl}/img/ProblemReporting/ProblemReporting.png)`}"></i>
                <span class="statistics-number">{{ draftsList.length }}</span>
            </view>
	    </header>
	    <container class="container">
            <van-tabs :active="tabActive" @change="handleTabsChange">
                <van-tab title="我的上报" class="myReport" name="myReport">
                    <view class="card-panel">
                        <scroll-view style="height: 68vh;" :scroll-y="true" :scroll-with-animation="true" @scrolltolower="handleScrollToLower">
                            <view class="card" v-for="(item) in reportList" :key="item.id" @click="handleViewReportingDetail(item.id)">
                                <view class="card-header">
                                    <span v-if="item.typeName">{{ item.typeName }}</span>
                                    <h1>{{ item.typeNames }}</h1>
                                    <i :class="['card-type-icon',item.status==1?'card-type-icon_Processed':'card-type-icon_Processing']"
                                        :style="{backgroundImage:`url(${imgStaticUrl}/img/ProblemReporting/ProblemReporting.png)`}"
                                    ></i>
                                </view>
                                <view class="card-content">
                                    <p>
                                        <label>巡查时间</label>
                                        <span>{{ item.reportTime?item.reportTime:'无' }}</span>
                                    </p>
                                    <p>
                                        <label>事发地点</label>
                                        <span>{{ item.place?item.place:'无' }}</span>
                                    </p>
                                    <p>
                                        <label>所属区域</label>
                                        <span>{{ item.areaName?item.areaName:'无' }}</span>
                                    </p>
                                    <p>
                                        <label>整改类型</label>
                                        <span>{{ item.handleName?item.handleName:'无' }}</span>
                                    </p>
                                </view>
                            </view>
                            <van-empty v-if="reportList.length==0" description="暂无数据" />
                        </scroll-view>   
                    </view>
                    <footer class="footer">
                        <view class="addProblemReportingButton" @click="handleAddReporting">新增问题上报</view>
                    </footer>
                </van-tab>
                <van-tab v-if="reportTypeList.length!=0" title="组内上报" class="allRecords" name="allRecords">
                    <view class="type-picker">
                        <span v-if="reportTypeList.length!=1" :class="{'type-active':typeActive=='全部'}" @click="handleTypeClick('全部', '')">全部</span>
                        <span :class="{'type-active':typeActive==item.name}" v-for="(item) in reportTypeList" :key="item.id" @click="handleTypeClick(item.name, item.id)">{{ item.name }}</span>
                        <i class="nav-icon" :style="{backgroundImage:`url(${imgStaticUrl}/img/ProblemReporting/ProblemReporting.png)`}" @click="handleNavClick"></i>
                    </view>
                    <view class="type-statistics">
                        <p>
                            <label>案件总数：</label>
                            <span>{{ reportStatistics.all }}</span>
                        </p>
                        <span class="split-line"></span>
                        <p>
                            <label>处置中：</label>
                            <span>{{ reportStatistics.underDisposal }}</span>
                        </p>
                        <span class="split-line"></span>
                        <p>
                            <label>已完结：</label>
                            <span>{{ reportStatistics.disposed }}</span>
                        </p>
                    </view>
                    <view class="card-panel">
                        <scroll-view style="height: 68vh;" :scroll-y="true" :scroll-with-animation="true" @scrolltolower="handleScrollToLower">
                            <view class="card" v-for="(item) in reportList" :key="item.id" @click="handleViewReportingDetail(item.id)">
                                <view class="card-header">
                                    <span v-if="item.typeName">{{ item.typeName }}</span>
                                    <h1>{{ item.typeNames }}</h1>
                                    <i :class="['card-type-icon',item.status==1?'card-type-icon_Processed':'card-type-icon_Processing']"
                                        :style="{backgroundImage:`url(${imgStaticUrl}/img/ProblemReporting/ProblemReporting.png)`}"
                                    ></i>
                                </view>
                                <view class="card-content">
                                    <p>
                                        <label>巡查时间</label>
                                        <span>{{ item.reportTime?item.reportTime:'无' }}</span>
                                    </p>
                                    <p>
                                        <label>事发地点</label>
                                        <span>{{ item.place?item.place:'无' }}</span>
                                    </p>
                                    <p>
                                        <label>所属区域</label>
                                        <span>{{ item.areaName?item.areaName:'无' }}</span>
                                    </p>
                                    <p>
                                        <label>整改类型</label>
                                        <span>{{ item.handleName?item.handleName:'无' }}</span>
                                    </p>
                                    <p v-if="tabActive=='allRecords'">
                                        <label>巡查人</label>
                                        <span>{{ item.reportPersonName?item.reportPersonName:'无' }}</span>
                                    </p>
                                </view>
                            </view>
                            <van-empty v-if="reportList.length==0" description="暂无数据" />
                        </scroll-view>    
                    </view>
                </van-tab>
            </van-tabs>
        </container>
        <van-datetime-picker
            v-if="datetimeVisible && timeActive!='week'"
            class="fixed-bottom"
            :type="timeActive"
            :value="dateTag=='start'?startDate:endDate"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="handleDateConfirm"
            @cancel="handleDateCancel"
        />
        <van-picker
            v-if="datetimeVisible && timeActive=='week'"
            class="fixed-bottom"
            show-toolbar
            :columns="weekData"
            :default-index="weekData.length-1"
            @confirm="handleWeekConfirm"
            @cancel="handleDateCancel"
        />
	</view>
</template>

<script>

export default {
  name: 'ProblemReporting',
  data() {  
	return {
        imgStaticUrl: this.$imgStaticUrl,
        timeActive: 'date',
        tabActive: 'myReport',
        typeActive: '全部',
        datetimeVisible: false,
        dateTag: '',
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
        startFormatterDate: '开始日期',
        endFormatterDate: '结束日期',
        minDate: new Date(2010,0,1).getTime(),
        maxDate: new Date().getTime(),
        reportList: [],
        reportStatistics: {},
        reportTypeList: [],
        typeId: '',
        draftsList: [],
        isScrollEnd: false,
        currentPage: 1,
        menuList: []
	}
   },
   components: {
   },
   computed: {
        // 生成周数据
        weekData() {
            const res = [];
            const oneDay = 1000 * 60 * 60 * 24;
            const oneWeek = 7 * oneDay;
            const startDay = new Date(new Date(2021,0,1).getTime());
            const sat = new Date(2021,0,1).getTime() + (6 - startDay.getDay()) * oneDay;
            const endDay = new Date(this.maxDate);
            const endSat = this.maxDate + (6 - endDay.getDay()) * oneDay;

            const _startDay = this.dateFormatter(startDay, false);
            const _sat = this.dateFormatter(sat, false);
            res.push({
                text: `第1周 ${_startDay.replaceAll('-', '.')}-${_sat.replaceAll(
                '-',
                '.'
                )}`,
                date: [_startDay, _sat],
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
                date: [_s, _e],
                });
                count++;
            }
            return res;
        },
        splitDateString() {
            let array = [];
            if(this.startFormatterDate.search('开始')==-1) {
                array.push(this.startFormatterDate.split(' ')[0])
            } else {
                array.push(this.startFormatterDate)
            }
            if(this.endFormatterDate.search('结束')==-1) {
                array.push(this.endFormatterDate.split(' ')[0])
            } else {
                array.push(this.endFormatterDate)
            }
            return array
        }
    },
   onShow() {
        this.currentPage = 1;
        this.reportList = [];
        this.getMenuByCode();
        this.getReportTypeList();
        this.getReportList();
        this.getDraftsList();
    },
  methods: {
    handleScrollToLower() {
        if(!this.isScrollEnd) {
            this.currentPage+=1;
            this.getReportList();
        } else {
            wx.showToast({
                title: '已经到底部了',
                icon: 'none',
            });
        }
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
    handleTabsChange(event) {
        this.tabActive = event.detail.name;
        console.log('this.tabActive',this.tabActive)
        this.isScrollEnd = false;
        this.currentPage = 1;
        this.reportList = [];
        this.getReportList();
    },
    handleDraftsClick() {
        wx.navigateTo({
            url: `./drafts?startTime=${this.startFormatterDate}&endTime=${this.endFormatterDate}`
        });
    },
    handleDateClick(value) {
        this.dateTag = value;
        this.datetimeVisible = true;
    },
    handleDateConfirm(event) {
        if(this.dateTag == 'start') {
            if (event.detail > this.endDate) {
                wx.showToast({
                    title: '开始日期不能大于结束日期',
                    icon: 'none',
                });
                return ;
            }
        } else {
            if (event.detail < this.startDate) { 
                wx.showToast({
                    title: '结束日期不能小于开始日期',
                    icon: 'none',
                });
                return ;
            }
        }
        this.datetimeVisible = false;
        let date = new Date(event.detail)
        console.log('event', event, `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`)

        if(this.dateTag == 'start') {
            let firstDate;
            if(this.timeActive=='year-month') {
                firstDate = new Date(date.getFullYear(),date.getMonth()+1,1);
            }
            this.startFormatterDate = `${date.getFullYear()}-${date.getMonth()+1}${this.timeActive=='date'?`-${date.getDate()} 00:00:00`:`-${firstDate.getDate()} 00:00:00`}`;
            this.startDate = event.detail;
        } else {
            let endDate;
            if(this.timeActive=='year-month') {
                endDate = new Date(date.getFullYear(),date.getMonth()+1,0);
            }
            this.endFormatterDate = `${date.getFullYear()}-${date.getMonth()+1}${this.timeActive=='date'?`-${date.getDate()} 23:59:59`:`-${endDate.getDate()} 23:59:59`}`;
            this.endDate = event.detail;
        }
        this.isScrollEnd = false;
        this.currentPage = 1;
        this.reportList = [];
        this.getReportList();
        this.getDraftsList();
    },
    handleWeekConfirm(event) {
        console.log('handleWeekConfirm event',event)
        this.datetimeVisible = false;
        let date = event.detail.value.date
        this.startFormatterDate = `${date[0]} 00:00:00`;
        this.endFormatterDate = `${date[1]} 23:59:59`;
        this.isScrollEnd = false;
        this.currentPage = 1;
        this.reportList = [];
        this.getReportList();
        this.getDraftsList();
    },
    handleDateCancel() {
        this.datetimeVisible = false;
    },
    getReportList() {
        this.$http.post({
          url: '/reporting/list',
          data: {
            limit: 10,
            page: this.currentPage,
            search: '',
            startTime: this.startFormatterDate.search('开始日期')!=-1?'':this.startFormatterDate,
            endTime: this.endFormatterDate.search('结束日期')!=-1?'':this.endFormatterDate,
            typeId: this.tabActive == 'myReport'?'':this.typeId,
            mailContactorId: this.tabActive == 'myReport'? wx.getStorageSync('userId') : '',
            belongTo: 0 
          },
        })
        .then(({ data }) => {
          console.log('/reporting/list data', data);
          if (data.code == 0) {
            if(data.data.list.length == 0) {
                this.isScrollEnd = true;
                wx.showToast({
                    title: '已经到底部了',
                    icon: 'none',
                });
            }
            this.reportList = this.reportList.concat(data.data.list);
            if(this.currentPage==1 && this.tabActive != 'myReport') {
                this.getReportStatistics();
            }
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    getReportStatistics() {
        this.$http.post({
          url: '/reporting/countByStatus',
          data: {
            "startTime": this.startFormatterDate.search('开始日期')!=-1?'':this.startFormatterDate,
            "endTime": this.endFormatterDate.search('结束日期')!=-1?'':this.endFormatterDate,
            "typeId": this.typeId 
          },
        })
        .then(({ data }) => {
          console.log('/reporting/countByStatus data', data);
          if (data.code == 0) {
            this.reportStatistics = data.data;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    getReportTypeList() {
        this.reportTypeList = [];
        this.$http.post({
          url: '/reporting/typeSort/list'
        })
        .then(({ data }) => {
          console.log('/reporting/typeSort/list data', data);
          if (data.code == 0) {
            for(let i=0;i<this.menuList.length;i++) {
                for(let j=0;j<data.data.length;j++) {
                    if(this.menuList[i].perms==data.data[j].code) {
                        this.reportTypeList.push(data.data[j]);
                        break ;
                    }
                }
            }
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    handleTypeClick(value, id) {
        this.typeActive = value
        this.typeId = id;
        this.isScrollEnd = false;
        this.currentPage = 1;
        this.reportList = [];
        this.getReportList();
    },
    getDraftsList() {
        this.$http.post({
          url: '/reporting/list',
          data: {
            limit: 10000,
            page: this.currentPage,
            search: '',
            startTime: this.startFormatterDate.search('开始日期')!=-1?'':this.startFormatterDate,
            endTime: this.endFormatterDate.search('结束日期')!=-1?'':this.endFormatterDate,
            typeId: '',
            mailContactorId: wx.getStorageSync('userId'),
            belongTo: 1
          },
        })
        .then(({ data }) => {
          console.log('/reporting/list data', data);
          if (data.code == 0) {
            this.draftsList = data.data.list;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    handleTimePickerClick(value) {
        this.timeActive = value;
        this.handleDateClear('timeActiveChange')
    },
    handleDateClear(value) {
        if(value == 'start') {
            this.startFormatterDate = '开始日期';
            this.startDate = new Date().getTime();
        }else if(value == 'end') {
            this.endFormatterDate = '结束日期';
            this.endDate = new Date().getTime();
        } else if(value == 'week') {
            this.startFormatterDate = '开始日期';
            this.endFormatterDate = '结束日期';
        } else if(value == 'timeActiveChange') {
            this.startFormatterDate = '开始日期';
            this.startDate = new Date().getTime();
            this.endFormatterDate = '结束日期';
            this.endDate = new Date().getTime();
        }
        this.isScrollEnd = false;
        this.currentPage = 1;
        this.reportList = [];
        this.getReportList();
        this.getDraftsList();
    },
    handleNavClick() {
        wx.navigateTo({
            url: `/pages/custom-components/sort/sort`
        });
    },
    handleAddReporting(){
      wx.navigateTo({
          url: `/pages/garbageClassification/ProblemReporting/IssueReport`
      });
    },
    handleViewReportingDetail(id) {
      wx.setStorageSync('isClose',false);
      wx.navigateTo({
          url: `/pages/garbageClassification/ProblemReporting/IssueReport?id=${id}`
      });
    },
    getMenuByCode() {
        this.$http.get({
          url: '/mail/mailcontactor/getMenuByCode',
          data: {
            code: 'INTRA_GROUP_STATUS'
          },
        })
        .then(({ data }) => {
          console.log('/mail/mailcontactor/getMenuByCode data', data);
          if (data.code == 0) {
            this.menuList = data.data;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    }
  }
};
</script>

<style lang="less">	
    page {
        background: #F5F5F5;
    }
	.ProblemReporting {
		height: 100%;
		display: block;
		padding: 0rpx;
		box-sizing: border-box;
		.header {
            position: fixed;
            width: 100%;
            top: 0%;
            left: 0%;
            z-index: 996;
            background: #FFF;
			box-sizing: border-box;
            padding: 0rpx 36rpx;
            height: 100rpx;
            display: flex;
            align-items: center;
            .time-picker {
                display: inline-block;
                padding: 14rpx 18rpx;
                font-size: 24rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #666666;
                background: #F8F8F8;
                border-radius: 32rpx;
                .time-active {
                    color: #0091FF;
                }
                & > span:nth-of-type(2) {
                    margin: 0rpx 32rpx;
                }
            }
            .date-picker-panel {
                padding: 14rpx 26rpx;
                font-size: 24rpx;
                font-family: Roboto-Medium, Roboto;
                font-weight: 500;
                color: #333333;
                background: #F8F8F8;
                border-radius: 32rpx;
                margin-left: 24rpx;
                p {
                    display: flex;
                    align-items: center;
                    position: relative;
                    .date-picker {
                        position: relative;
                        display: flex;
                        align-items: center;
                    }
                    .van-icon-play {
                        transform: rotateZ(90deg);
                        margin-left: 6rpx;
                    }
                    .van-icon-clear {
                        position: absolute;
                        top: -60%;
                        right: 6%;
                    }
                }
            }
            .drafts-panel {
                margin: 0rpx 0rpx 0rpx auto;
                position: relative;
                .drafts-icon {
                    display: inline-block;
                    width: 54rpx;
                    height: 54rpx;
                    background-size: 626rpx 219rpx;
                    background-position: -10rpx -25rpx;    
                }
                .statistics-number {
                    display: inline-block;
                    background: #FA6400;
                    font-size: 20rpx;
                    min-width: 44rpx;
                    height: 44rpx;
                    line-height: 44rpx;
                    text-align: center;
                    color: #FFF;
                    border-radius: 50%;
                    position: absolute;
                    top: -20%;
                    right: -40%;
                }
            }
		}
		.container {
            margin-top: 99rpx;
            height: 100%;
            display: block;
            padding: 0rpx;
            box-sizing: border-box;
            .card-panel {
                margin-top: 115rpx;
            }
            .card {
                box-sizing: border-box;
                margin: 20rpx;
                background: #FFFFFF;
                border-radius: 8rpx;
                .card-header {
                    height: 112rpx;
                    box-sizing: border-box;
                    padding: 0rpx 32rpx;
                    display: flex;
                    align-items: center;
                    position: relative;
                    white-space: nowrap;
                    & > span {
                        background: #E6EFFF;
                        border-radius: 6rpx;
                        padding: 4rpx 24rpx;
                        font-size: 24rpx;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #0091FF;
                    }
                    & > h1 {
                        width: 448rpx;
                        font-size: 32rpx;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 800;
                        color: #333333;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        margin-left: 14rpx;
                    }
                    &::after {
                        display: inline-block;
                        content: '';
                        width: 630rpx;
                        height: 2rpx;
                        background: #DDDDDD;
                        position: absolute;
                        left: 50%;
                        bottom: 0%;
                        transform: translateX(-50%);
                    }
                    .card-type-icon {
                        display: inline-block;
                        width: 80rpx;
                        height: 80rpx;
                        background-size: 626rpx 219rpx;
                        position: absolute;
                        right: 0%;
                        top: 0%;
                        &_Processed {
                            background-position: -10rpx -120rpx;
                        }
                        &_Processing {
                            background-position: -120rpx -120rpx;
                        }
                    }
                }
                .card-content {
                    box-sizing: border-box;
                    padding: 0rpx 40rpx;
                    p {
                        display: flex;
                        align-items: center;
                        white-space: nowrap;
                        margin: 20rpx 0rpx;
                        label {
                            font-size: 28rpx;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #999999;
                        }
                        span {
                            display: inline-block;
                            font-size: 28rpx;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #333333;
                            margin-left: 48rpx;
                            width: 460rpx;
                            overflow:hidden;
                            text-overflow:ellipsis;
                        }
                        &:last-of-type {
                            padding-bottom: 20rpx;
                        }
                    }
                }
            }
            .type-picker {
                position: fixed;
                width: 100%;
                z-index: 996;
                top: 186rpx;
                white-space: nowrap;
                overflow-y: auto;
                background: #FFF;
                box-sizing: border-box;
                padding: 24rpx 28rpx;
                font-size: 24rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                border-top: 3rpx solid #EEEEEE;
                .type-active {
                    color: #0091FF;
                }
                & > span {
                    margin-right: 30rpx;
                }
                .nav-icon {
                    display: inline-block;
                    width: 8rpx;
                    height: 34rpx;
                    background-size: 626rpx 219rpx;
                    background-position: -368rpx -33rpx;
                    margin-left: auto;
                    margin-right: 0rpx;
                    position: relative;
                    top: 6rpx;
                }
            }
            .type-statistics {
                position: fixed;
                width: 100%;
                z-index: 996;
                top: 276rpx;
                background: #F5F5F5;
                font-size: 28rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                padding: 20rpx 0rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                label {
                    color: #666666;
                }
                span {
                    color: #333333;
                }
                .split-line {
                    width: 2rpx;
                    height: 20rpx;
                    background: #999999;
                    border-radius: 2rpx;
                    opacity: 0.39;
                    margin: 0rpx 40rpx;
                }
            }
        }
        .allRecords {
            .card-panel {
                margin-top: 260rpx;
            }
            .card {
                margin-top: 0rpx;
            }
        }
        .footer {
            position: fixed;
            left: 0%;
            bottom: 0%;
            width: 100%;
            height: 154rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #FFF;
            .addProblemReportingButton {
                display: inline-block;
                padding: 20rpx 200rpx;
                font-size: 40rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                background: linear-gradient(360deg, #2B80FF 0%, #65BCFF 100%);
                box-shadow: 0rpx 6rpx 12rpx 0rpx rgba(12,126,161,0.35);
                border-radius: 76rpx;
            }
        }
        .fixed-bottom {
            width: 100%;
            position: fixed;
            left: 0;
            bottom: 0;
        }
        van-tabs {
            van-sticky {
                position: fixed;
                width: 100%;
                z-index: 996;
                border-top: 3rpx solid #EEEEEE;
            }
        }
	}
</style>