<template>
  <div class="bg-white">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <b>归档信息</b>
      </div>
      <common-title title="基本信息"/>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="合同编号" prop="contractNo">
                <el-input disabled v-model="ruleForm.contractNo"
                          placeholder="合同编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同名称" prop="contractName">
                <el-input disabled v-model="ruleForm.contractName"
                          placeholder="合同名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="归档人" prop="archivePersonName">
                <el-input disabled v-model="ruleForm.archivePersonName"
                          placeholder="归档人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="归档申请日期" prop="archiveApplyTime">
                <el-date-picker
                  disabled
                  class="w-100"
                  v-model="ruleForm.archiveApplyTime"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="归档申请日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="档案存放位置" prop="filePositionDept">
                <el-input v-model="ruleForm.filePositionDept"
                          placeholder="事业部">
                  <template slot="append">事业部</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="" prop="filePositionRegion" label-width="0">
                <el-input v-model="ruleForm.filePositionRegion"
                          placeholder="大区/工厂">
                  <template slot="append">大区/工厂</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="" prop="filePositionFloor" label-width="0">
                <el-input v-model="ruleForm.filePositionFloor"
                          placeholder="楼/库房">
                  <template slot="append">楼/库房</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="" prop="filePositionCabinet" label-width="0">
                <el-input v-model="ruleForm.filePositionCabinet"
                          placeholder="柜号信息">
                  <template slot="append">柜号信息</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="档案管理员" prop="archivistObj">
                <commonItemSelect
                  :disabled="$route.query.type==='edit'"
                  v-model="ruleForm.archivistObj"
                  :value="ruleForm.archivistObj"
                  placeholder="档案管理员"
                ></commonItemSelect>
              </el-form-item>
            </el-col>
          </el-row>
          <common-title title="合同扫描件" class="mt20 mb20"/>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="合同正文扫描件" prop="uploadListOne">
                  <common-upload
                    isPdfShow
                    v-on:get-file-list="getFileListOne"
                    :show-attached-list="showAttachedList"
                    title=""
                    content="合同正文扫描件仅支持上传单个FDF文件，请确保扫描件清晰、顺序正确无缺页。"
                  />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="其他扫描件" prop="uploadListTwo">
                  <common-upload
                    isPdfShow
                    v-on:get-file-list="getFileListTwo"
                    :show-attached-list="showAttachedList1"
                    title=""
                    content="每个合同附件扫描件仅支持上传单个FDF文件，请确保扫描件清晰、顺序正确无缺页。"
                  />
              </el-form-item>
            </el-col>

          </el-row>
        </div>
      </el-form>
      <common-footer
        :isShow="false"
        :isGoShow="true"
        :handleNextStep="handleSubmit"
        :handleRefuse="handleRefuse"
        butTitle="提交"
        butTitle1="关闭"
      />
    </el-card>
    <commonApproval
      :visible="visible"
      :handleCancel="handleCancel"
      :approvalParams="approvalParams"
      @get-approvl-start="getApprovlStart"
    />
  </div>
</template>

<script>
/* eslint-disable */
import CommonUpload from "@/components/CommonUpload";
import {mapState} from "vuex"
import {getAddArchive, getArchiveDetail,archiveEdit} from '@/service/assistant';
import { getNowTime} from "@/utils/tools";
import {getPersonList} from "@/service/4A"

