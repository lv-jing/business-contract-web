<template>
  <div class="bg-white">
    <div class="modlue-box"
         @click="handleShow"
         v-show="modlueShow"
         element-loading-text="请点击一下页面，用以触发后台刷新，使word中修改的结构化字段同步至发起页面"
         v-loading="loading"></div>
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <div style="text-align: center;">
          <b style="font-size: 16px;">合同申请单</b>
        </div>
        <span v-if="ruleForm.contractNo" style="font-size: 12px;float: right;">合同编号：{{ ruleForm.contractNo }}</span>
        <span v-else style="font-size: 12px;float: right;">合同流水号：{{ ruleForm.serialNumber }}</span>
      </div>
      <div class="form-bg">
        <common-title title="基本信息" class="mb16 pt10"/>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="125px" class="demo-ruleForm">
          <div class="box-solid-bt">
            <el-row :gutter="24" type="flex" justify="space-around">
              <el-col :span="5">
                <el-form-item label="经办人:">
                  <span>{{ ruleForm.memberName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="2">
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
                <el-input maxlength="80" :autosize="{ minRows: 1, maxRows: 4}"
                          show-word-limit v-model="ruleForm.contractDesc"
                          placeholder="请输入，字数不超过80字"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="收支类型">
                <common-select
                  disabled
                  v-model="ruleForm.incomeExpeTypeCode"
                  dictCode="INCOME_EXPE_TYPE"
                  :value="ruleForm.incomeExpeTypeCode"
                  placeholder="请选择收支类型"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="合同类型" prop="contractTypeCode">
                <CommonTreeSelect
                  :disabled="$route.query.typeName==='templates'"
                  :value="ruleForm.contractTypeCode"
                  v-model="ruleForm.contractTypeCode"
                  :treeSelect="treeSelect"
                  :dict-code="dictCode"
                  :clearable="false"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="合同属性" prop="templateAttr">
                <common-select
                  :type="$route.query.typeName==='templates'?'CTA003':''"
                  v-model="ruleForm.templateAttr"
                  dictCode="CONTRACT_TEMPLATE_ATTR"
                  :value="ruleForm.templateAttr"
                  placeholder="请选择合同属性"
                  :handleChange="handleChange"
                  :isSplicing="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="this.ruleForm.templateAttr!=='CTA003'" :offset="2">
              <el-form-item label="合同范本" prop="modelNameList"
                            :rules="[{required: !(this.ruleForm.templateAttr==='CTA003'),
                             message: ' ',trigger: 'blur' }]">
                <el-select
                  :disabled="ruleForm.templateAttr==='CTA003'|| $route.query.typeName==='templates'"
                  class="w-100"
                  v-model="ruleForm.modelNameList"
                  placeholder="请选择合同范本"
                  @change="workChange"
                  value-key="templateId"
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
            <el-col :span="10" v-else :offset="2">
              <el-form-item label="合同场景" prop="contractScenario">
                <el-select filterable v-model="ruleForm.contractScenario"
                           placeholder="请选择合同场景" class="w-100">
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
                <el-input :disabled="ruleForm.templateAttr!=='CTA003'" v-model="ruleForm.contractName"
                          placeholder="请输入合同名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-popover
                placement="top-start"
                width="250"
                trigger="hover"
                content="请仔细核对签约主体的准确性，与营业执照（公司）/身份证（个人）的名称保持一致！">
                <el-form-item label="我方主体" prop="myEntityCode" slot="reference">
                  <el-select multiple remote filterable v-model="ruleForm.myEntityCode"
                             value-key="company"
                             placeholder="请选择"
                             ref="myentuty"
                             class="w-100"
                             @focus="entityFocus(0)"
                             @input="(val)=>limitcount(val)"
                             :remote-method="(val)=>remoteMethod(val,0)"
                             @change="(val)=>sideChange(val)">
                    <el-option
                      v-for="item in ourSideList"
                      :key="item.company"
                      :label="item.descr"
                      :value="item">
                    </el-option>
                    <div class="pagePagination">
                      <common-pagination
                        layout="prev, pager, next"
                        v-on:handler-currentPage="handlerCurrentPage"
                        :list="searchForm"/>
                    </div>
                  </el-select>
                </el-form-item>
              </el-popover>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-popover
                placement="top-start"
                width="250"
                trigger="hover"
                content="请仔细核对签约主体的准确性，与营业执照（公司）/身份证（个人）的名称保持一致!">
                <el-form-item label="对方主体" prop="orEntityCode" slot="reference">
                  <el-select multiple filterable
                             v-model="ruleForm.orEntityCode"
                             remote
                             ref="orentuty"
                             allow-create
                             @input="(val)=>limitcount(val)"
                             @focus="entityFocus(1)"
                             :remote-method="(val)=>remoteMethod(val,1)"
                             placeholder="请选择" value-key="cooperationCode"
                             @change="(val)=>sideChange1(val)"
                             class="w-100">
                    <el-option
                      v-for="item in otherSideList"
                      :key="item.cooperationCode"
                      :label="item.cooperationName"
                      :value="item">
                    </el-option>
                    <div class="pagePagination">
                      <common-pagination
                        layout="prev, pager, next"
                        v-on:handler-currentPage="handlerCurrentPage1"
                        :list="searchForm1"/>
                    </div>
                  </el-select>
                </el-form-item>
              </el-popover>
            </el-col>
          </el-row>
          <div v-if="ruleForm.incomeExpeTypeCode!=='IET004'&& moneyShow">
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item label="合同币种" prop="contractCurrencyCode">
                  <common-select
                    v-model="ruleForm.contractCurrencyCode"
                    dictCode="CONTRACT_SURRENCY"
                    :value="ruleForm.contractCurrencyCode"
                    placeholder="请选择合同币种"
                    :handleChange="changeMoney"
                    :isSplicing="false"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="原币金额" prop="originalCurrency" :rules="[{
            required: !(this.ruleForm.contractCurrencyCode === '人民币'), message: ' ',
            trigger: 'blur'
          },{validator: (rule, value, callback) => this.setError(rule, value, callback)}]">
                  <el-input  maxlength="15" :disabled="this.ruleForm.contractCurrencyCode==='人民币'"
                            v-model="ruleForm.originalCurrency"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item label="不含税额" prop="excludedAmount">
                  <el-input v-model="ruleForm.excludedAmount" maxlength="15" placeholder="请输入不含税额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="合同税率" prop="taxRate">
                  <el-input type="number" maxlength="15"
                            :disabled="ruleForm.contractCurrencyCode !== '人民币'"
                            v-model="ruleForm.taxRate">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item label="含税金额" prop="includedAmount">
                  <el-input  v-model="ruleForm.includedAmount" placeholder="请输入含税金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="合同份数" prop="contractNumber">
                <el-input  class="w-100 t-l" v-model="ruleForm.contractNumber" :controls="false" placeholder="请输入合同份数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="合同期限" prop="validDateType">
                <common-select
                  :disabled="dateShow && ruleForm.templateAttr==='CTA001'"
                  v-model="ruleForm.validDateType"
                  dictCode="VILAD_TYPE"
                  :value="ruleForm.validDateType"
                  placeholder="请选择合同有效期"
                  :handleChange="changeTimeType"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item :label="ruleForm.validDateType==='1'?'合同起期':'签订日期'" prop="validDateStart"
                            v-if="['1','2','3'].includes(this.ruleForm.validDateType)"
                            :rules="[{ required: ['1','2','3'].includes(this.ruleForm.validDateType),
                            message: ' ',trigger: 'blur' }]">
                <el-date-picker
                  class="w-100"
                  v-model="ruleForm.validDateStart"
                  type="date"
                  @change="chooseDate"
                  :placeholder="ruleForm.validDateType==='1'?'合同起期':'签订日期'"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="合同止期" prop="validDateEnd"
                            v-if="['1','3'].includes(this.ruleForm.validDateType)"
                            :rules="[{ required: ['1','3'].includes(this.ruleForm.validDateType),
                            message: ' ',trigger: 'blur' }]">
                <el-date-picker
                  class="w-100"
                  v-model="ruleForm.validDateEnd"
                  type="date"
                  @change="chooseDate"
                  placeholder="合同止期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="年份数量" prop="validYear" v-if="ruleForm.validDateType==='2'"
                            :rules="[{ required: this.ruleForm.validDateType==='2',
                            message: ' ',trigger: 'blur' }]">
                <el-input @keydown.native="clearInput" min="0" type="number"
                          v-if="ruleForm.validDateType&&ruleForm.validDateType==='2'"
                          v-model="ruleForm.validYear"
                          placeholder="请输入年">
                  <template slot="append">年</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="是否保密" prop="scret">
                <el-radio-group v-model="ruleForm.scret">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="防伪水印" prop="watermark">
                <el-radio-group v-model="ruleForm.watermark">
                  <el-radio label="N">是</el-radio>
                  <el-radio label="Y">否</el-radio>
                  <p style="font-size: 12px;color: #409EFF;float: right;">（注：水印便于核验）</p>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="box-solid-bt tp-das">
            <common-title title="文件信息" class="mb16 pt10">
              <el-popover
                placement="right"
                width="250"
                trigger="hover"
                content="合同起草完成后，可点击查看合同文本样式">
                <el-button slot="reference" style="margin-left: 10px;" size="mini" @click="handleSynthesis"
                           type="primary">合成预览
                </el-button>
              </el-popover>
            </common-title>
            <el-row :gutter="24">
              <el-col :span="22">
                <el-form-item label="合同文本" prop="uploadListOne" :rules="[{ required: this.ruleForm.templateAttr!=='CTA003',
                            message: ' ',trigger: 'blur' }]">
                  <span style="color:#409EFF;font-size: 12px;">(请在此区域使用金格软件完成合同文本编辑)</span>
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
                          <!--                      <a @click="editUploadClick(item,1)" href="javascript:;" class="ml20">预览</a>-->
                          <a @click="editUploadClick(item,2)" href="javascript:;">编辑</a>
                          <a @click="editUploadClick(item,3)" href="javascript:;">下载</a>
                          <a v-if="ruleForm.templateAttr==='CTA003'" @click="editUploadClick(item,4)"
                             href="javascript:;">删除</a>
                        </div>
                      </el-col>
                    </template>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item label="合同文本" prop="uploadListTwo" :rules="[{ required:ruleForm.templateAttr==='CTA003'&&ruleForm.uploadListOne.length<=0,
                            message: '合同不可编辑必填',trigger: 'blur' }]">
                  <div v-model="ruleForm.uploadListTwo">
                    <common-upload
                      v-on:get-file-list="getFileListTwo"
                      :show-attached-list="showAttachedListTwo"
                      title=""
                      :isRegShow="true"
                      content="如确有无法在可编辑区域进行起草的，请按顺序上传至本区域"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item label="前置审批" prop="workFlowId">
                  <common-relation
                    content="可在此处关联前置立项、定价、签呈等审批流程"
                    v-on:getWorkFlow="getWorkFlowList"
                    :show-work-list="showWorkList"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item prop="pass" label="见证资料">
                  <common-upload
                    v-on:get-file-list="getFileListTree"
                    :show-attached-list="showAttachedListTree"
                    title=""
                    :disable="false"
                    content="除上述前置审批中关联的流程，其他与合同相关的见证资料在此上传，包括但不限于资质、定价、立项、授权等文件"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <common-title title="项目信息" class="mb16"/>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="项目名称" prop="projectName">
                <el-input :maxlength="30" v-model="ruleForm.projectName" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="项目编号" prop="projectCode">
                <el-popover
                  placement="top-start"
                  width="250"
                  trigger="hover"
                  content="填写项目编号可以实现同一项目相关合同关联">
                  <el-input slot="reference" :maxlength="30" v-model="ruleForm.projectCode"
                            placeholder="请输入项目编号"></el-input>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="border-top">
            <common-title  title="小工具-提醒" class="mb16" style="position: relative" content="可在此处设置相关备忘或提醒哦"/>
            <el-row :gutter="22">
              <el-col :span="22">
                <el-form-item label="" label-width="50px">
                    <el-button
                      type="primary"
                      size="small"
                      icon="iconfont sbt_add"
                      @click="handleAddList"
                    >新增
                    </el-button>
                  <el-button
                    type="primary"
                    size="small"
                    icon="iconfont sbt_add"
                    @click="handleOpen"
                  >{{ show ? '收缩' : '展开' }}
                  </el-button>
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
                        <el-input v-model="row.remindMatter"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="提醒时间" width="160">
                      <template v-slot="{row}">
                        <el-date-picker
                          style="width: 100%"
                          type="date"
                          v-model="row.remindTime"
                          placeholder="选择提醒时间"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :picker-options="pickerOptions1"
                        ></el-date-picker>
                      </template>
                    </el-table-column>
                    <el-table-column prop="remindPersonObj" label="提醒对象" width="120">
                      <template v-slot="{row}">
                        <commonItemSelect
                          v-model="row.remindPersonObj"
                          :value="row.remindPersonObj"
                        ></commonItemSelect>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="80"
                      align="center"
                      v-if="this.$route.query.type!=='view'&&$route.query.type!=='auditing'"
                    >
                      <template slot-scope="scope">
                        <div class="tc">
                          <el-popconfirm title="确认删除该条记录吗?" @onConfirm="handleDeleteClick(scope.$index)">
                            <el-button slot="reference" type="text" size="mini" circle>删除</el-button>
                          </el-popconfirm>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <common-footer
        :handleSubmit="handleSubmit"
        :handleNextStep="handleNextStep"
        :handleGoBack="handleGoBack"
      />
      <commonApproval
        :visible="visible"
        :handleCancel="handleCancel"
        :approvalParams="approvalParams"
        :isShow="true"
        v-on:get-approvl-start="getApprovlStart"
      />
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import {rand, setUplod, clearInput} from '@/utils/tools'
import CommonUpload from "@/components/CommonUpload";
import {mapState} from "vuex"
import CommonSelect from '@/components/CommonSelect'
import {
  getOtherSide,
  getOurSide,
  postEidtSing,
  singAdd,
  singEdit,
  deleteContract,
  editFile
} from '@/service/approval';
import {getApprovlStart} from '@/service/work'
import {getTemplateInfos, getTemplateUrl} from '@/service/template'
import {OpenKgWindow, setTableData, getTableData, getText} from "@/utils/tools";
import Cookies from "js-cookie";
import {downloadUrl} from "@/service/file";
import {dictSelectList} from "@/service/common";
import Treeselect from '@riophae/vue-treeselect'

