<template>
  <view class="problem-type">
    <SecondBox :list="problemType" :checkId="checkId" @selectId="selectId" />
  </view>
</template>

<script>
import SecondBox from './SecondBox.vue';
export default {
  components: {
    SecondBox,
  },
  props: {
    problemType: {
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
      this.$emit('selectTypeData', data);
    },
  },
};
</script>

<style lang="less"></style>
