<template>
  <div>
    <div class="bg-white mb24 pd24">
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        ref="ruleForm"
        :class="show?'over-vis':'over-hid'"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="合同名称编号" prop="contractName">
              <el-input v-model="ruleForm.contractName" placeholder="请输入合同名称编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="我方签约主体" prop="ourSide">
              <el-input v-model="ruleForm.ourSide" placeholder="请输入我方签约主体"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对方签约主体" prop="otherSide">
              <el-input v-model="ruleForm.otherSide" placeholder="请输入对方签约主体"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批完成时间">
              <datePicker ref="datePicker" v-model="timeData"></datePicker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-box tr">
        <el-button type="primary" @click="formSearchMethod" icon="iconfont sbt_add">查询</el-button>
        <el-button @click="formResetMethod()" icon="iconfont sbt_add">重置</el-button>
      </div>
    </div>
    <div class="bg-white user-form-table pd24">
      <CommonSignTabe ref="commonSignTable" :queryData="queryTableData"></CommonSignTabe>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { searchFormRule } from "./rules";

export default {
  data() {
    return {
      show: false,
      overHeight: "150px",
      ruleForm: {
        statue: "STA006,STA007,STA008,STA009,STA015",
        contractName: "",
        ourSide: "",
        otherSide: ""
      },
      rules: {},
      deletUrl: "",
      tableData: [],
      searchFormModel: {},
      searchFormRule: searchFormRule,
      searchOption: {
        resetBtn: false,
        submitBtn: false,
        form: {
          size: "small",
        },
      },
      queryTableData: {},
      timeData:{},
      pageType:'PRINT_APPLICATION'
    };
  },
  mounted() {
    this.queryTableData = {
      type: this.pageType,
      data: this.ruleForm,
    };
  },

  methods: {
    /**
     * 新增按钮事件
     */
    addDeclaration() {
      this.$router.push({ name: "drafts", query: { type: "add" } });
    },
    /**
     * 查询
     */
    formSearchMethod() {
        this.ruleForm.approvalTimeFrom = this.timeData.startTime
        this.ruleForm.approvalTimeTo = this.timeData.endTime

      this.queryContract();
    },
    /**
     * 重置
     */
    formResetMethod() {
       this.$refs.ruleForm.resetFields()
      this.timeData={
        startTime:'',
        endTime:''
      }
      this.$refs.datePicker.reset();
      this.ruleForm.approvalTimeFrom = ''
      this.ruleForm.approvalTimeTo =''
      this.$refs.datePicker.reset();
      this.queryTableData = {
        type: this.pageType,
        data: this.ruleForm,
      }
    },
    /**
     * 分页查询
     */
    async queryContract() {
      this.queryTableData = {
        type: this.pageType,
        data: this.ruleForm,
      };
      this.$refs.commonSignTable.getData();
    },
    getDate(params){
        alert(JSON.stringify(params))
    }
  },
};
</script>

<style lang="less" scoped>
.over-hid {
  height: 150px;
  overflow: hidden;
}
.over-vis {
  height: auto;
  overflow: visible;
}
.button-center {
  text-align: center;
  span {
    font-size: 14px;
    color: #2393f7;
  }
}
</style>

