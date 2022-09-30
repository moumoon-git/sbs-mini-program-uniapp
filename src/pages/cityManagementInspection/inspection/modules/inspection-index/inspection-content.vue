<template>
	<view>
		<van-search :value="keyword" placeholder="请搜索关键字"  @search="onSearch" @focus="handleSearchFocus" />
		<view class="list-box" @click="toDetail(item.id)" v-for="item in inspectionList" :key="item.id">
			<view class="title">
				{{item.name}}
				<text class="inspectionBox task-inspection" v-if="item.type === 0">
					任务巡查
				</text>
				<text class="inspectionBox routine-inspection" v-else>
					例行巡查
				</text>
			</view>
			<view class="detail">
				{{item.remark || ''}}
			</view>
			<view class="location grey-color">
				<view class="overflow-ellipsis">
					<van-icon name="location-o" />
					<text v-for="(item1, i) in item.allPointList" :key="i">
						{{item1.place}}{{i !== item.allPointList.length - 1 ? '、' : ''}}
					</text>
				</view>
			</view>
			<view class="time grey-color">
				<van-icon name="clock-o" />
				<text>发布时间：{{item.gmtCreate || ''}}</text>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		props: {
			inspectionList: {
				type: Array
			},
			keyword: {
				type: String,
				default: '请输入搜索关键词'
			},
		},
		data() {
			return {
			}
		},
		methods: {
			toDetail(id) {
				uni.navigateTo({
					url: `/pages/cityManagementInspection/inspection/modules/inspection-detail/inspection-detail?id=${id}`,
					// url: `./modules/inspection-detail/inspection-detail?id=311`,
					success: function(res) {
					    // 通过eventChannel向被打开页面传送数据
					    res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
					}
				})
			},
			onSearch(event) {
				// this.keyword = event.detail
				// getIinvestigation(this.keyword).then((res) => {
				// 	console.log(res)
				// 	// this.list = res.data.list
					
				// })
			},
			handleSearchFocus() {
				this.$emit('handleSearchFocus');
			}
		}
	}
	
</script>

<style>
</style>
