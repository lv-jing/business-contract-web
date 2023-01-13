<template>
  <div>
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" label-width="110px"
               ref="ruleForm">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="合同名称/编号" prop="contractName">
              <el-input v-model="ruleForm.contractName" placeholder="请输合同名称/编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对方签约主体" prop="otherSide">
              <el-input v-model="ruleForm.otherSide" placeholder="对方签约主体"></el-input>
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
            <el-form-item label="归档状态" prop="archiveStatue">
              <common-select
                v-model="ruleForm.archiveStatue"
                dictCode="ARCHIVE_STATUE"
                :value="ruleForm.archiveStatue"
                placeholder="请选择合同状态"
                :isSplicing="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归档申请日期">
              <datePicker ref="datePicker" v-model="timeData"></datePicker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归档完成日期">
              <datePicker ref="datePicker1" v-model="timeData1"></datePicker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="button-box tr">
              <el-button type="primary" @click="formSearchMethod('ruleForm')"
                         icon="iconfont sbt_add">查询
              </el-button>
              <el-button @click="formResetMethod('ruleForm')"
                         icon="iconfont sbt_add">重置
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="bg-white user-form-table pd24">
      <el-table
        v-loading="loading"
        class="mt10 md20"
        :data="tableData"
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
        <el-table-column prop="managerName" label="经办人"></el-table-column>
        <el-table-column prop="otherEntityName" label="对方签约主体" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contractTypeCode" label="合同类型">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'INCOME_EXPE_TYPE'" :dictCode="row.contractTypeCode"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="approvalTime" label="完成审批日期"></el-table-column>
        <el-table-column prop="statue" label="合同状态">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'CONTRACT_STATUE'" :dictCode="row.statue"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="applyArchiveTime" label="归档申请日期"></el-table-column>
        <el-table-column prop="archiveTime" label="归档完成日期"></el-table-column>
        <el-table-column prop="archiveStatue" label="归档状态">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'ARCHIVE_STATUE'" :dictCode="row.archiveStatue"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="orgiginalReturn" label="原件是否返还">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'ORIGINAL_RETURN'" :dictCode="row.orgiginalReturn"></DictCodeToDictName>
          </template>
        </el-table-column>
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import {getContractType} from "@/service/approval";
import {getConditionsPage} from "@/service/assistant";

export default {
  data() {
    return {
      show: false,
      loading: false,
      overHeight: '150px',
      ruleForm: {
        contractName: '', // 合同名称
        contractTypeCode: '', // 合同类型
        archiveStatue: '', // 归档状态
        orgiginalReturn: '', // 原价返还状态
        otherSide: '', // 对方
        applyArchiveTimeFrom: '', // 归档申请日期开始
        applyArchiveTimeTo: '', // 归档申请日期结束
        archiveTimeFrom: '', // 归档完成日期开始
        archiveTimeTo: '', // 归档完成日期结束
      },
      tableData: [],
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      conditList:[],
      timeData:{},
      timeData1:{},
    };
  },
  mounted() {
    this.getContractType()
    this.getContractPage()
  },

  methods: {
    async getContractPage() {
      this.getParams();
      this.loading = true
      const {code, data} = await getConditionsPage({
        ...this.searchForm,
        ...this.ruleForm
      })
      if (code === '000000') {
        this.tableData = data.records || []
        this.searchForm.total = data.total
      }
      this.loading = false
    },
    getParams() {
      this.ruleForm = {
        ...this.ruleForm,
        applyArchiveTimeFrom: this.timeData.startTime, // 归档申请日期开始
        applyArchiveTimeTo: this.timeData.endTime, // 归档申请日期结束
        archiveTimeFrom: this.timeData1.startTime, // 归档完成日期开始
        archiveTimeTo: this.timeData1.endTime,// 归档完成日期结束
      }
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
    handleDetail(row) {
      this.$router.push({name: 'singleContract', query: {id: row.contractId, type: 'view',ispdf:'pdf'}})
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
      this.searchForm = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
      this.$refs[self].resetFields()
      this.$refs.datePicker.reset();
      this.$refs.datePicker1.reset();
      this.tableData = [];
      this.getParams();
      this.getContractPage()
    },
    /**
     * 分页查询
     */
    handlerCurrentPage(list) {
      this.tableData = [];
      this.searchForm = {
        ...this.searchForm,
        ...list
      };
      this.getContractPage()
    },
  }
};
</script>

<style lang="less" scoped>
.over-hid {
  height: 150px;
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

