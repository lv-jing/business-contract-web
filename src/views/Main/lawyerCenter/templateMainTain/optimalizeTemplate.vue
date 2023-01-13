<template>
  <div class="addTemplate">
    <div class="bg-white mb24 pd24">
      <common-title title="范本优化" />
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
                  {{templateInfo.templateName}}.doc
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
      <contractTypeTreeList :dialogVisible="isShowContractType" @returnData="returnData"></contractTypeTreeList>
    </div>
  </div>
</template>
<script>
import {
  getTemplate,
  optimizationTemplate,
  getTemplateContractType,
  getTemplateUnit,
  adminOptimalizeTemplate,
  optimalizeTemplateNoIwebOffice
} from "@/service/template/index";
import { getBussAttament } from "@/service/terms/index";
import { OpenKgWindow } from "@/utils/tools";
import { getAllUnit } from "@/service/4A/index";
export default {
  data() {
    return {
      templateId: "",
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
      templateTypeForm: {},
      templateUnitForm: {},
      templateUnitData: [],
      isShowContractType: false,
      isClickIwebOffice: false, // 是否点击了金格软件编辑，如果没有的话点击提交的时候需要调用另一个接口
    };
  },
  created() {},
  mounted() {
    this.templateId = this.$route.query.templateId;
    this.getAllUnit();
    this.getTemplate();
    this.getTemplateUnitCode();
    this.getTemplateContractType();
  },
  methods: {
    // 获取范本内容
    async getTemplate() {
      const { code, data } = await getTemplate(this.templateId);
      if (code === "000000") {
        this.templateInfo = data;
      }
    },
    // 根据范本ID查询事业部和合同类型
    async getTemplateContractType() {
      const { code, data } = await getTemplateContractType(this.templateId);
      if (code === "000000") {
        this.templateTypeForm = { ...data };
      }
    },
    async getTemplateUnitCode() {
      const { code, data } = await getTemplateUnit(this.templateId);
      if (code === "000000") {
        let unitArr = data.unitId.split(",");
        this.templateUnitForm.unitId = unitArr;
      }
    },
    // 优化提交
    async confirmButton() {
      if (!this.operateTemplateInfo()) {
        this.$message({ type: "error", message: "必填项不能为空!" });
        return;
      }
      // 点击了金格控件
      if (this.isClickIwebOffice) {
        const { code, data } = await adminOptimalizeTemplate(this.templateInfo);
        if (code === "000000") {
          this.$message({type:"success",message:"优化成功！"})
          setTimeout(() => {
            this.$router.push({ name: "templateMainTain" });
          }, 500);
        }
        // 没有点击金格控件
      }else{
        const {code,data} = await optimalizeTemplateNoIwebOffice(this.templateInfo)
        if(code ==='000000'){
          this.$message({type:"success",message:"优化成功！"})
          setTimeout(() => {
            this.$router.push({ name: "templateMainTain" });
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
    //需要将页面数据拼装
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
    // 跳转金格
    async openIwebOffice() {
      if (!this.operateTemplateInfo()) {
        this.$message({ type: "error", message: "必填项不能为空!" });
        return;
      }
      // 在优化的时候也需要创建好优化的范本
      if (
        this.templateInfo.type === "OPT" &&
        this.templateInfo.statue === "TES002"
      ) {
        // 点击了金格编辑按钮，将该值设置为ture
        this.isClickIwebOffice = true;
        const { code, data } = await getBussAttament(
          this.templateInfo.templateId
        );
        if (code === "000000") {
          let token = this.$Cookie.get("token");
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
            // 直接导入到数据库的范本需要去加入书签和条款
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
        const { code, data } = await adminOptimalizeTemplate(this.templateInfo);
        if (code === "000000") {
          this.templateInfo = data;
          this.openIwebOffice();
        }
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