<template>
  <div class="addTemplate">
    <div class="bg-white mb24 pd24">
      <div slot="header" class="clearfix flex flex-center-between">
        <b>发起批量合同</b>
        <!--        <el-button @click="handleNextStep" icon="el-icon-document-add">创建批量合同审批单</el-button>-->
      </div>
      <el-form :model="ruleForm" :rules="rules" label-width="120px"
               ref="ruleForm">
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="合同批名称" prop="batchName">
                <el-input v-model="ruleForm.batchName" placeholder="请输入合同批名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同范本" prop="modelNameList">
                <el-select
                  class="w-100"
                  v-model="ruleForm.modelNameList"
                  placeholder="请选择合同范本"
                  @change="workChange"
                  value-key="templateName"
                >
                  <el-option
                    v-for="item in workFlowList"
                    :key="item.templateId"
                    :label="item.templateName"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同类型" prop="contractName">
                <el-input disabled v-model="ruleForm.contractName" placeholder="自动带出"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
        </div>
      </el-form>
      <div>
        <span class="el-icon-tickets"></span>
        <span class="ml10 show-hidden" v-text="'批量合同数据表'"></span>
        <a @click="editUploadClick" href="javascript:;" class="ml20" style="color: #2393F7;">下载</a>
        <span style="font-size: 12px;color: red;margin-left: 10px;">注意：合同起期/合同止期格式应该为：yyyy-mm-dd，例如：2020-12-31</span>
      </div>
      <div class="form-bg">
        <div style="text-align: center;padding: 20px">
          <el-upload
            v-loading="loading"
            class="upload-demo"
            :show-file-list="false"
            action="sasa"
            :http-request="postUpload"
            multiple>
            <img style="width: 44px" src="@/assets/img/up.png" alt="">
            <div class="el-upload__text" style="color: #3C8CFF;">点击上传</div>
            <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
          </el-upload>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {rand} from '@/utils/tools'
import Cookies from "js-cookie";
import store from "@/store";
import axios from "axios";
import md5 from "js-md5";
import {mapState} from "vuex";
import {getFileUrl, getTemplateInfos, getTemplateUrl} from "@/service/template";
import {dictSelectList} from '@/service/common'

