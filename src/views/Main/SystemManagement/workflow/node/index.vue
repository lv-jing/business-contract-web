<template>
  <div>
    <el-card class="box-card" shadow="never"  v-loading="loading">
      <div slot="header" class="clearfix flex flex-center-between">
        <span>审批环节</span>
      </div>
      <el-row class="bg-white">
        <el-row :gutter="20">
          <el-col :span="7">
              <el-form label-width="100px">
            <el-row :gutter="24">
                <el-col :span="16">
                    <el-form-item label="环节名称">
                        <el-input v-model="processDeptName" placeholder="请输入环节名称"></el-input>  
                    </el-form-item>
                </el-col>
                <el-col :span="8">   
                    <el-button type="primary" @click="handlerNodePage(1)">查询</el-button>
                </el-col>
            </el-row>
              </el-form>
            <el-button type="primary" @click="addNode">新增审批环节</el-button>
            <el-table :data="nodeData" style="width: 99%" :highlight-current-row="true" @row-click="handlerClick">
              <el-table-column prop="processDeptName" label="审批环节"></el-table-column>
              <el-table-column prop="processDeptId" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click.stop="viewInfo(scope.row)">详情</el-button>
                  <el-button type="text" @click.stop="deleteNode(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlerNodePage" :list="pager1"></common-pagination>
          </el-col>
          <el-col :span="16">
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
              <el-table-column prop="nodeName" label="审批节点"></el-table-column>
              <el-table-column prop="nodeDesc" label="规则名称"></el-table-column>
              <el-table-column prop="orgName" label="关联组织部门"></el-table-column>
              <el-table-column prop="roleName" label="关联角色"></el-table-column>
              <el-table-column prop="ruleName" label="关联固定规则"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="deleteRule(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="pager2"></common-pagination>
          </el-col>
        </el-row>
      </el-row>
    </el-card>
    <el-dialog title="审批环节" :visible.sync="dlgVisiable" width="600px">
        <el-form label-width="120px"
        :rules="rules"
        ref="ruleForm"
        :model="selectNode">
            <el-row>
                <el-col>
                    <el-form-item label="审批环节类型" prop="processDeptType">
                        <commonSelect v-model="selectNode.processDeptType" :dictCode="'PROCESS_DEPT_TYPE'" placeholder="请选择审批环节类型"></commonSelect>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="审批环节名称" prop="processDeptName">
                        <el-input v-model="selectNode.processDeptName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="审批环节描述" prop="processDeptDesc">
                        <el-input v-model="selectNode.processDeptDesc"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="审批环节排序" prop="orderNum">
                        <el-input v-model="selectNode.orderNum" type="number"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <div style="text-align:center">
                        <el-button type="primary" :disabled="btnClickFlag" @click="saveNode">保存</el-button>
                        <el-button  @click="dlgVisiable=false">关闭</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>

    <el-dialog :title="selectNode.processDeptName + '：选择审批节点'" :visible.sync="dlgVisiable2" width="60%">
        <el-form :model="searchForm3" label-width="100px" label-position="left">
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="审批节点" prop="nodeName">
                    <el-input v-model="searchForm3.nodeName" placeholder="请审批节点"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="规则名称" prop="nodeDesc">
                    <el-input v-model="searchForm3.nodeDesc" placeholder="请输入规则名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-button
                      type="primary"
                      @click="handlerCurrentPage3(1)"
                      icon="iconfont sbt_add"
                    >查询</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            
        <el-table :data="tableData3" 
          style="width: 99%" 
         :highlight-current-row="true"
         ref="multipleTable"
         tooltip-effect="dark"
         @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="nodeName" label="审批节点"></el-table-column>
              <el-table-column prop="nodeDesc" label="规则名称"></el-table-column>
              <el-table-column prop="orgName" label="关联组织部门"></el-table-column>
              <el-table-column prop="roleName" label="关联角色"></el-table-column>
              <el-table-column prop="ruleName" label="关联固定规则"></el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlerCurrentPage3" :list="pager3"></common-pagination>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgVisiable2 = false">取 消</el-button>
                <el-button type="primary" :disabled="btnClickFlag" @click="saveRules">确 定</el-button>
            </div>
    </el-dialog>
  </div>
