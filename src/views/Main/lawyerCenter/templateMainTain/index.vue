<!-- 范本维护 -->
<template>
  <div>
    <component :is="choose" ref="declaration"></component>
  </div>
</template>
<script>
/* eslint-disable */
import mainTainTemplate from "./mainTainTemplate";
import queryTemplate from "./queryTemplate";
import detail from "./templateDetail";
import optimalize from "./optimalizeTemplate";
export default {
  name: "apply",
  data() {
    return {
      choose: queryTemplate,
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
        default:
          this.choose = queryTemplate;
          break;
        case "add":
          this.choose = mainTainTemplate;
          break;
        case "detail":
          this.choose = detail;
          break;
        case "optimalize":
          this.choose = optimalize;
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>