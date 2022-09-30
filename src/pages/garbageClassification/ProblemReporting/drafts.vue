<template>
	<view class="drafts">
	    <container class="container">
            <scroll-view style="height: 100vh;" :scroll-y="true" :scroll-with-animation="true" @scrolltolower="handleScrollToLower">
                <view class="card" v-for="(item) in draftsList" :key="item.id"  @longpress="handleLongpress(item.id)" @click="handleViewReportingDetail(item.id)">
                    <view class="card-header">
                        <span v-if="item.typeName">{{ item.typeName }}</span>
                        <h1>{{ item.typeNames }}</h1>
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
                <van-empty v-if="draftsList.length==0" description="暂无数据" />
            </scroll-view>   
        </container>
        <van-dialog id="van-dialog" />
	</view>
</template>

<script>
import {
  defineComponent
} from 'vue';
import Dialog from "@/wxcomponents/vant/dist/dialog/dialog"

export default defineComponent({
  name: 'drafts',
  data() {  
	return {
        draftsList: [],
        startTime: '',
        endTime: '',
        isScrollEnd: false,
        currentPage: 1
	}
   },
   components: {
   },
   created() {
       this.getDraftsList();
   },
   onLoad(option) {
       this.startTime = option.startTime;
       this.endTime = option.endTime;
   },
  methods: {
    handleScrollToLower() {
        if(!this.isScrollEnd) {
            this.currentPage+=1;
            this.getDraftsList();
        } else {
            wx.showToast({
                title: '已经到底部了',
                icon: 'none',
            });
        }
    },
    getDraftsList() {
        this.$http.post({
          url: '/reporting/list',
          data: {
            limit: 10,
            page: this.currentPage,
            search: '',
            startTime: this.startTime.search('开始日期')!=-1?'':this.startTime,
            endTime: this.endTime.search('结束日期')!=-1?'':this.endTime,
            typeId: '',
            mailContactorId: wx.getStorageSync('userId'),
            belongTo: 1
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
            this.draftsList = this.draftsList.concat(data.data.list);
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    handleLongpress(id) {
        let that = this
        Dialog.confirm({
            title: '提示',
            message: '是否删除该信息',
        })
        .then(() => {
            that.$http.post({
            url: '/reporting/delete',
                data: {
                    "ids": [id]
                }
            })
            .then(({ data }) => {
                console.log('/reporting/delete data', data);
                if (data.code == 0) {
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                    });
                    this.isScrollEnd = false;
                    this.currentPage = 1;
                    this.draftsList = [];
                    this.getDraftsList();
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'error',
                    });
                }
            });
        })
    }, 
    handleViewReportingDetail(id) {
      wx.navigateTo({
          url: `/pages/garbageClassification/ProblemReporting/IssueReport?id=${id}`
      });
    }
  }
});
</script>

<style lang="less">	
    page {
        background: #F5F5F5;
    }
	.drafts {
		height: 100%;
		display: block;
		padding: 0rpx;
		box-sizing: border-box;
		.container {
            height: 100%;
            display: block;
            padding: 0rpx;
            box-sizing: border-box;
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
        }
	}
</style>