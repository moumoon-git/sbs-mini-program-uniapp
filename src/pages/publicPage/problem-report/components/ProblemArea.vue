<template>
  <view class="problem-area">
    <van-tabs color="#3F8EF7" ref="vanTabs" v-if="problemAreaTree.length">
      <van-tab
        v-for="(item, index) in problemAreaTree"
        :key="item.id"
        :title="item.name"
        :name="item.id"
      >
        <SecondBox
          :list="item.children"
          :checkId="checkId"
          @selectId="selectId"
        />
      </van-tab>
    </van-tabs>
  </view>
</template>

<script>
import SecondBox from './SecondBox.vue';
export default {
  components: {
    SecondBox,
  },
  props: {
    problemAreaTree: {
      type: Array,
    },
  },
  data() {
    return {
      checkId: -1,
    };
  },

  methods: {
    selectId(data) {
      this.checkId = data.id;
      this.$emit('selectGroupData', data);
    },
    resize() {
      // 要用定时器 宏任务才可以获取到tab的选择器
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.vanTabs.resize();
        });
      }, 50);
    },
  },
};
</script>

<style lang="less"></style>
