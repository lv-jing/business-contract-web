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
                        <el-form-item label="用户名称" prop="userName">
                            <el-input v-model="searchForm.userName" placeholder="请输入用户编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="searchForm.phone" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="searchForm.email" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="证件号" prop="idCard">
                            <el-input v-model="searchForm.idCard" placeholder="请输入证件号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户状态" prop="statusCode">
                            <el-select v-model="searchForm.statusCode" placeholder="请输入选择">
                                <el-option key="" value="" label="全部"></el-option>
                                <el-option key="0" value="0" label="有效"></el-option>
                                <el-option key="1" value="1" label="失效"></el-option>
                            </el-select>
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
             <SyncMdm dataType="user" buttonName="同步人员信息"></SyncMdm>
             <SyncMdm dataType="dept" buttonName="同步部门信息"></SyncMdm>
             <SyncMdm dataType="org" buttonName="同步组织信息"></SyncMdm>
             <SyncMdm dataType="job" buttonName="同步职务信息"></SyncMdm>
             <SyncMdm dataType="company" buttonName="同步公司信息"></SyncMdm>
             <SyncMdm dataType="unit" buttonName="同步事业部信息"></SyncMdm>
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
                <el-table-column prop="phone" label="手机号"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="idCard" label="证件号"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{scope.row.statusCode == "1" ? "失效":'有效'}}
                    </template>
                </el-table-column>
                <el-table-column prop="fillDate" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="editDeputyAcc(scope.row)">查看分配信息</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
        </div>

        <el-dialog
            title="用户分配信息"
            width="70%"
            :visible.sync="dlgDeputyVisible" >
            <userDeputyAcc :userId="userId" ref="dlgDeputyAccount"></userDeputyAcc>
        </el-dialog>
    </div>
</template>
<script>
import {queryUserList} from '@/service/4A/index'
import {syncMdmData,syncMdmInToData} from '@/service/timer/index'
import userDeputyAcc from './userDeputyAcc'
import SyncMdm from './SyncMdm'
import service from "@/utils/request";
export default {
    name:'',
    components: {
        userDeputyAcc,
        SyncMdm
    },
    data(){
        return{
            LOGIN_URL: process.env.VUE_APP_BASE_LOGIN_URL,
            tableData:[],
            value:'',
            dlgDeputyVisible: false,
            show:false,
            searchForm: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            userId: null,
        }
    },
    created(){

    },
    mounted(){
        this.formSearchMethod()
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
            const{code, data} = await queryUserList(params)
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
        editDeputyAcc (row) {
            this.userId = row.userId
            this.dlgDeputyVisible = true
            setTimeout(() => {
                this.$refs.dlgDeputyAccount && this.$refs.dlgDeputyAccount.getData()
            }, 100);
        },
        async syncMdmInfo(where){
            let params = {
                procedureName: "isump_sync_pkg.sync_persion_info",
                viewName: "PS_PERSONAL_VW",
                whereName: ""
            }
            const{code, data} = await syncMdmData(params)
            if(code === '000000'){
                syncMdmInToData(params)
            }
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
