<template>
  <div>
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" label-width="100px"
               ref="ruleForm">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="授权人" prop="authorizerName">
              <el-input v-model="ruleForm.authorizerName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="被授权人" prop="authorizedName">
              <el-input v-model="ruleForm.authorizedName" placeholder="请输入被授权人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同类型" prop="contractType">
              <CommonTreeSelect
                :value="contractType"
                :treeSelect="treeSelect"
                :treeDelSelect="treeDelSelect"
                :dict-code="'INCOME_EXPE_TYPE'"
                :multiple="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="被授权部门" prop="orgName">
              <el-input v-model="ruleForm.orgName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label=合同金额>
              <el-input type="number" style="width: 45%;float: left" v-model.number="ruleForm.contractMinAmount"
                        placeholder="合同金额"></el-input>
              <div style="float:left;width:10%;text-align:center;">至</div>
              <el-input type="number" style="width: 45%;float: right" v-model.number="ruleForm.contractMaxAmount"
                        placeholder="合同金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授权时间" prop="date">
              <datePicker ref="datePicker" v-model="timeData"></datePicker>
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
      <el-button type="primary" @click="handleAdd"
                 icon="iconfont sbt_add">新建授权
      </el-button>
      <el-table
        class="mt10 md20"
        :data="tableData"
        stripe highlight-current-row
        style="width: 100%"
        :header-cell-style="{background:'#f3f3f3'}"
        size="small"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="authorizerName" label="授权人" width="80"></el-table-column>
        <el-table-column prop="authorizedName" label="被授权人" width="100"></el-table-column>
        <el-table-column prop="contractTypeName" label="合同类型"></el-table-column>
        <el-table-column prop="createByName" label="合同金额">
          <template v-slot="{row}">
            <span>{{
                row.contractMinAmount && row.contractMaxAmount ? row.contractMinAmount + '-' + row.contractMaxAmount : ''
              }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orgName" label="被授权部门"></el-table-column>
        <el-table-column prop="authorizeStartTime" label="开始时间"></el-table-column>
        <el-table-column prop="authorizeEndTime" label="结束时间"></el-table-column>
        <el-table-column label="授权状态" prop="statue" width="80">
          <template v-slot="{row}">
            <DictCodeToDictName :parentCode="'STATUE'" :dictCode="row.statue"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
          align="center"
        >
          <template v-slot="{row}">
            <div class="tc">
              <el-button v-if="new Date(row.authorizeEndTime)-new Date()>0" slot="reference" @click="handleEdit(row)"
                         type="text" size="mini" circle>授权修改
              </el-button>
              <el-popconfirm v-if="row.statue==='Y'" title="确认取消授权吗?" @onConfirm="handleDeleteClick(row)">
                <el-button slot="reference" type="text" size="mini" circle>取消授权</el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {getauthList, updateList} from '@/service/work'
import {mapState} from "vuex";

export default {
  data() {
    return {
      visible: false,
      timeData: {},
      contractType: '',
      ruleForm: {
        contractType: '',
        authorizerName: '',
        authorizedName: '',
        authorizeStartTime: '',
        authorizeEndTime: '',
        contractMinAmount: '',
        contractMaxAmount: '',
      },
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      typeArr: []
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  mounted() {
    this.ruleForm = {
      ...this.ruleForm,
      authorizerName: this.userInfo.userName,
    }
    this.$nextTick(()=>{
      this.getauthList()
    })
  },
  methods: {
    // 选择的合同类型
    treeSelect(val) {
      this.typeArr.push({
        contractType: val.dictCode,
        contractTypeName: val.attribute1 || val.dictName
      })
    },
    // 删除输入框选择的合同类型
    treeDelSelect(val) {
      let data = [val]
      var set = data.map(item => item.dictCode)
      this.typeArr = this.typeArr.filter(item => !set.includes(item.contractType))
    },
    /**
     * 新增
     */
    handleAdd() {
      this.$router.push({name: 'authorizedapproval', query: {type: 'add'}})
    },
    /**
     * 编辑
     */
    handleEdit(row) {
      this.$router.push({name:'authorizedapproval',query:{type:'edit',id:row.contractApprovalAuthId}})
    },
    /**
     * 取消授权
     */
    async handleDeleteClick(row) {
      const {code} = await updateList({
        contractApprovalAuthId: row.contractApprovalAuthId,
        statue: 'N'
      })
      if (code === '000000') {
        this.getauthList()
        this.$message.success('处理成功')
      }
    },
    // 列表
    async getauthList() {
      let arr = this.typeArr;
      var contractType = []
      if (arr.length > 0) {
        arr.length > 0 && arr.map(item => {
          contractType.push(item.contractType)
        })
        contractType = contractType.join()
      } else {
        contractType = ''
      }
      const {code, data} = await getauthList({
        ...this.searchForm, ...this.ruleForm,
        authorizeStartTime: this.timeData.startTime,
        authorizeEndTime: this.timeData.endTime,
        contractType: contractType,
      });
      if (code === '000000') {
        this.tableData = data.records || []
        this.searchForm.total = data.total
      }
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
      this.getauthList()
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
      this.typeArr = [];
      this.$refs[self].resetFields()
      this.ruleForm.contractType = '';
      this.contractType = [];
      this.ruleForm.contractMinAmount = ''
      this.ruleForm.contractMaxAmount = ''
      this.timeData = {
        startTime: '',
        endTime: ''
      }
      this.$refs.datePicker.reset();
      this.ruleForm = {
        ...this.ruleForm,
        authorizerName: this.userInfo.userName,
      }
      this.getauthList()
    },
    /**
     * 分页查询
     */
    handlerCurrentPage(list) {
      this.searchForm = {
        ...this.searchForm,
        ...list
      };
      this.getauthList();
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