</template>
<script>
import workflow from "@/service/workflow/index";
export default {
  data() {
    return {
      loading:false,
      btnClickFlag: false,
      nodeData: [],
      tableData: [],
      tableData3: [],
      dlgVisiable: false,
      dlgVisiable2: false,
      searchForm: {},
      searchForm3: {},
      processDeptName: '',
      pager1: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
      pager2: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      pager3: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      selectNode:{},
      multipleSelection:[],
      rules:{
          processDeptType:[{ required: true, message: "请选择审批环节类型", trigger: "blur" }],
          processDeptName:[{ required: true, message: "请输入审批环节名称", trigger: "blur" }],
          orderNum:[{ required: true, message: "请输入审批环节排序", trigger: "blur" }],

      }
    };
  },
  created() {},
  mounted() {
    this.handlerNodePage(1);
  },
  methods: {
    handlerNodePage(val) {
      this.loading = true
      this.pager1.currentPage = val.currentPage || val;
      this.pager1.pageSize = val.pageSize || this.pager1.pageSize;
      let params = {...this.pager1}
      params.processDeptName = this.processDeptName
      workflow.queryNodeList(params).then(res=>{
        if(res.code === '000000'){
            this.nodeData = res.data.records
            this.pager1.currentPage = res.data.pageNo
            this.pager1.total = res.data.total
        }
        this.loading = false
      }).catch(err=>{
          this.loading = false
          this.$message({type:"error",message:"查询环节信息出错"})
      });
    },
    handlerCurrentPage(page) {
       if(!this.selectNode.processDeptId){
            this.$message({type:"warning",message:"请选择审批环节后再查询"})
            return
        }
      this.loading = true
      this.pager2.currentPage = page.currentPage || page;
      this.pager2.pageSize = page.pageSize || this.pager2.pageSize;
      let params = {...this.pager2,...this.searchForm}
      workflow.queryNodeTaskByNode(params).then(res=>{
        if(res.code === '000000'){
          let sysProcessNodeVoPage = res.data.sysProcessNodeVoPage
            this.tableData = sysProcessNodeVoPage.records
            this.pager2.currentPage = sysProcessNodeVoPage.current
            this.pager2.total = sysProcessNodeVoPage.total
        }
        this.loading = false
      }).catch(err=>{
          this.loading = false
          this.$message({type:"error",message:"查询节点信息出错"})
      });
    },
    handlerCurrentPage3(page) {
        this.loading = true
      this.pager3.currentPage = page.currentPage || page;
      this.pager3.pageSize = page.pageSize || this.pager3.pageSize;
      let params = {...this.pager3,...this.searchForm3}
      workflow.queryRuleList(params).then(res=>{
        if(res.code === '000000'){
            this.tableData3 = res.data.records
            this.pager3.currentPage = res.data.pageNo
            this.pager3.total = res.data.total
        }
        this.loading = false
      }).catch(err=>{
          this.loading = false
          this.$message({type:"error",message:"查询节点信息出错"})
      });;
    },
    handlerClick(row, column, event){
        this.loading = true
        this.searchForm.processDeptId = row.processDeptId
        this.selectNode = row
        this.handlerCurrentPage(1)
    },
    addNode() {
      this.selectNode = {processDeptType:""}
      this.dlgVisiable = true
    },
    saveNode() {
        this.btnClickFlag = true
        this.$refs.ruleForm.validate((valid) => {
            if (valid) {
                workflow.saveNodeInfo(this.selectNode).then(res=>{
                    if(res.code === '000000'){
                        this.$message({type:"success",message:"操作成功"})
                        this.dlgVisiable = false
                        this.handlerNodePage(1)
                    }
                this.btnClickFlag = false
                }).catch(err=>{
                    this.btnClickFlag = false
                });
            }else{
                this.btnClickFlag = false
            }
        })
    },
    handleSelectionChange(val){
        this.multipleSelection = val;
    },
    addRule() {
        if(!this.selectNode.processDeptId){
            this.$message({type:"warning",message:"请选择审批环节后再新增"})
            return
        }else{
            this.dlgVisiable2 = true
            this.handlerCurrentPage3(1)
        }
    },
    saveRules(){
        if(this.multipleSelection.length <= 0){
            this.$message({type:"warning",message:"请选择审批节点"})
            return
        }else{
            let params = {...this.selectNode}
            params.sysProcessNodeList = [...this.multipleSelection]
            workflow.saveNodeInfo(params).then(res=>{
                    if(res.code === '000000'){
                        this.$message({type:"success",message:"操作成功"})
                        this.dlgVisiable2 = false
                        this.handlerCurrentPage(1)
                    }
                this.btnClickFlag = false
                }).catch(err=>{
                    this.btnClickFlag = false
                });
        }
    },
    viewInfo(item) {
        this.dlgVisiable = true
        this.selectNode = item
    },
    deleteNode(item) {
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            workflow.deleteNodeInfo(item).then(res=>{
                this.$message({type:"success",message:"操作成功"})
                this.handlerNodePage(1)
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
    deleteRule(item) {
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            let  params = {nodeId:item.nodeId,processDeptId:this.searchForm.processDeptId}
            workflow.deleteRuleInfo(params).then(res=>{
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