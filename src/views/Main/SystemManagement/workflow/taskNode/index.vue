<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <span>审批节点配置</span>
      </div>
      <el-row class="bg-white">
        <el-col :span="24">
          <el-form :model="searchForm" label-width="100px" label-position="left">
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="审批节点" prop="nodeName">
                  <el-input v-model="searchForm.nodeName" placeholder="请审批节点"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="规则名称" prop="nodeDesc">
                  <el-input v-model="searchForm.nodeDesc" placeholder="请输入规则名称"></el-input>
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
          <el-button type="primary" @click="addRule">新增</el-button>
          <el-table :data="tableData" style="width: 99%" :highlight-current-row="true">
            <el-table-column type="index" width="60" label="序号"></el-table-column>
             <el-table-column prop="nodeCode" label="审批节点编码"></el-table-column>
            <el-table-column prop="nodeName" label="审批节点名称"></el-table-column>
            <el-table-column prop="nodeDesc" label="规则名称"></el-table-column>
            <el-table-column prop="orgName" label="关联组织部门"></el-table-column>
            <el-table-column prop="roleName" label="关联角色"></el-table-column>
            <el-table-column prop="ruleName" label="关联固定规则"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                 <el-button type="text" @click="viewInfo(scope.row)">详情</el-button>
                <el-button type="text" @click="deleteRule(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="pager2"></common-pagination>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="审批节点" :visible.sync="dlgVisiable" width="600px">
      <el-form label-width="120px" :rules="rules" ref="ruleForm" :model="selectNode">
        <el-row>
          <el-col>
            <el-form-item label="审批节点编码" prop="nodeCode">
               <el-input v-model="selectNode.nodeCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="审批节点名称" prop="nodeName">
               <el-input v-model="selectNode.nodeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="规则名称" prop="nodeDesc">
              <el-input v-model="selectNode.nodeDesc"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="节点类型" prop="nodeType">
              <commonSelect v-model="selectNode.nodeType" :dictCode="'NODE_TYPE'" placeholder="请选择节点类型"></commonSelect>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="允许调整审批人" prop="fixedNode">
              <el-select v-model="selectNode.fixedNode" clearable>
                <el-option label="允许" value="Y"></el-option>
                <el-option label="禁止" value="N"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="完成条件" prop="completedInstances">
              <el-select v-model="selectNode.completedInstances" clearable>
                <el-option label="全部" value="-1"></el-option>
                <el-option label="单人审批完成" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="精确/族群" prop="dataPrecision">
             <CommonSelect v-model="selectNode.dataPrecision" :dictCode="'DATA_PRECISION'" :clearable="true" :filterable="true" placeholder="请选择"></CommonSelect>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="是否全员" prop="dataAll">
              <el-select v-model="selectNode.dataAll" clearable  placeholder="请选择">
                <el-option label="是" value="Y"></el-option>
                <el-option label="否" value="N"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col v-if="selectNode.nodeType=='ROLE'">
            <el-form-item label="关联组织部门" prop="orgName">
              <el-button type="primary" @click="chooseOrgs">选择</el-button>
              <div>
               <el-tag
                v-for="(tag,index) in orgs"
                :key="index"
                closable
                @close="closeOrgTag(tag,index)"
                :type="'success'">
                {{tag}}
              </el-tag>
             </div>
            </el-form-item>
          </el-col>
          <el-col v-if="selectNode.nodeType=='ROLE'">
            <el-form-item label="关联角色" prop="roleName">
             <el-button  type="primary" @click="chooseRoles">选择</el-button>
             <div>
               <el-tag
                v-for="(tag,index) in roles"
                :key="index"
                closable
                @close="closeRoleTag(tag,index)"
                :type="'success'">
                {{tag}}
              </el-tag>
             </div>
            </el-form-item>
          </el-col>
          <el-col v-if="selectNode.nodeType=='RULE'">
            <el-form-item label="关联固定规则" prop="ruleName">
              <el-tag v-show="selectNode.ruleName!=''&&selectNode.ruleName!= undefined" closable @close="closeRuleTag()">{{selectNode.ruleName}}</el-tag>
              <el-button type="primary" @click="chooseRule">选择</el-button>
            </el-form-item>
          </el-col>
          <el-col>
            <div style="text-align:center">
              <el-button type="primary" :disabled="btnClickFlag" @click="saveRule">保存</el-button>
              <el-button @click="dlgVisiable=false">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 选择角色 -->
    <el-dialog title="选择角色" width="50%" :visible.sync="dlgRoleVisible" append-to-body>
      <div style="margin-bottom: 10px;">
        <el-form :model="roleSearchOption" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色编号" prop="roleCode">
                <el-input
                  v-model="roleSearchOption.roleCode"
                  placeholder="请输入所属编号"
                  class="input-edit-role"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="roleSearchOption.roleName" class="input-edit-role"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色类型" prop="roleType">
                <el-select
                  v-model="roleSearchOption.roleType"
                  value-key="value"
                  placeholder="请选择"
                  class="input-edit-role"
                >
                  <el-option
                    v-for="item in roleTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-button size="small" type="primary" @click="getRoles(1)">查 询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="div-table-roles">
        <el-table :data="rolesData" height="450" ref="roleTables" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="roleCode" label="角色编号" min-width="15%"></el-table-column>
          <el-table-column prop="roleName" label="角色名称" min-width="25%"></el-table-column>
          <el-table-column prop="roleType" label="角色类型" min-width="10%"></el-table-column>
          <el-table-column prop="service" label="系统来源" min-width="10%"></el-table-column>
        </el-table>
        <common-pagination v-on:handler-currentPage="getRoles" :list="roleSearchOption"></common-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dlgRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 选择部门 -->
    <el-dialog title="选择组织" width="50%" :visible.sync="dlgOrgVisible" append-to-body>
      <div style="margin-bottom: 10px;">
        <el-form :model="orgSearchOption" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="组织编号" prop="orgCode">
                <el-input
                  v-model="orgSearchOption.orgCode"
                  placeholder="请输入编号"
                  class="input-edit-role"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="组织名称" prop="orgName">
                <el-input v-model="orgSearchOption.orgName" class="input-edit-role"></el-input>
              </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-form-item>
                <el-button size="small" type="primary" @click="getOrgs(1)">查 询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="div-table-roles">
        <el-table :data="orgsData" height="450" ref="orgTables" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="orgCode" label="组织编号" min-width="15%"></el-table-column>
          <el-table-column prop="orgName" label="组织名称" min-width="25%"></el-table-column>
          <el-table-column prop="simpleName" label="组织简称" min-width="25%"></el-table-column>
        </el-table>
        <common-pagination v-on:handler-currentPage="getOrgs" :list="orgSearchOption"></common-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dlgOrgVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrg">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 选择规则 -->
    <el-dialog title="选择规则" width="50%" :visible.sync="dlgRuleVisible" append-to-body>
      <div style="margin-bottom: 10px;">
        <el-form :model="orgSearchOption" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="规则类型" prop="ruleType">
                    <CommonSelect v-model="ruleSearchOption.ruleType" :dictCode="'RULE_TYPE'" :clearable="true" :filterable="true" placeholder="请选择"></CommonSelect>
                  </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规则名称" prop="ruleName">
                    <el-input v-model="ruleSearchOption.ruleName" placeholder="请输入规则名称"></el-input>
                  </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-form-item>
                <el-button size="small" type="primary" @click="getRules(1)">查 询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="div-table-roles">
        <el-table :data="ruleData" height="450" ref="ruleTables"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
         style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="ruleCode" label="规则编码"></el-table-column>
          <el-table-column prop="ruleName" label="规则名称"></el-table-column>
          <el-table-column prop="ruleDesc" label="规则描述"></el-table-column>
          <el-table-column prop="ruleType" label="规则类型">
            <template slot-scope="scope">
              <DictCodeToDictName :parentCode="'RULE_TYPE'" :dictCode="scope.row.ruleType"></DictCodeToDictName>
            </template>
          </el-table-column>
        </el-table>
        <common-pagination v-on:handler-currentPage="getRules" :list="ruleSearchOption"></common-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dlgRuleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRuleSelect">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import workflow from "@/service/workflow/index";
