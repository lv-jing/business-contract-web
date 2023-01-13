<template>
  <div class="bg-white">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <b>授权审批</b>
      </div>
      <el-form :model="ruleDialogForm" :rules="rules" label-width="100px"
               ref="ruleDialogForm">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="授权人" prop="authorizerName">
              <el-input disabled v-model="ruleDialogForm.authorizerName" placeholder="请输入授权人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="被授权人" prop="personObj">
              <commonItemSelect
                v-model="ruleDialogForm.personObj"
                :value="ruleDialogForm.personObj"
                placeholder="被授权人"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label=合同金额 prop="contractMinAmount">
              <el-input type="number" style="width: 100%;" v-model="ruleDialogForm.contractMinAmount"
                        placeholder="合同金额">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="text-align: center;">
            <el-form-item label-width="0">
            <span style="width: 5%; text-align: center;">至</span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="contractMaxAmount" label-width="0">
              <el-input type="number" style="width: 100%"
                        v-model="ruleDialogForm.contractMaxAmount"
                        placeholder="合同金额">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="授权时间" prop="authorizeStartTime"
                          :rules="[{ required: true,
                            message: '授权时间起期必选',trigger: 'blur' }]">
              <el-date-picker
                :disabled="this.$route.query.type==='edit'"
                style="width: 100%"
                v-model="ruleDialogForm.authorizeStartTime"
                type="date"
                @change="chooseDate"
                placeholder="授权时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" prop="authorizeEndTime" label-width="0"
                          :rules="[{ required: true,
                            message: '授权时间止期必选',trigger: 'blur' }]">
              <el-date-picker
                style="width: 100%"
                v-model="ruleDialogForm.authorizeEndTime"
                type="date"
                @change="chooseDate"
                placeholder="授权时间"
                value-format="yyyy-MM-dd 23:59:59"
                :picker-options="pickerOptions1"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="合同类型" prop="contractType">
              <CommonTreeSelect
                :value="ruleDialogForm.contractType"
                :treeSelect="treeSelect"
                :treeDelSelect="treeDelSelect"
                :dict-code="'INCOME_EXPE_TYPE'"
                :multiple="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" @click="handeAddType(1)">添 加</el-button>
            <el-button type="primary" @click="handleDel(1)">删 除</el-button>
            <el-table
              class="mt10 mb20"
              :data="tableData1"
              stripe highlight-current-row
              style="width: 100%"
              :header-cell-style="{background:'#f3f3f3'}"
              size="small"
              @selection-change="handletypeChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column prop="contractTypeName" label="合同类型"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="被授权部门" prop="orglist">
              <CommonTreeOrg
                :value="ruleDialogForm.orglist"
                :treeSelect="treeSelectOrg"
                :treeDelSelect="treedelOrg"
                :dict-code="'INCOME_EXPE_TYPE'"
                :multiple="true"
                :placeholder="'被授权部门'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-button type="primary" @click="handeAddType(2)">添 加</el-button>
            <el-button type="primary" @click="handleDel(2)">删 除</el-button>
            <el-table
              class="mt10 mb20"
              :data="tableData2"
              stripe highlight-current-row
              style="width: 100%"
              :header-cell-style="{background:'#f3f3f3'}"
              size="small"
              @selection-change="handleOrgChange">
              <el-table-column
                type="selection"
                width="55"/>
              <el-table-column prop="orgName" label="被授权部门"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
    <common-footer
      :isShow="false"
      :isGoShow="true"
      :handleNextStep="handleSubmit"
      :handleRefuse="handleRefuse"
      butTitle="提交"
      butTitle1="关闭"
    />
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import { getAddAuth, detailList,deleteList} from '@/service/work'
import {mapState} from "vuex";

