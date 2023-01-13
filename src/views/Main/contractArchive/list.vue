<template>
  <div>
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" :rules="rules" label-width="110px"
               ref="ruleForm">
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
            <el-form-item label="归档状态" prop="archiveStatue">
              <common-select
                v-model="ruleForm.archiveStatue"
                dictCode="ARCHIVE_STATUE"
                :value="ruleForm.archiveStatue"
                placeholder="请选择归档状态"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原件返还状态" prop="orgiginalReturn">
              <common-select
                v-model="ruleForm.orgiginalReturn"
                dictCode="ORIGINAL_RETURN"
                :value="ruleForm.orgiginalReturn"
                placeholder="请选择原件返还状态"
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
            <el-form-item label="归档申请日期">
              <datePicker ref="datePicker" v-model="timeData"></datePicker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归档完成日期">
              <datePicker ref="datePicker1" v-model="timeData1"></datePicker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
        class="mt10 md20"
        :data="tableData"
        v-loading="loading"
        stripe highlight-current-row
        style="width: 100%"
        :header-cell-style="{background:'#f3f3f3'}"
        size="small">
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
        <el-table-column prop="ourEntityName" label="我方签约主体" show-overflow-tooltip></el-table-column>
        <el-table-column prop="otherEntityName" label="对方签约主体" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contractTypeCode" label="合同类型">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'INCOME_EXPE_TYPE'" :dictCode="row.contractTypeCode"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="applyArchiveTime" label="归档申请日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="archiveTime" label="归档完成日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="archiveStatue" label="归档状态">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'ARCHIVE_STATUE'" :dictCode="row.archiveStatue"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="statue" label="原件返还状态">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'ORIGINAL_RETURN'" :dictCode="row.orgiginalReturn"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          align="center"
        >
          <template v-slot="{row}">
            <el-button v-if='!row.archiveStatue' type="text" @click="handleAdd(row)">上传
            </el-button>
            <el-button v-if="adminShow && row.archiveStatue==='ARS001'" type="text"
                       @click="handleEdit(row)">归档
            </el-button>
            <div v-if="roleShow&&row.archiveStatue">
              <el-button @click="addDeclaration(row,'yes')" type="text">已返还
              </el-button>
              <el-button @click="addDeclaration(row,'no')" type="text">未返还
              </el-button>
            </div>
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
import {getConditionsPage, updateNo, updateYes} from "@/service/assistant"
import {queryUserRole} from "@/service/4A"
import {mapState} from "vuex";

export default {
  data() {
    return {
      show: false,
      adminShow: false, // 是否是管理员
      roleShow: false, // 是否是律师
      loading: false,
      ruleForm: {
        contractName: '', // 合同名称
        contractTypeCode: '', // 合同类型
        archiveStatue: '', // 归档状态
        orgiginalReturn: '', // 原价返还状态
        ourSide: '', // 我方
        otherSide: '', // 对方
        applyArchiveTimeFrom: '', // 归档申请日期开始
        applyArchiveTimeTo: '', // 归档申请日期结束
        archiveTimeFrom: '', // 归档完成日期开始
        archiveTimeTo: '', // 归档完成日期结束
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
      timeData2: {},
      contractIdList: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  mounted() {
    this.getContractType()
    this.getContractPage()
    this.queryUserRole()
    this.queryUserRole1()
  },

  methods: {
    /**
     * 验证是否是档案管理员
     */
    async queryUserRole() {
      const {code, data} = await queryUserRole({
        deputyAccountId: this.userInfo.deputyAccountId,
        roleCode: 'contract_file_admin' // 档案管理员
      })
      if (data.length > 0) {
        this.adminShow = true
      }
    },
    async queryUserRole1() {
      const {data} = await queryUserRole({
        deputyAccountId: this.userInfo.deputyAccountId,
        roleCode: 'lawyer_file_role' // 律师
      })
      if (data.length > 0) {
        this.roleShow = true;
      }
    },

    /**
     * 上传
     */
    handleAdd(row) {
      this.$router.push({
        name: 'contractarchive',
        query: {
          type: 'add',
          id: row.contractId,
          contractName: row.contractName,
          contractNo: row.contractNo
        }
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'contractarchive',
        query: {
          type: 'edit',
          id: row.contractId,
          archivistId: row.contractArchiveId,
          contractName: row.contractName,
          contractNo: row.contractNo
        }
      })
    },
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
     * 已归还 未归还
     */
    addDeclaration(row, val) {
      if (val === 'yes') {
        this.updateYes(row.contractArchiveId)
      } else {
        this.updateNo(row.contractArchiveId)
      }
    },
    // 已归还
    async updateYes(params) {
      const {code, mesg} = await updateYes(params)
      if (code === '000000') {
        this.$message.success(mesg)
        this.formSearchMethod()
      }
    },
    // 未归还
    async updateNo(params) {
      const {code, mesg} = await updateNo(params)
      if (code === '000000') {
        this.$message.success(mesg)
        this.formSearchMethod()
      }
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
      this.tableData = [];
      this.$refs[self].resetFields()
      this.$refs.datePicker.reset();
      this.$refs.datePicker1.reset();
      this.timeData = {}
      this.timeData1 = {}
      this.getContractPage()
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
  },

};
</script>

<style lang="less" scoped>
.button-center {
  text-align: center;

  span {
    font-size: 14px;
    color: #2393F7;
  }
}
</style>