import service from "@/utils/request";
export default {
  data() {
    return {
      LOGIN_URL: process.env.VUE_APP_BASE_LOGIN_URL,
      loading: false,
      btnClickFlag: false,
      dlgVisiable:false,
      dlgRoleVisible:false,
      dlgOrgVisible:false,
      dlgRuleVisible:false,
      selectNode: {},
      orgsData: [],
      tableData: [],
      ruleData:[],
      searchForm: {},
      roleForm: { currentPage: 1, pageSize: 10, total: 0 },
      orgForm: { currentPage: 1, pageSize: 10, total: 0 },
      pager2: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      rules: {
        nodeCode: [
          { required: true, message: "请选择审批节点编码", trigger: "blur" },
        ],
        nodeName: [
          { required: true, message: "请输入审批节点名称", trigger: "blur" },
        ],
        nodeDesc: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
        ],
        nodeType: [
          { required: true, message: "请选择规则类型", trigger: "blur" },
        ],
      },
      roleTypes: [
        {
          value: "function",
          label: "function",
        },
        {
          value: "data",
          label: "data",
        },
        {
          value: "approval",
          label: "approval",
        },
      ],
      roleSearchOption: {
        service: null,
        roleName: null,
        currentPage: 1,
        pageSize: 10,
      },
      orgSearchOption:{
        orgCode:'',
        orgName:'',
        currentPage: 1,
        pageSize: 10,
      },
      ruleSearchOption:{
        currentPage: 1,
        pageSize: 10,
      },
      rolesData: [],
      pager: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      roles:[],
      orgs:[],
      nodeRules:[]

    };
  },
  created() {},
  mounted() {
    this.handlerCurrentPage(1);
  },
  methods: {
    handlerCurrentPage(page) {
      this.pager2.currentPage = page.currentPage || page;
      this.pager2.pageSize = page.pageSize || this.pager2.pageSize;
      let params = {...this.pager2,...this.searchForm}
      workflow
        .queryRuleList(params)
        .then((res) => {
          if (res.code === "000000") {
            this.tableData = res.data.records;
            this.pager2.currentPage = res.data.pageNo;
            this.pager2.total = res.data.total;
          }
        })
        .catch((err) => {
          this.$message({ type: "error", message: "查询节点信息出错" });
        });
    },
    addRule(){
      this.dlgVisiable = true
      this.selectNode = {nodeType:'',completedInstances:'-1',fixedNode:'Y'}
    },
    viewInfo(item) {
        this.dlgVisiable = true
        this.selectNode = item
        this.roles = item.roleName ? item.roleName.split(',') : []
        this.orgs = item.orgName ? item.orgName.split(',') : []
        this.nodeRules = item.ruleName ? item.ruleName.split(',') : []
      
    },
    saveRule(){
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if(this.selectNode.nodeType === 'RULE' && !this.selectNode.ruleCode){
              this.$message({ type: "warning", message: "请选择固定规则" });
              return 
            }
            if(this.selectNode.nodeType !== 'RULE'){
              if(!this.selectNode.orgCode && !this.selectNode.roleCode ){
                this.$message({ type: "warning", message: "请选择组织或角色" });
                return 
              }
            }
            workflow.saveRuleInfo(this.selectNode).then(res=>{
              if (res.code === "000000") {
                this.$message({type:"success",message:"操作成功"})
                this.dlgVisiable = false
                this.handlerCurrentPage(1)
              }
            }).catch((err) => {
                this.$message({ type: "error", message: "保存节点信息出错" });
              });
          }
      })
    },
    deleteRule(item){
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            workflow.deleteRuleInfo(item).then(res=>{
              if (res.code === "000000") {
                this.$message({type:"success",message:"操作成功"})
                this.handlerCurrentPage(1)
              }
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
    chooseRoles(){
      this.dlgRoleVisible=true
      this.getRoles(1)
    },
    getRoles(page) {
      this.roleSearchOption.currentPage = page.currentPage || page;
      service
        .post("/isump/role/page/conditions", this.roleSearchOption, {
          baseURL: this.LOGIN_URL,
        })
        .then((res) => {
          let data = res.data;
          this.roleSearchOption.total = data.total;
          this.roleSearchOption.currentPage = data.current;
          this.roleSearchOption.pageSize = data.size;
          this.rolesData = [...data.records];
        });
    },
    addRole() {
      let arr = this.$refs.roleTables.selection;
      if (!arr || arr.length < 1)
        return this.$message({
          message: "请至少选择一条数据",
          type: "warning",
        });
      for (let role of arr) {
          // 将选择的角色填充到form中
          this.roles.push(role)
      }
      // 将数组里面的内容调整为字符串
        let roleIds = []
        let roleNames = []
        let roleCodes = []
        let roles = []
        this.roles.forEach(element => {
          if(roleIds.indexOf(element.roleId)>0){

          }else{
            roleIds.push(element.roleId)
            roleNames.push(element.roleName)
            roleCodes.push(element.roleCode)
            roles.push(element.roleName)
          }
        });
        this.selectNode.roleCode = roleCodes.join(',')
        this.selectNode.roleId = roleIds.join(',')
        this.selectNode.roleName = roleNames.join(',')
        this.roles = [...roles]
        this.dlgRoleVisible = false;
    },
    closeRoleTag(tag,index){
      this.roles.splice(index, 1)
      let roleCodes = this.selectNode.roleCode.split(',')
      let roleIds = this.selectNode.roleId.split(',')
      let roleNames = this.selectNode.roleName.split(',')
      roleIds.splice(index, 1)
      roleCodes.splice(index, 1)
      roleNames.splice(index, 1)
      this.selectNode.roleCode = roleCodes.join(',')
      this.selectNode.roleId = roleIds.join(',')
      this.selectNode.roleName = roleNames.join(',')
    },
    // 选择组织
    chooseOrgs(){
      this.dlgOrgVisible=true
      this.getOrgs(1)
    },
    getOrgs(page) {
      this.orgSearchOption.currentPage = page.currentPage || page;
      service
        .post("/isump/organization/page/conditions", this.orgSearchOption, {
          baseURL: this.LOGIN_URL,
        })
        .then((res) => {
          let data = res.data;
          this.orgSearchOption.total = data.total;
          this.orgSearchOption.currentPage = data.current;
          this.orgSearchOption.pageSize = data.size;
          this.orgsData = [...data.records];
        });
    },
    addOrg() {
      let arr = this.$refs.orgTables.selection;
      if (!arr || arr.length < 1)
        return this.$message({
          message: "请至少选择一条数据",
          type: "warning",
        });
      for (let org of arr) {
          // 将选择的组织填充到form中
          this.orgs.push(org)
      }
      // 将数组里面的内容调整为字符串
        let orgIds = []
        let orgNames = []
        let orgCodes = []
        let arrs = []
        this.orgs.forEach(element => {
          if(orgIds.indexOf(element.orgId)>0){

          }else{
            orgIds.push(element.orgId)
            orgNames.push(element.orgName)
            orgCodes.push(element.orgCode)
            arrs.push(element.orgName)
          }
        });
        this.selectNode.orgCode = orgCodes.join(',')
        this.selectNode.orgId = orgIds.join(',')
        this.selectNode.orgName = orgNames.join(',')
        this.orgs = [...arrs]
        this.dlgOrgVisible = false;
    },
    closeOrgTag(tag,index){
      this.orgs.splice(index, 1)
      let orgCodes = this.selectNode.orgCode.split(',')
      let orgNames = this.selectNode.orgName.split(',')
      orgCodes.splice(index, 1)
      orgNames.splice(index, 1)
      this.selectNode.orgCode = orgCodes.join(',')
      this.selectNode.orgName = orgNames.join(',')
    },
    chooseRule(){
      this.dlgRuleVisible = true
      this.getRules(1)
    },
    closeRuleTag(){
        let temp = {...this.selectNode}
        temp.ruleCode = ""
        temp.ruleName = ""
        temp.ruleId = ""
        this.selectNode = temp
    },
    addRuleSelect(){
      let arr = this.$refs.ruleTables.selection;
      if (!arr || arr.length < 1)
        return this.$message({
          message: "请选择一条数据",
          type: "warning",
        });
        this.selectNode.ruleCode = arr[0].ruleCode
        this.selectNode.ruleName = arr[0].ruleName
        this.selectNode.ruleId = arr[0].ruleId
        this.dlgRuleVisible = false
    },
    handleSelectionChange(item){
      if (item.length > 1) {
         this.$refs.ruleTables.clearSelection()
         this.$refs.ruleTables.toggleRowSelection(item.pop())
       } 
    },
    handleCurrentChange(item){
      this.$refs.ruleTables.clearSelection()
      this.$refs.ruleTables.toggleRowSelection(item)
    },
    getRules(page){
      this.ruleSearchOption.currentPage = page.currentPage || page;
      this.ruleSearchOption.pageSize = page.pageSize ||  this.ruleSearchOption.pageSize;
      workflow.queryApprovalList(this.ruleSearchOption).then(res=>{
        if(res.code === '000000'){
            this.ruleData = res.data.records
            this.ruleSearchOption.currentPage = res.data.current
            this.ruleSearchOption.total = res.data.total
        }
      }).catch(err=>{
          this.$message({type:"error",message:"查询固定规则信息出错"})
      });
    }
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