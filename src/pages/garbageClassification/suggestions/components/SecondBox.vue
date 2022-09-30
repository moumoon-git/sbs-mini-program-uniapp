<template>
	<view class="flex-box">
		<view 
			v-for="item in list" :key="item.id"
			:class="{'second-box': true, 'activeBox': checkId === item.id}" 
			@click="chooseArea(item)"
		>
			{{item.name}}
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: {
			checkId: {
				type: Number
			},
			list: {
				type: Array,
				default: () => ([])
			}
		},
		methods: {
			chooseArea(data) {
				this.$emit('selectId', data)
			}
		}
	}
</script>

<style>
	.flex-box {
		display: flex;
		flex-wrap: wrap;
		height: 380rpx;
		overflow-y: auto;
	}
	.second-box {
		width: 222rpx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		background-color: #f6f5f8;
		color: #474747;
		font-size: 24rpx;
		margin: 15rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.activeBox {
		background-color: #E1F4FF;
		color: #0093FD;
		position: relative;
	}
	.activeBox::before {
		content: '';
		width: 0;
		height: 0;
		border-top: 40rpx solid #0093FD;
		border-left: 40rpx solid transparent; 
		position: absolute;
		right: 0;
		top: 0;
	}
	.activeBox::after {
		content: '√';
		color: #fff;
		position: absolute;
		right: 0;
		top: -20%;
	}
</style>
