<!-- 条款管理 -->
<template>
  <div>
    <component :is="choose" ref="declaration"></component>
  </div>
</template>
<script>
/* eslint-disable */
import template from "./template";
import addTemplate from "./addTemplate";
import templateDetail from "./templateDetail";
import templateApproval from "./templateApproval";
import optimization from "./templateOptimiza";

export default {
  name: "apply",
  data() {
    return {
      choose: template,
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
        case "add":
          this.choose = addTemplate;
          break;
        case "detail":
          this.choose = templateDetail;
          break;
        case "approval":
          this.choose = templateApproval;
          break;
        case "optimization":
          this.choose = optimization;
          break;
        default:
          this.choose = template;
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>