<template>
    <div class="main">
        <div class="bg-white mb24 pd24">
            <el-form :model="searchData" label-width="120px" :inline="true">
                <el-row>
                    <el-col :span="8">
                    <el-form-item label="字典编号">
                        <el-input v-model="searchData.dictCode" placeholder="请输入字典编号"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="8">
                    <el-form-item label="字典名称">
                        <el-input v-model="searchData.dictName" placeholder="请输入字典名称"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        
        <div class="bg-white user-form-table pd24">
             <el-button size="small" type="success" icon="el-icon-plus" @click="goAdd">新增字典</el-button>
             <el-table
                :data="tableData"
                style="width: 100%"
                row-key="dictCode"
                border
                lazy
                :load="load"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="dictCode" align="left" label="字典编号" show-overflow-tooltip min-width="10%"></el-table-column>
                <el-table-column prop="parentCode" align="center" label="父级编号" show-overflow-tooltip min-width="10%"></el-table-column>
                <el-table-column prop="dictName" align="center" label="字典名称" show-overflow-tooltip min-width="15%"></el-table-column>
                <el-table-column prop="sysCode" align="center" label="来源系统" show-overflow-tooltip min-width="10%"></el-table-column>
                <el-table-column prop="dictState" align="center" label="状态" show-overflow-tooltip min-width="5%">
                    <template slot-scope="scope">
                        {{scope.row.dictState == "0" ? "有效" : "失效"}}
                    </template>
                </el-table-column>
                <el-table-column prop="startDate" align="center" label="生效时间" show-overflow-tooltip min-width="10%"></el-table-column>
                <el-table-column prop="endDate" align="center" label="失效时间" show-overflow-tooltip min-width="10%"></el-table-column>
                <el-table-column label="操作" align="center" width="300px">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="handleAdd(scope.row)">添加</el-button>
                        <el-button
                            size="mini"
                            type="warning"
                            @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row)">删除</el-button>
                        <el-button
                            size="mini"
                            type="success"
                            @click="perimission(scope.row)">权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <common-pagination v-on:handler-currentPage="handlePageChange" :list="pager"></common-pagination>
        </div>

        <el-dialog title="字典编辑" :visible.sync="dlgDirtVisiable"
            width="500px">
            <el-form :model="dirt" ref="dirtForm" :rules="dirtRules" label-width="120px">
                <el-form-item label="字典编号" prop="dictCode">
                    <el-input v-model="dirt.dictCode"></el-input>
                </el-form-item>
                <el-form-item label="字典名称" prop="dictName">
                    <el-input v-model="dirt.dictName"></el-input>
                </el-form-item>
                <el-form-item label="来源系统" prop="sysCode">
                    <el-input v-model="dirt.sysCode"></el-input>
                </el-form-item>
                 <el-form-item label="生效时间" prop="startDate">
                    <el-date-picker
                                v-model="dirt.startDate"
                                type="date"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期">
                            </el-date-picker>
                </el-form-item>
                <el-form-item label="失效时间" prop="endDate">
                    <el-date-picker
                                v-model="dirt.endDate"
                                type="date"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期">
                            </el-date-picker>
                </el-form-item>
                <el-form-item label="生效时间" prop="startDate">
                    <el-select v-model="dirt.dictState">
                        <el-option key="0" value="0" label="生效"></el-option>
                        <el-option key="1" value="1" label="失效"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" >
                    <el-input v-model="dirt.dictSort" type="number"></el-input>
                </el-form-item>
                <el-form-item label="备注" >
                    <el-input v-model="dirt.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgDirtVisiable = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'字典('+selectNode.dictName+')权限信息'" :visible.sync="dlgPerimission"
            width="70%">
            <el-form label-width="120px" label-position="left">
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="权限对象名称">
                            <el-input v-model="searchForm.objectName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col  :span="8">
                        <el-form-item label="权限类型">
                            <el-select v-model="searchForm.permissionType">
                                <el-option key="UNIT" value="UNIT" label="单位"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <el-button type="primary" @click="handlePermPageChange(1)">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button type="primary" @click="addUnit">新增单位权限</el-button>
            <el-table :data="perimissionData"
                style="width: 100%">
                <el-table-column prop="objectCode" label="权限对象编码"></el-table-column>
                <el-table-column prop="objectName" label="权限对象名称"></el-table-column>
                <el-table-column prop="permissionType" label="权限类型"></el-table-column>
                <el-table-column label="操作" align="center" width="100px">
                     <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="danger"
                            @click="deletePerm(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlePermPageChange" :list="searchForm"></common-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgPerimission = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="分配数据权限" width="30%" :visible.sync="dlgUnit">
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgUnit = false">取 消</el-button>
                <el-button type="primary" :disabled="btnClickFlag" @click="saveUnit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

