<template>
  <div class="roleUserList">
    <el-row>
      <el-col :span="12">
        <div class="leftPadding">
          <el-form :inline="true" :model="searchData">
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属系统">
                  <el-select v-model="searchData.service" value-key="code" placeholder="请选择">
                    <el-option
                      v-for="item in systems"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色编号">
                  <el-input v-model="searchData.roleCode" placeholder="请输入角色编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色名称">
                  <el-input v-model="searchData.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色类型">
                  <el-select v-model="searchData.roleType" placeholder="请选择">
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
                <el-form-item></el-form-item>
              </el-col>
              <el-col :span="12" :push="4">
                <el-form-item>
                  <el-button type="primary" style="margin-left: 10px;" @click="getData(1)">查询</el-button>
                  <el-button style="margin-left: 10px;" @click="getData(1)">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <hr class="hr" />
          <el-table
            tooltip-effect="light"
            :data="tableData"
            stripe
            border
            :header-cell-style="{ background: '#EBEBEB' }"
            @current-change="row => tableRow = row"
            @row-click="rowHandler"
            highlight-current-row
            v-loading="loading"
            element-loading-text="拼命加载中"
          >
            <el-table-column fixed label="序号" width="60px" align="center">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
              </template>
            </el-table-column>
            
            <el-table-column
              prop="roleCode"
              align="center"
              label="角色编号"
              show-overflow-tooltip
              min-width="10%"
            ></el-table-column>
            <el-table-column
              prop="roleName"
              align="center"
              label="角色名称"
              show-overflow-tooltip
              min-width="20%"
            ></el-table-column>
            <el-table-column
              prop="roleType"
              align="center"
              label="角色类型"
              show-overflow-tooltip
              min-width="10%"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="180px">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="text"
                  @click.prevent.stop="goEdit(scope.row)"
                >新增用户</el-button>
                <el-button
                  size="small"
                  type="text"
                  @click.prevent.stop="goEditOrg(scope.row)"
                >新增组织</el-button>
              </template>
            </el-table-column>
          </el-table>
          <common-pagination v-on:handler-currentPage="getData" :list="pager1"></common-pagination>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="rightPadding">
          <el-tabs type="card" value="first" @tab-click="tabClick">
            <el-tab-pane label="角色分配人员" name="first">
              <el-form :inline="true" :model="searchData2">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="员工编号">
                      <el-input v-model="searchData2.userCode"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                      <el-input v-model="searchData2.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="组织编码">
                      <el-input v-model="searchData2.orgCode"></el-input>
                    </el-form-item>
                    <el-form-item label="组织名称">
                      <el-input v-model="searchData2.orgName"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        style="margin-left: 10px"
                        @click="handlePageChange(1)"
                      >查询</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <hr class="hr" />
              <el-table
                tooltip-effect="light"
                :data="userData"
                stripe
                border
                :header-cell-style="{ background: '#EBEBEB' }"
                highlight-current-row
                v-loading="loading"
                element-loading-text="拼命加载中"
              >
                <el-table-column
                  prop="userCode"
                  align="left"
                  label="员工编号"
                  show-overflow-tooltip
                  min-width="10%"
                ></el-table-column>
                <el-table-column
                  prop="userName"
                  align="left"
                  label="姓名"
                  show-overflow-tooltip
                  min-width="10%"
                ></el-table-column>
                <el-table-column
                  prop="unitName"
                  align="center"
                  label="所属事业部"
                  show-overflow-tooltip
                  min-width="12%"
                ></el-table-column>
                <el-table-column
                  prop="orgCode"
                  align="center"
                  label="组织编码"
                  show-overflow-tooltip
                  min-width="12%"
                ></el-table-column>
                <el-table-column
                  prop="orgName"
                  align="center"
                  label="组织名称"
                  show-overflow-tooltip
                  min-width="20%"
                ></el-table-column>
                <el-table-column
                  prop="statusCode"
                  align="center"
                  label="状态"
                  show-overflow-tooltip
                  min-width="10%"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.statusCode == '0'">生效</span>
                    <span v-else>失效</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                  <template slot-scope="scope">
                    <el-button size="small" icon="el-icon-remove" @click="delUser(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <common-pagination v-on:handler-currentPage="handlePageChange" :list="pager2"></common-pagination>
            </el-tab-pane>
            <el-tab-pane label="角色分配组织" name="help">
              <el-form :inline="true" :model="searchData2">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="组织编码">
                      <el-input v-model="searchData2.orgCode"></el-input>
                    </el-form-item>
                    <el-form-item label="组织名称">
                      <el-input v-model="searchData2.orgName"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        style="margin-left: 10px"
                        @click="handlePageOrg(1)"
                      >查询</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <hr class="hr" />
              <el-table
                tooltip-effect="light"
                :data="orgData"
                stripe
                border
                :header-cell-style="{ background: '#EBEBEB' }"
                highlight-current-row
                v-loading="loading"
                element-loading-text="拼命加载中"
              >
                <el-table-column
                  prop="orgCode"
                  align="left"
                  label="组织编码"
                  show-overflow-tooltip
                  min-width="10%"
                ></el-table-column>
                <el-table-column
                  prop="orgName"
                  align="left"
                  label="组织名称"
                  show-overflow-tooltip
                  min-width="10%"
                ></el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                  <template slot-scope="scope">
                    <el-button size="small" icon="el-icon-remove" @click="delOrg(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <common-pagination v-on:handler-currentPage="handlePageOrg" :list="pager5"></common-pagination>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="新增角色用户" :visible.sync="dlgRoleVisiable" width="50%">
            <div style="margin-bottom: 10px;">
                <el-form :inline="true">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="员工编号">
                                <el-input v-model="roleSearchOption.userCode" placeholder="请输入员工编号"  class="input-edit-role"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                        <el-form-item label="员工姓名">
                        <el-input v-model="roleSearchOption.userName" placeholder="请输入员工姓名"  class="input-edit-role"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="组织名称">
                                <el-input v-model="roleSearchOption.orgName" placeholder="请输入组织名称"  class="input-edit-role"></el-input>
                                
                            </el-form-item>
                        </el-col>
                       <el-col :span="12">
                            <el-form-item>
                                <el-button size="small" type="primary" @click="getSelectUser(1)">查 询</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="div-table-roles">
            <el-table
                tooltip-effect="light"
                :data="selectUserData"
                stripe
                border
                ref="roleTables"
                :header-cell-style="{ background: '#EBEBEB' }"
                highlight-current-row v-loading="loading"
                element-loading-text="拼命加载中">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column prop="userCode" align="left" label="员工编号" show-overflow-tooltip min-width="10%"></el-table-column>
                <el-table-column prop="userName" align="left" label="姓名" show-overflow-tooltip min-width="10%"></el-table-column>
                <el-table-column prop="unitName" align="center" label="事业部"  show-overflow-tooltip min-width="12%"></el-table-column>
                <el-table-column prop="orgCode" align="center" label="组织编码"  show-overflow-tooltip min-width="12%"></el-table-column>
                <el-table-column prop="orgName" align="center" label="组织名称"  show-overflow-tooltip min-width="20%"></el-table-column>
                
            </el-table>
            <common-pagination v-on:handler-currentPage="getSelectUser" :list="pager3"></common-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgRoleVisiable = false">取 消</el-button>
                <el-button type="primary" @click="addRoleUser">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="新增角色组织或单位" :visible.sync="dlgRoleOrgVisiable" width="50%">
            <div class="div-table-roles">
                <el-form :inline="true">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="组织编号">
                                <el-input v-model="roleSearchOption.orgCode" placeholder="请输入组织编号"  class="input-edit-role"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                        <el-form-item label="组织名称">
                            <el-input v-model="roleSearchOption.orgName" placeholder="请输入组织名称"  class="input-edit-role"></el-input>
                        </el-form-item>
                        </el-col>
                       <el-col :span="4">
                            <el-form-item>
                                <el-button size="small" type="primary" @click="getSelectOrg(1)">查 询</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                
                <el-table
                    tooltip-effect="light"
                    :data="selectOrgData"
                    stripe
                    border
                    ref="roleOrgTables"
                    :header-cell-style="{ background: '#EBEBEB' }"
                    highlight-current-row v-loading="loading"
                    element-loading-text="拼命加载中">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column prop="orgCode" align="left" label="组织编号" show-overflow-tooltip min-width="10%"></el-table-column>
                    <el-table-column prop="orgName" align="left" label="组织名称" show-overflow-tooltip min-width="10%"></el-table-column>
                    <el-table-column prop="unitCode" align="center" label="事业部"  show-overflow-tooltip min-width="12%"> 
                    </el-table-column> 
                </el-table>
                <common-pagination v-on:handler-currentPage="getSelectOrg" :list="pager4"></common-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgRoleOrgVisiable = false">取 消</el-button>
                <el-button type="primary" @click="addRoleOrg">确 定</el-button>
            </div>
        </el-dialog>
  </div>
