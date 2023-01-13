<template>
  <el-row :gutter="24" class="templateApproval">
    <el-col :span="19">
      <div class="bg-white">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix flex flex-center-between">
            <b>范本审批单</b>
          </div>
          <common-title title="基本信息" />
          <el-form
            :model="templateForm"
            :rules="rules"
            label-width="100px"
            ref="ruleForm"
            class="demo-ruleForm"
          >
            <div class="form-bg">
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="范本名称" prop="templateName">
                    <!-- <span v-show="!isEdit && !isEditStart">{{ templateForm.templateName }}</span> -->
                    <el-input v-model="templateForm.templateName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="范本编号" prop="templateNo">
                    <span>{{ templateForm.templateNo }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="范本版本号" prop="templateVersion">
                    <span>V{{ templateForm.templateVersion }}.0</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="范本类型" prop="typeName">
                    <span>{{ typeName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
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
              </el-row>
              <el-row>
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
              </el-row>
              <el-row>
                <el-col :span="12">
                  <!-- <el-form-item v-show="!isEdit && !isEditStart" label="范本语言" prop="templateLanguageName">
                    <span>{{ templateLanguageName }}</span>
                  </el-form-item>-->
                  <el-form-item label="范本语言" prop="templateLanguage">
                    <common-select
                      v-model="templateForm.templateLanguage"
                      dictCode="LANGUAGE"
                      :value="templateForm.templateLanguage"
                      placeholder="请选择范本语言"
                      :isSplicing="false"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="范本状态" prop="statueName">
                    <span>{{statueName }}</span>
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
                      v-model="templateForm.templateDesc"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div class="form-bg" v-show="isEdit">
              <el-row :gutter="24">
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
                <!-- <el-col :span="12">
                  <el-form-item label="范本生效期" prop="startTime">
                    <el-date-picker
                      class="w-100"
                      v-model="templateForm.startTime"
                      value-format="yyyy-MM-dd hh:mm:ss"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="范本失效效期" prop="endTime">
                    <el-date-picker
                      v-model="templateForm.endTime"
                      value-format="yyyy-MM-dd hh:mm:ss"
                      class="w-100"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>-->
                <el-col :span="12">
                  <el-form-item label="展现金额区域" prop="showmoney">
                    <el-radio v-model="templateForm.showmoney" label="1">展示</el-radio>
                    <el-radio v-model="templateForm.showmoney" label="0">不展示</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否使用批量合同功能" prop="batchFlag">
                    <el-radio v-model="templateForm.batchFlag" label="1">是</el-radio>
                    <el-radio v-model="templateForm.batchFlag" label="0">否</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合同有效期类型" prop="contractValidityType">
                    <common-select
                      v-model="templateForm.contractValidityType"
                      dictCode="VILAD_TYPE"
                      :value="templateForm.contractValidityType"
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
          <!--审批历史-->
          <common-tableappoval :ApprovalData="ApprovalData" :pinionsList="pinionsList" />
        </el-card>
      </div>
    </el-col>
    <el-col :span="5">
      <common-mode v-on:getApprovalParams="getApprovalParams"></common-mode>
    </el-col>
    <el-dialog title="合同类型" :visible.sync="dialogVisible" width="30%">
      <el-tree
        v-loading="isgetDataTree"
        :data="dataTree"
        ref="tree"
        :props="props"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  getAuditApprove,
  getDetail,
  rejectProcess,
  getConsult,
} from "@/service/work";
import { dictSelectList } from "@/service/common/index";
import { getBussAttament } from "@/service/terms/index";
import { OpenKgWindow } from "@/utils/tools";
import {
  getContractTreeList,
  saveTemplateInfoAndHistory,
  getTemplateUnit,
  getTemplateContractType,
  getTemplateBookMarks,
} from "@/service/template/index";
import { getAllUnit } from "@/service/4A/index";

export default {
  data() {
    return {
      value: "",
      templateForm: {
        // startTime: "",
        // endTime: "",
      },
      templateUnitForm: {
        unitId: [],
      }, //范本与事业部
      templateTypeForm: {}, //合同类型
      templateUnitData: [],
      tableData: [
        {
          a: "签订合同",
          b: "2020-08-04",
          c: "张三",
        },
      ],
      ApprovalData: [],
      pinionsList: [],
      uploadParams: {
        bizType: "项目变更", //业务分类
        bizTypeCode: "2013101", //业务类型编码
      },
      validPeriod: [],
      radio: "1",
      LanguageDict: {},
      TemplateTypeDict: {},
      templateStatus: {},
      dialogVisible: false,
      templateLanguageName: "", // 范本语言，只用于展示
      typeName: "", //范本类型，只用于展示
      statueName: "", //范本状态，只用于展示
      dataTree: [],
      props: {
        children: "dictVoList",
        label: "dictName",
      },
      isgetDataTree: false,
      isEdit: false, // 是否为法务专员或者法务经理
      isEditStart: false, //如果是开始节点，只允许修改基础数据
      isTemplateAdmin: false, // 是否为范本管理员
      isShowTitle: true, // 是否显示
      contractType: "",
      rules: {
        contractTypeName: [
          {
            required: true,
            message: "请选择合同类型",
            trigger: "blur",
          },
        ],
        unitId: [
          {
            required: true,
            message: "请选择适用组织范围",
            trigger: "blur",
          },
        ],
        showmoney: [
          {
            required: true,
            message: "请选择是否展示金额区域",
            trigger: "blur",
          },
        ],
        batchFlag: [
          {
            required: true,
            message: "请选择是否使用批量功能",
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
      },
      parentNodedData: [], // 获取二级一级一级的树形数据
    };
  },
  created() {
    this.$store.dispatch("setHeight", 120);
  },
  mounted() {
    let cusTaskKey = this.$route.query.customizeTaskKey;
    let taskKey = this.$route.query.taskKey;
    let objectTypeCode = this.$route.query.objectTypeCode;
    // if ( //根据客户需求，将这几个放到范本管理员的位置
    //   cusTaskKey === "CORE-LEGAL-FWZY" ||
    //   cusTaskKey === "CORE-LEGAL-MANAGER"
    // ) {
    //   this.isEdit = true;
    // }
    if (cusTaskKey === "contract_template_admin") {
      //判断是否为范本管理员
      this.isTemplateAdmin = true;
      this.isEdit = true;
    }
    if (
      // cusTaskKey !== "CORE-LEGAL-FWZY" &&
      // cusTaskKey !== "CORE-LEGAL-MANAGER" &&
      cusTaskKey !== "contract_template_admin"
    ) {
      this.isShowTitle = false;
    }

    if (objectTypeCode === "TEMPLATE_APPROVAL_DISABLE") {
      this.isEdit = false;
    }
    if (taskKey === "start") {
      this.isEditStart = true;
    }
    this.getTemplateDetail();
  },

  methods: {
    async getTemplateDetail() {
      let processId = this.$route.query.id;
      const { code, data } = await getDetail({ id: processId });
      if (code === "000000") {
        this.templateForm = data;
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList;
        this.getTemplateContractType();
        this.getAllUnit();
        this.getDict();
        // 去查询合同类型和适用组织范围
        this.getContractTypeAndUnit();
      }
    },
    // 去查询合同类型和适用组织范围
    getContractTypeAndUnit() {},
    // 获取范本的事业部
    async getTemplateUnit() {
      const { code, data } = await getTemplateUnit(
        this.templateForm.templateId
      );
      if (code === "000000") {
        if (data.unitId) {
          this.templateUnitForm.unitId = data.unitId.split(",");
        }
      }
    },
    // 获取字典纸
    async getDict(params) {
      let dictCode = {
        dictCodes: "TEMPLATE_TYPE,LANGUAGE,TEMPLATE_STATUE",
      };
      const { code, data } = await dictSelectList(dictCode);
      if (code === "000000") {
        //  console.log(data,'字典值')

        if (data.length > 0) {
          data.forEach((ele) => {
            if (ele.dictCode === "LANGUAGE") {
              this.LanguageDict = ele;
              let obj = this.LanguageDict.dictVoList.find(
                (item) => item.dictCode === this.templateForm.templateLanguage
              );
              this.templateLanguageName = obj.dictName;
            } else if (ele.dictCode === "TEMPLATE_TYPE") {
              this.TemplateTypeDict = ele;
              this.typeName = this.TemplateTypeDict.dictVoList.find(
                (item) => item.dictCode === this.templateForm.type
              ).dictName;
            } else if (ele.dictCode === "TEMPLATE_STATUE") {
              this.templateStatus = ele;
              this.statueName = this.templateStatus.dictVoList.find(
                (item) => item.dictCode === this.templateForm.statue
              ).dictName;
            }
          });
        }
      }
    },
    // 去判断是否该范本已经写入了书签
    async getTmeplateBookMarks(params) {
      let obj = {
        businessId: this.templateForm.templateId,
        businessType: "template",
      };
      const { code, data } = await getTemplateBookMarks(obj);
      if (code === "000000") {
        if (data.length > 0) {
          const { code, data } = await saveTemplateInfoAndHistory(
            this.templateForm
          );
          if (code === "000000") {
            this.dealApprovalData(params);
          }
        } else {
          this.$message({
            type: "error",
            message: "请进行范本维护（打书签）工作后再点击【通过】",
          });
        }
      }
    },
    // 流程审批
    async getApprovalParams(params) {
      // 先将页面上的数据存到数据库，//templateTypeForm为适用合同类型 ，templateUnitForm为适用事业部
      if (this.isEdit && params.type === "adopt") {
        if (this.templateTypeForm.contractType) {
          // 适用合同类型
          this.templateForm.templateTypeForm = this.templateTypeForm;
        } else {
          this.$message({ type: "error", message: "请选择适用合同类型" });
          return;
        }
        if (this.templateUnitForm.unitId.length > 0) {
          let templateUnitObj = {
            unitId: this.templateUnitForm.unitId.join(","),
          };
          // 事业部
          this.templateForm.templateUnitForm = templateUnitObj;
        } else {
          this.$message({ type: "error", message: "请选择适用组织范围" });
          return;
        }
        if (!this.templateForm.showmoney) {
          // 是否展示金额
          this.$message({ type: "error", message: "请勾选展示金额区域" });
          return;
        }
        if (!this.templateForm.batchFlag) {
          // 是否勾选为批量
          this.$message({
            type: "error",
            message: "请勾选是否使用批量合同功能",
          });
          return;
        }
      }
      // 如果是范本管理员并且点击通过的时候需要判断是否有书签
      if (this.isTemplateAdmin && params.type === "adopt") {
        this.getTmeplateBookMarks(params);
      } else {
        const { code, data } = await saveTemplateInfoAndHistory(
          this.templateForm
        );
        if (code === "000000") {
          this.dealApprovalData(params);
        }
      }
    },
    // 操作组件返回的内容
    async dealApprovalData(params) {
      if (params.type === "adopt") {
        // 提交或者通过
        //点击通过按钮
        const { code } = await getAuditApprove({
          id: this.$route.query.id,
          bpmProcessTaskOpinionsFormList: params.list,
        });
        if (code === "000000") {
          this.$message({ type: "success", message: "审批成功！" });
          setTimeout(() => {
            this.$router.push({ name: "agencymatter" });
          }, 500);
        }
      } else if (params.type === "return") {
        // 退回
        let obj = {
          id: this.$route.query.id,
          ecmContractProcessConfigVoList: params.VoList,
          bpmProcessTaskOpinionsFormList: params.list,
        };
        const { code, data } = await rejectProcess(obj);
        if (code === "000000") {
          this.$message({ type: "success", message: "退回成功！" });
          setTimeout(() => {
            this.$router.push({ name: "agencymatter" });
          }, 500);
        }
      } else if (params.type === "opinion") {
        // 意见征询
        const { code } = await getConsult({
          id: this.$route.query.id,
          bpmProcessTaskOpinionsFormList: params.list,
          userVoList: params.userVoList,
        });
        if (code === "000000") {
          this.$router.push({ name: "agencymatter" });
        }
      }
    },
    // 条款类型树形结构展示
    async getContractType() {
      this.dialogVisible = true;
      if (this.dataTree.length > 0) {
        return;
      }
      this.isgetDataTree = true;
      let dictCode = {
        dictCode: "INCOME_EXPE_TYPE",
        attribute1: "4",
      };
      const { code, data } = await getContractTreeList(dictCode);
      if (code === "000000") {
        console.log(data);
        this.dataTree = data;
        this.isgetDataTree = false;
      } else {
        this.isgetDataTree = false;
      }
    },
    // 树形选择
    handleNodeClick(data, node) {
      // 只能选择三级节点
      if (data.dictVoList === null) {
        // 使用递归查询出二级以及一级的合同类型
        this.getParentNodeData(node);

        // 取0个数据(二级)和第一个数据（一级），
        if (this.parentNodedData.length > 0) {
          this.templateTypeForm.contractFirstType = this.parentNodedData[1].dictName;
          this.templateTypeForm.contractFirstTypeCode = this.parentNodedData[1].dictCode;

          this.templateTypeForm.contractSecondType = this.parentNodedData[0].dictName;
          this.templateTypeForm.contractSecondTypeCode = this.parentNodedData[0].dictCode;

          this.templateTypeForm.contractTypeName =
            this.parentNodedData[1].dictName +
            "-" +
            this.parentNodedData[0].dictName +
            "-" +
            data.dictName; // 该属性只用于展示
          this.templateForm.contractTypeName = data.dictCode;
          this.templateTypeForm.contractType = data.dictCode;
        }

        this.dialogVisible = false;
      }
    },
    getParentNodeData(node) {
      for (let key in node) {
        if (key == "parent") {
          if (node[key] && node[key].data) {
            this.parentNodedData.push(node[key].data);
            this.getParentNodeData(node[key]);
          }
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
        this.getTemplateUnit(); // 获取当前范本的事业部
      }
    },
    // 从金格打开
    async openIwebOffice() {
      const { code, data } = await getBussAttament(
        this.templateForm.templateId
      );
      if (code === "000000") {
        let token = this.$Cookie.get("token");
        OpenKgWindow(
          "?openType=open&docFileName=" +
            encodeURIComponent(this.templateForm.templateName) +
            "&isSave=true&batchFlag=" +
            this.templateForm.batchFlag +
            "&templateAdmin=" +
            this.isTemplateAdmin +
            "&operateType=template&ObjectId=" +
            this.templateForm.templateId +
            "&fileId=" +
            data.fileId +
            "&token=" +
            token
        );
      }
    },
    async getTemplateContractType() {
      const { code, data } = await getTemplateContractType(
        this.templateForm.templateId
      );
      if (code === "000000") {
        this.templateTypeForm.contractTypeName = data.contractTypeName; // 该属性只用于展示
        this.templateTypeForm.contractType = data.contractType;
        this.contractType = data.contractTypeName;
        // alert(this.contractType)
        // alert(this.templateForm.contractType)
      }
    },
  },
};
</script>

<style lang="less">
.templateApproval {
  .el-input__inner {
    border: 1px solid #dcdfe6;
  }
  .el-form-item.is-error .el-input__inner,
  .el-form-item.is-error .el-input__inner:focus,
  .el-form-item.is-error .el-textarea__inner,
  .el-form-item.is-error .el-textarea__inner:focus,
  .el-message-box__input input.invalid,
  .el-message-box__input input.invalid:focus {
    border-color: #dcdfe6 !important;
  }

  .el-form-item__error {
    display: none !important;
  }
}
</style>
