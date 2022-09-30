<template>
  <view class="container">
    <header>
      <h1 class="article-title">{{ notificationDetail.title }}</h1>
      <view class="article-source">
        <text class="article-account">{{
          notificationDetail.platformName
        }}</text>
        <text
          v-if="
            notificationDetail.platformName && notificationDetail.publishTime
          "
          class="article-separator"
        ></text>
        <text class="article-time">{{ notificationDetail.publishTime }}</text>
        <!--  <view class="read-amount">
	                <van-icon name="eye" size="36rpx"/>
	                <text style="margin-left: 8rpx;">{{notificationDetail.readNums?notificationDetail.readNums:0}}</text>
	            </view> -->
      </view>
    </header>
    <view class="content">
      <rich-text :nodes="notificationDetail.content"></rich-text>
      <view v-if="notificationDetail.pictures.length != 0" class="image-list">
        <van-image
          v-for="imageItem in notificationDetail.pictures"
          :key="imageItem.iid"
          class="card-preview"
          mode="contain"
          width="100%"
          height="400rpx"
          :src="config.host + imageItem.vcUrl"
          :data-src="config.host + imageItem.vcUrl"
          @click="handlePreviewImage"
        />
      </view>
      <view v-if="notificationDetail.files.length != 0" class="file-list">
        <view
          v-for="fileItem in notificationDetail.files"
          :key="fileItem.iid"
          class="file-item"
        >
          <i class="file-icon"></i>
          <text class="file-name">{{ fileItem.vcTitle }}</text>
          <text
            class="file-download"
            :data-url="config.host + fileItem.vcUrl"
            @click="handleFileDownload"
            >下载</text
          >
        </view>
      </view>
    </view>
    <!-- 	    <footer>
	        <view class="comment-header">
	            <text class="comment-header-title">评论</text>
	            <text class="comment-header-amount">({{notificationDetail.commentNums}})</text>
	        </view>
	        <comment-tree :noticeComment-tree="notificationDetail.noticeCommentTree" @handlepopupfocus="handlePopupFocus"></comment-tree>
	        <view @click="handlePopupFocus">
	        	<van-search
	        	    shape="round"
	        		:disabled="true"
	        	    left-icon="edit"
	        	    placeholder="我来说两句"
	        	    @focus="handlePopupFocus"
	        	/>
	        </view>
	    </footer>
	    <van-popup
	        :show="popupVisible"
	        round
	        closeable
	        close-icon-position="top-left"
	        position="bottom"
	        custom-style="height: 400rpx"
	        @close="handlePopupClose"
	    >   
	        <view class="popup-header">
	            <text>{{popupTitle}}</text>
	            <van-button type="info" round size="small" :disabled="!fieldValue" @click="handleComment">发表</van-button>
	        </view>
	        <van-field
				:value="fieldValue"
	            type="textarea"
	            :focus="true"
	            :placeholder="placeholder"
	            autosize
	            :border="false"
				@change="handleFieldChange"
	        />
	    </van-popup> -->
  </view>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue';
// import commentTree from '../components/comment-tree/comment-tree.vue';
import config from '@/static/config/index.js';