</template>
<script>
import service from "@/utils/request";
export default {
  data() {
    return {
      LOGIN_URL: process.env.VUE_APP_BASE_LOGIN_URL,
      tableData: [], //表格数据
      userData: [],
      orgData: [],
      selectUserData: [],
      selectOrgData: [],
      tableRow: null,
      loading: false,
      searchData: {
        
        service: "contract",
      },
      searchData2: {
        
      },
      pager1: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      pager2: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      pager3: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      pager4: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      pager5: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      roleSearchOption: {
       
      },
      roleTypes: [
        {
          value: "data",
          lable: "data",
        },
        {
          value: "function",
          lable: "function",
        },
        {
          value: "approval",
          lable: "approval",
        },
      ],
      systems: [{name:"合同系统",code:"contract"}],
      tableData: [],
      selectRoleId: "",
      dlgRoleVisiable: false,
      dlgRoleOrgVisiable: false,
      showOrg: true,
      showDept: false,
      depts: [],
    };
  },
  computed: {},
  methods: {
    getData(page) {
      let params = {
        ...this.pager1,
        ...this.searchData,
      };
      this.loading = true;
      params.currentPage = page.currentPage || page;
      service
        .post("/isump/role/page/conditions", params, {
          baseURL: this.LOGIN_URL,
        })
        .then((res) => {
          this.loading = false;
          this.pager1.total = res.data.total;
          this.pager1.currentPage = res.data.current;
          this.pager1.pageSize = res.data.size;
          this.tableData = res.data.records;
        });
    },
    rowHandler(row) {
      this.selectRoleId = row.roleId;
      this.handlePageChange(1);
      this.handlePageOrg(1);
    },
    handlePageChange(page) {
      let param = {
        currentPage: this.pager2.currentPage,
        pageSize: this.pager2.pageSize,
        ... this.searchData2,
        roleId: this.selectRoleId,
      };
      param.currentPage = page.currentPage || page;
      service
        .post("/isump/user/query/user/page", param, { baseURL: this.LOGIN_URL })
        .then((res) => {
          this.pager2.total = res.data.total;
          this.pager2.currentPage = res.data.pageNo;
          this.pager2.pageSize = res.data.pageSize;
          this.userData = [...res.data.content];
      
        });
    },
    handlePageOrg(page) {
      let param = {
        currentPage: this.pager5.currentPage,
        pageSize: this.pager5.pageSize,
        orgCode: this.searchData2.orgCode,
        orgName: this.searchData2.orgName,
        roleId: this.selectRoleId,
      };
  
      param.currentPage = page.currentPage || page;
      service
        .post("/isump/org-role/page/conditions/role", param,{baseURL: this.LOGIN_URL})
        .then( (res) => {
          this.orgData = [];
          this.pager5.total = res.data.total;
          this.pager5.currentPage = res.data.current;
          this.pager5.pageSize = res.data.size;
          this.orgData = [...res.data.records];
        });
    },
    getDirtByParentCode(parentCode, callback) {
      service
        .post(
          "/isump/dict/list/conditions",
          {
            parentCode: parentCode,
          },
          { baseURL: this.LOGIN_URL }
        )
        .then((res) => {
          callback && callback(res);
        });
    },
    goEdit(item) {
      this.dlgRoleVisiable = true;
      this.selectRoleId = item.roleId;
      this.getSelectUser(1);
    },
    goEditOrg(item) {
      this.selectRoleId = item.roleId;
      this.dlgRoleOrgVisiable = true;
      this.getSelectOrg(1);
    },
    delUser(item) {
      this.$confirm("此操作将删除数据，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        service.delete(
          "/isump/deputy-account-role/" + item.deputyAccountRoleId,
          { baseURL: this.LOGIN_URL }).then(
          (res) => {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.handlePageChange(1);
          }
        );
      });
    },
    delOrg(item) {
      this.$confirm("此操作将删除数据，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        service.delete(
          "/isump/org-role/" + item.rogRoleId,
          { baseURL: this.LOGIN_URL }).then(
          (res) => {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.handlePageOrg(1);
          }
        );
      });
    },
    getSelectUser(page) {
      let param = {
        currentPage: this.pager3.currentPage,
        pageSize: this.pager3.pageSize,
        ...this.roleSearchOption,
        orgId: "",
      };
      param.currentPage = page.currentPage || page;
    
      service
        .post("/isump/user/query/user/page", param, { baseURL: this.LOGIN_URL })
        .then((res) => {
          this.pager3.total = res.data.total;
          this.pager3.currentPage = res.data.pageNo;
          this.pager3.pageSize = res.data.pageSize;
          this.selectUserData = [...res.data.content];
        });
    },
    getSelectOrg(page) {
      let param = {
        currentPage: this.pager4.currentPage,
        pageSize: this.pager4.pageSize,
        ...this.roleSearchOption
      };
      param.currentPage = page.currentPage || page;
      service
        .post("/isump/organization/page/conditions", param, {
          baseURL: this.LOGIN_URL,
        })
        .then((res) => {
          this.selectOrgData = [];
          this.pager4.total = res.data.total;
          this.pager4.currentPage = res.data.current;
          this.pager4.pageSize = res.data.size;
          this.selectOrgData = [...res.data.records];
        });
    },
    getDepts() {
      service
        .post(
          "/isump/dept/list/conditions",
          {
            groupType: 0,
          },
          { baseURL: this.LOGIN_URL }
        )
        .then((res) => {
            this.depts = [...res.data];
        });
    },
    addRoleUser() {
      let arr = this.$refs.roleTables.selection;
      if (!arr || arr.length < 1)
        return this.$message({
          message: "请至少选择一条数据",
          type: "warning",
        });
      let promises = [];
      for (let role of arr) {
        let promise = new Promise((resolve, reject) => {
          service
            .post(
              "/isump/deputy-account-role",
              {
                deputyAccountId: role.deputyAccountId,
                roleId: this.selectRoleId,
              },
              { baseURL: this.LOGIN_URL }
            )
            .then((res) => {
              if (res && res.data) resolve(res.data);
            });
        });

        promises.push(promise);
      }

      Promise.all(promises).then(() => {
        this.$message({
          message: "添加角色用户成功",
          type: "success",
        });
        // this.deputyAccount = {} // 重置
        this.dlgRoleVisiable = false;
        this.handlePageChange(1);
      });
    },
    addRoleOrg() {
      let arr = [];
      if (this.showOrg) {
        arr = this.$refs.roleOrgTables.selection;
      } else {
        arr = this.$refs.roleDeptTables.selection;
      }
      if (!arr || arr.length < 1)
        return this.$message({
          message: "请至少选择一条数据",
          type: "warning",
        });
      let promises = [];

      for (let role of arr) {
        let promise = new Promise((resolve, reject) => {
          let param = {};
          param.roleId = this.selectRoleId;
          if (this.showOrg) {
            param.orgId = role.orgId;
          } else {
            param.orgId = role.deptCode;
          }
          service
            .post("/isump/org-role", param, { baseURL: this.LOGIN_URL })
            .then((res) => {
              if (res && res.data) resolve(res.data);
            });
        });
        promises.push(promise);
      }

      Promise.all(promises).then(() => {
        this.$message({
          message: "添加角色组织成功",
          type: "success",
        });
        // this.deputyAccount = {} // 重置
        this.dlgRoleOrgVisiable = false;
        this.handlePageChange(1);
      });
    },
    tabClick(tab) {
      if (tab.name == "first") {
        if (this.userData.length === 0) {
          this.handlePageChange(1);
        }
      } else {
        if (this.orgData.length === 0) {
          this.handlePageOrg(1);
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.roleUserList {
  .leftPadding {
    padding: 24px;
    background: white;
    margin-right: 12px;
  }
  .rightPadding {
    padding: 24px;
    background: white;
    margin-left: 12px;
  }
  .hr {
    margin-bottom: 24px;
    background-color: #dee0e3;
    height: 1px;
    width: 100%;
    border: none;
  }
}
</style>