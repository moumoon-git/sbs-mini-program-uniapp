<!--
 * @Author: your name
 * @Date: 2021-12-03 17:14:13
 * @LastEditTime: 2022-01-05 18:42:11
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sbs-mini-program-uniapp\src\pages\publicPage\account-registration\AccountRegistration.vue
-->
<template>
  <view class="page">
    <!-- 头部 -->
    <view
      class="page-header"
      :style="{
        background: `url(${imgStaticUrl}/img/map/detailHeader.png)`,
        backgroundSize: `${cover}`,
      }"
    >
      <text class="title"> 
        <text>
          {{platformInfo.customName? platformInfo.customName: platformInfo.platformName}}
        </text>
        账号注册
      </text>
    </view>
    <!-- 照片 -->
    <view class="picture">
      <view class="pic-title">照片</view>
      <view class="pic-box">
        <van-uploader
          :file-list="fileList"
          @after-read="afterRead"
          @delete="deleteFile"
          :max-count="1"
          multiple
        />
      </view>
    </view>
    <!-- 表单 -->
    <view class="menu">
      <van-form validate-first @failed="onFailed">
        <!-- 通过 validator 进行函数校验 -->
        <van-field
          required
          v-model="name"
          label="姓名"
          :error-message="errorMessage.name"
          placeholder="请输入姓名"
        />
        <van-field v-model="position" label="职务" placeholder="请输入职位" />
        <van-field
          v-model="mobile1"
          required
          label="手机号码"
          placeholder="请输入手机号码"
          :error-message="errorMessage.mobile1"
        />

        <view class="card-line">
          <view class="card-line-header" @click="showActionTab(1, true)">
            <view class="left">
              <text style="color: #ec808d">*</text>
              <text class="label">职责分工</text>
            </view>

            <view class="right">
              <text
                v-for="(item, index) in selectDate"
                :key="index"
                v-model="selectDate"
                >{{ item.roleName }}、</text
              >
            </view>
            <view class="icon">
              <van-icon class="little-icon vertical-right" name="arrow" />
            </view>
          </view>
        </view>
      </van-form>
      <view class="save-btn" @click="save">提交</view>
      <van-action-sheet
        :show="problemAreaShow"
        title="请选择职责分工"
        @close="showActionTab(activeActionTab, false)"
      >
        <view class="flex-box">
          <view
            v-for="(item, index) in list"
            :key="item.roleId"
            :class="['second-box', { activeBox: item.checked }]"
            @click="chooseRole(index)"
          >
            {{ item.roleName }}
          </view>
        </view>
      </van-action-sheet>
    </view>
  </view>
</template>

