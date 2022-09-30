<template>
	<view class="SecondaryClassificationBoard">
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
	    </header>
	    <container class="container">
            <section class="board-panel">
                <header>
                    <label>名称</label>
                    <label>总数(件)</label>
                    <label>办结数(件)</label>
                    <label>完结率</label>
                </header>
                <view class="table-panel">
                    <p v-for="(statisticsItem) in boardStatistics" :key="statisticsItem.id">
                        <span>{{statisticsItem.typeName}}</span>
                        <span>{{statisticsItem.allSum}}</span>
                        <span>{{statisticsItem.completed}}</span>
                        <span>{{`${statisticsItem.settlementRate}%`}}</span>
                    </p>
                </view>
            </section> 
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
  name: 'SecondaryClassificationBoard',
  data() {  
	return {
        imgStaticUrl: this.$imgStaticUrl,
        timeActive: 'date',
        datetimeVisible: false,
        dateTag: '',
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
        startFormatterDate: '开始日期',
        endFormatterDate: '结束日期',
        minDate: new Date(2010,0,1).getTime(),
        maxDate: new Date().getTime(),
        boardStatistics: [],
        id: ''
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

    },
    onLoad(option) {
       this.id = option.id;
       this.getBoardStatistics();
    },
  methods: {
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
        this.getBoardStatistics();
    },
    handleWeekConfirm(event) {
        console.log('handleWeekConfirm event',event)
        this.datetimeVisible = false;
        let date = event.detail.value.date
        this.startFormatterDate = `${date[0]} 00:00:00`;
        this.endFormatterDate = `${date[1]} 23:59:59`;
        this.getBoardStatistics();
    },
    handleDateCancel() {
        this.datetimeVisible = false;
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
        this.getBoardStatistics();
    },
    getBoardStatistics() {
        this.$http.get({
          url: '/garbage/score/getLeadData',
          data: {
            "type": '0',
            "id": this.id,
            "startTime": this.startFormatterDate.search('开始日期')!=-1?'':this.startFormatterDate,
            "endTime": this.endFormatterDate.search('结束日期')!=-1?'':this.endFormatterDate
          },
        })
        .then(({ data }) => {
          console.log('/garbage/score/getLeadData data', data);
          if (data.code == 0) {
            this.boardStatistics = data.data;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
  }
};
</script>

<style lang="less">	
	.SecondaryClassificationBoard {
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
            white-space: nowrap;
            border-bottom: 3rpx solid rgba(238,238,238,0.5);
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
		}
		.container {
            margin-top: 99rpx;
            height: 100%;
            display: block;
            padding: 0rpx;
            box-sizing: border-box;
            .board-panel {
                margin: 135rpx 30rpx 30rpx 30rpx;
                box-sizing: border-box;
                & > header {
                    display: flex;
                    justify-content: space-between;
                    & > label {
                        display: inline-block;
                        width: 24%;
                        height: 80rpx;
                        line-height: 80rpx;
                        font-size: 12px;
                        font-weight: 400;
                        text-align: center;
                        &:nth-of-type(1) {
                            color: #333333;
                            background: #F1F5F8;
                        }
                        &:nth-of-type(2) {
                            color: #0091FF;
                            background: #F1F6FF;
                        }
                        &:nth-of-type(3) {
                            color: #31B170;
                            background: #F1F8F3;
                        }
                        &:nth-of-type(4) {
                            color: #F2B626;
                            background: #FFF7EE;
                        }
                    }
                }
                .table-panel {
                    & > p {
                        display: flex;
                        justify-content: space-between;
                        position: relative;
                        &:not(:last-of-type) {
                            border-bottom: 3rpx solid rgba(238,238,238,0.5);
                        }
                        & > span {
                            display: inline-block;
                            width: 25%;
                            height: 80rpx;
                            line-height: 80rpx;
                            font-size: 12px;
                            font-weight: 400;
                            text-align: center;
                            overflow:hidden;
                        }
                    }
                }
            }
            
        }
        .fixed-bottom {
            width: 100%;
            position: fixed;
            left: 0;
            bottom: 0;
        }
	}
</style>