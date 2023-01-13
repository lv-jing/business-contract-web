<template>
  <div class>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <span>菜单管理</span>
      </div>

      <el-row class="bg-white">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-tree
              ref="menuTree"
              node-key="resourceId"
              show-checkbox
              :load="loadMenu"
              lazy
              @node-click="treeClick"
              :props="menuProps"
              draggable
              @node-drop="handleDrop"
            >
              <span class="span-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span v-if="data.resourceType != 'root'">
                  <el-button type="text" size="mini" @click.stop="appendMenu(node, data, $event)">新增</el-button>
                  <el-button
                    type="text"
                    size="mini"

                    @click.stop="editMenu(node, data, $event)"
                  >修改</el-button>
                  <el-button
                    type="text"
                    size="mini"

                    @click.stop="removeMenu(node, data, $event)"
                  >删除</el-button>
                </span>
              </span>
            </el-tree>
          </el-col>
          <el-col :span="19">
            <div class="bg-white mb24 pd24">
            <el-form :inline="true" :model="menu" label-width="100px" label-position="left">
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="菜单编码">
                    <el-input v-model="menu.resourceCode" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="菜单名称">
                    <el-input v-model="menu.resourceName" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="菜单类型">
                    <el-input v-model="menu.resourceType" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="菜单图标">
                    <el-input v-model="menu.icon" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="菜单排序">
                    <el-input v-model="menu.resourceSort" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否可用" prop="resourceState">
                    <el-select v-model="menu.resourceState" :disabled="true">
                      <el-option label="生效" value="0" key="0"></el-option>
                      <el-option label="失效" value="1" key="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="菜单地址">
                    <el-input v-model="menu.resourceUri" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="叶子节点">
                    <el-select v-model="menu.leaf" :disabled="true"> placeholder="请选择">
                      <el-option label="是" :value="1"></el-option>
                      <el-option label="否" :value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="备注">
                    <el-input v-model="menu.remark" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            </div>
            <div class="queryForm">
            <el-form :model="searchForm" :inline="true" label-width="100px" label-position="left">
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="角色编号" prop="roleCode">
                    <el-input v-model="searchForm.roleCode" placeholder="请输入用户编号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="searchForm.roleName" placeholder="请输入用户编号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="角色类型" prop="roleType">
                    <el-select v-model="searchForm.roleType" placeholder="请输入选择">
                      <el-option key value label="全部"></el-option>
                      <el-option key="0" value="0" label="有效"></el-option>
                      <el-option key="1" value="1" label="失效"></el-option>
                    </el-select>&nbsp; &nbsp;
                    <el-button
                      type="primary"
                      @click="handlePageChange(1)"
                      icon="iconfont sbt_add"
                    >查询</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            </div>
            <div style="margin-bottom:12px">
            <el-button size="mini" type="primary" @click="addRole">新增角色</el-button>
            <el-button size="mini" @click="delRole">删除角色</el-button>
            </div>
            <el-table :data="tableData"
                      stripe
                      border
                      :header-cell-style="{ background: '#F5F6F7' }"
                      element-loading-text="拼命加载中"
                      ref="roleList"
                      style="width: 99%" :highlight-current-row="true">
              <el-table-column type="index" width="60" label="序号"></el-table-column>
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column
                prop="roleCode"
                align="left"
                label="角色编码"
                show-overflow-tooltip
                min-width="20%"
              ></el-table-column>
              <el-table-column
                prop="roleName"
                align="left"
                label="角色名称"
                show-overflow-tooltip
                min-width="20%"
              ></el-table-column>
              <el-table-column
                prop="roleType"
                align="left"
                label="角色类型"
                show-overflow-tooltip
                min-width="10%"
              ></el-table-column>
              <el-table-column
                prop="service"
                align="left"
                label="所属系统"
                show-overflow-tooltip
                min-width="10%"
              ></el-table-column>
              <el-table-column label="操作" align="left" width="120px">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"

                    @click="goDelete(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlePageChange" :list="pager"></common-pagination>

          </el-col>
        </el-row>
      </el-row>
      <el-dialog
        title="菜单编辑"
        :before-close="()=>{}"
        :show-close="false"
        :visible.sync="dlgAddMenuVisiable"
        width="800px"
      >
        <el-form :model="addMenu" label-width="120px" ref="menuForm" :rules="menuRules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="菜单编码" prop="resourceCode">
                <el-input v-model="addMenu.resourceCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="菜单名称" prop="resourceName">
                <el-input v-model="addMenu.resourceName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="菜单类型" prop="resourceType">
                <el-select v-model="addMenu.resourceType" value-key="code" placeholder="请选择">
                  <el-option
                    v-for="item in menuTypes"
                    :key="item.code"
                    :label="item.label"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="菜单图标地址">
                <el-input v-model="addMenu.icon"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="菜单排序">
                <el-input type="number" v-model="addMenu.resourceSort"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="叶子节点" prop="leaf">
                <el-select v-model="addMenu.leaf" placeholder="请选择">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="菜单地址">
                <el-input v-model="addMenu.resourceUri" style="width: 95%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="层级" prop="levels">
                <el-input v-model="addMenu.levels"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否可用" prop="resourceState">
                <el-select v-model="addMenu.resourceState" placeholder="请选择">
                  <el-option label="生效" value="0" key="0"></el-option>
                  <el-option label="失效" value="1" key="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注">
                <el-input v-model="addMenu.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeAddMenuDlg">取 消</el-button>
          <el-button type="primary" @click="saveMenu">保 存</el-button>
        </div>
      </el-dialog>



      <el-dialog
            title="新增角色"
            width="50%"
            :visible.sync="dlgRoleVisible"
            append-to-body>
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

              </el-form-item>
                </el-col>
          </el-row>
            </el-form>

            <div class="div-table-roles">
              <el-button size="small" type="primary" @click="getRoles(1)">查 询</el-button>
                <el-table
                    :data="rolesData"
                    height="450"
                    ref="roleTables"
                    style="width: 100%">
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
                </el-table>
                 <common-pagination v-on:handler-currentPage="getRoles" :list="roleSearchOption"></common-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoleResource">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import { getResourceTreeList } from "@/service/4A/index";
