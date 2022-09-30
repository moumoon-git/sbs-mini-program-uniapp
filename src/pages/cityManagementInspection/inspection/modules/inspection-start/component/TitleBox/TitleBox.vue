<template>
	<view class="top-box" @click="$emit('click')">
		<view class="title">
			<view class="noproblem" v-if="inspectionTaskItems.instanceInforEntity.status === '1'">未发现问题</view>
			<view class="hasproblem" v-if="inspectionTaskItems.instanceInforEntity.status === '0'">存在问题</view>
			<text class="overflow-ellipsis" style="flex: 1;">{{inspectionTaskItems.name}}</text>
			<van-icon :name="isExpand ? 'arrow-up' : 'arrow-down'" />
		</view>
		<view class="bottom">
			<view class="dec">
				{{inspectionTaskItems.content}}
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		props: {
			inspectionTaskItems: {
				type: Object
			},
			isExpand: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				imgStaticUrl: this.$imgStaticUrl
			}
		},
		methods: {
		}
	}
</script>

<style>
	.noproblem, .hasproblem {
		text-align: center;
		height: 49rpx;
		line-height: 49rpx;
		padding: 0 20rpx;
		background: rgba(22, 200, 139, 0.08);
		color: #0BD295;
		margin-right: 15rpx;
		font-size: 20rpx;
	}
	.hasproblem {
		background: rgba(200, 48, 22, 0.08);
		color: #F66E6E;
	}
	.top-box {
		width: 100%;
		background: #FFFFFF;
		padding-bottom: 35rpx;
		position: relative;
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
		border-bottom: 1px solid #DDDDDD;
		display: flex;
		align-items: center;
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
	.img-tag {
		position: absolute;
		right: 0;
		top: 0;
		width: 100rpx;
		height: 100rpx;
	}
</style>
