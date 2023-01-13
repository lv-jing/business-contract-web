<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <span>固定规则设置</span>
      </div>
      <el-row class="bg-white">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form :model="searchForm" label-width="100px" label-position="left">
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="规则类型" prop="email">
                    <CommonSelect v-model="searchForm.ruleType" :dictCode="'RULE_TYPE'" :clearable="true" :filterable="true" placeholder="请选择"></CommonSelect>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="规则名称" prop="idCard">
                    <el-input v-model="searchForm.ruleName" placeholder="请输入规则名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-button
                      type="primary"
                      @click="handlerCurrentPage(1)"
                      icon="iconfont sbt_add"
                    >查询</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-button type="primary" @click="addApproval">新增</el-button>
            <el-table :data="tableData" style="width: 99%" :highlight-current-row="true" :v-loading="loading">
              <el-table-column type="index" width="60" label="序号"></el-table-column>
              <el-table-column prop="ruleCode" label="规则编码"></el-table-column>
              <el-table-column prop="ruleName" label="规则名称"></el-table-column>
              <el-table-column prop="ruleDesc" label="规则描述"></el-table-column>
              <el-table-column prop="ruleType" label="规则类型">
                <template slot-scope="scope">
                  <DictCodeToDictName :parentCode="'RULE_TYPE'" :dictCode="scope.row.ruleType"></DictCodeToDictName>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="viewInfo(scope.row)">详情</el-button>
                  <el-button type="text" @click="deleteApproval(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="pager2"></common-pagination>
          </el-col>
        </el-row>
      </el-row>
    </el-card>
    <el-dialog title="固定规则设置" :visible.sync="dlgVisiable" width="50%">
       <el-form label-width="150px"
        :rules="rules"
        ref="ruleForm"
        :model="selectNode">
            <el-row>
                <el-col>
                    <el-form-item label="规则类型" prop="ruleType">
                         <CommonSelect v-model="selectNode.ruleType" :dictCode="'RULE_TYPE'" :clearable="true" :filterable="true" placeholder="请选择"></CommonSelect>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="规则编码" prop="ruleCode">
                        <el-input v-model="selectNode.ruleCode" placeholder="请输入规则编码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="规则名称" prop="ruleName">
                       <el-input v-model="selectNode.ruleName" placeholder="请输入规则名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="规则描述" prop="ruleDesc">
                        <el-input v-model="selectNode.ruleDesc" placeholder="请输入规则描述"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="审批矩阵明细" prop="list" v-if="selectNode.ruleType==='MATRIX'">
                        <el-button @click="viewList">查看详情</el-button>
                    </el-form-item>
                </el-col>
                <el-col>
                    <div style="text-align:center">
                        <el-button type="primary" :disabled="btnClickFlag" @click="saveApproval">保存</el-button>
                        <el-button  @click="dlgVisiable=false">关闭</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form> 
    </el-dialog>

    <el-dialog
      style="overflow-y: hidden;"
      title="审批矩阵"
      :visible.sync="visible"
      width="70%">
      <el-form label-width="80px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="审批人" prop="userName">
              <el-input v-model="searchForm1.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" icon="iconfont sbt_add" @click="handlerCurrentPage1(1)">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="success" icon="iconfont sbt_add" @click="openApprovalDlg">添加</el-button>
      <el-table
        :data="elTableData"
        stripe
        :max-height="465"
        highlight-current-row
        style="width: 100%;"
        :header-cell-style="{background:'#f3f3f3'}"
      >
      <el-table-column prop="chargeUnit" label="事业部维度"></el-table-column>
        <el-table-column prop="chargeOrgName" label="部门维度"></el-table-column>
        <el-table-column prop="ourEntityName" label="我方签约主体"></el-table-column>
        <el-table-column prop="sealType" label="印章类型">
           <template slot-scope="scope">
            <DictCodeToDictName :parentCode="'SEAL_TYPE'" :dictCode="scope.row.sealType"></DictCodeToDictName>
          </template>
        </el-table-column>
        <el-table-column prop="userCode" label="审批人编号"></el-table-column>
        <el-table-column prop="userName" label="审批人姓名"></el-table-column>
        <el-table-column prop="orgCode" label="部门编码"></el-table-column>
        <el-table-column prop="orgName" label="部门名称"></el-table-column>
        <el-table-column prop="unitName" label="事业部"></el-table-column>
        <el-table-column
          label="操作"
          width="80"
          align="center"
        >
          <template v-slot="{row}">
            <div class="tc">
                <el-button slot="reference" type="text" size="mini" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <common-pagination :layout="layout" v-on:handler-currentPage="handlerCurrentPage1"
                         :list="searchForm1"></common-pagination>

      <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">关闭</el-button>
            </div>                    
    </el-dialog>

    <el-dialog
      style="overflow-y: hidden;"
      title="审批矩阵"
      :visible.sync="approvalVisiable"
      width="45%">
      <el-form label-width="130px">
        <el-row>
          <el-col>
            <el-form-item label="事业部维度" prop="chargeUnit">
              <el-select v-model="userForm.chargeUnit" clearable placeholder="请选择事业部" @change="closeOrgTag">
                <el-option v-for="(item) in unitData" :key="item.unitCode" :value="item.unitCode" :label="item.unitName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="部门维度" prop="chargeOrg">
              <el-tag
                closable
                @close="closeOrgTag"
                :type="'success'">
                {{chargeOrgName}}
              </el-tag>
              <el-button @click="orgDlgVisiable=true">选择</el-button>
            </el-form-item>
          </el-col>
           <el-col>
            <el-form-item label="我方签约主体" prop="myEntityCode">
                  <el-select remote filterable v-model="userForm.ourEntityCode" value-key="company"
                             placeholder="请选择"
                             ref="ourside"
                             class="w-100"
                             :remote-method="(val)=>remoteMethod(val,0)"
                             @change="(val)=>sideChange(val,'ENT01')">
                    <el-option
                      v-for="item in ourSideList"
                      :key="item.company"
                      :label="item.descr"
                      :value="item">
                    </el-option>
                    <div class="pagePagination">
                      <common-pagination
                        layout="prev, pager, next"
                        v-on:handler-currentPage="handlerCurrentPage"
                        :list="searchForm"/>
                    </div>
                  </el-select>
                </el-form-item>
           </el-col>
           <el-col>
            <el-form-item label="印章类型" prop="sealType">
                  <CommonSelect v-model="userForm.sealType" :dictCode="'SEAL_TYPE'" :clearable="true" :filterable="true" placeholder="请选择"></CommonSelect>
              </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="审批人" prop="userName">
              <commonItemSelect
                v-model="selectUserInfo"
                placeholder="审批人"
                :clearable="true"
                :onChange="getUserInfo"
              ></commonItemSelect>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="排序" prop="orderNum">
              <el-input type="number" v-model="userForm.orderNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
              <div style="text-align:center">
                  <el-button type="primary" :disabled="btnClickFlag" @click="handleAddList">保存</el-button>
                  <el-button  @click="approvalVisiable=false">关闭</el-button>
              </div>
          </el-col>
        </el-row>
      </el-form>

    </el-dialog>

    <el-dialog style="overflow-y: hidden;"
      title="选择部门"
      :visible.sync="orgDlgVisiable">
      <el-row>
        <el-col>
           <CommonOrgTree ref="orgTree" :unitCode="userForm.chargeUnit" :mutl="false" @check-ok="getCheckOrg" :showBtn="false"></CommonOrgTree>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
                <el-button @click="orgDlgVisiable = false">取 消</el-button>
            </div>
    </el-dialog>
  </div>