export default {
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date().getTime() - 8.64e7;
        },
      },
      pickerOptions1: {
        disabledDate: (time) => {
          if (this.type === 'add') {
            return time.getTime() < new Date(this.ruleDialogForm.authorizeStartTime.replace(/-/g, '/')).getTime()
          } else {
            return time.getTime() < new Date().getTime() - 8.64e7;
          }
        },
      },
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
      rules: {
        contractMinAmount: [
          {required: false, trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              console.log(value);
              let num = this.ruleDialogForm.contractMaxAmount;
              if (value < 0) {
                callback(new Error('不能为负数'))
              } else if (num) {
                if (value - num > 0) {
                  callback(new Error('开始金额不能大于结束金额'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
        contractMaxAmount: [
          {required: false, trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              let num = this.ruleDialogForm.contractMinAmount;
              if (value < 0) {
                callback(new Error('不能为负数'))
              } else if (num) {
                if (value - num < 0) {
                  callback(new Error('结束金额不能小于开始金额'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
        personObj: [
          {required: true, message: '请选授权人', trigger: 'blur'}
        ],
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
    const {type} = this.$route.query;
    this.ruleDialogForm = {
      authorizerName: this.userInfo.userName,
      authorizerId: this.userInfo.userId,
    }
    if(type!=='add'){
      this.detailList()
    }
  },
  methods: {
    async detailList(){
      const {code,data} = await detailList(this.$route.query.id);
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
    // 时间change
    chooseDate() {
      if (this.ruleDialogForm.authorizeStartTime && this.ruleDialogForm.authorizeEndTime) {
        if (new Date(this.ruleDialogForm.authorizeEndTime.replace(/-/g, '/')).getTime() < new Date(this.ruleDialogForm.authorizeStartTime.replace(/-/g, '/')).getTime()) {
          this.ruleDialogForm.authorizeEndTime = ''
          this.$message.error('授权止期必须大于授权起期,请重新选择时间！')
        }
      }
    },
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
    treedelOrg(val) {
      if(val){
        let data = [val]
        var set = data.map(item => item.orgCode)
        this.orgArr = this.orgArr.filter(item => !set.includes(item.orgCode))
      }
    },
    // 表格选择删除的数据
    handletypeChange(arr) {
      this.delData = arr;
    },
    handleOrgChange(arr) {
      this.delOrgData = arr;
    },
    // 合同类型删除 或 审批部门删除
    handleDel(val) {
      if (val === 1) {
        var set = this.delData.map(item => item.contractType)
        this.tableData1 = this.tableData1.filter(item => !set.includes(item.contractType))
      } else {
        var set1 = this.delOrgData.map(item => item.orgCode)
        this.tableData1 = this.tableData1.filter(item => !set1.includes(item.orgCode))
      }
    },
    // 合同类型和授权部门添加
    handeAddType(val) {
      // 合同类型 添加
      if (val === 1) {
        this.tableData1 = this.unique(this.tableData1.concat(this.typeArr), 1)
        this.ruleDialogForm = {
          ...this.ruleDialogForm,
          contractType: []
        }
        this.typeArr = []
      } else {
        // 授权部门添加
        this.tableData2 = this.unique(this.tableData2.concat(this.orgArr), 2)
        this.ruleDialogForm = {
          ...this.ruleDialogForm,
          orglist: []
        }
        this.orgArr = []
      }
    },
    // 选择的合同类型
    treeSelectOrg(val) {
      this.orgArr.push({
        orgCode: val.orgCode,
        orgName: val.orgName
      })
    },
    // 去重
    unique(arr, val) {
      const res = new Map();
      if (val === 1) {
        return arr.filter((arr) => !res.has(arr.contractType) && res.set(arr.contractType, 1))
      } else {
        return arr.filter((arr) => !res.has(arr.orgCode) && res.set(arr.orgCode, 1))
      }
    },
    // 关闭
    handleRefuse() {
      this.$router.push({name:'authorizedapproval'})
    },
    // 确认
    handleSubmit() {
      const {type} = this.$route.query
      this.$refs.ruleDialogForm.validate((valid) => {
        if (valid) {
          if (type === 'add') {
            this.getAddAuth()
          } else {
            this.deleteList()
          }
        }
      })
    },
    // 新增接口
    async getAddAuth() {
      const {code,mesg} = await getAddAuth(this.getParams())
      if (code === '000000') {
        this.$message.success(mesg)
        this.$router.push({name:'authorizedapproval'})
      }
    },
    // 编辑接口
    async deleteList() {
      const {code,mesg} = await deleteList(this.getParams())
      if (code === '000000') {
        this.$message.success(mesg)
        this.$router.push({name:'authorizedapproval'})
      }
    },
    // 获取参数
    getParams() {
      let name = [];
      let name1 = [];
      let code = [];
      let code1 = [];
      this.tableData1.length > 0 && this.tableData1.map(item => {
        name.push(item.contractTypeName)
        code.push(item.contractType)
      })
      this.tableData1.length > 0 && this.tableData2.map(item => {
        name1.push(item.orgName)
        code1.push(item.orgCode)
      })
      return {
        ...this.ruleDialogForm,
        contractApprovalAuthId: this.ruleDialogForm.contractApprovalAuthId,
        authorizedName: this.ruleDialogForm.personObj.userName,
        authorizedId: this.ruleDialogForm.personObj.userId,
        contractTypeName: name.join() || '',
        contractType: code.join() || '',
        orgName: name1.join() || '',
        orgCode: code1.join() || '',
        statue: this.$route.query.type==='add'?'Y':this.ruleDialogForm.statue
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

