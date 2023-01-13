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
                  placeholder="请选择范本类型"
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
                  placeholder="请选择范本语言"
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
                  <i class="el-icon-s-order"></i>{{templateDocShow.length===0?'创建范本':templateDocShow+'.doc'}}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="24">
          <el-col :span="12" push="12">
            <el-button style="float:right;" type="primary" @click="confirmButton">提交</el-button>
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
import { addTemplate, getTemplateUrl } from "@/service/template/index";
import { getBussAttament } from "@/service/terms/index";
import { OpenKgWindow } from "@/utils/tools";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      templateInfo: { type: "ADD" },
      rules: {
        templateName: [
          { required: true, message: "请输入范本名称", trigger: "blur" },
        ],
        templateLanguage: [
          { required: true, message: "请选择范本语言", trigger: "blur" },
        ],
      },
      show: true,
      value: "",
      options: [],
      userInfo1: {},
      clickedIwebOffice: false,
      visible: false,
      approvalParams: {},
      isConfirmApproval: false, // 是否发起了流程
      templateDocShow:'' // 新生成的范本的名字
    };
  },
  created() {
    this.templateInfo.createdByName = this.$store.state.common.userInfo.userName;
    this.templateInfo.creationDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
  },
  mounted() {},
  methods: {
    openType() {},
    formResetMethod() {},

    //调用iwebOffice
    async openIwebOffice() {
      this.clickedIwebOffice = true;
      let token = this.$Cookie.get("token");
      if (this.templateInfo.templateId) {
        this.clickedIwebOffice = false;
        const { code, data } = await getBussAttament(
          this.templateInfo.templateId
        );
        if (code === "000000") {
          this.templateDocShow = this.templateInfo.templateName
          if (data.fileId) {
            OpenKgWindow(
              "?openType=open&docFileName="+encodeURIComponent(this.templateInfo.templateName)+"&isSave=true&operateType=template&ObjectId=" +
                this.templateInfo.templateId +
                "&fileId=" +
                data.fileId +
                "&token=" +
                token
            );
          } else {
            OpenKgWindow(
              "?openType=add&docFileName="+encodeURIComponent(this.templateInfo.templateName)+"&isSave=true&operateType=template&ObjectId=" +
                this.templateInfo.templateId +
                "&fileId=" +
                data.fileId +
                "&token=" +
                token
            );
          }
        }
      } else {
        this.confirm();
        //    this.openIwebOffice()
      }
    },
    // 点击提交按钮,此处需要发起范本流程
    confirmButton() {
      this.$refs.templateInfo.validate((valid) => {
        if (valid) {
          if (this.templateInfo.templateId) {
            this.startApproval();
          } else {
            this.$message({ type: "error", message: "请添加范本文档！" });
          }
        }
      });
    },
    async startApproval() {
      // 紧接着判断该范本是否有跟文档关联
      const { code, data } = await getTemplateUrl(this.templateInfo.templateId);
      if (code === "000000") {
        if (data.fileId) {
          let dataa = { ...this.templateInfo };
          const { code, data1 } = await addTemplate(dataa);
          if (code === "000000") {
            this.isConfirmApproval = true;
            this.approvalParams = {
              objectTypeCode: "TEMPLATE_APPROVAL",
              businessId: this.templateInfo.templateId,
            };
            this.visible = true;
          }
        } else {
          this.$message({ type: "error", message: "请添加范本文档！" });
        }
      }
    },
    // 选完人了后
    getApprovlStart(params) {
      this.isComfirmApproval = true;
      this.templateInfo.sysProcessLinkHeadVo = params.sysProcessLinkHead;
      this.confirm();
    },
    handleCancel() {
      this.visible = false;
    },
    // 提交
    confirm() {
      this.templateInfo.templateVersion = 1;
      this.$refs.templateInfo.validate((valid) => {
        if (valid) {
          let data = { ...this.templateInfo };
          this.addTemplate(data);
        }
      });
    },
    async addTemplate(params) {
      const { code, data } = await addTemplate(params);
      if (code && code == "000000") {
        this.templateInfo = { ...data };
        if (this.isConfirmApproval) {
          this.$message({ type: "success", message: "范本流程发起成功！" });
          setTimeout(() => {
            this.$router.push({ name: "agencymatter" });
          }, 500);
          return;
        }

        //此处表示提交成功
        if (this.clickedIwebOffice) {
          this.openIwebOffice();
        } else {
          this.$message({ type: "success", message: "新增范本成功" });
        }
      } else {
        this.clickedIwebOffice = false;
        this.$message({ type: "error", message: "新增范本失败" });
      }
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