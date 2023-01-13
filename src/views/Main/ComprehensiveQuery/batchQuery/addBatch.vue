<template>
  <div class="bg-white" element-loading-text="拼命加载中" v-loading="loading">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <b>批量合同</b>
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
        :header-cell-style="{background:'#f3f3f3'}">
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
              <el-button @click="handleDetail(row)" slot="reference" type="text" size="mini" circle>上传</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import {mapState} from "vuex"
import { postBactDetail, getQueryBatchsList} from '@/service/approval'
import {downloadUrl} from "@/service/file";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      text:'',
      visible: false,
      approvalParams: {},
      ruleForm: {
        memberName: '',
        memberUnitName: '',
        phone: '',
        batchName: '',
        contractModel: '',
        totalNumber: '',
        totalAmount: '',
        contractName: '',
        contractCode: '',
      },
      loading:false,
      rules: {},
      tableData: [],
      fileList:'',
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  mounted() {
    this.getDetail()
    this.getDraftsList()
  },

  methods: {
    /**
     * 分页查询
     */
    handlerCurrentPage(list) {
      this.searchForm = {
        ...this.searchForm,
        ...list
      };
      this.getDraftsList();
    },
    /**
     * 合同信息
     */
    async getDraftsList() {
      const {id} = this.$route.query
      const {code, data} = await getQueryBatchsList({
        ...this.searchForm,
        batchId: id
      })
      if (code === '000000') {
        this.tableData = data.records;
        this.searchForm.total = data.total;
      }
    },
    /**
     * 获取详情
     */
    async getDetail() {
      this.loading = true
      const {code, data} = await postBactDetail(this.$route.query.id,err=>{
        this.loading = false
      })
      if (code === '000000') {
        this.fileList = data.ecmBusinessAttamentList;
        this.ruleForm = {
          ...this.ruleForm,
          orgCode:  data.ecmBusinessMemberList.memberOrgCode||'',
          memberName:  data.ecmBusinessMemberList.memberName||'',
          memberUnitName:  data.ecmBusinessMemberList.memberUnitName||'',
          phone:  data.ecmBusinessMemberList.phone||'',
          batchName:  data.batchName || '',
          contractModel:  data.contractModel || '',
          totalNumber:  data.totalNumber || '',
          totalAmount:  data.totalAmount || '',
          contractName: data.contractName || '',
          contractCode: data.contractCode || '',
        }
        this.loading = false
      } else {
        this.loading = false
      }
    },
    /**
     * 查看合同
     */
    handleDetail(row) {
      this.$router.push({
        name: 'batchquery',
        query: {type: 'addUpload', dictCode: row.incomeExpeTypeCode, id: row.contractId}
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
