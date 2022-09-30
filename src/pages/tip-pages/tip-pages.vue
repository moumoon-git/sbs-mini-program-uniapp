<template>
	<view class="container">
		<van-icon name="smile" size="160rpx" color="#07c160" />
		<text>{{label}}</text>
	</view>
</template>

<script>
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'tip-pages',
  data() {
  	return {
  	}
   },
   props: {
	   label: {
		   type: String,
		   default: '暂无权限'
	   }
   },
  components: {
  },
  methods: {
  },
});
</script>

<style lang="less">	
	.container {
	    height: 100%;
	    display: flex;
	    padding: 0rpx;
	    box-sizing: border-box;
		.van-icon.van-icon-smile {
			margin-top: 200rpx;
		}
		text {
			margin-top: 30rpx;
			font-size: 35rpx;
		}
	} 
</style>
