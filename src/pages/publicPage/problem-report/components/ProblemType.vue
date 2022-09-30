<template>
  <view class="problem-type">
    <div class="tab-list-wrap">
      <div
        :class="{ tab: true, 'tab-active': activeId === item.id }"
        v-for="(item, index) in tabMenu"
        :key="item.id"
        @click="changeTab(item, index)"
      >
        {{ item.name }}
      </div>
    </div>
    <SecondBox
      :list="tabMenu[activeIndex].children"
      :checkId="checkId"
      @selectId="selectId"
      :isProblemType="true"
    />
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
      activeId: -1,
      activeIndex: 0,
    };
  },
  computed: {
    tabMenu() {
      return this.problemType;
    },
  },
  methods: {
    // tab切换
    changeTab(item, index) {
      this.activeId = item.id;
      this.activeIndex = index;
      // 注意指针的偏移量
      this.tabMenu.splice(this.activeIndex + 1);
    },
    selectId(data) {
      if (data.children) {
        this.tabMenu[this.activeIndex + 1] = data;
        this.changeTab(data, this.activeIndex + 1);
      } else {
        this.checkId = data.id;
        this.$emit('selectTypeData', data);
      }
    },
  },
};
</script>

<style lang="less">
.problem-type {
  .tab-list-wrap {
    width: 100%;
    overflow-x: auto;
    display: flex;
    margin-bottom: 20rpx;
    .tab {
      text-align: center;
      font-size: var(--tab-font-size, 14px);
      line-height: var(--tabs-line-height, 44px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--tab-active-text-color, #323233);
      padding: 0 20rpx;
      margin: 0 20rpx;
    }
    .tab-active {
      border-bottom: 3px solid #3f8ef7;
    }
  }
}
</style>
