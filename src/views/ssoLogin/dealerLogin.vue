<template>

    <div style="margin-left:20px">
        {{cooperationInfo.cooperationName}}，您好，欢迎使用合同系统！
    </div>

</template>
<script>
    import service from "@/utils/request"
    
    export default {
        data() {
            return {
                loginSsoForm: {
                    param: '',
                    signature: '',
                    timestamp: '',
                },
                cooperationInfo: {}
            }
        },
         mounted() {
             this.ssoLogin()
         },
         methods: {
             ssoLogin () {
                const LOGIN_URL = process.env.VUE_APP_BASE_LOGIN_URL
                this.loginSsoForm.param = this.$route.query.param
                this.loginSsoForm.signature = this.$route.query.signature
                this.loginSsoForm.timestamp = this.$route.query.timestamp
                this.loginSsoForm.userType = 'DEALER'
                service.post('/isump/sso/other/login', this.loginSsoForm,{baseURL: LOGIN_URL}).then(res=>{
                    if (res.code === '000000') {
                        // 跳转到经销商页面
                        this.cooperationInfo = res.data
                        let userInfo = {userName:res.data.cooperationName, userId: res.data.cooperationId,userType: res.data.cooperationType}
                        localStorage.setItem('userInfo', JSON.stringify(userInfo))
                        this.$Cookie.set("Authorization", res.data.Authorization) 
                        localStorage.setItem('Authorization',res.data.Authorization)
                        this.$Cookie.set("token", "")
                        this.$router.push({path:'/seo'})
                    } else { 
                        this.$message({type:'error',message: res.data})
                    }
                }).catch(err=>{
                    this.$message({type:'error',message:''})
                    // 跳转登录页（?? 云商还是合同）
                })
             }
         }
    }
</script>

<style scoped>

</style>
