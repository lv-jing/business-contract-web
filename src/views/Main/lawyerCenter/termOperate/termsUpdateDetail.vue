<template>
  <el-row :gutter="24">
    <el-col :span="24">
      <div class="termUpdate">
        <div class="bg-white">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix flex flex-center-between">
              <b class="ft18">更新条款详情</b>
            </div>
            <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" label-width="130px">
              <common-title class="ft16" title="原条款信息" />
              <div class="form-bg">
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="条款名称：" prop="termsName">
                      <span>{{ ruleForm.termsName }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="条款编号：" prop="termsNo">
                      <span>{{ ruleForm.termsNo }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="form-bg">
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="条款内容" prop="pass">
                      <span style="color:#2393F7;" @click="openIwebOffice(ruleForm)">
                        <i class="el-icon-s-order"></i>
                        {{ruleForm.termsName}}.doc
                      </span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <common-title class="ft16" title="新条款信息" />
              <div class="form-bg">
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="条款名称" prop="pass">
                      <span>{{ruleFormNew.termsName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="条款编号" prop="pass">
                      <span>{{ruleFormNew.termsNo}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <div class="form-bg">
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="条款内容" prop="pass">
                      <span style="color:#2393F7;" @click="openIwebOffice(ruleFormNew)">
                        <i class="el-icon-s-order"></i>
                        {{ruleFormNew.termsName==null?'选择范本':ruleFormNew.termsName+'.doc'}}
                      </span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <div>
                <common-title class="ft16 mt10" title="使用该条款的范本" />
                <div class="bg-white user-form-table">
                  <el-table
                    class="mt10 md20"
                    :data="tableData"
                    ref="dataTable"
                    highlight-current-row
                    style="width: 100%"
                    :header-cell-style="{background:'#f3f3f3'}"
                    size="small"
                  >
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="templateName" label="范本名称"></el-table-column>
                    <el-table-column prop="templateNo" label="范本编号"></el-table-column>
                    <el-table-column property="attribute6" label="版本号">
                      <template slot-scope="scope">V{{scope.row.attribute6}}.0</template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-form>
          </el-card>
        </div>
      </div>
      <!--审批历史-->
      <common-tableappoval :ApprovalData="ApprovalData" :pinionsList="pinionsList" />
    </el-col>
  </el-row>
</template>

<script>
import {
  getTermInfo,
  clickUpdate,
  getTemplateFromTerm,
  getBussAttament,
} from "@/service/terms/index";
import { dictSelectList } from "@/service/common/index";
import { getAllUnit } from "@/service/4A/index";
import { OpenKgWindow } from "@/utils/tools";
import {
  getAuditApprove,
  getDetail,
  rejectProcess,
  getConsult,
} from "@/service/work";
export default {
  data() {
    return {
      ruleForm: {},
      tableData: [],
      templateStatus: [],
      templateUnitData: [],
      ruleFormNew: {},
      serchTermForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      choosedTemplates: [],
      termsUpdate: {},
      ApprovalData: [],
      pinionsList: [],
    };
  },
  mounted() {
    const { taskKey, operationType, sourceType } = this.$route.query;
    this.getAllUnit();
    // this.ruleForm = JSON.parse(this.$route.query.termInfo)
  },
  methods: {
    // 获取条款更新的表
    async getTermsUpdate() {
      let processId = this.$route.query.id;
      const { code, data } = await getDetail({ id: processId });
      if (code === "000000") {
        this.termsUpdate = data;
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList;

        this.getTermsInfoNew(this.termsUpdate.termsId);
        this.getTermsInfo(this.termsUpdate.updateTermsId);
        // this.getAllUnit();
        // 获取条款数据后再去字典值进行匹配
        // this.getDict();
      }
    },
    // 获取新条款的数据
    async getTermsInfoNew(termsId) {
      const { code, data } = await getTermInfo(termsId);
      if (code === "000000") {
        this.ruleFormNew = data;
      }
    },
    // 获取原条款的数据
    async getTermsInfo(termsId) {
      const { code, data } = await getTermInfo(termsId);
      if (code === "000000") {
        this.ruleForm = data;
        this.chooseTemplate();
      }
    },
    // 组件返回的数据
    async getApprovalParams(params) {
      //先存储下数据到数据库顺便把数据存到历史表中
      this.dealApprovalData(params);
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
          this.$message({ type: "success", message: "意见征询发起成功！" });
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
        this.templateUnitData = data;
        this.getTermsUpdate();
      }
    },

    // 查看当前条款勾选的范本
    async chooseTemplate() {
      let params = {
        processTermsUpId: this.termsUpdate.processTermsUpdateId,
      };
      const { code, data } = await getTemplateFromTerm(params);
      if (code === "000000") {
        this.tableData = data;
      }
    },
    // 获取字典，可以传多个值
    async getDict() {
      let dictCode = {
        dictCodes: "LANGUAGE,TEMPLATE_TYPE,TEMPLATE_STATUE",
      };
      const { code, data } = await dictSelectList(dictCode);
      if (data.length > 0) {
        data.forEach((ele) => {
          if (ele.dictCode === "TEMPLATE_STATUE") {
            this.templateStatus = ele;
            if (this.tableData.length > 0) {
              this.tableData.forEach((ele) => {
                ele.statue = this.templateStatus.dictVoList.find(
                  (item) => item.dictCode === ele.statue
                ).dictName;
              });
            }
          }
        });
        // 必须等数据全部加载完了才可以去全选
        this.tableData.forEach((ele) => {
          this.$refs.dataTable.toggleRowSelection(ele);
        });
      }
    },
    // 选择的条款
    chooseRow(row, column, event) {
      this.ruleFormNew = row;
      this.dialogTableVisible = false;
    },
    // 分页操作
    handlerCurrentPage() {},
    // 首先要从接口拿到数据
    async openIwebOffice(ruleForm) {
      const { code, data } = await getBussAttament(ruleForm.termsId);
      if (code === "000000") {
        let token = this.$Cookie.get("token");
        console.log(token);
        OpenKgWindow(
          "?openType=open&docFileName="+encodeURIComponent(ruleForm.termsName)+"&readType=readyOnly&operateType=term&ObjectId=" +
            ruleForm.termsId +
            "&fileId=" +
            data.fileId +
            "&token=" +
            token
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
.termUpdate {
}
</style>
