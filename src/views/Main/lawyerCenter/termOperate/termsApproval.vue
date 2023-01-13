<template>
  <el-row :gutter="24">
    <el-col :span="19">
      <div class="bg-white">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix flex flex-center-between">
            <b>条款审批单</b>
          </div>
          <common-title title="基本信息" />
          <el-form :model="ruleForm" label-width="100px" ref="ruleForm" class="demo-ruleForm">
            <div class="form-bg">
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="条款名称：" prop="termsName">
                    <span v-show="!isStart">{{ ruleForm.termsName }}</span>
                    <div v-show="isStart">
                      <el-select style="width:30%;" disabled v-model="obj.termsType" placeholder="请选择条款类型">
                        <el-option
                          v-for="item in termTypeData"
                          :key="item.dictName"
                          :label="item.dictName"
                          :value="item.dictName"
                        ></el-option>
                      </el-select>

                      <el-input
                        disabled
                        style="width:30%;margin-left:5%;"
                        v-model="obj.termsOption"
                        placeholder="请输入适用场景"
                      ></el-input>
                      <el-select
                        style="width:30%;margin-left:5%;"
                        v-model="obj.unitName"
                        disabled
                        placeholder="请选择事业部"
                      >
                        <el-option
                          v-for="item in templateUnitData"
                          :key="item.unitCode"
                          :label="item.unitName"
                          :value="item.unitName"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="条款编号：" prop="termsNo">
                    <span>{{ ruleForm.termsNo }}</span>
                  </el-form-item>
                </el-col>
                </el-row>
                <el-row>
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
                </el-row>
                <el-row>
                <el-col :span="12">
                  <el-form-item v-show="!isStart" label="条款语言：" prop="termsLanguageShow">
                    <span>{{termsLanguageShow }}</span>
                  </el-form-item>
                  <el-form-item v-show="isStart" label="条款语言：" disabled prop="termsLanguage">
                    <common-select
                      v-model="ruleForm.termsLanguage"
                      dictCode="LANGUAGE"
                      :value="ruleForm.termsLanguage"
                      placeholder="请选择条款语言"
                      :isSplicing="false"
                    />
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
          </el-form>
          <!--审批历史-->
          <common-tableappoval :ApprovalData="ApprovalData" :pinionsList="pinionsList" />
        </el-card>
      </div>
    </el-col>
    <el-col :span="5">
      <common-mode v-on:getApprovalParams="getApprovalParams"></common-mode>
    </el-col>
  </el-row>
</template>
<script>
/* eslint-disable */
import CommonUpload from "@/components/CommonUpload"; // 上传
import { getBussAttament, saveTermInfoAndHistory } from "@/service/terms/index";
import { OpenKgWindow } from "@/utils/tools";
import { dictSelectList } from "@/service/common/index";
import { getAllUnit } from "@/service/4A/index";
import {
  getAuditApprove,
  getDetail,
  rejectProcess,
  getConsult,
} from "@/service/work";
export default {
  components: {
    CommonUpload,
  },
  data() {
    return {
      value: "",
      ruleForm: {
        termsName: "",
        termsOption: "",
        termsType: "",
        unitName: "",
      },
      tableData: [
        {
          a: "签订合同",
          b: "2020-08-04",
          c: "张三",
        },
      ],
      ApprovalData: [],
      pinionsList: [], // 审批意见数据
      uploadParams: {
        bizType: "项目变更", //业务分类
        bizTypeCode: "2013101", //业务类型编码
      },
      LanguageDict: {},
      options: [],
      isStart: false,
      termsLanguageShow: "", // 条款语言，只限于展示
      termTypeData: [],
      obj: {
        termsOption: "",
        termsType: "",
        unitName: "",
      },
      templateUnitData: [],
      taskKey:''
    };
  },
  created() {
    this.$store.dispatch("setHeight", 120);
  },
  mounted() {
    const { taskKey, operationType, sourceType } = this.$route.query;
    this.taskKey = taskKey
    if (sourceType !== "INAPPROPRIATEPROCESS") {
      //表示已经退回到了第一个发起流程的人
      this.isStart = true;
    }
    this.getAllUnit();
    this.gettermInfo();
  },

  methods: {
    // 获取所有事业部
    async getAllUnit() {
      let params = {}; // 查询所有事业部不用传参数
      const { code, data } = await getAllUnit(params);
      if (code === "000000") {
        console.log(data);
        this.templateUnitData = data;
      }
    },
    // 组件返回的数据
    async getApprovalParams(params) {
      if (this.obj.termsType === "") {
        this.$message({ type: "error", message: "请选择条款类型！" });
        return;
      }
      if (this.obj.termsOption === "") {
        this.$message({ type: "error", message: "请输入适用场景！" });
        return;
      }
      if (this.obj.unitName === "") {
        this.$message({ type: "error", message: "请选择事业部！" });
        return;
      }
      this.ruleForm.termsName =
        this.obj.termsType +
        "-" +
        this.obj.termsOption +
        "-" +
        this.obj.unitName;
      //先存储下数据到数据库顺便把数据存到历史表中
      const { code, data } = await saveTermInfoAndHistory(this.ruleForm);
      if (code === "000000") {
        this.dealApprovalData(params);
      } else {
        this.$message({ type: "error", message: "新增历史条款失败" });
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
    // 获取条款内容
    async gettermInfo() {
      let processId = this.$route.query.id;
      const { code, data } = await getDetail({ id: processId });
      if (code === "000000") {
        this.ruleForm = data;
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList;
        this.obj.termsType = this.ruleForm.termsName.split("-")[0];
        this.obj.termsOption = this.ruleForm.termsName.split("-")[1];
        this.obj.unitName = this.ruleForm.termsName.split("-")[2];
        // 获取条款数据后再去字典值进行匹配
        this.getDict();
      }
    },
    // 获取字典，可以传多个值
    async getDict() {
      let dictCode = {
        dictCodes: "LANGUAGE,TERMS_FIRST_PART",
      };
      const { code, data } = await dictSelectList(dictCode);
      if (data.length > 0) {
        data.forEach((ele) => {
          if (ele.dictCode === "LANGUAGE") {
            this.LanguageDict = ele;
            this.termsLanguageShow = this.LanguageDict.dictVoList.find(
              (item) => item.dictCode === this.ruleForm.termsLanguage
            ).dictName;
          }
          if (ele.dictCode === "TERMS_FIRST_PART") {
            this.termTypeData = ele.dictVoList;
          }
        });
      }
    },
    // 金格插件打开
    async openIwebOffice() {
      const { code, data } = await getBussAttament(this.ruleForm.termsId);
      if (code === "000000") {
        let token = this.$Cookie.get("token");
        if(this.taskKey==='start'){
          OpenKgWindow(
          "?openType=open&docFileName="+encodeURIComponent(this.ruleForm.termsName)+"&isSave=true&isTermCreate=true&isShowAllBookMarks=true&operateType=term&ObjectId=" +
            this.ruleForm.termsId +
            "&fileId=" +
            data.fileId +
            "&token=" +
            token
        );
        }else{
          OpenKgWindow(
          "?openType=open&docFileName="+encodeURIComponent(this.ruleForm.termsName)+"&readType=readyOnly&operateType=term&ObjectId=" +
            this.ruleForm.termsId +
            "&fileId=" +
            data.fileId +
            "&token=" +
            token
        );
        }
        
      }
    },
    // 存储条款的历史表中
    async saveTermHistory() {},
  },
};
</script>

<style lang="less" scoped>
.approval-page {
  position: fixed;
  background: #fff;
  padding: 18px 14px;
}
</style>
