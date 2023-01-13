<template>
  <div class="recallAppDetail">
    <el-row :gutter="24">
      <el-col :span="$route.query.type ==='approval'?19:24">
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="bg-white p25">
              <b class="ft18">流程作废申请</b>
              <CommonContractInfo v-model="contractInfo" :contractId="contractId"></CommonContractInfo>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="bg-white mt20 p25">
              <el-form  ref="rulesForm">
                  <common-title title="流程作废"/>
                <el-form-item>
                  <el-input type="textarea" :disabled="true" v-model="disableReason" :rows="4"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </el-col>

      <el-col v-if="$route.query.type ==='approval'" :span="5">
        <common-mode :noShowOption="noShowOption" v-on:getApprovalParams="getApprovalParams"></common-mode>
      </el-col>
    </el-row>
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
  rejectProcess
} from "@/service/work";
import { downloadUrl, previewUrl } from "@/service/file";
export default {
  data() {
    return {
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
      workFlowId: "", // 流程ID
      noShowOption: {},
      disableReason: "",
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.getFormInfoByProcess();
    }
    this.noShowOption = {
      isPass: true, // 通过
      isReject: true, // 退回
      isShowConsult: false, //意见征询按钮
      isShowNoSuitApproval: false, // 是否非适格审批按钮
      isChooseNode: true, // 是否选择节点
    };
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    // 获取当前页的所有数据
    async getContractInfo() {},
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
    async getApprovalParams(params) {
      this.isLoading = true;
      if (params.type === "adopt") {
        // 提交或者通过
        //点击通过按钮
        const { code } = await getAuditApprove({
          id: this.$route.query.id,
          bpmProcessTaskOpinionsFormList: params.list,
        });
        if (code === "000000") {
          this.isLoading = false;
          this.$message({ type: "success", message: "审批成功！" });
          setTimeout(() => {
            this.$router.push({ name: "agencymatter" });
          }, 500);
        }
      } else if (params.type === "return") {
        // 退回
        let obj = {
          id: this.$route.query.id,
          ecmContractProcessConfigVoList: params.VoList,
          bpmProcessTaskOpinionsFormList: params.list,
        };
        const { code, data } = await rejectProcess(obj);
        if (code === "000000") {
          this.isLoading = false;
          this.$message({ type: "success", message: "退回成功！" });
          setTimeout(() => {
            this.$router.push({ name: "agencymatter" });
          }, 500);
        }
      }
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
        this.disableReason = data.disableReason;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.recallAppDetail {
  fieldset {
    min-height: 80px;
  }
  .button {
    width: 100px;
  }
}
</style>
