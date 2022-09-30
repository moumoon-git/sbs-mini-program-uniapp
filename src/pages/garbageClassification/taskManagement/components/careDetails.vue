
<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-23 17:16:06
 * @LastEditTime: 2022-04-24 16:25:39
-->
<template>
  <view class="dangerDetails">
    <view class="dangerDetails_item">
      <view class="details_header">
        <view class="details_header_wrap">
          <view
            class="details_header_item"
            v-for="(item, index) in careList"
            :key="index"
          >
            <view class="title">{{ item.title }}</view>
            <view class="desc">{{ item.desc }}</view>
          </view>
          <view class="careObject">
            <view class="title">关爱对象</view>
            <view class="desc">
              <view
                v-for="item in careObjectList"
                :key="item.id"
                class="desc_item"
              >
                <view>
                  {{ `${item.name}(${item.mobile1})` }}
                </view>
              </view>
            </view>
          </view>

          <view class="details_labels">
            <span
              class="oneLabel"
              :style="{ background: item.background }"
              v-for="item in labelEntities"
              :key="item.id"
            >
              <span class="label-item" :style="{ color: item.color }">
                {{ item.name }}
              </span>
            </span>
          </view>
          <view class="details_address">
            <van-icon class="little-icon" name="location-o" />
            <text>{{currentAddress}}</text>
          </view>
          <view class="status">
            <image
              v-if="patrolRecord.length === 0"
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
      <view class="danger_record">
        <view class="danger_record_header">
          <view class="record">
            <text>任务记录</text>
          </view>
          <view class="num">
            <text>次数：</text>
            <text class="">{{ patrolRecord.length }}</text>
          </view>
        </view>
        <view class="danger_record_content">
          <view v-if="patrolRecord.length > 0">
            <view
              class="record_content"
              v-for="item in patrolRecord"
              :key="item.id"
            >
              <view class="time">
                <text>{{ item.patrolTime }}</text>
              </view>
              <view class="describe ">
                <text>{{ item.remark }}</text>
              </view>
              <view class="img">
                <view
                  class="list"
                  v-for="(ele, index) in item.documents"
                  :key="index"
                >
                  <ImageView :src="`${ele.url}`" style=" width: 150rpx;height: 150rpx;"></ImageView>
                </view>
              </view>
            </view>
          </view>

          <view class="empty-box" v-else>
            <image
              :src="imgStaticUrl + '/img/reportTask/empty.png'"
              mode=""
              style="width: 198rpx;height: 178rpx;"
            >
            </image>
            <view class="empty">
              暂无数据
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="submission" @click="showPopup(true)">
      <text>上报任务记录</text>
    </view>
    <van-action-sheet
      class="bottom"
      :show="show"
      title="上报记录"
      @close="showPopup(false)"
    >
      <div class="pd-left">
        <van-uploader
          :file-list="pictureList"
          :capture="['camera']"
          :max-count="4"
          @after-read="afterRead"
          upload-text="上传图片"
          @delete="deleteFile"
        />
      </div>
      <div style="margin-bottom: 30rpx">
        <div class="pd-left">记录说明</div>
        <van-field
          :value="remark"
          placeholder="请输入此描述记录说明"
          style="padding: 0px;"
          @input="handleInput"
        />
      </div>
      <div class="operation-btn" @click="submit">确定</div>
    </van-action-sheet>
  </view>
</template>

