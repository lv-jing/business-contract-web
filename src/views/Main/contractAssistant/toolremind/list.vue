<template>
  <div>
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" :rules="rules" label-width="110px"
               ref="ruleForm">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="合同名称/编号" prop="contractName">
              <el-input v-model="ruleForm.contractName" placeholder="请输入合同名称/编号"></el-input>
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
                :isSplicing="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签订日期" prop="signTime">
              <el-date-picker
                class="w-100"
                v-model="ruleForm.signTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="button-box tr">
              <el-button type="primary" @click="formSearchMethod"
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
        <el-table-column prop="contractNo" label="合同编号"></el-table-column>
        <el-table-column prop="contractName" label="合同名称"></el-table-column>
        <el-table-column prop="contractDesc" label="合同描述"></el-table-column>
        <el-table-column prop="ourEntityName" label="我方签约主体"></el-table-column>
        <el-table-column prop="otherEntityName" label="对方签约主体"></el-table-column>
        <el-table-column prop="includedAmount" label="合同总金额(元)" align="right">
          <template v-slot="{row}">
            <span>{{row.includedAmount>0?row.includedAmount/100:row.includedAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="signTime" label="签订时间"></el-table-column>
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
        <el-table-column prop="createByName" label="关键履行事项" align="center">
          <template v-slot={row}>
            <a class="pointer" @click="handleDetail(row,3)" style="margin-right: 5px;">查看</a>
            <a class="pointer" @click="handleDetail(row)">新增</a>
          </template>
        </el-table-column>
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {getToolrList} from '@/service/assistant'
import {getContractType} from "@/service/approval";

export default {
  data() {
    return {
      loading:false,
      overHeight: '150px',
      ruleForm: {
        contractName: '',
        ourSide: '',
        otherSide: '',
        contractTypeCode: '',
        statue: '',
        signTime: ''
      },
      rules: {},
      deletUrl: '',
      tableData: [],
      conditList:[],
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  mounted() {
    this.getContractType()
    this.getBackList()
  },

  methods: {
    /**
     *  合同类型
     */
    async getContractType(params) {
      const {code, data} = await getContractType({
        dictCode:"INCOME_EXPE_TYPE",
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
    async getBackList() {
      this.loading = true
      const {code, data} = await getToolrList({
        ...this.searchForm, ...this.$refs.ruleForm.model
      });
      if (code === '000000') {
        this.tableData = data.records || []
        this.searchForm.total = data.total
      }
      this.loading = false
    },
    /**
     * 查询
     */
    formSearchMethod() {
      this.searchForm = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      };
      this.getBackList()
    },
    /**
     * 重置
     */
    formResetMethod(self) {
      this.searchForm = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      };
      this.$refs[self].resetFields()
      this.getBackList()
    },
    /**
     * 分页查询
     */
    handlerCurrentPage(list) {
      this.searchForm = {
        ...this.searchForm,
        ...list
      };
      this.getBackList();
    },
    /**
     * 点击待办跳转审批页
     * @param row
     */
    handleDetail(row,num) {
      if(num){
        this.$router.push({name: 'toolremind', query: {type:'view',id: row.contractId,statue:row.statue}})
      }else {
        this.$router.push({name: 'toolremind', query: {type:'adds',id: row.contractId,statue:row.statue}})
      }
    },
  }
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

