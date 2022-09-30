<template>
	<view class="content" style="background: #F5F5F5;">
		<van-tabs color="#3F8EF7"  @change="handleTabChange">
			<van-tab title="待巡">
				<inspectionContent :inspectionList="uninspect" :keyword="keyword" @handleSearchFocus="handleSearchFocus" />
				<view class="empty-box" v-if="uninspect.length === 0">
					<image 
						:src="imgStaticUrl + '/img/inspection/empty.png'" mode="" 
						style="width: 75rpx;height: 75rpx;">
					</image>
					<view class="">
						暂无数据
					</view>
				</view>
				
			</van-tab>
			<van-tab title="已巡">
				<inspectionContent :inspectionList="inspected" :keyword="keyword" @handleSearchFocus="handleSearchFocus"  />
				<view class="empty-box" v-if="inspected.length === 0">
					<image 
						:src="imgStaticUrl + '/img/inspection/empty.png'" mode="" 
						style="width: 75rpx;height: 75rpx;">
					</image>
					<view class="">
						暂无数据
					</view>
				</view>
			</van-tab>
		</van-tabs>
	</view>
</template>

<script>
	import { getIinvestigation } from '@/apis/index.js';
	import inspectionContent from './modules/inspection-index/inspection-content.vue';
	
	export default {
		components: {
			inspectionContent
		},
		data() {
			return {
				imgStaticUrl: this.$imgStaticUrl,
				inspected: [],
				uninspect: [],
				keyword: '',
				active: 0
			}
		},
		onShow() {
			getIinvestigation({
				status: 0
			}).then((res) => {
				console.log(res)
				if(res.data.code === 0) {
					this.uninspect = res.data.list
				}
			}).then(() => {
				getIinvestigation({
					status: 1
				}).then((res) => {
					console.log(res)
					if(res.data.code === 0) {
						this.inspected = res.data.list
					}
				})
			})
			
		},
		methods: {
			handleSearchFocus() {
				wx.navigateTo({
					url: `/pages/custom-components/search/search?searchType=inspection&status=${this.active}`
				});
			},
			// 当前tab改变时触发的回调函数
			handleTabChange(name, title) {
				this.active = name.detail.index;
			}
		}
	}
</script>

<style>
	.content {
		min-height: 100vh;
		overflow: hidden;
	}
	
	.empty-box {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.overflow-ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.inspectionBox {
		padding: 0rpx 20rpx;
		text-align: center;
		color: #fff;
		font-size: 18rpx;
		white-space: nowrap;
	}
	
	.task-inspection {
		background-color: #FACD91;
	}
	
	.routine-inspection {
		background-color: #66D9D9;
	}
	
	.list-box {
		width: 90%;
		padding: 20rpx 32rpx;
		background: #FFFFFF;
		border-radius: 4px;
		margin: 20rpx auto;
	}
	
	.list-box .title {
		font-size: 36rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: bolder;
		color: #333333;
		line-height: 42rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.list-box .detail {
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
		line-height: 42rpx;
		margin-bottom: 20rpx;
	}
	.list-box .grey-color {
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		line-height: 55rpx;
	}
</style>
