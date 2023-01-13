<template>
  <div class="bg-white">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <b>合同移交单</b>
      </div>
      <common-title title="基本信息"/>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="移交人" prop="personObj.userName">
                <commonItemSelect
                  :onChange="(val)=>personChange(val)"
                  :placeholder="'移交人'"
                  v-model="ruleForm.personObj"
                  :value="ruleForm.personObj"
                  disabled
                ></commonItemSelect>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="移交部门">
                <el-input :disabled="true" v-model="ruleForm.transferOrgName"
                          placeholder="移交部门"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接收人" prop="accepterObj.userName">
                <commonItemSelect
                  :onChange="(val)=>onChange(val)"
                  :placeholder="'接收人'"
                  v-model="ruleForm.accepterObj"
                  :value="ruleForm.accepterObj"
                ></commonItemSelect>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接收部门">
                <el-input disabled v-model="ruleForm.accepterOrgName"
                          placeholder="接收部门"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input :disabled="true" v-model="ruleForm.attribute1" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请时间" prop="applyTime">
                <el-date-picker
                  disabled
                  class="w-100"
                  v-model="ruleForm.applyTime"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="申请时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <common-title title="移交合同" class="mt20 mb20"/>
        <div class="bg-white user-form-table">
          <el-button type="primary" @click="handleGoto"
                     icon="iconfont sbt_add">移除
          </el-button>
          <el-table
            class="mt10 md20"
            :data="tableData"
            stripe highlight-current-row
            style="width: 100%"
            :header-cell-style="{background:'#f3f3f3'}"
            size="small"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column prop="contractNo" label="合同编号">
<!--              <template v-slot={row}>-->
<!--                <a class="pointer" @click="handleDetail(row)">{{ row.contractNo }}</a>-->
<!--              </template>-->
            </el-table-column>
            <el-table-column prop="contractName" label="合同名称">
