<template>
	<view class="container">
		<header>
			<van-search v-model="searchKey" shape="round" placeholder="请输入搜索关键词" @focus="handleSearchFocus" />
		<!-- 	<view class="custom-tabs">
				<text :class="['custom-tab',{'custom-tab-active':active==''}]" data-name="0" @click="handleTabChange">全部</text>
				<text :class="['custom-tab',{'custom-tab-active':active=='1'}]" data-name="1" @click="handleTabChange">通知</text>
				<text :class="['custom-tab',{'custom-tab-active':active=='2'}]" data-name="2" @click="handleTabChange">公告</text>
			</view> -->
		</header>
		<section class="content">
			<block v-if="notificationList.length!=0">
				<view class="card" v-for="(item) in notificationList" :key="item.id" :data-id="item.id" @click="handleNavigate">
					<!-- <image class="card-preview" :src="item.coverImage?item.coverImage:'https://z3.ax1x.com/2021/10/20/5BtxV1.png'"></image> -->
					<view class="card-left">
						<view class="card-content">
							<text class="card-title">{{item.title}}</text>
						</view>
						<view class="card-footer">
<!-- 							<text class="card-area">xx市应急指挥中心</text>
							<text class="card-separator"></text> -->
							<text class="card-date">{{item.publishTime}}</text>
						</view>
					</view>
					<view v-if="item.coverImage" class="card-right">
						<van-image class="card-preview" width="100%" height="180rpx" :src="config.host+item.coverImage"/>
					</view>
				</view>
			</block>
			<block v-else>
				<van-empty description="暂无数据" />
			</block>
		</section>
	</view>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
} from 'vue';
import config  from '@/static/config/index.js';

export default defineComponent({
  name: 'notification',
  data() {
  	return {  
  	  searchKey: '', //搜索关键词
	  active: '', //当前选中tab的标识符
  	  notificationList: [], //通知公告列表
	  config: config
  	}
   },
  components: {
  },
  setup() {
    const {
      $http,
    } = getCurrentInstance().appContext.config.globalProperties;
  	
  	return {
  
  	};
  },
  /**
    * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面显示
  */
  onShow: function () {
    this.getNotificationList();
  },
  methods: {
	  // 获取通知公告列表
	  getNotificationList() {
		  this.$http.get({
			  url: `/appManagement/smallRoutine/noticeList?noticeType=${this.active}&title=${this.searchKey}&contactId=${wx.getStorageSync('userId')}`
		  }).then(({data}) => {
			  console.log(`/appManagement/smallRoutine/noticeList?noticeType=${this.active}&title=${this.searchKey}&contactId=${wx.getStorageSync('userId')} data`, data);
			  if(data.code === 0) {
				this.notificationList = data.page;
			  } else {
				  wx.showToast({
					  title: data.msg,
					  icon: 'error'
				  });
			  }
		  });
	  },
	  // 点击通知公告时触发跳转
	  handleNavigate(event) {
		  wx.navigateTo({
			  url: `/pages/publicPage/notification/modules/notification-detail?id=${event.currentTarget.dataset.id}`
		  });
	  },
	  handleTabChange(event) {
		this.active = event.currentTarget.dataset.name=="0"?'':event.currentTarget.dataset.name;
		this.getNotificationList();
	  },
	  handleSearchFocus() {
			wx.navigateTo({
				url: `/pages/publicPage/custom-components/search/search?searchType=notification&status=${this.active}`
			});
		},
  }
});
</script>

<style lang="less">	
page {
	height: 100vh;
}
.container {
    height: 100%;
    display: block;
    padding: 0rpx;
    box-sizing: border-box;
	background: rgba(245,245,245,0.8);
	header {
		background: #ffffff;
		.custom-tabs {
			color: #666666;
			display: flex;
			align-items: center;
			padding: 10rpx 0rpx 30rpx 0rpx;
			.custom-tab {
				margin-left: 40rpx;
				&-active {
					color: #0091FF;
				}
			}
			.custom-tab:not(:last-child) {
				display: flex;
				align-items: center;
				&:after {
					content: '';
					width: 2rpx;
					height: 38rpx;
					background: #DDDDDD;
					opacity: 60%;
					display: inline-block;
					margin-left: 40rpx;
				}
			}
		}
	}
	.content {
		.card {
			margin: 30rpx;
			background: #ffffff;
			border-radius: 15rpx;
			border: 1rpx solid #eeeeee;
			overflow: hidden;
			box-sizing: border-box;
			padding: 25rpx;
			display: flex;
			.card-left {
				flex: 1;
				height: 180rpx;
				position: relative;
				.card-content {
					.card-title {
						color: #333333;
						font-size: 38rpx;
						font-weight: 800;
						width: 100%;
						height: 150rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
						overflow: hidden;
					}
				}
				.card-footer {
					color: #999999;
					font-size: 20rpx;
					display: flex;
					align-items: center;
					position: absolute;
					bottom: 0%;
					overflow: hidden;
					.card-area {
						white-space: nowrap;
						max-width: 160rpx;
						text-overflow: ellipsis;
						overflow: hidden;
					}
					.card-separator {
						width: 2rpx;
						height: 30rpx;
						background: #DDDDDD;
						opacity: 60%;
						margin: auto 16rpx;
					}
					.card-date {
						white-space: nowrap;
						// max-width: 170rpx;
						// text-overflow: ellipsis;
						// overflow: hidden;
					}
				}
			}
			.card-right {
				width: 250rpx;
				.card-preview {
					display: block;
					width: 100%;
					height: 180rpx;
				}
			}
		}
		
	}
} 
</style>
