<template>
  <span class="commonSignButton">
    <el-button class="button" type="primary" @click="deal()" icon="iconfont sbt_add">更改用印信息</el-button>
  </span>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    deal() {
      if (
        this.params.statue !== "STA006" &&
        this.params.statue !== "STA007" &&
        this.params.statue !== "STA008" &&
        this.params.statue !== "STA009"
      ) {
        this.$message({
          type: "error",
          message: "不满足合同更改用印信息条件！",
        });
        return;
      }
      this.$emit("callBackDeal", "changeSign");
    },
  }
};
</script>
<style lang="less" scoped>
.commonSignButton {
  margin-left: 10px;
  margin-right: 10px;
}
</style>