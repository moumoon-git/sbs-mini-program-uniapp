<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-23 09:43:28
 * @LastEditTime: 2022-04-16 16:50:17
-->
<template>
  <view class="task">
    <view class="task_header">
      <veiw v-for="(item, index) in headerList" :key="index" class="task_header_item">
        <text class="title">{{ item.title }}</text>
        <text class="num">{{ item.num }}</text>
      </veiw>
    </view>
    <view class="tabs">
      <van-tabs  ref="vanTabs" @change="handleTabs" :active="tabActive">
        <van-tab v-for="v in tabsList" :key="v.value" :title="v.name" :name="v.value">
          <view class="content" v-if="tabActive === 0">
            <scroll-view scroll-y="true" style="height: 100vh" @scrolltolower="lower">
              <!-- 预警响应任务 -->
              <view class="content_item">
                <view v-if="taskData.length > 0">
                  <view
                    class="warning_content"
                    @click="handleWarningDetail(item.id)"
                    v-for="item in taskData"
                    :key="item.id"
                  >
                    <view class="warning_content_left">
                      <image
                        v-if="item.taskType == '应急任务'"
                        :src="`${imgStaticUrl}/img/taskManagement/${item.taskSubTypeCode}_${item.taskSignLevelCode}.png`"
                        mode=""
                        class="img"
                      >
                      </image>
                      <view v-else class="taskPlan">
                        <view class="planMsg">{{
                          item.taskSubType ? item.taskSubType : ""
                        }}</view>
                      </view>
                    </view>

                    <view class="warning_content_right">
                      <view class="title">{{ item.taskName }}</view>
                      <view class="time">{{ item.gmtCreate }}</view>
                    </view>
                  </view>
                </view>
                <view class="empty-box" v-else>
                  <image
                    :src="imgStaticUrl + '/img/inspection/empty.png'"
                    mode=""
                    style="width: 150rpx; height: 150rpx"
                  >
                  </image>
                  <view class=""> 暂无数据 </view>
                </view>
              </view>
            </scroll-view>
          </view>
          <view class="taskType" v-else-if="tabActive === 1">
            <scroll-view scroll-y="true" style="height: 100vh" @scrolltolower="lower">
              <!-- 预警响应任务 -->
              <view class="content_item">
                <view v-if="taskData.length > 0">
                  <view
                    class="warning_content"
                    @click="handleWarningDetail(item.id)"
                    v-for="item in taskData"
                    :key="item.id"
                  >
                    <view class="warning_content_left">
                      <image
                        v-if="item.taskType == '应急任务'"
                        :src="`${imgStaticUrl}/img/taskManagement/${item.taskSubTypeCode}_${item.taskSignLevelCode}.png`"
                        mode=""
                        class="img"
                      >
                      </image>
                      <view v-else class="taskPlan">
                        <view class="planMsg">{{
                          item.taskSubType ? item.taskSubType : ""
                        }}</view>
                      </view>
                    </view>
                    <view class="warning_content_right">
                      <view class="title">{{ item.taskName }}</view>
                      <view class="time">{{ item.gmtCreate }}</view>
                    </view>
                  </view>
                </view>
                <view class="empty-box" v-else>
                  <image
                    :src="imgStaticUrl + '/img/inspection/empty.png'"
                    mode=""
                    style="width: 150rpx; height: 150rpx"
                  >
                  </image>
                  <view class=""> 暂无数据 </view>
                </view>
              </view>
            </scroll-view>
          </view>

          <!-- 任务清单 -->
          <view class="taskList" v-else-if="tabActive === 2">
            <scroll-view scroll-y="true" style="height: 100vh" @scrolltolower="lower">
              <!-- 预警响应任务 -->
              <view class="content_item">
                <view class="warning_content" v-for="item in taskList" :key="item.id">
                  <view class="warning_content_header">
                    <view class="warning_content_item">
                      <view class="warning_content_left">
                        <image
                          v-if="item.type === 1"
                          :src="`${imgStaticUrl}/img/taskManagement/${item.subTypeCode}_${item.signLevelCode}.png`"
                          mode=""
                          class="img"
                        >
                        </image>
                        <view v-else class="taskPlan">
                          <view class="planMsg">{{ item.subTypeName }}</view>
                        </view>
                      </view>
                      <view class="warning_content_right">
                        <view class="title">{{ item.name }}</view>
                        <view class="time">{{ item.gmtCreate }}</view>
                      </view>
                    </view>
                    <view class="warning_content_operation" v-if="currentPerms">
                      <view class="operation" @click.stop="handleOperation(item)">
                        <image
                          v-if="item.isStart == 0"
                          :src="imgStaticUrl + '/img/reportTask/start.png'"
                          mode=""
                          class="img"
                        >
                        </image>
                        <image
                          v-else
                          :src="imgStaticUrl + '/img/reportTask/pause.png'"
                          mode=""
                          class="img"
                        >
                        </image>
                      </view>
                      <view class="msg">
                        <text>{{ item.isStart == 0 ? "启动" : "暂停" }}</text>
                      </view>
                    </view>
                  </view>
                  <view class="pushMsg" v-if="item.alarmInfor && item.isStart == 1">
                    <text>{{ item.alarmInfor }}</text>
                  </view>
                  <!-- 标签 -->
                  <view class="label-list">
                    <span
                      class="oneLabel"
                      :style="{ background: ele.background }"
                      v-for="ele in item.taskLabels"
                      :key="ele.id"
                    >
                      <span class="label-item" :style="{ color: ele.color }">
                        {{ ele.name }}
                      </span>
                    </span>
                  </view>
                  <view class="taskTabs">
                    <van-tabs>
                      <van-tab title="风险隐患">
                        <view class="taskDangerMsg">
                          <text v-for="ele in item.potentialRisks" :key="ele.id">{{
                            ele.remark
                          }}</text>
                        </view>
                        <view class="empty-box" v-if="uninspect.length === 0">
                          <image
                            :src="imgStaticUrl + '/img/inspection/empty.png'"
                            mode=""
                            style="width: 75rpx; height: 75rpx"
                          >
                          </image>
                          <view class=""> 暂无数据 </view>
                        </view>
                      </van-tab>
                      <van-tab title="脆弱人群">
                        <view class="taskCareMsg">
                          <text v-for="ele in item.carePeople" :key="ele.id">
                            {{ ele.remark }}
                          </text>
                        </view>
                        <view class="empty-box" v-if="inspected.length === 0">
                          <image
                            :src="imgStaticUrl + '/img/inspection/empty.png'"
                            mode=""
                            style="width: 75rpx; height: 75rpx"
                          >
                          </image>
                          <view class=""> 暂无数据 </view>
                        </view>
                      </van-tab>
                    </van-tabs>
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>

          <van-dialog
            class="dialog"
            :show="showDialog"
            title="提示"
            show-cancel-button
            @cancel="handleCancel"
            @confirm="handleConfirm"
            :message="isStart === 1 ? stopMsg : startMsg"
          >
          </van-dialog>
        </van-tab>
      </van-tabs>
    </view>
  </view>
