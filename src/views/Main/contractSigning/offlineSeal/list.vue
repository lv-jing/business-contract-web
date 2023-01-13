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
        <el-button @click="formResetMethod" icon="iconfont sbt_add">重置</el-button>
      </div>
    </div>
    <div class="bg-white user-form-table pd24">
      <el-button type="primary" @click="underlineStamp" icon="iconfont sbt_add">线下用印补盖</el-button>
      <CommonSignTabe ref="commonSignTable" @getData="getDataFromTable" :queryData="queryTableData"></CommonSignTabe>
    </div>
    <!--线下用印补盖-->
    <el-dialog title="线下用印补盖" :visible.sync="dialogVisible" width="60%">
      <common-title title="合同简要信息" />
      <el-form label-width="100px" :model="ruleForm1" :rules="rules1" ref="ruleForm1">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractNo">
              <el-input v-model="ruleForm1.contractNo" disabled placeholder="请输入合同编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="ruleForm1.contractName" disabled placeholder="请输入合同名称"></el-input>
            </el-form-item>
          </el-col>
          </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="合同描述" prop="contractDesc">
              <el-input v-model="ruleForm1.contractDesc" disabled placeholder="请输入合同描述"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同类型" prop="contractTypeCode">
              <!-- <el-input v-model="ruleForm1.contractName" disabled placeholder="请输入合同类型"></el-input> -->
              <DictCodeToDictName
                :parentCode="'INCOME_EXPE_TYPE'"
                :dictCode="ruleForm1.contractTypeCode"
              ></DictCodeToDictName>
            </el-form-item>
          </el-col>
          </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="签订方式" prop="signWay">
              <common-select
                disabled
                v-model="ruleForm1.signWay"
                dictCode="SIGN_WAY"
                :value="ruleForm1.signWay"
                placeholder="请选择签订方式"
                :isSplicing="false"
              />
              <!--<el-input v-model="ruleForm1.signWay" disabled placeholder="请输入签订方式">

              </el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="印章类型" prop="sealType">
              <!-- <el-input v-model="ruleForm1.sealType" placeholder="请选择印章类型"></el-input> -->
              <common-select
                v-model="ruleForm1.sealType"
                dictCode="SEAL_TYPE"
                :value="ruleForm1.sealType"
                placeholder="请选择印章类型"
              />
            </el-form-item>
          </el-col>
          </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="补盖原因" prop="offReason">
              <el-input
                type="textarea"
                :rows="4"
                v-model="ruleForm1.offReason"
                placeholder="请输入补盖原因"
              ></el-input>
            </el-form-item>
          </el-col>
          </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item>
              <div style="float:right;">
                <el-button type="primary" @click="confirmDataUnderLine" icon="iconfont sbt_add">确定</el-button>
                <el-button type="primary" @click="dialogVisible = false" icon="iconfont sbt_add">取消</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <commonApproval
      :visible="visible"
      :handleCancel="handleCancel"
      :approvalParams="approvalParams"
      v-on:get-approvl-start="getApprovlStart"
    />
  </div>
</template>

<script>
/* eslint-disable */
import { underlineSealSave, getUnderLineSealList } from "@/service/sign/index";
import { processStart } from "@/service/work/index";
export default {
  data() {
    return {
      show: false,
      overHeight: "150px",
      ruleForm: {
        statue: "STA015",
        contractName: "",
        ourSide: "",
        otherSide: "",
        signWay: "SIW002",
      },
      rules: {},
      deletUrl: "",
      tableData: [],
      queryTableData: {},
      timeData: {},
      pageType: "OFFLINE_SEAL_APPLICATION",
      choosedTableData: [],
      visible: false,
      approvalParams: {},
      ruleForm1: {
        contractNo: "",
        contractName: "",
        contractDesc: "",
        contractTypeCode: "",
        signWay: "SIW002",
        sealType: "",
        offReason: "",
        contractOffSealId: "",
      },
      dialogVisible: false,
      rules1: {
        contractNo: [
          { required: true, message: "合同编号不能为空", trigger: "blur" },
        ],
        contractName: [
          { required: true, message: "合同名称不能为空", trigger: "blur" },
        ],
        contractDesc: [
          { required: true, message: "合同描述不能为空", trigger: "blur" },
        ],
        contractTypeCode: [
          { required: true, message: "合同类型不能为空", trigger: "blur" },
        ],
        signWay: [
          { required: true, message: "签约方式不能为空", trigger: "blur" },
        ],
        sealType: [
          { required: true, message: "印章类型不能为空", trigger: "blur" },
        ],
        offReason: [
          { required: true, message: "补盖原因不能为空", trigger: "blur" },
        ],
      },
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
      this.ruleForm.approvalTimeFrom = this.timeData.startTime;
      this.ruleForm.approvalTimeTo = this.timeData.endTime;

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
    handleCancel() {
      this.visible = false;
    },
    getApprovlStart(params) {
      // this.ruleForm1.sysProcessLinkHeadVo = params;
      let obj = {
        businessId: this.ruleForm1.contractOffSealId,
        sysProcessLinkHeadVo: params.sysProcessLinkHead,
        contractEnum: "ECM_OFFLINE_SEAL_PROCESS",
      };
      processStart(obj)
        .then((res) => {
          if (res.code === "000000") {
            this.$message({
              type: "success",
              message: "线下用印补盖流程发起成功！",
            });
            this.visible = false;
            this.dialogVisible = false;
          }
        })
        .catch((err) => {});
    },
    underlineStamp() {
      if (this.choosedTableData && this.choosedTableData.length > 0) {
        this.ruleForm1 = { ...this.choosedTableData[0] };
        if (this.ruleForm1.signWay != "SIW002") {
          // 电签
          this.$message({
            type: "warning",
            message: "电子签章的合同才允许线下补盖",
          });
          return;
        }
        if (this.ruleForm1.statue != "STA015") {
          // 电签
          this.$message({
            type: "warning",
            message: "只有已签署的合同才允许线下补盖",
          });
          return;
        }
        let params = {
          contractId: this.ruleForm1.contractId,
        };
        getUnderLineSealList(params)
          .then((res) => {
            console.log(res,'-----')
            if (res.data.length > 0) {
              this.ruleForm1 = {
                ...this.ruleForm1,
                offReason: res.data[0].offReason,
                contractOffSealId: res.data[0].contractOffSealId,
                sealType: res.data[0].sealType
              };
              if (res.data[0].statue === "P") {
                this.$message({
                  type: "warning",
                  message: "您已发起线下盖章申请",
                });
              }else{
                this.dialogVisible = true;
              }
            } else {
              this.dialogVisible = true;
            }
          })
          .catch((err) => {});
      } else {
        this.$message({ type: "error", message: "请勾选一条" });
      }
    },
    confirmDataUnderLine() {
      this.$refs.ruleForm1.validate((valid) => {
        if (valid) {
          this.saveUnderLine();
        }
      });
    },
    // 保存这些数据
    async saveUnderLine() {
      const { code, data } = await underlineSealSave(this.ruleForm1);
      if (code === "000000") {
        this.approvalParams = {
          objectTypeCode: "OFFLINE_SEAL_APPROVAL",
          businessId: data,
        };
        this.ruleForm1 = {
          ...this.ruleForm1,
          contractOffSealId: data
        }
        this.visible = true;
      }
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

