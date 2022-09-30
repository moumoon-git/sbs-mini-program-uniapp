<!--
 * @Author: your name
 * @Date: 2021-11-29 13:53:38
 * @LastEditTime: 2021-11-30 16:21:39
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sbs-mini-program-uniapp\src\pages\garbageClassification\garbageSorting\modules\inspection-rubbish\component\Checklist\Checklist.vue
-->
<template>
  <view class="CheckList">
    <view class="detail">
      <view
        class="list"
        v-for="(item, index) in onePartParams.list"
        :key="index"
      >
        <view class="list-box">
          <text>{{ item.title }}</text>
          <text>{{ item.dec }}</text>
        </view>
      </view>
      <view class="check-basis">
        <view>检查依据：</view>
        <view class="imgList">
          <view class="card" v-for="(v, i) in img" :key="i">
            <!-- https://xc1.zeits.cn/fileupload/attach/investigation/point/2021-11/20211122162326614.jpg -->
            <van-image
              width="200rpx"
              height="200rpx"
              :src="fileHost + v.url"
              :data-src="fileHost + v.url"
            />
          </view>
        </view>
      </view>
      <view
        class="list"
        v-for="(item, index) in nextPartParams.list"
        :key="index"
      >
        <view class="list-box">
          <text>{{ item.title }}</text>
          <text>{{ item.dec }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import config from "@/static/config/index.js";
import { getCheckList } from "@/apis/index.js";
export default {
  data() {
    return {
      id: "",
      fileHost: config.fileHost,
      img: [],
      onePartParams: {
        list: [
          {
            title: "",
            dec: "",
          },
        ],
      },
      nextPartParams: {
        list: [
          {
            title: "",
            dec: "",
          },
        ],
      },
    };
  },

  onLoad(options) {
    this.id = options.id;
    this.getData();
  },
  methods: {
    getData() {
      getCheckList(this.id).then((res) => {
        if (res.data && res.data.code == 0) {
          console.log(res.data.data, "res检查清单数据");
          let info = res.data.data;
          this.img=info.files?info.files:[];
          this.onePartParams.list = [
            {
              title: "项目名称:",
              dec: info.investigationInforName
                ? info.investigationInforName
                : "",
            },
            {
              title: "所属类型:",
              dec: info.investigationInforType
                ? info.investigationInforType
                : "",
            },
            {
              title: "检查对象:",
              dec: info.investigationInforInspectedObject
                ? info.investigationInforInspectedObject
                : "",
            },
            {
              title: "主责单位:",
              dec: info.investigationInforOrganiser
                ? info.investigationInforOrganiser
                : "",
            },
            {
              title: "协办单位:",
              dec: info.investigationInforCoOrganiser
                ? info.investigationInforCoOrganiser
                : "",
            },
            {
              title: "检查内容:",
              dec: info.investigationInforContent
                ? info.investigationInforContent
                : "",
            },
            {
              title: "检查流程:",
              dec: info.investigationInforProcess
                ? info.investigationInforProcess
                : "",
            },
          ];
          this.nextPartParams.list = [
            {
              title: "检查频率:",
              dec: info.investigationInforFrequency
                ? info.investigationInforFrequency
                : "",
            },
            {
              title: "考核标准:",
              dec: info.investigationInforAssessmentStandards
                ? info.investigationInforAssessmentStandards
                : "",
            },
            {
              title: "立案标准:",
              dec: info.investigationInforCaseFilingStandards
                ? info.investigationInforCaseFilingStandards
                : "",
            },
            {
              title: "结案标准:",
              dec: info.investigationInforCaseClosingProcess
                ? info.investigationInforCaseClosingProcess
                : "",
            },
            {
              title: "办结时限:",
              dec: info.investigationInforDealine
                ? info.investigationInforDealine
                : "",
            },
            {
              title: "扣分值:",
              dec: info.investigationInforEvaluationScore||info.investigationInforEvaluationScore==0
                ? `${info.investigationInforEvaluationScore}分`
                : "",
            },
          ];
        }
      });
    },
  },
};
</script>

<style lang='less' scoped>
.CheckList {
  .detail {
    color: #646566;
    .list {
      margin: 36rpx 20rpx;
      .list-box {
        display: flex;
        justify-content: space-between;
        & text:last-child {
          word-wrap: break-word;
          word-break: normal;
          max-width: 445rpx;
          overflow-y: auto;
          max-height: 80rpx;
        }
      }
    }
    .check-basis {
      margin: 36rpx 20rpx;
      .imgList {
        width: 100%;
        max-height: 217rpx;
        background: #fff;
        --tab-font-size: 32rpx;
        box-sizing: border-box;
        display: flex;
        overflow-x: auto;
        margin-top: 20rpx;
        .card {
          display: inline-block;
          font-weight: 400;
          color: #646566;
          margin: 0rpx 10rpx 0px 0px;
        }
      }
    }
  }
}
</style>