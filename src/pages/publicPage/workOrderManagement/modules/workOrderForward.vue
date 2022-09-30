<template>
  <div class="forward-container">
    <van-checkbox-group
      :value="checkboxGroup"
      @change="handleChange"
      v-if="list.length != 0"
    >
      <van-cell-group>
        <van-cell
          class="card"
          v-for="(item, index) in list"
          :key="index"
          :data-id="item.id"
          value-class="card"
        >
          <van-checkbox :name="item.id">
            <view class="content">
              <i v-if="item.status == 0" class="card-status-icon disposing"></i>
              <i v-if="item.status == 1" class="card-status-icon disposed"></i>
              <i
                v-if="item.status == -1"
                class="card-status-icon cancelled"
              ></i>
              <view class="card-header">
                <text v-if="item.name" class="card-header-title">{{
                  item.name
                }}</text>
                <text v-if="item.workModuleString" class="card-header-type">{{
                  item.workModuleString
                }}</text>
              </view>
              <view class="card-content">
                <view>
                  <text
                    v-if="item.workPropertyString"
                    class="card-content-type"
                    >{{ item.workPropertyString }}</text
                  >
                  <text v-if="item.remark" class="card-content-text">{{
                    item.remark
                  }}</text>
                </view>
                <view class="annex">
                  <view v-if="item.fileList.length != 0">
                    <text
                      v-for="(fileItem, fileIndex) in item.fileList"
                      :key="fileIndex"
                      class="annex-file"
                      >{{ fileItem.documentName }}、</text
                    >
                  </view>
                </view>
              </view>
              <view class="card-footer">
                <text v-if="item.gmtCreate" class="card-footer-date">{{
                  item.gmtCreate
                }}</text>
                <view v-if="item.workPlace" class="card-footer-address">
                  <i></i>
                  <text>{{ item.workPlace }}</text>
                </view>
              </view>
            </view>
          </van-checkbox>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>

    <block v-else>
      <van-empty description="暂无数据" />
    </block>
    <div class="ft-btn">
      <div class="ft-btn-left">
        <van-checkbox :value="allChecked" @change="allCheckedChange">
          <span :style="{ color: allChecked ? '#1989fa' : '#000' }">全选</span>
        </van-checkbox>
        <span class="color-6"> 已选（{{ checkboxGroup.length }}）</span>
      </div>
      <van-button type="info" style="margin-right: 50rpx;" @click="toForward"
        >确定</van-button
      >
    </div>
  </div>
</template>
<script>
import { getWechatListByChargeMan } from '@/apis/index.js';
export default {
  data() {
    return {
      list: [],
      checkboxGroup: [],
      allChecked: false,
    };
  },
  computed: {},
  onShow() {
    getWechatListByChargeMan().then((res) => {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        res
      );
      if (res.data.code === 0) {
        this.list = res.data.page.list;
        // this.checkboxGroup = Array.from(
        //   { length: this.list.length },
        //   () => false
        // );
        console.log(
          '%c [ xxx ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          this.checkboxGroup
        );
      }
    });
  },
  methods: {
    handleChange(e) {
      console.log(e, '222');
      this.checkboxGroup = e.detail;
      if (this.checkboxGroup.length === this.list.length) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
    },
    allCheckedChange(e) {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        e
      );
      this.allChecked = e.detail;
      if (this.allChecked) {
        this.checkboxGroup = this.list.map((item) => item.id + '');
      } else {
        this.checkboxGroup = [];
      }
    },
    toForward() {
      const contactorId = wx.getStorageSync('userId');
      wx.navigateTo({
        url: `/pages/publicPage/workOrderManagement/modules/forwardWorkOrderManagement?contactorId=${contactorId}&orderId=${JSON.stringify(
          this.checkboxGroup
        )}`,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.forward-container {
	min-height: 100vh;
	background: rgba(245, 245, 245, .8);
	.ft-btn {
		display: flex;
		position: fixed;
		bottom: 0;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		width: 100%;
		height: 89rpx;
		background: #fff;
		box-shadow: 0 -1px 1px 0 rgba(116, 116, 116, .3);
		&-left {
			display: flex;
			.color-6 {
				margin-left: 60rpx;
				font-size: 15px;
				color: #666;
			}
		}
	}
	.card {
		position: relative;
		box-sizing: border-box;
		margin: 20rpx;
		border-radius: 15rpx;
		background: white;
		.content {
			width: 130%;
		}
		.card-status-icon {
			display: inline-block;
			position: absolute;
			right: 0;
			top: 0;
			width: 80rpx;
			height: 80rpx;
			background: url(https://z3.ax1x.com/2021/10/21/5sz0fO.png) no-repeat;
			background-size: 450rpx 200rpx;
			&.disposing {
				background-position: -10rpx -32rpx;
			}
			&.disposed {
				background-position: -100rpx -32rpx;
			}
			&.cancelled {
				background-position: -188rpx -32rpx;
			}
		}
		.card-header {
			display: flex;
			padding: 30rpx 0rpx;
			.card-header-title {
				font-weight: 800;
				font-size: 34rpx;
				color: #333;
			}
			.card-header-type {
				margin-left: 15rpx;
				padding: 4rpx 12rpx;
				border-radius: 20rpx;
				background: #ffbb96;
				font-size: 24rpx;
				color: #ff7a45;
			}
		}
		.card-content {
			display: flex;
			font-size: 28rpx;
			.card-content-type {
				padding: 6rpx 18rpx;
				border-radius: 20rpx;
				background: #e6efff;
				font-size: 26rpx;
				color: #0091ff;
			}
			.card-content-text {
				margin-left: 15rpx;
				line-height: 50rpx;
				color: #666;
			}
			.annex {
				display: initial;
				margin-top: 10rpx;
				swiper {
					margin-bottom: 15rpx;
					height: 350rpx;
					.swiper-image {
						width: 100%;
						height: 100%;
					}
				}
				.annex-file {
					margin-right: 15rpx;
					color: #0091ff;
				}
			}
		}
		.card-footer {
			display: flex;
			position: relative;
			align-items: center;
			padding: 25rpx 0rpx;
			font-size: 26rpx;
			color: #999;
			.card-footer-address {
				display: flex;
				position: absolute;
				right: 0;
				align-items: center;
				i {
					display: inline-block;
					margin-right: 6rpx;
					width: 30rpx;
					height: 35rpx;
					background: url(https://z3.ax1x.com/2021/10/21/5sz0fO.png) no-repeat;
					background-position: -55rpx -215rpx;
					background-size: 600rpx 300rpx;
				}
				text {
					overflow: hidden;
					width: 330rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
}

</style>
