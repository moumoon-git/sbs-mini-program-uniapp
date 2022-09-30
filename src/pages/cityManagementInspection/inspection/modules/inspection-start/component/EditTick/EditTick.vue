<template>
  <view class="EditTick">
    <title-box
      v-if="inspectionTaskItems.name && inspectionTaskItems.content"
      :inspectionTaskItems="inspectionTaskItems"
      :isExpand="isExpand"
      @click="expand"
    />
    <view
      class="other"
      v-show="
        isExpand || (!inspectionTaskItems.name && !inspectionTaskItems.content)
      "
    >
      <view class="result maring-box">
        <view><text style="color: #EC808D;">*</text>是否存在问题</view>
        <view class="radio-btn-group">
          <view
            class="no-select"
            :style="
              editData.status === '1'
                ? 'border-color: rgb(22, 200, 139); color: rgb(22, 200, 139);'
                : ''
            "
            @click="selectOne('1')"
          >
            否
            <van-icon
              v-show="editData.status === '1'"
              class="icon"
              name="checked"
              style="color: #19be6b"
            />
          </view>
          <view
            class="no-select"
            :style="
              editData.status === '0'
                ? 'border-color: rgb(246, 110, 110); color: rgb(246, 110, 110);'
                : ''
            "
            @click="selectOne('0')"
          >
            是
            <van-icon
              v-show="editData.status === '0'"
              class="icon"
              name="warning"
              style="color: #fa7e7e"
            />
          </view>
        </view>
      </view>
      <!-- <view v-show="result=='0'">
			  <text
				style="font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(51,51,51,1);"
			  >通知处置人员</text>
			  <view style="padding: 1vh 0px 0px;">
				<van-radio-group v-model="isNotice" direction="horizontal">
				  <van-radio name="0">通知</van-radio>
				  <van-radio name="1">不通知</van-radio>
				</van-radio-group>
			  </view>
			</view> -->
      <view>
        <view class="remark maring-box">
          <view>情况说明</view>
          <van-field
            :value="editData.remark"
            @input="inputChange"
            placeholder="请输入情况说明"
            style="padding: 0px;"
          />
        </view>
        <view class="pic-box maring-box">
          <view
            ><text style="color: #EC808D;" v-if="inspectionTaskItems.photograph"
              >*</text
            >拍照说明</view
          >
          <van-uploader
            :file-list="editData.fileList"
            :capture="['camera']"
            @after-read="afterRead"
            upload-text="图片上传"
            @delete="deleteFile"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import TitleBox from '../TitleBox/TitleBox.vue';
import config from '@/static/config/index.js';
export default {
  props: {
    isExpand: {
      type: Boolean,
      default: false,
    },
    inspectionTaskItems: {
      type: Object,
    },
    editData: {
      type: Object,
    },
    confirmData: {
      type: Object,
    },
    taskId: {
      type: Number,
    },
    instanceEntitiesId: {
      type: Number,
    },
    index: {
      type: Number,
    },
    location: {
      type: String,
    },
  },
  data() {},
  components: {
    TitleBox,
  },
  methods: {
    expand() {
      console.log(123);
      this.$emit('expand', this.index);
    },
    inputChange(e) {
      console.log(e);
      this.$emit('remarkChange', this.index, e.detail);
    },
    selectOne(i) {
      // this.$emit('update: editData.status', i)
      // this.editData.status = i
      this.$emit('selectFlag', this.index, i);
    },

    afterRead(event) {
      console.log('afterRead', event);
      const { name, file } = event.detail;
      let upFiles = [];
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      if (file instanceof Array) {
        upFiles.push(...file);
      } else {
        upFiles.push(file);
      }
      upFiles.forEach((item) => {
        console.log(item);
        wx.uploadFile({
          url: `${config.baseUrl}/upload/passImgWithLogo`, // 仅为示例，非真实的接口地址
          // url: 'https://scg.chinaemt.com/ser/upload/passImg',
          filePath: item.url,
          name: 'file',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            token: wx.getStorageSync('token'),
          },
          formData: {
            'content-type': 'multipart/form-data',
            charset: 'utf-8',
            file: item.url,
            address: this.location,
          },
          success: (res) => {
            let data = JSON.parse(res.data);

            if (data.code === 0) {
              this.$emit('uploadImg', this.index, data.data);
            }
          },
          fail: (res) => {
            console.log('fail', res);
          },
          complete: (res) => {
            console.log('complete', res);
          },
        });
      });
    },
    deleteFile(event) {
      console.log('onDelete', event);
      const { index } = event.detail;
      this.$emit('deleteImg', this.index, index);
    },
  },
};
</script>

<style>
.EditTick {
  width: 94%;
  margin: 0 auto;
  background-color: #fff;
  overflow: hidden;
}
.other {
  width: 630rpx;
  margin: 0rpx auto;
  padding-bottom: 20rpx;
}
.radio-btn-group {
  display: flex;
  margin-top: 20rpx;
}
.no-select {
  width: 210rpx;
  height: 78rpx;
  line-height: 78rpx;
  color: #666666;
  font-size: 28rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  border: 2rpx solid #f5f5f5;
  margin-right: 15rpx;
  text-align: center;
  position: relative;
}
.icon {
  position: absolute;
  right: -6px;
  bottom: -6px;
}
.pic-box {
  /* height: 272rpx; */
  border-top: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;
}

.maring-box {
  margin: 50rpx 0;
}
</style>
