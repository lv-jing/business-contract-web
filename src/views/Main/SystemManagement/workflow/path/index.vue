<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <span>审批路径</span>
      </div>
      <el-row class="bg-white" :gutter="24">
          <el-col>
            <el-form :model="searchForm" label-width="100px" label-position="left">
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="审批路径" prop="linkName">
                    <el-input v-model="searchForm.linkName" placeholder="请审批路径"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="审批节点" prop="nodeName">
                    <el-input v-model="searchForm.nodeName" placeholder="请审批节点"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-button
                      type="primary"
                      @click="handlerPathPage(1)"
                      icon="iconfont sbt_add"
                    >查询</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-button type="primary" @click="addPath">新增</el-button>
            <el-table :data="tableData" style="width: 99%" :highlight-current-row="true" v-loading='loading'>
              <el-table-column type="index" width="60" label="序号" fixed></el-table-column>
              <el-table-column prop="linkName" width="300" label="审批路径名称" fixed></el-table-column>
              <el-table-column prop="nodeName1" width="150" label="节点1"></el-table-column>
              <el-table-column prop="nodeName2" width="150" label="节点2"></el-table-column>
              <el-table-column prop="nodeName3"  width="150" label="节点3"></el-table-column>
              <el-table-column prop="nodeName4" width="150" label="节点4"></el-table-column>
              <el-table-column prop="nodeName5" width="150" label="节点5"></el-table-column>
              <el-table-column prop="nodeName6" width="150" label="节点6"></el-table-column>
              <el-table-column prop="nodeName7" width="150" label="节点7"></el-table-column>
              <el-table-column prop="nodeName8" width="150" label="节点8"></el-table-column>
              <el-table-column prop="nodeName9" width="150" label="节点9"></el-table-column>
              <el-table-column prop="nodeName10" width="150" label="节点10"></el-table-column>
              <el-table-column prop="nodeName11" width="150" label="节点11"></el-table-column>
              <el-table-column prop="nodeName12" width="150" label="节点12"></el-table-column>
              <el-table-column prop="nodeName13" width="150" label="节点13"></el-table-column>
              <el-table-column prop="nodeName14" width="150" label="节点14"></el-table-column>
              <el-table-column prop="nodeName15" width="150" label="节点15"></el-table-column>
              <el-table-column prop="nodeName16" width="150" label="节点16"></el-table-column>
              <el-table-column prop="nodeName17" width="150" label="节点17"></el-table-column>
              <el-table-column prop="nodeName18" width="150" label="节点18"></el-table-column>
              <el-table-column prop="nodeName19" width="150" label="节点19"></el-table-column>
              <el-table-column prop="nodeName20" width="150" label="节点20"></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="viewInfo(scope.row)">详情</el-button>
                  <el-button type="text" @click="deletePath(scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column label="图例" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="dlgPic=true;selectNode=scope.row">查看图例</el-button>
                </template>
              </el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlerPathPage" :list="pager1"></common-pagination>
          </el-col>
      </el-row>
    </el-card>
        <el-dialog title="查看流程图"
             :visible.sync="dlgPic" width="70%">
            <CommonWorkflowPicture :linkHeadId="selectNode.linkHeadId"></CommonWorkflowPicture>
        </el-dialog>
    <el-dialog title="审批路径" :visible.sync="dlgVisiable" width="600px">
        <el-form label-width="120px"
        :rules="rules"
        ref="ruleForm"
        :model="selectNode">
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="审批路径名称" prop="linkName">
                         <el-input v-model="selectNode.linkName"></el-input>
                    </el-form-item>
                </el-col>
                <div v-for="(item,index) in 20" :key="index">
                  <el-col :span="14">
                    <el-form-item :label="'节点'+(index+1)">
                      <div>
                        <el-tag closable 
                          @close="closeOrgTag(item,index)"
                          @click="chooseNode(index)" 
                        >
                          {{nodeArr[index] }}
                        </el-tag>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                     <el-form-item label="节点顺序" prop="orderNum">
                      <el-input type="number" v-model="sysProcessDeptNodeList[index].orderNum"></el-input>
                     </el-form-item>
                  </el-col>
                </div>
                <el-col :span="24">
                    <div style="text-align:center">
                        <el-button type="primary" :disabled="btnClickFlag" @click="savePath">保存</el-button>
                        <el-button  @click="dlgVisiable=false">关闭</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>

    <!-- 选择环节和节点 -->
    <el-dialog title="选择审批环节及节点" width="75%" :visible.sync="dlgNodeVisible" append-to-body>
      <div style="margin-bottom: 10px;">
        <el-form :model="searchOption" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="审批环节" prop="processDeptName">
                <el-input
                  v-model="searchOption.processDeptName"
                  placeholder="请审批环节"
                  class="input-edit-role"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审批节点" prop="nodeName">
                <el-input v-model="searchOption.nodeName" class="input-edit-role"></el-input>
              </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-form-item>
                <el-button size="small" type="primary" @click="getProcessNode(1)">查 询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="div-table-roles">
        <el-table 
        :data="processNodeData" 
        highlight-current-row
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
        height="450" 
        ref="processNodeTables" 
        style="width: 100%" 
        :v-loading='loading'>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="processDeptName" label="审批环节"></el-table-column>
          <el-table-column prop="nodeName" label="审批节点"></el-table-column>
          <el-table-column prop="nodeDesc" label="规则名称"></el-table-column>
          <el-table-column prop="orgName" label="关联组织部门"></el-table-column>
          <el-table-column prop="roleName" label="关联角色"></el-table-column>
          <el-table-column prop="ruleName" label="关联固定规则"></el-table-column>
        </el-table>
        <common-pagination v-on:handler-currentPage="getProcessNode" :list="searchOption"></common-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dlgNodeVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProcessNode">确 定</el-button>
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
      dlgPic:false,
      tableData: [],
      processNodeData:[],
      searchForm: {},
      pager1: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      dlgVisiable: false,
      dlgNodeVisible: false,
      btnClickFlag:false,
      selectNode:{linkHeadId:''},
      nodeArr:["请选择"],
      sysProcessDeptNodeList:[],
      rules:{
          linkName:[{ required: true, message: "请输入路径名称", trigger: "blur" }],
      },
      searchOption: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
      this.initArr()
  },
  mounted() {
    this.handlerPathPage(1);
  },
  methods: {
    initArr(){
      this.sysProcessDeptNodeList = []
      this.nodeArr = []
      for(let i=0;i<20;i++){
        this.sysProcessDeptNodeList.push({nodeName:'请选择',orderNum:i+1})
        this.nodeArr.push("请选择")
      }
    },
    handlerPathPage(val) {
      this.loading = true
      this.pager1.currentPage = val.currentPage || val;
      this.pager1.pageSize = val.pageSize || this.pager1.pageSize;
      let params = {
        ...this.searchForm,
        ...this.pager1
      }
      workflow.queryPathList(params).then(res=>{
        if(res.code === '000000'){
            this.tableData = res.data.records
            this.pager1.currentPage = res.data.current
            this.pager1.total = res.data.total
        }
        this.loading = false
      }).catch(err=>{
        this.loading = false
          this.$message({type:"error",message:"查询环节信息出错"})
      });
    },
    addPath() {
      this.dlgVisiable = true
      this.selectNode = {}
      this.initArr()
    },
    savePath() {
      this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.selectNode.sysProcessDeptNodeList = []
              this.sysProcessDeptNodeList.forEach(item=>{
                if(item.nodeName !== '请选择'){
                  this.selectNode.sysProcessDeptNodeList.push(item)
                }
              })
              workflow.savePathInfo(this.selectNode).then(res=>{
                if (res.code === "000000") {
                    this.$message({type:"success",message:"操作成功"})
                    this.dlgVisiable = false
                    this.handlerPathPage(1)
                  }
                }).catch((err) => {
                    this.$message({ type: "error", message: "保存路径信息出错" });
                });
            }
      });
      
    },
    closeOrgTag(tag,index){
      this.sysProcessDeptNodeList[index] = {nodeName:"请选择",orderNum:index+1} 
      let arr =  [...this.nodeArr]
      arr[index] = "请选择"
      this.nodeArr  = arr
    },
    addRule() {},
    viewInfo(item) {
      this.selectNode.linkHeadId = item.linkHeadId
      this.selectNode.linkName = item.linkName
      workflow.queryPathNodeInfo({linkHeadId:item.linkHeadId}).then(res=>{
        if(res.code === '000000'){
          this.selectNode = res.data
          this.sysProcessDeptNodeList = []
          this.nodeArr = []
          for(let i=0;i<20;i++){
            if(res.data.sysProcessDeptNodeList.length > i){
                this.sysProcessDeptNodeList.push(res.data.sysProcessDeptNodeList[i])
                this.nodeArr.push(res.data.sysProcessDeptNodeList[i].nodeName)
            }else{
              this.sysProcessDeptNodeList.push({nodeName:'请选择',orderNum:i+1})
              this.nodeArr.push("请选择")
            }
          }
          this.dlgVisiable = true
        }
      })
      
    },
    deletePath(item) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            workflow.deletePathInfo(item).then(res=>{
                this.$message({type:"success",message:"操作成功"})
                this.handlerPathPage(1)
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
    chooseNode(index) {
      this.dlgNodeVisible = true
      this.nodeIndex = index
      this.getProcessNode(1)
    },
    addProcessNode(){
      let arr = this.$refs.processNodeTables.selection;
      if (!arr || arr.length < 1)
        return this.$message({
          message: "请选择一条数据",
          type: "warning",
        });
      this.sysProcessDeptNodeList[this.nodeIndex] = arr[0]
      this.sysProcessDeptNodeList[this.nodeIndex].orderNum = this.nodeIndex + 1
      this.nodeArr[this.nodeIndex] = arr[0].nodeName
      this.dlgNodeVisible = false
    },
    handleSelectionChange(item){
      if (item.length > 1) {
         this.$refs.processNodeTables.clearSelection()
         this.$refs.processNodeTables.toggleRowSelection(item.pop())
       } 
    },
    handleCurrentChange(item){
      this.$refs.processNodeTables.clearSelection()
      this.$refs.processNodeTables.toggleRowSelection(item)
    },
    getProcessNode(page){
      this.loading = true
      this.searchOption.currentPage = page.currentPage || page;
      this.searchOption.pageSize = page.pageSize || this.searchOption.pageSize;
      workflow.queryNodeTask(this.searchOption).then(res=>{
        if(res.code === '000000'){
            this.processNodeData = res.data.records
            this.searchOption.currentPage = res.data.current
            this.searchOption.total = res.data.total
        }
        this.loading = false
      }).catch(err=>{
          this.loading = false
          this.$message({type:"error",message:"查询节点信息出错"})
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