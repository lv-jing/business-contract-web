<!-- 进度管理 -->
<template>
  <component :is="choose" ref="declaration"></component>
</template>
<script>
/* eslint-disable */
import declarationList from "./list";
import add from "./addAndEdit";
import detail from "./detail";

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
        case "edit":
          this.choose = add;
          break;
          case "detail":
          this.choose = detail;
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
