<template>
  <div class="applySeal">
    <el-form label-width="150px" :model="ruleForm" ref="rulesForm" :rules="rule">
      <b class="ft18">选择签署方式</b>

      <common-title class="ft16 pd24" title="合同简要信息" />
      <div class="bg-white p25">
        <CommonContractInfo v-model="contractInfo" :contractId="contractId"></CommonContractInfo>
      </div>
      <div class="bg-white mt20 pt30 pr20">
        <common-title class="ft16 pdl24" title="请选择签署方式" />
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="签订方式" prop="signWay">
              <common-select
                :disabled="!isEdit"
                v-model="ruleForm.signWay"
                dictCode="SIGN_WAY"
                :value="ruleForm.signWay"
                placeholder="请选择签订方式"
                :isSplicing="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用印顺序" prop="signOrder">
              <common-select
                v-model="ruleForm.signOrder"
                :disabled="!isEdit"
                dictCode="SIGN_ORDER"
                :value="ruleForm.signOrder"
                placeholder="请选择用印顺序"
                :isSplicing="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="印章类型" prop="sealType">
              <el-popover
                placement="top-start"
                width="250"
                trigger="hover"
                content="选择印章类型：基于公司目前的管理，应优先选择加盖合同专用章，特殊情况下才可使用公章，请知晓！">
              <common-select
                slot="reference"
                v-model="ruleForm.sealType"
                :disabled="!isEdit"
                dictCode="SEAL_TYPE"
                :value="ruleForm.sealType"
                placeholder="请选择印章类型"
                :isSplicing="false"
              />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请用印合同份数" prop="printNum">
              <el-input-number
                class="w-100"
                v-model="ruleForm.printNum"
                :disabled="!isEdit"
                @change="handleChange"
                :min="1"
                :max="1000"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24" :push="1" v-show="false">
            <div class="pl24" style="color:red">选择印章类型：基于公司目前的管理，应优先选择加盖合同专用章，特殊情况下才可使用公章，请知晓</div>
          </el-col>
          <el-col v-show="isEdit" :span="24" :push="1">
            <div class="pd24">
              <el-checkbox v-model="checked" class="ft16" fill="red">
                <span style="color:red;" class="ft16 ml10">我承诺：签字盖章的合同文本与系统内最终审批的合同文本一致</span>
              </el-checkbox>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="bg-white mt20 pt10 pr20 pb24" v-if="!isPop">
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
                <el-button class="button" type="primary" @click="printContractInfo" icon="iconfont sbt_add">下载</el-button>
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
      <commonApproval
        :visible="visible"
        :handleCancel="handleCancel"
        :approvalParams="approvalParams"
        v-on:get-approvl-start="getApprovlStart"
      />
    </el-form>
    <div class="common-footer-box" v-if="!isPop">
      <div class="common-footer">
        <div style="width: 50%"></div>
        <div class="button-content">
          <div style="float:right;">
            <el-button
              class="button"
              type="primary"
              v-show="isEdit"
              :disabled="!checked"
              @click="confirm"
              icon="iconfont sbt_add"
            >提交</el-button>
            <CommonSignDeleteButton
              v-if="!isPop && (contractInfo.statue==='STA005' ||contractInfo.statue==='STA006' ||contractInfo.statue==='STA009' || contractInfo.statue==='STA007' || contractInfo.statue==='STA008')"
              :contractId="contractId"
              @callBackDeal="deleteProcess"
            ></CommonSignDeleteButton>
            <el-button
              class="button"
              v-if="!isPop"
              type="primary"
              @click="cancel"
              icon="iconfont sbt_add"
            >返回</el-button>
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
  queryCompanyStatus,
} from "@/service/sign/index";
import { getAuditApprove, getDetail, contractDisable } from "@/service/work";
import { downloadUrl, previewUrl } from "@/service/file";

