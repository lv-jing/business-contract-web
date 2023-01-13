<template>
  <div>
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" label-width="110px"
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
            <el-form-item label="传阅状态" prop="circulateStatus">
              <common-select
                v-model="ruleForm.circulateStatus"
                dictCode="CIRCULATE_STATUS"
                :value="ruleForm.circulateStatus"
                placeholder="请选择传阅状态"
                :isSplicing="false"
              />
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
      <el-table
        v-loading="loading"
        class="mt10 md20"
        :data="tableData"
        stripe highlight-current-row
        style="width: 100%"
        :header-cell-style="{background:'#f3f3f3'}"
        size="small">
        <el-table-column prop="contractNo" label="合同编号">
          <template v-slot={row}>
            <a class="pointer" @click="handleDetail(row)">{{ row.contractNo }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="contractName" label="合同名称">
          <template v-slot={row}>
            <a class="pointer" @click="handleDetail(row)">{{ row.contractName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="contractDesc" label="合同描述"></el-table-column>
        <el-table-column prop="otherEntityName" label="对方签约主体"></el-table-column>
        <el-table-column prop="includedAmount" label="含税合同额(元)" align="right">
          <template v-slot="{row}">
            <span>{{row.includedAmount>0?row.includedAmount/100:row.includedAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="signTime" label="签订时间">
          <template v-slot="{row}">
            <span>{{row.signTime?row.signTime.substring(0,10):''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="statue" label="合同状态">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'CONTRACT_STATUE'" :dictCode="row.statue"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="statue" label="传阅状态">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'CIRCULATE_STATUS'" :dictCode="row.circulateStatus"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="createByName" label="传阅对象" align="center">
          <template v-slot={row}>
            <el-button type="text" @click="handleDetail(row)" size="medium" circle>编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="80"
          align="center"
        >
          <template v-slot="{row}">
            <div class="tc">
              <el-popconfirm title="确认取消该条传阅吗?" @onConfirm="handleDeleteClick(row)">
                <el-button slot="reference" type="text" size="medium" circle>取消传阅</el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      style="overflow-y: hidden;"
      title="合同传阅"
      :visible.sync="visible"
      width="45%">
      <el-form :model="ruleForms" :rules="rules" label-width="80px"
               ref="ruleForms">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="传阅人" prop="personObj.userName">
              <commonItemSelect
                :onChange="(val)=>onChange(val)"
                v-model="ruleForms.personObj"
                :value="ruleForms.personObj"
                placeholder="传阅人"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" icon="iconfont sbt_add" @click="handleAddList">添加</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="elTableData"
        stripe
        :max-height="265"
        highlight-current-row
        style="width: 100%;"
        :header-cell-style="{background:'#f3f3f3'}"
        :visible.sync="handleModlue"
      >
        <el-table-column prop="memberName" label="传阅人"></el-table-column>
        <el-table-column prop="memberOrgName" label="部门"></el-table-column>
        <el-table-column
          label="操作"
          width="80"
          align="center"
        >
          <template v-slot="{row}">
            <div class="tc">
              <el-popconfirm title="确认删除该条记录吗?" @onConfirm="handleDelete(row)">
                <el-button slot="reference" type="text" size="mini" circle>删除</el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <common-pagination :layout="layout" v-on:handler-currentPage="handlerCurrentPage1"
                         :list="searchForm1"></common-pagination>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import {getBasiList, addCircuList, detailCircul, deleteMember} from '@/service/assistant'
import {getContractType} from "@/service/approval";

export default {
  data() {
    return {
      loading: false,
      visible: false,
      contractId: '',
      ecmBusinessMemberList: [],
      ruleForm: {
        contractName: '',
        ourSide: '',
        otherSide: '',
        contractTypeCode: '',
        statue: '',
        circulateStatus: '',
        signTime: ''
      },
      ruleForms: {
        personObj: {
          userName: '',
          userId:''
        }
      },
      commonObj: {},
      rules: {
        "personObj.userName": [
          {required: true, message: '请选传阅人', trigger: 'blur'}
        ],
      },
      deletUrl: '',
      tableData: [],
      elTableData: [],
      conditList: [],
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      searchForm1: {
        currentPage: 1,
        pageSize: 5,
        total: 0
      },
      layout: "total, prev, pager, next"
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
    async getBackList() {
      this.loading = true;
      const {code, data} = await getBasiList({
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
      this.getBackList()
    },
    /**
     * 传阅人员分页
     */
    handlerCurrentPage1(list) {
      this.searchForm1 = {
        ...this.searchForm1,
        ...list
      };
      this.detailData()
    },
    /**
     * 查看
     * @param row
     * @param type
     */
    async handleDetail(row) {
      this.contractId = row.contractId;
      this.visible = true;
      this.detailData()
    },
    /**
     * 取消传阅
     * @param row
     */
    async handleDeleteClick(row) {
      this.contractId = row.contractId;
      this.commonObj = null
      this.addCircuList()
    },
    /**
     * 传阅人员列表
     */
    async detailData() {
      const {code, data} = await detailCircul({
        ...this.searchForm1,
        businessId: this.contractId,
        businessType: "PET002"
      })
      if (code === '000000') {
        this.elTableData = data.records || [];
        this.searchForm1.total = data.total
      }
    },
    // 弹窗取消/确定
    async handleModlue() {
      this.ruleForms.personObj = {
        ...this.ruleForms.personObj,
        userName: "",
        userId: ''
      }
      this.$refs.ruleForms.resetFields();
      this.visible = false;
    },
    // 添加人员change
    onChange(val) {
      this.commonObj = {
        memberName: val.userName,
        memberEmpNo: val.userCode,
        memberId: val.userId,
        memberUnitName: val.unitName,
        memberUnitCode: val.unitCode,
        memberOrgName: val.orgName,
        memberOrgCode: val.orgCode
      }
    },
    /**
     * 新增传阅人员
     */
    handleAddList() {
      this.$refs.ruleForms.validate((valid) => {
        if (valid) {
          this.addCircuList('add')
        }
      })
    },
    // 新增接口
    async addCircuList(type) {
      const {code} = await addCircuList({
        ecmBusinessMemberList: this.commonObj ? [this.commonObj] : [],
        contractId: this.contractId
      })
      if (code === '000000') {
        this.$message.success('处理成功')
        this.detailData()
        this.getBackList()
      }
      if (type === 'add') {
        this.ruleForms.personObj = {
          ...this.ruleForms.personObj,
          userName: "",
          userId: ''
        }
        this.$refs.ruleForms.resetFields();
      }
    },
    /**
     * 删除
     */
    async handleDelete(row) {
      const {code} = await deleteMember(row.businessMemberId)
      if (code === '000000') {
        this.$message.success('处理成功')
        this.detailData()
        this.getBackList()
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

