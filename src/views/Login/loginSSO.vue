<template>
    <div v-loading="loading" style="height:100vh"></div>
</template>

<script>
import Cookies from 'js-cookie';
import {userLoginSSO} from "@/service/4A";
 import service from "@/utils/request"
export default {
    components: {

    },
    data() {
        return {
            loading: true
        }
    },
     mounted() {
       this.userLogin()
    },
    methods: {
        /**
         * 用户登录
         */
        async userLogin() {
            Cookies.remove("token");
            Cookies.remove("userInfo");
            let text = this.$route.query.code
            if(text){
                let params = {code: text}
                const {code, data} = await userLoginSSO(params)
                if (code === '000000') {
                    this.loading = false;
                    Cookies.set("Authorization", data.Authorization);
                    localStorage.setItem('Authorization',data.Authorization)
                    Cookies.set("token", data.token);
                    setTimeout(() => {
                        this.$nextTick(() => {
                            this.$router.push({name: 'home'})
                        });
                    }, 500);
                } else {
                    // 提示登录失败，跳回单点登录页面
                    this.$message({
                        type:"error",
                        message:"登录失败"
                    })
                    this.loading = false;
                    this.gotoSSOPage();
                }
            }else{
                const LOGIN_URL = process.env.VUE_APP_BASE_LOGIN_URL
                service.post('/isump/sso/login/page', {param: this.$route.query.param},{baseURL: LOGIN_URL}).then(res=>{
                    if (res.code === '000000') {
                        this.loading = false;
                        Cookies.set("Authorization", res.data.Authorization);
                        localStorage.setItem('Authorization',res.data.Authorization)
                        Cookies.set("token", res.data.token);
                        setTimeout(() => {
                            // 跳转到 待办已办的空白页
                            this.$nextTick(() => {
                                this.$router.push(
                                    {
                                        name: 'distribute',
                                        query:{
                                            id: res.data.workflowHistoryId
                                        }
                                    }
                                )
                            });
                        }, 500);
                    } else { 
                        this.$message({type:'error',message: res.data})
                        this.gotoSSOPage();
                    }
                }).catch(err=>{
                    this.$message({type:'error',message:'登录失败'})
                    // 跳转登录页（?? 云商还是合同）
                    this.gotoSSOPage();
                })
            } 
        },
        gotoSSOPage(){
            // const LOGIN_URL = process.env.VUE_APP_BASE_LOGIN_URL + "/isump/sso/login/index"
            // const LOGIN_SSO = process.env.VUE_APP_SSO_URL
            // window.location.href = LOGIN_SSO + "/oauth2/endpoints/oauthservice/authorize?client_id=ecmClient&redirect_uri="+LOGIN_URL+"&response_type=code&scope=UserProfile.me"
            setTimeout(() => {
                // 跳转到 错误页面
                this.$nextTick(() => {
                    this.$router.push(
                        {
                            path: 'error',
                        }
                    )
                });
            }, 500);
        }

    }
}
</script>

<style lang="less">
.login-page {
    height: 100%;
    background: url("~@/assets/img/login.png") no-repeat;
    background-size: 100% 100%;
}

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
    color: #409EFF;
    cursor: pointer;
}
</style>