import service from "@/utils/request";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      LOGIN_URL: process.env.VUE_APP_BASE_LOGIN_URL,
      show: false,
      menuProps: {
        children: "children",
        label: "resourceName",
      },
      menu: {},
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      pager: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      dlgAddMenuVisiable: false,
      appendParent: {},
      addMenu: {},
      menuTypes: [
        {
          name: "menu",
          code: "menu",
          label: "菜单",
        },
        {
          name: "module",
          code: "module",
          label: "模块",
        },
        {
          name: "system",
          code: "system",
          label: "系统标识",
        },
        {
          name: "function",
          code: "function",
          label: "菜单功能",
        },
      ],
      menuRules: {
        resourceType: [
          {
            required: true,
            message: "请选择菜单类型",
            trigger: ["change", "blur"],
          },
        ],
        resourceCode: [
          {
            required: true,
            message: "请输入菜单编号",
            trigger: ["change", "blur"],
          },
        ],
        resourceName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: ["change", "blur"],
          },
        ],
        resourceState: [
          {
            required: true,
            message: "请选择菜单是否可用",
            trigger: ["change", "blur"],
          },
        ],
        leaf: [
          {
            required: true,
            message: "请选择菜单是否为叶子节点",
            trigger: ["change", "blur"],
          },
        ],
      },
      dlgRoleVisible: false,
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
    };
  },
  computed: {
    ...mapGetters(["getAuthObj"]),
  },
  created() {},

  methods: {
    appendMenu(node, data, event) {
      console.log(data);
      if (data.leaf === 1)
        return this.$message({
          message: "不能给叶子节点新增子节点",
          type: "warning",
        });
      this.appendParent = {
        node: Object.assign(node),
        data: Object.assign(data),
      };
      this.addMenu = {};
      this.dlgAddMenuVisiable = true;

      if (event) event.preventDefault();
    },
    editMenu(node, data, $event) {
      this.appendParent = {
        node: Object.assign(node),
        data: Object.assign(data),
      };
      this.addMenu = Object.assign(data);
      this.dlgAddMenuVisiable = true;
    },
    closeAddMenuDlg() {
      this.dlgAddMenuVisiable = false;
      this.appendParent = {};
      this.addMenu = {};
    },
    removeMenu(node, data, event) {
      if (event) event.preventDefault();
      if (data.children && data.children.length > 0)
        return this.$message({
          message: "该节点含有子节点, 不能删除",
          type: "error",
        });
      this.$confirm("此操作将永久删除该节点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "稍等，我再想想！",
        type: "warning",
      })
        .then(() => {
          service
            .delete(
              `/isump/resource/${data.resourceId}`,
              { baseURL: this.LOGIN_URL }
            )
            .then((res) => {
              if(res.code === '000000'){
              this.$message({
                message: "删除节点成功",
                type: "success",
              });
              this.refreshMenu(data.parentId);
              }
              // this.getMenu (this.service)
            });
        })
        .catch(() => {});
    },
    saveMenu() {
      this.$refs.menuForm.validate((validate) => {
        if (!validate) return;
        let param = this.addMenu;
        if (this.addMenu.resourceId) {
          //修改
          // 如果含有子节点则不可修改为叶子节点
          console.log(this.appendParent.data)
          if (
            this.appendParent.data.children &&
            this.appendParent.data.children.length > 0
          ) {
            if (this.addMenu.leaf === 1) {
              return this.$message({
                message: "该节点含有子节点，不可修改为叶子节点",
                type: "error",
              });
            }
          }
          service
            .patch(`/isump/resource/${param.resourceId}`, param, {
              baseURL: this.LOGIN_URL,
            })
            .then((res) => {
              if(res.code === '000000'){
              this.$message({
                message: "修改节点成功",
                type: "success",
              });
              this.dlgAddMenuVisiable = false;

              this.refreshMenu(this.appendParent.node.parent.data.resourceId);
              this.appendParent = {};
              }
            });
        } else {
          // 新增
          param.parentId = this.appendParent.data.resourceId;
          param.levels = parseInt(this.appendParent.node.level) + 1;
          param.sysCode = this.appendParent.data.sysCode;
          service
            .post("/isump/resource", param, { baseURL: this.LOGIN_URL })
            .then((res) => {
               if(res.code === '000000'){
                this.$message({
                  message: "新增节点成功",
                  type: "success",
                });
                this.dlgAddMenuVisiable = false;
                this.refreshMenu(this.appendParent.data.resourceId);
                this.appendParent = {};
              }
            });
        }
      });
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      let menu = { ...draggingNode.data };
      let endParentMenu = { ...dropNode.data };
      if(dropType === 'before'){
        menu.parentId = endParentMenu.parentId;
        menu.levels = parseInt(endParentMenu.levels)
      }else{
        menu.parentId = endParentMenu.resourceId;
        menu.levels = parseInt(endParentMenu.levels) + 1;
      }
      
      service.patch(`/isump/resource/${menu.resourceId}`, menu, {
        baseURL: this.LOGIN_URL,
      }).then((res) => {
        if(res.code === '000000')
        this.$message({
          message: "修改节点成功",
          type: "success",
        });
      });
    },
    treeClick(obj, node, self) {
      this.tableData = [];
      this.menu = obj;
      service
        .post(
          "/isump/role-resource/query/conditions",
          {
            resourceId: obj.resourceId,
            currentPage: 1,
            pageSize: 20,
          },
          { baseURL: this.LOGIN_URL }
        )
        .then((res) => {
          let data = res.data;
          this.pager.total = data.total;
          this.pager.currentPage = data.current;
          this.pager.pageSize = data.size;
          this.tableData = [...data.records];
        });
    },
    handlePageChange(page) {
      this.tableData = [];
      service.post(
        "/isump/role-resource/query/conditions",
        {
          resourceId: this.menu.resourceId,
          currentPage: page.currentPage || page,
          pageSize: this.pager.pageSize,
          ...this.searchForm
        },
          { baseURL: this.LOGIN_URL }
        ).then((res) => {
          let data = res.data;
          this.pager.total = data.total;
          this.pager.currentPage = data.current;
          this.pager.pageSize = data.size;
          this.tableData = [...data.records];
        }
      );
    },
    loadMenu(node, resolve) {
      let params = {};
      if (node.level === 0) {
        params = {
          resourceType: "root",
        };
      } else {
        params = {
          parentId: node.data.resourceId,
        };
      }
      this.getTreeList(params, (res) => {
        resolve(res);
      });
    },
    refreshMenu(parentId) {
      this.getTreeList(
        {
          parentId: parentId,
        },
        (res) => {
          this.$refs.menuTree.updateKeyChildren(parentId, res);
        }
      );
    },
    async getTreeList(params, callback) {
      const { code, data } = await getResourceTreeList(params);
      if (code && code === "000000") {
        callback(data);
      }
    },
    addRole(row){
            if(!this.menu.resourceId){
                this.$message({
                    message: '请选择菜单后再操作',
                    type: 'warning'
                });
                return;
            }
            this.dlgRoleVisible = true;
            this.roleSearchOption.service = this.menu.sysCode
            this.roleSearchOption.resourceId = this.menu.resourceId;
            this.getRoles(1)
        },
        delRole(){
            let arr = this.$refs.roleList.selection
            if(!arr || arr.length < 1)
                return this.$message({
                    message: '请至少选择一条数据',
                    type: 'warning'
                })
            let promises = []
            for(let role of arr) {
                let promise = new Promise((resolve, reject) => {
                    service.delete(`/isump/role-resource/${role.roleResourceId}`, {baseURL: this.LOGIN_URL
                    }).then( res => {
                        if(res.code === '000000') resolve(res.data)
                    })
                });

                promises.push(promise)
            }

            Promise.all(promises).then(() => {
                this.$message({
                    message: '删除角色成功',
                    type: 'success'
                })
                this.handlePageChange(1);
            })
        },
        goDelete(row){
            this.$confirm('此操作将永久删除菜单分配的角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                service.delete(`/isump/role-resource/${row.roleResourceId}`, {baseURL: this.LOGIN_URL}).then( res => {
                   if(res.code === '000000') {
                        this.$message({
                            message: '删除菜单分配角色成功',
                            type: 'success'
                        });
                    }
                    this.handlePageChange(1);
                });
            }).catch(err => {
                console.log(err)
            })
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
        },
        addRoleResource () {
            let arr = this.$refs.roleTables.selection
            if(!arr || arr.length < 1)
                return this.$message({
                    message: '请至少选择一条数据',
                    type: 'warning'
                })
            let promises = []
            for(let role of arr) {
                let promise = new Promise((resolve, reject) => {
                    service.post('/isump/role-resource', {
                        resourceId: this.roleSearchOption.resourceId,
                        roleId: role.roleId
                    },{ baseURL: this.LOGIN_URL }).then( res => {
                        if(res.code === '000000') resolve(res.data)
                    })
                });

                promises.push(promise)
            }

            Promise.all(promises).then(() => {
                this.$message({
                    message: '添加角色成功',
                    type: 'success'
                })
                this.dlgRoleVisible = false

                this.handlePageChange(1);
            })
        }
  },
};
</script>

<style scoped>
.div-left {
  box-shadow: inset 0 0 3px 1px #80808075;
  margin: 2px;
  padding: 10px;
}
.div-tree {
  height: 600px;
  overflow-y: auto;
}
.span-tree-node {
  font-size: 14px;
  display: -ms-flexbox;
  display: flex;
  flex-direction: row;
  -ms-flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
.queryForm{
  padding-left: 24px;
}
</style>
