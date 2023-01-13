<template>
  <div>
    <el-table
      class="mt10 md20"
      :data="tableData"
      stripe
      highlight-current-row
      @selection-change="handleSelectionChange"
      style="width: 100%;"
      :header-cell-style="{background:'#f3f3f3'}"
      size="small"
      v-loading="loading"
    >
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column prop="contractNo" label="合同编号" fixed width="150">
        <template slot-scope="scope">
          <el-link type="primary" @click="gotoDetail(scope.row)">{{scope.row.contractNo}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="contractName" label="合同名称" fixed width="150">
        <template slot-scope="scope">
          <el-link type="primary" @click="gotoDetail(scope.row)">{{scope.row.contractName}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="contractTypeCode" label="合同类型" fixed width="150">
        <template slot-scope="scope">
          <DictCodeToDictName
            :parentCode="'INCOME_EXPE_TYPE'"
            :dictCode="scope.row.contractTypeCode"
          ></DictCodeToDictName>
        </template>
      </el-table-column>
      <el-table-column prop="ourEntityName" label="我方签约主体" width="300"></el-table-column>
      <el-table-column prop="otherEntityName" label="对方签约主体" width="300"></el-table-column>
      <el-table-column prop="includedAmount" label="含税合同额" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.includedAmount?scope.row.includedAmount/100:''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="managerName" label="经办人" width="150"></el-table-column>
      <el-table-column prop="approvalTime" label="审批完成日期" width="150">
        <template
          slot-scope="scope"
        >{{scope.row.approvalTime?scope.row.approvalTime.substring(0,11):''}}</template>
      </el-table-column>
      <el-table-column
        prop="watermark"
        v-if="queryData.type !='CONFIRM_APPLICATION'"
        label="无水印模式"
        width="150"
      >
        <template slot-scope="scope">
          <DictCodeToDictName :parentCode="'YES_NO'" :dictCode="scope.row.watermark"></DictCodeToDictName>
        </template>
      </el-table-column>
      <el-table-column prop="statue" label="合同状态" width="150">
        <template slot-scope="scope">
          <DictCodeToDictName :parentCode="'CONTRACT_STATUE'" :dictCode="scope.row.statue"></DictCodeToDictName>
        </template>
      </el-table-column>
      <el-table-column
        prop="statue"
        label="签署状态"
        v-if="queryData.type ==='CONFIRM_APPLICATION'"
        width="150"
      >
        <template slot-scope="scope">
          <DictCodeToDictName :parentCode="'CONTRACT_STATUE'" :dictCode="scope.row.statue"></DictCodeToDictName>
        </template>
      </el-table-column>
      <el-table-column
        v-if="queryData.type === 'SEALAPPLICATION'"
        prop="statue"
        label="用印申请状态"
        width="150"
      >
        <template slot-scope="scope">{{scope.row.statue === 'STA005'?'未用印':'已用印'}}</template>
      </el-table-column>
      <el-table-column
        v-if="queryData.type === 'PRINT_APPLICATION'"
        prop="statue"
        label="打印下载状态"
        width="150"
      >
        <template slot-scope="scope">{{scope.row.statue === 'STA006'?'未打印':'已打印'}}</template>
      </el-table-column>
      <!-- <el-table-column prop="statue" label="打印状态"></el-table-column>
      <el-table-column prop="offlinePrint" label="是否线下用印补章"></el-table-column>-->
      <el-table-column prop="signWay" label="签订方式" width="150">
        <template slot-scope="scope">
          <DictCodeToDictName :parentCode="'SIGN_WAY'" :dictCode="scope.row.signWay"></DictCodeToDictName>
        </template>
      </el-table-column>
      <el-table-column prop="signOrder" label="用印顺序" width="150">
        <template slot-scope="scope">
          <DictCodeToDictName :parentCode="'SIGN_ORDER'" :dictCode="scope.row.signOrder"></DictCodeToDictName>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="queryData.type === 'CONTRACTMONITORING_APPLICATION'">
        <template slot-scope="scope">
          <el-button type="primary" @click="gotoContractMonitoringDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="statue" label="签署状态"></el-table-column> -->
    </el-table>
    <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    <el-dialog title="合同监控列表" :visible.sync="dialogTableVisible">
      <el-table :data="contractMonitoringData">
        <el-table-column property="contractNo" label="合同编号" width="150"></el-table-column>
        <el-table-column property="contractName" label="合同名称" width="200"></el-table-column>
        <el-table-column property="statue" label="是否合规">
          <template slot-scope="scope">{{contractMonitorRadio[scope.row.statue]}}</template>
        </el-table-column>
        <el-table-column property="remarks" label="合规性"></el-table-column>
        <el-table-column property="creationDate" label="创建时间"></el-table-column>
      </el-table>
      <common-pagination
        v-on:handler-currentPage="handlerContractMonitoring"
        :list="monitorSearchForm"
      ></common-pagination>
    </el-dialog>
  </div>
</template>
<script>
import { queryContractPage } from "@/service/common";
import { listContractMonitoring } from "@/service/terms/index.js";
export default {
  props: {
    queryData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading:false,
      tableData: [],
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isQuery: false,
      dialogTableVisible: false,
      contractMonitoringData: [],
      contractMonitorRadio: {
        "1": "合规",
        "2": "不合规",
      },
      monitorSearchForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      choosedMonitorData:{} // 合同监控分页的组件
    };
  },
  mounted() {},
  created() {},
  watch: {
    queryData(val) {
      if (!this.isQuery) {
        this.getData(val);
        this.isQuery = true;
      }
    },
  },
  methods: {
    getData() {
      this.tableData = [];
      this.loading = true
      setTimeout(() => {
        let params = {
          ...this.queryData.data,
          ...this.searchForm,
        };
        queryContractPage(params).then(res=>{
          if (res.code === "000000") {
            this.tableData = res.data.records;
            this.searchForm.total = res.data.total;
          }
          this.loading = false
        }).catch(err=>{
          this.loading = false
        })
      }, 500);
    },
    handlerCurrentPage(params) {
      console.log(params);
      this.searchForm = {
        ...this.searchForm,
        ...params,
      };
      this.getData();
    },
    gotoDetail(params) {
      if (this.queryData.type === "SEALAPPLICATION") {
        this.$router.push({
          name: "applyseal",
          query: {
            type: "auditing",
            contractId: params.contractId,
            signType: "CHOOSESIGNTYPE",
          },
        });
      }
      if (this.queryData.type === "PRINT_APPLICATION" || this.queryData.type === "OFFLINE_SEAL_APPLICATION" ) {
        this.$router.push({
          name: "printdownload",
          query: {
            type: "auditing",
            contractId: params.contractId,
            signType: "CHOOSESIGNTYPE",
          },
        });
      }
      if (this.queryData.type === "CONFIRM_APPLICATION") {
        this.$router.push({
          name: "confirmation",
          query: {
            type: "auditing",
            contractId: params.contractId,
            signType: "",
          },
        });
      }
      if (this.queryData.type === "NO_WATER_APPLICATION") {
        this.$router.push({
          name: "watermarkapplication",
          query: {
            type: "auditing",
            contractId: params.contractId,
            signType: "start",
          },
        });
      }
      if (this.queryData.type === "APPLICATION_RECALL") {
        this.$router.push({
          name: "contractrecall",
          query: {
            type: "auditing",
            contractId: params.contractId,
          },
        });
      }
      if (this.queryData.type === "CONTRACTMONITORING_APPLICATION") {
        // 合同监控
        this.$router.push({
          name: "contractMonitoring",
          query: {
            type: "auditing",
            contractId: params.contractId,
          },
        });
      }
    },
    // 合同监控的详情
    gotoContractMonitoringDetail(params) {
      this.choosedMonitorData = params
      this.getList(params)
    },
    async getList(params){
      let obj = {
        contractId: params.contractId,
        currentPage: this.monitorSearchForm.pageNum,
        pageSize:this.monitorSearchForm.pageSize
      };
      const { code, data } = await listContractMonitoring(obj);
      if (code === "000000") {
        if (data.records.length === 0) {
          this.$message({ type: "warning", message: "暂未获取到数据!" });
          return;
        }
        this.monitorSearchForm.total = data.total
        this.contractMonitoringData = data.records;
        this.dialogTableVisible = true;
      }
      console.log(params);
    },
    handlerContractMonitoring(params) {
      this.monitorSearchForm = {
        ...this.monitorSearchForm,
        ...params
      }
      this.getList(this.choosedMonitorData)
    },
    handleSelectionChange(val) {
      this.$emit("getData", val);
    },
  },
};
</script>
<style lang="less" scoped>
</style>
