<template>
  <div>
    <ul class="header-home">
      <li style="padding: 20px 0;" class="pointer">
        <span class="mr20">{{ userInfo && userInfo.orgName }}</span>
        <el-dropdown @command="handleQuick" style="margin-right: 10px">
          <span class="white pointer">
            <span class="ml5">更多</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="info" style="color: #FFC001;font-weight: 600">快速访问设置</el-dropdown-item>
            <el-dropdown-item command="softWare">插件下载</el-dropdown-item>
            <el-dropdown-item command="operationManual">操作手册下载</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i class="el-icon-switch-button" style="margin-right: 5px;"></i>
        <span @click="handleCommand">退出系统</span>
      </li>
    </ul>
    <div class="header-content">
      <span>快速访问</span>
      <ul class="pointer">
        <li style="display: flex;align-items: center;" v-for="(item,index) in quickList" :key="index" @click="handQuickGoto(item)">
          <img :src="require('@/assets/img/k'+index+'.png')" alt="" style="margin-right: 5px">
          <span>
            {{ item.resourceName }}
          </span>
        </li>
      </ul>
    </div>
    <div class="header-content-right">
      <div class="img-box">
          <img src="@/assets/img/homelogo.png" alt/>
      </div>
      <div class="header-img">
        <p>欢迎您！</p>
        <span>{{ userInfo && userInfo.userName }}</span>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="visible" width="50%">
      <div style="text-align: center">
        <el-transfer v-model="tranValue" style="text-align: left; display: inline-block" :data="tableData" :props="props"></el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import {mapState} from "vuex";
import {getAlluickList, getQuickList, getAddQuickList} from "@/service/home";

export default {
  name: "index",
  computed: {
    ...mapState({
      userInfo: (state) => state.common.userInfo,
    }),
  },
  data() {
    return {
      visible: false,
      quickList: [],
      tableData: [],
      tranValue: [],
      quickListSet: [],
      props: {
        key: "resourceId",
        label: "resourceName",
      },
    };
  },
  watch: {
    userInfo(val) {
      if (val) {
        this.getQuickList();
        this.getAlluickList();
      }
    },
  },
  methods: {
    // 获取设置的快捷方式
    async getQuickList() {
      const {code, data} = await getQuickList();
      if (code === "000000") {
        if (data && data.length > 6) {
          this.quickList = data.slice(0, 7) || [];
        } else {
          this.quickList = data || [];
        }
      }
    },
    // 获取所有快捷方式
    async getAlluickList() {
      const {code, data} = await getAlluickList();
      if (code === "000000") {
        let arr = [];
        data &&
        data.map((item) => {
          if (!item.children) {
            arr.push(item);
          } else {
            item.children.map((items) => {
              arr.push(items);
            });
          }
        });
        this.tableData = arr || [];
      }
    },
    /**
     * 快捷方式跳转
     */
    handQuickGoto(item) {
      this.$router.push({name: item.resourceUrl});
    },
    /**
     * 设置快捷方式
     */
    handleQuick(val) {
      if (val === "info") {
        this.visible = true;
        let arr = [];
        this.quickList.map((item) => {
          arr.push(item.resourceId);
        });
        this.tranValue = arr || [];
      } else if (val === 'softWare') {
        this.downLoadSoftWare()
      } else if(val === 'operationManual'){
        this.downLoadDoc()
      }
    },
    //确定
    handleOk() {
      let arr = [];
      this.tranValue.map((item) => {
        arr.push(
          ...this.tableData.filter((items) => items.resourceId === item)
        );
      });
      this.quickListSet = arr;
      if (this.tranValue.length <= 0) {
        this.$message.error("请选择快捷访问菜单");
      } else {
        if (this.tranValue && this.tranValue.length > 7) {
          this.$message.error("快速访问设置不能超过7个");
        } else {
          this.getAddQuickList();
        }
      }
    },
    // 保存快捷方式
    async getAddQuickList() {
      const {code, data} = await getAddQuickList({
        ecmBusinessQuickFormList: this.quickListSet,
      });
      if (code === "000000") {
        this.quickList = data;
        this.visible = false;
        this.$message.success("设置成功");
      }
    },
    /**
     * 退出
     */
    handleCommand() {
      this.$confirm("您确定要退出系统吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      })
        .then(() => {
          Cookies.remove("token");
          Cookies.remove("Authorization");
          localStorage.removeItem("userInfo");
          this.$store.dispatch("setUserInfo");
          // setTimeout(() => {
          //   this.$store.dispatch("setUserInfo");
          //   this.$router.push({name: "login"})
          // }, 300);
          if(process.env.NODE_ENV ==='production' && this.$route.query.xxx_1!=='1'){
            var userAgent = navigator.userAgent;
            if (userAgent.indexOf("Firefox") !== -1 || userAgent.indexOf("Chrome") !==-1) {
              window.location.href="about:blank";
            } else {
              window.opener = null;
              window.open("", "_self");
              window.close();
            }
          } else {
            setTimeout(() => {
              this.$router.push({name: "login"})
            }, 300);
          }
        })
    },
    downLoadSoftWare() {
      let url = window.location.href;
      if (url.indexOf("localhost:") >= 0) {
        this.$message({
          type: "error",
          message: "本地启动还想下载插件",
        });
      } else {
        let url1 = url.substring(0, url.indexOf("index.html"));
        url1 = url1 + 'KGBSofetWare.zip'
        window.open(url1)
      }
    },
    downLoadDoc(){
      let url = window.location.href;
      if (url.indexOf("localhost:") >= 0) {
        this.$message({
          type: "error",
          message: "本地启动还想下载文档，傻逼",
        });
      } else {
        let url1 = url.substring(0, url.indexOf("index.html"));
        url1 = url1 + 'userManual.zip'
        window.open(url1)
      }
    }
  },
};
</script>

<style scoped lang="less">
.header-home {
  text-align: right;
}

.header-content {
  width: 65%;
  float: left;
  padding-left: 40px;

  ul {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;

    li {
      i {
        margin-right: 10px;
        color: #ffc001;
      }
    }
  }
}

.header-content-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .img-box {
    position: relative;
    width: 75px;
    height: 75px;
    border-radius: 50%;
    background: #414e69;
    font-size: 0;
      img{
        width: 55px;
        height: 55px;
        border-radius: 30%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
  }

  .header-img {
    margin-left: 20px;

    p {
      margin-bottom: 8px;
    }
  }
}
</style>
