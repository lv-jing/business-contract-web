<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"
           class="demo-ruleForm">
    <el-form-item label="" prop="tel">
      <el-input type="text" @input="checkTel" maxlength="11" v-model="ruleForm.tel"
                :placeholder="$t('phoneUser.phone')"
                prefix-icon="el-icon-user"
                autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="" prop="code">
      <el-input v-model="ruleForm.code" :placeholder="$t('phoneUser.code')" class="code-inp"
                prefix-icon="el-icon-lock" autocomplete="off" maxlength="6"
                @keyup.enter.native="submitForm('ruleForm')"></el-input>
      <el-button type="primary" @click="sendCode" class="checkCode" :disabled="Boolean(num) || !exp">
        <span v-if="num">{{ num }}</span>
        <span v-else>{{$t('phoneUser.sedCode')}}</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
    export default {
        name: "MobileLogin",
        data(){
            return{
                activeName: 'first',
                num: 0,
                exp: false,
                ruleForm: {
                    tel: '',
                    code: ''
                },
                rules: {
                    tel: [
                        {required: true, message: this.$t('phoneUser.phone')}
                    ],
                    code: [
                        {required: true, message: this.$t('phoneUser.code')}
                    ]
                },
            }
        },
        methods:{
            /**
             * 手机验证格式
             */
            checkTel() {
                this.exp = /^1[345789]\d{9}$/.test(this.ruleForm.tel)
            },
            /**
             * 获取验证码
             */
            sendCode() {
                this.num = 120
                const timeId = setInterval(() => {
                    if (this.num > 0) {
                        this.num--
                    } else {
                        clearInterval(timeId)
                    }
                }, 1000)
            },
        }
    }
</script>

<style scoped>
  .code-inp {
    width: 65%;
  }
  .checkCode{
    width: 30%;
    float: right;
  }
</style>
