<template>
  <div class="div-root">
    <el-row>
      <el-col :span="12">
        <div style="margin-bottom: 5px;">
          <span>&nbsp;&nbsp;副账号列表</span>
        </div>
        <div class="div-deacc">
          <table class="table-deacc">
            <thead>
              <tr class="tr-deacc thead">
                <th width="25%">副账号名称</th>
                <th width="10%">组织编码</th>
                <th width="25%">组织名称</th>
                <th width="10%">主要分配</th>
                <th width="20%">职务</th>
                <th width="10%">状态</th>
              </tr>
            </thead>
            <tbody class="tbody-deacc">
              <tr
                v-for="(item, index) in deputyAccs"
                @click="searchRoles(item, index)"
                :index="index"
                class="tr-deacc tbody"
                :class="{'active': selIndex == index}"
              >
                <td>
                  <span>{{item.deputyAccountName }}</span>
                </td>
                <td>{{item.orgCode }}</td>
                <td>{{item.orgName }}</td>
                <td>{{item.isPrimary == 'Y' ? '是' : '否'}}</td>
                <td>{{item.jobName }}</td>
                <td>
                  <span>{{item.statusCode == '0' ? '有效' : '失效' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="margin-bottom: 5px;">
          <span>&nbsp;&nbsp;角色列表</span>
          <el-button
            size="mini"
            type="primary"
            style="margin-left: 5px;"
            icon="el-icon-plus"
            @click="addRole"
          >新增</el-button>
        </div>
        <div class="div-deacc">
          <table class="table-deacc">
            <thead>
              <tr class="tr-deacc thead">
                <th>角色编码</th>
                <th>角色名称</th>
                <th>角色类型</th>
                
                <th class="th-last-edit">编辑</th>
              </tr>
            </thead>
            <tbody class="tbody-deacc">
              <tr v-for="(item, index) in deputyAccsRoles" :index="index" class="tr-deacc">
                <td>{{item.roleCode }}</td>
                <td>{{item.roleName }}</td>
                <td>{{item.roleType }}</td>
                
                <td class="td-last-edit">
                  <span
                    style="color:#f56c6c;cursor:pointer;margin-left:4px;"
                    @click="delDeputyRole(item)"
                  >删除</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="编辑角色" width="50%" :visible.sync="dlgRoleVisible" append-to-body>
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
        <el-button type="primary" @click="addDeputyRole">确 定</el-button>
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
      dlgDeputyVisible: false,
      dlgRoleVisible: false,
      selIndex: null,
      deputyAccs: [],
      deputyAccsRoles: [],
      loading: false,
      allRoles: [],
      allOrgCodes: [],
      selRole: null,
      deputyAccount: {
        state: "1",
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
        name: null,
        type: "function",
      },
      rolesData: [],
      editFlag: false,
      systems: [],
      currentDeputyAccount: this.deputyAccountId,
      currentEmpNo: this.empNo,
      operationUser: "",
      recordData: [],
      searchRecordData: {},
      showRecordFlag: false,
      pager: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
    };
  },
  props: {
    userId: "",
  },

  methods: {
    getData(page, callback) {
      let params = {
        ...this.pager,
        userId: this.userId,
      };
      this.loading = true;
      params.currentPage = page || params.currentPage;
      this.deputyAccs = [];
      this.deputyAccsRoles = [];
      this.selIndex = null;
      service
        .post("/isump/deputy-account/list/conditions", params, {
          baseURL: this.LOGIN_URL,
        })
        .then((res) => {
          this.loading = false;
          this.deputyAccs = res.data;
          this.selRole = null;
          callback && callback();
        });
    },
    searchRoles(node, index) {
      // if(this.selIndex === index) return
      this.selIndex = index;
      this.selRole = node;
      this.deputyAccsRoles = [];
      service
        .post(
          "/isump/deputy-account-role/list/conditions",
          {
            deputyAccountId: node.deputyAccountId,
          },
          { baseURL: this.LOGIN_URL }
        )
        .then((res) => {
          this.deputyAccsRoles = [...res.data];
        });
    },
    addDeputyRole() {
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
                deputyAccountId: this.selRole.deputyAccountId,
                roleId: role.roleId,
              },
              { baseURL: this.LOGIN_URL }
            )
            .then((res) => {
              if (res) resolve(res);
            });
        });

        promises.push(promise);
      }

      Promise.all(promises).then(() => {
        this.$message({
          message: "添加角色成功",
          type: "success",
        });
        // this.deputyAccount = {} // 重置
        this.dlgRoleVisible = false;
        this.searchRoles(this.selRole, this.selIndex);
      });
    },
    delDeputyRole(item) {
      this.$confirm("此操作将永久删除该副账号角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          service
            .delete(`/isump/deputy-account-role/${item.deputyAccountRoleId}`, {
              baseURL: this.LOGIN_URL,
            })
            .then((res) => {
              if (res) {
                this.$message({
                  message: "删除副账号角色成功",
                  type: "success",
                });
                this.searchRoles(this.selRole, this.selIndex);
              }
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addRole() {
      // 首先选中角色
      if (!this.selRole)
        return this.$message({
          message: "请选择副账号",
          type: "error",
        });
      this.dlgRoleVisible = true;
      this.roleSearchOption = {
        service: null,
        name: null,
        type: "function",
      };
      this.rolesData = [];
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
    changeOrg(item) {
      console.log(item, "item");
      this.deputyAccount.org = { id: item.id, orgCode: item.code };
      this.deputyAccount.name = item.name;
      this.deputyAccount.orgName = item.name;
    },
    pageHandel(page) {
      let params = {
        ...this.pager,
        ...this.searchRecordData,
      };
      this.loading = true;
      params.currentPage = page || params.currentPage;

      service.post(
        "/isump/deputy-account-recode/page/conditions",
        params,
        (res) => {
          this.loading = false;
          this.pager.total = res.total;
          this.pager.currentPage = res.current;
          this.pager.pageSize = res.size;
          this.recordData = [...res.records];
        }
      );
    },
  },
  mounted() {
    this.getData();
    
    //this.getRoles()
    // this.getDirtByParentCode("system_type", (data) => {
    //   this.systems = data;
    // });
  },
};
</script>
<style scoped>
.div-root {
  height: 450px;
}
.div-deacc {
  min-height: 400px;
  max-height: 430px;
  /* padding: 10px 5px; */
  margin-right: 10px;
  box-shadow: inset 0 0 3px 1px #b9b7b7;
  overflow: auto;
}
.table-deacc {
  width: 100%;
  height: 100%;
}
.tbody-deacc {
  height: 100%;
}
.tr-deacc {
  padding: 2px;
  padding-bottom: 4px;
  margin: 5px 0;
  /* display: flex;
    flex-direction: row;
    align-items: center; */
  border-bottom: 1px solid #80808047;
}
.tr-deacc.thead {
  font-size: 16px;
}
.tr-deacc > th,
td {
  /* border: 1px solid red; */
  text-align: center;
  /* flex: 1; */
}
/* .th-last-edit, .td-last-edit {
    flex: 2 !important;
} */
.tr-deacc.tbody:hover {
  background: #efefef;
}
.tr-deacc.tbody.active {
  background: #63b4ff !important;
  color: white;
}
.span-edit-role {
  margin-right: 10px;
}
.input-edit-role {
  margin-right: 15px;
}
</style>
