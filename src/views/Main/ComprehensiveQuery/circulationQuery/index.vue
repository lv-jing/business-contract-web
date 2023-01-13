<template>
  <div>
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" :rules="rules" label-width="110px"
               ref="ruleForm" :class="show?'over-vis':'over-hid'">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="合同名称/编号" prop="contractName">
              <el-input v-model="ruleForm.contractName" placeholder="请输合同名称/编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同类型" prop="contractTypeCode">
              <el-select
                filterable
                v-model="ruleForm.contractTypeCode"
                placeholder="请选择合同类型" class="w-100">
                <el-option
                  v-for="(item,index) in conditList"
                  :key="index"
                  :label="item.attribute1||item.dictName"
                  :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同状态" prop="statue">
              <common-select
                v-model="ruleForm.statue"
                dictCode="CONTRACT_STATUE"
                :value="ruleForm.statue"
                placeholder="请选择合同状态"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="我方签约主体" prop="ourSide">
              <el-input v-model="ruleForm.ourSide" placeholder="请输入我方签约主体"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对方签约主体" prop="otherSide">
              <el-input v-model="ruleForm.otherSide" placeholder="请输入对方签约主体"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批完成日期">
              <datePicker ref="datePicker" v-model="timeData"></datePicker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="ruleForm.projectName" placeholder="请输入项目名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编号" prop="projectCode">
              <el-input v-model="ruleForm.projectCode" placeholder="请输入项目编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经办人" prop="managerName">
              <el-input v-model="ruleForm.managerName" placeholder="请输入经办人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主办部门" prop="orgName">
              <el-input v-model="ruleForm.orgName" placeholder="请输入主办部门"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签署日期">
              <datePicker ref="datePicker1" v-model="timeData1"></datePicker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="对方签署日期">
              <datePicker ref="datePicker2" v-model="timeData2"></datePicker>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="是否保密" prop="scret">
              <el-select
                filterable
                v-model="ruleForm.scret"
                placeholder="请选择是否保密" class="w-100">
                <el-option
                  v-for="(item,index) in option"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-box tr">
        <el-button type="primary" @click="formSearchMethod('ruleForm')"
                   icon="iconfont sbt_add">查询
        </el-button>
        <el-button @click="formResetMethod('ruleForm')"
                   icon="iconfont sbt_add">重置
        </el-button>
      </div>
      <div class="button-center">
                <span class="pointer" @click="show=!show">
                    {{ show ? '基本条件' : '高级条件' }}
                    <i :class="show?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                </span>
      </div>
    </div>
    <div class="bg-white user-form-table pd24">
      <el-table
        class="mt10 md20"
        :data="tableData"
        v-loading="loading"
        stripe highlight-current-row
        style="width: 100%"
        :header-cell-style="{background:'#f3f3f3'}"
        size="small"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="contractName" label="合同名称">
          <template v-slot={row}>
            <a class="pointer" @click="handleDetail(row)">{{ row.contractName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="contractNo" label="合同编号">
          <template v-slot={row}>
            <a class="pointer" @click="handleDetail(row)">{{ row.contractNo }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="ourEntityName" label="我方签约主体" show-overflow-tooltip></el-table-column>
        <el-table-column prop="otherEntityName" label="对方签约主体" show-overflow-tooltip></el-table-column>
        <el-table-column prop="circulateTime" label="传阅日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contractTypeCode" label="合同类型">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'INCOME_EXPE_TYPE'" :dictCode="row.contractTypeCode"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="statue" label="合同状态">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'CONTRACT_STATUE'" :dictCode="row.statue"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="orgName" label="主办部门"></el-table-column>
        <el-table-column prop="managerName" label="经办人"></el-table-column>
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import {getContractType} from "@/service/approval";
import {getCirculatePage } from "@/service/assistant"

export default {
  data() {
    return {
      show: false,
      loading: false,
      ruleForm: {
        contractName: '', // 合同名称
        contractNo: '', // 合同编号
        contractTypeCode: '', // 合同类型
        statue: '', // 合同状态
        ourSide: '', // 我方
        otherSide: '', // 对方
        projectCode: '',// 项目编号
        projectName: '',// 项目编号
        approvalTimeFrom: '', // 审批完成时间开始
        approvalTimeTo: '', // 审批完成时间结束
        ourSignTimeFrom: '', // 我方签署时间开始
        ourSignTimeTo: '',// 我方签署时间截至
        otherSignTimeFrom: '', // 对方签署时间开始
        otherSignTimeTo: '',// 对方签署时间截至
        scret: '', // 是否保密
      },
      rules: {},
      conditList: [],
      tableData: [],
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
      ,
      option: [
        {value: 'Y', label: '是'},
        {value: 'N', label: '否'},
      ],
      timeData: {},
      timeData1: {},
      timeData2: {}
    }
  },
  mounted() {
    this.getContractType()
    this.getContractPage()
  },

  methods: {
    /**
     * 编辑
     * @param row
     * @param type
     */
    handleDetail(row) {
      this.$router.push({name: 'singleContract', query: {id: row.contractId, type: 'view',ispdf:'pdf'}})
    },
    /**
     * 列表数据
     */
    async getContractPage() {
      this.getParams();
      this.loading = true
      const {code, data} = await getCirculatePage({
        ...this.searchForm,
        ...this.ruleForm
      })
      if (code === '000000') {
        this.tableData = data.records || []
        this.searchForm.total = data.total
      }
      this.loading = false
    },
    /**
     *  合同类型
     */
    async getContractType(params) {
      const {code, data} = await getContractType({
        dictCode: "INCOME_EXPE_TYPE",
        attribute1: 4
      })
      if (code === '000000') {
        this.conditList = [];
        this.getConditList(data)
      }
    },
    /**
     * 分解合同类型数据
     */
    getConditList(data) {
      data && data.map(item => {
        if (item.dictVoList && item.dictVoList.length > 0) {
          this.getConditList(item.dictVoList)
        } else {
          this.conditList.push(item);
        }
      })
    },
    /**
     * 查询
     */
    formSearchMethod(ref) {
      this.searchForm = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
      this.getContractPage()
    },
    /**
     * 重置
     */
    formResetMethod(self) {
      this.$refs[self].resetFields()
      this.$refs.datePicker.reset();
      this.$refs.datePicker1.reset();
      this.$refs.datePicker2.reset();
      this.timeData={}
      this.timeData1={}
      this.timeData2={}
      this.searchForm = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
      this.getContractPage()
    },
    getParams() {
      this.ruleForm = {
        ...this.ruleForm,
        approvalTimeFrom: this.timeData.startTime, // 审批完成时间开始
        approvalTimeTo: this.timeData.endTime, // 审批完成时间结束
        signTimeFrom: this.timeData1.startTime, // 签署时间开始
        signTimeTo: this.timeData1.endTime,// 签署时间截至
        otherSignTimeFrom: this.timeData2.startTime, // 对方签署时间开始
        otherSignTimeTo: this.timeData2.endTime,// 对方签署时间截至
      }
    },
    /**
     * 分页查询
     */
    handlerCurrentPage(list) {
      this.searchForm = {
        ...this.searchForm,
        ...list
      };
      this.getContractPage()
    },
  },

};
</script>

<style lang="less" scoped>
.over-hid {
  max-height: 90px;
  overflow: hidden;
}

.over-vis {
  height: auto;
  overflow: visible;
}

.button-center {
  text-align: center;

  span {
    font-size: 14px;
    color: #2393F7;
  }
}
</style>