export default {
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
      isChange: false, // 是否从更改用印信息过来
      checked: false, // 是否勾选承诺
      jumpData: {},
      contractId: "",
      signType: "",
      isPop: false,
      isLoading: false,
      visible: false,
      approvalParams: {},
    };
  },
  props: {
    contractIdParam: "",
    signTypeParam: "",
  },

  created() {
    if (this.contractIdParam) {
      this.contractId = this.contractIdParam;
      this.signType = this.signTypeParam;
      this.isPop = true;
    } else {
      this.contractId = this.$route.query.contractId;
      this.signType = this.$route.query.signType;
      this.isPop = false;
    }
  },
  watch:{
    contractInfo(val){
      if(this.ruleForm.printNum<=1){
       this.ruleForm.printNum = this.contractInfo.contractNumber
      }
    }
  },
  mounted() {
    this.$store.dispatch("setHeight", 190);
    // if(this.contractIdParam){
    //   this.contractId = this.contractIdParam
    //   this.signType = this.signTypeParam
    // }else{
    //   this.contractId = this.$route.query.contractId
    //   this.signType = this.$route.query.signType
    // }
    if (this.$route.query.id && !this.contractIdParam) {
      this.getFormInfoByProcess();
    } else {
      this.getJump();
      this.getContractPrintInfo();
    }
    if (this.signType === "CHANGESIGN") {
      // 从【更改用印信息】过来
      this.isChange = true;
    }
  },
  methods: {
    confirm() {
      if(!this.checked){
        this.$message({
          type:"warning",
          message:"请勾选承诺信息！"
        })
        return
      }
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          // this.isLoading = true
          this.ruleForm.contractId = this.contractInfo.contractId;
          this.ruleForm.contractName = this.contractInfo.contractName;
          this.ruleForm.contractNo = this.contractInfo.contractNo;
          // 判断，如果是线上签署，判断对方是否符合要求
          if (this.ruleForm.signWay === "SIW002") {
            // 电子签章
            this.checkCompany((entityNameArr) => {
              if (entityNameArr.length > 0) {
                this.$confirm(
                  "对方：" +
                    entityNameArr.join(",") +
                    "未进行资质认证，是否继续使用电子签章",
                  "提示",
                  {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                  }
                )
                  .then(() => {
                    if (this.signType === "CHANGESIGN") {
                      // 更改用印信息】点击确定
                      this.changeContractPrint();
                    } else if (this.signType === "CHOOSESIGNTYPE") {
                      // 【选择签署方式】
                      this.saveContractPrint();
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                if (this.signType === "CHANGESIGN") {
                  // 更改用印信息】点击确定
                  // this.changeContractPrint();
                  this.openApploval();
                } else if (this.signType === "CHOOSESIGNTYPE") {
                  // 【选择签署方式】
                  this.saveContractPrint();
                }
              }
            });
          } else {
            if (this.signType === "CHANGESIGN") {
              // 更改用印信息】点击确定
              // this.changeContractPrint();
              this.openApploval();
            } else if (this.signType === "CHOOSESIGNTYPE") {
              // 【选择签署方式】
              this.saveContractPrint();
            }
          }
        }
      });
    },
    openApploval() {
      this.visible = true;
      this.approvalParams = {
        objectTypeCode: "SIGN_APPROVAL",
        businessId: this.ruleForm.contractId,
        attribute1: this.ruleForm.signWay,
        attribute2: this.ruleForm.signOrder
      };
    },
    async getApprovlStart(obj) {
      // 增加确认提示
      let id = "";
      if (this.signType === "CHANGESIGN") {
        id = "";
      } else {
        id = this.jumpData.bpmProcessTaskVo.workflowHistoryId;
      }
      let params = {
        id: id,
        sysProcessLinkHeadVo: obj.sysProcessLinkHead,
      };
      if (this.signType === "CHANGESIGN") {
        // 更改用印信息】点击确定
        this.changeContractPrint(params);
      } else {
        const { code, data } = await getAuditApprove(params);
        if (code === "000000") {
          this.$message({ type: "success", message: "处理成功" });
          this.$router.push({ name: "agencymatter" });
        }
      }
    },
    handleCancel() {
      this.visible = false;
      this.isLoading = false;
    },
    cancel() {
      this.$router.go(-1);
    },
    async getJump() {
      let params = {
        businessId: this.contractId,
        objectTypeCode: "APPLY_PRINT_APPROVAL",
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
        // 如果从更改用印信息过来，就必须可以编辑
        if (this.isChange === true) {
          this.isEdit = true;
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
        // let params = {
        //   id: this.jumpData.bpmProcessTaskVo.workflowHistoryId
        // }
        // const{code,data} = await getAuditApprove(params)
        // if(code ==='000000'){
        //   this.isLoading = false
        //   this.$message({ type: "success", message: "处理成功" });
        //   this.$router.push({ name: "printdownload" });
        // }
        this.ruleForm.contractPrintId = data.contractPrintId;
        this.openApploval();
      }
    },
    // 修改合同打印
    async changeContractPrint(obj) {
      this.ruleForm.contractPrintId = null;
      let params = {
        ...this.ruleForm,
        ...obj,
      };
      const { code, data } = await changeContractPrint(params);
      if (code === "000000") {
        this.isLoading = false;
        this.$message({ type: "success", message: "处理成功" });
        this.$router.push({ name: "agencymatter" });
      }
    },
    // 通过流程进来，获取表单信息
    async getFormInfoByProcess() {
      let processId = this.$route.query.id;
      const { code, data } = await getDetail({ id: processId });
      if (code === "000000") {
        this.contractId = data.contractId;
        this.signType = "CHOOSESIGNTYPE";
        this.getJump();
        this.getContractPrintInfo();
      }
    },
    async checkCompany(callback) {
      let entityNameArr = [];
      for (let i = 0; i < this.contractInfo.contractEntityList.length; i++) {
        let element = this.contractInfo.contractEntityList[i];
        if (!element.entityId) {
          this.$message({
            type: "warning",
            message:
              "对方：" +
              element.entityName +
              "，在系统中不存在，不允许进行电子签章！",
          });
          return;
        }
        if (element.entityType === "ENT02") {
          const { code, data } = await queryCompanyStatus({
            entityName: element.entityName,
          });
          if (code === "000000" && data != "PASSED") {
            entityNameArr.push(element.entityName);
          }
        }
      }
      callback && callback(entityNameArr);
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
        this.cancel();
      }
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
    printContractInfo() {
      let routeData = this.$router.resolve({
        path: "/contractPrintForm",
        query: {
          contractId: this.contractId
        },
      });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>

<style lang="less" >
.applySeal{
  .el-checkbox__inner{
        border: 1px solid red;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: red;
    border-color:red;
  }

  .el-checkbox__input.is-focus .el-checkbox__inner{
    border-color:red;
  }

  .el-checkbox__inner:hover {
    border-color: red;
  }

}
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
</style>
