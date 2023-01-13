<!-- 进度管理 -->
<template>
  <component :is="choose" ref="declaration"></component>
</template>
<script>
/* eslint-disable */
import declarationList from "./list";
import declarationAddAndEdit from "./addAndEdit";
import underlineSealApproval from "./underlineSealApproval";
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
        case "detail":
          this.choose = declarationAddAndEdit;
          break;
        case "approval":
        case "underLineDetail":
          this.choose = underlineSealApproval;
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
