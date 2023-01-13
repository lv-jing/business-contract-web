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
            <el-form-item label="对方签约主体" prop="otherSide">
              <el-input v-model="ruleForm.otherSide" placeholder="请输入对方签约主体"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
      <el-button type="primary" @click="handleGoto"
                 icon="iconfont sbt_add">移交
      </el-button>
      <el-table
        v-loading="loading"
        class="mt10 md20"
        :data="tableData"
        stripe highlight-current-row
        style="width: 100%"
        :header-cell-style="{background:'#f3f3f3'}"
        size="small"
        :cell-class-name="cellcb"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="contractNo" label="合同编号">
<!--          <template v-slot={row}>-->
<!--            <a class="pointer" @click="handleDetail(row)">{{ row.contractNo }}</a>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column prop="contractName" label="合同名称">
<!--          <template v-slot={row}>-->
<!--            <a class="pointer" @click="handleDetail(row)">{{ row.contractName }}</a>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column prop="otherEntityName" label="对方签约主体"></el-table-column>
        <el-table-column prop="contractTypeCode" label="合同类型">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'INCOME_EXPE_TYPE'" :dictCode="row.contractTypeCode"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="includedAmount" label="合同总金额(元)" align="right">
          <template v-slot="{row}">
            <span>{{row.includedAmount>0?row.includedAmount/100:row.includedAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="statue" label="合同状态" width="100">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'CONTRACT_STATUE'" :dictCode="row.statue"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="statue" label="移交状态" width="100">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'CONTRACT_TRANSFER_STATUS'" :dictCode="row.tranStatue"></DictCodeToDictName>
          </template>
        </el-table-column>
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {getTransfeList} from '@/service/assistant'
import {getContractType} from "@/service/approval";

export default {
  data() {
    return {
      loading:false,
      ruleForm: {
        contractName: '',
        ourSide: '',
        otherSide: '',
        contractTypeCode: '',
        statue: '',
        signTime: ''
      },
      rules: {},
      tableData: [],
      conditList: [],
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      checkData:[],
      contractIdList:[],
    };
  },
  mounted() {
    this.getContractType()
    this.getTransfeList()
  },

  methods: {
    cellcb(row){
      if(row.row.tranStatue){
        return "myCell"
      }
    },
    /**
     * 表格复选框
     */
    handleSelectionChange(data){
      let contractIdList = []
      this.checkData = data
      this.checkData.map(item=>{
        contractIdList.push({contractId:item.contractId})
      })
      this.contractIdList = contractIdList
    },
    handleGoto(){
      if(this.checkData.length>0){
        this.$router.push({name:'tooltransfer',query:{type:'add',contractIdList:JSON.stringify(this.contractIdList)}})
      } else {
        this.$message.error('请选择合同进行移交！')
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
    /**
     * 获取列表页数据
     */
    async getTransfeList() {
      this.loading = true
      const {code, data} = await getTransfeList({
        ...this.searchForm, ...this.$refs.ruleForm.model
      });
      if (code === '000000') {
        this.tableData = data.records || []
        this.searchForm.total = data.total
      }
      this.loading = false;
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
      this.getTransfeList()
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
      this.getTransfeList()
    },
    /**
     * 分页查询
     */
    handlerCurrentPage(list) {
      console.log(list);
      this.searchForm = {
        ...this.searchForm,
        ...list
      };
      this.getTransfeList()
    },
  }
};
</script>

<style lang="less">
.myCell .el-checkbox__input {

  display: none

}
.button-center {
  text-align: center;

  span {
    font-size: 14px;
    color: #2393F7;
  }
}
</style>

