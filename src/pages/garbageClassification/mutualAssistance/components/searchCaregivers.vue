<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-29 10:43:35
 * @LastEditTime: 2022-04-18 14:50:02
-->
<template>
  <view class="search">
    <header>
      <view class="search_header">
        <van-search
          :value="keyword"
          shape="round"
          style="width: 100%"
          placeholder="请输入脆弱人群姓名或手机号查询"
          @search="onSearch"
          @clear="onCancel"
          @blur="onBlur"
        />
      </view>
    </header>
    <section>
      <view class="peopleList">
        <view class="peopleList_wrap" v-for="item in careList" :key="item.id">
          <view class="peopleList_item">
            <view class="item_left">
              <view class="img_item">
                <van-image
                  round
                  width="99rpx"
                  height="99rpx"
                  :src="fileHost + item.images"
                />
              </view>
              <view class="name">
                <view class="name_item">{{ item.name }}</view>
                <view class="type">
                  <span
                    class="oneLabel"
                    v-for="ele in item.personnelTypeList"
                    :key="ele.id"
                  >
                    <span class="label-item">
                      {{ ele.name }}
                    </span>
                  </span>
                </view>
              </view>
            </view>
            <view class="item_right" @click="handleAdd(item)">
              <image
                :src="imgStaticUrl + '/img/assistance/add.png'"
                mode=""
                class="img"
              />
            </view>
          </view>
        </view>
      </view>
      <view class="empty-box" v-if="isShow && keyword">
        <image :src="imgStaticUrl + '/img/assistance/care.png'" mode="" class="img">
        </image>
        <view class="empty"> 未找到脆弱人群 </view>
      </view>
    </section>
  </view>
</template>

<script>
import { getPeopleList } from "@/apis/index.js";
import config from "@/static/config/index.js";
import store from "@/store";
import useMiddleWare from "@/utils/hooks/useMiddleWare";
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  props: {},
  data() {
    return {
      fileHost: config.fileHost,
      keyword: "", //关键字
      careList: [], //脆弱人群数据
      isShow: false,
      imgStaticUrl: this.$imgStaticUrl,
    };
  },
  watch: {},
  computed: {},
  onShow() {},
  setup(props) {
    const { $emit_phy } = useMiddleWare();
    /**
     * @description:添加
     */
    function handleAdd(item) {
      wx.navigateBack({
        delta: 1,
        success: (res) => {
          $emit_phy("SEARCH_CARE_PEOPLE", item);
        },
      });
    }

    return {
      handleAdd,
    };
  },
  methods: {
    /**
     * @description:获取脆弱人群数据
     */
    getcarePeople() {
      let request = {
        search: this.keyword,
      };
      getPeopleList(request).then((res) => {
        if (res.data.code === 0) {
          this.careList = res.data.data;
          console.log(this.keyword,'keyword')
          this.careList.length === 0 ? (this.isShow = true) : (this.isShow = false);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
        console.log(res, "res");
      });
    },
    /**
     * @description:输入框失去焦点
     */
    onBlur(e){
      this.keyword=e.detail.value;
      console.log(e,'失去焦点')
    },
    /**
     * @description：搜索脆弱人群
     * @param {string} ：搜索关键字
     */
    onSearch(value) {
      this.keyword = value.detail;
      this.getcarePeople();
      console.log(value, "搜索出来的结果");
    },
    /**
     * @description：取消搜索
     *
     */
    onCancel() {
      this.keyword = "";
      this.getcarePeople();
    },
  },
});
</script>
<style lang="less" scoped>
.search {
  .search_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search_keyWord {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0091ff;
      line-height: 40prx;
      margin-right: 18rpx;
    }
  }
  .peopleList {
    max-height: 88vh;
    overflow-y: scroll;
    .peopleList_wrap {
      .peopleList_item {
        height: 158rpx;
        display: flex;
        justify-content: space-between;
        .item_left {
          display: flex;
          .img_item {
            padding-top: 18rpx;
            padding-left: 25rpx;
            height: 99rpx;
            .img {
            }
          }
          .name {
            padding-top: 12rpx;
            .name_item {
              font-size: 32rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 45rpx;
              margin-left: 25rpx;
            }
            .type {
              margin: 10rpx 0px 8rpx 23rpx;
              word-wrap: break-word;
              max-width: 353px;
              .oneLabel {
                font-size: 24rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                background: #f2f2f2;
                border-radius: 27rpx;
                padding: 2rpx 17rpx;
                margin-right: 15rpx;
                color: #86a0ba;
                margin-bottom: 16rpx;
                display: inline-block;
                border: 2rpx solid #cdd6e1;
                .label-item {
                  z-index: 0;
                }
              }
            }
          }
        }
        .item_right {
          height: 60rpx;
          padding-top: 30rpx;
          padding-right: 32rpx;
          .img {
            width: 60rpx;
            height: 60rpx;
          }
        }
      }
    }

    .peopleList_wrap:after {
      display: block;
      content: "";
      width: 720rpx;
      height: 1rpx;
      background: #dddddd;
    }
  }
  .empty-box {
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img {
      width: 100rpx;
      height: 111rpx;
    }
    .empty {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 28rpx;
      margin-top: 10rpx;
    }
  }
}
</style>
