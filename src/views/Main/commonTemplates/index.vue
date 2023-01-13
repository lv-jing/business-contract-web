<template>
  <div>
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" :rules="rules" label-width="100px"
               ref="ruleForm">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="范本名称" prop="templateName">
              <el-input v-model="ruleForm.templateName" placeholder="请输范本名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="范本编号" prop="templateNo">
              <el-input v-model="ruleForm.templateNo" placeholder="请输范本编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="适用合同类型" prop="attribute2">
              <el-select v-model="ruleForm.attribute2"
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
            <el-form-item label="适用组织范围" prop="attribute3">
              <el-select class="w-100" :disabled="!isAdmin" v-model="ruleForm.attribute3" placeholder="请选择">
                <el-option
                  v-for="item in templateUnitData"
                  :key="item.unitCode"
                  :label="item.unitName"
                  :value="item.unitCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
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
        <el-table-column prop="templateName" label="范本名称">
          <template v-slot={row}>
            <a class="pointer" @click="handleGoto(row)">{{ row.templateName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="templateNo" label="范本编号">
          <template v-slot={row}>
            <a class="pointer" @click="handleGoto(row)">{{ row.templateNo }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="attribute3" label="适用组织范围">
          <template v-slot={row}>
            <span>{{ getAttriBute(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="attribute1" label="适用合同类型"></el-table-column>
        <el-table-column prop="statue" label="范本状态">
          <template v-slot={row}>
            <span>{{ getStatue(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
          align="center"
        >
          <template v-slot="{row}">
            <div class="tc">
              <el-button slot="reference" @click="handleGotoApproval(row)" type="text" size="mini" circle>发起合同
              </el-button>
              <el-popconfirm title="确认删除该条记录吗?" @onConfirm="handleDeleteClick(row)">
                <el-button slot="reference" type="text" size="mini" circle>移出常用</el-button>
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
import {getMyCommonTemplate, deltTemplate} from '@/service/template'
import {dictSelectList} from '@/service/common'
import {mapState} from "vuex";
import {getAllUnit, queryUserRole} from "@/service/4A";
import {getContractType} from "@/service/approval";

export default {
  data() {
    return {
      conditList: [],
      overHeight: '150px',
      templateUnitData: [],
      statueList: [],
      ruleForm: {
        templateName: '',
        templateNo: '',
        attribute2: '',
        attribute3: ''
      },
      rules: {},
      deletUrl: '',
      tableData: [],
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      isAdmin: false
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  mounted() {
    this.$store.dispatch('setHeight', 100)
    this.ruleForm.attribute3 = this.$store.state.common.userInfo.unitCode
    this.getMyCommonTemplate()
    this.getAllUnit()
    this.dictSelectList()
    this.getContractType()
    this.getCurrentPersonRole()
  },
  methods: {
    /**
     * 移出常用
     */
    async handleDeleteClick(row) {
      const {code, data} = await deltTemplate({
        templateId: row.templateId
      })
      if (code === '000000') {
        this.getMyCommonTemplate()
        this.dictSelectList()
      }
    },
    /**
     * 发起合同
     */
    handleGotoApproval(row) {
      let dictName = row.attribute1.split('-')[0];
      let dictCode = (dictName === '支出类' || dictName === '支出') ? 'IET002' :
        ((dictName === '收入类' || dictName === '收入') ? 'IET001' :
          ((dictName === '有收有支类' || dictName === '有收有支') ? 'IET003' :
            ((dictName === '无收无支类' || dictName === '无收无支') ? 'IET004' : '')))
      this.$router.push({
        name: 'singleContract',
        query: {
          type: 'add',
          dictCode: dictCode,
          contractTypeCode: row.attribute2,
          templateId: row.templateId,
          templateAttr: 'CTA001',
          typeName:'templates'
        }
      })
    },
    /**
     *  合同类型
     */
    async getContractType(params) {
      const {code, data} = await getContractType({
        dictCode: 'INCOME_EXPE_TYPE',
        attribute1:4
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
    // 获取所有事业部
    async getAllUnit() {
      let params = {}; // 查询所有事业部不用传参数
      const {code, data} = await getAllUnit(params);
      if (code === "000000") {
        this.templateUnitData = data;
      }
    },
    // 获取状态
    async dictSelectList() {
      const {code, data} = await dictSelectList({
        parentCode: 'TEMPLATE_STATUE'
      });
      if (code === "000000") {
        this.statueList = data
      }
    },
    // 分解表格组织范围
    getAttriBute(row) {
      let obj = this.templateUnitData.filter(item => item.unitCode === row.attribute3)
      if (obj.length > 0) {
        return obj[0].unitName
      } else {
        return ''
      }
    },
    // 分解表格状态码现在中文状态
    getStatue(row) {
      let obj = this.statueList.filter(item => item.dictCode === row.statue)
      if (obj.length > 0) {
        return obj[0].dictName
      } else {
        return ''
      }
    },
    /**
     * 获取常用范本列表数据
     */
    async getMyCommonTemplate() {
      const {code, data} = await getMyCommonTemplate({
        orgCode: this.userInfo.orgCode,
        ...this.searchForm, ...this.$refs.ruleForm.model
      });
      if (code === '000000') {
        this.tableData = data.records || []
        this.searchForm.total = data.total
      }
    },
    /**
     * 新增按钮事件
     */
    addDeclaration() {
      this.$router.push({name: "drafts", query: {type: "add"}});
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
      this.getMyCommonTemplate()
    },
    /**
     * 重置
     */
    formResetMethod(self) {
      this.$refs[self].resetFields()
      this.getMyCommonTemplate()
    },
    /**
     * 分页查询
     */
    handlerCurrentPage(list) {
      this.searchForm = {
        ...this.searchForm,
        ...list,
      };
      this.getMyCommonTemplate();
    },
    /**
     * 跳转范本详情
     */
    handleGoto(row) {
      this.$router.push({
        name: 'managetemplate', query: {
          type: 'detail',
          templateId: row.templateId,
          isShowBut:'false'
        }
      })
    },
    // 获取当前人的角色
    async getCurrentPersonRole() {
      let userInfo = this.$store.state.common.userInfo
      let params = {
        deputyAccountId: userInfo.deputyAccountId,
        roleCode: 'contract_template_admin'
      }
      const {code, data} = await queryUserRole(params)
      if (code === '000000') {
        if (data.length === 0) {
          this.isAdmin = false
        } else {
          this.isAdmin = true
        }
      }
    }
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

