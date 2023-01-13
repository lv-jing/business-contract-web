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
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <common-title title="原合同信息" class="mt10 mb20"/>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="关联性质">
                <el-select
                  disabled
                  v-model="ruleForm.draftTypeCode"
                  placeholder="关联性质"
                  class="w-100">
                  <el-option
                    v-for="item in relatedCodeList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="原合同编号" prop="parentContractNo">
                <el-select filterable @change="(val)=>originalChange(val)"
                           v-model="ruleForm.parentContractNo"
                           remote clearable
                           :no-data-text="'没有查询到此原合同编号,请手动输入进行变更'"
                           :disabled="$route.query.type==='edit'"
                           :remote-method="(val)=>remoteOriginal(val)"
                           placeholder="请选择"
                           @clear="selectClear"
                           class="w-100">
                  <el-option
                    v-for="item in originalList"
                    :key="item.parentContractNo"
                    :label="item.contractNo"
                    :value="item.contractNo">
                  </el-option>
                  <div class="pagePagination">
                    <common-pagination
                      layout="prev, pager, next"
                      v-on:handler-currentPage="handlerCurrentOriginal"
                      :list="searchFormOriginal"/>
                  </div>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="原合同名称" prop="parentContractName">
                <el-input :disabled="$route.query.type==='edit'||editShow"
                          v-model="ruleForm.parentContractName"
                          placeholder="请输入原合同名称"></el-input>
              </el-form-item>
            </el-col>
            <div v-if="domShow">
              <el-col :span="10" :offset="2">
                <el-form-item label="原收支类型" prop="incomeExpeTypeCode">
                  <common-select
                    :disabled="$route.query.type==='edit'||editShow"
                    v-model="ruleForm.incomeExpeTypeCode"
                    dictCode="INCOME_EXPE_TYPE"
                    attribute2="CON004"
                    :handleChange="incomeCodeChange"
                    :value="ruleForm.incomeExpeTypeCode"
                    placeholder="请选择收支类型"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="原合同类型" prop="contractTypeCode">
                  <CommonTreeSelect
                    :disabled="$route.query.type==='edit' || editShow"
                    :value="ruleForm.contractTypeCode"
                    :treeSelect="treeSelect"
                    :dict-code="dictCode"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" v-if="ruleForm.templateAttr==='CTA003'" :offset="2">
                <el-form-item label="原合同场景" prop="contractScenario">
                  <el-select filterable v-model="ruleForm.contractScenario"
                             :disabled="$route.query.type==='edit' || editShow"
                             placeholder="请选择原合同场景" class="w-100">
                    <el-option
                      v-for="(item,index) in ScenarioList"
                      :key="index"
                      :label="item.attribute1"
                      :value="item.dictCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" v-else :offset="2">
                <el-form-item label="原合同范本" prop="modelNameList"
                              :rules="[{required: !(this.ruleForm.templateAttr==='CTA003'),
                            message: ' ',trigger: 'blur' }]">
                  <el-select
                    :disabled="$route.query.type==='edit'|| editShow"
                    class="w-100"
                    v-model="ruleForm.modelNameList"
                    placeholder="请选择原合同范本"
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
            </div>
          </el-row>
          <common-title title="基本信息" class="mb16 pt10"/>
          <div class="box-solid-bt">
            <el-row :gutter="24">
              <el-col :span="5">
                <el-form-item label="经办人:">
                  {{ ruleForm.memberName }}
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="2">
                <el-form-item label="发起部门:">
                  <span>{{ ruleForm.memberUnitName }}</span>
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
              <el-form-item :label="$route.query.draftTypeCode!=='CON004'?'变动原因':'合同描述'" prop="contractDesc">
                <el-input type="textarea" maxlength="80" :autosize="{ minRows: 1, maxRows: 4}"
                          show-word-limit v-model="ruleForm.contractDesc"
                          placeholder="请输入，字数不超过80字"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 续签 -->
          <div v-if="!domShow">
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item label="收支类型" prop="incomeExpeTypeCode">
                  <common-select
                    :disabled="$route.query.type==='edit'||editShow"
                    v-model="ruleForm.incomeExpeTypeCode"
                    dictCode="INCOME_EXPE_TYPE"
                    attribute2="CON004"
                    :handleChange="incomeCodeChange"
                    :value="ruleForm.incomeExpeTypeCode"
                    placeholder="请选择收支类型"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="合同类型" prop="contractTypeCode">
                  <CommonTreeSelect
                    :disabled="$route.query.type==='edit'||editShow"
                    :value="ruleForm.contractTypeCode"
                    :treeSelect="treeSelect"
                    :dict-code="dictCode"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item label="合同属性" prop="templateAttr">
                  <common-select
                    v-model="ruleForm.templateAttr"
                    dictCode="CONTRACT_TEMPLATE_ATTR"
                    :value="ruleForm.templateAttr"
                    placeholder="请选择合同属性"
                    :handleChange="handleChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" v-if="ruleForm.templateAttr!=='CTA003'" :offset="2">
                <el-form-item label="合同范本" prop="modelNameList"
                              :rules="[{required: !(this.ruleForm.templateAttr==='CTA003'),
                            message: ' ',trigger: 'blur' }]">
                  <el-select
                    :disabled="this.ruleForm.templateAttr==='CTA003'"
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
          </div>
          <!-- 废止和变更 -->
          <div v-if="domShow">
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item label="合同属性" prop="changeTemplateAttr">
                  <common-select
                    v-model="ruleForm.changeTemplateAttr"
                    dictCode="CONTRACT_TEMPLATE_ATTR"
                    :value="ruleForm.changeTemplateAttr"
                    placeholder="请选择合同属性"
                    :handleChange="handleChangeAttr"
                  />

                </el-form-item>
              </el-col>
              <el-col :span="10" v-if="ruleForm.changeTemplateAttr!=='CTA003'" :offset="2">
                <el-form-item label="合同范本" prop="modelNameList1"
                              :rules="[{required: !(this.ruleForm.changeTemplateAttr==='CTA003'),
                            message: ' ',trigger: 'blur' }]">
                  <el-select
                    :disabled="this.ruleForm.changeTemplateAttr==='CTA003'"
                    class="w-100"
                    v-model="ruleForm.modelNameList1"
                    placeholder="请选择合同范本"
                    @change="workChange1"
                    value-key="templateName"
                  >
                    <el-option
                      v-for="item in workFlowList1"
                      :key="item.templateId"
                      :label="item.templateName"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" v-else :offset="2">
                <el-form-item label="合同场景" prop="changeModelCode">
                  <el-select filterable v-model="ruleForm.changeModelCode"
                             @change="changeModelCode"
                             placeholder="请选择合同场景" class="w-100">
                    <el-option
                      v-for="(item,index) in ScenarioList1"
                      :key="index"
                      :label="item.attribute1"
                      :value="item.dictCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="合同名称" prop="contractName">
                <el-input :disabled="ruleForm.changeTemplateAttr!=='CTA003'&&ruleForm.templateAttr!=='CTA003'"
                          v-model="ruleForm.contractName"
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
                  <el-select multiple filterable v-model="ruleForm.myEntityCode" value-key="company"
                             placeholder="请选择"
                             class="w-100"
                             remote ref="myentuty"
                             @input="(val)=>limitcount(val)"
                             :disabled="$route.query.type==='edit'"
                             @focus="entityFocus(0)"
                             :remote-method="(val)=>remoteMethod(val,0)"
                             @change="(val)=>sideChange(val,'ENT01')">
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
                content="请仔细核对签约主体的准确性，与营业执照（公司）/身份证（个人）的名称保持一致！">
                <el-form-item label="对方主体" prop="orEntityCode" slot="reference">
                  <el-select multiple filterable @change="(val)=>sideChange1(val,'ENT02')"
                             v-model="ruleForm.orEntityCode"
                             remote allow-create ref="orentuty"
                             @input="(val)=>limitcount(val)"
                             :disabled="$route.query.type==='edit'"
                             @focus="entityFocus(1)"
                             :remote-method="(val)=>remoteMethod(val,1)"
                             placeholder="请选择" value-key="cooperationCode"
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
          <div v-if="ruleForm.incomeExpeTypeCode!=='IET004' && moneyShow">
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
                <el-form-item
                  label="原币金额" prop="originalCurrency"
                  :rules="[{ required: !(this.ruleForm.contractCurrencyCode==='人民币'), message: ' ',
                  trigger: 'blur' },{validator: (rule, value, callback) => this.setError(rule, value, callback)}]">
                  <el-input maxlength="15" :disabled="this.ruleForm.contractCurrencyCode==='人民币'"
                            v-model="ruleForm.originalCurrency" placeholder="请输入原币金额"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item label="不含税额" prop="excludedAmount">
                  <el-input v-model="ruleForm.excludedAmount" maxlength="15" placeholder="请输入不含税合同额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="合同税率" prop="taxRate">
                  <el-input type="number"
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
                  <el-input maxlength="15" v-model="ruleForm.includedAmount" placeholder="请输入含税合同额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label-width="50px" prop="includedAmount">
                  <span style="color: #409EFF;font-size: 12px;">（注：1.年度合同，金额填0；2.有收有支类填写支出金额）</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="合同份数" prop="contractNumber">
                <el-input type="number" class="w-100 t-l" v-model="ruleForm.contractNumber" :min="0"
                          :controls="false"
                          placeholder="请输入合同份数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="合同期限" prop="validDateType">
                <common-select
                  :disabled="dateShow && ruleForm.templateAttr==='CTA001' || this.$route.query.draftTypeCode==='CON003'"
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
              <el-form-item
                :label="ruleForm.validDateType==='1'?'合同起期':'签订日期'" prop="validDateStart"
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
                <el-input :min="0" type="number" v-if="ruleForm.validDateType&&ruleForm.validDateType==='2'"
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
                <el-radio-group v-model="ruleForm.scret" :disabled="scretShow">
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
                           type="primary">
                  合成预览
                </el-button>
              </el-popover>
            </common-title>
            <el-row :gutter="24">
              <el-col :span="22">
                <el-form-item label="合同文本" prop="uploadListOne">
                  <span style="color:#409EFF;font-size: 12px;">(请在此区域使用金格软件完成合同文本编辑)</span>
                  <div v-model="ruleForm.uploadListOne" class="buts">
                    <template v-for="item in ruleForm.uploadListOne">
                      <el-col :span="8">
                        <div>
                          <span style="margin-left: 1px;" class="el-icon-tickets"></span>
                          <span class="ml10 show-hidden" v-text="item.fileName"></span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="but-cont-style" style="margin-left: 2px;">
                          <!--                      <a @click="editUploadClick(item,1)" href="javascript:;" class="ml20">预览</a>-->
                          <a @click="editUploadClick(item,2)" href="javascript:;">编辑</a>
                          <a @click="editUploadClick(item,3)" href="javascript:;">下载</a>

                        </div>
                      </el-col>
                    </template>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item label="合同文本" prop="pass">
                  <common-upload
                    v-on:get-file-list="getFileListTwo"
                    :show-attached-list="showAttachedListTwo"
                    title=""
                    :isRegShow="true"
                    content="如确有无法在可编辑区域进行起草的，请按顺序上传至本区域"
                  />
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
                <el-input :maxlength="30" v-model="ruleForm.projectCode" placeholder="请输入项目编号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="border-top">
            <el-col :span="22">
              <common-title title="小工具-提醒" class="mt20 mb20"/>
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
            <el-col :span="22">
              <common-title title="关联记录" class="mt20 mb20"/>
              <el-form-item label="" label-width="50px">
                <el-table
                  :data="tableContractList"
                  stripe
                  highlight-current-row
                  style="width: 100%;"
                  :header-cell-style="{background:'#f3f3f3'}"
                >
                  <el-table-column prop="draftTypeName" label="关联类型"></el-table-column>
                  <el-table-column prop="contractNo" label="合同编号">
                    <template v-slot="{row}">
                      <a class="pointer" @click="handleGoTo(row)">{{ row.contractNo }}</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="contractName" label="合同名称"></el-table-column>
                  <el-table-column prop="statue" label="合同状态">
                    <template v-slot="{row}">
                      <span>{{ getStatue(row) }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </div>
        </el-form>
      </div>
      <common-footer
        :handleSubmit="handleSubmit"
        :handleNextStep="handleNextStep"
        :handleGoBack="handleGoBack"
      />
    </el-card>
    <commonApproval
      :visible="visible"
      :handleCancel="handleCancel"
      :isShow="true"
      :approvalParams="approvalParams"
      v-on:get-approvl-start="getApprovlStart"
    />
  </div>
</template>

<script>
/* eslint-disable */
import CommonUpload from '@/components/CommonUpload'
import { mapState } from 'vuex'
import CommonSelect from '@/components/CommonSelect'
import {
  getOrgContract,
  getContractNo,
  getOtherSide,
  getOurSide,
  postEidtSing,
  singAdd,
  singEdit,
  deleteContract, editFile
} from '@/service/approval'
import { getApprovlStart } from '@/service/work'
import { getTemplateInfos, getTemplateUrl } from '@/service/template'
import { OpenKgWindow, approvalTypeCode, draftTypeObj, getTableData, setTableData, rand, getText } from '@/utils/tools'
import { dictSelectList } from '@/service/common'
import Cookies from 'js-cookie'

import { downloadUrl } from '@/service/file'

export default {
  components: {
    CommonUpload,
    CommonSelect
  },
  data () {
    return {
      scretShow: false,
      dateShow: false,
      domShow: true,
      ScenarioList: [],
      ScenarioList1: [],
      editShow: false,
      relatedCodeList: [], // 关联性质
      originalList: [], // 原合同编号
      searchFormOriginal: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        parentContractNo: ''
      },// 原合同编号查询条件
      fileStatus: '',
      loading: false,
      modlueShow: false,
      approvalParams: {},
      editUploadName: '',
      num: 0,
      moneyShow: false, // 有无金额
      ourSideList: [],// 我方签约主体
      otherSideList: [],// 对方签约主体
      show: true,
      visible: false,
      ruleForm: {
        contractId: '',
        changeModelCode: '',
        changeModelName: '',
        serialNumber: null,
        contractNo: '', // 当前合同编号
        parentContractId: '', // 原合同编号
        parentContractNo: '', // 原合同编号
        parentContractName: '', // 原合同名称
        contractDesc: '',// 变更原因
        draftTypeCode: '', // 关联性质code
        draftTypeName: '', // 关联性质Name
        originalContractNo: '', // 原始合同编号
        originalContractId: '', // 原合同id
        originalContractName: '', // 原合同名字
        uploadListOne: [],
        contractTypeCode: null, // 合同范本
        memberName: '', // 经办方
        memberUnitName: '', // 主办部门
        phone: '', // 手机号
        incomeExpeTypeCode: '', // 收支类型
        templateAttr: '', // 合同范本属性
        changeTemplateAttr: '', // 合同范本属性
        modelNameList: '', // 合同范本选择
        modelNameList1: '', // 合同范本选择
        modelName: '', // 合同范本选择
        contractScenario: '',
        projectName: '', // 项目名称
        projectCode: '', // 项目编号
        projectId: '', // 关联前置审批流程
        contractName: '',// 合同名称
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
        validDateType: null, // 合同有效期
        modelCode: null, // 合同有效期
      },
      rules: {
        parentContractNo: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        parentContractName: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        contractScenario: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        changeModelCode: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        incomeExpeTypeCode: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        validDateType: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        scret: [
          { required: true, message: '是否保密必选', trigger: 'blur' }
        ],
        contractTypeCode: [
          { required: true, message: '原合同类型必选', trigger: 'blur' }
        ],
        templateAttr: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        changeTemplateAttr: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        myEntityCode: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        orEntityCode: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        contractName: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        contractNumber: [
          { required: true, message: ' ', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (Number.isInteger(Number(value)) && Number(value) >= 0) {
                callback()
              } else {
                callback(new Error('请输入大于0的整数'))
              }
            }
          }
        ],
        validYear: [
          {
            validator: (rule, value, callback) => {
              if (Number.isInteger(Number(value)) && Number(value) >= 0) {
                callback()
              } else {
                callback(new Error('请输入大于0的整数'))
              }
            }
          }
        ],
        uploadListOne: [
          { required: true, message: '合同可编辑必传', trigger: 'blur' }
        ],
        contractDesc: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        excludedAmount: [
          { required: false, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let num = this.ruleForm.includedAmount
              var reg = /^([1-9]\d*|0)(\.\d{0,2})?$/
              console.log(value, 22222222222222)
              if (value !== '' && value !== null) {
                if (!reg.test(value)) {
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
          { required: true, message: ' ', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let num = this.ruleForm.excludedAmount
              var reg = /^([1-9]\d*|0)(\.\d{0,2})?$/
              if (value !== '' && value !== null) {
                if (!reg.test(value)) {
                  callback(new Error('不能为负数或者小数点不超过2位'))
                } else {
                  if (num) {
                    if (num - value > 0) {
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
      orEntityCode: [],
      templateList: [],
      tableData: [],// 小工具
      tableContractList: [], // 关键记录
      workFlowList: [], // 合同范本选择
      workFlowList1: [], // 合同范本选择
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
      butShow: [],
      uploadListOne: [],
      uploadListTwo: [],
      uploadListTree: [],
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
      dictCode: '',
      templateAttr: '',
      changeTemplateAttr: '',
      statueList: [],
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.ruleForm.validDateStart.replace(/-/g, '/')).getTime()
        },
      },
      businessAttamentId: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  mounted () {
    this.$nextTick(() => {
      const { draftTypeCode } = this.$route.query
      this.domShow = ['CON002', 'CON003'].includes(draftTypeCode)
      this.$route.meta[2].title = draftTypeObj[draftTypeCode]
      this.ruleForm = {
        ...this.ruleForm,
        memberName: this.userInfo.userName,
        memberUnitName: this.userInfo.orgName,
        phone: this.userInfo.phone,
        draftTypeCode: draftTypeCode,
        draftTypeName: draftTypeObj[draftTypeCode],
        validDateType: draftTypeCode === 'CON003' ? '4' : ''
      }
      this.dictSectStatus() //
      this.dictSelectList() // 获取关联性质
      this.getContractNo()
      this.init()
    })
  },
  methods: {
    selectClear () {
      this.editShow = false
      this.scretShow = false
      this.searchFormOriginal.parentContractNo = ''
      this.getContractNo()
      this.handleGoBack()
    },
    treeSelect (node) {
      this.ruleForm.contractTypeCode = node.dictCode
      if(this.ruleForm.templateAttr!=='CTA003'){
        this.contractChange(node.dictCode)
      } else {
        this.getDictSelectList(node.dictCode)
      }
      this.ruleForm.contractScenario = ''
    },
    setError (rule, value, callback) {
      var reg = /^([1-9]\d*|0)(\.\d{0,2})?$/
      if (value) {
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
    chooseDate () {
      if (this.ruleForm.validDateStart && this.ruleForm.validDateEnd) {
        if (new Date(this.ruleForm.validDateEnd.replace(/-/g, '/')).getTime() < new Date(this.ruleForm.validDateStart.replace(/-/g, '/')).getTime()) {
          this.ruleForm.validDateEnd = ''
          this.$message.error('合同止期必须大于合同起期,请重新选择时间！')
        }
      }
    },
    // 限制我方对方选择
    limitcount (e) {
      if (e.length > 5) {
        this.$message.warning('最多选五个')
        e.pop()
      }
    },
    /**
     * 跳转原合同
     */
    handleGoTo (row) {
      this.$router.push({
        name: 'changevoid',
        query: { type: 'view', id: row.contractId }
      })
    },
    // 获取状态
    async dictSectStatus () {
      const { code, data } = await dictSelectList({
        parentCode: 'CONTRACT_STATUE'
      })
      if (code === '000000') {
        this.statueList = data
      }
    },
    // 分解表格状态码现在中文状态
    getStatue (row) {
      let obj = this.statueList.filter(item => item.dictCode === row.statue)
      if (obj.length > 0) {
        return obj[0].dictName
      } else {
        return ''
      }
    },
    /**
     * 关联性质
     */
    async dictSelectList () {
      const { code, data } = await dictSelectList({
        parentCode: 'CON_TYPE'
      })
      if (code === '000000') {
        this.relatedCodeList = data
      }
    },
    /**
     * 查询原合同编号
     */
    async getContractNo (params) {
      const { type, dictCode, draftTypeCode } = this.$route.query
      const { code, data } = await getContractNo({
        ...this.searchFormOriginal,
        incomeExpeTypeCode: dictCode
      })
      if (code === '000000') {
        this.originalList = data.records
        this.searchFormOriginal.total = data.total
        if (params) {
          if (data.records.length <= 0) {
            this.handleGoBack()
            this.ruleForm.parentContractNo = JSON.parse(JSON.stringify(params))
            this.editShow = false
            this.scretShow = false
            if(draftTypeCode!=='CON004'){
              this.ruleForm.templateAttr = JSON.parse(JSON.stringify('CTA003'))
            }
          }
        } else {
          if (type === 'add') {
            this.ruleForm.parentContractNo = ''
          }
        }
      }
    },
    /**
     * 远程搜索原合同编号
     */
    remoteOriginal (item) {
      this.searchFormOriginal = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        parentContractNo: item
      }
      this.getContractNo(item)
    },
    /**
     * 远程搜索原合同编号分页
     */
    handlerCurrentOriginal (list) {
      this.searchFormOriginal = {
        ...this.searchFormOriginal,
        ...list
      }
      this.getContractNo()
    },
    /**
     * 原合同编号change事件
     */
    originalChange (val) {
      let obj = this.originalList.filter(item => item.contractNo === val)
      if (obj.length > 0) {
        this.ruleForm.originalContractName = obj[0].originalContractName
        this.ruleForm.originalContractId = obj[0].originalContractId
        this.getOrgContract(obj[0])
        this.editShow = true
      } else {
        this.editShow = false
        this.scretShow = false
        this.ruleForm.originalContractName = ''
        this.ruleForm.originalContractId = ''
      }
    },
    /**
     * 收支类型
     */
    incomeCodeChange (code) {
      this.dictCode = code
      this.ruleForm.contractTypeCode = null
      this.ruleForm.contractScenario = ''
      this.ScenarioList = []
    },
    // 刷新页面
    handleShow () {
      this.modlueShow = false
      this.postEidtSing()
    },
    /**
     *  获取关联审批流程
     */
    getWorkFlowList (list) {
      this.ecmContractWorkflowList = list
    },
    /**
     * w我方分页查询
     */
    handlerCurrentPage (list) {
      this.searchForm = {
        ...this.searchForm,
        ...list
      }
      this.getOurSide()
    },
    /**
     * 对方分页查询
     */
    handlerCurrentPage1 (list) {
      this.searchForm1 = {
        ...this.searchForm1,
        ...list
      }
      this.getOtherSide()
    },
    /**
     * 初始化
     */
    init () {
      const { type } = this.$route.query
      this.$nextTick(() => {
        if (type === 'edit') {
          this.postEidtSing()
        }
        this.getOurSide() // 请求我方签约主体
        this.getOtherSide() // 请求对方签约主体
        this.getDictSelectList1()
      })
    },
    /**
     * 合同类型选择
     */
    contractChange (val) {
      this.deleteContract()
      this.getDictSelectList(val)
      this.ruleForm.modelNameList = ''
      if (this.ruleForm.templateAttr !== 'CTA003') {
        this.ruleForm.uploadListOne = []
      }
      if (val) {
        this.getTemplateInfos({
          contractType: val,
          unitId: this.userInfo.unitCode,
        })
      }
    },
    /**
     *  合同范本选择
     */
    async getTemplateInfos (params, text) {
      const { code, data } = await getTemplateInfos(params)
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
     *  合同范本选择
     */
    async getTemplateInfos1 (params, text) {
      const { code, data } = await getTemplateInfos(params)
      if (code === '000000') {
        this.workFlowList1 = data || []
        if (text === 'view') {
          let obj = data.filter(item => item.templateId === this.ruleForm.changeModelCode)
          if (obj.length > 0) {
            this.exportFile = obj[0].showMoney === '1'
          }
        }
      }
    },
    /**
     * 获取原合同合成场景
     */
    async getDictSelectList (val) {
      const { code, data } = await dictSelectList({
        parentCode: val,
        permission: 'UNIT'
      })
      if (code === '000000') {
        this.ScenarioList = data || []
      }
    },
    /**
     * 获取原合同合成场景
     */
    async getDictSelectList1 () {
      const { draftTypeCode } = this.$route.query
      let val = draftTypeCode === 'CON003' ? 'IET739' : 'IET738'
      const { code, data } = await dictSelectList({
        parentCode: val,
        permission: 'UNIT'
      })
      if (code === '000000') {
        this.ScenarioList1 = data || []
      }
    },
    /**
     * 合同范本选择changge
     */
    workChange (val) {
      const { draftTypeCode } = this.$route.query
      if (this.ruleForm.templateAttr && draftTypeCode === 'CON004') {
        const { type } = this.$route.query
        if (type !== 'add') {
          this.deleteContract()
        }
        this.dateShow = ['1', '2', '3', '4'].includes(val.contractValidityType)
        this.ruleForm.validDateType = this.ruleForm.templateAttr === 'CTA001' ? val.contractValidityType : ''
        this.ruleForm.contractName = val.templateName
        this.ruleForm.modelCode = val.templateId
        this.getTemplateUrl(val.templateId)
        this.moneyShow = val.showMoney === '1'
      } else {
        this.$message.error('请先选择合同属性！')
        this.ruleForm.modelNameList = ''
      }

    },
    workChange1 (val) {
      if (this.ruleForm.changeTemplateAttr) {
        const { type } = this.$route.query
        if (type !== 'add') {
          this.deleteContract()
        }
        this.ruleForm.contractName = val.templateName
        this.ruleForm.changeModelName = val.templateName
        this.ruleForm.changeModelCode = val.templateId
        this.getTemplateUrl(val.templateId)
        this.moneyShow = val.showMoney === '1'
      } else {
        this.$message.error('请先选择合同属性！')
        this.ruleForm.modelNameList1 = ''
      }

    },
    changeModelCode (val) {
      this.moneyShow = val === 'IET741' || val === 'IET744'
    },
    /**
     * 获取范本
     */
    async getTemplateUrl (params) {
      const { type, id } = this.$route.query
      const { code, data } = await getTemplateUrl(params)
      if (code === '000000') {
        this.ruleForm.uploadListOne = JSON.parse(JSON.stringify([{
          ...data,
          contractId: id || '',
          businessId: type === 'add' ? '' : this.ruleForm.contractId,
          businessAttamentId: type === 'add' ? '' : this.businessAttamentId,
          fileStatus: 'STA001'
        }]))
      }
    },
    /**
     * 详情接口
     */
    async getOrgContract (params) {
      const { draftTypeCode, type } = this.$route.query
      let flage = (draftTypeCode === 'CON002' && type === 'add') || (draftTypeCode === 'CON003' && type === 'add')
      const { code, data } = await getOrgContract({
        contractId: params.contractId
      })
      this.tableContractList = data.ecmContractInfoChangeList
      this.ruleForm.parentContractId = data.contractId
      let jsona = JSON.stringify(data)
      var jsonb = jsona.replace(/"contractId"/g, '"a"')
        .replace(/"contractProjectId"/g, '"a"')
        .replace(/"contractEntityId"/g, '"a"')
        .replace(/"businessAttamentId"/g, '"a"')
        .replace(/"businessId"/g, '"a"')
        .replace(/"businessMemberId"/g, '"a"')
        .replace(/"contractDocId"/g, '"a"')
        .replace(/"contractRelatedWorkflowId"/g, '"a"')
        .replace(/"workFlowId"/g, '"a"')
        .replace(/"contractFulfillId"/g, '"a"')
      let dataList = JSON.parse(jsonb)
      if (code === '000000') {
        this.$nextTick(() => {
          this.tableData = dataList.contractFulfillList && dataList.contractFulfillList.length > 0 && getTableData(dataList.contractFulfillList) || []
          this.showAttachedListOne = []
          this.showAttachedListTwo = []
          this.showAttachedListTree = []
          this.uploadListOne = this.showAttachedListOne
          this.uploadListTwo = this.showAttachedListTwo
          this.uploadListTree = this.showAttachedListTree
          this.ecmBusinessMemberList = dataList.ecmBusinessMemberList
          this.getEntityData(dataList.contractEntityList)
          this.businessAttamentId = this.uploadListOne.length > 0 && this.uploadListOne[0].businessAttamentId
          this.templateAttr = flage ? '' : dataList.templateAttr
          this.ruleForm = {
            ...this.ruleForm,
            contractScenario: dataList.contractScenario,
            parentContractName: dataList.contractName,
            originalContractId: dataList.originalContractId,
            originalContractName: dataList.originalContractName,
            originalContractNo: dataList.originalContractNo,
            uploadListOne: this.showAttachedListOne,
            memberName: this.userInfo.userName,
            memberUnitName: this.userInfo.orgName,
            phone: this.userInfo.phone,
            contractName: flage ? '' : dataList.contractName || '',
            modelCode: flage ? '' : dataList.modelCode,
            modelNameList: flage ? { templateName: dataList.modelName } : '',
            modelNameList1: '',
            incomeExpeTypeCode: dataList.incomeExpeTypeCode || '',
            contractTypeCode: dataList.contractTypeCode || null,
            templateAttr: flage ? dataList.templateAttr : '',
            changeTemplateAttr: '',
            contractCurrencyCode: dataList.contractCurrencyCode || '人民币',
            contractDesc: flage ? '' : dataList.contractDesc || '',
            originalCurrency: null,
            excludedAmount: null,
            includedAmount: null,
            taxRate: '',
            contractNumber: '',
            scret: dataList.scret || '',
            watermark: dataList.watermark || '',
            validDateStart: '',
            validDateEnd: '',
            projectName: dataList.contractProjectList && dataList.contractProjectList[0] && dataList.contractProjectList[0].projectName || '',
            projectCode: dataList.contractProjectList && dataList.contractProjectList[0] && dataList.contractProjectList[0].projectCode || '',
            contractRelatedList: [],
            myEntityCode: [],
            orEntityCode: [],
            contractArchiveList: [],
            contractPrintList: [],
            ecmContractWorkflowList: [],
            ecmContractHistoryList: [],
            validDateType: draftTypeCode === 'CON003' ? '4' : '',
            validYear: ''
          }
          this.dictCode = dataList.incomeExpeTypeCode || ''
          this.contractProjectList = dataList.contractProjectList || []
          this.ecmContractWorkflowList = dataList.ecmContractWorkflowList || []
          this.showWorkList = []
          this.getOurSide() // 请求我方签约主体
          this.getOtherSide() // 请求对方签约主体
          this.getDictSelectList(this.ruleForm.contractTypeCode)
          this.getTemplateInfos({
            contractType: this.ruleForm.contractTypeCode,
            unitId: dataList.unitCode,
          }, 'view')
        })
        this.scretShow = dataList.scret === 'Y'
      }
    },
    /**
     * 详情接口
     */
    async postEidtSing (val, fileId) {
      const { id, draftTypeCode } = this.$route.query
      const { code, data } = await postEidtSing({
        contractId: id ? id : this.ruleForm.originalContractId
      })
      if (code === '000000') {
        this.$nextTick(() => {
          this.tableData = data.contractFulfillList && data.contractFulfillList.length > 0 && getTableData(data.contractFulfillList) || []
          this.showAttachedListOne = this.setUplod(data.ecmBusinessAttamentList, 'template')
          this.showAttachedListTwo = this.setUplod(data.ecmBusinessAttamentList, '1')
          this.showAttachedListTree = this.setUplod(data.ecmBusinessAttamentList, '2')
          this.uploadListOne = this.showAttachedListOne
          this.uploadListTwo = this.showAttachedListTwo
          this.uploadListTree = this.showAttachedListTree
          this.ecmBusinessMemberList = data.ecmBusinessMemberList
          this.getEntityData(data.contractEntityList)
          this.businessAttamentId = this.uploadListOne.length > 0 && this.uploadListOne[0].businessAttamentId || ''
          this.templateAttr = data.templateAttr
          this.changeTemplateAttr = data.changeTemplateAttr
          this.tableContractList = data.ecmContractInfoChangeList
          this.ruleForm = {
            ...this.ruleForm,
            contractId: data.contractId,
            changeTemplateAttr: data.changeTemplateAttr,
            serialNumber: data.serialNumber,
            contractNo: data.contractNo,
            contractScenario: data.contractScenario,
            parentContractId: data.parentContractId,
            parentContractNo: data.parentContractNo,
            parentContractName: data.parentContractName,
            contractDesc: data.contractDesc,// 变更原因
            draftTypeCode: data.draftTypeCode, // 关联性质code
            draftTypeName: data.draftTypeName, // 关联性质code
            originalContractNo: data.originalContractNo, // 原合同编号
            originalContractId: data.originalContractId, // 原合同id
            originalContractName: data.originalContractName, // 原合同名字
            uploadListOne: this.showAttachedListOne,
            memberName: this.userInfo.userName,
            memberUnitName: this.userInfo.orgName,
            phone: this.userInfo.phone,
            contractName: data.contractName || '',
            modelCode: data.modelCode,
            changeModelCode: data.changeModelCode,
            changeModelName: data.changeModelName,
            modelNameList: { templateName: data.modelName, } || '',
            modelNameList1: { templateName: data.changeModelName, } || '',
            modelName: data.modelName,
            incomeExpeTypeCode: data.incomeExpeTypeCode || '',
            contractTypeCode: data.contractTypeCode || null,
            templateAttr: data.templateAttr || '',
            contractCurrencyCode: data.contractCurrencyCode || '',
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
            ecmContractHistoryList: [],
            validDateType: data.validDateType || '',
            validYear: data.validYear || ''
          }
          this.tableContractList = data.ecmContractInfoChangeList
          this.contractProjectList = data.contractProjectList || []
          this.ecmContractWorkflowList = data.ecmContractWorkflowList || []
          this.showWorkList = data.ecmContractWorkflowList || []
          if (data.templateAttr === 'CTA003' || data.changeTemplateAttr === 'CTA003') {
            this.ruleForm.uploadListOne[0].fileName = this.ruleForm.contractName + '.doc'
          }
          this.dictCode = data.incomeExpeTypeCode || ''
          this.getTemplateInfos({
            contractType: this.ruleForm.contractTypeCode,
            unitId: this.userInfo.unitCode,
          }, 'view')
          this.({
            contractType: draftTypeCode === 'CON003' ? 'IET739' : 'IET738',
            unitId: this.userInfo.unitCode,
          }, 'view')
          this.getOurSide() // 请求我方签约主体
          this.getOtherSide() // 请求对方签约主体
          this.getDictSelectList(this.ruleForm.contractTypeCode)
          if (draftTypeCode === 'CON002' && this.ruleForm.changeTemplateAttr === 'CTA003') {
            this.changeModelCode(this.ruleForm.changeModelCode)
          }

          if (val === 2) {
            let token = this.$Cookie.get('token')
            let businessId = draftTypeCode === 'CON004' ? this.ruleForm.modelCode : this.ruleForm.changeModelCode
            let businessAttamentId = this.uploadListOne.length > 0 && this.uploadListOne[0].businessAttamentId || ''
            let fileName = this.uploadListOne.length > 0 && this.uploadListOne[0].fileName || ''
            let atrr = draftTypeCode === 'CON004' ? data.templateAttr : data.changeTemplateAttr
            // 如果合同范本属性不等于 非标准范本的时候
            if (atrr === 'CTA001' || (atrr === 'CTA002' && this.ruleForm.uploadListOne[0].fileStatus === 'STA001')) {
              this.getFile()
            } else {
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
    async getOurSide () {
      const { code, data } = await getOurSide({
        ...this.searchForm
      })
      if (code === '000000') {
        const list = this.ruleForm.myEntityCode.concat(data.content) || []
        let obj = {}
        this.ourSideList = list.reduce((cur, next) => {
          obj[next.company] ? '' : obj[next.company] = true && cur.push(next)
          return cur
        }, [])
        this.searchForm.total = data.total
      }
    },
    /**
     * 我方签约主体远程搜索
     */
    remoteMethod (item, num) {
      if (num === 0) {
        this.searchForm = {
          ...this.searchForm,
          currentPage: 1,
          pageSize: 10,
          total: 0,
          descr: item
        }
        this.getOurSide()
      } else {
        this.searchForm1 = {
          ...this.searchForm1,
          currentPage: 1,
          pageSize: 10,
          total: 0,
          cooperationName: item
        }
        this.getOtherSide()
      }
    },
    /**
     * 我方获取焦点重置下啦
     */
    entityFocus (num) {
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
    getEntityData (data) {
      const list = []
      const list1 = []
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
        this.ruleForm.myEntityCode = list
        this.ruleForm.orEntityCode = list1
        this.orEntityCode = list1
      })
    },
    /**
     *  对方签约主体
     */
    async getOtherSide () {
      const { code, data } = await getOtherSide({
        ...this.searchForm1,
        unitCode: this.userInfo.unitCode
      })
      if (code === '000000') {
        const list = this.ruleForm.orEntityCode.concat(data.content) || []
        let obj = {}
        this.otherSideList = list.reduce((cur, next) => {
          obj[next.cooperationCode] ? '' : obj[next.cooperationCode] = true && cur.push(next)
          return cur
        }, [])
        this.searchForm1.total = data.total
      }
    },
    /**
     * 我方签约主体change
     * num 标识 ENT01我方 ENT02对方
     */
    sideChange (val, num) {
      const { id } = this.$route.query
      val.map(item => {
        item.entityType = num
        item.contractId = id ? id : ''
        item.entityCode = item.company
        item.entityName = item.descr
        item.entityId = item.company
        item.contractEntityId = ''
      })
      this.ruleForm.myEntityCode = val
      let _this = this
      setTimeout(function () {
        _this.$refs.myentuty.blur()
      }, 50)
    },
    /**
     * 对方对方签约主体change
     * num 标识 ENT01我方 ENT02对方
     */
    sideChange1 (val) {
      const { id } = this.$route.query
      let arr = []
      let sun = rand(1, 9999)
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
      this.orEntityCode = arr
      let _this = this
      setTimeout(function () {
        _this.$refs.orentuty.blur()
      }, 50)
    },
    /**
     * 设置合同分列
     */
    setUplod (val, name) {
      const { type } = this.$route.query
      const list = []
      if (val && val.length > 0) {
        val.forEach(item => {
          if (item.businessType === name) {
            if (item.businessType !== 'template') {
              list.push({
                ...item
              })
            } else {
              if (item.fileType === 'doc') {
                if (type === 'add') {
                  list.push({
                    ...item,
                    fileStatus: 'STA001'
                  })
                } else {
                  list.push({
                    ...item
                  })
                }
              }
            }
          }
        })
        return list
      } else {
        return []
      }
    },
    /**
     *选择合同生效期格式
     */
    changeTimeType (val) {
      this.ruleForm.validYear = ''
      this.ruleForm.validDateStart = ''
      this.ruleForm.validDateEnd = ''
      if (val === '1') {
        this.$refs.ruleForm.clearValidate('validYear')
      } else {
        this.$refs.ruleForm.clearValidate('validDateStart')
        this.$refs.ruleForm.clearValidate('validDateEnd')
      }
    },
    /**
     * 选择合同范本属性
     */
    handleChange (val) {
      this.ruleForm.validDateType = ''
      this.dateShow = false
      const { type } = this.$route.query
      this.moneyShow = val !== 'CTA001'
      this.deleteContract()
      this.templateAttr = val
      this.ruleForm.modelNameList = ''
      this.ruleForm.contractName = ''
      this.ruleForm.contractScenario = ''
      this.ruleForm.uploadListOne = []
      if (val === 'CTA003') {
        this.ruleForm.uploadListOne = [{
          fileName: '新建合同',
          fileType: 'doc',
          contractId: type === 'add' ? '' : this.ruleForm.contractId,
          businessId: type === 'add' ? '' : this.ruleForm.contractId,
          businessAttamentId: type === 'add' ? '' : this.businessAttamentId,
          fileStatus: 'STA001',
          businessType: 'template',
        }]
      }
    },
    handleChangeAttr (val) {
      const { type, draftTypeCode } = this.$route.query
      this.getTemplateInfos1({
        contractType: draftTypeCode === 'CON003' ? 'IET739' : 'IET738',
        unitId: this.userInfo.unitCode,
      })
      this.moneyShow = val !== 'CTA001'
      this.deleteContract()
      this.changeTemplateAttr = val
      this.ruleForm.modelNameList1 = ''
      this.ruleForm.contractName = ''
      this.ruleForm.changeModelCode = ''
      this.ruleForm.changeModelName = ''
      this.ruleForm.uploadListOne = []
      if (val === 'CTA003') {
        this.ruleForm.uploadListOne = [{
          fileName: '新建合同',
          contractId: type === 'add' ? '' : this.ruleForm.contractId,
          fileType: 'doc',
          businessId: type === 'add' ? '' : this.ruleForm.contractId,
          businessAttamentId: type === 'add' ? '' : this.businessAttamentId,
          fileStatus: 'STA001',
          businessType: 'template',
        }]
      }
    },
    async deleteContract () {
      const { code } = await deleteContract({
        contractId: this.$route.query.id
      })
    },
    /**
     * 选择合同币种的change
     */
    changeMoney () {
      this.ruleForm.originalCurrency = ''
    },
    /**
     * 新增小工具
     */
    handleAddList () {
      const { type, id } = this.$route.query
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
    handleOpen () {
      this.show = !this.show
    },
    handleDeleteClick (index) {
      this.tableData.splice(index, 1)
    },
    /**
     * 获取上传信息
     */
    getFileListTwo (list) {
      list.forEach((item => {
        item.businessType = 1
      }))
      this.uploadListTwo = list
    },
    /**
     * 获取上传信息
     */
    getFileListTree (list) {
      list.forEach((item => {
        item.businessType = 2
      }))
      this.uploadListTree = list
    },
    /**
     * 合成预览
     */
    async handleSynthesis () {
      let params = [
        ...this.ruleForm.uploadListOne,
        ...this.uploadListTwo
      ]
      let text = ''
      if (params && params.length > 0) {
        const token = Cookies.get('token')
        params.map((item => {
          text += item.fileId + ','
        }))
        let fileId = getText(text)
        let contractName = this.ruleForm.contractName
        window.open(encodeURI(process.env.VUE_APP_API_URL + '/contract/ecm-snap-business-attament/mergeFile?fileId=' + fileId + '&contractName=' + contractName + '&token=' + token, '_black'))
      } else {
        this.$message.error('合成文件必须大于一个！')
      }
    },
    /**
     * 弹窗取消
     */
    handleCancel () {
      this.visible = false
    },
    /**
     * 获取参数
     */
    getParams (val) {
      const { id } = this.$route.query
      return {
        contractId: val === 'edit' ? id : '',
        changeTemplateAttr: this.ruleForm.changeTemplateAttr,
        changeModelName: this.ruleForm.changeModelName,
        changeModelCode: this.ruleForm.changeModelCode,
        contractNo: this.ruleForm.contractNo,
        contractScenario: this.ruleForm.contractScenario,
        parentContractId: this.ruleForm.parentContractId,
        parentContractNo: this.ruleForm.parentContractNo,
        parentContractName: this.ruleForm.parentContractName,
        draftTypeCode: this.ruleForm.draftTypeCode, // 关联性质code
        draftTypeName: this.ruleForm.draftTypeName, // 关联性质code
        originalContractNo: this.ruleForm.originalContractNo, // 原合同编号
        originalContractId: this.ruleForm.originalContractId, // 原合同id
        originalContractName: this.ruleForm.originalContractName, // 原合同名字
        contractName: this.ruleForm.contractName,
        incomeExpeTypeCode: this.ruleForm.incomeExpeTypeCode || '',
        contractTypeCode: this.ruleForm.contractTypeCode || '',
        templateAttr: this.ruleForm.templateAttr || '',
        contractCurrencyCode: this.ruleForm.contractCurrencyCode || '',
        contractDesc: this.ruleForm.contractDesc || '',
        originalCurrency: (this.ruleForm.originalCurrency != null && this.ruleForm.originalCurrency !== '') ? this.ruleForm.originalCurrency * 1000 / 10 : null,
        excludedAmount: (this.ruleForm.excludedAmount != null && this.ruleForm.excludedAmount !== '') ? this.ruleForm.excludedAmount * 1000 / 10 : null,
        includedAmount: this.ruleForm.includedAmount * 1000 / 10,
        taxRate: this.ruleForm.taxRate,
        contractNumber: this.ruleForm.contractNumber || '',
        modelName: this.ruleForm.modelNameList.templateName || '',
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
        contractSignList: [],
        contractEntityList: [...this.ruleForm.myEntityCode, ...this.orEntityCode],
        contractFulfillList: this.tableData.length > 0 && setTableData(this.tableData) || [],
        ecmBusinessMemberList: this.ecmBusinessMemberList || [],
        ecmBusinessAttamentList: [
          ...this.ruleForm.uploadListOne,
          ...this.uploadListTwo,
          ...this.uploadListTree
        ],
        contractRelatedList: [],
        contractArchiveList: [],
        contractPrintList: [],
        ecmContractHistoryList: [],
        ecmContractWorkflowList: this.ecmContractWorkflowList,
        generateWayCode: 'TYP01'
      }
    },
    /**
     *  保存
     */
    async handleSubmit () {
      const { type } = this.$route.query
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (type === 'add') {
            this.postAdd(this.getParams('add'))
          } else {
            this.singEdit(this.getParams('edit'))
          }
        } else {
          this.$message({
            type: 'error',
            message: '请把信息填写完整'
          })
        }
      })
    },
    /**
     * 保存接口
     */
    async postAdd (params, val, fileId) {
      const { id, draftTypeCode } = this.$route.query
      const { data, code, mesg } = await singAdd(params)
      if (code === '000000') {
        this.$message({
          type: 'success',
          message: mesg
        })
        this.$router.push({
          name: 'changevoid',
          query: {
            type: 'edit',
            id: data,
            dictCode: this.$route.query.dictCode,
            draftTypeCode: this.ruleForm.draftTypeCode
          }
        })
        setTimeout(() => {
          // 下一步
          if (val === 1) {
            let arr = []
            this.ruleForm.myEntityCode.map(item => {
              arr.push(item.entityId)
            })
            this.approvalParams = {
              objectTypeCode: approvalTypeCode[this.$route.query.draftTypeCode],
              orgCode: this.userInfo.orgCode || '',
              contractTypeCode: this.ruleForm.contractTypeCode || '',
              quoteTemplate: draftTypeCode === 'CON004' ? this.ruleForm.templateAttr : 'CTA003',
              minAmount: this.ruleForm.includedAmount,
              businessId: id ? id : data,
              contractScenario: this.ruleForm.contractScenario || '',  //合同场景
              validDateStart: this.ruleForm.validDateStart || '', //有效期开始时间
              validDateEnd: this.ruleForm.validDateEnd || '',   //有效期结束时间
              validYear: this.ruleForm.validYear || '',   //签订之日**年
              entityAttribute: arr.length > 0 ? arr.join() : '',  //签约主体ID
            }
            if (this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].fileStatus === 'STA002') {
              this.visible = true
            } else {
              this.$message.error('请点击编辑合同，并进行保存，否则无法进行流程发起！')
            }
          }
          this.postEidtSing(val, fileId)
        }, 500)
      }
    },
    /**
     * 编辑接口
     */
    async singEdit (params, val, fileId) {
      const { id, draftTypeCode } = this.$route.query
      const { code } = await singEdit(params)
      if (code === '000000') {
        setTimeout(() => {
          this.postEidtSing(val, fileId)
          if (val === 1) {
            let arr = []
            this.ruleForm.myEntityCode.map(item => {
              arr.push(item.entityId)
            })
            this.approvalParams = {
              objectTypeCode: approvalTypeCode[this.$route.query.draftTypeCode],
              orgCode: this.userInfo.orgCode || '',
              contractTypeCode: this.ruleForm.contractTypeCode || '',
              quoteTemplate: draftTypeCode === 'CON004' ? this.ruleForm.templateAttr : 'CTA003',
              minAmount: this.ruleForm.includedAmount,
              businessId: id ? id : '',
              contractScenario: this.ruleForm.contractScenario || '',  //合同场景
              validDateStart: this.ruleForm.validDateStart || '', //有效期开始时间
              validDateEnd: this.ruleForm.validDateEnd || '',   //有效期结束时间
              validYear: this.ruleForm.validYear || '',   //签订之日**年
              entityAttribute: arr.length > 0 ? arr.join() : '',  //签约主体ID
            }
            if (this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].fileStatus === 'STA002') {
              this.visible = true
            } else {
              this.$message.error('请点击编辑合同，并进行保存，否则无法进行流程发起！')
            }
          }
        }, 500)
      }
    },
    /**
     * 下一步
     */
    handleNextStep () {
      this.$confirm('请确认本页字段和合同文本中需要填写的空项已经填写齐全、准确', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { type, id } = this.$route.query
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (type === 'add') {
              this.postAdd(this.getParams('add'), 1)
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
      })
    },
    /**
     * 取消
     */
    handleGoBack () {
      const { draftTypeCode } = this.$route.query
      this.$refs.ruleForm.resetFields()
      this.ruleForm.originalContractId = ''
      this.ruleForm.modelCode = ''
      this.ruleForm.contractTypeCode = null
      this.showAttachedListOne = []
      this.showAttachedListTwo = []
      this.showAttachedListTree = []
      this.uploadListOne = []
      this.uploadListTwo = []
      this.uploadListTree = []
      this.tableData = []
      this.contractEntityList = []
      this.contractSignList = []
      this.contractProjectList = []
      this.ecmContractWorkflowList = []
      this.ruleForm.parentContractId = ''
      this.ruleForm.parentContractName = ''
      this.ruleForm.originalContractNo = ''
      this.ruleForm.originalContractId = ''
      this.ruleForm.originalContractName = ''
      this.dictCode = '0'
      this.ruleForm.validDateType = draftTypeCode === 'CON003' ? '4' : ''
    },
    /**
     *  保存审批人 跳转
     * @param params
     * @returns {Promise<void>}
     */
    async getApprovlStart (params) {
      const { id } = this.$route.query
      const { code } = await getApprovlStart({
        ...params,
        contractId: id,
      })
      if (code === '000000') {
        this.visible = false
        this.$router.push({ name: 'agencymatter' })
      }
    }
    ,
    /**
     *  点击可编辑合同
     * @param val 1预览  2 编辑 3下载
     */
    editUploadClick (item, val) {
      const { draftTypeCode } = this.$route.query
      if (draftTypeCode === 'CON004') {
        if (this.ruleForm.templateAttr === 'CTA003' && this.ruleForm.contractName == '') {
          this.$message.error('请填写合同名称')
          return false
        }
      } else {
        if (this.ruleForm.changeTemplateAttr === 'CTA003' && this.ruleForm.contractName == '') {
          this.$message.error('请填写合同名称')
          return false
        }
      }
      let token = this.$Cookie.get('token')
      const { type, id } = this.$route.query
      if (val === 1) {
        //调用iwebOffice
        OpenKgWindow('?openType=open&readType=readyOnly&fileId=' + item.fileId + '&token=' + token)
      } else if (val === 2) {
        this.modlueShow = true
        this.loading = true
        if (type === 'add') {
          this.postAdd(this.getParams('add'), 2, item.fileId)
        } else {
          this.singEdit(this.getParams('edit', id), 2, item.fileId)
        }
      } else {
        const token = Cookies.get('token')
        window.open(downloadUrl + `/${item.fileId}?token=${token}`)
      }
    },
    // 获取合同范本的fildId
    async getFile () {
      const { draftTypeCode } = this.$route.query
      const { code, data } = await editFile({
        businessId: draftTypeCode === 'CON004' ? this.ruleForm.modelCode : this.ruleForm.changeModelCode,
        contractId: this.ruleForm.contractId,
        templateAttr: draftTypeCode === 'CON004' ? this.ruleForm.templateAttr : this.ruleForm.changeTemplateAttr,
        dataType: 0
      })
      if (code === '000000') {
        let fileId = data.fileId
        let id = this.ruleForm.contractId
        let token = this.$Cookie.get('token')
        let businessId = this.ruleForm.modelCode || ''
        let businessAttamentId = this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].businessAttamentId || ''
        let fileName = this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].fileName || ''
        let atrr = draftTypeCode === 'CON004' ? this.ruleForm.templateAttr : this.ruleForm.changeTemplateAttr
        // 如果合同范本属性不等于 非标准范本的时候
        OpenKgWindow('?openType=open&isUser=one&docFileName=' + encodeURIComponent(this.ruleForm.contractName) + '&isSave=true&operateType=contract&fileId=' + fileId + '&contractId=' + id + '&businessId=' + businessId + '&businessAttamentId=' + businessAttamentId + '&fileName=' + fileName + '&atrr=' + atrr + '&token=' + token)
      } else {
        this.modlueShow = false
        this.loading = false
      }
    }
  }
}
</script>
<style lang="less">
.el-popover--plain {
  font-family: PingFangSC-Medium, serif;
  background: #F5F6F7;
  color: #00a2d4;
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
  z-index: 20;
}
</style>
