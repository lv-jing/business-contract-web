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
            <el-form-item label="是否保密">
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
      <el-button type="primary" @click="handleDown"
                 icon="iconfont sbt_add">导出
      </el-button>
      <el-button type="primary" @click="handleOpen"
                 icon="iconfont sbt_add">调整序列
      </el-button>
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
        <template v-for="item in tableColumList">
          <el-table-column :prop="item.value" :label="item.name" :align="item.value==='includedAmount'?'right':''">
            <template v-slot="{row}"
                      v-if="['contractTypeCode','statue','contractName','contractNo'].includes(item.value)">
              <DictCodeToDictName v-if="item.value==='contractTypeCode'" :parentCode="'INCOME_EXPE_TYPE'"
                                  :dictCode="row.contractTypeCode"/>
              <DictCodeToDictName v-if="item.value==='statue'" :parentCode="'CONTRACT_STATUE'" :dictCode="row.statue"/>
              <a class="pointer" v-if="item.value==='contractName'" @click="handleDetail(row)">{{
                  row.contractName
                }}</a>
              <a class="pointer" v-if="item.value==='contractNo'" @click="handleDetail(row)">{{ row.contractNo }}</a>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-dialog
        title="序列调整"
        :visible.sync="visible"
        width="40%">
        <el-transfer v-model="tranValue" :titles="titles" :data="titleData" :props="props"></el-transfer>
        <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取 消</el-button>
    <el-button type="primary" @click="handleOk">确 定</el-button>
  </span>
      </el-dialog>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import {getContractType} from "@/service/approval";
import {getContractPage} from "@/service/assistant"
import {rand} from '@/utils/tools'
import Cookies from "js-cookie";
import md5 from "js-md5";
import {mapState} from "vuex";

export default {
  data() {
    return {
      visible: false,
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
        signTimeFrom: '',
        signTimeTo: '',
        scret: '', // 是否保密
      },
      rules: {},
      conditList: [],
      tableData: [],
      titles: ['序列调整', '序列调整'],
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      option: [
        {value: 'Y', label: '是'},
        {value: 'N', label: '否'},
      ],
      timeData: {},
      timeData1: {},
      timeData2: {},
      tableColumList: [
        {
          name: "合同名称",
          value: 'contractName'
        },
        {
          name: "合同编号",
          value: 'contractNo'
        },
        {
          name: "合同描述",
          value: 'contractDesc'
        },
        {
          name: "我方签约主体",
          value: 'ourEntityName'
        },
        {
          name: "对方签约主体",
          value: 'otherEntityName'
        },
        {
          name: "含税合同额（元）",
          value: 'includedAmount'
        },
        {
          name: "审批完成日期",
          value: 'approvalTime'
        },
        {
          name: "合同类型",
          value: 'contractTypeCode'
        },
        {
          name: "合同状态",
          value: 'statue'
        },
        {
          name: "主办部门",
          value: 'orgName'
        },
        {
          name: "经办人",
          value: 'managerName'
        },
      ],
      titleData: [
        {
          name: "合同编号",
          value: 'contractNo'
        },
        {
          name: "合同名称",
          value: 'contractName'
        },
        {
          name: "合同描述",
          value: 'contractDesc'
        },
        {
          name: "我方签约主体",
          value: 'ourEntityName'
        },
        {
          name: "对方签约主体",
          value: 'otherEntityName'
        },
        {
          name: "含税合同额（元）",
          value: 'includedAmount'
        },
        {
          name: "审批完成日期",
          value: 'approvalTime'
        },
        {
          name: "合同类型",
          value: 'contractTypeCode'
        },
        {
          name: "合同状态",
          value: 'statue'
        },
        {
          name: "主办部门",
          value: 'orgName'
        },
        {
          name: "经办人",
          value: 'managerName'
        },
      ],
      tranValue: [],
      props: {
        key: 'value',
        label: 'name'
      }
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
  },
  methods: {
    handleOpen() {
      this.tranValue = []
      this.visible = true;
    },
    handleOk() {
      let arr = [];
      this.tranValue.map(item => {
        arr.push(...this.titleData.filter(items => items.value === item))
      })
      this.tableColumList = arr
      this.visible = false;
    },
    /**
     * 编辑
     * @param row
     * @param type
     */
    handleDetail(row) {
      this.$router.push({name: 'singleContract', query: {id: row.contractId, type: 'view', ispdf: 'pdf'}})
    },
    /**
     * 列表数据
     */
    async getContractPage() {
      this.getParams();
      this.loading = true
      const {code, data} = await getContractPage({
        ...this.searchForm,
        ...this.ruleForm
      })
      if (code === '000000') {
        var arr = [];
        data.records.length > 0 && data.records.map(item => {
          arr.push({
            ...item,
            includedAmount: item.includedAmount > 0 ? item.includedAmount / 100 : item.includedAmount
          })
        }) || []
        this.tableData = arr;
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
     *  导出
     */
    async getContractDown() {
      let arr = [];
      let obj = {}
      for (var k in this.tableColumList) {
        obj[this.tableColumList[k].value] = this.tableColumList[k].name;
        arr.push(obj)
        obj = {}
      }
      var xmlResquest = new XMLHttpRequest();
      var formData = new FormData();
      const token = Cookies.get('token');
      const userId = this.userInfo.userId;
      const timestamp = new Date().getTime();
      const nonce = rand(1000, 9999);
      formData = JSON.stringify({
        ...this.ruleForm,
        'titleList': arr
      })
      xmlResquest.open('post', process.env.VUE_APP_API_URL + 'contract/query/exportLedgerContract', true);
      xmlResquest.setRequestHeader("Content-Type", "application/json");
      xmlResquest.setRequestHeader('Authorization', Cookies.get('Authorization'));
      xmlResquest.setRequestHeader('token', token);
      xmlResquest.setRequestHeader('signature', md5(userId + token + nonce + timestamp + ''));
      xmlResquest.setRequestHeader('nonce', nonce);
      xmlResquest.setRequestHeader('timestamp', timestamp);
      xmlResquest.responseType = 'blob';
      xmlResquest.onload = function (oEvent) {
        var content = xmlResquest.response;
        var filename = "合同台账.xls";
        var elink = document.createElement('a');
        elink.download = filename;
        elink.style.display = 'none';
        var blob = new Blob([content]);
        // 兼容ie
        if (window.navigator.msSaveBlob) {
          try {
            window.navigator.msSaveBlob(blob, filename)
          } catch (e) {
            console.log(e);
          }
        } else {
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        }
      };
      xmlResquest.send(formData);
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
     * 导出
     */
    handleDown() {
      this.getContractDown()
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
      this.timeData = {}
      this.timeData1 = {}
      this.getContractPage()
    },
    getParams() {
      this.ruleForm = {
        ...this.ruleForm,
        approvalTimeFrom: this.timeData.startTime || '', // 审批完成时间开始
        approvalTimeTo: this.timeData.endTime || '', // 审批完成时间结束
        signTimeFrom: this.timeData1.startTime || '', // 签署时间开始
        signTimeTo: this.timeData1.endTime || '',// 签署时间截至
        otherSignTimeFrom: this.timeData2.startTime || '', // 对方签署时间开始
        otherSignTimeTo: this.timeData2.endTime || '',// 对方签署时间截至
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

