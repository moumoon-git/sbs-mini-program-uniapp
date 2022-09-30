<template>
  <view class="container">
    <header>
      <van-search
        v-model="searchKey"
        shape="round"
        placeholder="请输入搜索关键词"
        @search="handleSearch"
        @clear="handleClearSearch"
      />
    </header>
    <section class="content">
      <block v-if="!searchKey">
        <van-cell :title="unitName" />
        <van-checkbox-group
          :value="allCheckedList"
          @change="handleCheckboxGroupChange"
        >
          <van-cell-group>
            <van-cell
              v-for="(cellItem, cellIndex) in ordinaryCellList"
              :key="cellIndex"
              :title="cellItem.name"
              value-class="value-class"
            >
              <van-checkbox :name="`${cellItem.id}+${cellItem.name}`" />
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </block>
      <block v-else>
        <van-tabs v-model:active="active" animated @change="handleTabChange">
          <van-tab title="内部通讯录">
            <block v-if="internalCellList.length != 0">
              <van-checkbox-group
                :value="allCheckedList"
                @change="handleCheckboxGroupChange"
              >
                <van-cell-group>
                  <van-cell
                    v-for="(cellItem, cellIndex) in internalCellList"
                    :key="cellIndex"
                    :title="cellItem.name"
                    value-class="value-class"
                  >
                    <van-checkbox :name="`${cellItem.id}+${cellItem.name}`" />
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
            </block>
            <block v-else>
              <van-empty description="暂无数据" />
            </block>
          </van-tab>
          <van-tab title="外联通讯录">
            <block v-if="outreachCellList.length != 0">
              <van-checkbox-group
                :value="allCheckedList"
                @change="handleCheckboxGroupChange"
              >
                <van-cell-group>
                  <van-cell
                    v-for="(cellItem, cellIndex) in outreachCellList"
                    :key="cellIndex"
                    :title="cellItem.name"
                    value-class="value-class"
                  >
                    <van-checkbox :name="`${cellItem.id}+${cellItem.name}`" />
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
            </block>
            <block v-else>
              <van-empty description="暂无数据" />
            </block>
          </van-tab>
        </van-tabs>
      </block>
    </section>
    <footer>
      <view class="footer-panel">
        <view class="selected-total" @click="handleViewActionSheet">
          <text>{{ `已选 ${allCheckedList.length}` }}</text>
          <van-icon
            name="arrow-down"
            :class="[{ 'toggle-icon-active': actionSheetShow }, 'toggle-icon']"
          />
        </view>
        <view class="submit-btn" @click="handleSubmit">确定</view>
      </view>
    </footer>

    <van-action-sheet
      :show="actionSheetShow"
      round
      @close="handleActionSheetClose"
    >
      <view class="footer-panel">
        <view class="selected-total" @click="handleActionSheetClose">
          <text>{{ `已选 ${allCheckedList.length}` }}</text>
          <van-icon
            name="arrow-down"
            :class="[{ 'toggle-icon-active': actionSheetShow }, 'toggle-icon']"
          />
        </view>
        <view class="submit-btn" @click="handleSubmit">确定</view>
      </view>
      <van-cell-group>
        <van-cell
          v-for="(cellItem, cellIndex) in getAllCheckedList"
          :key="cellIndex"
          :title="cellItem.name"
        >
          <van-icon
            name="clear"
            size="35rpx"
            @click="handleClearCell(cellIndex)"
          />
        </van-cell>
      </van-cell-group>
    </van-action-sheet>
  </view>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'forwardWorkOrderManagement',
  data() {
    return {
      searchKey: '', //搜索关键词
      ordinaryCellList: [], //分组人员列表
      internalCellList: [],
      outreachCellList: [],
      allCheckedList: [], // 责任人所在分组的选中分组人员列表
      actionSheetShow: false,
      active: 0, //当前选中tab的标识符
      contactorId: '', //负责人id
      orderId: [], //工单id
      unitName: '',
    };
  },
  components: {},
  computed: {
    getAllCheckedList() {
      return this.allCheckedList.map((item) => {
        return { name: item.split('+')[1], id: item.split('+')[0] };
      });
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options', options);
    this.contactorId = options.contactorId;
    this.orderId = JSON.parse(options.orderId);
    console.log(
      '%c [ xxx ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      this.orderId
    );
    this.getContactorList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  methods: {
    handleCheckboxGroupChange(event) {
      console.log('handleCheckboxGroupChange event', event);
      this.allCheckedList = event.detail;
    },
    handleViewActionSheet() {
      this.actionSheetShow = true;
    },
    handleActionSheetClose(value) {
      this.actionSheetShow = false;
    },
    // 当前tab改变时触发的回调函数
    handleTabChange(name, title) {
      console.log('handleTabChange name, title', name, title);
      this.active = name.detail.index;
    },
    // 确定搜索时触发
    handleSearch(event) {
      console.log('handleSearch', event.detail);
      this.searchKey = event.detail;
      this.$http
        .post({
          url: `/mail/mailcontactor/getContactorListByKey`,
          data: {
            search: this.searchKey,
          },
        })
        .then(({ data }) => {
          console.log(`/mail/mailcontactor/getContactorListByKey data`, data);
          if (data.code === 0) {
            this.outreachCellList = [];
            this.internalCellList = [];
            data.list.forEach((element) => {
              if (element.isOutreach == 1) {
                this.outreachCellList.push(element);
              } else {
                this.internalCellList.push(element);
              }
            });
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    handleClearSearch() {
      console.log('this.searchKey', this.searchKey);
      this.searchKey = '';
      this.getContactorList();
    },
    handleClearCell(index) {
      this.allCheckedList.splice(index, 1);
    },
    getContactorList() {
      const unitMap = ['group', 'workUnit'];
      this.$http
        .get({
          url: `/mail/mailcontactor/contactorListById?id=${this.contactorId}`,
        })
        .then(({ data }) => {
          console.log(
            `/mail/mailcontactor/contactorListById?id=${this.contactorId} data`,
            data
          );
          if (data.code === 0) {
            this.ordinaryCellList = data.list;
            this.unitName =
              data.mailContactorEntity[
                unitMap[data.mailContactorEntity.isOutreach]
              ];
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    handleSubmit() {
      if (this.allCheckedList.length == 0) {
        wx.showToast({
          title: '请选择人员',
          icon: 'error',
        });
        return;
      }
      this.$http
        .post({
          url: `/work/workSheet/forwardWorkOrder`,
          data: {
            ids: this.orderId,
            participantsManList: this.getAllCheckedList.map((item) => {
              return item.id;
            }),
          },
        })
        .then(({ data }) => {
          console.log(`/work/workSheet/transmit data`, data);
          if (data.code === 0) {
            wx.showToast({
              title: '转发成功',
              icon: 'success',
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 1,
              });
            }, 1000);
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
  },
});
</script>

<style lang="less">
page {
	height: 100vh;
}
.container {
	display: block;
	box-sizing: border-box;
	padding: 0rpx;
	height: 100%;
	background: rgba(245, 245, 245, .8);
	header {
		background: #fff;
	}
	.content {
		margin-bottom: 130rpx;
		.value-class {
			flex: none !important;
		}
	}
	footer {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
	}
	.footer-panel {
		display: flex;
		align-items: center;
		width: 100%;
		background: #fff;
		.selected-total {
			margin-left: 5%;
			text {
				color: #0091ff;
			}

			.toggle-icon {
				margin-left: 10rpx;
				transform: rotate(0deg);
				transition: .4s all;
			}
			.toggle-icon-active {
				transform: rotate(180deg);
			}
		}
		.submit-btn {
			display: inline-block;
			margin: 30rpx;
			margin-left: auto;
			margin-right: 5%;
			padding: 15rpx 45rpx;
			border-radius: 10rpx;
			background: #0091ff;
			color: #fff;
		}
	}
}

</style>
