<template>
  <van-uploader
    :file-list="fileList"
    :capture="capture"
    :max-count="maxCount"
    :multiple="multiple"
    @after-read="afterRead"
    upload-text="图片上传"
    @delete="deleteFile"
  />
</template>
<script>
import { defineComponent } from 'vue';
import config from '@/static/config/index.js';

export default defineComponent({
  name: 'upload',
  props: {
    fileList: {
      type: Array,
      default: () => [],
    },
    capture: {
      type: Array,
      default: () => ['camera'],
    },
    maxCount: {
      type: Number,
      default: 4,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    // 上传配置
    settings: {
      type: Object,
      default: () => ({
        url: `${config.baseUrl}/upload/passImgWithLogo`, // 上传地址
        // 上传参数
        params: {
          name: 'file', // formData的文件字段名
          address: '',
        },
      }),
    },
  },
  emits: ['successUpload', 'input'],
  setup(props, { emit }) {
    const uploadProcess = (url) => {
      return new Promise((resolve) => {
        wx.uploadFile({
          url: props.settings.url, // 仅为示例，非真实的接口地址
          // url: 'https://scg.chinaemt.com/ser/upload/passImg',
          filePath: url,
          name: props.settings.params.name,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            token: wx.getStorageSync('token'),
          },
          formData: {
            'content-type': 'multipart/form-data',
            charset: 'utf-8',
            [props.settings.params.name]: url,
            ...props.settings.params,
          },
          success: (res) => {
            let data = JSON.parse(res.data);
            console.log(
              '%c [ url ]',
              'font-size:13px; background:pink; color:#bf2c9f;',
              url
            );
            if (data.errorcode === 0) {
              resolve(true);
              console.log(
                '%c [ props.value ]',
                'font-size:13px; background:pink; color:#bf2c9f;',
                props.fileList
              );
              let obj = {};
              if (Array.isArray(data.data)) {
                obj = data.data[0];
              } else {
                obj = data.data;
              }

              emit('input', [
                ...props.fileList,
                {
                  id: obj.id,
                  name: obj.name,
                  backEndUrl: config.fileHost + obj.url,
                  url, // 用本地流协议的url快速回显
                },
              ]);
              // 父组件成功上传回调
              emit('successUpload');
            }
          },
          fail: (res) => {
            console.log('fail', res);
          },
          complete: (res) => {
            console.log('complete', res);
          },
        });
      });
    };

    const afterRead = async (event) => {
      console.log('afterRead', event);
      const { name, file } = event.detail;
      let upFiles = [];
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      if (file instanceof Array) {
        upFiles.push(...file);
      } else {
        upFiles.push(file);
      }
      for (let i = 0; i < upFiles.length; i++) {
        const flag = await uploadProcess(upFiles[i].url);
        if (!flag) break;
      }
    };

    const deleteFile = (event) => {
      const { index } = event.detail;
      const delFileArr = props.fileList;
      delFileArr.splice(index, 1);
      emit('input', [...delFileArr]);
    };

    return {
      afterRead,
      deleteFile,
    };
  },
});
</script>
<style lang="scss" scoped></style>
