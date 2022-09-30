<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-01 15:23:42
 * @LastEditTime: 2022-06-21 10:13:01
-->
<template>
  <view class="files-upload">
    <view class="card before-change">
      <view class="card-upload">
        <view class="title">{{ beforeTitle }}</view>
        <view class="pic-box">
          <van-uploader
            :file-list="dataFormMap[showIndex].tempBeforeAttachment"
            @after-read="afterRead($event, 0)"
            upload-text="上传图片"
            @delete="deleteFile($event, 0)"
            :disabled="mode === 'complete' || mode === 'modify'"
            :deletable="mode === 'complete' || mode === 'modify' ? false : true"
            :max-count="9"
            multiple
          />
        </view>
      </view>
    </view>
    <view class="card changes-in">
      <view class="card-upload">
        <view class="title">{{ changesInTitle }}</view>
        <view class="pic-box">
          <van-uploader
            :file-list="dataFormMap[showIndex].tempMiddleAttachment"
            @after-read="afterRead($event, 1)"
            upload-text="上传图片"
            @delete="deleteFile($event, 1)"
            :disabled="mode === 'complete' || mode === 'modify'"
            :deletable="mode === 'complete' || mode === 'modify' ? false : true"
            :max-count="9"
            multiple
          />
        </view>
      </view>
    </view>
    <view class="card changes-after">
      <view class="card-upload">
        <view class="title">{{ changesAfteTitle }}</view>
        <view class="pic-box">
          <van-uploader
            :file-list="dataFormMap[showIndex].tempAfterAttachment"
            @after-read="afterRead($event, 2)"
            upload-text="上传图片"
            @delete="deleteFile($event, 2)"
            :disabled="mode === 'complete' || mode === 'modify'"
            :deletable="mode === 'complete' || mode === 'modify' ? false : true"
            :max-count="9"
            multiple
          />
        </view>
      </view>
    </view>
    <view class="card changes-after" v-if="showIndex !== 'UTDOOR_ADVERTISING'">
      <view class="card-upload">
        <view class="title">{{ uploadDocumentsTitle }}</view>
        <view class="pic-box">
          <van-uploader
            :file-list="dataFormMap[showIndex].tempPaperworkAttachment"
            @after-read="afterRead($event, 3)"
            :disabled="mode === 'complete' || mode === 'modify'"
            upload-text="文书上传"
            @delete="deleteFile($event, 3)"
            :deletable="mode === 'complete' || mode === 'modify' ? false : true"
            :max-count="9"
            multiple
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import config from "@/static/config/index.js";
import { ref, defineComponent, reactive, watch } from "vue";
import useInit from "../../useHooks/useInit";
export default defineComponent({
  props: {
    mode: {
      type: String,
      default: "",
    },
    placeData: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const { 
      dataFormMap,
      showIndex,
    } = useInit();
    const beforeTitle = ref("整改前照片");
    const changesInTitle = ref("整改中照片");
    const changesAfteTitle = ref("整改后照片");
    const uploadDocumentsTitle = ref("文书上传");
    function uploadProcess(url, params) {
      getTempFile(url, params)
      return new Promise((resolve) => {
        wx.uploadFile({
          url:
            config.baseUrl +
            (params === 3 ? `/upload/passImg` : `/upload/passImgWithLogo`), // 仅为示例，非真实的接口地址
          filePath: url,
          name: "file",
          header: {
            "content-type": "application/x-www-form-urlencoded",
            token: wx.getStorageSync("token"),
          },
          formData: {
            "content-type": "multipart/form-data",
            charset: "utf-8",
            file: url,
            address: dataFormMap[showIndex.value].place,
          },
          success: (res) => {
            console.log(res, "success");
            let data = JSON.parse(res.data);
            if (data.code === 0) {
              const obj = transformUrl(data.data);
              console.log(data.data,'返回的结果')
              let tempObj={
                name: obj.name,
                url: obj.fileUrl,
              };
              if (params === 0) {
                dataFormMap[showIndex.value].beforeAttachment.push(tempObj);
                console.log(dataFormMap[showIndex.value].beforeAttachment,'dataFormMap[showIndex.value].beforeAttachment')
              } else if (params === 1) {
                dataFormMap[showIndex.value].middleAttachment.push(tempObj);
              } else if (params === 2) {
                dataFormMap[showIndex.value].afterAttachment.push(tempObj);
              } else {
                dataFormMap[showIndex.value].paperworkAttachment.push(tempObj);
              }
              dataFormMap[showIndex.value].attachments.push(tempObj);
              resolve(true)
            }else{
              wx.showToast({
                title:data.msg ,
                icon: 'error'
              });
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
    }

    async function afterRead(event, params) {
      console.log("afterRead", event);
      const { name, file } = event.detail;
      let upFiles = [];
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      if (file instanceof Array) {
        upFiles.push(...file);
      } else {
        upFiles.push(file);
      }
      for (let i = 0; i < upFiles.length; i++) {
        console.log(upFiles[i].url,'upFiles[i].url')
        const flag = await uploadProcess(upFiles[i].url, params);
        console.log(flag, "flag");
        if (!flag) break;
      }
    }

    function transformUrl(data) {
      const fileUrl = data.url.replace(/\\/g, "/");
      //后台返回的地址有 \ 需要替换/ 不然渲染不出来 到时候回显同样需要这样做
      return {
        name: data.name,
        fileUrl:fileUrl,
        url: data.url,
      };
    }
        /**
     * @description:给对应类型添加临时文件流
     */
    function getTempFile(url,params){
      if(params===0){
        dataFormMap[showIndex.value].tempBeforeAttachment.push({name:'',url:url})
      }
      else if(params === 1){
        dataFormMap[showIndex.value].tempMiddleAttachment.push({name:'',url:url})
      }else if(params === 2){
        dataFormMap[showIndex.value].tempAfterAttachment.push({name:'',url:url})
      }else{
        dataFormMap[showIndex.value].tempPaperworkAttachment.push({name:'',url:url})
      }
      console.log(dataFormMap[showIndex.value].tempMiddleAttachment,'0000')
    }
    function deleteFile(event, params) {
      console.log("onDelete", event);
      const { index } = event.detail;
      const id = event.detail.file.id;
      let spliceIndex = dataFormMap[showIndex.value].attachments.findIndex((v) => {
        return v.id === id;
      });
      dataFormMap[showIndex.value].attachments.splice(spliceIndex, 1);
      if (params === 0) {
        dataFormMap[showIndex.value].beforeAttachment.splice(index, 1);
        dataFormMap[showIndex.value].tempBeforeAttachment.splice(index, 1);
        console.log(dataFormMap[showIndex.value].beforeAttachment, "dataFormMap.attachments");
      } else if (params === 1) {
        dataFormMap[showIndex.value].middleAttachment.splice(index, 1);
        dataFormMap[showIndex.value].tempMiddleAttachment.splice(index, 1);
      } else if (params === 2) {
        dataFormMap[showIndex.value].afterAttachment.splice(index, 1);
        dataFormMap[showIndex.value].tempAfterAttachment.splice(index, 1);
      } else {
        dataFormMap[showIndex.value].paperworkAttachment.splice(index, 1);
        dataFormMap[showIndex.value].tempPaperworkAttachment.splice(index, 1);
      }
    }

    return {
      dataFormMap,
      afterRead,
      transformUrl,
      deleteFile,
      beforeTitle,
      changesInTitle,
      uploadDocumentsTitle,
      changesAfteTitle,
      showIndex,
    };
  },
});
</script>
<style lang="less" scoped>
.files-upload {
  background-color: #f5f5f5;
  .card {
    margin: 20rpx auto;
    background-color: #fff;
  }
  .before-change {
    .card-upload {
      .title {
        padding: 20rpx 0 20rpx 23rpx;
        line-height: 40rpx;
      }
      .pic-box {
        padding-left: 23rpx;
      }
    }
  }
}
</style>
