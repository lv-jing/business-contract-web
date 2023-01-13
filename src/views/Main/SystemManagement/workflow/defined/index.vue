<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <span>要素组合关联审批路径</span>
      </div>
      <el-row class="bg-white" :gutter="24">
          <el-col>
            <el-form :model="searchForm" label-width="100px" label-position="left">
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="流程类型" prop="objectTypeCode">
                    <CommonSelect v-model="searchForm.objectTypeCode" :dictCode="'OBJECT_TYPE'" :clearable="true" placeholder="流程类型"></CommonSelect>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合同类型" prop="contractType">
                     <CommonTreeSelect
                          :value="searchForm.contractType"
                          :dict-code="'INCOME_EXPE_TYPE'"
                        />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="路径名称" prop="linkName">
                      <el-input v-model="searchForm.linkName" placeholder="请输入路径名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-button
                      type="primary"
                      @click="handlerCurrentPage(1)"
                      icon="iconfont sbt_add"
                    >查询</el-button>
                </el-col>
              </el-row>
            </el-form>
            <el-button type="primary" @click="addConfig">新增</el-button>
            <el-table :data="tableData" style="width: 99%" :highlight-current-row="true" :show-overflow-tooltip="true" :v-loading="loading">
              <el-table-column type="index" width="60" label="序号" fixed></el-table-column>
              <el-table-column prop="linkName" width="300" label="审批路径" fixed></el-table-column>
              <el-table-column prop="objectType" width="150" label="流程类型" fixed></el-table-column>
              <el-table-column prop="companyName" width="150" label="组织" fixed></el-table-column>
              <el-table-column prop="contractType" width="200" label="要素1：合同类型"></el-table-column>
              <el-table-column prop="contractName" width="200" label="要素2：四级"></el-table-column>
              <el-table-column prop="orgName"  width="200" show-overflow-tooltip label="要素3：发起部门"></el-table-column>
              <el-table-column prop="maxAmount" width="200" label="要素4：含税合同额">
                <template slot-scope="scope">
                  <div v-if="scope.row.minAmount!=null && scope.row.maxAmount!=null">{{scope.row.minAmount}} 至 {{scope.row.maxAmount}}</div>
                  <div v-else-if="scope.row.minAmount==null && scope.row.maxAmount!=null">0 至 {{scope.row.maxAmount}}</div>
                  <div v-else-if="scope.row.minAmount!=null && scope.row.maxAmount==null">{{scope.row.minAmount}} 至 ∞</div>
                  <div v-else></div>
                </template>
              </el-table-column>
              <el-table-column prop="signDuration" width="200" label="要素5：合同期限">
                 <template slot-scope="scope">
          <DictCodeToDictName :parentCode="'SIGN_DURATION'" :dictCode="scope.row.signDuration"></DictCodeToDictName>
        </template>
              </el-table-column>
              <el-table-column prop="entityAttribute" width="200" label="要素6：我方签约主体">
                 <template slot-scope="scope">
          <DictCodeToDictName :parentCode="'ENTITY_ATTRIBUTE'" :dictCode="scope.row.entityAttribute"></DictCodeToDictName>
        </template>
              </el-table-column>
              <el-table-column prop="quoteTemplate" width="200" label="要素7：标准合同">
                 <template slot-scope="scope">
          <DictCodeToDictName :parentCode="'QUOTE_TEMPLATE'" :dictCode="scope.row.quoteTemplate"></DictCodeToDictName>
        </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="viewInfo(scope.row)">详情</el-button>
                  <el-button type="text" @click="deleteInfo(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="pager2"></common-pagination>
          </el-col>
      </el-row>
    </el-card>
    <el-dialog title="要素组合" :visible.sync="dlgVisiable" width="60%">
        <el-form label-width="150px"
        :rules="rules"
        ref="ruleForm"
        :model="selectNode">
            <el-row>
                <el-col>
                    <el-form-item label="审批路径" prop="linkName">
                      <el-input v-model="selectNode.linkName" placeholder="请选择审批路径" :disabled="true" style="width:85%"></el-input>
                      <el-button @click="openPath">选择</el-button>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="流程类型" prop="objectType">
                      <CommonSelectItem v-model="objectTypeObj" :dictCode="'OBJECT_TYPE'" :clearable="true" placeholder="流程类型"></CommonSelectItem>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="组织" prop="companyName">
                        <el-select v-model="companyObj" multiple filterable clearable placeholder="请选择组织">
                          <el-option
                            v-for="item in orgData"
                            :key="item.value"
                            :label="item.label"
                            :value="item">
                          </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="要素1：合同类型" prop="contractType">
                      <el-tag v-for="(item,index) in contractTypeNames"
                            closable
                            :key="index"
                            @close="closeContractTag(item,index)"
                            :type="'success'">
                              {{item}}
                         </el-tag>
                        <CommonTreeSelect
                          :value="contractTypeObj.value"
                          :treeSelect="treeSelect"
                          :dict-code="'INCOME_EXPE_TYPE'"
                        />
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="要素2：四级" prop="contractName">
                      <el-tag v-for="(item,index) in contractScenarioNames"
                            closable
                            :key="index"
                            @close="closeScenarioTag(item,index)"
                            :type="'success'">
                              {{item}}
                         </el-tag>

                         <el-select filterable v-model="contractScenarioObj" clearable
                           placeholder="要素2：四级" class="w-100" @change="chooseScenario">
                          <el-option
                            v-for="(item,index) in ScenarioList"
                            :key="index"
                            :label="item.label"
                            :value="item">
                          </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="要素3：发起部门" prop="orgName">
                         <el-tag v-for="(item,index) in orgName"
                            closable
                            :key="index"
                            @close="closeOrgTag(item,index)"
                             @click="chooseOrgs"
                            :type="'success'">
                              {{item}}
                         </el-tag>
                         <el-button @click="chooseOrgs">请选择</el-button>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="要素4：含税合同额" prop="amount">
                        从 <el-input v-model="selectNode.minAmount" type="number" style="width:45%"></el-input>
                        至 <el-input v-model="selectNode.maxAmount" type="number" style="width:45%"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="要素5：合同期限" prop="signDuration">
                         <CommonSelect v-model="selectNode.signDuration" :dictCode="'SIGN_DURATION'" :clearable="true" placeholder="请选择"></CommonSelect>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="要素6：我方签约主体" prop="entityAttribute">
                         <CommonSelect v-model="selectNode.entityAttribute" :clearable="true" :dictCode="'ENTITY_ATTRIBUTE'" placeholder="请选择"></CommonSelect>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="要素7：标准合同" prop="quoteTemplate">
                         <CommonSelect
                          v-model="selectNode.quoteTemplate"
                          clearable
                          dictCode="QUOTE_TEMPLATE"
                          placeholder="请选择"
                          :isSplicing="false"
                        />
                    </el-form-item>
                </el-col>
                <el-col>
                    <div style="text-align:center">
                        <el-button type="primary" :disabled="btnClickFlag" @click="saveConfig">保存</el-button>
                        <el-button  @click="dlgVisiable=false">关闭</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>

    <el-dialog title="选择审批路径'" :visible.sync="dlgVisiable2" width="50%">
        <el-form :model="pathSearchForm" label-width="100px" label-position="left">
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="审批路径名称" prop="linkName">
                    <el-input v-model="pathSearchForm.linkName" placeholder="请审批节点"></el-input>
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

        <el-table :data="pathData"
          style="width: 99%"
         :highlight-current-row="true"
         ref="multipleTable"
         tooltip-effect="dark"
         @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="linkName" label="审批路径名称" fixed></el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlerPathPage" :list="pager1"></common-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgVisiable2 = false">取 消</el-button>
                <el-button type="primary" :disabled="btnClickFlag" @click="selectPath">确 定</el-button>
            </div>
    </el-dialog>

    <!-- 选择部门 -->
    <el-dialog title="选择组织" width="50%" :visible.sync="dlgOrgVisible" append-to-body>
       <CommonOrgTree ref="orgTree" v-model="checkedKeys" @check-ok="addOrg" :showBtn="true"></CommonOrgTree>
       <!-- <div style="margin-bottom: 10px;">
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
      </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dlgOrgVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import workflow from "@/service/workflow/index";
