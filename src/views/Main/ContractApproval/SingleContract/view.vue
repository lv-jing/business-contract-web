<template>
  <div class="bg-white">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <div style="text-align: center;">
          <b style="font-size: 16px;">合同审批单</b>
        </div>
        <span v-if="ruleForm.contractNo" style="font-size: 12px;float: right;">合同编号：{{ ruleForm.contractNo }}</span>
        <span v-else style="font-size: 12px;float: right;">合同流水号：{{ ruleForm.serialNumber }}</span>
      </div>
      <div class="form-bg">
        <common-title title="基本信息"/>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="125px" class="demo-ruleForm">
          <div class="box-solid-bt">
            <el-row :gutter="24" type="flex" justify="space-around">
              <el-col :span="5">
                <el-form-item label="经办人:">
                  <span>{{ ruleForm.memberName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="发起部门:">
                  <span>{{ ruleForm.orgName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="联系方式:" label-width="90px">
                  <span>{{ ruleForm.phone }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row :gutter="24">
            <el-col :span="22">
              <el-form-item label="合同描述" prop="contractDesc">
                <el-input disabled type="textarea" maxlength="80" :autosize="{ minRows: 2, maxRows: 4}"
                          show-word-limit v-model="ruleForm.contractDesc"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="收支类型">
                <common-select
                  disabled
                  v-model="ruleForm.incomeExpeTypeCode"
                  dictCode="INCOME_EXPE_TYPE"
                  :value="ruleForm.incomeExpeTypeCode"
                  :isSplicing="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="合同类型" prop="contractTypeCode">
                <el-select disabled v-model="ruleForm.contractTypeCode" class="w-100">
                  <el-option
                    v-for="(item,index) in conditList"
                    :key="index"
                    :label="item.dictName"
                    :value="item.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="合同属性" prop="templateAttr">
                <common-select
                  disabled
                  v-model="ruleForm.templateAttr"
                  dictCode="CONTRACT_TEMPLATE_ATTR"
                  :value="ruleForm.templateAttr"
                  :isSplicing="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="this.ruleForm.templateAttr!=='CTA003'" :offset="2">
              <el-form-item label="合同范本" prop="modelName">
                <el-input disabled v-model="ruleForm.modelName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" v-else :offset="2">
              <el-form-item label="合同场景" prop="contractScenario">
                <el-select disabled filterable v-model="ruleForm.contractScenario"
                           class="w-100">
                  <el-option
                    v-for="(item,index) in ScenarioList"
                    :key="index"
                    :label="item.attribute1"
                    :value="item.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="合同名称" prop="contractName">
                <el-input disabled v-model="ruleForm.contractName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="我方主体" prop="myEntityCode">
                <el-select disabled multiple filterable v-model="ruleForm.myEntityCode"
                           value-key="entityName"
                           class="w-100"
                           remote>
                  <el-option
                    v-for="(item,index) in ourSideList"
                    :key="index"
                    :label="item.entityName"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="对方主体" prop="orEntityCode">
                <el-select disabled multiple filterable
                           v-model="ruleForm.orEntityCode"
                           remote
                           value-key="entityName"
                           class="w-100">
                  <el-option
                    v-for="item in otherSideList"
                    :key="item.cooperationCode"
                    :label="item.entityName"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="ruleForm.incomeExpeTypeCode!=='IET004'&&moneyShow">
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item label="合同币种" prop="contractCurrencyCode">
                  <common-select
                    disabled
                    v-model="ruleForm.contractCurrencyCode"
                    dictCode="CONTRACT_SURRENCY"
                    :value="ruleForm.contractCurrencyCode"
                    :isSplicing="false"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="原币金额" prop="originalCurrency">
                  <el-input disabled
                            v-model="ruleForm.originalCurrency"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item disabled label="不含税额" prop="excludedAmount">
                  <el-input disabled v-model="ruleForm.excludedAmount">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="合同税率" prop="taxRate">
                  <el-input type="number" disabled v-model.number="ruleForm.taxRate">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item label="含税金额" prop="includedAmount">
                  <el-input disabled v-model="ruleForm.includedAmount">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="合同份数" prop="contractNumber">
                <el-input disabled type="number" class="w-100 t-l" v-model="ruleForm.contractNumber"
                          min="0"
                          :controls="false"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="合同期限" prop="validDateType">
                <common-select
                  :disabled="true"
                  v-model="ruleForm.validDateType"
                  dictCode="VILAD_TYPE"
                  :value="ruleForm.validDateType"/>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item :label="ruleForm.validDateType==='1'?'合同起期':'签订日期'" prop="validDateStart"
                            v-if="['1','2','3'].includes(this.ruleForm.validDateType)">
                <el-date-picker
                  disabled
                  class="w-100"
                  v-model="ruleForm.validDateStart"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="合同止期" prop="validDateEnd"
                            v-if="['1','3'].includes(this.ruleForm.validDateType)">
                <el-date-picker
                  disabled
                  class="w-100"
                  v-model="ruleForm.validDateEnd"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="年份数量" prop="validYear" v-if="ruleForm.validDateType==='2'">
                <el-input disabled :min="0" type="number" v-if="ruleForm.validDateType&&ruleForm.validDateType==='2'"
                          v-model="ruleForm.validYear">
                  <template slot="append">年</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="是否保密" prop="scret">
                <el-radio-group disabled v-model="ruleForm.scret">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>

            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="防伪水印" prop="watermark">
                <el-radio-group disabled v-model="ruleForm.watermark">
                  <el-radio label="N">是</el-radio>
                  <el-radio label="Y">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="box-solid-bt tp-das">
            <common-title title="文件信息" class="mb16 pt10 mt16"/>
            <el-row :gutter="24">
              <el-col :span="22">
                <el-form-item label="合同文本" prop="uploadListOne">
                  <div v-model="ruleForm.uploadListOne" class="buts">
                    <template v-for="item in ruleForm.uploadListOne">
                    <el-col :span="8">
                      <div>
                        <span class="el-icon-tickets" style="margin-left: 1px;"></span>
                        <span class="ml10 show-hidden" v-text="item.fileName"></span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="but-cont-style" style="margin-left: 2px;">
                        <a @click="editUploadClick(item)" href="javascript:;">预览</a>
                        <a @click="editUploadClick(item,1)" href="javascript:;" >下载</a>
                      </div>
                    </el-col>
                    </template>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="22" v-if="$route.query.ispdf!=='pdf'">
                <el-form-item label="合同文本" prop="pass">
                  <common-upload
                    v-on:get-file-list="getFileListTwo"
                    :show-attached-list="showAttachedListTwo"
                    title=""
                  />
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item label="前置流程" prop="workFlowId">
                  <common-relation
                    v-on:getWorkFlow="getWorkFlowList"
                    :show-work-list="showWorkList"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item label="见证资料" prop="pass">
                  <common-upload
                    v-on:get-file-list="getFileListTree"
                    :show-attached-list="showAttachedListTree"
                    title=""
                    :disable="false"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <common-title title="项目信息" class="mb16"/>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="项目名称" prop="projectName">
                <el-input disabled v-model="ruleForm.projectName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="项目编号" prop="projectCode">
                <el-input disabled v-model="ruleForm.projectCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="border-top">
            <common-title title="小工具-提醒" class="mt20 mb20"/>
            <el-col :span="22">
              <el-table
                :class="show?'show mt10 mun-right':'hid'"
                :data="tableData"
                stripe
                highlight-current-row
                style="width: 100%;"
                :header-cell-style="{background:'#f3f3f3'}"
              >
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="remindMatter" label="提醒事项">
                  <template v-slot="{row}">
                    <el-input disabled v-model="row.remindMatter"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="提醒时间" width="160">
                  <template v-slot="{row}">
                    <el-date-picker
                      disabled
                      style="width: 100%"
                      type="date"
                      v-model="row.remindTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column prop="remindPersonObj" label="提醒对象" width="120">
                  <template v-slot="{row}">
                    <commonItemSelect
                      disabled
                      :orgCode='"00000020"'
                      v-model="row.remindPersonObj"
                      :value="row.remindPersonObj"
                    ></commonItemSelect>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="22">
              <common-tableappoval
                :ApprovalData="ApprovalData"
                :pinionsList="pinionsList"
              />
            </el-col>
          </div>
        </el-form>
      </div>
    </el-card>
    <common-footer
      :isShow="false"
      :isGoShow="true"
    />
  </div>
</template>

<script>
/* eslint-disable */
import CommonUpload from "@/components/CommonUpload"; // 上传
import {getContractType, postEidtSing,postEidtSings} from "@/service/approval";
import {formatSeconds, getTableData, OpenKgWindow, setUplod} from '@/utils/tools'
import {getTemplateInfos} from "@/service/template";
import {dictSelectList} from "@/service/common";
import {downloadUrl, previewUrl} from "@/service/file";

export default {
  components: {
    CommonUpload
  },
  data() {
    return {
      ScenarioList: [],
      formatSeconds: formatSeconds,
      workflowList: {
        approverOpinions: '',
        approverType: "TEXT",
      },
      approvalParams: {},
      editUploadName: '',
      num: 0,
      moneyShow: true, // 有无金额
      conditList: [],// 合同类型
      ourSideList: [],// 我方签约主体
      otherSideList: [],// 对方签约主体
      filterText: '',
      show: true,
      visible: false,
      ruleForm: {
        serialNumber: null,
        contractNo: null,
        contractId: '',
        unitCode: '',
        uploadListOne: [],
        contractTypeCode: '', // 合同范本
        memberName: '', // 经办方
        orgName: '', // 主办部门
        phone: '', // 手机号
        incomeExpeTypeCode: '', // 收支类型
        templateAttr: '', // 合同范本属性
        modelNameList: '', // 合同范本选择
        projectName: '', // 项目名称
        projectCode: '', // 项目编号
        projectId: '', // 关联前置审批流程
        contractName: '',// 合同名称
        contractDesc: '',// 合同描述
        myEntityCode: [],// 我方签约主体
        orEntityCode: [],// 对方签约主体
        contractCurrencyCode: '人民币',// 合同币种
        originalCurrency: '',// 原币金额
        excludedAmount: '',// 不含税合同额
        taxRate: '',// 税率
        includedAmount: '',// 含税合同额
        contractNumber: '',// 合同份数
        scret: '',// 是否加密
        watermark: 'Y',// 是否加密
        validDateStart: '',// 开始合同有效期
        validDateEnd: '',// 结束合同有效期
        validYear: '',// 合同有效期
        validDateType: null, // 合同有效期
        modelCode: null, // 合同有效期
      },
      rules: {},
      dictVoList: [],
      templateList: [],
      tableData: [],
      options: [
        {
          dictCode: '1',
          dictName: '是'
        },
        {
          dictCode: '2',
          dictName: '否'
        }
      ],
      workFlowList: [], // 合同范本选择
      optionsTime: [
        {
          label: '明确的有效期限',
          value: '1'
        },
        {
          label: '签订之日起生效',
          value: '2'
        },

      ],
      showAttachedListOne: [],
      showAttachedListTwo: [],
      showAttachedListTree: [],
      uploadListOne: [],
      uploadListTwo: [],
      uploadListTree: [],
      contractSignList: [],
      contractProjectList: [],
      ecmContractWorkflowList: [],
      bpmProcessTaskOpinionsFormList: [],
      ecmBusinessMemberList: [],
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      searchForm1: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      ApprovalData: [],
      pinionsList: [],
      uploadParams: {
        bizType: "项目变更", //业务分类
        bizTypeCode: "2013101" //业务类型编码
      },
      showAttachedList: [],
      showWorkList: [],
    };
  },
  created() {
    this.$store.dispatch("setHeight", 120);
  },
  mounted() {
    this.getDetail();
  },

  methods: {
    /**
     *  获取关联审批流程
     */
    getWorkFlowList(list) {
      this.ecmContractWorkflowList = list;
    },
    /**
     *  合同类型
     */
    async getContractType(params) {
      const {code, data} = await getContractType(params)
      if (code === '000000') {
        this.conditList = [];
        this.getConditList(data)
      }
    },
    /**
     * 分解合同类型数据
     */
    getConditList(data) {
      data && data.map(item => {
        if (item.dictVoList && item.dictVoList.length > 0) {
          this.getConditList(item.dictVoList)
        } else {
          this.conditList.push(item);
        }
      })
    },
    /**
     *  点击可编辑合同
     * @param val 1预览  2 编辑 3下载
     */
    editUploadClick(item, val) {
      let token = this.$Cookie.get('token');
      if (val) {
        window.open(downloadUrl + `/${item.fileId}?token=${token}`)
      } else {
        //调用iwebOffice
        if (['pdf'].includes(item.fileType)) {
          window.open(previewUrl + `/${item.fileId}/preview?token=${token}`)
        } else {
          OpenKgWindow('?openType=open&readType=readyOnly&fileId=' + item.fileId + '&token=' + token)
        }
      }
    },
    /**
     *  分解我方对方列表
     */
    getEntityData(data) {
      const list = [];
      const list1 = [];
      data && data.map(item => {
        if (item.entityType === 'ENT01') {
          list.push(item)
        } else if (item.entityType === 'ENT02') {
          list1.push(item)
        }
      })
      this.$nextTick(() => {
        this.ourSideList = list// 我方签约主体
        this.otherSideList = list1// 对方签约主体
        this.ruleForm.myEntityCode = list;
        this.ruleForm.orEntityCode = list1;
      })
    },
    /**
     * 详情
     */
    async setRuleForm(data) {
        this.tableData = data.contractFulfillList && data.contractFulfillList.length > 0 && getTableData(data.contractFulfillList) || [];
        this.getEntityData(data.contractEntityList)
        this.showAttachedListOne = setUplod(data.ecmBusinessAttamentList, 'template', this.$route.query.ispdf);
        this.showAttachedListTwo = setUplod(data.ecmBusinessAttamentList, '1');
        this.showAttachedListTree = setUplod(data.ecmBusinessAttamentList, '2');
        this.uploadListOne = this.showAttachedListOne;
        this.uploadListTwo = this.showAttachedListTwo;
        this.uploadListTree = this.showAttachedListTree;
        this.ecmBusinessMemberList = data.ecmBusinessMemberList || []
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList
        this.ruleForm = {
          ...this.ruleForm,
          contractId: data.contractId || '',
          uploadListOne: this.showAttachedListOne,
          unitCode: data.unitCode,
          projectId: data.projectId || '',
          orgName: data.orgName || '',
          memberName: this.ecmBusinessMemberList[0] && this.ecmBusinessMemberList[0].memberName || '',
          phone: this.ecmBusinessMemberList[0] && this.ecmBusinessMemberList[0].phone || '',
          incomeExpeTypeCode: data.incomeExpeTypeCode || '',
          contractTypeCode: data.contractTypeCode || '',
          templateAttr: data.templateAttr,
          modelName: data.modelName,
          modelCode: data.modelCode || '',
          serialNumber: data.serialNumber,
          contractNo: data.contractNo,
          projectName: data.contractProjectList && data.contractProjectList[0] && data.contractProjectList[0].projectName || '',
          projectCode: data.contractProjectList && data.contractProjectList[0] && data.contractProjectList[0].projectCode || '',
          contractName: data.contractName || '',
          contractDesc: data.contractDesc || '',
          contractCurrencyCode: data.contractCurrencyCode || '',
          originalCurrency: data.originalCurrency && data.originalCurrency >= 0 ? data.originalCurrency / 100 + '' : null,
          excludedAmount: data.excludedAmount && data.excludedAmount >= 0 ? data.excludedAmount / 100 + '' : null,
          includedAmount: data.includedAmount / 100,
          taxRate: data.taxRate,
          contractNumber: data.contractNumber || '',
          scret: data.scret || 'N',
          watermark: data.watermark || 'N',
          validDateStart: data.validDateStart || '',
          validDateEnd: data.validDateEnd || '',
          validDateType: data.validDateType || '',
          validYear: data.validYear || '',
          contractScenario: data.contractScenario || ''
        }
        this.ecmContractWorkflowList = data.ecmContractWorkflowList || []
        this.showWorkList = data.ecmContractWorkflowList || []
      this.getTemplateInfos({
          contractType: this.ruleForm.contractTypeCode,
          unitId: data.unitCode
        }, 'view')
        this.getContractType({
          dictCode: data.incomeExpeTypeCode,
          attribute1: 3
        })
        this.getDictSelectList(this.ruleForm.contractTypeCode)
    },
    // 详情
    async getDetail(){
      const {id,ispdf} = this.$route.query;
      if(ispdf==='pdf'){
        const {code, data} = await postEidtSings({
          contractId: id
        })
        if(code==='000000'){
          this.setRuleForm(data)
        }
      } else {
        const {code, data} = await postEidtSing({
          contractId: id
        })
        if(code==='000000'){
          this.setRuleForm(data)
        }
      }
    },
    /**
     * 获取合同场景
     */
    async getDictSelectList(val) {
      const {code, data} = await dictSelectList({
        parentCode: val
      });
      if (code === '000000') {
        this.ScenarioList = data || []
      }
    },
    /**
     *  合同范本选择
     */
    async getTemplateInfos(params, text) {
      const {code, data} = await getTemplateInfos(params)
      if (code === '000000') {
        this.workFlowList = data || []
        if (text === 'view') {
          let obj = data.filter(item => item.templateId === this.ruleForm.modelCode)
          if (obj.length > 0) {
            this.moneyShow = obj[0].showMoney === '1'
          }
        }
      }
    },
    /**
     * 获取上传信息
     */
    getFileListTwo(list) {
      list.forEach((item => {
        return item.businessType = 1, item.contractId = this.$route.query.id || ''
      }))
      this.uploadListTwo = list;
    },
    /**
     * 获取上传信息
     */
    getFileListTree(list) {
      list.forEach((item => {
        return item.businessType = 2, item.contractId = this.$route.query.id || ''
      }))
      this.uploadListTree = list;
    },
  }
};
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
</style>
