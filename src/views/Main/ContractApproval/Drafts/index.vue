<template>
  <div>
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" :rules="rules" label-width="100px"
               ref="ruleForm">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="ruleForm.contractName" placeholder="请输入合同名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同流水号" prop="serialNumber">
              <el-input v-model="ruleForm.serialNumber" placeholder="请输入合同流水号"></el-input>
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
            <el-form-item label="合同批名称" prop="batchName">
              <el-input v-model="ruleForm.batchName" placeholder="请输入合同批名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同批编号" prop="batchNo">
              <el-input v-model="ruleForm.batchNo" placeholder="请输入合同批编号"></el-input>
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
        <el-table-column prop="contractName" label="合同名称">
          <template v-slot="{row}">
            <a @click="handleGoto(row)" href="javascript:;">{{ row.contractName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="serialNumber" label="合同流水号">
          <template v-slot="{row}">
            <a @click="handleGoto(row)" href="javascript:;">{{ row.serialNumber }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="ourSide" label="我方签约主体"></el-table-column>
        <el-table-column prop="otherSide" label="对方签约主体"></el-table-column>
        <el-table-column prop="attribute10" label="合同批名称">
          <template v-slot="{row}">
            <a @click="handleGoto(row,1)" href="javascript:;">{{ row.attribute10 }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="attribute9" label="合同批编号">
          <template v-slot="{row}">
            <a @click="handleGoto(row,1)" href="javascript:;">{{ row.attribute9 }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdateDate" label="保存时间"></el-table-column>
        <el-table-column
          label="操作"
          width="80"
          align="center"
        >
          <template v-slot="{row}">
            <div class="tc">
              <el-popconfirm title="确认删除该条记录吗?" @onConfirm="handleDeleteClick(row)">
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
import {getDraftsList, deleList, deleLists} from '@/service/approval'

export default {
  data() {
    return {
      loading: false,
      data: [],
      overHeight: '150px',
      ruleForm: {
        contractName: '',
        serialNumber: '',
        ourSide: '',
        otherSide: '',
        batchNo: '',
        batchName: '',
      },
      rules: {},
      deletUrl: '',
      tableData: [],
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
    };
  },
  mounted() {
    this.getDraftsList();
  },
  methods: {
    /**
     * 删除
     */
    async handleDeleteClick(row) {
      this.loading = true;
      if (row.generateWayCode === 'TYP01') {
        const {code} = await deleList(row.contractId)
        if (code === '000000') {
          this.getDraftsList();
        }
        this.loading = false;
      } else {
        const {code} = await deleLists(row.attribute8)
        if (code === '000000') {
          this.loading = false;
          this.getDraftsList();
        }
        this.loading = false;
      }

    },
    /**
     * 查询
     */
    formSearchMethod(self) {
      this.searchForm = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      };
      this.getDraftsList()
    },
    async getDraftsList() {
      this.loading = true
      const {code, data} = await getDraftsList({
        ...this.searchForm, ...this.$refs.ruleForm.model
      })
      if (code === '000000') {
        this.tableData = data.records;
        this.searchForm.total = data.total;
      }
      this.loading = false;
    },
    /**
     * 重置
     */
    formResetMethod(self) {
      this.$refs[self].resetFields()
      this.getDraftsList();
    },
    /**
     * 分页查询
     */
    handlerCurrentPage(list) {
      this.searchForm = {
        ...this.searchForm,
        ...list
      };
      this.getDraftsList();
    },
    /**
     * 跳转
     */
    handleGoto(row, val) {
      if (val) {
        this.$router.push({name: 'singleContracts', query: {type: 'add', id: row.attribute8}})
      } else {
        // 批量生成直接跳详情
        if (row.generateWayCode === 'TYP02') {
          this.$router.push({
            name: 'singleContracts',
            query: {type: 'view', dictCode: row.incomeExpeTypeCode, id: row.contractId}
          })
        } else {
          if (row.draftTypeCode === 'CON001') {
            // 单个合同发起 跳编辑
            this.$router.push({
              name: 'singleContract',
              query: {type: 'edit', dictCode: row.incomeExpeTypeCode, id: row.contractId}
            })
          } else {
            // 合同变更
            this.$router.push({
              name: 'changevoid',
              query: {
                type: 'edit',
                dictCode: row.incomeExpeTypeCode,
                id: row.contractId,
                draftTypeCode: row.draftTypeCode
              }
            })
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.over-hid {
  height: 150px;
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

