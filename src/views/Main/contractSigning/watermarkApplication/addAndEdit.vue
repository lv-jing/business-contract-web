<template>
  <div class="printDownLoad">
    <el-form label-width="130px" :model="ruleForm" ref="rulesForm">
      <b class="ft18">无水印申请</b>
      <common-title class="ft16 pd24" title="合同简要信息" />
      <div class="bg-white p25">
        <CommonContractInfo v-model="contractInfo" :contractId="contractId"></CommonContractInfo>
      </div>
      <common-title class="ft16 pd24" title="申请原因" />
      <div class="bg-white p25">
        <el-form>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <el-input type="textarea" :rows="4" placeholder="请输入申请原因" v-model="ruleForm.reason"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="bg-white mt20 pt30 pr20">
        <common-title class="ft16 pd24" title="文件信息" />
        <div
          class="ml20"
          v-for="(item,index)  in contractInfo.ecmBusinessAttamentList"
          v-bind:key="index"
        >
          <el-row
            :gutter="24"
            v-if="item.businessType === 'template' && item.fileStatus === 'STA004'"
          >
            <el-col :span="12">
              <el-form-item style="text-align:center;" label="定稿合同" label-width="150">
                <el-link @click="preview(item)" type="primary">{{item.fileName}}</el-link>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-button
                  class="button"
                  type="primary"
                  @click="preview(item)"
                  icon="iconfont sbt_add"
                >打印预览</el-button>
                <el-button
                  class="button"
                  type="primary"
                  @click="downLoad(item)"
                  icon="iconfont sbt_add"
                >下载</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row
            :gutter="24"
            v-if="item.businessType === 'template' && item.fileStatus === 'STA003'"
          >
            <el-col :span="12">
              <el-form-item style="text-align:center;" label="定稿合同（不含水印）" label-width="150">
                <el-link @click="preview(item)" type="primary">{{item.fileName}}</el-link>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-button
                  class="button"
                  type="primary"
                  @click="preview(item)"
                  icon="iconfont sbt_add"
                >打印预览</el-button>
                <el-button
                  class="button"
                  type="primary"
                  @click="downLoad(item)"
                  icon="iconfont sbt_add"
                >下载</el-button>
              </el-form-item>
            </el-col>
          </el-row> -->
        </div>
      </div>
      <div class="bg-white mt20 pr20">
        <el-row :gutter="24">
          <el-col :span="24">
            <!--审批历史-->
            <common-tableappoval
              class="ft16 pl24"
              :ApprovalData="ApprovalData"
              :pinionsList="pinionsList"
              :showOptions="true"
            />
          </el-col>
        </el-row>
      </div>
    </el-form>

  <div class="common-footer-box">
      <div class="common-footer">
        <div style="width: 50%"></div>
          <div class="button-content">
            <div style="float:right;">
              <el-button
                class="button"
                type="primary"
                @click="confirm"
                icon="iconfont sbt_add"
              >提交</el-button>
              <el-button class="button" type="primary" @click="cancel" icon="iconfont sbt_add">返回</el-button>
            </div>
        </div>
      </div>
    </div>

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
import {
  getJump,
  getNowaterApplyById,
  getNowaterApplyByContractId,
  saveNowaterApply,
} from "@/service/sign/index";
import {
  getAuditApprove,
  contractDisable,
  getDetail,
  processStart,
} from "@/service/work";
import { downloadUrl, previewUrl } from "@/service/file";
import contractApplyPrint from "../applySeal/addAndEdit";
export default {
  components: {
    contractApplyPrint: contractApplyPrint,
  },
  data() {
    return {
      ruleForm: {
        reason: "",
      },
      contractInfo: {},
      isEdit: false,
      isChange: false, // 是否从更改用印信息过来
      checked: false, // 是否勾选承诺
      jumpData: {},
      dlgVisiable: false,
      visible: false,
      approvalParams: {},
      contractId: "",
      signType: "",
      workFlowId:'', // 流程ID
      ApprovalData: [],
      pinionsList: [],
    };
  },
  mounted() {
    this.signType = this.$route.query.signType;
    if (this.$route.query.id) {
      this.getFormInfoByProcess();
    } else {
      this.contractId = this.$route.query.contractId;
      this.getContractNowaterInfo();
    }
  },
  methods: {
    async confirm() {
      if(!this.ruleForm.reason){
        this.$message({type:'error',message:'申请原因必须填写！'})
        return
      }
      if (this.ruleForm.statue === "P") {
        this.$message({
          type: "warning",
          message: "您已发起无水印申请",
        });
        return
      }
      let params = { ...this.ruleForm };
      if(!this.ruleForm.contractNoWaterId){
        params.contractNoWaterId = this.workFlowId || ''
      }
      params.contractId = this.contractInfo.contractId;
      params.contractNo = this.contractInfo.contractNo;
      params.contractName = this.contractInfo.contractName;
      const { code, data } = await saveNowaterApply(params);
      if (code === "000000") {
        this.workFlowId = data
        this.visible = true;
        this.approvalParams = {
          objectTypeCode: "NO_WATER_APPROVAL",
          businessId: data,
        };
      } else {
        // 不允许提交
      }
    },
    cancel() {
      this.$router.go(-1);
    },
    async getJump() {
      let params = {
        businessId: this.ruleForm.contractNoWaterId,
        objectTypeCode: "NO_WATER_APPROVAL",
      };
      const { code, data } = await getJump(params);
      if (code === "000000") {
        this.jumpData = data;
      }
    },
    // 获取当前页的所有数据
    async getContractNowaterInfo() {
      let params = {
        contractId: this.contractId,
      };
      const { code, data } = await getNowaterApplyByContractId(params);
      if (code === "000000") {
        if (data.length > 0) {
          this.ruleForm = data[0];
          // this.getJump();
        }
      }
    },
    handleChange() {},
    // 预览
    preview(item) {
      let token = this.$Cookie.get("token");
      window.open(
        previewUrl +
          "/" +
          item.fileId +
          "/" +
          item.fileId +
          "/" +
          "?token=" +
          token
      );
    },
    downLoad(item) {
      let token = this.$Cookie.get("token");
      window.open(downloadUrl + "/" + item.fileId + "/" + "?token=" + token);
    },
    downLoadAllFile() {
      let contractServiceUrl = process.env.VUE_APP_API_URL;
      let token = this.$Cookie.get("token");
      window.open(
        contractServiceUrl +
          "/contract/ecm-contract-print/downStampFile?contractId=" +
          this.contractId +
          "&token=" +
          token
      );
    },

    async getApprovlStart(params) {
      let obj = {
        businessId: this.workFlowId,
        sysProcessLinkHeadVo: params.sysProcessLinkHead,
        contractEnum: "ECM_NO_WATER_PROCESS",
      };
      processStart(obj)
        .then((res) => {
          if (res.code === "000000") {
            this.$message({
              type: "success",
              message: "无水印申请流程发起成功！",
            });
            this.$router.push({ name: "agencymatter" });
            this.visible = false;
            this.dialogVisible = false;
          }
        })
        .catch((err) => {});
    },
    handleCancel() {
      this.visible = false;
    },
    // 通过流程进来，获取表单信息
    async getFormInfoByProcess() {
      let processId = this.$route.query.id;
      const { code, data } = await getDetail({ id: processId });
      if (code === "000000") {
        this.contractId = data.contractId;
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList;
        getNowaterApplyById(processId).then((res) => {
          if (res.code === "000000") {
            this.ruleForm = res.data;
             this.workFlowId  = this.ruleForm.contractNoWaterId
            this.getJump();
          }
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.printDownLoad {
  fieldset {
    min-height: 80px;
  }
  .button {
    width: 100px;
  }
}
</style>
