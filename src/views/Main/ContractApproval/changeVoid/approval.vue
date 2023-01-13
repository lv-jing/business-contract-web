<template>
  <div v-loading="loading">
    <div class="modlue-box"
         @click="handleShow"
         v-show="modlueShow"
         element-loading-text="请点击一下页面，用以触发后台刷新，使word中修改的结构化字段同步至发起页面"
         v-loading="modlueLoading"></div>
    <el-row :gutter="24">
      <el-col :span="19">
        <div class="bg-white">
          <el-card class="box-card" shadow="never">
            <div slot="header">
              <div style="text-align: center;">
                <b style="font-size: 16px;">合同申请单</b>
              </div>
              <span v-if="ruleForm.contractNo" style="font-size: 12px;float: right;">合同编号：{{
                  ruleForm.contractNo
                }}</span>
              <span v-else style="font-size: 12px;float: right;">合同流水号：{{ ruleForm.serialNumber }}</span>
            </div>
            <div class="form-bg">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <common-title title="原合同信息" class="mt10 mb20"/>
                <el-row :gutter="24">
                  <el-col :span="10">
                    <el-form-item label="关联性质">
                      <el-input :disabled="true" v-model="ruleForm.draftTypeName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" :offset="2">
                    <el-form-item label="原合同编号">
                      <el-input :disabled="true" v-model="ruleForm.parentContractNo"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="10">
                    <el-form-item label="原合同名称" prop="parentContractName">
                      <el-input disabled
                                v-model="ruleForm.parentContractName"></el-input>
                    </el-form-item>
                  </el-col>
                  <div v-if="domShow">
                    <el-col :span="10" :offset="2">
                      <el-form-item label="原收支类型" prop="incomeExpeTypeCode">
                        <common-select
                            disabled
                            v-model="ruleForm.incomeExpeTypeCode"
                            dictCode="INCOME_EXPE_TYPE"
                            attribute2="CON004"
                            :value="ruleForm.incomeExpeTypeCode"
                            placeholder="请选择收支类型"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="原合同类型" prop="contractTypeCode">
                        <CommonTreeSelect
                            disabled
                            :value="ruleForm.contractTypeCode"
                            :treeSelect="treeSelect"
                            :dict-code="dictCode"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="10" v-if="ruleForm.templateAttr==='CTA003'" :offset="2">
                      <el-form-item label="原合同场景" prop="contractScenario">
                        <el-select filterable v-model="ruleForm.contractScenario"
                                   disabled class="w-100">
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
                            message: '请选择原合同范本',trigger: 'blur' }]">
                        <el-select
                            disabled
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
                        <span>{{ ruleForm.memberName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="1">
                      <el-form-item label="发起部门:">
                        <span>{{ ruleForm.orgName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item label="联系方式:">
                        <span>{{ ruleForm.phone }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-row :gutter="24">
                  <el-col :span="22">
                    <el-form-item :label="$route.query.draftTypeCode!=='CON004'?'变动原因':'合同描述'" prop="contractDesc">
                      <el-input
                          :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                          type="textarea"
                          maxlength="80" :autosize="{ minRows: 1, maxRows: 4}"
                          show-word-limit v-model="ruleForm.contractDesc"
                          placeholder="请输人，字数不超过80字"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 续签 -->
                <div v-if="!domShow">
                  <el-row :gutter="24">
                    <el-col :span="10">
                      <el-form-item label="收支类型">
                        <common-select
                            disabled
                            v-model="ruleForm.incomeExpeTypeCode"
                            dictCode="INCOME_EXPE_TYPE"
                            :value="ruleForm.incomeExpeTypeCode"
                            placeholder="请选择收支类型"
                            :isSplicing="false"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="2">
                      <el-form-item label="合同类型" prop="contractTypeCode">
                        <CommonTreeSelect
                            :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
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
                            :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
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
                                       message: '请选择合同范本',trigger: 'blur' }]">
                        <el-select
                            :disabled="this.ruleForm.templateAttr==='CTA003' || $route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
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
                        <el-select
                            :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                            filterable
                            v-model="ruleForm.contractScenario"
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
                            :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
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
                            message: '请选择合同范本',trigger: 'blur' }]">
                        <el-select
                            :disabled="this.ruleForm.changeTemplateAttr==='CTA003'||$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
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
                        <el-select
                            :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                            filterable @change="changeModelCode"
                            v-model="ruleForm.changeModelCode"
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
                      <el-input
                          :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'||ruleForm.changeTemplateAttr!=='CTA003'"
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
                        :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                        content="请仔细核对签约主体的准确性，与营业执照（公司）/身份证（个人）的名称保持一致！">
                      <el-form-item label="我方主体" prop="myEntityCode" slot="reference">
                        <el-select multiple filterable v-model="ruleForm.myEntityCode"
                                   value-key="company"
                                   placeholder="请选择"
                                   class="w-100"
                                   ref="myentuty"
                                   remote @input="(val)=>limitcount(val)"
                                   :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
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
                        :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                        content="请仔细核对签约主体的准确性，与营业执照（公司）/身份证（个人）的名称保持一致！">
                      <el-form-item label="对方主体" prop="orEntityCode" slot="reference">
                        <el-select multiple filterable @change="(val)=>sideChange1(val,'ENT02')"
                                   v-model="ruleForm.orEntityCode"
                                   remote allow-create ref="orentuty"
                                   @input="(val)=>limitcount(val)"
                                   :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                                   @focus="entityFocus(1)"
                                   :remote-method="(val)=>remoteMethod(val,1)"
                                   placeholder="请选择" value-key="cooperationCode"
                                   class="w-100 over-select">
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
                            :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                            v-model="ruleForm.contractCurrencyCode"
                            dictCode="CONTRACT_SURRENCY"
                            :value="ruleForm.contractCurrencyCode"
                            :handleChange="changeMoney"
                            :isSplicing="false"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="2">
                      <el-form-item label="原币金额"
                                    prop="originalCurrency" :rules="[{
                                              required: !(this.ruleForm.contractCurrencyCode==='人民币'), message: '请输入原币金额',
                                              trigger: 'blur' },
                                              {validator: (rule, value, callback) => this.setError(rule, value, callback)}]">
                        <el-input maxlength="15"
                                  :disabled="this.ruleForm.contractCurrencyCode==='人民币'||$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                                  v-model="ruleForm.originalCurrency"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="10">
                      <el-form-item label="不含税额" prop="excludedAmount">
                        <el-input maxlength="15"
                                  :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                                  v-model="ruleForm.excludedAmount">
                          <template slot="append">元</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="2">
                      <el-form-item label="合同税率" prop="taxRate">
                        <el-input v-model="ruleForm.taxRate"
                                  :disabled="this.ruleForm.contractCurrencyCode !== '人民币'||$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'">
                          <template slot="append">%</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="10">
                      <el-form-item label="含税金额" prop="includedAmount">
                        <el-input maxlength="15"
                                  :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                                  v-model="ruleForm.includedAmount">
                          <template slot="append">元</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-row :gutter="24">
                  <el-col :span="10">
                    <el-form-item label="合同份数" prop="contractNumber">
                      <el-input
                          :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                          type="number"
                          class="w-100 t-l" v-model="ruleForm.contractNumber"
                          min="0"
                          :controls="false"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" :offset="2">
                    <el-form-item label="合同期限" prop="validDateType">
                      <common-select
                          :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                          v-model="ruleForm.validDateType"
                          dictCode="VILAD_TYPE"
                          :value="ruleForm.validDateType"
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
                            message: ruleForm.validDateType==='1'?'合同起期必选':'签订日期必选',trigger: 'blur' }]">
                      <el-date-picker
                          :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
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
                            message: '合同止期必选',trigger: 'blur' }]">
                      <el-date-picker
                          :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                          class="w-100"
                          v-model="ruleForm.validDateEnd"
                          type="date"
                          @change="chooseDate"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :picker-options="pickerOptions"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" :offset="2">
                    <el-form-item label="年份数量" prop="validYear" v-if="ruleForm.validDateType==='2'"
                                  :rules="[{ required: this.ruleForm.validDateType==='2',
                            message: '年份数量必输',trigger: 'blur' }]">
                      <el-input
                          :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                          :min="0" type="number"
                          v-if="ruleForm.validDateType&&ruleForm.validDateType==='2'"
                          v-model="ruleForm.validYear">
                        <template slot="append">年</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="10">
                    <el-form-item label="是否保密" prop="scret">
                      <el-radio-group
                          :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                          v-model="ruleForm.scret">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" :offset="2">
                    <el-form-item label="防伪水印" prop="watermark">
                      <el-radio-group
                          :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                          v-model="ruleForm.watermark">
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
                      <el-button slot="reference" style="margin-left: 10px;" @click="handleSynthesis" size="mini"
                                 type="primary">合成预览
                      </el-button>
                    </el-popover>
                  </common-title>
                  <el-row :gutter="24">
                    <el-col :span="22">
                      <el-form-item label="合同文本" prop="uploadListOne">
                        <span style="color:#409EFF;font-size: 12px;margin-left: 10px;">(请在本区域使用金格软件进行编辑)</span>
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
                                <a @click="editUploadClick(item,1)" href="javascript:;">预览</a>
                                <a @click="editUploadClick(item,3)" href="javascript:;">下载</a>
                                <a @click="editUploadClick(item,2)"
                                   v-if="$route.query.sourceType!=='INAPPROPRIATEPROCESS'"
                                   href="javascript:;">编辑</a>
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
                            :isRegShow="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                            :isDel="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                            :content="'尽量使合同可编辑，对于不可编辑部分需按照其在合同中的顺序上传至此区域'"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="22">
                      <el-form-item label="前置审批" prop="workFlowId">
                        <common-relation
                            content="可在此处关联前置立项、定价、签呈等审批流程"
                            :disabled="$route.query.taskKey==='start'&&$route.query.sourceType!=='INAPPROPRIATEPROCESS'"
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
                            :isDel="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                            :content="'除上述前置审批中关联的流程，其他与合同相关的见证资料在此上传，包括但不限于资质、定价、立项、授权等文件'"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <common-title title="项目信息" class="mb16"/>
                <el-row :gutter="24">
                  <el-col :span="10">
                    <el-form-item label="项目名称" prop="projectName">
                      <el-input :maxlength="30"
                                :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                                v-model="ruleForm.projectName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" :offset="2">
                    <el-form-item label="项目编号" prop="projectCode">
                      <el-popover
                          placement="top-start"
                          width="250"
                          trigger="hover"
                          :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                          content="填写项目编号可以实现同一项目相关合同关联">
                        <el-input :maxlength="30" slot="reference"
                                  :disabled="$route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS'"
                                  v-model="ruleForm.projectCode"></el-input>
                      </el-popover>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="border-top">
                  <el-col :span="22">
                    <common-title title="小工具-提醒" class="mt20 mb20"/>
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
                          <el-input
                              v-model="row.remindMatter"></el-input>
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
                  </el-col>
                  <el-col :span="22">
                    <common-title title="关联记录" class="mt20 mb20"/>
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
        </div>
      </el-col>
      <el-col :span="5">
        <common-mode
            v-on:getApprovalParams="getApprovalParams"
        />
      </el-col>
    </el-row>
    <commonApproval
        :visible="visible"
        :handleCancel="handleCancel"
        :approvalParams="approvalParams"
        @get-approvl-start="getApprovlStart"
        :isShow="true"
    />
  </div>
