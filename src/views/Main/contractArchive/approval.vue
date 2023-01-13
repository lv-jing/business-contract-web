<template>
  <div class="bg-white">
    <el-row :gutter="24">
      <el-col :span="19">
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
                    <el-input disabled v-model="ruleForm.contractNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合同名称" prop="contractName">
                    <el-input disabled v-model="ruleForm.contractName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="归档人" prop="archivePersonName">
                    <el-input disabled v-model="ruleForm.archivePersonName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="归档申请日期" prop="archiveApplyTime">
                    <el-date-picker
                      disabled
                      class="w-100"
                      v-model="ruleForm.archiveApplyTime"
                      type="date"
                      value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="档案存放位置" prop="filePositionDept">
                    <el-input disabled v-model="ruleForm.filePositionDept">
                      <template slot="append">事业部</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="" prop="filePositionRegion" label-width="0">
                    <el-input disabled v-model="ruleForm.filePositionRegion">
                      <template slot="append">大区/工厂</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="" prop="filePositionFloor" label-width="0">
                    <el-input disabled v-model="ruleForm.filePositionFloor">
                      <template slot="append">楼/库房</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="" prop="filePositionCabinet" label-width="0">
                    <el-input disabled v-model="ruleForm.filePositionCabinet">
                      <template slot="append">柜号信息</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="档案管理员" prop="archivistObj">
                    <commonItemSelect
                      :disabled="true"
                      v-model="ruleForm.archivistObj"
                      :value="ruleForm.archivistObj"
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
          <common-tableappoval
            :ApprovalData="ApprovalData"
            :pinionsList="pinionsList"
          />
        </el-card>

      </el-col>
      <el-col :span="5">
        <common-mode
          v-on:getApprovalParams="getApprovalParams"
          :noShowOption="noShowOption"
        />
      </el-col>
    </el-row>
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
import {getAddArchive} from '@/service/assistant';
import {getAuditApprove, getDetail, deleteProcess} from "@/service/work";

export default {
  components: {
    CommonUpload,
  },
  data() {
    return {
      noShowOption: {
        isPass: true, // 通过
        isReject: true, // 退回
        isShowConsult: false, //意见征询按钮
        isShowNoSuitApproval: false, // 是否非适格审批按钮
        isChooseNode: false, // 是否选择节点
      },
      ApprovalData: [],
      pinionsList: [],
      visible: false,
      approvalParams: {},
      showAttachedList: [],
      showAttachedList1: [],
      ecmBusinessAttamentList: [],
      ruleForm: {
        contractId: '',
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
      uploadListTwo: [],
      approvalObj: {}
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  mounted() {
    this.getDetail()
  },

  methods: {
    /**
     *  审批流程通过按钮获取
     */
    getApprovalParams(obj) {
      const {taskKey, operationType, sourceType} = this.$route.query
      this.approvalObj = {};
      this.loading = true;
      if (taskKey === 'start' && operationType !== 'CONSULT' && sourceType !== 'INAPPROPRIATEPROCESS') {
        this.approvalParams = {
          objectTypeCode: "CONTRACT_APPROVAL_ARCHIVE",
          orgCode: this.userInfo.orgCode || '',
          businessId: this.ruleForm.contractId
        }
        this.visible = true;
        this.approvalObj = obj;
      } else if (obj.type === 'adopt') { // 通过 提交
        this.getAuditApprove(obj)
      } else if (obj.type === 'return') { // 退回
        this.rejectProcess(obj)
      }
    },
    /**
     *  同意审批
     * @returns {Promise<void>}
     */
    async getAuditApprove(obj) {
      const {code} = await getAuditApprove({
        id: this.$route.query.id,
        bpmProcessTaskOpinionsFormList: obj.list,
        sysProcessLinkHeadVo: obj.sysProcessLinkHead || {}
      }, err => {
        this.loading = false
      })
      if (code === '000000') {
        this.loading = false
        this.$router.push({name: 'agencymatter'})
      } else {
        this.loading = false
      }
    },
    /**
     * 退回流程
     * @returns {Promise<void>}
     */
    async rejectProcess(obj) {
      const {code} = await deleteProcess({
        id: this.$route.query.id
      })
      if (code === '000000') {
        this.$router.push({name: 'agencymatter'})
      }
      this.loading = false;
    },
    /**
     * 详情接口
     */
    async getDetail() {
      const {id} = this.$route.query
      const {code, data} = await getDetail({id})
      if (code === '000000') {
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
            archivistObj: {
              userName: data.archivistName,
              userId: data.archivistId
            },
            ...data
          }
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
      const {id} = this.$route.query
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.visible = true
          this.approvalParams = {
            objectTypeCode: "CONTRACT_APPROVAL_ARCHIVE",
            orgCode: this.userInfo.orgCode || '',
            businessId: this.ruleForm.contractId
          }
        }
      })
    },
    /**
     *  保存审批人 跳转
     * @param params
     * @returns {Promise<void>}
     */
    getApprovlStart(params) {
      this.getAuditApprove({
        ...this.approvalObj,
        ...params
      })
    },
    /**
     * 弹窗取消
     */
    handleCancel() {
      this.visible = false;
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
