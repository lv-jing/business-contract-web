<template>
  <div class="bg-white">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <b>归档信息</b>
      </div>
      <common-title title="基本信息"/>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
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
              <el-form-item label="" prop="uploadListOne" label-width="0">
                <div v-model="ruleForm.uploadListOne">
                  <common-upload
                    disable
                    isPdfShow
                    v-on:get-file-list="getFileListOne"
                    :show-attached-list="showAttachedList"
                    title="合同正文扫描件"
                    content="合同正文扫描件仅支持上传单个FDF文件，请确保扫描件清晰、顺序正确无缺页。"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="" prop="uploadListTwo" label-width="0">
                <div v-model="ruleForm.uploadListTwo">
                  <common-upload
                    disable
                    isPdfShow
                    v-on:get-file-list="getFileListTwo"
                    :show-attached-list="showAttachedList1"
                    title="合同附件扫描件"
                    content="每个合同附件扫描件仅支持上传单个FDF文件，请确保扫描件清晰、顺序正确无缺页。"
                  />
                </div>
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
  </div>
</template>

<script>
/* eslint-disable */
import CommonUpload from "@/components/CommonUpload";
import {mapState} from "vuex"
import {getDetail} from "@/service/work";

export default {
  components: {
    CommonUpload,
  },
  data() {
    return {
      ApprovalData: [],
      pinionsList: [],
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
          {required: true, message: '合同可编辑必传', trigger: 'blur'}
        ],
        uploadListTwo: [
          {required: true, message: '合同可编辑必传', trigger: 'blur'}
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
  mounted() {
    this.getDetail()
  },

  methods: {
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
      console.log(name);
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
