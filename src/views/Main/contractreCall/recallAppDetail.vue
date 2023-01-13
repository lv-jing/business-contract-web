<template>
  <div class="recallAppDetail">
    <el-form label-width="130px" ref="rulesForm">
      <b class="ft18">流程作废申请</b>
      <div class="bg-white p15 mt10">
        <el-row :gutter="24">
          <el-col :span="24">
            <div style="float:right;">
              <!--流程撤回按钮-->
              <CommonSignDeleteButton :contractId="contractId"></CommonSignDeleteButton>
              <el-button class="button" type="primary" @click="cancel" icon="iconfont sbt_add">取消</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <common-title class="ft16 pd24" title="合同简要信息" />
      <div class="bg-white p25">
        <CommonContractInfo v-model="contractInfo" :contractId="contractId"></CommonContractInfo>
      </div>

      <fieldset
        v-if="contractInfo.ecmBusinessAttamentList"
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

      <fieldset style="border:1px solid gray;border-radius:5px;" class="ml20 mt20">
        <legend class="ft16 ml20">见证资料</legend>
        <div v-for="(item,index)  in contractInfo.ecmBusinessAttamentList" v-bind:key="index">
          <el-row :gutter="24" v-if="item.businessType === '2'">
            <el-col :span="12">
              <el-form-item style="text-align:center;">
                <el-link type="primary">{{item.fileName}}</el-link>
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
                <el-button class="button" type="primary" @click="downLoad(item)" icon="iconfont sbt_add">下载</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </fieldset>
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
  processStart,
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
    };
  },
  mounted() {
    this.signType = this.$route.query.signType;
    if (this.$route.query.id) {
      this.getFormInfoByProcess();
    } else {
      this.contractId = this.$route.query.contractId;
      this.getContractInfo();
    }
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
