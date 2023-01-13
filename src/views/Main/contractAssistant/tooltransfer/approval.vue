<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="19">
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
                    <el-form-item label="移交人" prop="personObj">
                      <commonItemSelect
                        disabled
                        v-model="ruleForm.personObj"
                        :value="ruleForm.personObj"
                      ></commonItemSelect>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="移交部门">
                      <el-input :disabled="true" v-model="ruleForm.transferOrgName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="接收人" prop="accepterObj">
                      <commonItemSelect
                        :onChange="(val)=>onChange(val)"
                        :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                        v-model="ruleForm.accepterObj"
                        :value="ruleForm.accepterObj"
                      ></commonItemSelect>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="接收部门">
                      <el-input disabled v-model="ruleForm.accepterOrgName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系电话">
                      <el-input :disabled="true" v-model="ruleForm.attribute1"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="申请时间" prop="applyTime">
                      <el-date-picker
                        disabled
                        class="w-100"
                        v-model="ruleForm.applyTime"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <common-title title="移交合同" class="mt20 mb20"/>
              <div class="bg-white user-form-table">
                <el-table
                  class="mt10 md20"
                  :data="tableData"
                  stripe highlight-current-row
                  style="width: 100%"
                  :header-cell-style="{background:'#f3f3f3'}"
                  size="small">
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
                  <el-table-column prop="otherEntityName" label="对方签约主体">
                    <template v-slot="{row}">
                      <span>{{ getEntiName(row.contractEntityList, 2) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="includedAmount" label="含增值税合同额(元)" align="right">
                    <template v-slot="{row}">
                      <span>{{row.includedAmount>0?row.includedAmount/100:row.includedAmount}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="managerName" label="经办人">
                    <template v-slot="{row}">
                      <span>{{ row.ecmBusinessMemberList[0].memberName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="signTime" label="生效日期"></el-table-column>
                </el-table>
              </div>
              <common-title title="移交原因" class="mt20 mb20"/>
              <div class="form-bg">
                <el-row :gutter="24">
                  <el-col :span="24">
                    <el-form-item label-width="0" prop="transferReason">
                      <el-input v-model="ruleForm.transferReason"
                                :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                                type="textarea" maxlength="100"
                                :autosize="{ minRows: 5, maxRows: 6}"
                                show-word-limit>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <common-tableappoval
                :ApprovalData="ApprovalData"
                :pinionsList="pinionsList"
              />
            </el-form>
          </el-card>
        </div>
      </el-col>
      <el-col :span="5">
        <common-mode
          v-on:getApprovalParams="getApprovalParams"
          :noShowOption="noShowOption"
        />
      </el-col>
    </el-row>
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
import {deleteProcess, getAuditApprove, getDetail, rejectProcess} from "@/service/work";
import {getAdd, getSubmit} from "@/service/assistant";

export default {
  components: {
    CommonUpload,
  },
  data() {
    return {
      visible:false,
      approvalParams:{},
      noShowOption : {
        isPass:true, // 通过
        isReject:true, // 退回
        isShowConsult: false, //意见征询按钮
        isShowNoSuitApproval: false, // 是否非适格审批按钮
        isChooseNode: true, // 是否选择节点
      },
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      ruleForm: {
        contractTransferId:'',
        personObj: {},
        accepterObj: {},
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
      data: [],
      ApprovalData: [],
      pinionsList:[]
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
    this.getDetail();
  },

  methods: {
    /**
     * 详情
     */
    async getDetail() {
      const {code, data} = await getDetail({
        id: this.$route.query.id
      })
      if (code === '000000') {
        this.pinionsList = data.bpmProcessTaskOpinionsVoList
        this.ApprovalData = data.bpmProcessTaskVoList || [];
          this.ruleForm = {
            ...this.ruleForm,
            contractTransferId:data.contractTransferId,
            ...data,
            attribute1: data.attribute1,
            personObj: {
              userName: data.transferName,
              userId: data.transferId
            },
            accepterObj: {
              userName: data.accepterName,
              userId: data.accepterId
            },
          }
        this.tableData = data.ecmContractInfoList || []
      }
    },
    getEntiName(list, val) {
      let text = ''
      if (val === 2) {
        list.map(item => {
          if (item.entityType === 'ENT02') {
            text += item.entityName + ','
          }
        })
      }
      return text;
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
     *  保存审批人 跳转
     * @param params
     * @returns {Promise<void>}
     */
    async getApprovlStart(params) {
      this.getAuditApprove(params)
    },
    /**
     * 弹窗取消
     */
    handleCancel() {
      this.visible = false;
    },
    /**
     *  审批流程通过按钮获取
     */
    getApprovalParams(params) {
      const {taskKey} = this.$route.query;
      if(taskKey === 'start'){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
           this.postAdd(params)
          } else {
            this.loading = false;
            this.$message.error('请把信息填写完整')
          }
        })
      } else {
        this.postAdd(params)
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
     * 保存接口
     */
    async postAdd(params) {
      const {taskKey,operationType, sourceType} = this.$route.query;
      const {code,data} = await getAdd(this.getParams());
      if (code === '000000') {
        this.ruleForm = {
          ...this.ruleForm,
          contractTransferId:data.contractTransferId,
          ...data
        }
        if(taskKey === 'start' && operationType !== 'CONSULT' && sourceType !== 'INAPPROPRIATEPROCESS'){
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
        } else if(params.type==='adopt'){
          this.getAuditApprove(params)
        } else {
          this.rejectProcess(params)
        }

      }
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
      this.loading = false;
    },
    /**
     *  同意审批
     * @returns {Promise<void>}
     */
    async getAuditApprove(obj) {
      const {code} = await getAuditApprove({
        id: this.$route.query.id,
        bpmProcessTaskOpinionsFormList: obj.list,
      }, err => {
        this.loading = false
      })
      if (code === '000000') {
        this.loading = false
        this.$router.push({name: 'agencymatter'})
      } else {
        this.loading = false
      }
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
