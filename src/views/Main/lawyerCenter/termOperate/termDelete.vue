<template>
  <div class="deleteTerm">
    <div class="bg-white mb24 pd24">
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        ref="ruleForm"
        :class="show?'over-vis':'over-hid'"
      >
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="条款名称" prop="termsName">
                <el-input v-model="ruleForm.termsName" :disabled="true" placeholder="请输入条款名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="条款编号" prop="termsNo">
                <el-input v-model="ruleForm.termsNo" :disabled="true" placeholder></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="创建人" prop="createdByName">
                <el-input v-model="ruleForm.createdByName" :disabled="true" placeholder="请输入创建人名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间" prop="creationDate">
                <el-input v-model="ruleForm.creationDate" :disabled="true" placeholder="请输入创建时间"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="条款语言" prop="termsLanguage">
                <common-select
                  :disabled="true"
                  class="w-100"
                  v-model="ruleForm.termsLanguage"
                  dictCode="LANGUAGE"
                  :value="ruleForm.termsLanguage"
                  placeholder="请选择收支类型"
                  :isSplicing="false"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="条款内容">
                <span style="color:#2393F7;" @click="openIwebOffice">
                  <i class="el-icon-s-order"></i>{{ruleForm.termsName}}.doc
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="废止原因" prop="termsDesc">
                <el-input type="textarea" v-model="ruleForm.termsDesc" placeholder="请输入废止原因"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-button type="primary" @click="deleteTerm">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
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
import {
  addTerm,
  getTermInfo,
  deleteTermInfo,
  getBussAttament,
} from "@/service/terms/index";
import { OpenKgWindow } from "@/utils/tools";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      ruleForm: {},
      termInfo: {},
      rules: {},
      show: true,
      value: "",
      options: [],
      userInfo1: {},
      visible: false,
      approvalParams: {}
    };
  },
  created() {},
  mounted() {
    let id = this.$route.query.id;
    this.getTermInfoo(id);
  },
  methods: {
    async getTermInfoo(id) {
      const { code, data } = await getTermInfo(id);
      if (code === "000000") {
        this.ruleForm = data;
      }
    },
    //调用iwebOffice
    // 首先要从接口拿到数据
    async openIwebOffice() {
      const { code, data } = await getBussAttament(this.ruleForm.termsId);
      if (code === "000000") {
        let token = this.$Cookie.get("token");
        OpenKgWindow(
          "?openType=open&docFileName="+encodeURIComponent(this.ruleForm.termsName)+"&readType=readyOnly&operateType=term&ObjectId=" +
            this.ruleForm.termsId +
            "&fileId=" +
            data.fileId +
            "&token=" +
            token
        );
      }
    },
    // 废止条款
    deleteTerm() {
        this.approvalParams = {
            objectTypeCode: "TERMS_APPROVAL_DISABLE",
            businessId: this.ruleForm.termsId,
        }
        this.visible = true
    },
    async addToTerm(params) {
      const { code, data } = await addTerm(params);
      if (code && code == "000000") {
        //此处表示提交成功
      } else {
        this.$message("新增条款失败");
      }
    },
    handleCancel() {
      this.visible = false;
    },
    // 发起审批
    async getApprovlStart(params) {
      this.ruleForm.sysProcessLinkHeadVo = params.sysProcessLinkHead;
      const { code, data } = await deleteTermInfo(this.ruleForm);
      if (code === "000000") {
        this.$message({ type: "success", message: "废止流程发起成功！" });
        setTimeout(() => {
          this.$router.push({name: 'agencymatter'})
        }, 500);
      }
    },
  },
};
</script>
<style lang="less">
.deleteTerm {
}
</style>
