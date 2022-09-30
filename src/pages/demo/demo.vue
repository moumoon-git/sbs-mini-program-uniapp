<template lang="">
  <div>
    <upload
      v-model="fileList"
      :fileList="fileList"
      :settings="settings"
    ></upload>
    <button @click="clickHandler">查看</button>
  </div>
</template>
<script>
import upload from '@/components/upload/upload.vue';
import config from '@/static/config/index.js';
export default {
  components: {
    upload,
  },
  data: () => {
    return {
      fileList: [
        {
          name: '123',
          url:
            'https://sioc.chinaemt.com/fastdfs/group1/M00/00/15/rBI6m2J4ug2AUk3gAAYkq6WfrHI414.png',
        },
      ],
      settings: {
        url: `${config.baseUrl}/upload/passImgWithLogo`,
        params: {
          name: 'file',
          address: '1234',
        },
      },
    };
  },
  methods: {
    clickHandler() {
      console.log(this.fileList);
    },
  },
};
</script>
<style lang=""></style>
