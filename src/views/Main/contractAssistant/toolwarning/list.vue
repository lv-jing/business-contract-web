<template>
  <div>
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" :rules="rules" label-width="100px"
               ref="ruleForm">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="预警单名称" prop="warningName">
              <el-input v-model="ruleForm.warningName" placeholder="预警单名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人" prop="createdByName">
              <el-input v-model="ruleForm.createdByName" placeholder="请输入创建人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建日期" prop="creationDate">
              <el-date-picker
                class="w-100"
                v-model="ruleForm.creationDate"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="创建日期">
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
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我创建的" name="first"></el-tab-pane>
        <el-tab-pane label="我接收的" name="second"></el-tab-pane>
      </el-tabs>
      <el-button type="primary" @click="$router.push({name:'toolwarning',query:{type:'add'}})"
                 icon="iconfont sbt_add">新建预警单
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
        <el-table-column prop="warningName" label="预警单名称">
          <template v-slot={row}>
            <a class="pointer" @click="handleDetail(row)">{{ row.warningName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="creationDate" label="创建日期"></el-table-column>
        <el-table-column prop="createdByName" label="创建人"></el-table-column>
        <el-table-column prop="orgName" label="创建部门"></el-table-column>
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {warningList} from '@/service/assistant'

export default {
  data() {
    return {
      activeName:'first',
      overHeight: '150px',
      ruleForm: {
        date: [],
        warningName: '',
        creationDate: '',
        createdByName: '',
        tabType:'create'
      },
      rules: {},
      deletUrl: '',
      tableData: [],
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  mounted() {
    this.warningList()
  },

  methods: {
    handleClick(){
      this.ruleForm.tabType= this.activeName==='first'? 'create':'recieve';
      this.searchForm = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      };
      this.warningList()
    },
    async warningList() {
      const {code, data} = await warningList({
        ...this.searchForm, ...this.$refs.ruleForm.model
      });
      if (code === '000000') {
        this.tableData = data.content || []
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
      this.warningList()
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
      this.warningList()
    },
    /**
     * 分页查询
     */
    handlerCurrentPage(list) {
      this.searchForm = {
        ...this.searchForm,
        ...list
      };
      this.warningList();
    },
    /**
     * 点击待办跳转审批页
     * @param row
     */
    handleDetail(row) {
      this.$router.push({name: 'toolwarning', query: {type:'view',id: row.contractWarningId}})
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

