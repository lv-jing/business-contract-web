<template>
  <div class="bg-white" element-loading-text="拼命加载中" v-loading="loading">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <b>批量合同发起</b>
      </div>
      <common-title title="基本信息"/>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="经办人">
                <el-input :disabled="true" v-model="ruleForm.memberName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发起部门">
                <el-input :disabled="true" v-model="ruleForm.memberUnitName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式">
                <el-input :disabled="true" v-model="ruleForm.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="合同批名称" prop="batchName">
                <el-input :disabled="true" v-model="ruleForm.batchName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同类型" prop="contractName">
                <el-input :disabled="true" v-model="ruleForm.contractName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同范本" prop="contractModel">
                <el-input :disabled="true" v-model="ruleForm.contractModel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同数量" prop="totalNumber">
                <el-input :disabled="true" v-model="ruleForm.totalNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div class="mt20 mb20">
        <span class="el-icon-tickets"></span>
        <span class="ml10 show-hidden" v-text="'批量合同数据表'"></span>
        <a @click="handleDown" href="javascript:;" class="ml20" style="color: #2393F7;">下载</a>
      </div>
      <common-title title="合同信息"/>
      <el-table
        class="mt20"
        :data="tableData"
        stripe
        highlight-current-row
        style="width: 100%;"
        :header-cell-style="{background:'#f3f3f3'}"
      >
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="contractName" label="合同名称"></el-table-column>
        <el-table-column prop="serialNumber" label="合同流水号"></el-table-column>
        <el-table-column prop="ourSide" label="我方签约主体"></el-table-column>
        <el-table-column prop="otherSide" label="对方签约主体"></el-table-column>
        <el-table-column
          label="操作"
          width="80"
          align="center"
          v-if="this.$route.query.type!=='view'&&$route.query.type!=='auditing'"
        >
          <template v-slot={row}>
            <div class="tc">
              <el-button @click="handleDetail(row)" slot="reference" type="text" size="mini" circle>查看合同</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
      <common-tableappoval
        :ApprovalData="ApprovalData"
        :pinionsList="pinionsList"
      />
      <common-footer
        :isShow="false"
      />
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import {getDetail, getTableData} from "@/service/work";
import Cookies from "js-cookie";
import {downloadUrl} from "@/service/file";

export default {
  data() {
    return {
      loading:false,
      ApprovalData: [],
      pinionsList: [],
      visible: false,
      approvalParams: {},
      ruleForm: {
        memberName: '',
        memberUnitName: '',
        phone: '',
        batchName: '',
        batchId: '',
        contractModel: '',
        totalNumber: '',
        totalAmount: '',
        contractName: '',
        contractCode: '',
      },
      rules: {},
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableData: []
    };
  },
  mounted() {
    this.getDetail()
  },

  methods: {
    /**
     *  分解我方对方列表
     */
    getEntityData(data, val) {
      var text = ''
      var text1 = ''
      data && data.map(item => {
        if (item.entityType === 'ENT01') {
          text = item.entityName
        } else if (item.entityType === 'ENT02') {
          text1 = item.entityName
        }
      })
      if (val === 'ENT01') {
        return text
      } else if (val === 'ENT02') {
        return text1
      }
    },
    /**
     * 获取详情
     */
    async getDetail() {
      this.loading = true
      const {code, data} = await getDetail({
        id: this.$route.query.id
      }, err=>{
        this.loading = false
      })
      if (code === '000000') {
        this.loading = false
        this.fileList = data.ecmBusinessAttamentList;
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList
        this.ruleForm = {
          ...this.ruleForm,
          orgCode:  data.ecmBusinessMemberList.memberOrgCode||'',
          memberName:  data.ecmBusinessMemberList.memberName||'',
          memberUnitName:  data.ecmBusinessMemberList.memberUnitName||'',
          phone:  data.ecmBusinessMemberList.phone||'',
          batchName: data && data.batchName || '',
          batchId:data.batchId,
          contractModel: data && data.contractModel || '',
          totalNumber: data && data.totalNumber || '',
          totalAmount: data && data.totalAmount || '',
          contractName: data && data.contractName || '',
          contractCode: data && data.contractCode || ''
        }
        this.getTableData();
         if(data.entityWarning){
          this.$message({
            showClose: true,
            message: data.entityWarning,
            type: 'warning',
            duration:0
          });
        }
      } else {
        this.loading = false;
      }
    },
    /**
     * 获取合同信息
     */
    async getTableData(){
      const {code,data}=await getTableData({
        ...this.searchForm,
        batchId:this.ruleForm.batchId
      })
      if(code==='000000'){
        this.tableData = data.records;
        this.searchForm.total = data.total;
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
      this.getTableData();
    },
    /**
     * 查看合同
     */
    handleDetail(row) {
      this.$router.push({
        name: 'singleContracts',
        query: {type: 'view', dictCode: row.incomeExpeTypeCode, id: row.contractId}
      })
    },
    /**
     * 下载excel
     */
    handleDown(){
      const token = Cookies.get('token')
      window.location.href = downloadUrl + `/${this.fileList.fileId}?token=${token}`
    }
  }
};
</script>

<style lang="less" scoped>

</style>
