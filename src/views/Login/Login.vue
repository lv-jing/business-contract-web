<template>
  <div class="login-page">
    <!-- 登录框 -->
    <div class="login-model">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('loginTitle')" name="first">
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm"
          >
            <el-form-item label prop="userName">
              <el-input
                type="text"
                v-model="ruleForm.userName"
                :placeholder="$t('user.username')"
                prefix-icon="el-icon-user"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label prop="password">
              <el-input
                type="password"
                v-model="ruleForm.password"
                :placeholder="$t('user.password')"
                prefix-icon="el-icon-lock"
                autocomplete="off"
                @keyup.enter.native="submitForm('ruleForm')"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-checkbox v-model="checked" name="checked">{{ $t('user.code') }}</el-checkbox>
        <span class="pas-ri" @click="forgetPassword">{{ $t('user.ForgetPass') }}</span>
        <el-button
          type="primary"
          class="submit-button"
          :loading="loading"
          @click="submitForm('ruleForm')"
        >{{ $t('login') }}</el-button>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { userLogin } from "@/service/4A";
import AccountLogin from "./AccountLogin";
import MobileLogin from "./MobileLogin";

export default {
  components: {
    AccountLogin,
    MobileLogin,
  },
  data() {
    return {
      loading: false,
      activeName: "first",
      checked: false,
      ruleForm: {
        userName: "",
        password: "",
      },
      rules: {
        userName: [{ required: true, message: this.$t("user.username") }],
        password: [{ required: true, message: this.$t("user.password") }],
      },
    };
  },
  beforeCreate() {
    //?xxx_1=1可以显示登陆接口
    if(process.env.NODE_ENV === 'production' && this.$route.query.xxx_1!=='1'){
      const LOGIN_URL = process.env.VUE_APP_BASE_LOGIN_URL + "/isump/sso/login/index"
      const LOGIN_SSO = process.env.VUE_APP_SSO_URL
      window.location.href = LOGIN_SSO + "/oauth2/endpoints/oauthservice/authorize?client_id=ecmClient&redirect_uri="+LOGIN_URL+"&response_type=code&scope=UserProfile.me"
    }
  },
  methods: {
    /**
     *  点击登录
     * @param formName form ref
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.userLogin({ ...this.ruleForm, loginType: "PC" });
        }
      });
    },
    /**
     * 用户登录
     */
    async userLogin(text) {
      const { code, data } = await userLogin(text);
      if (code === "000000") {
        this.loading = false;
        Cookies.set("Authorization", data.Authorization);
        localStorage.setItem("Authorization", data.Authorization);
        Cookies.set("token", data.token);
        setTimeout(() => {
          this.$nextTick(() => {
            this.$router.push({ name: "home" });
          });
        }, 500);
      } else {
        this.loading = false;
      }
    },
    /**
     * 忘记密码
     */
    forgetPassword() {},
  },
};
</script>

<style lang="less">
.login-page {
  height: 100vh;
  background: url("~@/assets/img/login.png") no-repeat;
  background-size: 100% 100%;

  .login-model {
    position: absolute;
    top: 30%;
    right: 20%;
    width: 290px;
    padding: 12px 34px;
    background: #fff;
    border-radius: 10px;
  }

  .submit-button {
    width: 100%;
    margin: 20px 0 30px;
  }

  .pas-ri {
    float: right;
    color: #409eff;
    cursor: pointer;
  }
}
</style>