export default defineComponent({
  name: 'notification-detail',
  data() {
    return {
      config: config,
      id: '', //通知公告id
      popupVisible: false, //是否显示弹出层
      popupTitle: '', //弹出层标题
      placeholder: '', //输入框为空时占位符
      fieldValue: '', //当前输入的值
      notificationDetail: {}, //通知公告详情
      userinfoName: '', //被评论人名字
      userinfoId: '', //被评论内容id
    };
  },
  components: {
    // 'comment-tree': commentTree
  },
  setup() {
    const { $http } = getCurrentInstance().appContext.config.globalProperties;

    return {};
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.id = options.id;
    this.getNotificationDetail();
    this.handleHasBeenRead();
  },
  methods: {
    // 输入框聚焦时触发
    handlePopupFocus(event) {
      console.log(event);
      var popupTitle =
        event.popupTitle ||
        event.currentTarget.dataset.popupTitle ||
        event.detail.popupTitle;
      var userinfoName =
        event.userinfoName ||
        event.currentTarget.dataset.userinfoName ||
        event.detail.userinfoName;
      var userinfoId =
        event.userinfoId ||
        event.currentTarget.dataset.userinfoId ||
        event.detail.userinfoId;

      this.popupVisible = true;
      this.popupTitle = popupTitle || '评论';
      this.placeholder = userinfoName ? `回复 ${userinfoName}：` : '说点什么吧';
      this.userinfoName = userinfoName;
      this.userinfoId = userinfoId;
    },
    // 关闭弹出层时触发
    handlePopupClose() {
      this.popupVisible = false;
      this.fieldValue = '';
    },
    // 获取通知公告详情
    getNotificationDetail() {
      this.$http
        .get({
          url: `/appManagement/notice/${this.id}`,
        })
        .then(({ data }) => {
          console.log(`/appManagement/notice/${this.id} data`, data);
          if (data.code === 0) {
            this.notificationDetail = data.data;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    // 记录已读
    handleHasBeenRead() {
      this.$http
        .get({
          url: `/appManagement/smallRoutine/updateStatus?noticeId=${
            this.id
          }&contactId=${wx.getStorageSync('userId')}`,
        })
        .then(({ data }) => {
          console.log(
            `/appManagement/smallRoutine/updateStatus?noticeId=${
              this.id
            }&userId=${wx.getStorageSync('userId')} data`,
            data
          );
        });
    },
    // 发表评论
    handleComment() {
      this.$http
        .post({
          url: '/notice/noticecomment/save',
          data: {
            parentId: this.userinfoId || '0',
            fromUid: wx.getStorageSync('userId'),
            noticeId: this.id,
            content: this.fieldValue,
            toUname: this.userinfoName || '',
          },
        })
        .then(({ data }) => {
          console.log('/notice/noticecomment/save data', data);
          if (data.code === 0) {
            this.popupVisible = false;
            this.fieldValue = '';
            wx.showToast({
              title: '评论成功',
              icon: 'success',
            });
            this.getNotificationDetail();
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    handleFieldChange(event) {
      console.log('handleFieldChange', event);
      this.fieldValue = event.detail;
    },
    handleFileDownload(event) {
      wx.downloadFile({
        url: event.currentTarget.dataset.url, //仅为示例，并非真实的资源
        success(res) {
          console.log(
            '%c [ xxx ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            res
          );
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            wx.openDocument({
              filePath: res.tempFilePath,
              success: function(res) {
                console.log('打开文档成功');
              },
            });
          }
        },
      });
    },
    // 预览图片
    handlePreviewImage(event) {
      wx.previewImage({
        current: event.currentTarget.dataset.src, // 当前显示图片的http链接
        urls: [event.currentTarget.dataset.src], // 需要预览的图片http链接列表
      });
    },
  },
});
</script>

<style lang="less">
.container {
  height: 100%;
  display: block;
  padding: 0rpx;
  box-sizing: border-box;
  h1 {
    display: block;
    font-weight: 1000;
    font-size: 40rpx;
    color: #333333;
  }
  h4 {
    display: block;
    font-weight: 1000;
    font-size: 33rpx;
    color: #333333;
  }
  header {
    display: block;
    position: relative;
    .article-title {
      box-sizing: border-box;
      padding: 36rpx 0rpx 0rpx 36rpx;
    }

    .article-source {
      position: relative;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 30rpx 0rpx 30rpx 36rpx;
      font-size: 24rpx;
      color: #999999;
      .article-separator {
        width: 2rpx;
        height: 26rpx;
        background: #dddddd;
        opacity: 60%;
        margin: auto 16rpx;
      }
      .read-amount {
        display: flex;
        position: absolute;
        right: 36rpx;
      }
    }
  }
  .content {
    box-sizing: border-box;
    padding: 36rpx 36rpx 80rpx 36rpx;
    color: #333;
    .article-h4 {
      margin: 20rpx 0rpx;
    }

    .article-image {
      display: block;
      height: 380rpx;
      width: 100%;
      margin: 20rpx 0rpx;
    }
    .image-list {
      border-top: 1rpx solid rgba(221, 221, 221, 0.6);
      margin-top: 20rpx;
      .van-image {
        display: block;
        margin-top: 20rpx;
      }
      .card-preview {
      }
    }
    .file-list {
      border-top: 1rpx solid rgba(221, 221, 221, 0.6);
      margin-top: 20rpx;
      .file-item {
        margin-top: 20rpx;
        display: flex;
        align-items: center;
        .file-icon {
          background: url(https://z3.ax1x.com/2021/11/05/Ius9Jg.png) no-repeat;
          width: 30rpx;
          height: 45rpx;
          display: inline-block;
          background-position: -30rpx -79rpx;
          background-size: 300rpx 150rpx;
        }
        .file-name {
          color: #333333;
          margin-left: 10rpx;
        }
        .file-download {
          color: #0091ff;
          margin-left: 20rpx;
        }
      }
    }
  }
  footer {
    display: block;
    border-top: 1rpx solid rgba(221, 221, 221, 0.5);
    box-sizing: border-box;
    margin: 0rpx 36rpx;
    padding-bottom: 130rpx;
    .comment-header {
      padding: 30rpx 0rpx;
      .comment-header-title {
        font-size: 40rpx;
        font-weight: 1000;
        color: #333333;
      }

      .comment-header-amount {
        color: #999999;
        margin-left: 10rpx;
      }
    }
  }
  .van-icon.van-icon-chat-o {
    position: absolute;
    right: 0%;
    top: 0%;
  }
  .van-search {
    width: 100%;
    position: fixed;
    bottom: 0%;
    left: 0%;
  }
  .popup-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30rpx 0rpx;
    position: relative;
    .van-button {
      position: absolute;
      right: 5%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