</template>

<script>
/* eslint-disable */
import CommonUpload from '@/components/CommonUpload' // 上传
import { getDetail, getAuditApprove, rejectProcess, getConsult } from '@/service/work'
import { deleteContract, editFile, getContractType, getOtherSide, getOurSide, singEdit } from '@/service/approval'
import { getTemplateInfos, getTemplateUrl } from '@/service/template'
import { mapState } from 'vuex'
import { draftTypeObj, OpenKgWindow, approvalTypeCode, getTableData, setTableData, rand, getText } from '@/utils/tools'
import { dictSelectList } from '@/service/common'
import { downloadUrl } from '@/service/file'
import Cookies from 'js-cookie'

export default {
  components: {
    CommonUpload
  },
  data () {
    return {
      domShow: true,
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() < new Date().getTime() - 8.64e7
        },
      },
      dictCode: '',
      ScenarioList: [],
      ScenarioList1: [],
      loading: false,
      modlueShow: false,
      modlueLoading: false,
      pinionsList: [],// 审批意见数据
      approvalObj: {},
      workflowList: {
        approverOpinions: '',
        approverType: 'TEXT',
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
        changeTemplateAttr: '',
        changeModelCode: '',
        changeModelName: '',
        serialNumber: null,
        contractNo: '', // 当前合同编号
        contractDesc: '',// 变更原因
        draftTypeCode: '', // 关联性质code
        draftTypeName: '', // 关联性质Name
        parentContractId: '', // 原合同编号
        parentContractNo: '', // 原合同编号
        parentContractName: '', // 原合同名称
        originalContractNo: '', // 原合同编号
        originalContractId: '', // 原合同id
        originalContractName: '', // 原合同名字
        contractId: '',
        unitCode: '',
        uploadListOne: [],
        contractTypeCode: null, // 合同范本
        memberName: '', // 经办方
        orgName: '', // 主办部门
        phone: '', // 手机号
        incomeExpeTypeCode: '', // 收支类型
        templateAttr: '', // 合同范本属性
        modelNameList: '', // 合同范本选择
        contractScenario: '',
        projectName: '', // 项目名称
        projectCode: '', // 项目编号
        projectId: '', // 关联前置审批流程
        contractName: '',// 合同名称
        myEntityCode: [],// 我方签约主体
        orEntityCode: [],// 对方签约主体
        contractCurrencyCode: 'CNY',// 合同币种
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
        contractDesc: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        contractScenario: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        changeModelCode: [
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
      uploadListOne: [],
      uploadListTwo: [],
      uploadListTree: [],
      contractSignList: [],
      contractProjectList: [],
      ecmContractWorkflowList: [],
      showWorkList: [],
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
      uploadParams: {
        bizType: '项目变更', //业务分类
        bizTypeCode: '2013101' //业务类型编码
      },
      showAttachedList: [],
      tableContractList: [],
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
  created () {
    this.$store.dispatch('setHeight', 120)
  },
  mounted () {
    this.ruleForm.draftTypeCode = this.$route.query.draftTypeCode
    this.domShow = ['CON002', 'CON003'].includes(this.$route.query.draftTypeCode)
    this.$route.meta[2].title = draftTypeObj[this.$route.query.draftTypeCode]
    this.getDetail()
    this.getOurSide()
    this.dictSelectList()
    this.getDictSelectList1()
  },

  methods: {
    treeSelect (node) {
      this.ruleForm.contractTypeCode = node.dictCode
      this.contractChange(node.dictCode)
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
     * 我方签约主体远程搜索
     */
    remoteMethod (item, num) {
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
     * 跳转原合同
     */
    handleGoTo (row) {
      this.$router.push({
        name: 'changevoid',
        query: { type: 'view', id: row.contractId }
      })
    },
    // 获取状态
    async dictSelectList () {
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
     *  获取关联审批流程
     */
    getWorkFlowList (list) {
      this.ecmContractWorkflowList = list
    },
    /**
     * 编辑金格回到页面 刷新页面
     */
    handleShow () {
      this.getDetail()
      this.modlueShow = false
    },
    /**
     * 设置合同分列
     */
    setUplod (val, name) {
      const list = []
      if (val && val.length > 0) {
        val.forEach(item => {
          if (item.businessType === name) {
            list.push({
              ...item
            })
          }
        })
        return list
      } else {
        return []
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
     * 详情
     */
    async getDetail (val, params) {
      const { draftTypeCode } = this.$route.query
      const { code, data } = await getDetail({
        id: this.$route.query.id
      })
      if (code === '000000') {
         if(data.entityWarning){
          this.$message({
            showClose: true,
            message: data.entityWarning,
            type: 'warning',
            duration:0
          });
        }
        this.tableData = data.contractFulfillList && data.contractFulfillList.length > 0 && getTableData(data.contractFulfillList) || []
        this.ApprovalData = data.bpmProcessTaskVoList || []
        this.getEntityData(data.contractEntityList)
        this.showAttachedListOne = this.setUplod(data.ecmBusinessAttamentList, 'template')
        this.showAttachedListTwo = this.setUplod(data.ecmBusinessAttamentList, '1')
        this.showAttachedListTree = this.setUplod(data.ecmBusinessAttamentList, '2')
        this.uploadListOne = this.showAttachedListOne
        this.uploadListTwo = this.showAttachedListTwo
        this.uploadListTree = this.showAttachedListTree
        this.ecmBusinessMemberList = data.ecmBusinessMemberList
        this.pinionsList = data.bpmProcessTaskOpinionsVoList
        this.tableContractList = data.ecmContractInfoChangeList
        this.dictCode = data.incomeExpeTypeCode || ''
        this.changeTemplateAttr = data.changeTemplateAttr
        this.businessAttamentId = this.uploadListOne.length > 0 && this.uploadListOne[0].businessAttamentId
        this.ruleForm = {
          ...this.ruleForm,
          changeTemplateAttr: data.changeTemplateAttr,
          contractScenario: data.contractScenario || '',
          serialNumber: data.serialNumber,
          contractNo: data.contractNo,
          parentContractNo: data.parentContractNo,
          parentContractName: data.parentContractName,
          contractDesc: data.contractDesc,// 变更原因
          draftTypeCode: data.draftTypeCode, // 关联性质code
          draftTypeName: data.draftTypeName, // 关联性质code
          originalContractNo: data.originalContractNo, // 原合同编号
          originalContractId: data.originalContractId, // 原合同id
          originalContractName: data.originalContractName, // 原合同名字
          contractId: data.contractId || '',
          uploadListOne: this.showAttachedListOne,
          unitCode: data.unitCode,
          projectId: data.projectId || '',
          orgName: data.orgName || '',
          memberName: this.ecmBusinessMemberList && this.ecmBusinessMemberList[0] && this.ecmBusinessMemberList[0].memberName || '',
          phone: this.ecmBusinessMemberList && this.ecmBusinessMemberList[0] && this.ecmBusinessMemberList[0].phone || '',
          incomeExpeTypeCode: data.incomeExpeTypeCode || '',
          contractTypeCode: data.contractTypeCode || null,
          templateAttr: data.templateAttr || '',
          changeModelCode: data.changeModelCode,
          changeModelName: data.changeModelName,
          modelNameList: { templateName: data.modelName, } || '',
          modelNameList1: { templateName: data.changeModelName, } || '',
          modelCode: data.modelCode || '',
          projectName: data.contractProjectList && data.contractProjectList[0] && data.contractProjectList[0].projectName || '',
          projectCode: data.contractProjectList && data.contractProjectList[0] && data.contractProjectList[0].projectCode || '',
          contractName: data.contractName || '',
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
          validDateType: data.validDateType || '',
          validYear: data.validYear || ''
        }
        this.contractProjectList = data.contractProjectList || []
        this.ecmContractWorkflowList = data.ecmContractWorkflowList || []
        this.showWorkList = data.ecmContractWorkflowList || []
        this.getContractType({
          dictCode: data.incomeExpeTypeCode,
          attribute1: 3
        })
        this.getTemplateInfos({
          contractType: this.ruleForm.contractTypeCode,
          unitId: data.unitCode
        })
        this.getTemplateInfos1({
          contractType: draftTypeCode === 'CON004' ? 'IET739' : 'IET738',
          unitId: data.unitCode,
        }, 'view')
        this.getOurSide() // 请求我方签约主体
        this.getOtherSide() // 请求对方签约主体
        this.getDictSelectList(this.ruleForm.contractTypeCode)
        if (draftTypeCode === 'CON002' && this.ruleForm.changeTemplateAttr === 'CTA003') {
          this.changeModelCode(this.ruleForm.changeModelCode)
        }
        let id = this.ruleForm.contractId || ''
        if (val === 2) {
          // 如果合同范本属性不等于 非标准范本的时候
          let token = this.$Cookie.get('token')
          let businessId = draftTypeCode === 'CON004' ? this.ruleForm.modelCode : this.ruleForm.changeModelCode
          let businessAttamentId = this.uploadListOne.length > 0 && this.uploadListOne[0].businessAttamentId || ''
          let fileName = this.uploadListOne.length > 0 && this.uploadListOne[0].fileName || ''
          let atrr = draftTypeCode === 'CON004' ? data.templateAttr : data.changeTemplateAttr
          // 打开金格是否显示提示
          let txtShow = this.$route.query.taskKey !== 'start' || this.$route.query.sourceType === 'INAPPROPRIATEPROCESS'
          if (atrr==='CTA001' || (atrr==='CTA002' && this.ruleForm.uploadListOne[0].fileStatus==='STA001')) {
            this.getFile()
          } else {
            if (this.ruleForm.uploadListOne[0].fileStatus === 'STA001') {
              OpenKgWindow('?openType=add&isSave=true&operateType=contract&fileId=' + params + '&contractId=' + id + '&businessId=' + businessId + '&businessAttamentId=' + businessAttamentId + '&fileName=' + fileName + '&atrr=' + atrr + '&txtShow=' + txtShow + '&token=' + token)
            } else {
              OpenKgWindow('?openType=open&isSave=true&operateType=contract&fileId=' + params + '&contractId=' + id + '&businessId=' + businessId + '&businessAttamentId=' + businessAttamentId + '&fileName=' + fileName + '&atrr=' + atrr + '&txtShow=' + txtShow + '&token=' + token)
            }
          }
        }
        if ((data.templateAttr === 'CTA003' && draftTypeCode === 'CON004') || (data.changeTemplateAttr === 'CTA003' && draftTypeCode !== 'CON004')) {
          this.ruleForm.uploadListOne[0].fileName = this.ruleForm.contractName + '.doc'
        }
      }
    },
    /**
     * 获取参数
     */
    getParams () {
      return {
        changeTemplateAttr: this.ruleForm.changeTemplateAttr,
        changeModelName: this.ruleForm.changeModelName,
        changeModelCode: this.ruleForm.changeModelCode,
        contractScenario: this.ruleForm.contractScenario,
        contractId: this.ruleForm.contractId,
        contractNo: this.ruleForm.contractNo,
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
        contractTypeCode: this.ruleForm.contractTypeCode || null,
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
        ecmBusinessAttamentList: [
          ...this.ruleForm.uploadListOne,
          ...this.uploadListTwo,
          ...this.uploadListTree
        ],
        contractRelatedList: [],
        contractArchiveList: [],
        contractPrintList: [],
        ecmContractHistoryList: [],
        ecmBusinessMemberList: this.ecmBusinessMemberList,
        ecmContractWorkflowList: this.ecmContractWorkflowList,
        generateWayCode: 'TYP01'

      }

    },
    /**
     *  我方签约主体
     */
    async getContractType (params) {
      const { code, data } = await getContractType(params)
      if (code === '000000') {
        this.conditList = []
        this.getConditList(data)
      }
    },
    /**
     * 分解合同类型数据
     */
    getConditList (data) {
      data && data.map(item => {
        if (item.dictVoList && item.dictVoList.length > 0) {
          this.getConditList(item.dictVoList)
        } else {
          this.conditList.push(item)
        }
      })
    },
    /**
     *  合同范本选择
     */
    async getTemplateInfos (params) {
      const { code, data } = await getTemplateInfos(params)
      if (code === '000000') {
        this.workFlowList = data || []
        let obj = data.filter(item => item.templateId === this.ruleForm.modelCode)
        if (obj.length > 0) {
          this.moneyShow = obj[0].showMoney === '1'
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
            this.moneyShow = obj[0].showMoney === '1'
          }
        }
      }
    },
    /**
     * 获取合成场景
     */
    async getDictSelectList (val) {
      const { code, data } = await dictSelectList({
        parentCode: val,
        permission: ($route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS')?"UNIT":''
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
      let val = draftTypeCode === 'CON004' ? 'IET739' : 'IET738'
      const { code, data } = await dictSelectList({
        parentCode: val,
        permission: ($route.query.taskKey!=='start'||$route.query.sourceType==='INAPPROPRIATEPROCESS')?"UNIT":''
      })
      if (code === '000000') {
        this.ScenarioList1 = data || []
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
     *  对方签约主体
     */
    async getOtherSide () {
      const { code, data } = await getOtherSide({
        ...this.searchForm1,
        unitCode: this.ruleForm.unitCode
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
    async deleteContract () {
      const { code } = await deleteContract({
        contractId: this.ruleForm.contractId
      })
    },
    /**
     * 选择合同范本属性
     */
    handleChange (val) {
      this.$confirm('此操作将永久删除合同, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
            contractId: this.ruleForm.contractId,
            businessId: this.ruleForm.contractId,
            fileType: 'doc',
            businessAttamentId: this.businessAttamentId,
            fileStatus: 'STA001',
            businessType: 'template',
          }]
        }
      }).catch(() => {
        this.ruleForm.templateAttr = this.templateAttr
      })
    },
    handleChangeAttr (val) {
      const { draftTypeCode } = this.$route.query
      this.getTemplateInfos1({
        contractType: draftTypeCode === 'CON004' ? 'IET739' : 'IET738',
        unitId: this.userInfo.unitCode,
      })
      this.$confirm('此操作将永久删除合同, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
            fileType: 'doc',
            contractId: this.ruleForm.contractId,
            businessAttamentId: this.businessAttamentId,
            fileStatus: 'STA001',
            businessType: 'template',
          }]
        }
      }).catch(() => {
        this.ruleForm.changeTemplateAttr = this.changeTemplateAttr
      })
    },
    /**
     * 合同范本选择changge
     */
    workChange (val) {
      const { type } = this.$route.query
      if (type !== 'add') {
        this.deleteContract()
      }
      this.ruleForm.contractName = val.templateName
      this.ruleForm.modelCode = val.templateId
      this.getTemplateUrl(val.templateId)
      this.moneyShow = val.showMoney === '1'
    },
    workChange1 (val) {
      const { type } = this.$route.query
      if (type !== 'add') {
        this.deleteContract()
      }
      this.ruleForm.contractName = val.templateName
      this.ruleForm.changeModelName = val.templateName
      this.ruleForm.changeModelCode = val.templateId
      this.getTemplateUrl(val.templateId)
      this.moneyShow = val.showMoney === '1'
    },
    changeModelCode (val) {
      this.moneyShow = val === 'IET741' || val === 'IET744'
    },
    /**
     * 获取范本
     */
    /**
     * 获取范本
     */
    async getTemplateUrl (params) {
      const { code, data } = await getTemplateUrl(params)
      if (code === '000000') {
        this.ruleForm.uploadListOne = JSON.parse(JSON.stringify([{
          ...data,
          businessId: this.ruleForm.contractId,
          contractId: this.ruleForm.contractId,
          businessAttamentId: this.businessAttamentId,
          fileStatus: 'STA001'
        }]))
      }
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
     * 选择合同币种的change
     */
    changeMoney () {
      this.ruleForm.originalCurrency = ''
    },
    /**
     *选择合同生效期格式
     */
    changeTimeType (val) {
      this.ruleForm.validDateStart = ''
      this.ruleForm.validDateEnd = ''
      this.ruleForm.validYear = ''
      if (val === '1') {
        this.$refs.ruleForm.clearValidate('validYear')
      } else {
        this.$refs.ruleForm.clearValidate('validDateStart')
        this.$refs.ruleForm.clearValidate('validDateEnd')
      }
    },
    /**
     * 获取上传信息
     */
    getFileListTwo (list) {
      list.forEach((item => {
        item.businessType = 1
        item.contractId = this.ruleForm.contractId || ''
        item.businessId = this.ruleForm.contractId || ''
      }))
      this.uploadListTwo = list
    },
    /**
     * 获取上传信息
     */
    getFileListTree (list) {
      list.forEach((item => {
        item.businessType = 2
        item.contractId = this.ruleForm.contractId || ''
        item.businessId = this.ruleForm.contractId || ''
      }))
      this.uploadListTree = list
    },
    /**
     * 新增小工具
     */
    handleAddList () {
      this.tableData.push({
        remindMatter: '',
        remindTime: '',
        remindPersonObj: {},
        contractId: this.ruleForm.contractId
      })
    },
    /**
     *展开收索
     */
    handleOpen () {
      this.show = !this.show
    },
    /**
     * 删除
     */
    handleDeleteClick (index) {
      this.tableData.splice(index, 1)
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
     * 我方对方对方签约主体change
     * num 标识 0 我方 1对方
     */
    sideChange (val, num) {
      val.map(item => {
        item.entityType = num
        item.contractId = this.ruleForm.contractId ? this.ruleForm.contractId : ''
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
     * 对方签约主体change
     *
     */
    sideChange1 (val) {
      let arr = []
      let sun = rand(1, 9999)
      val.map(item => {
        if (typeof item === 'object') {
          arr.push({
            ...item,
            entityType: 'ENT02',
            contractId: this.ruleForm.contractId ? this.ruleForm.contractId : '',
            entityCode: item.cooperationCode,
            entityName: item.cooperationName,
            entityId: item.cooperationId,
            contractEntityId: '',
          })
        } else {
          arr.push({
            entityType: 'ENT02',
            contractId: this.ruleForm.contractId ? this.ruleForm.contractId : '',
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
     *  同意审批
     * @returns {Promise<void>}
     */
    async getAuditApprove (obj) {
      const { code } = await getAuditApprove({
        id: this.$route.query.id,
        bpmProcessTaskOpinionsFormList: obj.list,
        sysProcessLinkHeadVo: obj.sysProcessLinkHead || {}
      })
      if (code === '000000') {
        this.$router.push({ name: 'agencymatter' })
      }
      this.loading = false
    },
    /**
     * 退回流程
     * @returns {Promise<void>}
     */
    async rejectProcess (obj) {
      const { code } = await rejectProcess({
        id: this.$route.query.id,
        ecmContractProcessConfigVoList: obj.VoList,
        bpmProcessTaskOpinionsFormList: obj.list
      })
      if (code === '000000') {
        this.$router.push({ name: 'agencymatter' })
      }
      this.loading = false
    },
    /**
     *  征询人
     * @returns {Promise<void>}
     */
    async getConsult (obj) {
      const { code } = await getConsult({
        id: this.$route.query.id,
        bpmProcessTaskOpinionsFormList: obj.list,
        userVoList: obj.userVoList
      })
      if (code === '000000') {
        this.$router.push({ name: 'agencymatter' })
      }
      this.loading = false
    },
    /**
     * 编辑接口
     */
    async singEdit (params, obj, fileId) {
      const { taskKey, operationType, sourceType, draftTypeCode } = this.$route.query
      const { code } = await singEdit(params)
      if (code === '000000') {
        if (obj === 2) {
          this.getDetail(obj, fileId)
        } else if (fileId) {
          this.getDetail(obj, fileId)
        } else if (taskKey === 'start' && operationType !== 'CONSULT' && sourceType !== 'INAPPROPRIATEPROCESS') {
          let arr = []
          this.ruleForm.myEntityCode.map(item => {
            arr.push(item.entityId)
          })
          this.approvalParams = {
            objectTypeCode: approvalTypeCode[this.ruleForm.draftTypeCode],
            orgCode: this.userInfo.orgCode || '',
            contractTypeCode: this.ruleForm.contractTypeCode || null,
            quoteTemplate: draftTypeCode === 'CON004' ? this.ruleForm.templateAttr : 'CTA003',
            minAmount: this.ruleForm.includedAmount,
            businessId: this.ruleForm.contractId,
            contractScenario: this.ruleForm.contractScenario || '',  //合同场景
            validDateStart: this.ruleForm.validDateStart || '', //有效期开始时间
            validDateEnd: this.ruleForm.validDateEnd || '',   //有效期结束时间
            validYear: this.ruleForm.validYear || '',   //签订之日**年
            entityAttribute: arr.length > 0 ? arr.join() : '',  //签约主体ID
          }
          if (this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].fileStatus === 'STA002') {
            this.visible = true
            this.approvalObj = obj
          } else {
            this.$message.error('请点击编辑合同，并进行保存，否则无法进行流程发起！')
            this.loading = false
          }
        } else if (obj.type === 'adopt') { // 通过 提交
          this.getAuditApprove(obj)
        } else if (obj.type === 'return') { // 退回
          this.rejectProcess(obj)
        } else if (obj.type === 'opinion') { // 意见征询
          this.getConsult(obj)
        }
      } else {
        this.loading = false
      }

    },
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
      if (val === 1) {
        //调用iwebOffice
        OpenKgWindow('?openType=open&readType=readyOnly&fileId=' + item.fileId + '&token=' + token)
      } else if (val === 2) {
        this.modlueShow = true
        this.modlueLoading = true
        this.singEdit(this.getParams(), 2, item.fileId)
      } else {
        const token = Cookies.get('token')
        window.open(downloadUrl + `/${item.fileId}?token=${token}`)
      }
    },
    // 获取合同范本的fildId
    async getFile () {
      const { taskKey, sourceType, draftTypeCode } = this.$route.query
      const { code, data } = await editFile({
        businessId: draftTypeCode === 'CON004' ? this.ruleForm.modelCode : this.ruleForm.changeModelCode,
        contractId: this.ruleForm.contractId,
        templateAttr: draftTypeCode === 'CON004' ? this.ruleForm.templateAttr : this.ruleForm.changeTemplateAttr,
        dataType: taskKey === 'start' && sourceType !== 'INAPPROPRIATEPROCESS' ? 0 : 1
      })
      if (code === '000000') {
        let fileId = data.fileId
        let id = this.ruleForm.contractId
        let token = this.$Cookie.get('token')
        let businessId = this.ruleForm.modelCode || ''
        let businessAttamentId = this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].businessAttamentId || ''
        let fileName = this.ruleForm.uploadListOne.length > 0 && this.ruleForm.uploadListOne[0].fileName || ''
        let atrr = draftTypeCode === 'CON004' ? this.ruleForm.templateAttr : this.ruleForm.changeTemplateAttr
        // 打开金格是否显示提示
        let txtShow = this.$route.query.taskKey !== 'start' || this.$route.query.sourceType === 'INAPPROPRIATEPROCESS'
        // 如果合同范本属性不等于 非标准范本的时候
        OpenKgWindow('?openType=open&docFileName=' + encodeURIComponent(this.ruleForm.contractName) + '&isSave=true&operateType=contract&fileId=' + fileId + '&contractId=' + id + '&businessId=' + businessId + '&businessAttamentId=' + businessAttamentId + '&fileName=' + fileName + '&atrr=' + atrr + '&txtShow=' + txtShow + '&token=' + token)
      } else {
        this.modlueShow = false
        this.loading = false
      }
    },
    /**
     *  审批流程通过按钮获取
     */
    getApprovalParams (params) {
      this.approvalObj = {}
      this.loading = true
      if (params.isEdit) { // 不可编辑的时候就不走保存接口
        this.getAuditApprove(params)
      } else { // 可编辑的情况 t退回至经办人 重新选择审批流程人员
        if (this.$route.query.taskKey === 'start') {
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.singEdit(this.getParams(), params)
            } else {
              this.loading = false
              this.$message.error('请把信息填写完整')
            }
          })
        } else {
          this.singEdit(this.getParams(), params)
        }
      }
    },
    /**
     *  保存审批人 跳转
     * @param params
     * @returns {Promise<void>}
     */
    getApprovlStart (params) {
      this.getAuditApprove({
        ...this.approvalObj,
        ...params
      })
    },
    /**
     * 弹窗取消
     */
    handleCancel () {
      this.visible = false
      this.loading = false
    },
  }
}
</script>

<style lang="less" scoped>
.modlue-box {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
}

.approval-page {
  position: fixed;
  background: #fff;
  padding: 18px 14px;
}

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
