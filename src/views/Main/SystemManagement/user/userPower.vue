<template>
    <div class="terms">
        <div class="bg-white mb24 pd24">
            <el-form :model="searchForm" label-width="100px"
                    :class="show?'over-vis':'over-hid'">
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="用户编号" prop="userCode">
                            <el-input v-model="searchForm.userCode" placeholder="请输入用户编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                       <el-form-item label="组织编号" prop="orgCode">
                            <el-input v-model="searchForm.orgCode" placeholder="请输入组织编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="角色编码" prop="roleCode">
                            <el-input v-model="searchForm.roleCode" placeholder="请输入角色编码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="用户名称" prop="userName">
                            <el-input v-model="searchForm.userName" placeholder="请输入用户编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="组织名称" prop="orgName">
                            <el-input v-model="searchForm.orgName" placeholder="请输入组织名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="searchForm.roleName" placeholder="请输入角色名称" style="width:60%"></el-input>
                            &nbsp; &nbsp;
                            <el-button type="primary" @click="formSearchMethod"
                           icon="iconfont sbt_add">查询
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <div class="bg-white user-form-table pd24">
             <el-alert
                title="此处需要对用户分配data类型的角色后，才能查询到"
                type="info">
            </el-alert>
             <el-table
                class="mt10 md20"
                :data="tableData"
                stripe highlight-current-row
                style="width: 100%"
                @selection-change="handleSelectionChange"
                :header-cell-style="{background:'#f3f3f3'}"
                size="small"
            >
                <el-table-column
                type="index"
                label="序号">
                </el-table-column>
                <el-table-column prop="userCode" label="用户编码"></el-table-column>
                <el-table-column prop="userName" label="用户姓名"></el-table-column>
                <el-table-column prop="orgCode" label="组织编码"></el-table-column>
                <el-table-column prop="orgName" label="组织名称"></el-table-column>
                <el-table-column prop="roleCode" label="角色编码"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="fillDate" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="editDeputyAcc(scope.row)">分配数据权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
        </div>

        <el-dialog
            title="分配数据权限"
            width="70%"
            :visible.sync="dlgDeputyVisible">
            <el-row>
                <el-col :span="12">
                    <div>选择组织</div>
                    <CommonOrgTree ref="orgTree" v-model="checkedKeys" @check-ok="getCheckOrg" :showBtn="false"></CommonOrgTree>
                </el-col>
                <el-col :span="12">
                    <div>选择事业部</div>
                    <el-tree
                        ref="unitTree"
                        :data="treeData"
                        highlight-current
                        node-key="unitCode"
                        :props="defaultProps"
                        show-checkbox
                        :default-expanded-keys="['00000000']"
                    ></el-tree>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgDeputyVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="btnClickFlag" @click="saveData">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {getPersonList,getAllUnit} from '@/service/4A/index'
