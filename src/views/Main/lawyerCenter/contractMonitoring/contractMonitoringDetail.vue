<template>
  <div class="printDownLoad">
    <el-form label-width="130px" :model="ruleForm" ref="rulesForm">
      <b class="ft18">合同监控</b>
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
                <el-link type="primary">合同审批单</el-link>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-button class="button" type="primary" icon="iconfont sbt_add">打印预览</el-button>
                <el-button class="button" type="primary" icon="iconfont sbt_add">下载</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>

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
                    @click="cancel"
                    icon="iconfont sbt_add"
                  >打印预览</el-button>
                  <el-button
                    class="button"
                    type="primary"
                    @click="cancel"
                    icon="iconfont sbt_add"
                  >下载</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </fieldset>
      </div>
      <div class="bg-white mt20 pt30 pr20">
        <common-title class="ft16 pd24" title="合同监控" />
        <el-row :gutter="24">
          <el-col :span="12" :push="5">
            <div>
              <el-form>
                <el-form-item label=" " label-width="100px">
                  <el-radio v-model="contractMonitorRadio" label="1">合规</el-radio>
                  <el-radio v-model="contractMonitorRadio" label="2">不合规</el-radio>
                  <el-button type="primary" style="float:right;" @click="saveData()">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <el-form>
                <el-form-item label="合规性评价" label-width="100px">
                  <el-input type="textarea" v-model="remarks" :rows="4"></el-input>
                </el-form-item>
              </el-form>
            </div>
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
  getContractPrintInfo,
  changeContractPrint,
  saveContractPrint,
} from "@/service/sign/index";
import { getAuditApprove, contractDisable, getDetail } from "@/service/work";
import { downloadUrl, previewUrl } from "@/service/file";
import {
  saveContractMon,
  listContractMonitoring,
} from "@/service/terms/index.js";
export default {
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
      contractId: "",
      contractMonitorRadio: "",
      remarks: "",
    };
  },
  mounted() {
    this.contractId = this.$route.query.contractId;
    this.getContractPrintInfo();
  },
  methods: {
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
    // 保存数据
    async saveData() {
      if (!this.contractMonitorRadio) {
        this.$message({ type: "error", message: "是否合规不能为空" });
        return;
      }
      if (!this.remarks) {
        this.$message({ type: "error", message: "合规性评价不能为空" });
        return;
      }
      let params = {
        remarks: this.remarks,
        statue: this.contractMonitorRadio,
        contractId: this.contractId,
        contractNo: this.contractInfo.contractNo,
        contractName:this.contractInfo.contractName
      };
      const { code, data } = await saveContractMon(params);
      if (code === "000000") {
        this.$message({ type: "success", message: "添加成功！" });
        this.$router.push({name:'contractMonitoring'});
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
