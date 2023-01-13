<template>
  <div class="div-root">
    <el-button size="mini" type="text" style="margin: 0 5px;" @click="init">分配权限</el-button>
    <el-dialog title="权限编辑" :visible.sync="digMenuVisible">
      <div class="div-tree" v-loading="treeLoading">
        <el-tree
          :data="menus"
          ref="menuTree"
          show-checkbox
          node-key="resourceId"
          :props="menuProps"
        ></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="digMenuVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleResource">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/utils/request";
export default {
  data() {
    return {
      LOGIN_URL: process.env.VUE_APP_BASE_LOGIN_URL,
      treeLoading: false,
      digMenuVisible: false,
      menus: [],
      menuProps: {
        children: "children",
        label: "resourceName",
      },
      systemArr: [],
    };
  },
  props: ["role"],
  methods: {
    getMenu(sysCode, callback) {
      this.treeLoading = true;
      service
        .post(
          "/isump/resource/list/conditions",
          {
            sysCode: sysCode,
          },
          { baseURL: this.LOGIN_URL }
        )
        .then((res) => {
          let arr = res.data;
          let menus = [];
          let levels = 0;
          for (let ele of arr) {
            if (ele.resourceType == "system" || ele.resourceType == "root") {
              this.systemArr.push(ele.resourceId);
            }
            if (ele.levels == 0) {
              //将第一层放入
              menus.push(ele);
            }
            if (ele.levels > levels) {
              //获取最大层级
              levels = ele.levels;
            }
          }
          for (let i = 1; i <= levels; i++) {
            if (menus.length == 0) {
              for (let ele of arr) {
                if (ele.levels == i) {
                  //确保将第一层数据取出
                  menus.push(ele);
                }
              }
            } else {
              break;
            }
          }
          for (let menu of menus) {
            menu.children = this.getChildren(menu.resourceId, arr);
          }
          this.menus = menus;
          this.treeLoading = false;
          callback && callback();
        });
    },
    getChildren(id, menuList) {
      let arr = [];
      menuList = menuList || [];
      menuList.forEach((item) => {
        let ele = { ...item };
        // console.log(ele.parentId,'...', id, '...', ele.parentId == id)
        if (ele.parentId == id) {
          //if(ele.leaf == "0"){
          //如果为父节点，则获取子节点
          ele.children = this.getChildren(ele.resourceId, menuList);
          //}
          arr.push(ele);
        }
      });

      return arr;
    },
    getPermissions() {
      service
        .post(
          "/isump/role-resource/list/conditions",
          {
            roleId: this.role.roleId,
          },
          { baseURL: this.LOGIN_URL }
        )
        .then((res) => {
          let data = res.data;
          this.$refs.menuTree.setCheckedKeys(
            data.map((e) => {
              var ele = this.$refs.menuTree.getNode(e.resourceId);
              if (ele && ele.childNodes && ele.childNodes.length > 0) {
                return null;
              }
              return e.resourceId;
            })
          );
          // resourceId
        });
    },
    saveRoleResource() {
      let tempArr = this.$refs.menuTree
        .getCheckedKeys()
        .concat(this.$refs.menuTree.getHalfCheckedKeys());
      let arr = [];
      for (let i = 0; i < tempArr.length; i++) {
        let temp = tempArr[i];
        if (this.systemArr.indexOf(temp) > -1) {
        } else {
          arr.push(temp);
        }
      }
      service
        .post(
          "/isump/role-resource/setRoleResources",
          {
            resourceIdList: arr,
            roleId: this.role.roleId,
          },
          { baseURL: this.LOGIN_URL }
        )
        .then((res) => {
          if (res && res.code === "000000") {
            this.$message({
              message: "修改权限成功",
              type: "success",
            });
            this.digMenuVisible = false;
          }
        });
    },
    init() {
      this.digMenuVisible = !this.digMenuVisible;
      this.getMenu(this.role.service, () => {
        this.getPermissions();
      });
    },
  },
  mounted() {
    // this.getAllMenus()
    // console.log('role', this.role)
  },
  created() {},
};
</script>
<style scoped>
.div-root {
  display: inline;
}
.div-tree {
  height: 400px;
  overflow-y: auto;
}
</style>

