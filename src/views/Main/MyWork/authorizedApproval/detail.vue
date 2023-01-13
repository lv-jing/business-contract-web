<template>
  <div class="bg-white">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <b>授权审批</b>
      </div>
      <common-title title="基本信息" class="mb20"/>
      <el-form :model="ruleDialogForm" :rules="rules" label-width="100px"
               ref="ruleDialogForm">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="授权人" prop="authorizerName">
              <el-input disabled v-model="ruleDialogForm.authorizerName" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="被授权人" prop="personObj.userName">
              <commonItemSelect
                :disabled="true"
                v-model="ruleDialogForm.personObj"
                :value="ruleDialogForm.personObj"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label=合同金额 prop="contractMinAmount">
              <el-input disabled type="number" style="width: 100%;" v-model="ruleDialogForm.contractMinAmount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="text-align: center;">
            <el-form-item label-width="0">
              <span style="width: 5%; text-align: center;">至</span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="contractMaxAmount" label-width="0">
              <el-input disabled type="number" style="width: 100%"
                        v-model="ruleDialogForm.contractMaxAmount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="授权时间" prop="authorizeStartTime"
                          :rules="[{ required: true,
                            message: '授权时间起期必选',trigger: 'blur' }]">
              <el-date-picker
                :disabled="true"
                style="width: 100%"
                v-model="ruleDialogForm.authorizeStartTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" prop="authorizeEndTime" label-width="0"
                          :rules="[{ required: true,
                            message: '授权时间止期必选',trigger: 'blur' }]">
              <el-date-picker
                :disabled="true"
                style="width: 100%"
                v-model="ruleDialogForm.authorizeEndTime"
                type="date"
                value-format="yyyy-MM-dd 23:59:59"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <common-title title="合同类型" class="mb20"/>
            <el-table
              class="mt10 mb20"
              :data="tableData1"
              stripe highlight-current-row
              style="width: 100%"
              :header-cell-style="{background:'#f3f3f3'}"
              size="small">
              <el-table-column prop="contractTypeName" label="合同类型"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <common-title title="被授权部门" class="mb20"/>
            <el-table
              class="mt10 mb20"
              :data="tableData2"
              stripe highlight-current-row
              style="width: 100%"
              :header-cell-style="{background:'#f3f3f3'}"
              size="small">
              <el-table-column prop="orgName" label="被授权部门"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
    <common-footer
      :isShow="false"
      :isGoShow="true"
      butTitle1="返回"
    />
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import {getDetail} from '@/service/work'
import {mapState} from "vuex";

export default {
  data() {
    return {
      rules: {},
      ruleDialogForm: {
        contractApprovalAuthId: '',
        authorizeStartTime: '',
        authorizeEndTime: '',
        contractMinAmount: '',
        contractMaxAmount: '',
        contractType: [],
        orglist: [],
        personObj: {
          userName: '',
          userId: ''
        }
      },
      tableData1: [],
      delData: [],
      tableData2: [],
      delOrgData: [],
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      typeArr: [],
      orgArr: [],
      type: ''
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  mounted() {
      this.getDetail()
  },
  methods: {
    async getDetail(){
      const {code,data} = await getDetail({
        id: this.$route.query.id
      });
      if(code==='000000'){
        this.ruleDialogForm = {
          ...this.ruleDialogForm,
          ...data,
          contractType: [],
          orglist: [],
          personObj: {
            userName: data.authorizedName,
            userId: data.authorizedId
          }
        }
        let name = data.contractTypeName&&data.contractTypeName.length>0&&data.contractTypeName.split(',')||''
        let code =  data.contractType&& data.contractType.length>0&&data.contractType.split(',')||''
        let name1 = data.orgName&&data.orgName.length>0&&data.orgName.split(',')||''
        let code1 = data.orgCode&&data.orgCode.length>0&&data.orgCode.split(',')
        this.tableData1 = this.setList(name, code, 1)
        this.tableData2 = this.setList(name1, code1, 2)

      }
    },
    //设置回调表格
    setList(name, code, val) {
      var list = [];
      for (var i in name) {
        if (val === 1) {
          list.push({
            contractTypeName: name[i],
            contractType: code[i]
          })
        } else {
          list.push({
            orgName: name[i],
            orgCode: code[i]
          })
        }
      }
      return list
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