import service from "@/utils/request";
import {dictSelectList} from "@/service/common";
export default {
  data() {
    return {
      loading:false,
      btnClickFlag: false,
      LOGIN_URL: process.env.VUE_APP_BASE_LOGIN_URL,
      pathData: [],
      tableData: [],
      searchForm: {objectTypeCode:null},
      dlgVisiable:false,
      dlgVisiable2:false,
      pathSearchForm:{},
      pager1: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      pager2: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      selectNode:{
         objectType:'',
         linkName:''
      },
      objectTypeObj:{value:'',label:''},
      contractTypeObj:{value:null,label:''},
      companyObj:[{value:'',label:''}],
      contractScenarioObj:{value:'',label:''},
      rules:{

      },
      orgData:[],
      contractTypeData:[],
      dlgOrgVisible:false,
      orgsData: [],
       orgSearchOption:{
        orgCode:'',
        orgName:'',
        currentPage: 1,
        pageSize: 10,
      },
      orgName:[],
      ScenarioList:[],
      checkedKeys:[],
      contractTypeNames:[],
      contractTypes:[],
      contractScenarioNames:[],
      contractScenarios:[]
    };
  },
  created() {},
  mounted() {
    this.handlerCurrentPage(1);
    this.getContractTypeData()
    this.getOrgLevel()
  },
  methods: {
    /**
     * 获取合同场景
     */
    async getDictSelectList(val) {
      const {code, data} = await dictSelectList({
        parentCode: val,
        permission: "UNIT"
      });
      if (code === '000000') {
        if(data.length>0){
          this.ScenarioList = []
          data.forEach(element=>{
            this.ScenarioList.push({value:element.dictCode,label:element.attribute1})
          })
        }else{
          this.ScenarioList = data || []
        }
      }
    },
    treeSelect(item){
      this.contractTypeObj.value = item.dictCode
      this.contractTypeObj.label = item.dictName
      this.contractTypeNames.push(item.dictName)
      this.contractTypes.push(item.dictCode)
      if(this.contractTypeNames.length === 1){
        this.getDictSelectList(item.dictCode)
        // 清除四级
        this.contractScenarioObj = {}
        this.selectNode.contractName = ''
        this.selectNode.contractScenario = ''
      }else{
        // 清除四级
        this.ScenarioList = []
        this.contractScenarioObj = {}
        this.selectNode.contractName = ''
        this.selectNode.contractScenario = ''
      }
      this.contractScenarioNames = []
      this.contractScenarios = []

    },
    handlerPathPage(val) {
      this.loading = true
      this.pager1.currentPage = val.currentPage || val;
      this.pager1.pageSize = val.pageSize || this.pager1.pageSize;
      let params = {
        ...this.pathSearchForm,
        ...this.pager1
      }
      workflow.queryPathList(params).then(res=>{
        if(res.code === '000000'){
            this.pathData = res.data.records
            this.pager1.currentPage = res.data.current
            this.pager1.total = res.data.total
        }
        this.loading = false
      }).catch(err=>{
        this.loading = false
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
      workflow.queryConfigList(params).then(res=>{
        if(res.code === '000000'){
            this.tableData = res.data.records
            this.pager2.currentPage = res.data.current
            this.pager2.total = res.data.total
        }
      }).catch(err=>{
          this.$message({type:"error",message:"查询节点信息出错"})
      });
    },
    saveConfig(){
      let item = {}
      this.selectNode.objectType  = this.objectTypeObj.label
      this.selectNode.objectTypeCode  = this.objectTypeObj.value

      if(this.companyObj){
        let companyCodeArr = []
        let companyNameArr = []
        this.companyObj.forEach(ele=>{
          companyCodeArr.push(ele.value)
          companyNameArr.push(ele.label)
        })
        this.selectNode.companyName = companyNameArr.join(",")
        this.selectNode.companyCode = companyCodeArr.join(",")
      }else{
        this.selectNode.companyName = ''
        this.selectNode.companyCode = ''
      }
      this.selectNode.contractType = this.contractTypeNames.join(",")//this.contractTypeObj.label
      this.selectNode.contractTypeCode = this.contractTypes.join(",")//this.contractTypeObj.value

      this.selectNode.contractName = this.contractScenarioNames.join(",") //this.contractScenarioObj.label
      this.selectNode.contractScenario = this.contractScenarios.join(",") //this.contractScenarioObj.value
      if(!this.selectNode.linkName){
        this.$message({ type: "error", message: "请选择审批路径" });
        return
      }
      if(!this.selectNode.objectTypeCode){
        this.$message({ type: "error", message: "请选择流程类型" });
        return
      }
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            workflow.saveConfigInfo(this.selectNode).then(res=>{
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
    addConfig(){
      this.selectNode = {},
      this.objectTypeObj = {value:'',label:''},
      this.contractTypeObj = {value:null,label:''},
      this.companyObj = []
      this.dlgVisiable = true
    },
    viewInfo(item) {
      this.objectTypeObj = {}
      this.objectTypeObj.label = item.objectType||''
      this.objectTypeObj.value = item.objectTypeCode||null
      // this.companyObj.label = item.companyName||''
      // this.companyObj.value = item.companyCode||''
      this.companyObj = []
      if(item.companyCode){
        let companyCodeArr = item.companyCode.split(",")
        let companyNameArr = item.companyName.split(",")
        for(let i=0;i<companyCodeArr.length;i++){
          this.companyObj.push({
            value:companyCodeArr[i],
            label:companyNameArr[i]
          })
        }
      }
      if(item.contractTypeCode){
        this.contractTypeNames = item.contractType.split(",")
        this.contractTypes = item.contractTypeCode.split(",")
      }
      // this.contractTypeObj.label =item.contractType||''
      // this.contractTypeObj.value =item.contractTypeCode||''
      if(item.contractScenario){
        this.contractScenarios = item.contractScenario.split(",")
        this.contractScenarioNames = item.contractName.split(",")
      }
      // this.contractScenarioObj.label = item.contractName
      // this.contractScenarioObj.value = item.contractScenario
      this.orgName = item.orgName ? item.orgName.split(",") : []
      this.selectNode = item
      if(this.contractTypes.length<=1){
        this.getDictSelectList(item.contractTypeCode)
      }
      this.dlgVisiable = true
    },
    deleteInfo(item) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            workflow.deleteConfigInfo(item).then(res=>{
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
    handleSelectionChange(item){
      if (item.length > 1) {
        if(this.dlgVisiable2){
         this.$refs.multipleTable.clearSelection()
         this.$refs.multipleTable.toggleRowSelection(item.pop())
        }
        if(this.dlgOrgVisible){
         this.$refs.orgTables.clearSelection()
         this.$refs.orgTables.toggleRowSelection(item.pop())
        }
      }
    },
    handleCurrentChange(item){
      if(this.dlgVisiable2){
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(item)
      }
      if(this.dlgOrgVisible){
        this.$refs.orgTables.clearSelection()
        this.$refs.orgTables.toggleRowSelection(item)
      }
    },
    selectPath(){
      this.btnClickFlag = true
      let arr = this.$refs.multipleTable.selection;
      if (!arr || arr.length < 1){
        this.btnClickFlag = false
        return this.$message({
          message: "请至少选择一条数据",
          type: "warning",
        });
      }
      this.selectNode.linkName = arr[0].linkName
      this.selectNode.linkHeadId = arr[0].linkHeadId
      this.dlgVisiable2 = false
      this.btnClickFlag = false
    },
    openPath(){
      this.dlgVisiable2 = true
      this.handlerPathPage(1)
    },
    getOrgLevel(params){
      // params
       service.post('/isump/organization/page/orglevel', {pageSize:1000},{ baseURL: this.LOGIN_URL }).then(
         res => {
           if(res.code === '000000'){
             this.orgData = []
             let arr = res.data.content
             arr.forEach(element => {
                let temp = {value:element.orgCode,label:element.orgName}
                this.orgData.push(temp)
             });
           }
         }
       )
    },
    getContractTypeData(){
      // INCOME_EXPE_TYPE
      service.post('/isump/dict/query/all/code', {dictCode:'INCOME_EXPE_TYPE'},{ baseURL: this.LOGIN_URL }).then(
         res => {
           if(res.code === '000000'){
             let arr = res.data
             this.contractTypeData = []
             arr.forEach(element => {
               if(element.level === '3'){
                 let temp = {value:element.dictCode,label:element.dictName}
                 this.contractTypeData.push(temp)
               }
             });
           }
         }
       )
    },
     // 选择组织
    chooseOrgs(){
      this.dlgOrgVisible=true
      if(this.selectNode.orgCode){
        this.checkedKeys = this.selectNode.orgCode.split(",")
      }else{
        this.checkedKeys = []
      }
      // this.getOrgs(1)
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
    addOrg(keyNodes,nodeDatas) {
      // let arr = this.$refs.orgTables.selection;
      // if (!arr || arr.length < 1)
      //   return this.$message({
      //     message: "请至少选择一条数据",
      //     type: "warning",
      //   });
      let arr = nodeDatas
        let arrOrgName = []
        let arrOrgCode = []
        arr.forEach(element=>{
          arrOrgName.push(element.orgName)
          arrOrgCode.push(element.orgCode)
        })
      this.selectNode.orgName = arrOrgName.join(",")
      this.selectNode.orgCode = arrOrgCode.join(",")
      this.orgName = arrOrgName
      this.dlgOrgVisible = false;
    },
    closeOrgTag(tag,index){
      console.log(this.orgName)
      this.orgName.splice(index, 1)
      let orgCodes = this.selectNode.orgCode.split(',')
      let orgNames = this.selectNode.orgName.split(',')
      orgCodes.splice(index, 1)
      orgNames.splice(index, 1)
      this.selectNode.orgCode = orgCodes.join(',')
      this.selectNode.orgName = orgNames.join(',')

    },
    closeContractTag(tag,index){
      this.contractTypeNames.splice(index, 1)
      this.contractTypes.splice(index, 1)
      if(this.contractTypeNames.length === 1){
        this.getDictSelectList(this.contractTypes[0])
      }
      this.contractScenarioNames = []
      this.contractScenarios = []
    },
    closeScenarioTag(tag,index){
      this.contractScenarioNames.splice(index, 1)
      this.contractScenarios.splice(index, 1)
    },
    chooseScenario(val){
      this.contractScenarioNames.push(val.label)
      this.contractScenarios.push(val.value)
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