export default {
  components: {
    CommonUpload,
    CommonSelect,
    Treeselect
  },
  data() {
    return {
      bottomShow:false,
      dateShow: false,
      clearInput: clearInput,
      dictCode: '',
      normalizer(node) {
        if (!node.dictVoList) {
          delete node.dictVoList;
        }
        return {
          id: node.dictCode,
          label: node.dictName,
          children: node.dictVoList,
        }
      },
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.ruleForm.validDateStart.replace(/-/g, '/')).getTime()
        },
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() < new Date().getTime() - 8.64e7
        },
      },
      loading: false,
      modlueShow: false,
      approvalParams: {},
      editUploadName: 'IET138',
      num: 0,
      moneyShow: true, // 有无金额
      conditList: [],// 合同类型
      ourSideList: [],// 我方签约主体
      otherSideList: [],// 对方签约主体
      otherSideList1: [],// 对方签约主体
      show: true,
      visible: false,
      ruleForm: {
        serialNumber: null,
        contractNo: null,
        uploadListOne: [],
        uploadListTwo: [],
        uploadListTree: [],
        contractTypeCode: null, // 合同范本
        contractScenario: '', // 合同场景
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
        watermark: 'N',// 是否加密
        validDateStart: '',// 开始合同有效期
        validDateEnd: '',// 结束合同有效期
        validYear: '',// 合同有效期
        validDateType: '', // 合同有效期
        modelCode: null, // 合同有效期
      },
      rules: {
        contractScenario: [
          {required: true, message: ' ', trigger: 'blur'}
        ],
        validDateType: [
          {required: true, message: ' ', trigger: 'blur'}
        ],
        scret: [
          {required: true, message: '是否保密必选', trigger: 'blur'}
        ],
        contractTypeCode: [
          {required: true, message: '原合同类型必选', trigger: 'input'},
        ],
        templateAttr: [
          {required: true, message: ' ', trigger: 'blur'}
        ],
        contractDesc: [
          {required: true, message: ' ', trigger: 'blur'}
        ],
        myEntityCode: [
          {required: true, message: ' ', trigger: 'blur'}
        ],
        orEntityCode: [
          {required: true, message: ' ', trigger: 'blur'}
        ],
        contractName: [
          {required: true, message: ' ', trigger: 'blur'}
        ],
        contractNumber: [
          {required: true, message: ' ', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              if (Number(value) >= 0) {
                callback();
              } else {
                callback(new Error('请输入大于0的整数'));
              }
            }
          }
        ],
        validYear: [
          {
            validator: (rule, value, callback) => {
              if (Number.isInteger(Number(value)) && Number(value) >= 0) {
                callback();
              } else {
                callback(new Error('请输入大于0的整数'));
              }
            }
          }
        ],
        excludedAmount: [
          {required: false,trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              let num = this.ruleForm.includedAmount;
              var reg= /^([1-9]\d*|0)(\.\d{0,2})?$/
              console.log(!reg.test(value))
              if(value!==''&&value!==null){
                if(!reg.test(value)){
                  callback(new Error('不能为负数或者小数点不超过2位'))
                } else {
                  if (num) {
                    if (value - num > 0) {
                      callback(new Error('不含税合同额必选小于等于含税合同额'))
                    } else {
                      callback()
                    }
                  } else {
                    callback()
                  }
                }
              } else {
                callback()
              }
            }
          }
        ],
        includedAmount: [
          {required: true, message: ' ', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              let num = this.ruleForm.excludedAmount;
              var reg= /^([1-9]\d*|0)(\.\d{0,2})?$/
              if(value!==''&&value!==null){
                if(!reg.test(value)){
                  callback(new Error('不能为负数或者小数点不超过2位'))
                } else {
                  if (num) {
                    if (num-value > 0) {
                      callback(new Error('含税合同额必选大于等于不含税合同额'))
                    } else {
                      callback()
                    }
                  } else {
                    callback()
                  }
                }
              } else {
                callback()
              }
            }
          }
        ],
      },
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
      showAttachedListOne: [],
      showAttachedListTwo: [],
      showAttachedListTree: [],
      butShow: [],
      contractSignList: [],
      contractProjectList: [],
      ecmContractWorkflowList: [],
      ecmBusinessMemberList: [],
      showWorkList: [], // 关联审批流程
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
      orEntityCode: [],
      ScenarioList: [],
      businessAttamentId:''
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  mounted() {
    this.ruleForm = {
      ...this.ruleForm,
      memberName: this.userInfo.userName,
      orgName: this.userInfo.orgName,
      phone: this.userInfo.phone,
      incomeExpeTypeCode: this.$route.query.dictCode,
      templateAttr: this.$route.query.templateAttr || '',
      contractTypeCode: this.$route.query.contractTypeCode
    }
    this.dictCode = this.$route.query.dictCode
    if (this.$route.query.contractTypeCode) {
      this.getTemplateInfos({
        contractType: this.$route.query.contractTypeCode,
        unitId: this.userInfo.unitCode
      }, 'template')
    }
    this.init()
  },

  methods: {
    treeSelect(node) {
      this.ruleForm.contractTypeCode = node.dictCode
      this.contractChange(node.dictCode)
    },
    setError(rule, value, callback) {
      var reg= /^([1-9]\d*|0)(\.\d{0,2})?$/
      if(value!==''&&value!==null){
        if (!reg.test(value)) {
          callback(new Error('不能为负数或者小数点不能超过2位'))
        } else {
          callback()
        }
      } else {
        callback()
      }

    },
    // 时间change
    chooseDate() {
      if (this.ruleForm.validDateStart && this.ruleForm.validDateEnd) {
        if (new Date(this.ruleForm.validDateEnd.replace(/-/g, '/')).getTime() < new Date(this.ruleForm.validDateStart.replace(/-/g, '/')).getTime()) {
          this.ruleForm.validDateEnd = ''
          this.$message.error('合同止期必须大于合同起期,请重新选择时间！')
        }
      }
    },
    // 限制我方对方选择
    limitcount(e) {
      if (e.length > 5) {
        this.$message.warning('最多选五个');
        e.pop();
      }
    },
    // 刷新页面
    handleShow() {
      this.modlueShow = false;
      this.postEidtSing()
    },
    /**
     *  获取关联审批流程
     */
    getWorkFlowList(list) {
      this.ecmContractWorkflowList = list;
    },
    /**
     * w我方分页查询
     */
    handlerCurrentPage(list) {
      this.searchForm = {
        ...this.searchForm,
        ...list
      };
      this.getOurSide();
    },
    /**
     * 对方分页查询
     */
    handlerCurrentPage1(list) {
      this.searchForm1 = {
        ...this.searchForm1,
        ...list
      };
      this.getOtherSide();
    },
    /**
     * 初始化
     */
    init() {
      const {type} = this.$route.query;
      this.$nextTick(() => {
        if (type === 'edit') {
          this.postEidtSing()
        }
        this.getOurSide() // 请求我方签约主体
        this.getOtherSide() // 请求对方签约主体
      })
    },
    /**
     * 合同类型选择
     */
    contractChange(val) {
      this.getDictSelectList(val)
      this.deleteContract();
      this.ruleForm.modelNameList = ''
      this.ruleForm.contractScenario = ''
      if (val) {
        this.getTemplateInfos({
          contractType: val,
          unitId: this.userInfo.unitCode
        })
      }
    },
    /**
     * 获取合同场景
     */
    async getDictSelectList(val) {
      const {code, data} = await dictSelectList({
        parentCode: val,
        permission: "UNIT"
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
            this.dateShow = ['1', '2', '3', '4'].includes(obj[0].contractValidityType)
          }
          // 从常用范本发起
        } else if (text === 'template') {
          let obj = data.filter(item => item.templateId === this.$route.query.templateId)
          if (obj.length > 0) {
            this.ruleForm.modelNameList = obj[0];
            this.workChange(obj[0])
          }
        }
      }
    },
    /**
     * 合同范本选择changge
     */
    workChange(val) {
      if(this.ruleForm.templateAttr){
        const {type} = this.$route.query
        if (type !== 'add') {
          this.deleteContract()
        }
        this.dateShow = ['1', '2', '3', '4'].includes(val.contractValidityType)
        this.ruleForm.contractName = val.templateName;
        this.ruleForm.modelName = val.templateName;
        this.ruleForm.modelCode = val.templateId;
        this.ruleForm.validDateType = this.ruleForm.templateAttr === 'CTA001' ? val.contractValidityType : ''
        this.getTemplateUrl(val.templateId)
        this.moneyShow = val.showMoney === '1';
      } else {
        this.$message.error('请先选择合同属性')
        this.ruleForm.modelNameList = ''
      }

    },
    /**
     * 获取范本
     */
    async getTemplateUrl(params) {
      const {type, id} = this.$route.query;
      const {code, data} = await getTemplateUrl(params)
      if (code === '000000') {
        this.ruleForm.uploadListOne = JSON.parse(JSON.stringify([{
          ...data,
          businessId: type === 'add' ? '' : this.ruleForm.contractId,
          contractId: id || '',
          businessAttamentId: type === 'add' ? '' : this.businessAttamentId,
          fileStatus: 'STA001'
        }]))
      }
    },
    /**
     * 详情接口
     */
    async postEidtSing(val) {
      const {id} = this.$route.query
      const {code, data} = await postEidtSing({
        contractId: id
      })
      if (code === '000000') {
        this.$nextTick(() => {
          this.tableData = data.contractFulfillList && data.contractFulfillList.length > 0 && getTableData(data.contractFulfillList) || [];
          this.showAttachedListOne = setUplod(data.ecmBusinessAttamentList, 'template', this.$route.query.ispdf);
          this.showAttachedListTwo = setUplod(data.ecmBusinessAttamentList, '1');
          this.showAttachedListTree = setUplod(data.ecmBusinessAttamentList, '2');
          this.ecmBusinessMemberList = data.ecmBusinessMemberList
          this.getEntityData(data.contractEntityList)
          this.businessAttamentId = this.showAttachedListOne.length > 0 && this.showAttachedListOne[0].businessAttamentId;
          this.ruleForm = {
            ...this.ruleForm,
            contractId: data.contractId,
            uploadListOne: this.showAttachedListOne,
            uploadListTwo: this.showAttachedListTwo,
            uploadListTree: this.showAttachedListTree,
            orgName: data.orgName || '',
            memberName: this.ecmBusinessMemberList[0] && this.ecmBusinessMemberList[0].memberName || '',
            phone: this.ecmBusinessMemberList[0] && this.ecmBusinessMemberList[0].phone || '',
            contractScenario: data.contractScenario,
            contractName: data.contractName || '',
            serialNumber: data.serialNumber,
            contractNo: data.contractNo,
            modelCode: data.modelCode,
            modelName: data.modelName,
            modelNameList: {templateId: data.modelCode,} || '',
            incomeExpeTypeCode: data.incomeExpeTypeCode || '',
            contractTypeCode: data.contractTypeCode || null,
            templateAttr: data.templateAttr || '',
            contractCurrencyCode: data.contractCurrencyCode || '',
            contractDesc: data.contractDesc || '',
            originalCurrency: data.originalCurrency && data.originalCurrency >= 0 ? data.originalCurrency / 100 + '' : null,
            excludedAmount: data.excludedAmount && data.excludedAmount >= 0 ? data.excludedAmount / 100 + '' : null,
            includedAmount: data.includedAmount / 100,
            taxRate: data.taxRate,
            contractNumber: data.contractNumber || '',
            scret: data.scret || '',
            watermark: data.watermark || '',
            validDateStart: data.validDateStart || '',
            validDateEnd: data.validDateEnd || '',
            projectName: data.contractProjectList[0] && data.contractProjectList[0].projectName || '',
            projectCode: data.contractProjectList[0] && data.contractProjectList[0].projectCode || '',
            contractRelatedList: [],
            myEntityCode: [],
            orEntityCode: [],
            contractArchiveList: [],
            contractPrintList: [],
            ecmContractWorkflowList: [],
            ecmContractHistoryList: [],
            validDateType: data.validDateType,
            validYear: data.validYear || ''
          }
          this.dictCode = data.incomeExpeTypeCode || ''
          this.contractProjectList = data.contractProjectList || []
          this.ecmContractWorkflowList = data.ecmContractWorkflowList || []
          this.showWorkList = data.ecmContractWorkflowList || []
          if (data.templateAttr === 'CTA003') {
            if (this.ruleForm.uploadListOne.length > 0) {
              this.ruleForm.uploadListOne[0].fileName = this.ruleForm.contractName + '.doc';
            }
          }
          this.getTemplateInfos({
            contractType: this.ruleForm.contractTypeCode,
            unitId: this.userInfo.unitCode
          }, 'view')
          this.getOurSide() // 请求我方签约主体
          this.getOtherSide() // 请求对方签约主体
          this.getDictSelectList(this.ruleForm.contractTypeCode)
          let token = this.$Cookie.get('token');
          let businessId = this.ruleForm.modelCode || '';
          if (val === 2) {
            if(this.ruleForm.templateAttr==='CTA001' || (this.ruleForm.templateAttr==='CTA002' && this.ruleForm.uploadListOne[0].fileStatus==='STA001')){
              this.getFile()
            } else {
              let fileId = this.ruleForm.uploadListOne[0].fileId;
              let businessAttamentId = this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].businessAttamentId || '';
              let fileName = this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].fileName || '';
              let atrr = data.templateAttr;
              // 如果合同范本属性不等于 非标准范本的时候
              if (this.ruleForm.uploadListOne[0].fileStatus === 'STA001' && !this.ruleForm.uploadListOne[0].fileId) {
                // 新增
                OpenKgWindow('?openType=add&isUser=one&docFileName=' + encodeURIComponent(this.ruleForm.contractName) + '&isSave=true&operateType=contract&fileId=' + fileId + '&contractId=' + id + '&businessId=' + businessId + '&businessAttamentId=' + businessAttamentId + '&fileName=' + fileName + '&atrr=' + atrr + '&token=' + token)
              } else {
                OpenKgWindow('?openType=open&isUser=one&docFileName=' + encodeURIComponent(this.ruleForm.contractName) + '&isSave=true&operateType=contract&fileId=' + fileId + '&contractId=' + id + '&businessId=' + businessId + '&businessAttamentId=' + businessAttamentId + '&fileName=' + fileName + '&atrr=' + atrr + '&token=' + token)
              }
            }
          }
        })
      }
    },
    /**
     *  我方签约主体
     */
    async getOurSide() {
      const {code, data} = await getOurSide({
        ...this.searchForm
      })
      if (code === '000000') {
        const list = this.ruleForm.myEntityCode.concat(data.content) || [];
        let obj = {};
        this.ourSideList = list.reduce((cur, next) => {
          obj[next.company] ? "" : obj[next.company] = true && cur.push(next);
          return cur;
        }, [])
        this.searchForm.total = data.total;
      }
    },
    /**
     * 我方签约主体远程搜索
     */
    remoteMethod(item, num) {
      if (num === 0) {
        this.searchForm = {
          ...this.searchForm,
          descr: item
        }
        this.getOurSide()
      } else {
        this.searchForm1 = {
          ...this.searchForm1,
          cooperationName: item
        }
        this.getOtherSide()
      }
    },
    /**
     * 我方获取焦点重置下啦
     */
    entityFocus(num) {
      if (num === 0) {
        this.searchForm = {
          ...this.searchForm,
          descr: ''
        }
        this.getOurSide()
      } else {
        this.searchForm1 = {
          ...this.searchForm1,
          cooperationName: ''
        }
        this.getOtherSide()
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
          list.push({
            ...item,
            company: item.entityCode,
            descr: item.entityName,
            contractEntityId: ''
          })
        } else if (item.entityType === 'ENT02') {
          list1.push({
            ...item,
            cooperationCode: item.entityCode,
            cooperationName: item.entityName,
            contractEntityId: ''
          })
        }
      })
      this.$nextTick(() => {
        this.ruleForm.myEntityCode = list;
        this.ruleForm.orEntityCode = list1;
        this.orEntityCode = list1;
      })
    },
    /**
     *  对方签约主体
     */
    async getOtherSide() {
      const {code, data} = await getOtherSide({
        ...this.searchForm1,
        unitCode: this.userInfo.unitCode
      })
      if (code === '000000') {
        if (data.content.length === 0) {
          this.$message.warning('暂无此对方签约主体')
        }
        const list = this.ruleForm.orEntityCode.concat(data.content) || []
        let obj = {};
        this.otherSideList = list.reduce((cur, next) => {
          obj[next.cooperationCode] ? "" : obj[next.cooperationCode] = true && cur.push(next);
          return cur;
        }, [])
        this.searchForm1.total = data.total;
      }
    },
    /**
     * 我方签约主体change
     * num 标识 ENT01我方 ENT02对方
     */
    sideChange(val) {
      const {id} = this.$route.query;
      val.map(item => {
        item.entityType = 'ENT01'
        item.contractId = id ? id : '';
        item.entityCode = item.company;
        item.entityName = item.descr;
        item.entityId = item.company;
        item.contractEntityId = '';
      })
      this.ruleForm.myEntityCode = val
      let _this = this;
      setTimeout(function () {
        _this.$refs.myentuty.blur();
      }, 50);
    },
    /**
     * 对方对方签约主体change
     * num 标识 ENT01我方 ENT02对方
     */
    sideChange1(val) {
      let _this = this;
      const {id} = this.$route.query;
      let arr = []
      // 随机code，对方无的情况，下拉框回填值需要
      let sun = rand(100000000, 900000000)
      val.map(item => {
        if (typeof item === 'object') {
          arr.push({
            ...item,
            entityType: 'ENT02',
            contractId: id ? id : '',
            entityCode: item.cooperationCode,
            entityName: item.cooperationName,
            entityId: item.cooperationId,
            contractEntityId: '',
          })
        } else {
          arr.push({
            entityType: 'ENT02',
            contractId: id ? id : '',
            entityName: item,
            cooperationCode: sun,
            entityCode: sun,
            cooperationName: item,
            contractEntityId: ''
          })
        }
      })
      this.orEntityCode = arr;
      setTimeout(function () {
        _this.$refs.orentuty.blur();
      }, 50);
    },
    /**
     *选择合同生效期格式
     */
    changeTimeType(val) {
      if (val === '1') {
        this.$refs.ruleForm.clearValidate('validYear');
      } else {
        this.$refs.ruleForm.clearValidate('validDateStart');
        this.$refs.ruleForm.clearValidate('validDateEnd');
      }
      this.ruleForm.validDateStart = ''
      this.ruleForm.validDateEnd = ''
      this.ruleForm.validYear = ''
    },
    /**
     * 选择合同范本属性
     */
    handleChange(val) {
      const {typeName, type} = this.$route.query;
      if (typeName !== 'templates') {
        this.ruleForm.validDateType = ''
        this.dateShow = false;
        if (val === 'CTA003') {
          this.$refs.ruleForm.clearValidate('modelNameList');
          this.ruleForm.modelNameList = ''
        } else {
          this.$refs.ruleForm.clearValidate('contractScenario');
          this.ruleForm.contractScenario = ''
        }
        this.moneyShow = val !== 'CTA001'
        this.deleteContract()
        this.ruleForm.modelNameList = ''
        this.ruleForm.contractName = ''
        this.ruleForm.contractScenario = ''
        this.ruleForm.uploadListOne = []
        if (val === 'CTA003') {
          this.ruleForm.uploadListOne = [{
            fileName: '新建合同',
            contractId: type==='add'?'':this.ruleForm.contractId,
            fileType: 'doc',
            businessId:  type==='add'?'':this.ruleForm.contractId,
            businessAttamentId:  type==='add'?'':this.businessAttamentId,
            fileStatus: 'STA001',
            businessType: 'template',
          }]
        }
      }
    },
    // 删除合同
    async deleteContract() {
      const {code} = await deleteContract({
        contractId: this.$route.query.id
      })
      if (code === '000000') {

      }
    },
    /**
     * 选择合同币种的change
     */
    changeMoney(val) {
      if (val !== '人民币') {
        this.ruleForm.taxRate = ''
      }
      this.ruleForm.originalCurrency = ''
    },
    /**
     * 新增小工具
     */
    handleAddList() {
      const {type, id} = this.$route.query;
      this.tableData.push({
        remindMatter: '',
        remindTime: '',
        remindPersonObj: {},
        contractId: type === 'edit' && id || ''
      })
    },
    /**
     *展开收索
     */
    handleOpen() {
      this.show = !this.show
    },
    handleDeleteClick(index) {
      this.tableData.splice(index, 1);
    },
    /**
     * 获取上传信息
     */
    getFileListTwo(list) {
      list.forEach((item => {
        item.businessType = 1
      }))
      this.ruleForm.uploadListTwo = list;
    },
    /**
     * 获取上传信息
     */
    getFileListTree(list) {
      list.forEach((item => {
        item.businessType = 2
      }))
      this.ruleForm.uploadListTree = list;
    },
    /**
     * 合成预览
     */
    async handleSynthesis() {
      let params = [
        ...this.ruleForm.uploadListOne,
        ...this.ruleForm.uploadListTwo
      ]
      let text = ''
      if (params && params.length > 0) {
        const token = Cookies.get('token');
        params.map((item => {
          text += item.fileId + ','
        }))
        let fileId = getText(text);
        let contractName = this.ruleForm.contractName;
        window.open(encodeURI(process.env.VUE_APP_API_URL + '/contract/ecm-snap-business-attament/mergeFile?fileId=' + fileId + '&contractName=' + contractName + '&token=' + token, '_black'))
      } else {
        this.$message.error('合成文件必须大于一个！')
      }
    },

    /**
     * 弹窗取消
     */
    handleCancel() {
      this.visible = false;
    },
    /**
     * 获取参数
     */
    getParams(val) {
      const {id} = this.$route.query;
      return {
        draftTypeCode: 'CON001',
        contractId: val === 'edit' ? id : '',
        contractScenario: this.ruleForm.contractScenario,
        contractName: this.ruleForm.contractName,
        incomeExpeTypeCode: this.ruleForm.incomeExpeTypeCode || '',
        contractTypeCode: this.ruleForm.contractTypeCode || '',
        templateAttr: this.ruleForm.templateAttr || '',
        contractCurrencyCode: this.ruleForm.contractCurrencyCode || '',
        contractDesc: this.ruleForm.contractDesc || '',
        originalCurrency: (this.ruleForm.originalCurrency != null && this.ruleForm.originalCurrency !== '') ? this.ruleForm.originalCurrency * 1000/10 : null,
        excludedAmount: (this.ruleForm.excludedAmount != null && this.ruleForm.excludedAmount !== '') ? this.ruleForm.excludedAmount * 1000/10 : null,
        includedAmount: this.ruleForm.includedAmount * 1000/10,
        taxRate: this.ruleForm.taxRate,
        contractNumber: this.ruleForm.contractNumber || '',
        modelName: this.ruleForm.modelName || '',
        modelCode: this.ruleForm.modelCode || '',
        scret: this.ruleForm.scret || '',
        watermark: this.ruleForm.watermark || '',
        validDateStart: this.ruleForm.validDateStart || '',
        validDateEnd: this.ruleForm.validDateEnd || '',
        validDateType: this.ruleForm.validDateType || '',
        validYear: this.ruleForm.validYear || '',
        contractProjectList: [{
          ...this.contractProjectList[0],
          projectName: this.ruleForm.projectName || '',
          projectCode: this.ruleForm.projectCode || '',
        }],
        contractEntityList: [...this.ruleForm.myEntityCode, ...this.orEntityCode],
        contractFulfillList: this.tableData.length > 0 && setTableData(this.tableData) || [],
        ecmBusinessMemberList: this.ecmBusinessMemberList || [],
        ecmBusinessAttamentList: [
          ...this.ruleForm.uploadListOne,
          ...this.ruleForm.uploadListTwo,
          ...this.ruleForm.uploadListTree
        ],
        ecmContractWorkflowList: this.ecmContractWorkflowList,
        generateWayCode: 'TYP01',
        contractSignList: [],
        contractRelatedList: [],
        contractArchiveList: [],
        contractPrintList: [],
        ecmContractHistoryList: []
      }
    },
    /**
     *  保存
     */
    async handleSubmit() {
      const {type} = this.$route.query;
      if (type === 'add') {
        this.postAdd(this.getParams('add'));
      } else {
        this.singEdit(this.getParams('edit'))
      }
    },
    /**
     * 保存接口
     */
    async postAdd(params, val, fileId) {
      const {id, typeName} = this.$route.query;
      const {data, code, mesg} = await singAdd(params);
      if (code === '000000') {
        this.$message({
          type: 'success',
          message: mesg
        });
        this.$router.push({
          name: "singleContract",
          query: {type: "edit", id: data, dictCode: this.$route.query.dictCode, typeName: typeName}
        });
        setTimeout(() => {
          // 下一步
          if (val === 1) {
            let arr = []
            this.ruleForm.myEntityCode.map(item => {
              arr.push(item.entityId)
            })
            this.approvalParams = {
              objectTypeCode: "CONTRACT_APPROVAL",
              orgCode: this.userInfo.orgCode || '',
              contractTypeCode: this.ruleForm.contractTypeCode || '',
              quoteTemplate: this.ruleForm.templateAttr || '',
              minAmount: this.ruleForm.includedAmount ,
              businessId: id ? id : data,
              contractScenario: this.ruleForm.contractScenario || '',  //合同场景
              validDateStart: this.ruleForm.validDateStart || '', //有效期开始时间
              validDateEnd: this.ruleForm.validDateEnd || '',   //有效期结束时间
              validYear: this.ruleForm.validYear || '',   //签订之日**年
              entityAttribute: arr.length > 0 ? arr.join() : '',  //签约主体ID
            }
            if (this.ruleForm.uploadListOne.length <= 0 && this.ruleForm.templateAttr === 'CTA003') {
              this.visible = true
            } else if (this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].fileStatus === 'STA002') {
              this.visible = true
            } else {
              this.$message.error('请点击编辑合同，并进行保存，否则无法进行流程发起！')
            }
          }
          this.postEidtSing(val, fileId);
        }, 500);
      }
    },
    /**
     * 编辑接口
     */
    async singEdit(params, val, fileId) {
      const {id} = this.$route.query;
      const {code, mesg} = await singEdit(params);
      if (code === '000000') {
        this.$message({
          type: 'success',
          message: mesg
        });
        setTimeout(() => {
          this.postEidtSing(val, fileId);
          if (val === 1) {
            let arr = []
            this.ruleForm.myEntityCode.map(item => {
              arr.push(item.entityId)
            })
            this.approvalParams = {
              objectTypeCode: "CONTRACT_APPROVAL",
              orgCode: this.userInfo.orgCode || '',
              contractTypeCode: this.ruleForm.contractTypeCode || '',
              quoteTemplate: this.ruleForm.templateAttr || '',
              minAmount: this.ruleForm.includedAmount,
              businessId: id ? id : '',
              contractScenario: this.ruleForm.contractScenario || '',  //合同场景
              validDateStart: this.ruleForm.validDateStart || '', //有效期开始时间
              validDateEnd: this.ruleForm.validDateEnd || '',   //有效期结束时间
              validYear: this.ruleForm.validYear || '',   //签订之日**年
              entityAttribute: arr.length > 0 ? arr.join() : '',  //签约主体ID
            }
            if (this.ruleForm.uploadListOne.length <= 0 && this.ruleForm.templateAttr === 'CTA003') {
              this.visible = true
            } else if (this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].fileStatus === 'STA002') {
              this.visible = true
            } else {
              this.$message.error('请点击编辑合同，并进行保存，否则无法进行流程发起！')
            }
          }
        }, 500);
      }
    },
    /**
     * 下一步
     */
    handleNextStep() {
      this.$confirm('请确认本页字段和合同文本中需要填写的空项已经填写齐全、准确', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const {type, id} = this.$route.query
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (type === 'add') {
              this.postAdd(this.getParams('add'), 1);
            } else {
              this.singEdit(this.getParams('edit', id), 1)
            }
          } else {
            this.$message({
              type: 'error',
              message: '信息填写不齐全，请填写齐全！'
            })
          }
        })
      }).catch((err) => {
        console.log(err)
      });
    },
    /**
     * 取消
     */
    handleGoBack() {
      this.$refs.ruleForm.resetFields();
      this.showAttachedListOne = []
      this.showAttachedListTwo = []
      this.showAttachedListTree = []
      this.ruleForm.uploadListOne = []
      this.ruleForm.uploadListTwo = []
      this.ruleForm.uploadListTree = []
      this.tableData = []
      this.contractEntityList = []
      this.contractSignList = []
      this.contractProjectList = []
      this.ecmContractWorkflowList = []
    },
    /**
     *  保存审批人 跳转
     * @param params
     * @returns {Promise<void>}
     */
    async getApprovlStart(params) {
      const {id} = this.$route.query;
      const {code} = await getApprovlStart({
        ...params,
        contractId: id,
      });
      if (code === '000000') {
        this.visible = false;
        this.$router.push({name: 'agencymatter'})
      }
    },
    /**
     *  点击可编辑合同
     * @param val 1预览  2 编辑 3下载 4删除
     */
    editUploadClick(item, val) {
      if (this.ruleForm.templateAttr === 'CTA003' && this.ruleForm.contractName == '' && val !== 4) {
        this.$message.error("请填写合同名称")
        return false
      }
      let token = this.$Cookie.get('token');
      const {type, id} = this.$route.query;
      if (val === 1) {
        //调用iwebOffice
        OpenKgWindow('?openType=open&readType=readyOnly&fileId=' + item.fileId + '&token=' + token)
      } else if (val === 2) {
        this.modlueShow = true;
        this.loading = true;
        if (type === 'add') {
          this.postAdd(this.getParams('add'), 2, item.fileId);
        } else {
          this.singEdit(this.getParams('edit', id), 2, item.fileId);
        }
      } else if (val === 3) {
        const token = Cookies.get('token')
        window.open(downloadUrl + `/${item.fileId}?token=${token}`)
      } else {
        this.$confirm('此操作将永久删除可编辑合同, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ruleForm.uploadListOne = []
        })
      }
    },
    // 获取合同范本的fildId
    async getFile() {
      const {code, data} = await editFile({
        businessId:this.ruleForm.modelCode,
        contractId:this.ruleForm.contractId,
        templateAttr:this.ruleForm.templateAttr,
        dataType:0
      })
      if (code === "000000") {
        let fileId = data.fileId;
        let id = this.ruleForm.contractId;
        let token = this.$Cookie.get('token');
        let businessId = this.ruleForm.modelCode || '';
        let businessAttamentId = this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].businessAttamentId || '';
        let fileName = this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].fileName || '';
        let atrr = this.ruleForm.templateAttr;
        // 如果合同范本属性不等于 非标准范本的时候
          OpenKgWindow('?openType=open&isUser=one&docFileName=' + encodeURIComponent(this.ruleForm.contractName) + '&isSave=true&operateType=contract&fileId=' + fileId + '&contractId=' + id + '&businessId=' + businessId + '&businessAttamentId=' + businessAttamentId + '&fileName=' + fileName + '&atrr=' + atrr + '&token=' + token)
      } else {
        this.modlueShow = false;
        this.loading = false;
      }
    }
  }
}
;
</script>
<style lang="less">
.el-popover--plain {
  font-family: PingFangSC-Medium, serif;
  background: #F5F6F7;
  color: #00a2d4;
  font-size: 12px;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  border-radius: 15px;
  -webkit-box-shadow: 2px 2px 6px #888;
  -moz-box-shadow: 2px 2px 6px #888;
  box-shadow: 2px 2px 6px #888;

  .popper__arrow::after {
    border-top-color: #F5F6F7 !important;
  }
}
</style>

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
  z-index: 100;
}
</style>
