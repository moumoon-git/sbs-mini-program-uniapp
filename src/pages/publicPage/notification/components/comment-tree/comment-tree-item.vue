<template>
	<view>
		<block  v-for="(comment) in commentTreeItem"  :key="comment.id">
			<view class="reply-block">
			    <view class="reply-userInfo">
			        <text class="reply-userInfo-name">{{comment.fromUname}}</text>
			        <text class="reply-userInfo-time">{{comment.createTime}}</text>
			    </view>
			    <view class="reply-text">
			        <van-icon name="chat-o" size="30rpx" @click="handlePopupFocus" data-popup-title="回复" :data-userInfo-name="comment.fromUname" :data-userInfo-id="comment.id"/>
			        <text v-if="comment.fromUname2">回复</text>
			        <text v-if="comment.fromUname2" class="reply-userInfo-name" style="margin-left: 10rpx;">{{comment.fromUname2}}</text>
			        <text>{{(comment.fromUname2?'：':'')+(comment.content)}}</text>
			    </view>
			</view>
			<comment-tree-item :comment-tree-item="comment.children" @handlepopupfocus="handlePopupFocus"></comment-tree-item>
		</block>
	</view>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
} from 'vue';
import commentTreeItem from './comment-tree-item.vue'

export default defineComponent({
  name: 'comment-tree-item',
  data() {
  	return {  
  	}
   },
   props: {
		commentTreeItem: {
			type: Array,
			value: () => [],
		}
    },
  components: {
	  'comment-tree-item': commentTreeItem
  },
  setup() {
    const {
      $http,
    } = getCurrentInstance().appContext.config.globalProperties;
  	
  	return {
  
  	};
  },
  methods: {
	// 输入框聚焦时触发
	handlePopupFocus(event) {
		console.log('eventeventeventeventeventevent',event)
		var popupTitle =  event.popupTitle || event.currentTarget.dataset.popupTitle || event.detail.popupTitle;
		var userinfoName = event.userinfoName || event.currentTarget.dataset.userinfoName || event.detail.userinfoName;
		var userinfoId = event.userinfoId || event.currentTarget.dataset.userinfoId || event.detail.userinfoId;
		this.$emit('handlepopupfocus', {popupTitle, userinfoName, userinfoId})
	}
  }
});
</script>

<style lang="less">	
.reply-userInfo {
	.reply-userInfo-name {
	    font-weight: 1000;
	    color: #0091FF;
	}
	
	.reply-userInfo-time {
	    font-size: 28rpx;
	    color: #999999;
	    margin-left: 20rpx;
	}
}
.reply-text {
    padding: 10rpx 0rpx;
    position: relative;
}
</style>
