<!-- 进度管理 -->
<template>
    <component :is="choose" ref="declaration"></component>
</template>
<script>
/* eslint-disable */
import declarationList from "./list";
import declarationAddAndEdit from "./addAndEdit";
import declarationDetail from "./detail";
import approval from "./approval"
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
          this.choose = declarationAddAndEdit;
          break;
        case "edit":
          this.choose = declarationAddAndEdit;
          break;
        case "detail":
          this.choose = declarationDetail;
          break;
          case "view":
          case "assist":
          this.choose = view;
          break;
        case "approval":
          this.choose = approval;
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
