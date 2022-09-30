<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-23 09:43:28
 * @LastEditTime: 2022-04-28 15:01:33
-->
<template>
  <view class="task_detail">
    <view class="task_detail_header">
      <view class="warning_content">
        <view class="warning_content_item">
          <view class="warning_content_left">
            <image
              v-if="dangerDetails.taskType === '应急任务'"
              :src="
                `${imgStaticUrl}/img/taskManagement/${dangerDetails.taskSubTypeCode}_${dangerDetails.taskSignLevelCode}.png`
              "
              mode=""
              class="img"
            >
            </image>
            <view v-else class="taskPlan">
              <view class="planMsg">{{
                dangerDetails.taskSubType ? dangerDetails.taskSubType : ""
              }}</view>
            </view>
          </view>
          <view class="warning_content_right">
            <view class="title">{{ dangerDetails.taskName }}</view>
            <view class="time">{{ dangerDetails.gmtCreate }}</view>
          </view>
        </view>
        <view class="warning_content_type">
          <image
            v-if="dangerDetails.status === 0"
            :src="imgStaticUrl + '/img/reportTask/proceed.png'"
            mode=""
            class="img"
          >
          </image>
          <image
            v-else
            :src="imgStaticUrl + '/img/reportTask/complete.png'"
            mode=""
            class="img"
          >
          </image>
          <view
            class="status"
            :style="
              dangerDetails.status === 0 ? 'color: #0091FF;' : 'color: #0BD295'
            "
            >{{ `${dangerDetails.status === 1 ? "已完成" : "进行中"}` }}
          </view>
        </view>
      </view>
      <!-- tabs -->
      <view class="task_tabs">
        <van-tabs  @change="handleTabChange">
          <van-tab title="风险隐患">
            <view class="danger">
              <view class="danger_header">
                <view class="danger_num">
                  <view
                    class="danger_num_item"
                    v-for="(item, index) in dangerList"
                    :key="index"
                  >
                    <view class="dangerList_item">
                      <text class="title">{{ item.title }}</text>
                      <text class="num">{{ item.num }}</text></view
                    >
                  </view>
                </view>
                <view class="describe">{{
                 dangerDescribe[0].remark ? dangerDescribe[0].remark : ""
                }}</view>
              </view>
              <view class="danger_content_wrap" v-if="dataList.length > 0">
                <view
                  class="danger_content"
                  @click="handleDetail(ele.id, ele.patrolPointId)"
                  v-for="ele in dataList"
                  :key="ele.id"
                >
                  <view class="danger_content_wrap_item">
                    <view class="danger_content_item">
                      <view class="danger_address">
                        <view class="typeName">
                          <text :class="ele.typeName?'type':'type1'" >{{ ele.typeName || '' }}</text>
                        </view>

                        <view class="patrolPointName "
                          ><view class="address">{{
                            ele.patrolPointName
                          }}</view></view
                        >
                      </view>
                    </view>
                  </view>

                  <view class="label-list">
                    <span
                      class="oneLabel"
                      :style="{ background: item.background }"
                      v-for="item in ele.labels"
                      :key="item.labelId"
                    >
                      <span class="label-item" :style="{ color: item.color }">
                        {{ item.labelName }}
                      </span>
                    </span>
                  </view>
                  <view class="location">
                    <van-icon class="little-icon" name="location-o" />
                    <text>{{ ele.address }}</text>
                  </view>
                  <view class="danger_status">
                    <image
                      v-if="ele.status == 0"
                      :src="imgStaticUrl + '/img/reportTask/patrol0.png'"
                      mode=""
                      class="img"
                    />
                    <image
                      v-else
                      :src="imgStaticUrl + '/img/reportTask/patrol1.png'"
                      mode=""
                      class="img"
                    />
                  </view>
                </view>
              </view>

              <view class="empty-box" v-else>
                <image
                  :src="imgStaticUrl + '/img/reportTask/empty.png'"
                  mode=""
                  style="width: 198rpx; height: 178rpx"
                >
                </image>
                <view class="empty"> 暂无数据 </view>
              </view>

              
            </view>
          </van-tab>

          <van-tab title="脆弱人群">
            <view class="care">
              <view class="care_header">
                <view class="danger_num">
                  <view
                    class="danger_num_item"
                    v-for="(item, index) in careList"
                    :key="index"
                  >
                    <view class="dangerList_item">
                      <text class="title">{{ item.title }}</text>
                      <text class="num">{{ item.num }}</text></view
                    >
                  </view>
                </view>
                <view class="describe">{{
                 careDescrib[0].remark ? careDescrib[0].remark : ""
                }}</view>
              </view>
              <view class="care_content" v-if="dataList.length > 0">
                <view
                  class="care_content_wrap"
                  @click="handleCareDetail(ele.id, ele.patrolPointId)"
                  v-for="ele in dataList"
                  :key="ele.id"
                >
                  <view class="care_content_item">
                    <view class="care_content_item_top">
                      <view class="header_photo">
                        <ImageView
                          v-if="ele.images"
                          :src="`${fileHost}${ele.images}`"
                          style="width:75rpx;height:75rpx;"
                        >
                        </ImageView>
                        <ImageView
                          v-else
                          :src="`${imgStaticUrl}/img/reportTask/volunteer.png`"
                          style="width:75rpx;height:75rpx;"
                        >
                        </ImageView>
                      </view>
                      <view class="personal_details">
                        <view class="personal_details_item">
                          <view class="patrolPointName">
                            <text class="name">{{ ele.patrolPointName }}</text>
                          </view>

                          <view class="personnelTypeList">
                            <text
                              class="identity"
                              v-for="item in ele.personnelTypeList"
                              :key="item.id"
                              >{{ item.name }}</text
                            >
                          </view>
                        </view>
                        <view class="care_object">
                          <view class="object">
                            <text>关爱对象：</text>
                          </view>
                          <view class="contacts">
                            <view
                              v-for="item in ele.contacts"
                              :key="item.id"
                              class="contacts_item"
                              >{{
                                `${item.contactName}(${item.contactPhone})`
                              }}</view
                            >
                          </view>
                        </view>
                      </view>
                    </view>
                    <view class="care_labels">
                      <span
                        class="oneLabel"
                        :style="{ background: item.background }"
                        v-for="item in ele.labels"
                        :key="item.labelId"
                      >
                        <span class="label-item" :style="{ color: item.color }">
                          {{ item.labelName }}
                        </span>
                      </span>
                    </view>
                    <view class="care_address">
                      <van-icon class="little-icon" name="location-o" />
                      <text>{{ ele.address }}</text>
                    </view>
                    <view class="care_status">
                      <image
                        v-if="ele.status == 0"
                        :src="imgStaticUrl + '/img/reportTask/care0.png'"
                        mode=""
                        class="img"
                      />
                      <image
                        v-else
                        :src="imgStaticUrl + '/img/reportTask/care1.png'"
                        mode=""
                        class="img"
                      />
                    </view>
                  </view>
                </view>
              </view>
              <view class="empty-box" v-else>
                <image
                  :src="imgStaticUrl + '/img/reportTask/empty.png'"
                  mode=""
                  style="width: 198rpx; height: 178rpx"
                >
                </image>
                <view class="empty"> 暂无数据 </view>
              </view>
            </view>
          </van-tab>
        </van-tabs>
      </view>
    </view>
  </view>
