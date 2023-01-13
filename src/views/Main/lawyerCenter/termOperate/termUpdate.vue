<template>
  <div class="termUpdate">
    <div class="bg-white">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix flex flex-center-between">
          <b class="ft18">更新条款</b>
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
                  <el-input
                    @click.native="chooseTerm"
                    v-model="ruleFormNew.termsName"
                    placeholder="请输入条款名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="条款编号" prop="pass">
                  <el-input :disabled="true" v-model="ruleFormNew.termsNo" placeholder></el-input>
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
                    {{ruleFormNew.termsName==null?'请先选择条款':ruleFormNew.termsName+'.doc'}}
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div>
            <el-button type="primary" @click="confirmData" icon="iconfont sbt_add">提交</el-button>
            <common-title class="ft16 mt10" title="使用该条款的范本" />
            <div class="bg-white user-form-table">
              <el-table
                class="mt10 md20"
                :data="tableData"
                ref="dataTable"
                highlight-current-row
                style="width: 100%"
                @selection-change="handleSelectionChange"
                :header-cell-style="{background:'#f3f3f3'}"
                size="small"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="attribute2" label="范本名称"></el-table-column>
                <el-table-column prop="attribute1" label="范本编号"></el-table-column>
                <el-table-column prop="createdByName" label="创建人"></el-table-column>
                <el-table-column prop="attribute3" label="适用组织范围"></el-table-column>
                <el-table-column prop="attribute5" label="适用合同类型"></el-table-column>
                <el-table-column property="attribute6" label="版本号">
                <template slot-scope="scope">V{{scope.row.attribute6}}.0</template>
              </el-table-column>
                <el-table-column prop="statue" label="范本状态">
                  <template slot-scope="scope">
                    <DictCodeToDictName
                    :parentCode="'TEMPLATE_STATUE'"
                    :dictCode="scope.row.statue"
                  ></DictCodeToDictName>
                  </template>
                </el-table-column>
              </el-table>
              <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
            </div>
          </div>
        </el-form>
      </el-card>
    </div>
    <el-dialog title="条款选择" :visible.sync="dialogTableVisible">
      <el-table :data="termsData" @row-click="chooseRow">
        <el-table-column property="termsName" label="条款名称"></el-table-column>
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerTermCurrentPage" :list="serchTermForm"></common-pagination>
    </el-dialog>

    <commonApproval
      :visible="approvalVisible"
      :handleCancel="handleCancel"
      :approvalParams="approvalParams"
      v-on:get-approvl-start="getApprovlStart"
    />
  </div>
</template>

<script>
import {
  getTermInfo,
  getTemplateWithTerms,
  getTermsByPage,
  clickUpdate,
  getBussAttament,
} from "@/service/terms/index";
import { dictSelectList } from "@/service/common/index";
import { getAllUnit } from "@/service/4A/index";
import { OpenKgWindow } from "@/utils/tools";
export default {
  data() {
    return {
      ruleForm: {},
      tableData: [],
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      templateStatus: [],
      templateUnitData: [],
      ruleFormNew: {},
      dialogTableVisible: false,
      termsData: [],
      serchTermForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      choosedTemplates: [],
      approvalVisible: false,
      approvalParams: {},
    };
  },
  mounted() {
    // this.ruleForm = JSON.parse(this.$route.query.termInfo)
    this.getAllUnit();
  },
  methods: {
    async getTermInfo(termsId) {
      const { code, data } = await getTermInfo(termsId);
      if (code === "000000") {
        this.ruleForm = data;
        this.chooseTemplate();
      }
    },
    // 获取所有事业部
    async getAllUnit() {
      let params = {}; // 查询所有事业部不用传参数
      const { code, data } = await getAllUnit(params);
      if (code === "000000") {
        this.templateUnitData = data;
        let termId = this.$route.query.termId;
        this.getTermInfo(termId);
      }
    },

    // 查看当前条款的范本
    async chooseTemplate() {
      let params = {
        termsId: this.ruleForm.termsId,
        currentPage: this.searchForm.currentPage,
        pageSize: this.searchForm.pageSize,
      };
      const { code, data } = await getTemplateWithTerms(params);
      if (code === "000000") {
        if (data && data.records && data.records.length > 0) {
          this.tableData = data.records;
          this.choosedTemplates = [...data.records]; // 先将数据全部存过去，默认为全选中
          if (this.tableData.length > 0) {
            this.tableData.forEach((ele) => {
              ele.attribute3 = this.templateUnitData.find(
                (item) => item.unitCode === ele.attribute3
              ).unitName;
            });
            this.searchForm.currentPage = data.current;
            this.searchForm.total = data.total;
          }
          this.getDict();
        } else {
          this.$message({ type: "info", message: "该条款暂未关联范本！" });
        }
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
    // 弹出条款选择
    chooseTerm() {
      this.dialogTableVisible = true;
      this.getTermss();
    },
    // 选择的条款
    chooseRow(row, column, event) {
      this.ruleFormNew = row;
      this.dialogTableVisible = false;
    },
    // 查询条款数据
    async getTermss() {
      const { code, data } = await getTermsByPage(this.serchTermForm);
      if (code && code === "000000") {
        this.termsData = data.records;
        console.log(data);
        this.serchTermForm.pageSize = 10;
        this.serchTermForm.total = data.total;
      }
    },
    // 选择条款的分页组件返回
    handlerTermCurrentPage(val) {
      this.serchTermForm.currentPage = val.currentPage;
      this.serchTermForm.pageSize = val.pageSize;
      this.getTermss();
    },
    handleSelectionChange(val) {
      this.choosedTemplates = [];
      this.choosedTemplates = val;
    },
    // 分页操作
    handlerCurrentPage() {},
    async openIwebOffice(ruleForm) {
      if(!ruleForm.termsId){
        this.$message({type:'error',message:'请先选择需要更新的条款！'})
        return
      }
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
    // 提交按钮
    confirmData() {
      if (!this.ruleFormNew.termsName) {
        this.$message({ type: "error", message: "请选择新条款！" });
        return;
      }
      this.approvalParams = {
        objectTypeCode: "TERMS_APPROVAL_UPDATE",
        businessId: this.ruleFormNew.termsId,
      };
      this.approvalVisible = true;
    },
    handleCancel() {
      this.approvalVisible = false;
    },
    async getApprovlStart(params) {
      let obj = {
        termsInfoForm: this.ruleForm,
        termsInfoFormNew: this.ruleFormNew,
      };
      obj.sysProcessLinkHeadVo = params.sysProcessLinkHead;
      if(this.choosedTemplates.length>0){
          this.choosedTemplates.forEach(ele =>{
              ele.templateNo = ele.attribute1
          })
      }
      obj.templateInfoFormList = this.choosedTemplates;
      const { code, data } = await clickUpdate(obj);
      if (code === "000000") {
        this.$message({ type: "success", message: "一键更新流程发起成功！" });
        setTimeout(() => {
          this.$router.push({ name: "agencymatter" });
        }, 500);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.termUpdate {
}
</style>
