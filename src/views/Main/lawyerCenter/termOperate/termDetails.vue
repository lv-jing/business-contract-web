<template>
  <div class="bg-white">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <b class="ft18">条款详情</b>
        <div style="float:right;">
          <el-button @click="gotoUpdateTerm">一键更新</el-button>
          <el-button @click="goBack">返回</el-button>
          <!-- <el-button type="primary" @click="addToTemplate">添加至范本</el-button> -->
        </div>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
        <common-title class="ft16" title="条款信息：" />
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
            <el-col :span="12">
              <el-form-item label="创建人：" prop="createdByName">
                <span>{{ ruleForm.createdByName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间：" prop="creationDate">
                <span>{{ ruleForm.creationDate }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="条款语言：" prop="termsLanguage">
                <span>{{ ruleForm.termsLanguage }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="条款内容" prop="pass">
                <span style="color:#2393F7;" @click="openIwebOffice">
                  <i class="el-icon-s-order"></i>
                  {{ruleForm.termsName}}.doc
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div>
          <common-title class="ft16" title="使用该条款的范本" />
          <div class="bg-white user-form-table">
            <el-table
              class="mt10 md20"
              :data="tableData"
              stripe
              highlight-current-row
              style="width: 100%"
              :header-cell-style="{background:'#f3f3f3'}"
              @row-click="rowClick"
              size="small"
            >
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column prop="attribute2" label="范本名称"></el-table-column>
              <el-table-column prop="attribute1" label="范本编号"></el-table-column>
              <el-table-column prop="attribute7" label="创建人"></el-table-column>
              <el-table-column prop="attribute3" label="适用组织范围">
                <template slot-scope="scope">
                  {{getTemplateUnitCode(scope.row)}}
                </template>
              </el-table-column>
              <el-table-column prop="attribute4" label="适用合同类型">
                <template slot-scope="scope">
                  <DictCodeToDictName
                    :parentCode="'INCOME_EXPE_TYPE'"
                    :dictCode="scope.row.attribute4"
                  ></DictCodeToDictName>
                </template>
              </el-table-column>
              <el-table-column property="attribute6" label="版本号">
                <template slot-scope="scope">V{{scope.row.attribute6}}.0</template>
              </el-table-column>
              <el-table-column prop="statue" label="范本状态">
                <template slot-scope="scope">
                  <DictCodeToDictName :parentCode="'TEMPLATE_STATUE'" :dictCode="scope.row.statue"></DictCodeToDictName>
                </template>
              </el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
          </div>
        </div>
        <div class="bg-white user-form-table">
          <common-tableappoval :ApprovalData="ApprovalData" :pinionsList="pinionsList" />
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getTermInfo,
  getBussAttament,
  getTemplateWithTerms,
} from "@/service/terms/index";
import { getTemplateUnit } from "@/service/template/index";
import { getDetail } from "@/service/work";
import { OpenKgWindow } from "@/utils/tools";
import { dictSelectList } from "@/service/common/index";
import { getAllUnit } from "@/service/4A/index";
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
      TemplateTypeDict: [],
      templateStatus: [],
      templateUnitData: [],
      isFromWork: false, //是否从已办过来
      ApprovalData: [],
      pinionsList: [],
      contractType: "", // 合同类型
    };
  },
  mounted() {
    this.getAllUnit();
  },
  methods: {
    // 获取所有事业部
    async getAllUnit() {
      let params = {}; // 查询所有事业部不用传参数
      const { code, data } = await getAllUnit(params);
      if (code === "000000") {
        this.templateUnitData = data;
        if (this.$route.query.termId) {
          // 从条款首页过来
          this.getTermInfoo(this.$route.query.termId);
        } else {
          // 从已办中过来
          this.isFromWork = true;
          this.gettermInfo();
        }
      }
    },
    // 查看当前条款的范本
    async chooseTemplate() {
      let params = {
        termsId: this.ruleForm.termsId,
        currentPage: this.searchForm.currentPage,
        pageSize: 10,
      };
      this.templateData = [];
      const { code, data } = await getTemplateWithTerms(params);
      if (code === "000000") {
        this.getDict();
        if (data && data.records && data.records.length > 0) {
          this.tableData = data.records;
          if (this.tableData.length > 0) {
            // this.tableData.forEach((ele) => {
            //   ele.attribute3 = this.templateUnitData.find(
            //     (item) => item.unitCode === ele.attribute3
            //   ).unitName;
            // });

            this.searchForm.currentPage = data.current;
            this.searchForm.pageSize = 10;
            this.searchForm.total = data.total;

          }
        } else {
          this.$message({ type: "info", message: "该条款暂未关联范本！" });
        }
      }
    },
    // 获取条款内容
    async gettermInfo() {
      let processId = this.$route.query.id;
      const { code, data } = await getDetail({ id: processId });
      if (code === "000000") {
        this.ruleForm = data;
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList;
        this.chooseTemplate();
        // 获取条款数据后再去字典值进行匹配
      }
    },
    // 分页操作
    handlerCurrentPage(list) {
      this.searchForm = {
        ...this.searchForm,
        ...list,
      };
      this.chooseTemplate();
    },
    async getTermInfoo(id) {
      const { code, data } = await getTermInfo(id);
      if (code === "000000") {
        this.ruleForm = data;
        this.chooseTemplate();
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
          if (ele.dictCode === "LANGUAGE") {
            this.LanguageDict = ele;
            this.ruleForm.termsLanguage = this.LanguageDict.dictVoList.find(
              (item) => item.dictCode === this.ruleForm.termsLanguage
            ).dictName;
          } else if (ele.dictCode === "TEMPLATE_STATUE") {
          }
        });
      }
    },
    // 首先要从接口拿到数据
    async openIwebOffice() {
      const { code, data } = await getBussAttament(this.ruleForm.termsId);
      if (code === "000000") {
        let token = this.$Cookie.get("token");
        console.log(token);
        OpenKgWindow(
          "?openType=open&docFileName=" +
            encodeURIComponent(this.ruleForm.termsName) +
            "&readType=readyOnly&operateType=term&ObjectId=" +
            this.ruleForm.termsId +
            "&fileId=" +
            data.fileId +
            "&token=" +
            token
        );
      }
    },
    // 一键更新
    gotoUpdateTerm() {
      this.$router.push({
        name: "terms",
        query: { type: "update", termId: this.ruleForm.termsId },
      });
    },
    //返回
    goBack(){
      this.$router.push({name:'terms'})
    },
    //添加至范本
    addToTemplate() {},
    // 点击某一行，跳转到范本详情
    rowClick(row, column, event) {
      // console.log(JSON.stringify(row))
      // return
      this.$router.push({
        name: "managetemplate",
        query: {
          type: "detail",
          templateId: row.templateId,
          contractType: row.attribute5,
          unitCode: row.attribute3,
        },
      });
    },
    getTemplateUnitCode(row) {
      let unitArr = row.attribute3.split(",");
      let unitNameArr = [];
      console.log(unitArr);
      unitArr.forEach((ele) => {
        unitNameArr.push(
          this.templateUnitData.find((item) => item.unitCode === ele).unitName
        );
      });
      return unitNameArr.join(",");
    },
  },
};
</script>

<style lang="less" scoped>
</style>
