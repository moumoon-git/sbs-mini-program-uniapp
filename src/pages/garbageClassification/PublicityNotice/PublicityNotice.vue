<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-04-11 13:49:59
 * @LastEditTime: 2022-04-16 15:03:49
-->
<template>
  <view class="PublicityNotice">
    <header>
      <view class="top" @click="handleJump" >
        <view class="total">
          <view class="img">
            <image
              class="infor"
              :src="imgStaticUrl + '/img/PublicityNotice/inform.png'"
            ></image>
          </view>
          <view class="totalMumber">
            <text class="num">通知总数：{{totalNum}}</text>
          </view>
        </view>
        <view><van-icon class="right_arrow" name="arrow"/></view>
      </view>
    </header>
    <section>
      <van-tabs :active="tabActive" animated  ref="vanTabs"  @change="handleTabChange" class="tabs">
        <van-tab
          :title="item.name"
          :name="item.name"
          v-for="(item, index) in tabsList"
          :key="index"
        >
        <SpreadInformation
          :PublicityEducationData="PublicityEducationData"
          :tabActive="tabActive"
          @getPage="getPage"
          @addPage="addPage"
          :currentPage="currentPage"
          :totalPage="totalPage"
        >
        </SpreadInformation>
        </van-tab>
      </van-tabs>
    </section>
  </view>
</template>

<script>
import { debounce } from "@/utils/utils.js";
import { getInformationType, getPublicityEducationData,getNoticeCount } from "@/apis/index.js";
import SpreadInformation from "./components/SpreadInformation.vue";
export default {
  name: "PublicityNotice",
  components: { SpreadInformation },
  props: {},
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      tabsList: [],
      tabActive: "",
      typeId: "", //信息类型id
      PublicityEducationData: [],
      currentPage: 1, //当前页
      totalPage: 1, //总页数
      totalCount: 0,
      totalNum:'',//通知总数
    };
  },
  watch: {},
  computed: {},
  created() {},
  async onLoad() {
    await this.resize();
    this.getTabs();
    await this.getListPage();
    await this.getCountNumber();
    
  },
  methods: {
    resize() {
      // 要用定时器 宏任务才可以获取到tab的选择器
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.vanTabs.resize();
        });
      }, 10);
    },
    /**
     * @description:获取tbs数据
     */
    getTabs() {
      getInformationType().then((res) => {
        console.log(res, "获取tabs");
        if (res.data.code === 0) {
          this.tabsList = res.data.data;
          this.$nextTick(() => {
            if (this.tabsList.length > 0) {
              this.handleTabChange({
                detail: {
                  name: this.tabsList[0].name,
                },
              });
            }
          })
        }
      });
    },
    /**
     * @description:获取通知总数数据
     */
    getCountNumber(){
      getNoticeCount().then((res)=>{
        this.totalNum= res.data.count || '0';
      })
    },
    /**
     * @description:点击tabs切换
     */
    handleTabChange(e) {
      this.currentPage=1;
      this.PublicityEducationData = [];
      console.log(e, "点击tabs");
      this.tabActive = e ? e.detail.name :"";
      this.typeId = this.tabsList
        ? this.tabsList.filter((v) => {
            if (v.name === this.tabActive) {
              return v;
            }
          })[0].id
        : "";
        this.$nextTick(()=>{
          this.getListPage();
        })
      
      console.log(this.typeId, "tabsId");
    },
    /**
     * @description:获取列表数据
     */
    getListPage() {
      if(!this.typeId){
        return false;
      }
      let request = {
        page: this.currentPage,
        limit: 10,
        typeId: this.typeId,
      };
      getPublicityEducationData(request).then((res) => {
        if (res.data.code === 0) {
          res.data.page.list.forEach((v) => {
            if (v.content) {
              v.content = v.content
                .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/gi, "<p")
                .replace(/<p>/gi, '<p style="font-size: 35rpx; line-height: 54rpx;color: #333333;">')
                .replace(/\<img/gi, '<img style="width:100%;height:auto;display:block;"');
            }
          });
          console.log(res.data.page.list, "res.data.page.list");
          this.PublicityEducationData.push(...res.data.page.list);
          this.currentPage = res.data.page.currPage;
          this.totalPage = res.data.page.totalPage;
          this.totalCount = res.data.page.totalCount;
          wx.hideLoading();
        }
        console.log(res, "数据");
      });
    },
    /**
     * @description：跳转页面--通知公告
     */
    handleJump(){
      uni.navigateTo({
        url: `/pages/publicPage/notification/notification`,
      })
    },
    getPage(){
      this.currentPage++;
      this.getListPage();
    }
    
  },
};
</script>
<style lang="less" scoped>
.PublicityNotice {
  min-height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
  color: #474747;
  position: relative;
  header {
    .top {
      display: flex;
      justify-content: space-between;
      background: #ffffff;
      padding: 32rpx 0rpx 28rpx 0rpx;
      .total {
        padding-left: 40rpx;
        display: flex;
        .img {
          .infor {
            width: 45rpx;
            height: 45rpx;
            margin-right: 16rpx;
          }
        }
        .totalMumber {
          font-size: 28rpx;
          color: #333333;
          line-height: 40rpx;
          .num {
          }
        }
      }
    }
    .right_arrow {
      padding-right: 30rpx;
    }
  }
  header:after {
    display: flex;
    content: "";
    width: 750rpx;
    height: 1rpx;
    background: #eeeeee;
  }
  section {
    .tabs {
    }
  }
  // /deep/ .van-tabs__line {
  //   transform: translateX(40px);
  // }
}
</style>