<!--              <template v-slot={row}>-->
<!--                <a class="pointer" @click="handleDetail(row)">{{ row.contractName }}</a>-->
<!--              </template>-->
            </el-table-column>
            <el-table-column prop="contractTypeCode" label="合同类型">
              <template v-slot="{row}">
                <DictCodeToDictName :parentCode="'INCOME_EXPE_TYPE'"
                                    :dictCode="row.contractTypeCode"></DictCodeToDictName>
              </template>
            </el-table-column>
            <el-table-column prop="statue" label="合同状态">
              <template v-slot="{row}">
                <DictCodeToDictName :parentCode="'CONTRACT_STATUE'" :dictCode="row.statue"></DictCodeToDictName>
              </template>
            </el-table-column>
            <el-table-column prop="otherEntityName" label="对方签约主体"></el-table-column>
            <el-table-column prop="includedAmount" label="含增值税合同额(元)" align="right">
              <template v-slot="{row}">
                <span>{{row.includedAmount>0?row.includedAmount/100:row.includedAmount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="managerName" label="经办人"></el-table-column>
            <el-table-column prop="signTime" label="生效日期"></el-table-column>
          </el-table>
        </div>
        <common-title title="移交原因" class="mt20 mb20"/>
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label-width="0" prop="transferReason">
                <el-input v-model="ruleForm.transferReason"
                          :disabled="['view'].includes($route.query.type)"
                          type="textarea" maxlength="100"
                          :autosize="{ minRows: 5, maxRows: 6}"
                          show-word-limit
                          placeholder="移交原因">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <common-footer
        :isShow="false"
        :isGoShow="true"
        :handleNextStep="handleSubmit"
        :handleRefuse="handleRefuse"
        butTitle="提交"
        butTitle1="关闭"
      />
    </el-card>
    <commonApproval
      :visible="visible"
      :handleCancel="handleCancel"
      :approvalParams="approvalParams"
      v-on:get-approvl-start="getApprovlStart"
    />
  </div>
</template>

<script>
/* eslint-disable */
import CommonUpload from "@/components/CommonUpload";
import {mapState} from "vuex"
import {getList,getAdd, getSubmit} from '@/service/assistant';
import {getNowTime} from '@/utils/tools'

export default {
  components: {
    CommonUpload,
  },
  data() {
    return {
      approvalParams: {},
      visible:false,
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      ruleForm: {
        personObj: {
          userName: '',
          userId: ''
        },
        accepterObj: {
          userName: '',
          userId: ''
        },
        transferName: '', // 移交人姓名
        transferId: '', // 移交人id
        transferEmpNo: '', // 移交人code
        transferOrgName: '', // 移交人部门
        transferOrgCode: '', // 移交人部门code
        accepterName: '', // 接收人姓名
        accepterId: '', // 接收人id
        accepterEmpNo: '', // 接收人code
        accepterOrgName: '', // 接受部门名称
        accepterOrgCode: '', // 接受部门code
        attribute1: '', // 联系电话
        transferReason: '', // 移交原因
        applyTime: '',
        ecmContractInfoList: []
      },
      rules: {
        "personObj.userName": [
          {required: true, message: '请选提醒人', trigger: 'blur'}
        ],
        "accepterObj.userName": [
          {required: true, message: '请选提醒人', trigger: 'blur'}
        ],
        transferReason: [
          {required: true, message: '请输入移交原因', trigger: 'blur'}
        ]
      },
      tableData: [],
      data:[]
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    const {type} = this.$route.query
    if (type === 'add') {
      this.ruleForm = {
        ...this.ruleForm,
        transferName: this.userInfo.userName, // 移交人姓名
        transferId: this.userInfo.userId, // 移交人姓名
        transferEmpNo: this.userInfo.userCode, // 移交人code
        transferOrgName: this.userInfo.orgName, // 移交人部门
        transferOrgCode: this.userInfo.orgCode, // 移交人部门code
        attribute1: this.userInfo.phone, // 移交人部门code
        applyTime: getNowTime(),
        personObj: {
          userName: this.userInfo.userName,
          userId: this.userInfo.userId
        }
      }
    }
    this.init()
  },

  methods: {
    /**
     * 移除
     */
    handleGoto() {
      if(this.data.length!==this.tableData.length){
        if(this.data.length===0){
          this.$message.warning('请选择移交合同，进行移除！')
        } else {
          var set=this.data.map(item=>item.contractId)
          this.tableData = this.tableData.filter(item => !set.includes(item.contractId))
        }
      } else {
        this.$message.error('不能全部移除，必须留有一条移交信息！')
      }
    },
    handleSelectionChange(val) {
      this.data = val
    },
    // 添加人员change
    personChange(val) {
      this.ruleForm = {
        ...this.ruleForm,
        transferName: val.userName, // 移交人姓名
        transferId: val.userId, // 移交人姓名
        transferEmpNo: val.userCode, // 移交人code
        transferOrgName: val.orgName,
        transferOrgCode: val.orgCode,
        attribute1: val.phone, // 移交人code
      }
    },
    // 接收人change
    onChange(val) {
      this.ruleForm = {
        ...this.ruleForm,
        accepterName: val.userName, // 接收人姓名
        accepterId: val.userId, // 接收人id
        accepterEmpNo: val.userCode, // 接收人code
        accepterOrgName: val.orgName, // 接受部门名称
        accepterOrgCode: val.orgCode, // 接受部门code
        accepterUnitName: val.unitName, // 接受事业部名称
        accepterUnitCode: val.unitCode, // 	接受事业部CODE
      }
    },
    /**
     * 初始化
     */
    init() {
      this.$nextTick(() => {
        this.getList()
      })
    },
    async getList() {
      const {contractIdList} = this.$route.query
      var arr = JSON.parse(contractIdList)
      arr.map((item, index) => {
        if (index === 0) {
          item.pageSize = this.searchForm.pageSize
          item.currentPage = this.searchForm.currentPage
        }
      })
      const {code, data} = await getList(JSON.stringify(arr))
      if (code === '000000') {
        this.tableData = data.records
      }
    },
    /**
     * 获取参数
     */
    getParams(val) {
      return {
        ...this.ruleForm,
        ecmContractInfoList:this.tableData||[],
      }
    },
    /**
     *  保存
     */
    async handleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.postAdd(this.getParams());
        }
      })
    },
    /**
     * 关闭
     */
    handleRefuse() {
      this.$router.push({name: 'toolwarning'})
    },
    /**
     * 保存接口
     */
    async postAdd(params) {
      const {code,data} = await getAdd(params);
      if (code === '000000') {
        this.ruleForm = {
          ...this.ruleForm,
          contractTransferId:data.contractTransferId,
          ...data
        }
        this.approvalParams = {
          orgCode: this.userInfo.orgCode || '',
          businessId: data.contractTransferId,
          objectTypeCode:'TRANSFER_APPROVAL',
          contractTypeCode:  '',
          quoteTemplate: '',
          minAmount: '',
          contractScenario:  '',  //合同场景
          validDateStart: '', //有效期开始时间
          validDateEnd: '',   //有效期结束时间
          validYear:  '',   //签订之日**年
          entityAttribute: '',  //签约主体ID
        }
        this.visible = true;
      }
    },
    /**
     * 取消
     */
    handleGoBack() {
      this.$refs.ruleForm.resetFields();
    },
    /**
     *  保存审批人 跳转
     * @param params
     * @returns {Promise<void>}
     */
    async getApprovlStart(params) {
      const {code} = await getSubmit({
        ...params,
        contractTransferId: this.ruleForm.contractTransferId,
      });
      if (code === '000000') {
        this.visible = false;
        this.$router.push({name: 'agencymatter'})
      }
    },
    /**
     * 弹窗取消
     */
    handleCancel() {
      this.visible = false;
    },
  }
}
;
</script>

<style lang="less" scoped>

.show {
  display: block;
}

.hid {
  display: none;
}

.upload-hover {
  .show-hidden {
    visibility: hidden;
    cursor: pointer;
    font-size: 18px;
  }

  &:hover {
    .show-hidden {
      visibility: visible;
    }
  }
}

.buts {
  width: 100%;
  float: left;
  display: flex;

  a {
    color: #2393F7;
  }
}

.modlue-box {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 20;
}
</style>
