<template>
  <div class="panDiv">
    <div class="bg-white user-form-table">
      <div>
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
        stripe
        highlight-current-row
        style="width: 100%"
        :header-cell-style="{background:'#f3f3f3'}"
        size="small"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="objectDescription" label="主题">
          <template v-slot="{row}">
            <a
              :style="{color:row.attribute2==='REJECTPROCESS'?'red':''}"
              class="pointer"
              @click="handleDetail(row)"
            >{{ row.objectDescription }}</a>
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
                 v-if="row.task_key === 'start' && row.attribute4 === 'STOPPROCESS'">
              <el-popconfirm title="确认撤回该条记录吗?" @onConfirm="handleDeleteClick(row)">
                <el-button slot="reference" type="text" size="mini" circle>删除</el-button>
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
import {deleteProcess, getBackList, getHomeRadioList} from "@/service/work";

export default {
  data() {
    return {
      overHeight: "150px",
      ruleForm: {
        date: [],
        objectDescription: "",
        objectTypeCode: "",
      },
      rules: {},
      deletUrl: "",
      tableData: [],
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      tabPosition: "HOME_ALL",
      radioList:[]
    };
  },
  mounted() {
    this.$store.dispatch("setHeight", 130);
    this.getBackList();
    this.getRadioList()
  },

  methods: {
    // 撤回
    async handleDeleteClick(row) {
      const {code} = await deleteProcess({
        id: row.workflowHistoryId
      })
      if (code === '000000') {
        this.getBackList()
      }
    },
    async getBackList() {
      const { code, data } = await getBackList({
        ...this.searchForm,
      });
      if (code === "000000") {
        this.tableData = data.content || [];
        this.searchForm.total = data.total;
        // 返回代表已办条数
        this.$emit("fist-num", data.total || 0);
      }
    },

    /**
     * 分页查询
     */
    handlerCurrentPage(list) {
      this.searchForm = {
        ...this.searchForm,
        ...list,
      };
      this.getBackList();
    },
    /**
     * 点击待办跳审批页
     * @param row
     */
    async handleDetail(row) {
      this.$router.push({
        name: "distribute",
        query: { id: row.workflowHistoryId },
      });
    },
    //显示不同数据
    showData(val){
      this.searchForm.currentPage = 1
      if("searchText" !== val){
        this.searchForm.objectType = val
      }
      this.getBackList()
    },
    getRadioList(){
      this.radioList = []
      getHomeRadioList().then(res=>{
        if(res.code==='000000'){
          this.radioList = res.data
        }
      })
    }
  },
};
</script>

<style lang="less">
.panDiv {
  .button-center {
    text-align: center;

    span {
      font-size: 14px;
      color: #2393f7;
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

