<template>
  <div>
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" :rules="rules" label-width="100px"
               ref="ruleForm">
        <el-row :gutter="24">
          <div>
            <el-col :span="8">
              <el-form-item label="主题" prop="objectDescription">
                <el-input v-model="ruleForm.objectDescription" placeholder="请输入主题"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="流程类型" prop="objectTypeCode">
                <common-select
                  v-model="ruleForm.objectTypeCode"
                  dictCode="OBJECT_TYPE"
                  :value="ruleForm.objectTypeCode"
                  placeholder="请选择流程类型"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接收时间" prop="date">
                <el-date-picker
                  style="width: 100%"
                  v-model="ruleForm.date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  placeholder="选择接收时间"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </div>
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
        class="mt10 md20"
        :data="tableData"
        stripe highlight-current-row
        style="width: 100%"
        :header-cell-style="{background:'#f3f3f3'}"
        size="small"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="objectDescription" label="主题">
          <template v-slot={row}>
            <a class="pointer" @click="handleDetail(row)">{{ row.objectDescription }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="attribute7" label="我方签约主体" show-overflow-tooltip></el-table-column>
        <el-table-column prop="attribute8" label="对方签约主体" show-overflow-tooltip></el-table-column>
        <el-table-column prop="objectType" label="流程类型" width="120"></el-table-column>
        <el-table-column prop="creationDate" label="接收日期" width="180"></el-table-column>
        <el-table-column prop="createByName" label="发送人" width="80"></el-table-column>
        <el-table-column
          label="操作"
          width="80"
          align="center"
        >
          <template v-slot="{row}">
            <div class="tc" v-if="row.taskKey === 'start' && row.attribute4 === 'ROLLBACK'">
            <el-popconfirm title="确认撤回该条记录吗?" @onConfirm="handleDeleteClick(row)">
                <el-button slot="reference" type="text" size="mini" circle>审批撤回</el-button>
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
import {getDoneList, deleteProcess} from '@/service/work'
import {objectTypeCode, projectTypes} from '@/utils/tools'
import {mapState} from "vuex";

export default {
  data() {
    return {
      overHeight: '150px',
      ruleForm: {
        objectDescription: '',
        objectTypeCode: '',
        date: [],
      },
      rules: {},
      tableData: [],
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  mounted() {
    this.$store.dispatch('setHeight', 100)
    this.getDoneList()
  },

  methods: {
    // 撤回
    async handleDeleteClick(row){
        const {code} = await deleteProcess({
          id:row.workflowHistoryId
        })
      if(code === '000000'){
        this.getDoneList()
      }
    },
    // 已办列表
    async getDoneList() {
      let date = this.ruleForm.date;
      const {code, data} = await getDoneList({
        ...this.searchForm, ...this.$refs.ruleForm.model,
        attribute1: date && date.length > 0 && date[0] + ' ' + '00:00:00' || '',
        attribute2: date && date.length > 0 && date[1] + ' ' + '23:59:59' || '',
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
      this.getDoneList()
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
      this.getDoneList()
    },
    /**
     * 分页查询
     */
    handlerCurrentPage(list) {
      this.searchForm = {
        ...this.searchForm,
        ...list
      };
      this.getDoneList();
    },
    /**
     * 点击已办跳转详情页
     * @param row
     */
    handleDetail(row) {
      this.$router.push({name:'distribute',query:{id:row.workflowHistoryId}})
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
