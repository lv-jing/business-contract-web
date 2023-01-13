<template>
  <div>
    <div class="bg-white mb24 pd24">
      <common-title class="ft16" title="资质认证信息" />
      <el-form :model="ruleForm" :rules="rules" label-width="150px" ref="ruleForm">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="供应商名称" prop="name">
              <el-input v-model="ruleForm.name" :disabled="true" placeholder="请输入供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="供应商注册号" prop="registerNo">
              <el-input v-model="ruleForm.registerNo" placeholder="请输入供应商注册号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="认证企业负责人" prop="charger">
              <el-input v-model="ruleForm.charger" placeholder="请输入认证企业负责人"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="负责人手机号" prop="mobile">
              <el-input v-model="ruleForm.mobile" placeholder="请输入负责人手机号"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item>
              <div style="float:right;">
                <el-button type="primary" @click="valid">提交</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getCooperationInfo } from "@/service/4A/index";
import { getCompanyPage } from "@/service/sign/index";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        registerNo: "",
        vendorNum: "",
        charger: "",
        mobile: "",
      },
      rules: {
        registerNo: [
          { required: true, message: "请输入供应商注册号", trigger: "blur" },
        ],
        charger: [
          { required: true, message: "请输入认证企业负责人", trigger: "blur" },
        ],
        // mobile: [
        //   { required: true, message: "请输入负责人手机号", trigger: "blur" },
        // ],
      },
      userInfo: {},
    };
  },
  mounted() {
    this.userInfo = this.$store.state.common.userInfo;
    this.getCooperationInfo();
  },
  methods: {
    async getCooperationInfo() {
      const { code, data } = await getCooperationInfo(this.userInfo.userId);
      if (code === "000000") {
        this.ruleForm.name = data.cooperationName;
        this.ruleForm.registerNo = data.vatRegistrationNum;
        this.ruleForm.vendorNum = data.cooperationCode;
      }
    },
    valid() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
            this.confirmButton()
        }
      });
    },
    async confirmButton() {
      const { code, data } = await getCompanyPage(this.ruleForm);
      if (code === "000000") {
        window.open(data);
      }
    },
  },
};
</script>
<style lang="less" scoped>
</style>