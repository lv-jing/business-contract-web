<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"
           class="demo-ruleForm">
    <el-form-item label="" prop="userName">
      <el-input type="text" v-model="ruleForm.userName" :placeholder="$t('user.username')" prefix-icon="el-icon-user"
                autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input type="password" v-model="ruleForm.password" :placeholder="$t('user.password')"
                prefix-icon="el-icon-lock" autocomplete="off"
                @keyup.enter.native="submitForm('ruleForm')"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
    export default {
        data() {
            return {
                ruleForm: {
                    userName: '',
                    password: '',
                },
                rules: {
                    userName: [
                        {required: true, message: this.$t('user.username')}
                    ],
                    password: [
                        {required: true, message: this.$t('user.password')}
                    ]
                },
            }
        }
    }
</script>

<style scoped>

</style>
