<template>
  <div class="bg-white">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <b>合同预警单</b>
      </div>
      <common-title title="基本信息"/>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="创建人">
                <el-input :disabled="true" v-model="ruleForm.createdByName"
                          placeholder="创建人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建部门">
                <el-input :disabled="true" v-model="ruleForm.orgName"
                          placeholder="创建部门"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预警单名称" prop="warningName">
                <el-input  :disabled="['view'].includes($route.query.type)"
                           v-model="ruleForm.warningName"
                          placeholder="预警单名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建日期" prop="period">
                <el-date-picker
                  disabled
                  class="w-100"
                  v-model="ruleForm.period"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="创建日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <common-title title="预警事项" class="mt20 mb20"/>
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label-width="0" prop="warningTxt">
                <el-input v-model="ruleForm.warningTxt"
                          :disabled="['view'].includes($route.query.type)"
                          type="textarea" maxlength="100"
                          :autosize="{ minRows: 5, maxRows: 6}"
                          show-word-limit
                          placeholder="预警事项">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <common-title title="附件" class="mt20 mb20"/>
      <common-upload
        v-on:get-file-list="getFileList"
        :show-attached-list="showAttachedList"
        title="附件"
      />
      <common-footer
        :isShow="false"
        :isGoShow="true"
        :handleNextStep="handleSubmit"
        :handleRefuse="handleRefuse"
        butTitle="提交"
        butTitle1="关闭"
      />
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import CommonUpload from "@/components/CommonUpload";
import {mapState} from "vuex"
import {warningAdd,getDetail} from '@/service/assistant';
import {getNowTime} from "@/utils/tools";

export default {
  components: {
    CommonUpload,
  },
  data() {
    return {
      showAttachedList:[],
      ecmBusinessAttamentList:[],
      ruleForm: {
        createdByName: '', // 经办方
        orgName: '', // 主办部门
        period: '', // 创建时间
        warningTxt: '', // 预警事项
      },
      rules: {
        warningName: [
          {required: true, message: '请输入预警单名称', trigger: 'blur'}
        ],
        warningTxt: [
          {required: true, message: '请输入预警事项', trigger: 'blur'}
        ],
      },
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    const {type} = this.$route.query
    if(type==='add'){
      this.ruleForm = {
        ...this.ruleForm,
        createdByName: this.userInfo.userName,
        orgName: this.userInfo.orgName,
        period:getNowTime()
      }
    } else {
      this.getDetail()
    }
  },

  methods: {
    /**
     * 详情接口
     */
    async getDetail() {
      const {id} = this.$route.query
      const {code, data} = await getDetail(id)
      if (code === '000000') {
        this.$nextTick(() => {
          this.showAttachedList = data.ecmBusinessAttamentList||[]
          this.ecmBusinessAttamentList = data.ecmBusinessAttamentList||[]
          this.ruleForm={
            ...this.ruleForm,
            ...data
          }
        })
      }
    },
    /**
     * 获取上传信息
     */
    getFileList(list) {
      list.forEach((item => {
        item.businessType = 5
      }))
      this.ecmBusinessAttamentList = list;
    },
    /**
     * 获取参数
     */
    getParams(val) {
      const {id} = this.$route.query;
      return {
        ...this.ruleForm,
        ecmBusinessAttamentList:this.ecmBusinessAttamentList
      }
    },
    /**
     *  保存
     */
    async handleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if(valid){
          this.postAdd(this.getParams());
        }
      })
    },
    /**
     * 关闭
     */
    handleRefuse() {
      this.$router.push({name:'toolwarning'})
    },
    /**
     * 保存接口
     */
    async postAdd(params) {
      const { code, mesg} = await warningAdd(params);
      if (code === '000000') {
        this.$message({
          type: 'success',
          message: mesg
        });
        this.$router.push({name: "toolwarning"})
      }
    },
    /**
     * 取消
     */
    handleGoBack() {
      this.$refs.ruleForm.resetFields();
    },
  }
}
;
</script>

<style lang="less" scoped>

</style>