<script>
import config from "@/static/config/index.js";
import { getLabel } from "../common/common.js";
import { getLocation } from "@/utils/hooks/useHooks.js";
import { getPatrolRecord, handleSaveList, getCareList } from "@/apis/index.js";
import ImageView from '@/pages/custom-components/ImageView/ImageView.vue';
export default {
  components: {ImageView},
  props: {},
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      fileHost: config.fileHost,
      careList: [],
      show: false,
      fileList: [], //图片数据
      pictureList:[],
      remark: "", //描述记录说明
      status: "",
      currentStatus: "", //当前传过来的是列表状态
      currentId: "",
      labelEntities: [], //标签数据
      currentAddress: "", //风险隐患地址
      longitude: "",
      latitude: "",
      address: "",
      patrolRecord: [], //详情数据
      patrolPointId: "",
      // 性别-选项
      sexOptions: [
        {
          label: "男",
          value: 0,
        },
        {
          label: "女",
          value: 1,
        },
        {
          label: "保密",
          value: 2,
        },
      ],
      careObjectList: [], //关爱对象数据
    };
  },
  watch: {},
  computed: {},
  onLoad(options) {
    this.currentStatus = options.status;
    this.currentId = options.id;
    this.patrolPointId = options.patrolPointId;
    console.log(options, "options");
    this.refresh()
  },
  onShow() {
    this.getDetail();
    this.getCare();
  },
  methods: {
    /**
     * @description:初始化数据
     */
    initData() {
      this.fileList = [];
      this.pictureList=[];
      this.remark = "";
    },
    /**
     * @description:点击上报任务记录弹窗
     */
    showPopup(type) {
      this.show = type;
      if(type==false)  this.initData();
    },
    /**
     * @description:获取详情内容
     */
    async getDetail() {
      let request = {
        taskInstanceInforId: Number(this.currentId),
      };
      const res = await getPatrolRecord(request);
      if (res.data.code === 0) {
        this.patrolRecord = res.data.data;
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "error",
        });
      }
      console.log(res, "获取详情内容");
    },
    /**
     * @description:获取风险点详情
     */
    async getCare() {
      const res = await getCareList(this.patrolPointId);
      if (res.data.code === 0) {
        let result = res.data.data;
        console.log(result, "脆弱人群");
        (this.careList = [
          {
            title: "姓名",
            desc: result.name,
          },
          {
            title: "性别",
            desc: result.sex ? this.sexOptions[result.sex].label : "",
          },
          {
            title: "联系方式",
            desc: result.mobile1 || "",
          },
          {
            title: "紧急联络人",
            desc: result.urgentContactor || "",
          },
          {
            title: "现住址",
            desc: result.address || "",
          },
        ]),
          (this.careObjectList = result.dmpCaringPeopleEntity.careObjectList);
        this.currentAddress = result.address;
        this.labelEntities = getLabel(result.dmpLabelEntityList);
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "error",
        });
      }

      console.log(res, "风险隐患点");
    },
    handleInput(e) {
      this.remark = e.detail;
      console.log(e, "/*/*");
    },
    /**
     * @description:提交上报记录数据
     */
    submit() {
      console.log(this.remark, "8989");
      let request = {
        taskInstanceInforId: this.currentId,
        remark: this.remark,
        documents: this.fileList,
        address:this.address
      };
      handleSaveList(request).then((res) => {
        if (res.data.code === 0) {
          wx.showToast({
            title: "提交成功",
            icon: "success",
          });
          this.initData();
          this.getDetail();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
        this.show = false;
      });
    },
    async refresh() {
      const { longitude, latitude, address } = await getLocation();
      this.longitude = longitude;
      this.latitude = latitude;
      this.address = address;
    },
    /**
     * @description:图片上传
     */
    afterRead(event) {
      console.log("afterRead", event);
      const { name, file } = event.detail;
      this.pictureList.push({
        name:'',
        url: file.url,
      });
      console.log(this.pictureList,'pictureList')
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
          filePath: item.url,
          name: "file",
          header: {
            "content-type": "application/x-www-form-urlencoded",
            token: wx.getStorageSync("token"),
          },
          formData: {
            "content-type": "multipart/form-data",
            charset: "utf-8",
            file: item.url,
            address: this.address,
          },
          success: (res) => {
            let data = JSON.parse(res.data);
            if (data.errorcode === 0) {
              console.log(data.data, "///");
              this.fileList.push({
                name: data.data.name,
                url: this.fileHost + data.data.url,
              });
              console.log(this.fileList,'this.fileList')
            }
          },
          fail: (res) => {
            console.log("fail", res);
          },
          complete: (res) => {
            console.log("complete", res);
          },
        });
      });
    },
    /**
     * @description：删除图片
     */
    deleteFile(event) {
      const { index } = event.detail;
      this.fileList.splice(index, 1);
      this.pictureList.splice(index, 1);
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.dangerDetails {
  min-height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
  color: #474747;
  position: relative;
  .dangerDetails_item {
    .details_header {
      background: #ffffff;
      margin: 20rpx auto;
      width: 96%;
      padding-bottom: 20rpx;
      .details_header_wrap {
        padding-top: 25rpx;
        padding-left: 40rpx;
        position: relative;
        .details_header_item {
          display: flex;
          .title {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 60rpx;
            margin-right: 40rpx;
          }
          .desc {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 60rpx;
            max-width: 465rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-left: 17rpx;
          }
        }
        .details_header_item:nth-child(1) {
          .desc {
            margin-left: 107rpx;
          }
        }
        .details_header_item:nth-child(2) {
          .desc {
            margin-left: 107rpx;
          }
        }
        .details_header_item:nth-child(3) {
          .desc {
            margin-left: 40rpx;
          }
        }
        .details_header_item:nth-child(5) {
          .desc {
            margin-left: 75rpx;
          }
        }
        .details_header_item:nth-child(6) {
          .desc {
            margin-left: 40rpx;
          }
        }
        .careObject {
          display: flex;
          .title {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 60rpx;
            margin-right: 40rpx;
          }
          .desc {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 60rpx;
            margin-left: 40rpx;
          }
        }
        .details_labels {
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
        .details_address {
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 33rpx;
          font-size: 28rpx;
          max-width: 710rpx;
        }
        .status {
          position: absolute;
          top: 0;
          right: 0;
          .img {
            width: 100rpx;
            height: 100rpx;
          }
        }
      }
    }
    .danger_record {
      margin: 20rpx auto;
      width: 96%;
      background: #ffffff;
      .danger_record_header {
        display: flex;
        justify-content: space-between;
        .record {
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 92rpx;
          margin-left: 40rpx;
        }
        .num {
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 92rpx;
          margin-right: 40rpx;
        }
      }
      .danger_record_content {
        overflow-y: scroll;
        max-height: 45vh;
        .record_content {
          background: #f8fafc;
          border-radius: 10rpx;
          margin: 0 40rpx;
          padding-bottom: 25rpx;
          .time {
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 37rpx;
            padding-top: 24rpx;
            padding-left: 21rpx;
            padding-bottom: 16rpx;
          }
          .describe {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 40rpx;
            padding-left: 21rpx;
            padding-bottom: 16rpx;
          }
          .img {
            display: flex;
            padding-left: 21rpx;
            margin-right: 10rpx;
            .list {
              margin-right: 10rpx;
            }
          }
        }
        .empty-box {
          position: absolute;
          left: 50%;
          top: 70%;
          transform: translate(-50%, -70%);
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
  .submission {
    width: 640rpx;
    height: 90rpx;
    background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
    box-shadow: 0px 6rpx 12rpx 0px rgba(12, 126, 161, 0.35);
    border-radius: 75rpx;
    display: flex;
    justify-content: center;
    bottom: 0;
    left: 0;
    position: absolute;
    margin-bottom: 40rpx;
    margin-left: 55rpx;
    text {
      line-height: 90rpx;
      color: #ffffff;
    }
  }
  .bottom {
    .pd-left {
      padding-left: 40rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 45rpx;
    }
    .operation-btn {
      margin: 0 auto;
      width: 423rpx;
      height: 62rpx;
      text-align: center;
      line-height: 62rpx;
      border-radius: 12px;
      font-size: 25rpx;
      background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
      color: #fff;
    }
  }
}
</style>
