<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-04-06 13:58:13
 * @LastEditTime: 2022-05-11 13:41:52
-->
<template>
  <view class="content">
    <view
      class="problem-report"
      :style="mode === 'complete' ? 'min-height:100vh' : 'max-height: 81vh;'"
    >
      <view class="card card-top">
        <view class="card-line">
          <view class="card-line-header">
            <van-icon class="little-icon" name="location-o" />
            <text class="overflow-ellipsis">{{ placeData.place }}</text>
          </view>
        </view>
        <view class="card-line">
          <view class="card-line-header cardRight" @click="showActionTab(true)">
            <view>
              <van-icon class="little-icon" name="warn-o" />
              <text> <text style="color: #ec808d">*</text>一级问题类型 </text>
            </view>
            <view>
              <text class="problemData">{{ dataFormMap[showIndex].typeName }}</text>
              <van-icon
                class="little-icon vertical-right"
                name="arrow"
                v-if="!(mode === 'complete' || mode === 'modify' || belongTo === 1)"
              />
            </view>
          </view>
          <view
            class="card-line-header second-level"
            @click="showSecondaryType(true)"
            v-if="showIndex !== -1"
          >
            <view>
              <van-icon class="little-icon" name="warn-o" />
              <text><text style="color: #ec808d">*</text>二级问题类型 </text>
            </view>
            <view class="nameList">
              <view class="typeNames">
                {{ dataFormMap[showIndex].typeNames }}
              </view>
              <van-icon
                class="little-icon vertical-right"
                name="arrow"
                v-if="!(mode == 'complete' || mode == 'modify')"
              />
            </view>
          </view>
        </view>
      </view>
      <view class="card-form">
        <view>
          <!-- 市容类 -->
          <cityClass
            :mode="mode"
            v-if="showIndex !== -1"
            :placeData="placeData"
          ></cityClass>
        </view>
      </view>
      <van-action-sheet
        :show="problemAreaShow"
        title="请选择一级问题类型"
        @close="showActionTab(false)"
        v-if="!(mode == 'complete' || mode == 'modify')"
      >
        <van-picker
          v-if="pickerVisible"
          show-toolbar
          :columns="problemColumns"
          value-key="name"
          @confirm="onConfirm"
          @cancel="onCancel"
          @change="onChange"
        />
      </van-action-sheet>
      <!-- 二级类型 -->
      <van-action-sheet
        :show="secondaryTypShow"
        title="请选择二级问题类型"
        @close="showSecondaryType(false)"
        v-if="!(mode == 'complete' || mode == 'modify')"
      >
        <van-checkbox-group
          :value="dataFormMap[showIndex].allCheckedList"
          @change="handleCheckboxGroupChange($event, showIndex)"
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
      </van-action-sheet>
    </view>

    <view class="btn" v-if="mode === 'modify'">
      <view class="submit-btn" @click="statusHandler">已处置</view>
      <view class="save-btn" @click="modeChange">修改</view>
      <!-- 按钮内容 -->
    </view>
    <view class="btn" v-else-if="mode === 'report-modify'">
      <view class="submit-btn" @click="statusHandler">已处置</view>
      <view class="save-btn" @click="save(0)">保存</view>
      <!-- 按钮内容 -->
    </view>
    <view class="btn" v-else-if="mode === 'draft'">
      <view class="submit-btn" @click="save(0)">确认提交</view>
      <view class="save-btn" @click="modeChange">修改</view>
      <!-- 按钮内容 -->
    </view>
    <view class="btn" v-else-if="mode === 'add'">
      <view class="submit-btn" @click="save(0)">确认提交</view>
      <view class="save-btn" @click="save(1)">存为草稿</view>
      <!-- 按钮内容 -->
    </view>
  </view>
