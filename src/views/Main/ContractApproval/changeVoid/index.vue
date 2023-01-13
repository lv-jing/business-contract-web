<!-- 进度管理 -->
<template>
  <div class="">
    <component :is="choose" ref="declaration"></component>
  </div>
</template>
<script>
/* eslint-disable */
import declarationAddAndEdit from "./addAndEdit";
import declarationDetail from "./detail";
import approval from "./approval"
import view from "./view"

export default {
  data() {
    return {
      choose: declarationAddAndEdit
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
          this.choose = declarationAddAndEdit;
          break;
        case "detail":
          this.choose = declarationDetail;
          break;
        case "approval":
          this.choose = approval;
          break;
          case "view":
          this.choose = view;
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
