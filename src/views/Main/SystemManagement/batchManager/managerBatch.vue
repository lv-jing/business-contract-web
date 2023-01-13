<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="12">*该页面用于管理批量范本的导入excel表格</el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <CommonTreeSelect
          :disabled="$route.query.typeName==='templates'"
          :treeSelect="treeSelect"
          :dict-code="dictCode"
        />
      </el-col>
      <el-col :span="12">
        <common-upload v-on:get-file-list="getFileListTree" title />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-button style="margin-top:10px;" type="primary" @click="uploadBatch">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import CommonUpload from "@/components/CommonUpload";
import { batchAndContractType } from "@/service/template/index";
export default {
  components: {
    CommonUpload,
  },
  data() {
    return {
      contractTypeCode: "",
      contractTypeName: "", //三级合同类型名称
      dictCode: "INCOME_EXPE_TYPE",
      fileData: [],
    };
  },
  methods: {
    treeSelect(node) {
      this.contractTypeCode = node.dictCode;
      this.contractTypeName = node.dictName;
      console.log(this.contractType, "----1");
    },
    getFileListTree(Filelist) {
      this.fileData = Filelist;
      console.log(Filelist, "---0---");
    },
    async uploadBatch() {
      if (!this.contractTypeCode) {
        this.$message({ type: "error", message: "请选择合同类型！" });
        return;
      }
      if (this.fileData.length!=1) {
        this.$message({ type: "error", message: "请上传附件且选择一个！" });
        return;
      }
      let params = {
        contractType: this.contractTypeCode,
        contractName: this.contractTypeName,
        excelId: this.fileData[0].fileId,
        excelName: this.fileData[0].fileName,
        excelType: this.fileData[0].fileType,
        excelFileurl: this.fileData[0].fileUrl,
      };
      const { code, data } = await batchAndContractType(params);
      if(code==='000000'){
          this.$message({type:"success",message:'关联成功！'})
      }
    },
  },
};
</script>
<style lang="less">
</style>