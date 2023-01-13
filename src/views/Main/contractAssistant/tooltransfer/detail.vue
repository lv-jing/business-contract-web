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
                  <el-form-item label="接收人" prop="accepterObj.userName">
                    <commonItemSelect
                      disabled
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
                    <span>{{ row.managerName }}</span>
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
                              disabled
                              type="textarea" maxlength="100"
                              :autosize="{ minRows: 5, maxRows: 6}"
                              show-word-limit>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <common-tableappoval
            :ApprovalData="ApprovalData"
            :pinionsList="pinionsList"
          />
        </el-card>
      </div>
</template>

<script>
/* eslint-disable */
import CommonUpload from "@/components/CommonUpload";
import {mapState} from "vuex"
import {getDetail} from "@/service/work";

export default {
  components: {
    CommonUpload,
  },
  data() {
    return {
      pinionsList: [],// 审批意见数据
      ApprovalData: [],
      noShowOption : {
        isPass:true, // 通过
        isReject:true, // 退回
        isShowConsult: false, //意见征询按钮
        isShowNoSuitApproval: false, // 是否非适格审批按钮
        isChooseNode: false, // 是否选择节点
      },
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
      rules: {},
      tableData: [],
      data: []
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
        this.ruleForm = {
          ...this.ruleForm,
          ...data,
          accepterObj: {
            userName: data.accepterName,
            userId: data.accepterId
          },
          personObj: {
            userName: data.transferName,
            userId: data.transferId
          },
          attribute1: data.attribute1
        }
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList
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