</template>

<script>
import { getLabel } from "../common/common.js";
import config from "@/static/config/index.js";
import { getDetailed, getListPage, getPatrolRecord } from "@/apis/index.js";
import ImageView from '@/pages/custom-components/ImageView/ImageView.vue';
import store from '@/store';
export default {
  components: {ImageView},
  props: {},
  data() {
    return {
      fileHost: config.fileHost,
      imgStaticUrl: this.$imgStaticUrl,
      status: 0, //状态
      active: 0,
      dangerList: [], //  风险隐患数据
      careList: [], //脆弱人群总数
      currentStatus: "", //当前传过来的是列表状态
      currentId: "",
      dangerDetails: {},
      dataList: [], //详情列表
      dangerDescribe:[],
      careDescrib:[],
    };
  },
  watch: {},
  computed: {},
  onLoad(options) {
    this.currentStatus = options.status;
    this.currentId = options.id;
  },
  onShow() {
    this.getDangerData();
    this.getDetailData();
  },
  methods: {
    /**
     * @description:获取任务详情数据
     */
    async getDetailData() {
      let user=store.state.perms?false:true;
      const res = await getDetailed(this.currentId,user);
      if (res.data.code === 0) {
        let result = res.data.data;
        // 风险隐患数据
        this.dangerList = [
          {
            title: "隐患总数：",
            num: result.hiddenPointsCount.total,
          },
          {
            title: "未巡查：",
            num: result.hiddenPointsCount.uninspected,
          },
          {
            title: "已巡查：",
            num: result.hiddenPointsCount.inspected,
          },
        ];
        this.careList = [
          {
            title: "脆弱人群数：",
            num: result.caringPersonsCount.total,
          },
          {
            title: "已关爱：",
            num: result.caringPersonsCount.inspected,
          },
          {
            title: "待关爱：",
            num: result.caringPersonsCount.uninspected,
          },
        ];
        // 
        this.dangerDescribe=result.objects.filter((v)=>{
          if(v.objectName==="风险隐患"){
            return v.remark
          }
        })
        this.careDescrib=result.objects.filter((v)=>{
          if(v.objectName==="脆弱人群"){
            return v.remark
          }
        })
        console.log(this.dangerDescribe,'this.dangerDescribe')
        this.dangerDetails = result;
      }
      console.log(res, "获取详情");
    },
    /**
     * @description：获取任务风险隐患/脆弱人群数据
     */

    async getDangerData() {
      let request = {
        page: "1",
        limit: "10000",
        taskInstanceId: Number(this.currentId),
        code: this.active == 0 ? "01" : "02",
        user:store.state.perms?false:true
      };
      const res = await getListPage(request);
      if (res.data.code === 0) {
        let result = res.data.page.list || [];
        result.forEach((v) => {
          v.labels = getLabel(v.labels);
        });
        console.log(result,'result')
        this.dataList = result;
        console.log(this.dataList, "898989889");
      }
    },
    // 当前tab改变时触发的回调函数
    handleTabChange(name, title) {
      console.log(name.detail.index, "name.detail.index");
      this.active = name.detail.index;
      this.getDangerData();
    },
    /**
     * @description：点击风险隐患详情数据
     */
    handleDetail(id, patrolPointId) {
      wx.navigateTo({
        url: `/pages/garbageClassification/taskManagement/components/dangerDetails?id=${id}&patrolPointId=${patrolPointId}`,
      });
    },
    /**
     * @description：点击脆弱人群详情数据
     */
    handleCareDetail(id, patrolPointId) {
      wx.navigateTo({
        url: `/pages/garbageClassification/taskManagement/components/careDetails?id=${id}&patrolPointId=${patrolPointId}`,
      });
    },
  },
  created() {},
  // mounted() {},
};
</script>
<style lang="less" scoped>
.task_detail {
  min-height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
  color: #474747;
  .task_detail_header {
    .warning_content {
      display: flex;
      margin: 20rpx auto;
      width: 96%;
      background-color: #fff;
      border-radius: 4px;
      justify-content: space-between;
      .warning_content_item {
        display: flex;
        .warning_content_left {
          .img {
            width: 100rpx;
            height: 85rpx;
            margin: 29rpx 24rpx 25rpx 25rpx;
          }
          .taskPlan {
            width: 120rpx;
            height: 100rpx;
            background: #0091ff;
            margin: 29rpx 24rpx 25rpx 25rpx;
            text-align: center;
            .planMsg {
              font-size: 32rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              line-height: 40rpx;
              width: 64rpx;
              padding: 7rpx 28rpx;
            }
          }
        }
        .warning_content_right {
          margin-top: 32rpx;
          .title {
            font-size: 32rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 45rpx;
            margin-bottom: 10rpx;
            max-width: 413rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .time {
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 26rpx;
          }
        }
      }
      .warning_content_type {
        display: flex;
        margin-right: 20rpx;
        .img {
          width: 30rpx;
          height: 30rpx;
          margin-top: 46rpx;
          margin-right: 10rpx;
        }
        .status {
          font-size: 24rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #0bd295;
          line-height: 122rpx;
        }
      }
    }
  }
  .task_tabs {
    .danger {
      .danger_header {
        background-color: #fff;
        .danger_num {
          display: flex;
          justify-content: space-around;
          padding-top: 10rpx;
          .danger_num_item {
            .title {
              font-size: 28rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #666666;
              line-height: 40rpx;
            }
            .num {
              font-size: 28rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 40rpx;
            }
          }
          .danger_num_item:nth-child(2) {
            display: flex;
          }
          .danger_num_item:nth-child(2):before {
            display: block;
            content: "";
            width: 1rpx;
            height: 20rpx;
            background: #999999;
            border-radius: 2rpx;
            opacity: 0.39;
            margin-top: 15rpx;
            margin-right: 32rpx;
          }
          .danger_num_item:last-child {
            display: flex;
          }
          .danger_num_item:last-child:before {
            display: block;
            content: "";
            width: 1rpx;
            height: 20rpx;
            background: #999999;
            border-radius: 2rpx;
            opacity: 0.39;
            margin-top: 15rpx;
            margin-right: 32rpx;
          }
        }
        .describe {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 40rpx;
          margin: 29rpx 39rpx 0 39rpx;
          padding-bottom: 29rpx;
        }
      }
      .danger_content_wrap {
        overflow-y: scroll;
        max-height: 68vh;
        .danger_content {
          margin: 20rpx auto;
          width: 96%;
          background-color: #fff;
          position: relative;
          .danger_content_wrap_item {
            .danger_content_item {
              .danger_address {
                padding: 39rpx 38rpx 0 38rpx;
                display: flex;
                .typeName {
                    max-width: 185rpx;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  .type {
                    background: #e6efff;
                    border-radius: 6rpx;
                    padding: 2rpx 12rpx;
                    font-size: 24rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #0091ff;
                    line-height: 33rpx;
                    // display: inline-block;
                  }
                   .type1 {
                    background: #ffff;
                    border-radius: 6rpx;
                    padding: 2rpx 12rpx;
                    font-size: 24rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #ffff;
                    line-height: 33rpx;
                    // display: inline-block;
                  }
                }
                .patrolPointName {
                  .address {
                    font-size: 28rpx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #333333;
                    //   line-height: 112rpx;
                    margin-left: 15rpx;
                    max-width: 500rpx;
                    // overflow: hidden;
                    // white-space: nowrap;
                    // text-overflow: ellipsis;
                  }
                }
              }
            }
          }
          .danger_content_item:after {
            display: block;
            content: "";
            height: 1rpx;
            width: 90%;
            background: #dddddd;
            margin: 22rpx 0;
            margin-left: 20px;
          }

          .label-list {
            margin: 8rpx 0rpx 8rpx 39rpx;
            word-wrap: break-word;
            // max-width: 353rpx;
            .oneLabel {
              font-size: 24rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              background: #f2f3f5;
              border-radius: 12rpx;
              border: 1rpx solid #dcdee0;
              // line-height: 20rpx;
              padding: 2rpx 16rpx;
              margin-right: 20rpx;
              margin-bottom: 16rpx;
              display: inline-block;
              .label-item {
                z-index: 0;
              }
            }
          }
          .location {
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 33rpx;
            padding-bottom: 17rpx;
            padding-left: 38rpx;
          }
          .danger_status {
            position: absolute;
            right: 0;
            top: 0;
            .img {
              width: 80rpx;
              height: 80rpx;
            }
          }
        }
      }
      .empty-box {
        position: fixed;
        left: 50%;
        top: 65%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .empty {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 28rpx;
        }
      }
    }
    .care {
      .care_header {
        margin: 10rpx 0;
        background-color: #fff;
        .danger_num {
          display: flex;
          justify-content: space-around;
          padding-top: 10rpx;
          .danger_num_item {
            .title {
              font-size: 28rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #666666;
              line-height: 40rpx;
            }
            .num {
              font-size: 28rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 40rpx;
            }
          }
          .danger_num_item:nth-child(2) {
            display: flex;
          }
          .danger_num_item:nth-child(2):before {
            display: block;
            content: "";
            width: 1rpx;
            height: 20rpx;
            background: #999999;
            border-radius: 2rpx;
            opacity: 0.39;
            margin-top: 15rpx;
            margin-right: 32rpx;
          }
          .danger_num_item:last-child {
            display: flex;
          }
          .danger_num_item:last-child:before {
            display: block;
            content: "";
            width: 1rpx;
            height: 20rpx;
            background: #999999;
            border-radius: 2rpx;
            opacity: 0.39;
            margin-top: 15rpx;
            margin-right: 32rpx;
          }
        }
        .describe {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 40rpx;
          margin: 29rpx 39rpx 0 39rpx;
          padding-bottom: 29rpx;
        }
      }
      .care_content {
        overflow-y: scroll;
        max-height: 75vh;
        .care_content_wrap {
          .care_content_item {
            margin: 20rpx auto;
            width: 90%;
            background-color: #fff;
            padding: 20rpx 0rpx 26rpx 20rpx;
            position: relative;
            .care_content_item_top {
              display: flex;
              .header_photo {
                margin-right: 15rpx;
                .img{
                  width:75rpx;
                  height:75rpx;
                }
              }
              .personal_details {
                .personal_details_item {
                  margin-bottom: 12rpx;
                  display: flex;
                  .patrolPointName {
                    .name {
                      font-size: 32rpx;
                      font-family: PingFangSC-Medium, PingFang SC;
                      font-weight: 500;
                      color: #333333;
                      line-height: 45rpx;
                      margin-right: 10rpx;
                    }
                  }
                  .personnelTypeList {
                    font-size: 24rpx;
                    padding-top: 9rpx;
                    .identity {
                      border-radius: 30rpx;
                      border: 2rpx solid #cdd6e1;
                      padding: 0 16rpx;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: #86a0ba;
                      line-height: 28rpx;
                      margin-right: 6rpx;
                    }
                  }
                }
                .care_object {
                  display: flex;
                  font-size: 26rpx;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #999999;
                  line-height: 33rpx;
                  margin: 20rpx 0;
                  .object {
                  }
                  .contacts {
                    .contacts_item {
                      margin-bottom: 10rpx;
                    }
                  }
                }
              }
            }
            .care_labels {
              margin: 8rpx 0rpx 8rpx 8rpx;
              word-wrap: break-word;
              max-width: 645rpx;
              .oneLabel {
                font-size: 24rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                background: #f2f3f5;
                border-radius: 12rpx;
                border: 1rpx solid #dcdee0;
                padding: 2rpx 16rpx;
                margin-right: 20rpx;
                margin-bottom: 16rpx;
                display: inline-block;
                .label-item {
                  z-index: 0;
                }
              }
            }
            .care_address {
              font-size: 25rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
              line-height: 33rpx;
              max-width: 650rpx;
              // overflow: hidden;
              // white-space: nowrap;
              // text-overflow: ellipsis;
            }
            .care_status {
              position: absolute;
              right: 0;
              top: 0;
              .img {
                width: 80rpx;
                height: 80rpx;
              }
            }
          }
        }
      }
      .empty-box {
        position: fixed;
        left: 50%;
        top: 65%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .empty {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 28rpx;
        }
      }
    }
  }
}
</style>
