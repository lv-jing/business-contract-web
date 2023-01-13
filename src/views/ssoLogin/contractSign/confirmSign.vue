<template>
  <div v-loading="isLoading" element-loading-text="点击重新获取该页面数据" @click="refush" class="sign">
    <el-row :gutter="24">
      <el-col>
        <el-form label-width="130px" :model="ruleForm" ref="rulesForm" :rules="rule">
          <b class="ft18">登记对方签署信息</b>
          <common-title class="ft16 pd24" title="简要信息" />
          <div class="bg-white p25">
            <CommonContractInfo v-show="false" v-model="contractInfo" :contractId="this.contractId"></CommonContractInfo>
            <el-row>
              <el-col :span="8">
          <el-form-item label="合同名称">
            <div>{{contractInfo.contractName}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同编号">
            <div>{{contractInfo.contractNo}}</div>
          </el-form-item>
        </el-col>
       
        <el-col :span="8">
          <el-form-item label="合同含税额">
            <div>{{contractInfo.includedAmount?contractInfo.includedAmount/100:''}}</div>
          </el-form-item>
        </el-col>
       
         <el-col :span="8">
          <el-form-item label="我方签约主体">
            <div v-for="(item,index) in contractInfo.contractEntityList" :key="index">
              <div v-if="item.entityType === 'ENT01'">{{item.entityName}}</div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="对方签约主体">
            <div v-for="(item,index) in contractInfo.contractEntityList" :key="index">
              <div v-if="item.entityType === 'ENT02'">{{item.entityName}}</div>
            </div>
          </el-form-item>
        </el-col>
            </el-row>
          </div>
           <div class="bg-white mt20 pr20">
            <common-title class="ft16 pd24" title="签署信息" />
            <div v-for="(item,index) in signData" :key="index">
              <el-row :gutter="24" v-if="item.entityType === 'ENT02' && item.entityName === userInfo.userName">
                <el-col :span="8">
                  <el-form-item>
                    <span>{{item.entityName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-date-picker
                      :ref="'otherSign' + index"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @change="changeDate(item)"
                      readonly
                      :disabled="!((contractInfo.statue ==='STA007' && item.signOrder === 'SIO001') || contractInfo.statue==='STA008')"
                      v-model="item.signTime"
                      type="date"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-popover
                    placement="top-start"
                    width="250"
                    trigger="hover"
                    content="请先点击【签署】跳转至CA进行盖章，再点击【提交】！">
                  <el-form-item v-if="!item.signTime" slot="reference">
                    <el-button
                      type="primary"
                      v-if="(((contractInfo.statue ==='STA007' && item.signOrder === 'SIO001') || contractInfo.statue==='STA008') && item.signWay==='SIW002')&isEdit"
                      @click="sign(item)"
                      icon="iconfont sbt_add"
                    >签署</el-button>
                  </el-form-item>
                    </el-popover>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="bg-white mt20 pr20">
            <common-title class="ft16 pd24" title="签署信息" />
            <div v-for="(item,index) in signData" :key="index">
              <el-row :gutter="24" v-if="item.entityType === 'ENT01'">
                <el-col :span="8">
                  <el-form-item>
                    <span>{{item.entityName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-date-picker
                      v-model="item.signTime"
                      type="date"
                      :ref="'ourSign' + index"
                      @change="changeDate(item)"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :disabled="!((contractInfo.statue ==='STA007' && item.signOrder === 'SIO002') || contractInfo.statue==='STA009')"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item v-if="false">
                    <el-button
                      type="primary"
                      @click="sign(item)"
                      v-if="(((contractInfo.statue ==='STA007' && item.signOrder === 'SIO002') || contractInfo.statue==='STA009') && item.signWay==='SIW002')&&isEdit"
                      icon="iconfont sbt_add"
                    >签署</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <div class="common-footer-box">
      <div class="common-footer">
        <div style="width: 50%"></div>
          <div class="button-content">
            <div style="float:right;">
              <common-mode v-if="isEdit && isSiw002" :noShowOption="noShowOption" :easyMode="true" :workflowHistoryId="jumpData.bpmProcessTaskVo.workflowHistoryId" v-on:getApprovalParams="getApprovalParams"></common-mode>
              <el-button class="button"  style="margin-left:5px;margin-right:5px" type="primary" @click="cancel" icon="iconfont sbt_add">返回</el-button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  getJump,
  getContractPrintInfo,
  changeContractPrint,
  saveContractPrint,
  queryContractSign,
  updateBatch,
  signContractPage,
} from "@/service/sign/index";
import { getAuditApprove, getDetail, rejectProcess } from "@/service/work";
import contractApplyPrint from "./changeSign";
import {mapState} from 'vuex'
//
export default {
  components: {
    contractApplyPrint: contractApplyPrint,
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.common.userInfo,
    }),
  },
  data() {
    return {
      rule: {
        signWay: [
          { required: true, message: "请选择签订方式", trigger: "blur" },
        ],
        signOrder: [
          { required: true, message: "请选择用印顺序", trigger: "blur" },
        ],
        sealType: [
          { required: true, message: "请选择印章类型", trigger: "blur" },
        ],
        printNum: [
          {
            required: true,
            message: "请选择申请用印合同份数",
            trigger: "blur",
          },
        ],
      },
      ruleForm: {
        printNum: 1,
      },
      contractInfo: {},
      isEdit: false,
   
      checked: false, // 是否勾选承诺
      jumpData: {},
      contractId: "",
      signType: "",
      isPop: false,
      signData: [],
      dlgVisiable: false,
      isSiw002: false, //是否为电签 ，true为电签
      isLoading: false,
      noShowOption: {
        isReject:true
      },
    };
  },
  props: {
    contractIdParam: "",
    signTypeParam: "",
  },

  created() {
    if (this.contractIdParam) {
    } else {
      this.contractId = this.$route.query.contractId;
    }
  },
  mounted() {
    this.init();
    this.$store.dispatch("setHeight", 190);
    this.noShowOption = {
      isPass: true, // 通过
      isReject: true, // 退回
      isShowConsult: false, //意见征询按钮
      isShowNoSuitApproval: false, // 是否非适格审批按钮
      isChooseNode: true, // 是否选择节点
      goBack:false
    };
  },
  methods: {
    init() {
      if (this.$route.query.id) {
        this.getFormInfoByProcess();
      } else {
        this.queryContractSign();
        this.getJump();
        // this.getContractPrintInfo();
      }
    },
    // 通过流程进来，获取表单信息
    async getFormInfoByProcess() {
      let processId = this.$route.query.id;
      const { code, data } = await getDetail({ id: processId });
      if (code === "000000") {
        this.contractId = data.contractId;
        this.queryContractSign();
        this.getJump();
        // this.getContractPrintInfo();
      }
    },
    // 校验必须不能为空
    valid() {
      let access = true; // 必填项必填为true
      if (this.signData.length > 0) {
        for (let k = 0; k < this.signData.length; k++) {
          
            if (this.signData[k].entityType === "ENT02" && this.signData[k].entityName === this.userInfo.userName) {
              if (
                this.signData[k].signTime === "" ||
                this.signData[k].signTime === null
              ) {
                access = false;
                break;
              }
            }
        }
      }
      return access;
    },
    cancel() {
      this.$router.go(-1);
    },
    async getJump() {
      let params = {
        businessId: this.contractId,
        objectTypeCode: "SIGN_APPROVAL",
      };
      const { code, data } = await getJump(params);
      if (code === "000000") {
        this.jumpData = data;
        // 0是要发流程，啥也没有，1是待办，2是已处理
        if (data.jumpApproval === "0") {
          this.isEdit = false;
        }
        if (data.jumpApproval === "1") {
          this.isEdit = true;
        }
        if (data.jumpApproval === "2") {
          this.isEdit = false;
        }
      }
    },
    // 获取当前页的所有数据
    async getContractPrintInfo() {
      let params = {
        contractId: this.contractId,
      };
      const { code, data } = await getContractPrintInfo(params);
      if (code === "000000") {
        this.ruleForm = data;
      }
    },
    handleChange() {},
    // 保存合同打印
    async saveContractPrint() {
      const { code, data } = await saveContractPrint(this.ruleForm);
      if (code === "000000") {
        let params = {
          id: this.jumpData.bpmProcessTaskVo.workflowHistoryId,
        };
        const { code, data } = await getAuditApprove(params);
        if (code === "000000") {
          this.$message({ type: "success", message: "处理成功" });
          this.$router.push({ name: "printdownload" });
        }
      }
    },
    // 修改合同打印
    async changeContractPrint() {
      this.ruleForm.contractPrintId = null;
      const { code, data } = await changeContractPrint(this.ruleForm);
      if (code === "000000") {
        this.$message({ type: "success", message: "处理成功" });
        this.$router.push({ name: "printdownload" });
      }
    },
    // 查询签章
    async queryContractSign() {
      let params = {
        contractId: this.contractId,
      };
      const { code, data } = await queryContractSign(params);
      if (code === "000000") {
        this.signData = data.records;
        // 判断是否为电签
        if (this.signData.length > 0) {
          if (this.signData[0].signWay === "SIW002") {
            this.isSiw002 = true;
          }
        }
      }
    },
    // 签署按钮
    async sign(item) {
       // 判断合同状态，如果是作废中，不能继续
      if(this.contractInfo.statue === 'STA011'){
        this.$message({
          type: "warning",
          message: "合同已发起作废流程，暂时无法操作！",
        });
        return
      }
      const { code, data } = await signContractPage(item);
      if (code === "000000") {
        this.isLoading = true;
        window.open(data);
      }
    },
    // 更改用印信息
    changeSign() {
      if (
        this.contractInfo.statue !== "STA006" &&
        this.contractInfo.statue !== "STA007"
      ) {
        this.$message({
          type: "error",
          message: "不满足合同更改用印信息条件！",
        });
        return;
      }
      this.dlgVisiable = true;
    },
    changeDate(item) {
      let userInfo = this.$store.state.common.userInfo;
      item.signPersonId = userInfo.userId;
      item.signPersonName = userInfo.userName;
    },
    deleteProcess() {},
    // 刷新此页面
    refush() {
      if(this.isLoading){
        this.queryContractSign();
        this.isLoading = false;
      }
    },
    async getApprovalParams(params) {
       // 判断合同状态，如果是作废中，不能继续
      if(this.contractInfo.statue === 'STA011'){
        this.$message({
          type: "warning",
          message: "合同已发起作废流程，暂时无法操作！",
        });
        return
      }
      if (params.type === "adopt") {
        if (!this.valid()) {
          // 有必填项为空
          this.$message({ type: "error", message: "签署时间不能为空！" });
          return;
        }
        // 提交或者通过
        //点击通过按钮
        const { code } = await getAuditApprove({
          id: this.jumpData.bpmProcessTaskVo.workflowHistoryId,
          bpmProcessTaskOpinionsFormList: params.list,
        });
        if (code === "000000") {
          this.$message({ type: "success", message: "审批成功！" });
          setTimeout(() => {
            this.$router.push({ name: "contractSign" });
          }, 500);
        }
      } else if (params.type === "return") {
        // 退回
        let obj = {
          id: this.jumpData.bpmProcessTaskVo.workflowHistoryId,
          ecmContractProcessConfigVoList: params.VoList,
          bpmProcessTaskOpinionsFormList: params.list,
        };
        const { code, data } = await rejectProcess(obj);
        if (code === "000000") {
          this.$message({ type: "success", message: "退回成功！" });
          setTimeout(() => {
            this.$router.push({ name: "contractSign" });
          }, 500);
        }
      }
    },
  },
};
</script>

<style lang="less">
.sign{
  .el-popover--plain {
    font-family: PingFangSC-Medium;
    background: #F5F6F7;
    text-align: center;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    border-radius: 15px;
    -webkit-box-shadow: 2px 2px 6px #888;
    -moz-box-shadow: 2px 2px 6px #888;
    box-shadow: 2px 2px 6px #888;

    .popper__arrow::after {
      border-top-color: #F5F6F7 !important;
    }
}
}
</style>
