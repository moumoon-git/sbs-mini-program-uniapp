<template>
  <view class="EditTick">
    <title-box
      v-if="inspectionTaskItems.name && inspectionTaskItems.content"
      :inspectionTaskItems="inspectionTaskItems"
      :isExpand="isExpand"
      :hasProblem="editData.status === '0'"
      @click="expand"
    />
    <view class="other" v-show="(isExpand_temp && !isSeeMode) || isEmptyTick">
      <view class="result maring-box">
        <view><text style="color: #EC808D;">*</text>是否存在问题</view>
        <view class="radio-btn-group">
          <view
            class="no-select"
            :style="
              editData.status === '1'
                ? 'background: rgba(22, 200, 139, 0.1);border: 2px solid #16C88B;color: #16C88B;'
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
                ? 'background: rgba(211, 40, 40, 0.1);border: 2px solid #FA7E7E;color: #F66E6E;'
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
        <!-- <view class="more-information">
          <view @click="handledExpand">更多信息</view>
        </view> -->
      </view>
    </view>
    <view class="see-box" v-show="isExpand_temp && isSeeMode">
      <view class="result-card maring-box">
        <view>是否存在问题</view>
        <view v-show="editData.status === '0'">
          <van-icon class="icon" name="warning" style="color: #fa7e7e" />
          <text style="color: #493d3d">是</text>
        </view>
        <view v-show="editData.status === '1'">
          <van-icon class="icon" name="checked" style="color: #19be6b" />
          <text style="color: #19be6b">否</text>
        </view>
      </view>
      <view class="remark-card maring-box">
        <view>情况说明</view>
        <view class="remark-content">{{ editData.remark || '' }}</view>
      </view>
      <view class="img-card maring-box">
        <view>拍照说明</view>
        <image
          :src="item.url"
          v-for="item in editData.fileList"
          :key="item.url"
          class="image-see"
        ></image>
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
    isSeeMode: {
      type: Boolean,
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  computed: {
    isEmptyTick() {
      return (
        !this.inspectionTaskItems.name && !this.inspectionTaskItems.content
      );
    },
    isExpand_temp() {
      if (this.isEmptyTick) {
        return true;
      } else {
        return this.isExpand;
      }
    },
  },
  components: {
    TitleBox,
  },
  mounted() {
    console.log(this.inspectionTaskItems);
  },
  methods: {
    expand() {
      console.log(this.inspectionTaskItems);
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
    handledExpand() {
      console.log(this.editData, 'index');
      wx.navigateTo({
        url: `/pages/garbageClassification/garbageSorting/modules/inspection-rubbish/component/CheckList/CheckList?id=${this.editData.id}`,
      });
    },
  },
};
</script>

<style lang="less">
.EditTick {
	overflow: hidden;
	margin: 0 auto;
	width: 94%;
	background-color: #fff;
}
.other {
	margin: 0rpx auto;
	padding-bottom: 20rpx;
	width: 630rpx;
}
.radio-btn-group {
	display: flex;
	margin-top: 20rpx;
}
.no-select {
	position: relative;
	margin-right: 15rpx;
	border: 2rpx solid #f5f5f5;
	border-radius: 8rpx;
	width: 210rpx;
	height: 78rpx;
	background: #f5f5f5;
	line-height: 78rpx;
	text-align: center;
	font-size: 28rpx;
	color: #666;
}
.icon {
	position: absolute;
	right: -6px;
	bottom: -6px;
}
.pic-box {
	/* height: 272rpx; */
	// border-top: 1px solid #dddddd;
	border-bottom: 1px solid #ddd;
}
.more-information {
	display: flex;
	justify-content: center;
	color: #0091ff;
}

.maring-box {
	margin: 50rpx 0;
}
.see-box {
	margin: 50rpx auto;
	width: 90%;
	.remark-content {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #ddd;
		height: 60rpx;
	}
	.img-card {
		min-height: 160rpx;
		.image-see {
			margin-right: 20rpx;
			width: 160rpx;
			height: 160rpx;
		}
	}
}

</style>
