<template>
    <div class="main">
        <div class="bg-white mb24 pd24">
            <el-form :model="roleSearchOption" label-width="120px" >
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="角色编号" prop="roleCode">
                            <el-input v-model="roleSearchOption.roleCode" placeholder="请输入所属编号" class="input-edit-role"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="roleSearchOption.roleName" class="input-edit-role"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="角色类型" prop="roleType">
                            <el-select v-model="roleSearchOption.roleType" value-key="value" placeholder="请选择" class="input-edit-role">
                                <el-option
                                    v-for="item in roleTypes"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button size="small" type="primary" @click="getRoles(1)">查 询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        
        <div class="bg-white user-form-table pd24">
             <el-button size="mini" type="primary" @click="goAdd">新增角色</el-button>
             <el-table
                class="mt10 md20"
                :data="rolesData"
                stripe 
                highlight-current-row
                style="width: 100%"
                ref="roleTables"
                :header-cell-style="{background:'#f3f3f3'}"
                size="small"
            >
                <el-table-column
                type="index"
                label="序号">
                </el-table-column>
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="roleCode"
                        label="角色编号"
                        min-width="15%">
                    </el-table-column>
                    <el-table-column
                        prop="roleName"
                        label="角色名称"
                        min-width="25%">
                    </el-table-column>
                    <el-table-column
                        prop="roleType"
                        label="角色类型"
                        min-width="10%">
                    </el-table-column>
                    <el-table-column
                        prop="service"
                        label="系统来源"
                        min-width="10%">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="300px">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" type="primary" @click="permissionEdit(scope.$index, scope.row)">分配权限</el-button> -->
                    <DtMenuChoose :role="scope.row"></DtMenuChoose>
                    <el-button size="small" type="text" @click="goEdit(scope.row)">编辑</el-button>
                    <el-button size="small" type="text" @click="goDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
            </el-table>
             <common-pagination v-on:handler-currentPage="getRoles" :list="roleSearchOption"></common-pagination>
        </div>
        <el-dialog title="角色编辑" :visible.sync="dlgRoleVisiable" width="600px">
            <el-form :model="role" label-width="120px" :rules="roleRules" >
                <el-form-item label="角色编号" prop="roleCode">
                    <el-input v-model="role.roleCode"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="role.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色类型" prop="roleType">
                    <el-select v-model="role.roleType" placeholder="请选择">
                        <el-option
                        v-for="item in roleTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属系统" prop="service">
                    <el-select v-model="role.service" value-key="code" placeholder="请选择">
                        <el-option
                            v-for="item in systems"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input type="number" v-model="role.roleSort"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="role.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgRoleVisiable = false">取 消</el-button>
                <el-button type="primary" @click="saveRole">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import DtMenuChoose from './DtMenuChoose'
import service from "@/utils/request";
import { mapGetters } from "vuex";
export default {
    components:{
        DtMenuChoose
    },
  data() {
    return {
      LOGIN_URL: process.env.VUE_APP_BASE_LOGIN_URL,
      show: false,
      roleSearchOption:{currentPage: 1,
        total: 0,
        pageSize: 10},
        rolesData:[],
        roleTypes: [{
            value: 'function',
            label: 'function',
            }, {
                value: 'data',
                label: 'data',
            }, {
                value: 'approval',
                label: 'approval',
            }],
        dlgRoleVisiable: false,
        roleTypes: [{
                value: 'data',
                lable: 'data'
            },{
                value: 'function',
                lable: 'function'
            },{
                value: 'approval',
                lable: 'approval'
            }],
            systems: [{code:"contract",name:"合同系统"}],
            role: {"service":"contract"},
            roleRules: {
                roleCode: [
                    {required: true, message: '请输入角色编号', trigger: ['change', 'blur']}
                   
                ],
                roleName: [
                    {required: true, message: '请输入角色名称', trigger: ['change', 'blur']}
                ],
                roleType: [
                    {required: true, message: '请选择角色类型', trigger: ['change', 'blur']}
                ],
                service: [
                    {required: true, message: '请输入所属系统', trigger: ['change', 'blur']}
                ]
            }
        };
  },
  computed: {
    ...mapGetters(["getAuthObj"]),
  },
  created() {
      this.getRoles(1)
  },
  methods: {
      goAdd () {
            this.role = {} // 清空dlg数据
            this.dlgRoleVisiable = true
        },
        goEdit (row) {
            if(!row)
                return this.$message({type: 'warning', message: '请选择数据后在执行操作'})
            this.role = row
            this.dlgRoleVisiable = true
        },
        saveRole () {
            let params = this.role
            if(this.role.roleId) { // 修改
                service.patch(`/isump/role/${this.role.roleId }`, params,{ baseURL: this.LOGIN_URL }
        ).then( res => {
                    if(res && res.code === '000000') {
                        this.$message({
                            message: '修改角色成功',
                            type: 'success'
                        });
                        this.getRoles(1)
                        this.dlgRoleVisiable = false
                    }
                })
            } else { // 新增
                service.post('/isump/role', params,{ baseURL: this.LOGIN_URL }
        ).then( res => {
                    if(res && res.code === '000000') {
                        this.$message({
                            message: '添加角色成功',
                            type: 'success'
                        });
                        this.getRoles(1)
                        this.dlgRoleVisiable = false
                    }
                })
            }
        },
        goDelete (row) {
            this.$confirm('此操作将永久删除该角色信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '稍等，我在想一下',
                type: 'warning'
            }).then(() => {
                service.delete(`/isump/role/${row.roleId}`, { baseURL: this.LOGIN_URL }
        ).then( res => {
                if(res && res.code === '000000') {
                    this.$message({
                        message: '删除角色成功',
                        type: 'success'
                    });
                    this.getRoles(1)
                }
                })
            }).catch(() => {
                 
            });
        },
      getRoles (page) {
            this.roleSearchOption.currentPage = page.currentPage || page
            service.post('/isump/role/page/conditions', this.roleSearchOption, { baseURL: this.LOGIN_URL }
        ).then( res => {
                let data = res.data;
                this.roleSearchOption.total = data.total;
                this.roleSearchOption.currentPage = data.current;
                this.roleSearchOption.pageSize = data.size;
                this.rolesData = [...data.records];
            })
        }
  }
}
</script>