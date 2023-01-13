<!-- 小工具-预警 -->
<template>
  <div>
    <component :is="choose" ref="declaration"></component>
  </div>
</template>
<script>
/* eslint-disable */
import list from "./list";
import add from "./addAadEdit";
import approval from "./approval";
import detail from "./detail";

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
        case "edit":
          this.choose = add;
          break;
        case "approval":
          this.choose = approval;
          break;
          case "detail":
          this.choose = detail;
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
