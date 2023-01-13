<!-- 进度管理 -->
<template>
  <div class="">
    <component :is="choose" ref="declaration"></component>
  </div>
</template>
<script>
/* eslint-disable */
import confirmSign from "./confirmSign";
import contractSign from "./contractSign";

export default {
  data() {
    return {
      choose: contractSign
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
        case "confirmSign":
          this.choose = confirmSign;
          break;
        // case "detail":
        //   this.choose = declarationDetail;
        //   break;
        // case "approval":
        //   this.choose = approval;
        //   break;
        // case "view":
        //   this.choose = view;
        //   break;
          default:
            this.choose = contractSign;
            break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
