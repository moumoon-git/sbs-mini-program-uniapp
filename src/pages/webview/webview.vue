<template>
  <div class="content">
    <web-view :src="url" v-if="isComplete"></web-view>
  </div>
</template>
<script>
import request from '@/utils/request/request.js';
export default {
  data() {
    return {
      // "https://scg.zczhzl.cn/rpt/home.html?openId=oDSAU6o5YN-oDYXDwz0hvUZnPpmw&clientFlag=wechat"
      url: 'https://scg.zczhzl.cn/rpt/home.html?openId=',
      isComplete: false,
    };
  },
  onLoad() {
    this.getOpenId();
  },
  methods: {
    // 1. 获取openId
    getOpenId() {
      wx.login({
        success: async (res) => {
          if (res.code) {
            const res1 = await request.get({
              url: '/sys/getOpenId',
              data: {
                code: res.code,
              },
            });

            if (res1.data.code === 0) {
              this.url += res1.data.data.openid + '&clientFlag=wechat';

              this.isComplete = true;
            }
          }
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: 100vh;
}
</style>
