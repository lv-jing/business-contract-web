<template>
  <div class="addTemplate">
    <div class="bg-white mb24 pd24">
      <el-form :model="templateInfo" :rules="rules" label-width="120px" ref="templateInfo">
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
                  v-model="templateInfo.templateVersionShow"
                  :disabled="true"
                  placeholder="自动生成范本版本号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="范本类型" prop="type">
                <common-select
                  v-model="templateInfo.type"
                  dictCode="TEMPLATE_TYPE"
                  :disabled="true"
                  :value="templateInfo.type"
                  placeholder
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
            <el-col :span="12">
              <el-form-item label="适用合同类型" prop="contractTypeName">
                <el-input
                  v-model="templateTypeForm.contractTypeName"
                  @click.native="getContractType"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="适用组织范围" prop="unitId">
                <el-select
                  class="w-100"
                  multiple
                  v-model="templateUnitForm.unitId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in templateUnitData"
                    :key="item.unitCode"
                    :label="item.unitName"
                    :value="item.unitCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="展现金额区域" prop="showmoney">
                <el-radio v-model="templateInfo.showmoney" label="1">展示</el-radio>
                <el-radio v-model="templateInfo.showmoney" label="0">不展示</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否使用批量合同功能" prop="batchFlag">
                <el-radio v-model="templateInfo.batchFlag" label="1">是</el-radio>
                <el-radio v-model="templateInfo.batchFlag" label="0">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同有效期类型" prop="contractValidityType">
                <common-select
                  v-model="templateInfo.contractValidityType"
                  dictCode="VILAD_TYPE"
                  :value="templateInfo.contractValidityType"
                  placeholder="请选择合同有效期类型"
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
                  <i class="el-icon-s-order"></i>
                  {{templateDocShow.length===0?'创建范本':templateDocShow+'.doc'}}
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
    <contractTypeTreeList :dialogVisible="isShowContractType" @returnData="returnData"></contractTypeTreeList>
  </div>
</template>
<script>
import { getAllUnit } from "@/service/4A/index";
import {
  mainTainTemplate,
  getTemplateUrl,
  getTemplateBookMarks,
} from "@/service/template/index";
import { getBussAttament } from "@/service/terms/index";
import { OpenKgWindow } from "@/utils/tools";
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
        showmoney: [
          { required: true, message: "请勾选是否展示金额", trigger: "blur" },
        ],
        batchFlag: [
          {
            required: true,
            message: "请勾选是否使用批量合同功能",
            trigger: "blur",
          },
        ],
        contractValidityType: [
          {
            required: true,
            message: "请选择合同有效期类型",
            trigger: "blur",
          },
        ],
        contractTypeName: [
          {
            required: true,
            message: " ",
            trigger: "blur",
          },
        ],
        unitId: [
          {
            required: true,
            message: " ",
            trigger: "blur",
          },
        ],
      },
      templateDocShow: "",
      templateTypeForm: {},
      templateUnitForm: {
        unitId: [],
      },
      templateUnitData: [],
      isShowContractType: false,
    };
  },
  methods: {
    async openIwebOffice() {
      if (this.templateInfo.templateId) {
        const { code, data } = await getBussAttament(
          this.templateInfo.templateId
        );
        if (code === "000000") {
          let token = this.$Cookie.get("token");
          this.templateDocShow = this.templateInfo.templateName;
          if (data.fileId) {
            OpenKgWindow(
              "?openType=open&docFileName=" +
                encodeURIComponent(this.templateInfo.templateName) +
                "&isSave=true&operateType=template&ObjectId=" +
                this.templateInfo.templateId +
                "&fileId=" +
                data.fileId +
                "&templateAdmin=true" +
                "&batchFlag=" +
                this.templateInfo.batchFlag +
                "&token=" +
                token
            );
          } else {
            OpenKgWindow(
              "?openType=add&docFileName=" +
                encodeURIComponent(this.templateInfo.templateName) +
                "&isSave=true&operateType=template&ObjectId=" +
                this.templateInfo.templateId +
                "&fileId=" +
                data.fileId +
                "&templateAdmin=true" +
                "&batchFlag=" +
                this.templateInfo.batchFlag +
                "&token=" +
                token
            );
          }
        }
      } else {
        this.mainTainTemplate();
      }
    },
    mainTainTemplate() {
      let isBoo = true;
      isBoo = this.operateTemplateInfo();
      this.$refs.templateInfo.validate((valid) => {
        if (valid) {
          if (!isBoo) {
            this.$message({
              type: "error",
              message: "适用合同类型和组织范围不能为空！",
            });
            return;
          } else {
            this.saveData();
          }
        }
      });
    },
    // 数据保存
    async saveData() {
      const { code, data } = await mainTainTemplate(this.templateInfo);
      if (code === "000000") {
        this.templateInfo = data;
        this.openIwebOffice();
      }
    },
    // 数据组装
    operateTemplateInfo() {
      // 事业部
      if (this.templateUnitForm.unitId.length > 0) {
        let unitObj = {
          unitId: this.templateUnitForm.unitId.join(","),
        };
        this.templateInfo.unitId = this.templateUnitForm.unitId.join(",");
        this.templateInfo.templateUnitForm = unitObj;
      } else {
        return false;
      }
      // 合同类型
      if (Object.keys(this.templateTypeForm).length > 0) {
        this.templateInfo.templateTypeForm = { ...this.templateTypeForm };
        this.templateInfo.contractTypeName = this.templateTypeForm.contractTypeName;
      } else {
        return false;
      }
      return true;
    },
    // 点击提交按钮
    async confirmButton() {
      if (!this.templateInfo.templateId) {
        this.$message({ type: "error", message: "请先创建范本文档！" });
        return;
      }
      // 紧接着判断该范本是否有跟文档关联
      const { code, data } = await getTemplateUrl(this.templateInfo.templateId);
      if (code === "000000") {
        if (data.fileId) {
          this.getHaveBookMarks();
        } else {
          this.$message({ type: "error", message: "请添加范本文档！" });
        }
      }
    },
    async getHaveBookMarks() {
      let obj = {
        businessId: this.templateInfo.templateId,
        businessType: "template",
      };
      const { code, data } = await getTemplateBookMarks(obj);
      if (code === "000000") {
        if (data.length === 0) {
          this.$message({
            type: "error",
            message: "请进行范本维护（打书签）工作后再点击【通过】",
          });
        } else {
          this.$message({ type: "success", message: "保存成功！" });
          setTimeout(() => {
            this.$router.push({ name: "agencymatter" });
          }, 500);
        }
      }
    },
    // 获取所有事业部
    async getAllUnit() {
      let params = {}; // 查询所有事业部不用传参数
      const { code, data } = await getAllUnit(params);
      if (code === "000000") {
        console.log(data);
        this.templateUnitData = data;
      }
    },
    getContractType() {
      this.isShowContractType = true;
    },
    // 子组件返回的数据类型
    returnData(data) {
      this.templateTypeForm = data;
      console.log(this.templateTypeForm);
      this.isShowContractType = false;
    },
  },
  mounted() {
    this.templateInfo.createdByName = this.$store.state.common.userInfo.userName;
    this.templateInfo.creationDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
    this.templateInfo.templateVersion = 1;
    this.templateInfo.templateVersionShow = "V1.0";
    this.getAllUnit();
  },
};
</script>
<style lang="less" scoped>
</style>