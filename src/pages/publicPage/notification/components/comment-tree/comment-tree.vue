<template>
	<block v-if="noticeCommentTree.length!=0">
	    <view class="comment-block" v-for="(comment) in noticeCommentTree" :key="comment.id">
	        <view class="comment-userInfo">
	            <text class="comment-userInfo-name">{{comment.fromUname}}</text>
	            <text class="comment-userInfo-time">{{comment.createTime}}</text>
	        </view>
	        <view class="comment-text">
	            <van-icon name="chat-o" size="30rpx" @click="handlePopupFocus" data-popup-title="回复" :data-userInfo-name="comment.fromUname" :data-userInfo-id="comment.id"/>
	            <text>{{comment.content}}</text>
	        </view>
	        <view v-if="comment.children && comment.children.length!=0" class="reply-list">
	            <comment-tree-item :comment-tree-item="comment.children" @handlepopupfocus="handlePopupFocus"></comment-tree-item>  
	        </view>
	    </view>
	</block>
	<block v-else>
	    <view class="no-comment-block">
	        <text>暂无评论</text>
	    </view>
	</block>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
} from 'vue';
import commentTreeItem from './comment-tree-item.vue'

export default defineComponent({
  name: 'comment-tree',
  data() {
  	return {  
  	}
   },
   props: {
	   noticeCommentTree: {
		   type: Array
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
		console.log('父亲event',event)
		var popupTitle = event.popupTitle || event.currentTarget.dataset.popupTitle || event.detail.popupTitle;
		var userinfoName = event.userinfoName || event.currentTarget.dataset.userinfoName || event.detail.userinfoName;
		var userinfoId = event.userinfoId || event.currentTarget.dataset.userinfoId || event.detail.userinfoId;
		this.$emit('handlepopupfocus', {popupTitle, userinfoName, userinfoId});
	},
  }
});
</script>

<style lang="less">	
.comment-block {
    box-sizing: border-box;
    padding: 0rpx 10rpx;
    color: #333;
    font-size: 30rpx;
	.comment-userInfo {
		.comment-userInfo-name {
		    font-weight: 1000;
		    color: #0091FF;
		}
		
		.comment-userInfo-time {
		    font-size: 28rpx;
		    color: #999999;
		    margin-left: 20rpx;
		}
	}
	.comment-text {
	    padding: 10rpx 0rpx;
	    position: relative;
	}
	.reply-list {
	    box-sizing: border-box;
	    padding: 20rpx;
	    background: rgba(221,221,221,0.3);
	}
	.no-comment-block {
	    color: #999999;
	    text-align: center;
	}
	.van-icon.van-icon-chat-o {
	    position: absolute;
	    right: 0%;
	    top: 0%;
	}
}
</style>
