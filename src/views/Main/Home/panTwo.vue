<template>
  <div class="panDivTwo">
    <div class="bg-white user-form-table">
      <div v-if="false">
        <el-radio-group v-model="tabPosition" @change="showData" style="margin-bottom: 10px;float:left;">
          <el-radio-button v-for="(item,index) in radioList" :key="index" :label="item.dictCode">{{item.dictName}}</el-radio-button>
        </el-radio-group>
        <div style="margin-bottom: 10px;float:right;">
          <el-input v-model="searchForm.objectDescription" placeholder="搜索" @keyup.enter.native="showData('searchText')">
             <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
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
        <el-table-column prop="submitterName" label="提报人" width="100"></el-table-column>
        <el-table-column
          label="操作"
          width="80"
          align="center"
        >
          <template v-slot="{row}">
            <div class="tc"
                 v-if="row.task_key === 'start' && row.attribute4 === 'ROLLBACK'">
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
import {deleteProcess, getDoneList,getHomeRadioList} from '@/service/work'
import {mapState} from "vuex";

export default {
  data() {
    return {
      overHeight: '150px',
      ruleForm: {
        objectDescription: '',
        objectTypeCode: '',
        date: [],
        getAttribute1: '',
        getAttribute2: '',
      },
      rules: {},
      tableData: [],
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tabPosition: "HOME_ALL",
      radioList:[]
    };
  },
  mounted() {
    this.$store.dispatch('setHeight', 100)
    this.getDoneList()
    this.getRadioList()
  },

  methods: {
    // 撤回
    async handleDeleteClick(row) {
      const {code} = await deleteProcess({
        id: row.workflowHistoryId
      })
      if (code === '000000') {
        this.getDoneList()
      }
    },
    async getDoneList() {
      const {code, data} = await getDoneList({
        ...this.searchForm
      });
      if (code === '000000') {
        this.tableData = data.content || []
        this.searchForm.total = data.total
        //返回代表已办条数
        this.$emit('second-num', data.total || 0)
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
      this.getDoneList();
    },
    /**
     * 点击已办跳转详情页
     * @param row
     */
    handleDetail(row) {
      this.$router.push({name:'distribute',query:{id:row.workflowHistoryId}})
    },
    //显示不同数据
    showData(val){
      this.searchForm.currentPage = 1
      if("searchText" !== val){
        this.searchForm.objectType = val
      }
      this.getDoneList()
    },
     getRadioList(){
      this.radioList = []
      getHomeRadioList().then(res=>{
        if(res.code==='000000'){
          this.radioList = res.data
        }
      })
    }
  }
};
</script>

<style lang="less">
.panDivTwo {
.button-center {
  text-align: center;

  span {
    font-size: 14px;
    color: #2393F7;
  }
}
 .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #fff;
    background-color: #a2c0d7 !important;
    border-color: #a2c0d7 !important;
    -webkit-box-shadow: -1px 0 0 0 #a2c0d7 !important;
    box-shadow: -1px 0 0 0 #a2c0d7 !important;
  }
  .el-radio-button__inner:hover {
    color:black !important;
}
.el-radio-button:first-child .el-radio-button__inner{
    width:88px;
  }
}
</style>