<script>
import config from "@/static/config/index.js";
import { getRegister, getOutreachContactsRole,getPlatformTitle,getContactsRole } from "@/apis/index.js";
export default {
  data() {
    return {
      id: "",
      fileList: [],
      picList: [],
      divideWork: [],
      dutyIds: [],
      name: "",
      mobile1: "",
      position: "",
      title: "荔城垃圾分类智管家账号注册",
      imgStaticUrl: this.$imgStaticUrl,
      cover: "cover",
      activeActionTab: 0,
      problemAreaShow: false,
      list: [],
      checkId: -1,
      selectDate: [],
      errorMessage: { name: "", mobile1: "", selectDate: "" },
      selectCache: [],
      platformId:'',
      agencyId:'',
      platformInfo: {},
    };
  },
  watch: {
    list: {
      handler: function (newVal, oldVal) {
        this.selectDate = this.list.filter((item) => item.checked);
      },
      deep: true,
    },
  },
  async onLoad(option) {
    this.id = option.id || option.scene;
    this.getPermission();
  },

  methods: {
    init() {
      getOutreachContactsRole(this.id).then((res) => {
        if (res.data.errorcode == 0 && res.data.list) {
          res.data.list.forEach((v) => {
            v["checked"] = false;
          });
          this.list = res.data.list;
          this.agencyId=res.data.agencyId;
          this.platformId=res.data.platformId;
        }
      });
    },
    /**
     * @description:判断有没有邀请权限
     */
    getPermission(){
      getContactsRole(this.id).then((res)=>{
        if(res.data.errorcode == 0&&res.data.code===0){
          this.init();
          this.getTerraceTitle();
        }else{
          wx.redirectTo({
            url: '/pages/tip-pages/tip-pages',
          });
        }
      })
    },
    /**
     * @description：获取平台标题
     */
    getTerraceTitle(){
      console.log(this.id,'id')
      getPlatformTitle(String(this.id)).then((res) => {
          console.log('/sys/platform/queryByUserId data', res.data);
          if (res.data.code == 0) {
            this.platformInfo = res.data.platFormEntity;
            console.log( this.platformInfo,'444')
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'error',
            });
          }
        });
    },
    // 验证手机号格式
    verifymobile1() {
      if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.mobile1.detail)) {
        wx.showToast({
          title: "手机号码有误,请重新填写",
          icon: "error",
        });
        return false;
      } else {
        return true;
      }
    },
     /**
     * @description:图片上传
     */
    afterRead(event) {
      const { name, file } = event.detail;
      let upFiles = [];
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      if (file instanceof Array) {
        upFiles.push(...file);
      } else {
        upFiles.push(file);
      }
      upFiles.forEach((item) => {
        wx.uploadFile({
          url: `${config.host}/fileupload/scgMailContactor/uploadImg`, // 仅为示例，非真实的接口地址
          filePath: item.url,
          name: "file",
          header: {
            "content-type": "multipart/form-data",
            token: wx.getStorageSync("token"),
          },
          formData: {
            "content-type": "multipart/form-data",
            charset: "utf-8",
            file: item.url,
          },
          success: (res) => {
            let data = JSON.parse(res.data);
            
            if (data.errorcode === 0) {
              this.fileList.push({
                url:config.host+data.data.url,
              });
              this.picList.push({url:data.data.url})
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
   * @description:图片删除
   */
    deleteFile(event) {
      const { index } = event.detail;
      this.fileList.splice(index, 1);
      this.picList.splice(index,1);
    },
     /**
     * @description:选择职责分工角色
     */
    showActionTab(params, flag) {
      this.activeActionTab = params;
      this.problemAreaShow = flag;
    },
     /**
     * @description:点击职责分工角色
     */
    chooseRole(i) {
      this.list[i].checked = !this.list[i].checked;
    },
    /**
     * @description:注册用户
     */
    save() {
      if (!this.getVerify()) {
        return;
      }
      if (!this.verifymobile1()) {
        return;
      }
      if (!this.getDivide()) {
        return;
      }
      this.errorMessage.mobile1 = "";
      this.selectDate.forEach((v) => {
        if (v.checked) {
          this.dutyIds.push(v.roleId);
        }
      });
      console.log( this.platformId,' this.platformId')
      const request = {
        name: this.name.detail,
        position: this.position.detail,
        mobile1: this.mobile1.detail,
        images:  this.picList.length>0?this.picList[0].url:"",
        wxUser: 1,
        platformId: this.platformId||"",
        dutyIds: this.dutyIds || [],
        agencyId:this.agencyId,
      };
      getRegister(request).then((res) => {
        if (res.data.code === 0) {
          uni.showToast({
            title: "注册成功",
            icon: "success",
            duration: 1000,
            complete: () => {
              setTimeout(() => {
                uni.navigateBack();
              }, 1000);
            },
          });
          wx.switchTab({
            url: "/pages/userInfo/userInfo",
            fail: (err) => {
              console.log(err);
            }
          });
        } else {
          uni.showToast({
            title: res.data.msg,
            icon: "none",
          });
        }
      });
    },
     /**
     * @description:姓名验证
     */
    getVerify() {
      if (!this.name.detail || !this.name) {
        this.errorMessage.name = "请输入姓名";
        return false;
      } else {
        this.errorMessage.name = "";
        return true;
      }
    },
     /**
     * @description:职责分工验证
     */
    getDivide() {
      if (this.selectDate.length == 0) {
          wx.showToast({
          title: "请选择职责分工",
          icon: "error",
        });
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  .page-header {
    height: 210rpx;
    box-shadow: 0px 4px 40px -10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    align-items: center;
    position: relative;
    width: 710rpx;
    margin-left: 20rpx;
    justify-content: center;
    .title {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      text-shadow: 0px 4px 24px rgba(100, 101, 102, 0.08);
      font-size: 40rpx;
    }
  }
  .picture {
    display: flex;
    justify-content: space-between;
    margin: 20rpx;
    box-shadow: 0px 4px 40px -10px rgba(0, 0, 0, 0.1);
    .pic-title {
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #323233;
      margin-left: 20rpx;
    }
    .pic-box {
      /deep/ .van-uploader__upload {
        background-color: #ffffff;
      }
    }
  }
  .menu {
    margin: 0 20rpx 20rpx 20rpx;
    box-shadow: 0px 4px 40px -10px rgba(0, 0, 0, 0.1);
    position: relative;
    .save-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      width: 640rpx;
      height: 88rpx;
      background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
      box-shadow: 0px 12rpx 24rpx 0px rgba(12, 126, 161, 0.35);
      border-radius: 150rpx;
      margin: 300rpx auto;
    }
    .card-line {
      padding: 20rpx 20rpx;
      .card-line-header {
        display: flex;
        .left {
          width: 600rpx;
        }
        .vertical-right {
          margin-left: auto;
        }
        .label {
          color: var(--field-label-color, #646566);
          font-size: 28rpx;
        }
        .right {
          word-wrap: break-word;
          word-break: normal;
          max-width: 445rpx;
          overflow-y: auto;
          max-height: 300rpx;
        }

        .icon {
          width: 40rpx;
          position: absolute;
          right: 0%;
        }
        // /deep/ .van-icon.van-icon-arrow {

        // }
      }
    }

    .flex-box {
      .second-box {
        display: flex;
        justify-content: center;
        line-height: 70rpx;
        text-align: center;
        background-color: #f6f5f8;
        color: #474747;
        font-size: 24rpx;
        margin: 15rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .activeBox {
        background-color: #e1f4ff;
        color: #0093fd;
        position: relative;
      }
      .activeBox::before {
        content: "";
        width: 0;
        height: 0;
        border-top: 40rpx solid #0093fd;
        border-left: 40rpx solid transparent;
        position: absolute;
        right: 0;
        top: 0;
      }
      .activeBox::after {
        content: "√";
        color: #fff;
        position: absolute;
        right: 0;
        top: -20%;
      }
    }
    // /deep/ van-cell{
    //   height: 114rpx;
    // }
  }
}
</style>