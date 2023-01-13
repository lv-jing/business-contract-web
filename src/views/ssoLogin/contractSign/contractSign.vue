<template>
  <div class="terms">
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractNo">
              <el-input v-model="ruleForm.contractNo" placeholder="请输入合同编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="ruleForm.contractName" placeholder="请输入合同名称"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="合同状态" prop="statue">
              <el-select class="w-100" v-model="ruleForm.statue" placeholder="请输入创建人">
                <el-option key="1" value label="全部"></el-option>
                <el-option key="2" value="STA008,STA007" label="待签章"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批完成时间">
              <datePicker v-model="timeData"></datePicker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <div style="float:right;">
                <el-button type="primary" @click="formSearchMethod" icon="iconfont sbt_add">查询</el-button>
                <el-button
                  class="resetButton"
                  @click="formResetMethod('ruleForm')"
                  icon="iconfont sbt_add"
                >重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="bg-white user-form-table pd24">
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
        <el-table-column prop="contractNo" label="合同编号">
          <template slot-scope="scope">
             <el-link type="primary" @click="jumpDeatail(scope.row)">{{scope.row.contractNo}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="contractName" label="合同名称">
          <template slot-scope="scope">
            <el-link type="primary" @click="jumpDeatail(scope.row)">{{scope.row.contractName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="createdByName" label="经办人"></el-table-column>
        <el-table-column prop="entityName" label="对方签约主体"></el-table-column>
        <el-table-column prop="signWay" label="签署方式">
          <template slot-scope="scope">
            <!-- <span class="tableColQuery">{{scope.row.signWay}}</span> -->
            <DictCodeToDictName :parentCode="'SIGN_WAY'" :dictCode="scope.row.signWay"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="approvalTime" label="审批完成时间">
          <template slot-scope="scope">
            {{scope.row.approvalTime!=null?scope.row.approvalTime.substring(0,11):""}}
          </template>
        </el-table-column>
        <el-table-column prop="signTime" label="签署时间">
          <template slot-scope="scope">
            {{scope.row.signTime!=null?scope.row.signTime.substring(0,11):""}}
          </template>
        </el-table-column>
        <el-table-column label="合同状态">
          <template slot-scope="scope">
            <DictCodeToDictName
              :parentCode="'CONTRACT_STATUE'"
              :dictCode="scope.row.contractStatue"
            ></DictCodeToDictName>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="fillDate" label="操作">
          <template slot-scope="scope">
            <span
              class="tableCol"
              v-if="scope.row.signWay === 'SIW002' && (scope.row.contractStatue === 'STA008' || (scope.row.signOrder === 'SIO001' && scope.row.contractStatue === 'STA007')) && scope.row.statue === 'STA016'"
              @click="signContract(scope.row)"
            >签章</span>
          </template>
        </el-table-column> -->
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    </div>
  </div>
</template>
<script>
import {
  queryContractSign,
  queryCompanyStatus,
  getCompanyPage,
  signContractPage,
} from "@/service/sign/index";
export default {
  name: "",
  data() {
    return {
      tableData: [],
      ruleForm: {
        statue: "STA008,STA007",
      },
      rules: {},
      dialogVisible: false,
      choosedTree: [],
      show: false,
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      choosedTerms: [],
      timeData:{}
    };
  },
  created() {},
  mounted() {
    this.queryIsAcess();
  },
  methods: {
    async queryIsAcess() {
      let params = {
        entityName: this.$store.state.common.userInfo.userName,
      };
      const { code, data } = await queryCompanyStatus(params);
      if (code === "000000") {
        if (data != "PASSED") {
          this.showNotice();
        } else {
          this.formSearchMethod();
        }
      } else {
        this.$message({ type: "error", message: "查询资质认证失败" });
        return;
      }
    },
    showNotice() {
      let message = `您尚未进行电签资质认证，点击确定进行资质认证`;
      let boo = false;
      let userInfo = this.$store.state.common.userInfo;
      if (userInfo.userType === "VENDOR") {
        // 供应商
      } else {
        message = `您尚未进行电签资质认证，请在云商系统进行资质认证后再签署合同`;
        boo = true; // 为true处理云商
      }
      this.$alert(message, "系统提示", {
        confirmButtonText: "确定",
        showClose: false,
        callback: (action) => {
          if (boo) {
            // 云商
           var userAgent = navigator.userAgent;
              if (userAgent.indexOf("Firefox") !== -1 || userAgent.indexOf("Chrome") !== -1) {
                window.location.href = "about:blank";
                window.opener = null;
                window.open("", "_self");
                window.close();
              } else {
                window.opener = null;
                window.open("", "_self");
                window.close();
              }
          } else {
            this.$router.push({ name: "authCompany" });
          }
        },
      });
    },
    // 查询数据
    formSearchMethod() {
      this.ruleForm.approvalTimeFrom = this.timeData.startTime;
      this.ruleForm.approvalTimeTo = this.timeData.endTime;
      this.searchForm.currentPage = 1;
      let params = {
        ...this.searchForm,
        ...this.ruleForm,
      };
      this.queryContractSignPage(params);
    },
    formResetMethod() {
      this.ruleForm = {};
      this.formSearchMethod();
    },
    // 查询签署
    async queryContractSignPage(params) {
      let currentUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      params.entityId = currentUserInfo.userId;
      params.cooperationType = currentUserInfo.userType;
      const { code, data } = await queryContractSign(params);
      if (code && code === "000000") {
        this.tableData = data.records;
        this.searchForm.pageSize = data.size;
        this.searchForm.total = data.total;
        this.searchForm.currentPage = data.current;
      }
    },
    // 查看详情
    gotoDeatil(data) {
      // this.$router.push({name:'terms',query:{type:'detail',id:data.termsId}})
    },
    signContract(row) {
       // 判断合同状态，如果是作废中，不能继续
      if(row.contractStatue === 'STA011'){
        this.$message({
          type: "warning",
          message: "合同已发起作废流程，暂时无法操作！",
        });
        return
      }
      // 签证是否已通过资质认证
      let params = {
        ...row,
      };
      queryCompanyStatus(params).then((res) => {
        if (res.code === "000000") {
          if (res.data === "PASSED") {
            signContractPage(params).then((sign) => {
              if (sign.code === "000000") {
                // 打开签署页面
                window.open(sign.data);
              } else {
                this.$message({ type: "error", message: sign.data });
              }
            });
          } else {
            this.$alert(
              "您还没有进行资质认证，请资质认证后再进行合同签署",
              "提示",
              {
                confirmButtonText: "确定",
                callback: (action) => {
                  // 跳转资质认证页面
                },
              }
            );
          }
        } else {
          this.$message({ type: "error", message: res.data });
        }
      });
    },
    // 分页
    handlerCurrentPage(list) {
      let params = {
        ...list,
        ...this.ruleForm,
      };
      this.queryContractSignPage(params);
    },
    handleSelectionChange() {},
    jumpDeatail(item) {
      this.$router.push({
        name: "contractSign",
        query: {
          type: "confirmSign",
          contractId: item.contractId,
        },
      });
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
