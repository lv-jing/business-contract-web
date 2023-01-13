<template>
  <div class="terms">
    <div class="bg-white mb24 pd24">
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        ref="ruleForm"
        :class="show?'over-vis':'over-hid'"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="条款名称" prop="termsName">
              <el-input v-model="ruleForm.termsName" placeholder="请输入条款名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人" prop="createdBy">
              <!-- <el-input v-model="ruleForm.createdBy" placeholder="请输入创建人"></el-input> -->
              <commonSerachPerson orgCode @person="personData" ref="child"></commonSerachPerson>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="formSearchMethod" icon="iconfont sbt_add">查询</el-button>
              <el-button
                class="resetButton"
                @click="formResetMethod('ruleForm')"
                icon="iconfont sbt_add"
              >重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="bg-white user-form-table pd24">
      <el-button type="primary" @click="addTerm">新增</el-button>
      <el-table
        class="mt10 md20"
        :data="tableData"
        stripe
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#f3f3f3'}"
        size="small"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="termsNo" label="条款编号"></el-table-column>
        <el-table-column prop="termsName" label="条款名称"></el-table-column>
        <el-table-column prop="createdByName" label="创建人"></el-table-column>
        <el-table-column label="使用本条款的范本">
          <template slot-scope="scope">
            <span class="tableColQuery" @click="chooseTemplate(scope.row)">详情</span>
          </template>
        </el-table-column>
        <el-table-column prop="fillDate" label="操作">
          <template slot-scope="scope">
            <span class="tableColQuery" @click="gotoDeatil(scope.row)">查看条款</span>
            <!-- <span class="tableCol" @click="addToTempate(scope.row)">添加至范本</span> -->
            <span class="tableCol" @click="deleteTerm(scope.row)">废止</span>
          </template>
        </el-table-column>
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    </div>
    <el-dialog title="范本" :visible.sync="isShowTemplate">
      <el-table :data="templateData">
        <el-table-column property="attribute2" label="范本名称"></el-table-column>
        <el-table-column property="attribute1" label="范本编号"></el-table-column>
        <el-table-column property="attribute6" label="版本号">
            <template slot-scope="scope">
                V{{scope.row.attribute6}}.0
            </template>
        </el-table-column>
      </el-table>
      <common-pagination
        v-on:handler-currentPage="templateHandlerCurrentPage"
        :list="searchTemplateForm"
      ></common-pagination>
    </el-dialog>
  </div>
</template>
<script>
import { getTermsByPage, getTemplateWithTerms } from "@/service/terms/index";
export default {
  name: "",
  data() {
    return {
      input1: "",
      tableData: [],
      ruleForm: {
        currentPage: 1,
        pageSize: 10,
      },
      rules: {},
      value: "",
      choosedTree: [],
      show: false,

      searchForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      searchTemplateForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      choosedTerms: [],
      isShowTemplate: false,
      templateData: [],
      clckedTemplate:{}
    };
  },
  created() {},
  mounted() {
    this.formSearchMethod();
  },
  methods: {
    addTerm() {
      this.$router.push({ name: "terms", query: { type: "add" } });
    },
    // 条款废止
    deleteTerm(data) {
      this.$router.push({
        name: "terms",
        query: { type: "delete", id: data.termsId },
      });
    },
    // 查询数据
    formSearchMethod() {
      this.getTerms(this.ruleForm);
    },
    // 重置
    formResetMethod() {
      this.ruleForm = {};
      this.$refs.child.reSetData();
      this.formSearchMethod();
    },
    // 勾选框勾选数据
    handleSelectionChange(val) {
      this.choosedTerms = val;
    },
    // 查询条款数据
    async getTerms(params) {
      const { code, data } = await getTermsByPage(params);
      if (code && code === "000000") {
        this.tableData = data.records;
        console.log(data);
        this.searchForm.pageSize = 10;
        this.searchForm.total = data.total;
      }
    },
    // 查看当前条款的范本
    async chooseTemplate(obj) {
        this.clckedTemplate = obj
      let params = {
        termsId: obj.termsId,
        currentPage:this.searchTemplateForm.currentPage,
        pageSize:this.searchTemplateForm.pageSize
      };
      this.templateData = [];
      const { code, data } = await getTemplateWithTerms(params);
      if (code === "000000") {
        if (data && data.records && data.records.length > 0) {
          this.templateData = data.records;
          this.isShowTemplate = true;
          this.searchTemplateForm.pageSize = 10;
          this.searchTemplateForm.total = data.total
        } else {
          this.$message({ type: "info", message: "该条款暂未关联范本！" });
        }
      }
    },
    // 添加至范本
    addToTempate(data) {},
    // 查看适用本条款的范本详情
    gotoDeatil(data) {
      this.$router.push({
        name: "terms",
        query: { type: "detail", termId: data.termsId },
      });
    },
    // 分页
    handlerCurrentPage(params) {
      this.ruleForm.currentPage = params.currentPage;
      this.ruleForm.pageSize = params.pageSize;
      this.formSearchMethod();
    },
    templateHandlerCurrentPage() {
      this.searchTemplateForm.currentPage = params.currentPage;
      this.searchTemplateForm.pageSize = params.pageSize;
      this.chooseTemplate(this.clckedTemplate)
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    // 父组件回传数据回来
    personData(personId) {
      this.ruleForm.createdBy = personId;
    },
  },
};
</script>
<style lang="less" scoped>
.terms {
  .resetButton {
    border: 1px solid #bbbfc4;
  }
  .tableColQuery {
    color: #2393f7;
    cursor: pointer;
  }
  .tableCol {
    color: #2393f7;
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
