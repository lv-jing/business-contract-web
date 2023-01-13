<!-- 进度管理 -->
<template>
  <component :is="choose" ref="declaration"></component>
</template>
<script>
/* eslint-disable */
import declarationList from "./list";
import recallAppDetail from "./recallAppDetail";
import recallAppApproval from "./recallAppApproval";
export default {
  data() {
    return {
      choose: declarationList,
    };
  },
  watch: {
    $route(to, from) {
      const { type } = to.query;
      this.changeComponent(type);
    },
  },
  created() {
    const { type } = this.$route.query;
    this.changeComponent(type);
  },
  methods: {
    changeComponent(type) {
      switch (type) {
        case "auditing":
          this.choose = recallAppDetail;
          break;
        case "approval":
        case "detail":
          this.choose = recallAppApproval;
          break;
        default:
          this.choose = declarationList;
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>
