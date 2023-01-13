<template>
  <ul class="flex flex-center-between">
    <li class="flex flex-center">
      <span class="mr20">{{ userInfo && userInfo.orgName }}</span>
      <el-dropdown @command="handleCommand">
              <span class="white pointer">
                <span class="ml5">{{ userInfo && userInfo.userName }}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-user" command="info">退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </li>
  </ul>
</template>

<script>
import Cookies from "js-cookie"
import {mapState} from "vuex"

export default {
  name: "index",
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  methods: {
    /**
     * 退出
     */
    handleCommand() {
      this.$confirm("您确定要退出系统吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          Cookies.remove("token");
          Cookies.remove("Authorization");
          localStorage.removeItem('userInfo')
          this.$store.dispatch("setUserInfo");
          // setTimeout(() => {
          //   this.$store.dispatch("setUserInfo");
          //   this.$router.push({name: "login"})
          // }, 300);
          if (process.env.NODE_ENV === 'production' && this.$route.query.xxx_1 !== '1') {
            var userAgent = navigator.userAgent;
            if (userAgent.indexOf("Firefox") !== -1 || userAgent.indexOf("Chrome") !== -1) {
              window.location.href = "about:blank";
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
  }
}
</script>

<style scoped>

</style>
