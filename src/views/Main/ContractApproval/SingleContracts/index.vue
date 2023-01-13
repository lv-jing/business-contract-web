<!-- 进度管理 -->
<template>
  <div class="">
    <component :is="choose" ref="declaration"></component>
  </div>
</template>
<script>
/* eslint-disable */
import declarationList from "./list";
import addBatch from "./addBatch"
import approval from "./approval"
import detail from "./detail"
import view from "./view"

export default {
  data() {
    return {
      choose: declarationList
    };
  },
  watch: {
    $route(to, from) {
      const {type} = to.query;
      this.changeComponent(type);
    }
  },
  created() {
    const {type} = this.$route.query;
    this.changeComponent(type);
  },
  methods: {
    changeComponent(type) {
      switch (type) {
        case "add":
          this.choose = addBatch;
          break;
        case "approval":
          this.choose = approval;
          break;
        case "detail":
          this.choose = detail;
          break;
          break;
        case "view":
          this.choose = view;
          break;
        default:
          this.choose = declarationList;
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