export default {
  components: {
    CommonUpload,
  },
  data() {
    return {
      visible: false,
      approvalParams: {},
      showAttachedList: [],
      showAttachedList1: [],
      ecmBusinessAttamentList: [],
      ruleForm: {
        contractNo: '',// 合同编号
        contractName: '', // 合同名称
        archivePersonName: '', // 归档人
        archivePersonId: '', // 归档人姓名
        archiveApplyTime: '',// 归档申请日期
        filePositionDept: '',//档案存放位置-事业部
        filePositionRegion: '',//档案存放位置-大区
        filePositionFloor: '',//档案存放位置-楼栋
        filePositionCabinet: '',//档案存放位置-柜号
        archivistObj: {},
        archivistName: '',
        archivistId: '',
        uploadListOne: [],
        uploadListTwo: [],
      },
      rules: {
        uploadListOne: [
          {required: true, message: '合同正文扫描件必传', trigger: 'blur'}
        ],
      },
      uploadListOne: [],
      uploadListTwo: []
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
    const {type, contractName, contractNo} = this.$route.query
    if (type === 'add') {
      this.ruleForm = {
        ...this.ruleForm,
        archivePersonName: this.userInfo.userName,
        archivePersonId: this.userInfo.userId,
        archiveApplyTime: getNowTime(),
        contractName,
        contractNo
      }
    } else {
      this.getDetail()
    }
    this.init()
  },

  methods: {
    /**
     * 初始化
     */
    init() {
      const {type} = this.$route.query;
      this.$nextTick(() => {
        this.getPersonList()
      })
    },
    async getPersonList() {
      const {code, data} = await getPersonList({
        roleCodeList: ["contract_file_admin"]
      })
      if (code === '000000') {
        if (data.content && data.content.length > 0) {
          this.ruleForm.archivistObj = {
            userName: data.content[0].userName,
            userId: data.content[0].userId
          }
        }
      }
    },
    /**
     * 详情接口
     */
    async getDetail() {
      const {archivistId} = this.$route.query
      const {code, data} = await getArchiveDetail(archivistId)
      if (code === '000000') {
        this.$nextTick(() => {
          this.showAttachedList = this.setUplod(data.ecmContractInfo.ecmBusinessAttamentList, '3');
          this.showAttachedList1 = this.setUplod(data.ecmContractInfo.ecmBusinessAttamentList, '4');
          this.uploadListOne = this.showAttachedList;
          this.uploadListTwo = this.showAttachedList1;
          this.pinionsList = data.ecmContractInfo.bpmProcessTaskOpinionsVoList || []
          this.ApprovalData = data.ecmContractInfo.bpmProcessTaskVoList || [];
          this.$nextTick(() => {
            this.ecmBusinessAttamentList = data.ecmContractInfo.ecmBusinessAttamentList || []
            this.ruleForm = {
              ...this.ruleForm,
              uploadListOne:this.uploadListOne,
              uploadListTwo:this.uploadListTwo,
              archivistObj: {
                userName: data.archivistName,
                userId: data.archivistId
              },
              ...data
            }
          })
        })
      }
    },
    /**
     * 设置合同分列
     */
    setUplod(val, name) {
      const list = []
      if (val && val.length > 0) {
        val.forEach(item => {
          if (item.businessType === name) {
            list.push({
              ...item
            })
          }
        })
        return list;
      } else {
        return []
      }
    },
    /**
     * 获取上传信息
     */
    getFileListOne(list) {
      list.forEach((item => {
        item.businessType = 3
      }))
      this.ruleForm.uploadListOne = list;
    },
    /**
     * 获取上传信息
     */
    getFileListTwo(list) {
      list.forEach((item => {
        item.businessType = 4
      }))
      this.ruleForm.uploadListTwo = list;
    },
    /**
     * 获取参数
     */
    getParams(val) {
      return {
        ...this.ruleForm,
        contractId: this.$route.query.id,
        archivistName: this.ruleForm.archivistObj.userName,
        archivistId: this.ruleForm.archivistObj.userId,
        ecmBusinessAttamentList: [
          ...this.ruleForm.uploadListOne,
          ...this.ruleForm.uploadListTwo
        ]
      }
    },
    /**
     *  保存
     */
    async handleSubmit() {
      const {id,type} = this.$route.query;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if(type==='add'){
            this.visible = true
            this.approvalParams = {
              objectTypeCode: "CONTRACT_APPROVAL_ARCHIVE",
              orgCode: this.userInfo.orgCode || '',
              businessId: id
            }
          } else {
            this.setEdit()
          }
        }
      })
    },
   async setEdit(){
     const {code, mesg} = await archiveEdit({
       ...this.getParams(),
     });
     if(code==='000000'){
       this.$message.success(mesg)
     }
    },
    /**
     *  保存审批人 跳转
     * @param params
     * @returns {Promise<void>}
     */
    async getApprovlStart(params) {
      const {code, mesg} = await getAddArchive({
        ...this.getParams(),
        ...params
      });
      if (code === '000000') {
        this.$message({
          type: 'success',
          message: mesg
        });
        this.$router.push({name: 'agencymatter'})
      }
    },
    /**
     * 关闭
     */
    handleRefuse() {
      this.$router.push({name: 'contractarchive'})
    },
    /**
     * 弹窗取消
     */
    handleCancel() {
      this.visible = false;
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

.show {
  display: block;
}

.hid {
  display: none;
}

.upload-hover {
  .show-hidden {
    visibility: hidden;
    cursor: pointer;
    font-size: 18px;
  }

  &:hover {
    .show-hidden {
      visibility: visible;
    }
  }
}

.buts {
  width: 100%;
  float: left;
  display: flex;

  a {
    color: #2393F7;
  }
}

.modlue-box {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 20;
}
</style>