</template>

<script>
import { getCount, getListAll, getDetailedAccount, handleSwitch } from "@/apis/index.js";
import {
  getMenuByCode,
} from '@/apis/index.js';
import { debounce } from "@/utils/utils.js";
import { getLabel } from "./common/common.js";
import ImageView from '@/pages/custom-components/ImageView/ImageView.vue';
import store from '@/store';
export default {
  components: {ImageView},
  props: {},
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      headerList: [], //任务管理总数据
      tabsList: [
        {
          name: "进行中",
          value: 0,
        },
        {
          name: "已完成",
          value: 1,
        },
        {
          name: "任务清单",
          value: 2,
        },
      ],
      tabActive: 0,
      showDialog: false,
      stopMsg: "是否暂停当前任务？",
      startMsg: "是否开启当前任务？",
      taskType: "应急任务",
      taskList: [], //任务清单
      taskData: [], //任务完成/进行中数据
      curentPage: 1, //当前页
      totalPage: 1, //总页数
      totalCount: 0,
      taskCurentPage: 1, //当前页
      taskTotalPage: 1, //总页数
      taskTotalCount: 0,
      isStartId: "", //
      isStart: "", //是否是启动状态/暂停
      currentPerms:'',//是否显示启动/停止按钮权限
    };
  },
  watch: {},
  computed: {},
  async onLoad() {
    this.curentPage = 1;
    this.taskCurentPage = 1;
    this.taskData = [];
    this.taskList = [];
    await this.getCode();
    await this.getTaskCount();
    if (this.tabActive !== 2) {
      await this.getTaskAll();
    }
  },
  methods: {
   async getCode(){
      let code ="TASK_MANAGEMENT";
      // 权限按钮请求操作
     await getMenuByCode(code).then((res) => {
        console.log(
          "数据",
          res
        );
        if(res.data.code===0){
          let data=res.data.data || [];
          data.forEach((v)=>{
            store.commit('SET_PERMS',v.perms)
            this.currentPerms=store.state.perms;
          })
          
        }
      });
    },

    /**
     * @description:获取任务管理总数
     */
    getTaskCount() {
      let request = {
        user: this.currentPerms?false:true
      };
      getCount(request).then((res) => {
        if (res.data.code === 0) {
          let data = res.data.data;
          this.headerList = [
            {
              title: "总数：",
              num: data.total,
            },
            {
              title: "进行中：",
              num: data.uncompleted,
            },
            {
              title: "已完成：",
              num: data.completed,
            },
          ];
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
      });
    },
    /**
     * @description:获取任务进行中，完成的列表数据；0：进行中，1：已完成
     */
    async getTaskAll() {
      let request = {
        status: this.tabActive,
        page: this.taskCurentPage,
        limit: "20",
        user: this.currentPerms?false:true
      };
      const res = await getListAll(request);
      if (res.data.code === 0) {
        console.log(res.data.page.list, "res.data.page.list");
        this.taskData.push(...res.data.page.list);
        this.taskCurentPage = res.data.page.currPage;
        this.taskTotalPage = res.data.page.totalPage;
        this.taskTotalCount = res.data.page.totalCount;
        wx.hideLoading();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "error",
        });
      }
    },
    /**
     * @description：获取任务清单数据
     */
    async getTaskList() {
      let request = {
        page: this.curentPage,
        limit: "20",
      };
      const res = await getDetailedAccount(request);
      if (res.data.code === 0) {
        let result = res.data.page.list || [];
        result.forEach((element) => {
          if (element.taskLabels.length > 0) {
            element.potentialRisks = element.taskObjects.filter((v) => {
              if (v.name == "风险隐患") {
                return v;
              }
            });
            element.carePeople = element.taskObjects.filter((v) => {
              if (v.name == "脆弱人群") {
                return v;
              }
            });
            element.taskLabels = getLabel(element.taskLabels);
          }
        });
        this.curentPage = res.data.page.currPage;
        this.totalPage = res.data.page.totalPage;
        this.totalCount = res.data.page.totalCount;
        this.taskList.push(...res.data.page.list);
        wx.hideLoading();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "error",
        });
      }
    },
    /**
     * @description:切换任务管理tabs
     */
    async handleTabs(name, title) {
      this.taskCurentPage=1;
      this.curentPage=1;
      this.tabActive = name.detail.index;
      console.log(this.tabActive, "name, title");
      if (this.tabActive !== 2) {
        this.taskData = [];
        await this.getTaskAll();
      } else {
        this.taskList = [];
        await this.getTaskList();
      }
    },
    /**
     * @description:滑动加载页数
     */
    lower(e) {
      const debounceFn = debounce(() => {
        if (this.tabActive == 2) {
          this.curentPage++;
          if (this.curentPage >= this.totalPage) {
            uni.showToast({
              title: "已加载完全部数据",
              icon: "none",
              duration: 1500,
            });
            return;
          }
          uni.showLoading({
            title: "加载数据中...",
          });
          this.getTaskList();
        } else {
          this.taskCurentPage++;
          if (this.taskCurentPage >= this.taskTotalPage) {
            uni.showToast({
              title: "已加载完全部数据",
              icon: "none",
              duration: 1500,
            });
            return;
          }
          uni.showLoading({
            title: "加载数据中...",
          });
          this.getTaskAll();
        }
      }, 500);
      debounceFn();
    },

    /**
     * @description:台风预警详情
     */
    handleWarningDetail(id) {
      wx.navigateTo({
        url: `/pages/garbageClassification/taskManagement/components/taskWarningDetail?id=${id}&status=${this.tabActive}`,
      });
    },
    /**
     * @description:修改任务清单状态
     */
    handleOperation(item) {
      console.log(item, "操作");
      this.isStartId = item.id;
      this.isStart = item.isStart;
      this.showDialog = true;
      console.log("点击启动");
    },
    handleCancel() {
      this.showDialog = false;
      console.log("取消");
    },
    /**
     * @description:任务状态的更改
     */
    async handleConfirm(e) {
      //	任务状态，停止传0，启动传1

      console.log("提交");
      console.log(this.isStart, "8777");
      let request = {
        id: this.isStartId,
        start: this.isStart === 0 ? 1 : 0,
      };
      const res = await handleSwitch(request);
      if (res.data.code === 0) {
        this.taskList.forEach((v) => {
          if (v.id == this.isStartId) {
            v.isStart = this.isStart === 0 ? 1 : 0;
          }
        });
        wx.showToast({
          title: `${this.isStart == 0 ? "任务启动成功" : "任务暂停成功"}`,
          icon: "success",
        });
        this.showDialog = false;
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "error",
        });
        this.showDialog = false;
      }
    },
  },
  created() {},
  // mounted() {},
};
</script>
<style lang="less" scoped>
.task {
  min-height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
  color: #474747;
  .task_header {
    height: 100rpx;
    background: #ffffff;
    display: flex;
    justify-content: space-around;
    border-bottom: 1rpx solid rgba(116, 116, 116, 0.1);
    .task_header_item:first-child {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #330000;
      line-height: 100rpx;
    }
    .task_header_item:nth-child(2) {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0091ff;
      line-height: 100rpx;
    }
    .task_header_item:last-child {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0bd295;
      line-height: 100rpx;
    }
  }
  // tbs
  .tabs {
    .content {
      max-height: 86vh;
      overflow-y: scroll;
      .content_item {
        margin: 20rpx auto;
        width: 96%;
        border-radius: 4px;
        .warning_content {
          background-color: #fff;
          display: flex;
          margin: 20rpx auto;
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
              max-width: 560rpx;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-bottom: 10rpx;
            }
            .time {
              font-size: 24rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
              line-height: 33rpx;
            }
          }
        }
        .empty-box {
          position: absolute;
          left: 50%;
          top: 30%;
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
    .taskType {
      max-height: 86vh;
      overflow-y: scroll;
      .content_item {
        margin: 20rpx auto;
        width: 96%;
        border-radius: 4px;
        .warning_content {
          display: flex;
          background-color: #fff;
          margin: 20rpx auto;
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
              max-width: 560rpx;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-bottom: 10rpx;
            }
            .time {
              font-size: 24rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
              line-height: 33rpx;
            }
          }
        }
        .empty-box {
          position: absolute;
          left: 50%;
          top: 30%;
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
    .taskList {
      max-height: 85vh;
      overflow-y: scroll;
      .content_item {
        margin: 20rpx auto;
        width: 96%;
        border-radius: 4px;
        .warning_content {
          margin: 20rpx 0;
          background-color: #fff;
          .warning_content_header {
            display: flex;
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
                  max-width: 460rpx;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  margin-bottom: 10rpx;
                }
                .time {
                  font-size: 24rpx;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #999999;
                  line-height: 33rpx;
                }
              }
            }
            .warning_content_operation {
              margin-top: 25rpx;
              margin-right: 20rpx;
              .operation {
                .img {
                  width: 50rpx;
                  height: 50rpx;
                }
              }
              .msg {
                font-size: 26rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #666666;
                line-height: 37rpx;
              }
            }
          }
          .pushMsg {
            padding: 10rpx 25rpx 22rpx 21rpx;
            text {
              font-size: 28rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #7d7d7d;
              line-height: 40rpx;
            }
          }
          .label-list {
            margin: 8rpx 0px 8rpx 40rpx;
            word-wrap: break-word;
            max-width: 353px;
            .oneLabel {
              font-size: 24rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              background: #f2f3f5;
              border-radius: 12px;
              border: 1px solid #dcdee0;
              // line-height: 20rpx;
              padding: 2rpx 16rpx;
              margin-right: 8rpx;
              margin-bottom: 16rpx;
              display: inline-block;
              .label-item {
                z-index: 0;
              }
            }
          }
          .label-list:after {
            display: block;
            content: "";
            width: 665rpx;
            height: 1rpx;
            background: #dddddd;
            margin-top: 20rpx;
            margin-left: 15rpx;
          }
          .taskTabs {
            .taskDangerMsg {
              padding: 16rpx 25rpx 22rpx 21rpx;
              text {
                font-size: 28rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #666666;
                line-height: 40rpx;
              }
            }
            .taskCareMsg {
              padding: 16rpx 25rpx 22rpx 21rpx;
              text {
                font-size: 28rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #666666;
                line-height: 40rpx;
              }
            }
          }
        }
      }
    }
    .dialog {
      /deep/ .van-dialog__message {
        margin-top: 26rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 48rpx;
      }
    }
  }
}
</style>