export default {
  data() {
    return {
      ruleForm: {
        batchName: '', // 合同批名称
        contractModel: '', // 范本名称
        contractType: '', // 合同类型
        contractName: '', // 合同类型
        modelNameList: '',
        businessId: ''
      },
      excelName: '', // 批量 excel 名称
      excelFileurl: '', // 批量excel url
      fileUrl: '', // fanburl
      fileId: '',
      rules: {
        batchName: [
          {required: true, message: '请输入合同批名称', trigger: 'blur'}
        ],
        modelNameList: [
          {required: true, message: '请选择合同范本', trigger: 'blur'}
        ],
      },
      loading: false,
      workFlowList: [],
      batchId: '',
      dictVoList: [],
      incomeExpeTypeCode: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  mounted() {
    this.getTemplateInfos({
      batchFlag: 1,
      unitId: this.userInfo.unitCode
    })
    this.dictSelectList()
  },
  methods: {
    async dictSelectList() {
      const {code, data} = await dictSelectList({
        dictCode: 'INCOME_EXPE_TYPE'
      })
      if (code === '000000') {
        this.dictVoList = data[0].dictVoList;
      }
    },
    /**
     *  合同范本选择
     */
    async getTemplateInfos(params) {
      const {code, data} = await getTemplateInfos(params)
      if (code === '000000') {
        const arr = [];
        data && data.length && data.map(item => {
          if (item.isHaveExcel === 'true') {
            arr.push(item)
          }
        })
        this.workFlowList = arr || []
      }
    },
    /**
     * 合同范本选择changge
     */
    workChange(val) {
      this.ruleForm = {
        ...this.ruleForm,
        contractType: val.contractType,
        contractName: val.contractTypeName,
        businessId: val.templateId,
        contractModel: val.templateName,
        modelCode: val.templateId
      }
      let dictName = val.contractTypeName.split('-')[0]
      let obj = this.dictVoList.filter(item => item.dictName === dictName);
      if (obj) {
        this.incomeExpeTypeCode = obj[0].dictCode
      }
      this.getFileUrl({
        contractType: val.contractType
      })
      this.getTemplateUrl(val.templateId)
    },
    /**
     * 获取范本url
     */
    async getTemplateUrl(id) {
      const {code, data} = await getTemplateUrl(id);
      if (code === '000000') {
        this.fileUrl = data.fileUrl;
        this.fileName = data.fileName;
      }
    },
    /**
     *  下载
     */
    editUploadClick() {
      this.$refs.ruleForm.validate((valid => {
        if (valid) {
          if (this.excelName && this.excelFileurl) {
            let token = this.$Cookie.get('token')
            window.location.href = encodeURI(process.env.VUE_APP_API_URL + 'contract/ecm-snap-batch-info/downloadTemplateExcel?businessId=' + this.ruleForm.businessId + '&fileName=' + this.excelName + '&fileUrl=' + this.excelFileurl + '&modelName=' + this.ruleForm.contractModel + '&token=' + token)
          } else {
            this.$message.error('此范本下，无可操作批量合同模板！')
          }
        } else {
          this.$message.error('信息未填写完成，无法上传')
        }
      }))

    },
    /**
     *  获取批量模板信息
     */
    async getFileUrl(params) {
      const {code, data} = await getFileUrl(params);
      if (code === '000000') {
        if (data.length > 0) {
          this.excelName = data.length > 0 && data[0].excelName
          this.excelFileurl = data.length > 0 && data[0].excelFileurl
        } else {
          this.excelName = '';
          this.excelFileurl = '';
        }
      }
    },
    /**
     * 上传
     */
    postUpload(params) {
      this.$refs.ruleForm.validate((valid => {
        if (valid) {
          this.uploadSectionFile(params)
        } else {
          this.$message.error('信息未填写完成，无法上传')
        }
      }))
    },
    /**
     * 上传
     */
    async uploadSectionFile(params) {
      this.loading = true;
      let reg = /^.*(\.xhtml|\.xls|\.xlsm|\.xlsx|\.xltx|\.xlsb)$/;
      const isJPG = reg.test(params.file.name.toLowerCase());
      const isLt100M = params.file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error("上传文件格式只能是 excel格式");
        this.loading = false;
        return false;
      }

      if (!isLt100M) {
        this.$message.error("上传文件大小不能超过 5MB!");
        this.loading = false;
        return false;
      }
      const token = Cookies.get('token');
      const userId = store.state.common.userInfo && store.state.common.userInfo.userId;
      const timestamp = new Date().getTime();
      const nonce = rand(1000, 9999);
      const file = params.file;
      const form = new FormData();
      // 文件对象
      form.append("file", file);
      form.append("batchName", this.ruleForm.batchName);
      form.append("contractModel", this.ruleForm.contractModel); // 范本名称
      form.append("contractType", this.ruleForm.contractType);
      form.append("businessId", this.ruleForm.businessId);
      form.append("fileUrl", this.fileUrl);
      form.append("contractName", this.ruleForm.contractName);
      form.append("incomeExpeTypeCode", this.incomeExpeTypeCode);
      form.append("modelCode", this.ruleForm.modelCode); // 范本code
      let url = process.env.VUE_APP_API_URL + 'contract/ecm-snap-batch-info/importData'
      const {data} = await axios.post(url, form, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: Cookies.get('Authorization'),
          token: Cookies.get('token'),
          signature: md5(userId + token + nonce + timestamp + ''),
          nonce: nonce,
          timestamp: timestamp
        }
      }).catch(err => {
        this.loading = false;
      })
      if (data.code === '000000') {
        this.loading = false;
        this.$message.success('上传成功！')
        this.batchId = data.data || ''
        this.$router.push({name: 'singleContracts', query: {type: 'add', id: this.batchId}})
      } else {
        this.$message({
          type: 'error',
          message: data.mesg,
          duration: 10000
        })
        this.loading = false;
      }
    },
  }
}
</script>
<style lang="less">
.addTemplate {
  .detailItem {
    color: #2393F7;
    cursor: pointer;
  }
}
</style>
