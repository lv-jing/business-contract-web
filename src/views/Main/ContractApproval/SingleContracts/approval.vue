<template>
  <div element-loading-text="拼命加载中" v-loading="loading">
    <el-row :gutter="24">
      <el-col :span="19">
        <div class="bg-white">
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
              <el-popconfirm title="确认删除该条记录吗?" @onConfirm="handleDelete" v-if="$route.query.taskKey==='start'&&$route.query.sourceType!=='INAPPROPRIATEPROCESS'">
                <el-button slot="reference" type="text" size="mini" circle>删除</el-button>
              </el-popconfirm>
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
          <commonApproval
            :visible="visible"
            :handleCancel="handleCancel"
            :approvalParams="approvalParams"
            :isShow="true"
            v-on:get-approvl-start="getApprovlStart"
          />
          </el-card>
        </div>
      </el-col>
      <el-col :span="5">
        <common-mode
          v-on:getApprovalParams="getApprovalParams"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import {mapState} from "vuex"
import {getAuditApprove, getConsult, getDetail, rejectProcess, getTableData, deleteProcess} from "@/service/work";
import Cookies from "js-cookie";
import {downloadUrl} from "@/service/file";
import {deleLists} from "@/service/approval";

export default {
  data() {
    return {
      approvalObj:{},
      loading:false,
      visible: false,
      approvalParams: {},
      ApprovalData: [],
      pinionsList: [],
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
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  mounted() {
    this.$store.dispatch("setHeight", 100);
    this.getDetail()
  },

  methods: {
    /**
     * 获取详情
     */
    async getDetail() {
      this.loading = true
      const {code, data} = await getDetail({
        id: this.$route.query.id
      },err=>{
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
          contractCode: data && data.contractCode || '',
        }
        this.getTableData()
        if(data.entityWarning){
          this.$message({
            showClose: true,
            message: data.entityWarning,
            type: 'warning',
            duration:0
          });
        }
      }
      this.loading = false
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
     /**
     * 弹窗取消
     */
    handleCancel() {
      this.loading = false;
      this.visible = false;
    },
    /**
     * 审批意见返回值
     */
    getApprovlStart(params) {
      this.getAuditApprove({
        ...this.approvalObj,
        ...params
      })
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
     * 获取审批意见
     */
    getApprovalParams(obj){
      this.loading = true;
      this.approvalObj = {}
      const {taskKey, operationType, sourceType} = this.$route.query;
      if (taskKey === 'start' && operationType !== 'CONSULT' && sourceType !== 'INAPPROPRIATEPROCESS') {
        this.approvalParams = {
          objectTypeCode: "BACTH_CONTRACT_APPROVAL",
          orgCode: this.ruleForm.orgCode || '',
          contractTypeCode: this.ruleForm.contractCode || '',
          quoteTemplate: 'CTA001' || '',
          contractName: this.ruleForm.contractModel || '',
          minAmount: "",
          businessId: this.ruleForm.batchId
        }
        this.visible = true;
        this.approvalObj = obj;
      }else if (obj.type === 'adopt') { // 通过 提交
        this.getAuditApprove(obj)
      } else if (obj.type === 'return') { // 退回
        this.rejectProcess(obj)
      } else if (obj.type === 'opinion') { // 意见征询
        this.getConsult(obj)
      }
    },
    /**
     *  同意审批
     * @returns {Promise<void>}
     */
    async getAuditApprove(obj) {
      const {code} = await getAuditApprove({
        id: this.$route.query.id,
        bpmProcessTaskOpinionsFormList: obj.list,
        sysProcessLinkHeadVo: obj.sysProcessLinkHead || {}
      })
      if(code==='000000'){
        this.$router.push({name: 'agencymatter'})
      }
      this.loading = false
    },
    /**
     * 退回流程
     * @returns {Promise<void>}
     */
    async rejectProcess(obj) {
      const {code} = await rejectProcess({
        id: this.$route.query.id,
        ecmContractProcessConfigVoList: obj.VoList,
        bpmProcessTaskOpinionsFormList: obj.list
      })
      if (code === '000000') {
        this.$router.push({name: 'agencymatter'})
      }
      this.loading = false
    },
    /**
     *  征询人
     * @returns {Promise<void>}
     */
    async getConsult(obj) {
      const {code} = await getConsult({
        id: this.$route.query.id,
        bpmProcessTaskOpinionsFormList: obj.list,
        userVoList: obj.userVoList
      })
      if (code === '000000') {
        this.$router.push({name: 'agencymatter'})
      }
      this.loading = false
    },
    /**
     * 下载excel
     */
    handleDown(){
      const token = Cookies.get('token')
      window.location.href = downloadUrl + `/${this.fileList.fileId}?token=${token}`
    },
    /**
     * 删除撤回批量
     */
    async handleDelete(){
      const {code} = await deleteProcess({
        id:this.$route.query.id
      })
      if(code === '000000'){
        const {code} = await deleLists(this.ruleForm.batchId)
        if (code === '000000') {
          this.$message.success("删除成功")
          this.$router.push({name:'singleContracts'})
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>

</style>
