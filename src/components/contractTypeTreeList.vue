<template>
  <div>
    <el-dialog title="合同类型" @close="closeTree" :visible.sync="isShowDialog" width="30%">
      <el-tree
        v-loading="isgetDataTree"
        :data="dataTree"
        ref="tree"
        :props="props"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-dialog>
  </div>
</template>
<script>
import { getContractTreeList } from "@/service/template/index";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      isgetDataTree: false,
      dataTree: [],
      props: {
        children: "dictVoList",
        label: "dictName",
      },
      parentNodedData: [], //一级和二级和三级的合同类型
      isShowDialog: false,
      templateTypeForm: {},
    };
  },
  watch: {
    dialogVisible(newValue, oldValue) {
      this.isShowDialog = newValue;
      if (this.isShowDialog) {
        this.getContractType();
      }
    },
  },
  mounted() {},
  methods: {
    // 树形选择
    handleNodeClick(data, node) {
      // 只能选择三级节点
      if (data.dictVoList === null) {
        // 使用递归查询出二级以及一级的合同类型
        this.getParentNodeData(node);

        // 取0个数据(二级)和第一个数据（一级），
        if (this.parentNodedData.length > 0) {
          this.templateTypeForm.contractFirstType = this.parentNodedData[1].dictName;
          this.templateTypeForm.contractFirstTypeCode = this.parentNodedData[1].dictCode;

          this.templateTypeForm.contractSecondType = this.parentNodedData[0].dictName;
          this.templateTypeForm.contractSecondTypeCode = this.parentNodedData[0].dictCode;
        }
        this.templateTypeForm.contractTypeName =
          this.parentNodedData[1].dictName +
          "-" +
          this.parentNodedData[0].dictName +
          "-" +
          data.dictName;
        this.templateTypeForm.contractType = data.dictCode;
        console.log(data, "0000");

        this.isShowDialog = false;
        this.$emit("returnData", this.templateTypeForm);
      }
    },
    getParentNodeData(node) {
      for (let key in node) {
        if (key == "parent") {
          if (node[key] && node[key].data) {
            this.parentNodedData.push(node[key].data);
            this.getParentNodeData(node[key]);
          }
        }
      }
    },
    // 条款类型树形结构展示
    async getContractType() {
      this.isShowDialog = true;
      if (this.dataTree.length > 0) {
        return;
      }
      this.isgetDataTree = true;
      let dictCode = {
        dictCode: "INCOME_EXPE_TYPE",
        attribute1: "4",
      };
      const { code, data } = await getContractTreeList(dictCode);
      if (code === "000000") {
        console.log(data);
        this.dataTree = data;
        this.isgetDataTree = false;
      } else {
        this.isgetDataTree = false;
      }
    },
    // 关闭树形结构
    closeTree() {
      this.$emit("returnData", this.templateTypeForm);
    },
  },
};
</script>
<style lang="less">
</style>