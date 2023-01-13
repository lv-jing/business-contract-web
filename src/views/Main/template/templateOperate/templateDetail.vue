<template>
  <div class="temlateDetail" v-loading="loading" :element-loading-text="loadingText">
    <div class="bg-white">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix flex flex-center-between">
          <b class="ft18">范本详情</b>
          <div style="float:right;">
            <el-button
              v-if="$route.query.isShowBut!=='false' && !isChooseLowVersion"
              @click="addToCommonUse(1)"
            >添加常用</el-button>
            <el-button v-if="$route.query.isShowBut === 'true'" @click="addToCommonUse(2)">发起合同</el-button>
            <el-button type="primary" @click="downLoadTemplate">下载</el-button>
            <el-button
              type="primary"
              v-show="$route.query.isShowButton === 'true' && !isChooseLowVersion"
              @click="optimizationTemplate"
              icon="iconfont sbt_add"
            >优化</el-button>
            <el-button
              type="primary"
              v-show="$route.query.isShowButton === 'true' && !isChooseLowVersion"
              @click="repealTemplate"
              icon="iconfont sbt_add"
            >废止</el-button>
            <el-button
              type="primary"
              v-show="$route.query.isShowButton === 'true' && isAdmin && !isChooseLowVersion"
              @click="closeOrOpenTemplate"
              icon="iconfont sbt_add"
            >{{templateForm.statue ==='TES004'?'激活':'关闭'}}</el-button>
          </div>
        </div>
        <el-form :model="templateForm" ref="templateForm" class="demo-templateForm">
          <div class="form-bg">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="范本名称" prop="templateName">
                  <span>{{ templateForm.templateName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="范本编号" prop="templateNo">
                  <span>{{ templateForm.templateNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="范本版本号">
                  <el-select
                    v-model="templateForm.templateVersion"
                    @change="selectVersion"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in templateVersionList"
                      :key="item.templateVersion"
                      :label="'V'+item.templateVersion+'.0'"
                      :value="item.templateVersion"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="范本类型" prop="type">
                  <!-- <span>{{ templateForm.type }}</span> -->
                  <DictCodeToDictName :parentCode="'TEMPLATE_TYPE'" :dictCode="templateForm.type"></DictCodeToDictName>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="适用组织范围" prop="unitName">
                  <span>{{ templateForm.unitName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="适用合同类型">
                  <span>{{ contractType }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同有效期类型" prop="contractValidityType">
                  <DictCodeToDictName
                    :parentCode="'VILAD_TYPE'"
                    :dictCode="templateForm.contractValidityType"
                  ></DictCodeToDictName>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建人" prop="createdByName">
                  <span>{{ templateForm.createdByName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间" prop="creationDate">
                  <span>{{ templateForm.creationDate }}</span>
                </el-form-item>
              </el-col>
              <el-col v-show="false" :span="12">
                <el-form-item label="修改人" prop="lastUpdatedByName">
                  <span>{{ templateForm.lastUpdatedByName }}</span>
                </el-form-item>
              </el-col>
              <el-col v-show="false" :span="12">
                <el-form-item label="修改时间" prop="lastUpdateDate">
                  <span>{{ templateForm.lastUpdateDate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="范本语言" prop="templateLanguage">
                  <!-- <span>{{ templateForm.templateLanguage }}</span> -->
                  <DictCodeToDictName
                    :parentCode="'LANGUAGE'"
                    :dictCode="templateForm.templateLanguage"
                  ></DictCodeToDictName>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="范本状态" prop="statue">
                  <!-- <span>{{ templateForm.statue }}</span> -->
                  <DictCodeToDictName
                    :parentCode="'TEMPLATE_STATUE'"
                    :dictCode="templateForm.statue"
                  ></DictCodeToDictName>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="范本说明" prop="templateDesc">
                  <span>{{ templateForm.templateDesc }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="form-bg">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="范本内容" prop="pass">
                  <span style="color:#2393F7;" @click="openIwebOffice">
                    <i class="el-icon-s-order"></i>
                    {{templateForm.templateName}}.doc
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-card>
    </div>
    <commonApproval
      :visible="visible"
      :handleCancel="handleCancel"
      :approvalParams="approvalParams"
      v-on:get-approvl-start="getApprovlStart"
    />
    <!--审批历史-->
    <common-tableappoval v-if="isFromWork" :ApprovalData="ApprovalData" :pinionsList="pinionsList" />
  </div>
</template>
<script>
import {
  getTemplate,
  repealTemplate,
  addToMy,
  getTemplateContractType,
  getTemplateUnit,
  closeOrOpenTemplate,
  listTemplate,
} from "@/service/template/index";
import { dictSelectList } from "@/service/common/index";
import { getUnitInfo, queryUserRole } from "@/service/4A/index";
import { getDetail } from "@/service/work";
import { getBussAttament } from "@/service/terms/index";
import { OpenKgWindow } from "@/utils/tools";
import { getAllUnit } from "@/service/4A/index";
import { downloadUrl } from "@/service/file";
export default {
  data() {
    return {
      templateForm: {
        contractType: "",
      },
      LanguageDict: {}, // 语言字典
      TemplateTypeDict: {}, // 范本类型
      TemplateStatus: {}, // 范本状态
      approvalParams: {},
      visible: false,
      templateUnitData: [],
      isAdmin: false, // 是否是范本管理员
      templateVersionList: [],
      contractType: "",
      contractTypeCode: "",
      contractFirstCode: "",
      maxVersion: "",
      isChooseLowVersion: false,
      isFromWork: false, //是否来自于流程中心
      ApprovalData: [],
      pinionsList: [],
      loading: false,
      loadingText: "正在处理中。。。",
    };
  },
  mounted() {
    this.getAllUnit();
  },
  created() {},
  methods: {
    async getTemplateDetail() {
      let processId = this.$route.query.id;
      const { code, data } = await getDetail({ id: processId });
      if (code === "000000") {
        this.templateForm = data;
        this.maxVersion = this.templateForm.templateVersion;
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList;
        this.getDict();
      }
    },
    async addToCommonUse(val) {
      if (val === 1) {
        const { code, data } = await addToMy(this.templateForm);
        if (code === "000000") {
          this.$message({ type: "success", message: "添加至常用范本成功！" });
        }
      } else {
        this.$router.push({
          name: "singleContract",
          query: {
            type: "add",
            dictCode: this.contractFirstCode,
            contractTypeCode: this.contractTypeCode,
            templateId: this.templateForm.templateId,
            templateAttr: "CTA001",
            typeName: "templates",
          },
        });
      }
    },
    async downLoadTemplate() {
      const { code, data } = await getBussAttament(
        this.templateForm.templateId
      );
      if (code === "000000") {
        if (data.fileId) {
          let token = this.$Cookie.get("token");
          window.location.href = downloadUrl + `/${data.fileId}?token=${token}`;
        }else{
          this.$message({ type: "error", message: "暂未获取到文档" })
        }
      }
    },
    // 获取当前人的角色
    async getCurrentPersonRole() {
      let userInfo = this.$store.state.common.userInfo;
      let params = {
        deputyAccountId: userInfo.deputyAccountId,
        roleCode: "contract_template_admin",
      };
      const { code, data } = await queryUserRole(params);
      if (code === "000000") {
        if (data.length === 0) {
          this.isAdmin = false;
        } else {
          this.isAdmin = true;
        }
        // 查询出当前范本的版本号的所有范本
        this.listTemplate();
      }
    },
    // 查看金格插件
    async openIwebOffice() {
      const { code, data } = await getBussAttament(
        this.templateForm.templateId
      );
      if (code === "000000") {
        let token = this.$Cookie.get("token");
        if (this.isAdmin) {
          // 范本管理员
          OpenKgWindow(
            "?openType=open&docFileName=" +
              encodeURIComponent(this.templateForm.templateName) +
              "&isSave=true&readType=readyOnly&operateType=template&ObjectId=" +
              this.templateForm.templateId +
              "&fileId=" +
              data.fileId +
              "&token=" +
              token
          );
        } else {
          OpenKgWindow(
            "?openType=open&docFileName=" +
              encodeURIComponent(this.templateForm.templateName) +
              "&readType=readyOnly&operateType=template&ObjectId=" +
              this.templateForm.templateId +
              "&fileId=" +
              data.fileId +
              "&token=" +
              token
          );
        }
      }
    },
    // 获取单个范本内容
    async getTemplate(id) {
      const { code, data } = await getTemplate(id);
      if (code === "000000") {
        this.templateForm = data;
        this.maxVersion = this.templateForm.templateVersion;
        this.getDict();
      }
    },
    async getUnitInfo() {
      let unitCode = this.$route.query.unitCode;
      const { code, data } = await getUnitInfo(unitCode);
      if (code === "0000000") {
        //  this.templateForm.unitName = this.$route.query.unitCode
      }
    },
    // 获取字典值
    async getDict(params) {
      this.getCurrentPersonRole();
      // 字典值取完了再去取范本合同类型
      this.getTemplateContractType();
      this.getTemplateUnitCode();
      let dictCode = {
        dictCodes: "TEMPLATE_TYPE,LANGUAGE",
      };
      const { code, data } = await dictSelectList(dictCode);
      if (code === "000000") {
        //  console.log(data,'字典值')
      }
    },
    async getTemplateContractType() {
      const { code, data } = await getTemplateContractType(
        this.templateForm.templateId
      );
      if (code === "000000") {
        this.contractType = data.contractTypeName;
        this.contractTypeCode = data.contractType;
        this.contractFirstCode = data.contractFirstTypeCode;
        // alert(this.templateForm.contractType)
      }
    },
    // 获取所有事业部
    async getAllUnit() {
      let params = {}; // 查询所有事业部不用传参数
      const { code, data } = await getAllUnit(params);
      if (code === "000000") {
        this.templateUnitData = data;
        if (this.$route.query.templateId) {
          this.getTemplate(this.$route.query.templateId); // 从filesupport服务查询
        } else {
          this.isFromWork = true;
          this.getTemplateDetail(); // 从流程服务中查询
        }
      }
    },
    async getTemplateUnitCode() {
      const { code, data } = await getTemplateUnit(
        this.templateForm.templateId
      );
      if (code === "000000") {
        if (code === "000000") {
          let unitArr = data.unitId.split(",");
          let unitNameArr = [];
          console.log(unitArr);
          unitArr.forEach((ele) => {
            unitNameArr.push(
              this.templateUnitData.find((item) => item.unitCode === ele)
                .unitName
            );
          });
          this.templateForm.unitName = unitNameArr.join(",");
        }
      }
    },
    // 优化
    optimizationTemplate() {
      this.$router.push({
        name: "managetemplate",
        query: {
          type: "optimization",
          templateId: this.templateForm.templateId,
        },
      });
    },
    // 废止
    repealTemplate() {
      this.approvalParams = {
        objectTypeCode: "TEMPLATE_APPROVAL_DISABLE",
        businessId: this.templateForm.templateId,
      };
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
    async getApprovlStart(params) {
      this.visible = false;
      this.loading = true;
      this.templateForm.sysProcessLinkHeadVo = params.sysProcessLinkHead;
      const { code, data } = await repealTemplate(this.templateForm);
      if (code === "000000") {
        this.$message({ type: "success", message: "范本废止流程发起成功" });
        this.loading = false;
        setTimeout(() => {
          this.$router.push({ name: "agencymatter" });
        }, 500);
      }
    },
    // 关闭
    async closeOrOpenTemplate() {
      const { code, data } = await closeOrOpenTemplate(this.templateForm);
      if (code === "000000") {
        this.$message({ type: "sueccess", message: "操作成功！" });
        this.$router.push({ name: "managetemplate" });
      }
    },

    // 列表获取范本
    async listTemplate() {
      if (!this.templateForm.templateNo) {
        this.templateVersionList = [];
        this.templateVersionList.push(this.templateForm);
        return;
      }
      let params = {
        statue: "TES001",
        templateNo: this.templateForm.templateNo,
      };
      if (this.isAdmin) {
        params.statue = "TES001,TES004";
      }
      const { code, data } = await listTemplate(params);
      if (code === "000000") {
        // console.log(data)
        this.templateVersionList = data;
        let arr = this.templateVersionList.sort(
          this.compare("templateVersion")
        );
        this.templateVersionList = [...arr];
      }
    },
    // 根据字段值排序
    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
      };
    },
    selectVersion(val) {
      if (parseInt(val) < parseInt(this.maxVersion)) {
        this.isChooseLowVersion = true;
      } else {
        this.isChooseLowVersion = false;
      }
      this.templateForm = {};
      this.templateForm = {
        ...this.templateVersionList.find(
          (item) => item.templateVersion === val
        ),
      };
      this.getTemplateContractType(); // 重新去获取范本的适用合同类型
      this.getTemplateUnitCode();
    },
  },
};
</script>
<style lang="less" scoped>
.temlateDetail {
}
</style>
