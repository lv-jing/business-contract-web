<!-- 条款管理 -->
<template>
  <div>
    <component :is="choose" ref="declaration"></component>
  </div>
</template>
<script>
/* eslint-disable */
import queryTemplate from "./querytemplate";


export default {
  name: "apply",
  data() {
    return {
      choose: queryTemplate
    };
  },
  watch: {
    $route(to, from) {
      const { type } = to.query;
      this.changeComponent(type);
    }
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
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>