import service from "@/utils/request";
import {getAllUnit} from '@/service/4A/index'
import { mapGetters } from "vuex";
export default {
    data () {
        return {
            LOGIN_URL: process.env.VUE_APP_BASE_LOGIN_URL,
            dlgDirtVisiable: false,
            btnClickFlag: false,
            tableData: [],//表格数据
            loading: false,
            searchData: {
                // id: null,
                dictName: null,
                dictCode: null,
                parentCode: '0'
            },
            pager: {
                currentPage: 1,
                total: 0,
                pageSize: 10
            },
            dirt: {},
            parentDirt: {},
            dirtRules: {
                dictName: [{ required: true, message: '请输入字典名称', trigger: ['blur', 'change'] }],
                dictCode: [{ required: true, message: '请输入字典编号', trigger: ['blur', 'change'] }],
            },
            dlgPerimission: false,
            selectNode: {},
            perimissionData:[],
            searchForm:{
                currentPage: 1,
                total: 0,
                pageSize: 10
            },
            dlgUnit: false,
            treeData:[
                {id: 26,
                    unitCode: '00000000',
                    unitName: '事业部',
                    isn:"1",
                    children:[]}
            ],
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
        }
    },
    computed: {
      
    },
    methods : {
        goAdd () {
            this.dirt = {}
            this.parentDirt = null
            this.dlgDirtVisiable = true
        },
        handleAdd(row) {
            this.dirt = {}
            this.parentDirt =row
            this.dlgDirtVisiable = true
        },
        handleEdit(row) {
            this.dirt = row
            this.dlgDirtVisiable = true
        },
        handleDelete(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消!',
                type: 'warning'
            }).then(() => {
                service.delete(`/isump/dict/${row.dictId }`, {baseURL: this.LOGIN_URL}).then( res => {
                    if(res.code === '000000'){
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getData()
                    }
                })
            }).catch(() => { 
            });
        },
        onSubmit () {
            this.$refs['dirtForm'].validate((valid) => {
                if(valid) {
                    // 编辑 新增根目录字典数据 新增子节点字典
                    if(this.dirt.dictId) { // 编辑
                        if(!this.dirt.endDate){
                            this.dirt.endDate = ''
                        }
                        service.patch(`/isump/dict/${this.dirt.dictId }`, this.dirt,{baseURL: this.LOGIN_URL}).then(  res => {
                           if(res.code === '000000'){
                           this.$message({
                                type: 'success',
                                message: '编辑成功!'
                            });
                            this.getData()
                            this.dirt = {}
                            this.parentDirt = {}
                            this.dlgDirtVisiable = false
                           }
                        })
                    } else {
                        this.dirt.parentCode = this.parentDirt ? this.parentDirt.dictCode : '0'
                        this.dirt.parentId = this.parentDirt ? this.parentDirt.dictId : '0'
                        service.post('/isump/dict', this.dirt, {baseURL: this.LOGIN_URL}).then( res => {
                            if(res.code === '000000'){
                                this.$message({
                                    type: 'success',
                                    message: '保存成功!'
                                });
                                this.getData()
                                this.dirt = {}
                                this.parentDirt = {}
                                this.dlgDirtVisiable = false
                            }
                        })
                    }
                    
                }
            })
        },
        getData (page) {
            let params  = {
                ...this.pager,
                ...this.searchData
            }
            this.loading = true;
            params.currentPage = page || params.currentPage
            params.dictState = 'all'
            this.tableData = []
            service.post('/isump/dict/page/conditions', params,{baseURL: this.LOGIN_URL}).then( res => {
                this.loading = false
                this.pager.total = res.data.total
                this.pager.currentPage = res.data.current
                this.pager.pageSize = res.data.size
                for(let arr of res.data.records) {
                    arr.hasChildren = true
                }
                this.tableData = res.data.records
            })
        },
        load (tree, treeNode, resolve) {
           if(tree.dictCode){
                this.getDictMap(tree.dictCode, res => {
                    for(let a of res){
                        a.hasChildren = true
                    }
                    return resolve(res)
                })
            }
        },
        handlePageChange (page) {
            this.getData(page.currentPage)
        },
        handleSearch () {
            this.getData(1)
        },
        getDictsByParentCode(parentCode, callback) {
            service.post('/isump/dict/list/conditions', {
                parentCode: parentCode,
                dictState: 'all'
            },{baseURL: this.LOGIN_URL}).then( res => {
                callback && callback(res.data)
            })
        },
        getDictMap(code, callback) {
            service.post('/isump/dict/list/conditions', {
                parentCode: code,
                dictState: 'all'
            },{baseURL: this.LOGIN_URL}).then( res=>{
                callback && callback(res.data)
            })
        },
        perimission(row){
            this.dlgPerimission = true
            this.selectNode = {...row}
            this.handlePermPageChange()
        },
        handlePermPageChange(page){
            let params  = {
                ...this.searchForm
            }
            this.loading = true;
            params.currentPage = page || params.currentPage
            params.dictId = this.selectNode.dictId
            this.perimissionData = []
            service.post('/isump/dict-permission/page/conditions', params,{baseURL: this.LOGIN_URL}).then( res => {
                this.loading = false
                this.searchForm.total = res.data.total
                this.searchForm.currentPage = res.data.current
                this.searchForm.pageSize = res.data.size
                this.perimissionData = res.data.records
            })
        },
        viewPerm(row){

        },
        deletePerm(row){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消!',
                type: 'warning'
            }).then(() => {
                service.delete(`/isump/dict-permission/${row.permissionId }`, {baseURL: this.LOGIN_URL}).then( res => {
                    if(res.code === '000000'){
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.handlePermPageChange()
                    }
                })
            }).catch(() => { 
            });
        },
        addUnit(){
            this.dlgUnit = true
            this.btnClickFlag = false
        },
        saveUnit(){
            this.btnClickFlag = true
            let unitArr = this.$refs.unitTree.getCheckedNodes(unitArr)
            if(unitArr){
                    let param = []
                    unitArr.forEach(element=>{
                        let unit = {
                            objectCode: element.unitCode,
                            objectId: element.unitId,
                            objectName: element.unitName,
                            dictId:this.selectNode.dictId,
                            permissionType:'UNIT'
                        }
                        param.push(unit)
        
                    })
                    service.post( "/isump/dict-permission/batch",
                        JSON.stringify(param),
                        { baseURL: this.LOGIN_URL }).then(res=>{
                                if(res.code==='000000'){
                                    this.$message({
                                        message: "保存数据成功",
                                        type: "success",
                                    });
                                    this.dlgUnit = false
                                    this.handlePermPageChange()
                                }
                                this.btnClickFlag = false
                            }).catch(err=>{
                                this.btnClickFlag = false
                                this.$message({
                                    message: "保存数据失败",
                                    type: "error",
                                });
                            })
                }else{
                    this.$message({type:'warning',message:'请选择至少一个'})
                }
        }
    },
    mounted () {
        this.getData()
         getAllUnit({}).then(res=>{
                this.treeData[0].children = res.data
            }
        )
    }
}
</script>