import service from "@/utils/request";
export default {
    name:'',
    components: {
    },
    data(){
        return{
            LOGIN_URL: process.env.VUE_APP_BASE_LOGIN_URL,
            btnClickFlag:false,
            tableData:[],
            checkedKeys:[],
            checkedUnitKeys:[],
            value:'',
            treeData:[
                {id: 26,
                    unitCode: '00000000',
                    unitName: '事业部',
                    isn:"1",
                    children:[]}
            ],
            dlgDeputyVisible: false,
            show:false,
            searchForm: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            userId: null,
            defaultProps: {
                label: 'unitName',
                isLeaf: (data, node) => {
                    if(data.isn === '1'){
                        return false;
                    }else{
                        return true;
                    }
                }
            },
            selectNode:{}
        }
    },
    created(){

    },
    mounted(){
        this.formSearchMethod()
        getAllUnit({}).then(res=>{
                this.treeData[0].children = res.data
            }
        )
    },
    methods:{
        // 查询数据
        formSearchMethod(){
            this.searchForm.currentPage = 1
            this.searchForm.pageSize = 10
            this.queryUser(this.searchForm)
        },
        openType(){
            this.dialogVisible = true
        },
        handlerCurrentPage(val){
            this.searchForm.currentPage = val.currentPage
            this.queryUser(this.searchForm)
        },
        // 查询条款数据
        async queryUser(params){
            params.roleId = -1
            params.roleType = 'data'
            const{code, data} = await getPersonList(params)
            if(code && code ==='000000'){
                this.searchForm.total = data.total
                this.searchForm.currentPage = data.pageNo
                this.searchForm.pageSize = data.pageSize
                this.tableData = data.content
            }
        },
        handleSelectionChange(row){
            this.userId = row.userId
        },
        editDeputyAcc(row){
            this.selectNode = {...row}
            service.post( "/isump/deputy-account-role/selectDeputyAccountRoleOrgAndUnit",
          {
            "deputyAccountRoleId": row.deputyAccountRoleId
          },
          { baseURL: this.LOGIN_URL }).then(res=>{
              if(res.code='000000'){
                  let orgList = res.data.deputyAccountRoleOrgList
                  let unitList = res.data.deputyAccountRoleUnitList
                  this.checkedKeys = []
                  orgList.forEach(element => {
                      this.checkedKeys.push(element.orgCode)
                  });
                  let unitArr = []
                  unitList.forEach(element => {
                      unitArr.push(element.unitCode)
                  });
                  this.dlgDeputyVisible = true
                    this.$nextTick(()=>{
                        this.$refs.unitTree.setCheckedKeys(unitArr);
                    })
              }
            }).catch(err=>{
                this.$message({
                    message: "获取数据权限失败",
                    type: "warning",
                    });
            })
            
        },
        getCheckOrg(obj){
            //子组件回调
        },
        saveData(){
            let orgArr = this.$refs.orgTree.clickHandle()
            let unitArr = this.$refs.unitTree.getCheckedNodes(unitArr)
            this.btnClickFlag = true
            setTimeout(() => {
                // 组装数据
                let params = {
                    deputyAccountRoleId: this.selectNode.deputyAccountRoleId,
                    deputyAccountId: this.selectNode.deputyAccountId,
                    roleId: this.selectNode.roleId,
                    deputyAccountRoleOrgList: [],
                    deputyAccountRoleUnitList: []
                }
                if(orgArr){
                    orgArr.forEach(element=>{
                        let org = {
                            orgCode: element.orgCode,
                            orgId: element.orgId,
                            orgName: element.orgName,
                            userId:this.selectNode.userId,
                            deputyAccountId:this.selectNode.deputyAccountId,
                            deputyAccountRoleId:this.selectNode.deputyAccountRoleId,
                        }
                        params.deputyAccountRoleOrgList.push(org)
                    })
                }
                if(unitArr){
                    unitArr.forEach(element=>{
                        let unit = {
                            unitCode: element.unitCode,
                            unitId: element.unitId,
                            unitName: element.unitName,
                            userId:this.selectNode.userId,
                            deputyAccountId:this.selectNode.deputyAccountId,
                            deputyAccountRoleId:this.selectNode.deputyAccountRoleId,
                        }
                        params.deputyAccountRoleUnitList.push(unit)
                    })
                }
                service.post( "/isump/deputy-account-role/saveDeputyAccountRoleOrgAndUnit",
                    params,
                    { baseURL: this.LOGIN_URL }).then(res=>{
                            if(res.code==='000000'){
                                this.dlgDeputyVisible = false
                                this.$message({
                                    message: "保存数据成功",
                                    type: "success",
                                });
                            }
                            this.btnClickFlag = false
                        }).catch(err=>{
                            this.btnClickFlag = false
                            this.$message({
                                message: "保存数据失败",
                                type: "error",
                            });
                        })
                
                
            }, 500);
        }
        
    }
}
</script>
<style lang="less" scoped>
.terms{
    .resetButton{
        border: 1px solid #BBBFC4;
    }
    .tableColQuery{
        color:#2393F7;
        cursor: pointer;
    }
    .tableCol{
        color:#2393F7;
        margin-left:12px;
        cursor: pointer;
    }
}
</style>
