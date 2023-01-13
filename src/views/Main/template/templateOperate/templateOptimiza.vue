<template>
  <div class="addTemplate">
    <div class="bg-white mb24 pd24">
      <el-form
        :model="templateInfo"
        :rules="rules"
        label-width="100px"
        ref="templateInfo"
        :class="show?'over-vis':'over-hid'"
      >
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="范本名称" prop="templateName">
                <el-input v-model="templateInfo.templateName" placeholder="请输入范本名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="范本编号" prop="templateNo">
                <el-input v-model="templateInfo.templateNo" :disabled="true" placeholder></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="范本版本号" prop="templateVersion">
                <el-input
                  v-model="templateInfo.templateVersion"
                  :disabled="true"
                  placeholder="自动生成范本版本号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="范本类型" prop="type">
                <!-- <el-input v-model="templateInfo.type" :disabled="true" placeholder="请输入创建时间"></el-input> -->
                <common-select
                  v-model="templateInfo.type"
                  dictCode="TEMPLATE_TYPE"
                  :disabled="true"
                  :value="templateInfo.type"
                  placeholder="请选择合同币种"
                  :isSplicing="false"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="创建人" prop="createdByName">
                <el-input
                  v-model="templateInfo.createdByName"
                  :disabled="true"
                  placeholder="请输入创建人名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间" prop="creationDate">
                <el-input
                  v-model="templateInfo.creationDate"
                  :disabled="true"
                  placeholder="请输入创建时间"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="范本语言" prop="templateLanguage">
                <common-select
                  v-model="templateInfo.templateLanguage"
                  dictCode="LANGUAGE"
                  :value="templateInfo.templateLanguage"
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
              <el-form-item label="范本说明" prop="templateDesc">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  maxlength="60"
                  show-word-limit
                  v-model="templateInfo.templateDesc"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="合同范本" prop="accountName">
                <span class="detailItem" @click="openIwebOffice">
                  <i class="el-icon-s-order"></i>{{templateInfo.templateName}}.doc
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-button type="primary" @click="confirmButton">提交</el-button>
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
import { getTemplate, optimizationTemplate } from "@/service/template/index";
import { getBussAttament } from "@/service/terms/index";
import { OpenKgWindow } from "@/utils/tools";
export default {
  data() {
    return {
      templateInfo: {},
      rules: {
        templateName: [
          { required: true, message: "请输入范本名称", trigger: "blur" },
        ],
        templateLanguage: [
          { required: true, message: "请选择范本语言", trigger: "blur" },
        ],
      },
      show: true,
      visible: false,
      approvalParams: {},
    };
  },
  created() {},
  mounted() {
    this.getTemplate();
  },
  methods: {
    // 获取条款内容
    async getTemplate() {
      let id = this.$route.query.templateId;
      const { code, data } = await getTemplate(id);
      if (code === "000000") {
        this.templateInfo = data;
      }
    },
    // 优化提交
    confirmButton() {
      this.$refs.templateInfo.validate((valid) => {
        if (valid) {
          this.approvalParams = {
            objectTypeCode: "TEMPLATE_APPROVAL_OPT",
            businessId: this.templateInfo.templateId,
          };
          this.visible = true;
        }
      });
    },
    // 选完人
    async getApprovlStart(params) {
      this.templateInfo.sysProcessLinkHeadVo = params.sysProcessLinkHead;
      const { code, data } = await optimizationTemplate(this.templateInfo);
      if (code === "000000") {
        this.$message({ type: "success", message: "范本优化流程发起成功" });
        setTimeout(() => {
          this.$router.push({name: 'agencymatter'})
        }, 500);
        return;
      }
    },
    // 跳转金格
    async openIwebOffice() {
      // 在优化的时候也需要创建好优化的范本
      if (this.templateInfo.type === 'OPT' && this.templateInfo.statue ==='TES002') {
          const { code, data } = await getBussAttament(
            this.templateInfo.templateId
          );
          if (code === '000000') {
            let token = this.$Cookie.get("token");
            OpenKgWindow(
              "?openType=open&docFileName="+encodeURIComponent(this.templateInfo.templateName)+"&isSave=true&operateType=template&ObjectId=" +
                this.templateInfo.templateId +
                "&fileId=" +
                data.fileId +
                "&token=" +
                token
            );
          }
      }else{
        this.templateInfo.sysProcessLinkHeadVo = null;
        const { code, data } = await optimizationTemplate(this.templateInfo);
        if (code === "000000") {
          this.templateInfo = data
          this.openIwebOffice()
        }
      }
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less">
.addTemplate {
  .detailItem {
    color: #2393f7;
    cursor: pointer;
  }
}
</style>