</template>
<script>
import cityClass from "./components/city-class.vue";
import { getLocation } from "@/utils/hooks/useHooks.js";
import {
  getAreaTree,
  getReportData,
  getReportingDetail,
  updateStatus,
  getSublevel,
} from "@/apis/index.js";
import { ref, defineComponent, reactive, computed, nextTick } from "vue";
import useInit from "./useHooks/useInit";
export default defineComponent({
  components: {
    cityClass,
  },
  provide() {
    return {
      mode: this.mode,
    };
  },
  setup() {
    const { dataFormMap, showIndex, initDataFormMap } = useInit();
    const placeData = reactive({
      place: "", //位置
      longitude: "",
      latitude: "",
    });
    const typesData = reactive([]);
    const activeIndex = ref(-1);
    const problemAreaShow = ref(false);
    const secondaryTypShow = ref(false);
    const areaData = reactive([]);
    const mode = ref("");
    const belongTo = ref("");
    const reportId = ref(-1);
    const problemColumns = reactive([]);
    const allCheckedList = ref([]);
    const secondaryTypeIds = ref([]);
    const typeNames = ref("");
    const pickerVisible = ref(false);
    const ordinaryCellList = reactive([]);
    function getTreeData() {
      problemColumns.length = 0;
      getAreaTree().then((res) => {
        if (res.data.code === 0) {
          let temp = res.data.data.map((v) => {
            return {
              id: v.id,
              name: v.name,
              code: v.code,
            };
          });
          problemColumns.push(...temp);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
      });
    }
    async function refresh() {
      const { longitude, latitude, address } = await getLocation();
      placeData.longitude = longitude;
      placeData.latitude = latitude;
      placeData.place = address;
    }
    // 一级数据展示
    function showActionTab(flag) {
      problemAreaShow.value = flag;
      pickerVisible.value = flag;
    }
    // 二级类型数据展示
    function showSecondaryType(type) {
      secondaryTypShow.value = type;
    }
    function onConfirm(e) {
      let code = e.detail.value.code;
      dataFormMap[code].typeName = e.detail.value.name;
      dataFormMap[code].typeId = e.detail.value.id;
      showIndex.value = e.detail.value.code;
      dataFormMap[showIndex.value].longitude = placeData.longitude;
      dataFormMap[showIndex.value].latitude = placeData.latitude;
      dataFormMap[showIndex.value].place = placeData.place;
      problemAreaShow.value = false;
      getProblemSublevel(e.detail.value.id);
      wx.setStorageSync("dataFormMapIndex", showIndex.value);
    }
    function onChange(e) {}
    function onCancel(e) {
      problemAreaShow.value = false;
    }
    function getProblemSublevel(id) {
      ordinaryCellList.length = 0;
      getSublevel(id).then((res) => {
        if (res.data.code === 0) {
          ordinaryCellList.push(...res.data.data);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
      });
    }
    function handleCheckboxGroupChange(event, code) {
      dataFormMap[code].allCheckedList = [];
      let str = "";
      let tempId = [];
      event.detail.forEach((v, i) => {
        let s = v.split("+");
        str += s[1] + "、";
        tempId.push(s[0]);
      });
      dataFormMap[code].allCheckedList = event.detail;
      dataFormMap[code].typeNames = str;
      dataFormMap[code].secondaryTypeIds = tempId;
    }
    /**
     *
     * @param {*} type 保存草稿/上报
     */
    function save(type) {
      dataFormMap[showIndex.value].belongTo = type;
      if (
        !dataFormMap[showIndex.value].typeId ||
        !dataFormMap[showIndex.value].areaId ||
        dataFormMap[showIndex.value].secondaryTypeIds.length === 0
      ) {
        wx.showToast({
          title: "请填写必填项",
          icon: "error",
        });
        return;
      }
      let request = { ...dataFormMap[showIndex.value], ...placeData };
      getReportData(request).then((res) => {
        if (res.data.code === 0) {
          wx.showToast({
            title: type === 0 ? "问题上报成功！！" : "已保存为草稿",
            icon: "success",
          });
          if (type === 0) {
            wx.redirectTo({
              url: "/pages/garbageClassification/ProblemReporting/ProblemReporting",
            });
          } else {
            wx.redirectTo({
              url: "/pages/garbageClassification/ProblemReporting/drafts",
            });
          }
          wx.removeStorageSync("dataFormMap"); //清除指定缓存
          wx.removeStorageSync("dataFormMapIndex"); //清除指定缓存
          console.log(dataFormMap['OTHER'].tempBeforeAttachment,'缓存')
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
      });
    }

    function modeChange() {
      if (belongTo.value === 0 && mode.value === "modify") {
        mode.value = "report-modify";
      } else {
        mode.value = "add";
      }
    }

    function statusHandler() {
      updateStatus({
        id: reportId.value,
        status: 1,
      }).then((res) => {
        console.log("%c [ res ]", "font-size:13px; background:pink; color:#bf2c9f;", res);
        if (res.data.code === 0) {
          wx.showToast({
            title: "已处置成功",
            icon: "success",
          });
          mode.value = "complete";
          wx.removeStorageSync("dataFormMap"); //清除指定缓存
          wx.removeStorageSync("dataFormMapIndex"); //清除指定缓存
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
          });
        }
      });
    }

    return {
      dataFormMap,
      typesData,
      activeIndex,
      showIndex,
      problemAreaShow,
      areaData,
      pickerVisible,
      problemColumns,
      ordinaryCellList,
      secondaryTypShow,
      refresh,
      getTreeData,
      showActionTab,
      save,
      mode,
      modeChange,
      statusHandler,
      reportId,
      showSecondaryType,
      onConfirm,
      onChange,
      onCancel,
      getProblemSublevel,
      handleCheckboxGroupChange,
      allCheckedList,
      typeNames,
      secondaryTypeIds,
      placeData,
      belongTo,
      initDataFormMap,
    };
  },
  onLoad(option) {
    console.log("进来了", "font-size:13px; background:pink; color:#bf2c9f;", option);
    // 编辑模式
    if (option.id) {
      this.reportId = option.id;
      console.log(option.id, "编辑模式");
      getReportingDetail(option.id).then((res) => {
        console.log("%c [ xxx ]", "font-size:13px; background:pink; color:#bf2c9f;", res);
        if (res.data.code === 0) {
          this.showIndex = res.data.data.typeCode;
          wx.setStorageSync("dataFormMapIndex", this.showIndex);
          Object.assign(this.dataFormMap[this.showIndex], res.data.data);
          this.belongTo = res.data.data.belongTo;
          this.placeData.place = res.data.data.place;
          this.placeData.longitude = res.data.data.longitude;
          this.placeData.latitude = res.data.data.latitude;
          this.dataFormMap[this.showIndex].place =
            this.dataFormMap[this.showIndex].place || "";
          this.getProblemSublevel(this.dataFormMap[this.showIndex].typeId);
          this.dataFormMap[this.showIndex].attachments =
            this.dataFormMap[this.showIndex].attachments || [];
          this.dataFormMap[this.showIndex].workSite =
            this.dataFormMap[this.showIndex].workSite || "";
          this.dataFormMap[this.showIndex].fine =
            this.dataFormMap[this.showIndex].fine || "";
          this.dataFormMap[this.showIndex].typeNames = res.data.data.typeNames;
             this.dataFormMap[
            this.showIndex
          ].allCheckedList = res.data.data.secondaryTypes.map((v) => {
            return `${v.id}+${v.name}`;
          });

          this.dataFormMap[this.showIndex].afterAttachment!==null
            ? this.dataFormMap[this.showIndex].afterAttachment.forEach((v) => {
                v.isImage = true;
                v.url = v.allUrl;
              })
            : (this.dataFormMap[this.showIndex].afterAttachment = []);
            

          this.dataFormMap[this.showIndex].middleAttachment!==null
            ? this.dataFormMap[this.showIndex].middleAttachment.forEach((v) => {
                v.isImage = true;
                v.url = v.allUrl;
              })
            : (this.dataFormMap[this.showIndex].middleAttachment = []);

              this.dataFormMap[this.showIndex].beforeAttachment!==null
            ? this.dataFormMap[this.showIndex].beforeAttachment.forEach((v) => {
                v.isImage = true;
                v.url = v.allUrl;
              })
            : (this.dataFormMap[this.showIndex].beforeAttachment = []);

              console.log(
                this.dataFormMap[this.showIndex].beforeAttachment,
                "this.dataFormMap[this.showIndex].beforeAttachment"
              );

              this.dataFormMap[this.showIndex].paperworkAttachment !==null
            ? this.dataFormMap[this.showIndex].paperworkAttachment.forEach((v) => {
                v.isImage = true;
                v.url = v.allUrl;
              })
            : (this.dataFormMap[this.showIndex].paperworkAttachment = []);

       

          this.dataFormMap[this.showIndex].beforeAttachment
            ?this.dataFormMap[this.showIndex].tempBeforeAttachment.push(
              ...this.dataFormMap[this.showIndex].beforeAttachment
              )  
            : (this.dataFormMap[this.showIndex].tempBeforeAttachment = []);
            console.log( this.dataFormMap[this.showIndex].tempBeforeAttachment,'等会撒还打算')
            
          this.dataFormMap[this.showIndex].middleAttachment
            ?this.dataFormMap[this.showIndex].tempMiddleAttachment.push(
              ...this.dataFormMap[this.showIndex].middleAttachment
              )  
            : (this.dataFormMap[this.showIndex].tempMiddleAttachment = []);

          this.dataFormMap[this.showIndex].afterAttachment
            ?this.dataFormMap[this.showIndex].tempAfterAttachment.push(
              ...this.dataFormMap[this.showIndex].afterAttachment
              ) 
            :  (this.dataFormMap[this.showIndex].tempAfterAttachment = []);

          this.dataFormMap[this.showIndex].paperworkAttachment
            ? this.dataFormMap[this.showIndex].tempPaperworkAttachment.push(
              ...this.dataFormMap[this.showIndex].paperworkAttachment
              ) 
            : (this.dataFormMap[this.showIndex].tempPaperworkAttachment = []);
              console.log(this.dataFormMap['OTHER'].tempBeforeAttachment,'this.dataFormMap[this.showIndex].tempBeforeAttachment')
          
          // 草稿箱
          if (res.data.data.belongTo === 1) {
            this.mode = "draft";
            return;
          }

          // status = 0 未处置
          this.mode = res.data.data.status === 0 ? "modify" : "complete";
          console.log(this.mode, "this.mode");
        }
      });
    } else {
      this.mode = "add";
      this.refresh();
      const cache = wx.getStorageSync("dataFormMap");
      const i = wx.getStorageSync("dataFormMapIndex");
      console.log("12121212", "121212", cache, i, cache[i]);
      if (cache) {
        Object.assign(this.dataFormMap, cache);
        this.showIndex = i;
      }
    }

    this.getTreeData();
  },
  onUnload() {
    console.log('898989')
    // this.dataFormMap = null;
    this.initDataFormMap(this.showIndex);
    console.log(this.dataFormMap,'this.dataFormMap')
    wx.setStorageSync("isClose", true);
    if (wx.getStorageSync("isClose") && this.mode === "modify") {
      // this.initDataFormMap(this.showIndex);
      setTimeout(() => {
        wx.removeStorageSync("dataFormMap"); //清除指定缓存
        wx.removeStorageSync("dataFormMapIndex"); //清除指定缓存
      }, 10);
    }
    this.showIndex = -1;
  },
});
</script>
<style lang="less">
.content {
  .problem-report {
    overflow-y: auto;
    background-color: #f5f5f5;
    color: #474747;
    .vertical-right {
      margin-left: auto;
    }
    .overflow-ellipsis {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .card {
      margin: 20rpx auto;
      width: 96%;
      background-color: #fff;
      .title {
        padding: 20rpx 0 20rpx 23rpx;
        line-height: 40rpx;
      }
    }
    .card-top {
      .card-line:last-child {
        border-bottom: none;
      }
      .card-line {
        margin: 0 auto;
        border-bottom: 1px solid #d7d7d7;
        width: 94%;
        .card-line-header {
          display: flex;
          line-height: 104rpx;
          .little-icon {
            margin-right: 5rpx;
            font-size: 40rpx;
          }
          .nameList {
            display: flex;
            max-width: 310rpx;
            margin-left: auto;
            .typeNames {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        .cardRight {
          display: flex;
          justify-content: space-between;
        }
        .second-level {
          border-top: 1px solid #d7d7d7;
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .card-upload {
      .pic-box {
        padding-left: 23rpx;
      }
    }
    .card-remark {
      min-height: 300rpx;
    }
  }
  .submit-btn {
    position: fixed;
    left: 50%;
    bottom: 90rpx;
    width: 640rpx;
    height: 90rpx;
    background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
    box-shadow: 0px 12rpx 24rpx 0rpx rgba(12, 126, 161, 0.35);
    border-radius: 75rpx;
    line-height: 90rpx;
    text-align: center;
    text-shadow: 0 0 5rpx 0;
    font-weight: 400;
    font-size: 28rpx;
    color: #fff;
    transform: translateX(-50%);
  }
  .save-btn {
    position: fixed;
    left: 50%;
    bottom: 45rpx;
    text-align: center;
    font-weight: 400;
    font-size: 28rpx;
    color: #0091ff;
    transform: translateX(-50%);
  }
}
</style>
