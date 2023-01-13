<template>
  <div class="printDownLoad">
    <el-form label-width="130px" :model="ruleForm" ref="rulesForm">
      <b class="ft18">打印下载</b>
      <common-title class="ft16 pd24" title="合同简要信息" />
      <div class="bg-white p25">
        <CommonContractInfo v-model="contractInfo" :contractId="contractId"></CommonContractInfo>
      </div>
      <div class="bg-white mt20 pt30 pr20">
        <common-title class="ft16 pd24" title="文件信息" />
        <fieldset style="border:1px solid gray;border-radius:5px;" class="ml20">
          <legend class="ft16 ml20">审批单</legend>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item style="text-align:center;">
                <el-link type="primary" @click="printContractInfo">合同审批单</el-link>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
               <el-button class="button" type="primary" @click="printContractInfo" icon="iconfont sbt_add">打印预览</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>

        <fieldset
          v-if="contractInfo.ecmBusinessAttamentList && contractInfo.ecmBusinessAttamentList.length>0"
          style="border:1px solid gray;border-radius:5px;"
          class="ml20 mt20"
        >
          <legend class="ft16 ml20">合同</legend>
          <div v-for="(item,index)  in contractInfo.ecmBusinessAttamentList" v-bind:key="index">
            <el-row
              :gutter="24"
              v-if="item.businessType === 'template' && item.fileStatus === 'STA004'"
            >
              <el-col :span="12">
                <el-form-item style="text-align:center;">
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
          </div>
        </fieldset>
      </div>
    </el-form>
 <div class="common-footer-box">
      <div class="common-footer">
        <div style="width: 50%"></div>
          <div class="button-content">
            <div style="float:right;">
              <el-button class="button"  style="margin-left:5px;margin-right:5px" type="primary" @click="cancel" icon="iconfont sbt_add">返回</el-button>
            </div>
        </div>
      </div>
    </div>
    <el-dialog title="更改用印信息" :visible.sync="dlgVisiable" width="70%">
      <contractApplyPrint :contractIdParam="contractId" :signTypeParam="'CHANGESIGN'"></contractApplyPrint>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dlgVisiable = false">关1闭</el-button>
      </div> -->
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
import {
  getJump,
  getContractPrintInfo,
  changeContractPrint,
  saveContractPrint,
} from "@/service/sign/index";
import { getAuditApprove, contractDisable, getDetail } from "@/service/work";
import { downloadUrl, previewUrl } from "@/service/file";
import contractApplyPrint from "../applySeal/addAndEdit";
export default {
  components: {
    contractApplyPrint: contractApplyPrint,
  },
  data() {
    return {
      ruleForm: {
        printNum: 1,
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
    };
  },
  mounted() {
    this.$store.dispatch("setHeight", 190);
    if (this.$route.query.id) {
      this.getFormInfoByProcess();
    } else {
      this.contractId = this.$route.query.contractId;
      this.getContractPrintInfo();
    }
  },
  methods: {
    async confirm() {
      this.visible = true;
      this.approvalParams = {
        objectTypeCode: "SIGN_APPROVAL",
        businessId: this.ruleForm.contractId,
      };
    },
    cancel() {
      this.$router.go(-1);
    },
    async getJump() {
      let params = {
        businessId: this.ruleForm.contractPrintId,
        objectTypeCode: "PRINT_APPROVAL",
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
        this.getJump();
      }
    },
    handleChange() {},
    printContractInfo() {
      let routeData = this.$router.resolve({
        path: "/contractPrintForm",
        query: {
          contractId: this.contractId
        },
      });
      window.open(routeData.href, "_blank",'width=800,height=900,scrollbars=yes');
    },
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
    // 更改用印信息
    changeSign() {
      this.dlgVisiable = true;
    },
    // 撤回流程
    async deleteProcess() {
      this.$confirm("此操作将不可逆转, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteDone();
        })
        .catch(() => {});
    },
    async deleteDone() {
      let params = {
        contractId: this.contractId,
      };
      const { code, data } = await contractDisable(params);
      if (code === "000000") {
        this.$message({ type: "success", message: "撤回成功！" });
        this.$router.go(-1);
      }
    },
    async getApprovlStart(obj) {
      // 增加确认提示
      let params = {
        id: this.jumpData.bpmProcessTaskVo.workflowHistoryId,
        sysProcessLinkHeadVo: obj.sysProcessLinkHead,
      };

      const { code, data } = await getAuditApprove(params);
      if (code === "000000") {
        this.$message({ type: "success", message: "处理成功" });
        this.$router.push({ name: "printdownload" });
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
        this.getContractPrintInfo();
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
