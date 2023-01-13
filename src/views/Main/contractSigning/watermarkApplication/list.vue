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
      <el-button type="primary" @click="noWaterApply" icon="iconfont sbt_add">无水印申请</el-button>
      <CommonSignTabe ref="commonSignTable" @getData="getDataFromTable" :queryData="queryTableData"></CommonSignTabe>
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
        statue: "STA006,STA007,STA005",
        watermark: "N",
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
      timeData: {},
      pageType: "NO_WATER_APPLICATION",
      choosedTableData: [],
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
    noWaterApply() {
      if (this.choosedTableData && this.choosedTableData.length === 1) {
        this.$router.push({
          name: "watermarkapplication",
          query: {
            type: "auditing",
            contractId: this.choosedTableData[0].contractId,
            signType: "start",
          },
        });
      } else {
        this.$message({ type: "error", message: "请勾选一条" });
      }
    },
    /**
     * 查询
     */
    formSearchMethod() {
      this.ruleForm.approvalTimeFrom = this.timeData.startTime;
      this.ruleForm.approvalTimeTo = this.timeData.endTime;

      this.queryContract();
    },
    /**
     * 重置
     */
    formResetMethod() {
      this.timeData = {
        startTime: "",
        endTime: "",
      };
      this.ruleForm = {};
      this.ruleForm = {
        statue: "STA006,STA007,STA005",
        watermark: "N",
      };
      this.ruleForm.approvalTimeFrom = "";
      this.ruleForm.approvalTimeTo = "";
      this;
      this.queryTableData = {
        type: this.pageType,
        data: this.ruleForm,
      };
      setTimeout(() => {
        this.$refs.datePicker.reset();
        this.queryContract();
      }, 700);
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
    getDate(params) {
      alert(JSON.stringify(params));
    },
    getDataFromTable(params) {
      this.choosedTableData = [];
      if (params.length > 1 || params.length === 0) {
        this.$message({ type: "error", message: "必须勾选且只能选一条！" });
      } else {
        this.choosedTableData.push(params[0]);
      }
    },
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

