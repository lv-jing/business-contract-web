<!-- 进度管理 -->
<template>
  <component :is="choose" ref="declaration"></component>
</template>
<script>
/* eslint-disable */
import list from "./list";
import add from "./addBatch";
import view from "./view";

export default {
  data() {
    return {
      choose: list
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
          this.choose = add;
          break;
          case "view":
          case "addUpload":
          this.choose = view;
          break;
        default:
          this.choose = list;
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
