<!-- 条款管理 -->
<template>
  <div>
    <component :is="choose" ref="declaration"></component>
  </div>
</template>
<script>
/* eslint-disable */
import terms from "./terms";
import addTerm from "./termAdd";
import deleteTerm from './termDelete'
import detailTerm from './termDetails'
import updateTerm from './termUpdate'
import termApproval from './termsApproval'
import approvalUpdate from './termsUpdateApproval'
import updateDetail from './termsUpdateDetail'
export default {
  name: "apply",
  data() {
    return {
      choose: terms
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
        case "add":
            this.choose = addTerm;
            break;
        case "delete":
            this.choose = deleteTerm;
            break;
        case "detail":
            this.choose = detailTerm
            break
        case "update":
            this.choose = updateTerm
            break
        case "approval":
            this.choose = termApproval
            break
        case "approvalUpdate":
          this.choose = approvalUpdate
          break
        case "updateDetail":
          this.choose = updateDetail
          break
        default:
          this.choose = terms;
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>