</template>
<script>
import workflow from "@/service/workflow/index";
import {getAllUnit} from '@/service/4A/index'
import {
  getOtherSide,
  getOurSide,
  postEidtSing,
  singAdd,
  singEdit,
  deleteContract
} from '@/service/approval';
export default {
  data() {
    return {
      loading:false,
      tableData: [],
      searchForm: {},
      dlgVisiable: false,
      approvalVisiable: false,
      orgDlgVisiable:false,
      visible: false,
      elTableData:[],
      btnClickFlag: false,
      pager2: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      searchForm1:{
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      selectNode:{},
      rules:{
          ruleType:[{ required: true, message: "请选择规则类型", trigger: "blur" }],
          ruleCode:[{ required: true, message: "请输入规则编码", trigger: "blur" }],
          ruleName:[{required: true, message: "请输入规则名称", trigger: "blur" }],
      },
      selectUserInfo:{},
      layout: "total, prev, pager, next",
      unitData:[],
      userForm:{},
      chargeUnitObj:{unitCode:"",unitName:""},
      chargeOrgName:'',
      searchForm2: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      ourSideList:[]
    };
  },
  created() {},
  mounted() {
    this.handlerCurrentPage(1);
    getAllUnit({}).then(res=>{
      if(res.code==='000000'){
        if(res.data){
          res.data.forEach(element => {
            this.unitData.push({unitCode:element.unitCode,unitName:element.unitName})
          });
        }
      }
            }
        )
  },
  methods: {
    handlerNodePage(val) {
      this.pager1.currentPage = val.currentPage || val;
      workflow.queryNodeList(this.pager1).then(res=>{
        if(res.code === '000000'){
            this.nodeData = res.data.content
            this.pager1.currentPage = res.data.pageNo
            this.pager1.total = res.data.total
        }
      }).catch(err=>{
          this.$message({type:"error",message:"查询环节信息出错"})
      });
    },
    handlerCurrentPage(page) {
      this.pager2.currentPage = page.currentPage || page;
      this.pager2.pageSize = page.pageSize ||  this.pager2.pageSize;
      let params = {
        ...this.pager2,
        ...this.searchForm
      }
      workflow.queryApprovalList(params).then(res=>{
        if(res.code === '000000'){
            this.tableData = res.data.records
            this.pager2.currentPage = res.data.current
            this.pager2.total = res.data.total
        }
      }).catch(err=>{
          this.$message({type:"error",message:"查询固定规则信息出错"})
      });
    },
    addApproval() {
      this.selectNode = {}
      this.dlgVisiable = true
    },
    saveApproval() {
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.btnClickFlag = true
            workflow.saveApprovalInfo(this.selectNode).then(res=>{
              if (res.code === "000000") {
                  this.$message({type:"success",message:"操作成功"})
                  this.dlgVisiable = false
                  this.handlerCurrentPage(1)
                }
                this.btnClickFlag = false
              }).catch((err) => {
                this.btnClickFlag = false
                this.$message({ type: "error", message: "保存规则信息出错" });
              });
          }
      })
    },
    viewInfo(item) {
      this.selectNode = item
      this.dlgVisiable = true
    },
    deleteApproval(item) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            workflow.deleteApprovalInfo(item).then(res=>{
                this.$message({type:"success",message:"操作成功"})
                this.handlerCurrentPage(1)
            }).catch(err=>{
                 this.$message({type:"error",message:"删除失败"})
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        }
        )
    },
    handlerCurrentPage1(page){
      this.searchForm1.currentPage = page.currentPage || page;
      this.searchForm1.pageSize = page.pageSize ||  this.searchForm1.pageSize;
      
      workflow.queryPageMatrixInfo(this.searchForm1).then(res=>{
        if(res.code === '000000'){
            this.elTableData = res.data.records
            this.searchForm1.currentPage = res.data.current
            this.searchForm1.total = res.data.total
        }
      }).catch(err=>{
          this.$message({type:"error",message:"查询审批矩阵信息出错"})
      });
    },
    viewList(){
      if(!this.selectNode.ruleId){
        workflow.saveApprovalInfo(this.selectNode).then(res=>{
              if (res.code === "000000") {
                  this.visible = true
                  this.selectNode.ruleId = res.data.ruleId
                  this.searchForm1.ruleId = this.selectNode.ruleId
                  this.handlerCurrentPage1(1)
                }
                this.btnClickFlag = false
              }).catch((err) => {
                this.btnClickFlag = false
                this.$message({ type: "error", message: "保存规则信息出错" });
              });
      }else{
        this.visible = true
        this.searchForm1.ruleId = this.selectNode.ruleId
        this.handlerCurrentPage1(1)
      }
    },
    getUserInfo(val){
      this.selectUserInfo = {...val}
    },
    openApprovalDlg(){
      this.chargeUnitObj = {unitCode:"",unitName:""}
      this.userForm = {}
      this.selectUserInfo = {}
      this.userForm.orderNum = 1
      this.approvalVisiable = true
    },
    getCheckOrg(data,nodeData){
      this.userForm.chargeOrg = nodeData[0].orgCode
      this.userForm.chargeOrgName = nodeData[0].orgName
      this.chargeOrgName = nodeData[0].orgName
      this.orgDlgVisiable = false
    },
    closeOrgTag(){
      this.userForm.chargeOrg = ''
      this.userForm.chargeOrgName = ''
      this.chargeOrgName = ''
    },
    handleAddList(){
      let params = {}
      params.ruleId = this.selectNode.ruleId
      params.orgCode = this.selectUserInfo.orgCode
      params.unitCode = this.selectUserInfo.unitCode
      params.orgName = this.selectUserInfo.orgName
      params.unitName = this.selectUserInfo.unitName
      params.userCode = this.selectUserInfo.userCode
      params.userId = this.selectUserInfo.userId
      params.userName = this.selectUserInfo.userName
      params.orderNum = this.userForm.orderNum
      params.chargeOrg =  this.userForm.chargeOrg
      params.chargeOrgName =  this.userForm.chargeOrgName
      params.chargeUnit = this.userForm.chargeUnit
      params.sealType = this.userForm.sealType
      if(this.userForm.ourEntityCode){
        params.ourEntityId = this.userForm.ourEntityCode.company
        params.ourEntityName = this.userForm.ourEntityName
      }
      
      // params.chargeUnitName = this.userForm.chargeUnitName
      this.btnClickFlag = true
      workflow.saveMatrixInfo(params).then(res=>{
        if (res.code === "000000") {
          this.approvalVisiable = false
          this.$message({type:"success",message:"操作成功"})
          this.handlerCurrentPage1(1)
        }
        this.btnClickFlag = false
      }).catch((err) => {
        this.btnClickFlag = false
        this.$message({ type: "error", message: "保存审批矩阵出错" });
      });
    },
    handleDelete(item){
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            workflow.deleteMatrixInfo(item.ruleLineId).then(res=>{
                this.$message({type:"success",message:"操作成功"})
                this.handlerCurrentPage1(1)
            }).catch(err=>{
                 this.$message({type:"error",message:"删除失败"})
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        }
        )
    },
    /**
     * 我方签约主体远程搜索
     */
    remoteMethod(item, num) {
      
        this.searchForm2 = {
          ...this.searchForm2,
          descr: item
        }
        this.getOurSide()
      
    },
    /**
     *  我方签约主体
     */
    async getOurSide() {
      const {code, data} = await getOurSide({
        ...this.searchForm2
      })
      if (code === '000000') {
        const list = data.content || [];
        let obj = {};
        this.ourSideList = data.content || []
        this.searchForm.total = data.total;
      }
    },
    /**
     * 我方签约主体change
     * num 标识 ENT01我方 ENT02对方
     */
    sideChange(val, num) {
      this.userForm.ourEntityName = val.descr
    },
  },
};
</script>

<style lang="less" scoped>
.workflow {
  .resetButton {
    border: 1px solid #bbbfc4;
  }
  .tableColQuery {
    color: #2393f7;
    cursor: pointer;
  }
  .tableCol {
    color: #2393f7;
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>