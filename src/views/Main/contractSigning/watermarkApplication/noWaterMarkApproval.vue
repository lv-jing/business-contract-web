<template>
  <div class="nowaterMarkApproval" v-loading="isLoading">
    <el-form label-width="130px" :model="ruleForm" ref="rulesForm">
      <el-row :gutter="24">
        <el-col :span="$route.query.type ==='approval'?19:24">
          <div class="bg-white p15">
            <b class="ft18">无水印申请审批</b>
          </div>
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
                    <el-input
                      type="textarea"
                      :disabled="!isEdit"
                      :rows="4"
                      placeholder="请输入申请原因"
                      v-model="ruleForm.reason"
                    ></el-input>
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
        </el-col>
        <el-col v-if="$route.query.type ==='approval'" :span="5">
          <common-mode :noShowOption="noShowOption" v-on:getApprovalParams="getApprovalParams"></common-mode>
        </el-col>
      </el-row>
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
  rejectProcess,
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
      approvalParams: {},
      contractId: "",
      signType: "",
      workFlowId: "", // 流程ID
      noShowOption: {},
      isLoading: false,
      ApprovalData: [],
      pinionsList: [],
      
    };
  },
  mounted() {
    this.signType = this.$route.query.signType;
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
    async getApprovalParams(params) {
      this.isLoading = true;
      if (params.type === "adopt") {
        // 提交或者通过
        if(this.isEdit){
          // 需要先调用保存
         await saveNowaterApply(this.ruleForm);
        }
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
    async getJump() {
      let params = {
        businessId: this.ruleForm.contractNoWaterId,
        objectTypeCode: "NO_WATER_APPROVAL",
      };
      const { code, data } = await getJump(params);
      if (code === "000000") {
        this.jumpData = data;
        if(data.jumpApproval && this.$route.query.taskKey === 'start'){
          this.isEdit = true
        }
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
    // 通过流程进来，获取表单信息
    async getFormInfoByProcess() {
      let processId = this.$route.query.id;
      const { code, data } = await getDetail({ id: processId });
      if (code === "000000") {
        this.contractId = data.contractId;
        this.ruleForm = data;
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList;
        this.getJump();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.nowaterMarkApproval {
  fieldset {
    min-height: 80px;
  }
  .button {
    width: 100px;
  }
}
</style>
