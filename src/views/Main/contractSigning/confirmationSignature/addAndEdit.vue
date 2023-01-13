<template>
  <div v-loading="isLoading" element-loading-text="点击重新获取该页面数据" @click="refresh">
    <el-row :gutter="24">
      <el-col :span="$route.query.type!=='detail' && (isEdit || taskKey==='start')?19:24">
        <div style="float:right">
          <el-button
            class="button"
            type="primary"
            style="margin-left:5px;margin-right:5px"
            v-if="taskKey==='start' && contractInfo.statue!=='STA015'"
            @click="stopProcess"
            icon="iconfont sbt_add"
          >用印撤回</el-button>
          <el-button
            class="button"
            type="primary"
            style="margin-left:5px;margin-right:5px"
            v-if="contractInfo.statue==='STA007'  && $route.query.type!='detail' && taskKey==='start'"
            @click="changeSign"
            icon="iconfont sbt_add"
          >更改用印信息</el-button>
          <CommonSignDeleteButton
            v-if="(contractInfo.statue==='STA009' || contractInfo.statue==='STA007' || contractInfo.statue==='STA008') && $route.query.type!='detail' && taskKey==='start'"
            :contractId="contractId"
            @callBackDeal="deleteProcess"
          ></CommonSignDeleteButton>
          <el-button
            class="button"
            style="margin-left:5px;margin-right:5px"
            type="primary"
            @click="cancel"
            icon="iconfont sbt_add"
          >返回</el-button>
        </div>
        <el-form label-width="130px" :model="ruleForm" ref="rulesForm" :rules="rule">
          <b class="ft18">登记签署信息</b>
          <common-title class="ft16 pd24" title="简要信息" />
          <div class="bg-white p25">
            <CommonContractInfo v-model="contractInfo" :contractId="contractId"></CommonContractInfo>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="签订方式" prop="signWay">
                  <DictCodeToDictName :parentCode="'SIGN_WAY'" :dictCode="printInfo.signWay"></DictCodeToDictName>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用印顺序" prop="signOrder">
                  <DictCodeToDictName :parentCode="'SIGN_ORDER'" :dictCode="printInfo.signOrder"></DictCodeToDictName>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="印章类型" prop="sealType">
                  <DictCodeToDictName :parentCode="'SEAL_TYPE'" :dictCode="printInfo.sealType"></DictCodeToDictName>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申请用印合同份数" prop="printNum">{{printInfo.printNum}}</el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="bg-white mt20 pr20">
            <common-title class="ft16 pd24" title="我方用印时间" />
            <div v-for="(item,index) in signData" :key="index">
              <el-row :gutter="24" v-if="item.entityType === 'ENT01'">
                <el-col :span="12">
                  <el-form-item>
                    <span>{{item.entityName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker
                      v-if="taskKey === 'offline_we_sign_2'"
                      v-model="item.signTime"
                      type="date"
                      :ref="'ourSign' + index"
                      @change="changeDate(item)"
                      :readonly="item.signWay==='SIW002'"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期"
                    ></el-date-picker>

                    <el-date-picker
                      v-else
                      v-model="item.signTime"
                      type="date"
                      :ref="'ourSign' + index"
                      @change="changeDate(item)"
                      :readonly="item.signWay==='SIW002'"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :disabled="!((contractInfo.statue ==='STA007' && item.signOrder === 'SIO002') || contractInfo.statue==='STA009') || taskKey === 'start'"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button
                      type="primary"
                      @click="sign(item)"
                      v-if="(isEdit && ((contractInfo.statue ==='STA007' && item.signOrder === 'SIO002') || contractInfo.statue==='STA009') && item.signWay==='SIW002') && !item.signTime"
                      icon="iconfont sbt_add"
                    >签署</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="bg-white mt20 pr20">
            <common-title class="ft16 pd24" title="对方用印时间" />
            <div v-for="(item,index) in signData" :key="index">
              <el-row :gutter="24" v-if="item.entityType === 'ENT02'">
                <el-col :span="12">
                  <el-form-item>
                    <span>{{item.entityName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker
                      :ref="'otherSign' + index"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @change="changeDate(item)"
                      :disabled="!((contractInfo.statue ==='STA007' && item.signOrder === 'SIO001') || contractInfo.statue==='STA008') || item.signWay === 'SIW002' || taskKey === 'offline_we_sign_2' || taskKey === 'start'"
                      v-model="item.signTime"
                      type="date"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="false">
                  <el-form-item>
                    <el-button
                      type="primary"
                      v-if="isEdit && (((contractInfo.statue ==='STA007' && item.signOrder === 'SIO001') || contractInfo.statue==='STA008') && item.signWay==='SIW002')"
                      @click="sign(item)"
                      icon="iconfont sbt_add"
                    >签署</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="bg-white mt20 pt10 pr20 pb24">
            <common-title class="ft16 pd24" title="文件信息" />
            <fieldset style="border:1px solid gray;border-radius:5px;" class="ml20">
              <legend class="ft16 ml20">审批单</legend>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item style="text-align:center;">
                    <el-link type="primary" @click="printContractInfo">合同审批单</el-link>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <!-- <el-button class="button" type="primary" @click="printContractInfo" icon="iconfont sbt_add">打印预览</el-button> -->
                    <!-- <el-button class="button" type="primary" icon="iconfont sbt_add">下载</el-button> -->
                  </el-form-item>
                </el-col>
              </el-row>
            </fieldset>

            <fieldset
              v-if="contractInfo.ecmBusinessAttamentList && contractInfo.ecmBusinessAttamentList.length>0"
              style="border:1px solid gray;border-radius:5px;"
              class="ml20 mt20"
            >
              <legend class="ft16 ml20">合同</legend>
              <div v-for="(item,index)  in contractInfo.ecmBusinessAttamentList" v-bind:key="index">
                <el-row
                  :gutter="24"
                  v-if="item.businessType === 'template' && item.fileStatus === 'STA004'"
                >
                  <el-col :span="12">
                    <el-form-item style="text-align:center;">
                      <el-link @click="preview(item)" type="primary">{{item.fileName}}</el-link>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <el-button
                        class="button"
                        type="primary"
                        @click="preview(item)"
                        icon="iconfont sbt_add"
                      >打印预览</el-button>
                      <el-button
                        class="button"
                        type="primary"
                        @click="downLoad(item)"
                        icon="iconfont sbt_add"
                      >下载</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </fieldset>
          </div>

          <div class="bg-white mt20 pr20">
            <el-row :gutter="24">
              <el-col :span="24">
                <!--合同审批历史-->
                <common-tableappoval
                  class="ft16 pl24"
                  :ApprovalData="contractApprovalData"
                  :pinionsList="contractPinionsList"
                  :showOptions="true"
                />
              </el-col>
            </el-row>
          </div>
          <div class="bg-white mt20 pr20">
            <el-row :gutter="24">
              <el-col :span="24">
                <!--确认签署审批历史-->
                <common-tableappoval
                  class="ft16 pl24"
                  :approvalTitle="'用印历史'"
                  :ApprovalData="ApprovalData"
                  :pinionsList="pinionsList"
                  :showOptions="true"
                />
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-col>
      <el-col v-if="$route.query.type!=='detail' && (isEdit || taskKey==='start')" :span="5">
        <common-mode :noShowOption="noShowOption" v-on:getApprovalParams="getApprovalParams"></common-mode>
      </el-col>
    </el-row>
    <!--
    <div class="common-footer-box">
      <div class="common-footer">
        <div style="width: 50%"></div>
          <div class="button-content">
            <div style="float:right;">
              <el-button
                class="button"
                v-if="(isEdit || taskKey==='start') && $route.query.type!='detail' "
                type="primary"
                style="margin-right:5px"
                @click="confirm"
                icon="iconfont sbt_add"
              >提交</el-button>
              <common-mode v-if="isEdit && $route.query.type!='detail'" :noShowOption="noShowOption" :easyMode="true" v-on:getApprovalParams="getApprovalParams"></common-mode>
              <el-button
                class="button"
                type="primary"
                style="margin-left:5px;margin-right:5px"
                v-if="contractInfo.statue==='STA007'  && $route.query.type!='detail' && !isOurSign && taskKey==='start'"
                @click="changeSign"
                icon="iconfont sbt_add"
              >更改用印信息</el-button>
              <CommonSignDeleteButton 
                v-if="(contractInfo.statue==='STA009' || contractInfo.statue==='STA007' || contractInfo.statue==='STA008') && $route.query.type!='detail' && !isOurSign  && taskKey==='start'"
               :contractId="contractId" @callBackDeal="deleteProcess"></CommonSignDeleteButton>
              <el-button class="button"  style="margin-left:5px;margin-right:5px" type="primary" @click="cancel" icon="iconfont sbt_add">返回</el-button>
            </div>
        </div>
      </div>
    </div>
    -->
    <el-dialog title="更改用印信息" :visible.sync="dlgVisiable" width="70%">
      <contractApplyPrint
        ref="changeDialog"
        :contractIdParam="contractId"
        :signTypeParam="'CHANGESIGN'"
      ></contractApplyPrint>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeDialogSubmit">提交</el-button>
        <el-button @click="dlgVisiable = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import {
  getJump,
  getContractPrintInfo,
  changeContractPrint,
  saveContractPrint,
  queryContractSignList,
  updateBatch,
  signContractPage,
} from "@/service/sign/index";
import {
  getAuditApprove,
  getDetail,
  contractDisable,
  rejectProcess,
  deleteProcess,
} from "@/service/work";
import contractApplyPrint from "../applySeal/addAndEdit";
import { downloadUrl, previewUrl } from "@/service/file";

export default {
  components: {
    contractApplyPrint: contractApplyPrint,
  },
  data() {
    return {
      rule: {},
      ruleForm: {
        printNum: 1,
      },
      contractInfo: {},
      isEdit: false,
      isChange: false, // 是否从更改用印信息过来
      checked: false, // 是否勾选承诺
      jumpData: {},
      contractId: "",
      signType: "",
      isPop: false,
      signData: [],
      dlgVisiable: false,
      ApprovalData: [],
      pinionsList: [],
      contractApprovalData: [],
      contractPinionsList: [],
      isSiw002: false, // 是否为电签，true为电签
      isLoading: false,
      isOurSign: false, //是否为我方先签署
      taskKey: "",
      noShowOption: {},
      printInfo: {},
    };
  },
  props: {
    contractIdParam: "",
    signTypeParam: "",
  },

  created() {
    if (this.contractIdParam) {
    } else {
      this.contractId = this.$route.query.contractId;
    }
  },
  mounted() {
    this.noShowOption = {
      isPass: true, // 通过
      isReject: true, // 退回
      isShowConsult: false, //意见征询按钮
      isShowNoSuitApproval: false, // 是否非适格审批按钮
      isChooseNode: true, // 是否选择节点
      goBack: false,
    };
    // this.$store.dispatch("setHeight", 190);
    if (this.$route.query.id) {
      this.getFormInfoByProcess(() => {
        this.queryContractSign();
        this.getContractPrintInfo();
        this.getJump();
      });
    } else {
      this.queryContractSign();
      this.getJump(() => this.getFormInfoByProcess());
      this.getContractPrintInfo();
    }
  },
  methods: {
    changeDialogSubmit() {
      this.$refs.changeDialog.confirm();
    },
    async getApprovalParams(params) {
      this.isLoading = true;
      if (params.type === "adopt") {
        // 提交或者通过
        this.confirm(params);
      } else if (params.type === "return") {
        if (this.taskKey === "start") {
          this.noShowOption = {
            isPass: true, // 通过
            isReject: false, // 退回
            isShowConsult: false, //意见征询按钮
            isShowNoSuitApproval: false, // 是否非适格审批按钮
            isChooseNode: true, // 是否选择节点
            goBack: false,
          };
        }
        // 退回
        let obj = {
          id: this.$route.query.id,
          ecmContractProcessConfigVoList: params.VoList,
          bpmProcessTaskOpinionsFormList: params.list,
        };
        const { code, data } = await rejectProcess(obj);
        if (code === "000000") {
          this.isLoading = false;
          this.$message({ type: "success", message: "退回成功！" });
          setTimeout(() => {
            this.$router.push({ name: "agencymatter" });
          }, 500);
        }
      }
    },
    // 通过流程进来，获取表单信息
    async getFormInfoByProcess(callback) {
      let processId = this.$route.query.id;
      if (!processId) {
        if (
          this.jumpData.bpmProcessTaskVo &&
          this.jumpData.bpmProcessTaskVo.workflowHistoryId
        ) {
          processId = this.jumpData.bpmProcessTaskVo.workflowHistoryId;
        } else {
          return;
        }
      }
      const { code, data } = await getDetail({ id: processId });
      if (code === "000000") {
        this.contractId = data.contractId;
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList;

        this.contractApprovalData = data.contractBpmProcessTaskVoList || [];
        this.contractPinionsList = data.contractBpmprocessTaskOpinionsVoList;
        callback && callback();

        // this.getContractPrintInfo();
      }
    },
    getWorkFlowHistory() {},
    confirm(obj) {
      // 判断合同状态，如果是作废中，不能继续
      if (this.contractInfo.statue === "STA011") {
        this.$message({
          type: "warning",
          message: "合同已发起作废流程，暂时无法操作！",
        });
        return;
      }
      if (this.taskKey === "start") {
        let params = {
          id: this.jumpData.bpmProcessTaskVo.workflowHistoryId,
          bpmProcessTaskOpinionsFormList: obj.list,
        };
        getAuditApprove(params).then((res) => {
          if (res.code === "000000") {
            this.$message({ type: "success", message: "处理成功" });
            setTimeout(() => {
              this.$router.push({ name: "agencymatter" });
            }, 500);
          }
        });
      } else {
        // 批量更改的接口
        this.updateBatch(obj);
      }
    },
    async updateBatch(obj) {
      let ourSignRef = [];
      let otherSignRef = [];
      let access = true; // 必填项必填为true
      let isOur = true; // 是否我方必填
      let isOther = true; // 对方必填
      if (this.signData.length > 0) {
        for (let i = 0; i < this.signData.length; i++) {
          if (this.signData[i].entityType === "ENT01") {
            ourSignRef.push("ourSign" + i);
          } else if (this.signData[i].entityType === "ENT02") {
            otherSignRef.push("otherSign" + i);
          }
        }

        //然后随机判断某一个是否可以输入
        if (this.$refs[ourSignRef[0]][0].disabled === true) {
          // 我方不必填
          isOur = true;
        } else {
          isOur = false;
        }
        if (this.$refs[otherSignRef[0]][0].disabled === true) {
          // 对方非必填
          isOther = true;
        } else {
          isOther = false;
        }
        for (let k = 0; k < this.signData.length; k++) {
          if (!isOur) {
            if (this.signData[k].entityType === "ENT01") {
              if (
                this.signData[k].signTime === "" ||
                this.signData[k].signTime === null
              ) {
                access = false;
                break;
              }
            }
          }
          if (!isOther) {
            if (this.signData[k].entityType === "ENT02") {
              if (
                this.signData[k].signTime === "" ||
                this.signData[k].signTime === null
              ) {
                access = false;
                break;
              }
            }
          }
        }
      }
      if (
        this.contractInfo.statue === "STA008" ||
        this.contractInfo.statue === "STA009" ||
        this.taskKey === "offline_we_sign_2"
      ) {
        // 合同状态为 我方签署 对方签署 ，流程节点为（线下，对方先签，我方签署节点，需要校验值）
        if (!access) {
          // 有必填项为空
          this.$message({ type: "error", message: "签署时间不能为空！" });
          return;
        }
      }

      if (this.isSiw002) {
        // 当为电签的时候判断
        if (!access) {
          // 有必填项为空
          this.$message({ type: "error", message: "电子签署时间不能为空！" });
          return;
        }
      }
      if (!this.isSiw002) {
        // 线下
        for (let k = 0; k < this.signData.length; k++) {
          if (!isOur) {
            if (this.signData[k].entityType === "ENT01") {
              this.signData[k].statue = "STA015";
            }
          }
          if (!isOther) {
            if (this.signData[k].entityType === "ENT02") {
              this.signData[k].statue = "STA015";
            }
          }
        }
      }
      // console.log(this.signData);
      const { code, data } = await updateBatch(JSON.stringify(this.signData));

      if (code === "000000") {
        let params = {
          id: this.jumpData.bpmProcessTaskVo.workflowHistoryId,
          bpmProcessTaskOpinionsFormList: obj.list,
        };
        const { code, data } = await getAuditApprove(params);
        if (code === "000000") {
          this.$message({ type: "success", message: "处理成功" });
          setTimeout(() => {
            this.$router.push({ name: "agencymatter" });
          }, 500);
        }
      }
    },
    cancel() {
      this.$router.go(-1);
    },
    async getJump(callback) {
      let params = {
        businessId: this.contractId,
        objectTypeCode: "SIGN_APPROVAL",
      };
      const { code, data } = await getJump(params);
      if (code === "000000") {
        this.jumpData = data;
        if (this.jumpData.bpmProcessTaskVo) {
          this.taskKey = this.jumpData.bpmProcessTaskVo.taskKey;
          if (this.taskKey === "offline_we_sign_2") {
            this.isOurSign = true;
          }
          if (
            this.jumpData.bpmProcessTaskVo.taskStauts !== "WAIT_FOR_DEAL" &&
            this.taskKey === "start"
          ) {
            this.taskKey = "";
          }
        }
        // 0是要发流程，啥也没有，1是待办，2是已处理
        if (data.jumpApproval === "0") {
          this.isEdit = false;
        }
        if (data.jumpApproval === "1") {
          this.isEdit = true;
        }
        if (data.jumpApproval === "2") {
          this.isEdit = false;
        }
        if (this.taskKey === "start") {
          this.isEdit = false;
        }
        callback && callback();
      }
    },
    // 获取当前页的所有数据
    async getContractPrintInfo() {
      let params = {
        contractId: this.contractId,
      };
      const { code, data } = await getContractPrintInfo(params);
      if (code === "000000") {
        this.printInfo = data;
      }
    },
    handleChange() {},

    // 查询签章
    async queryContractSign() {
      let params = {
        contractId: this.contractId,
      };
      const { code, data } = await queryContractSignList(params);
      if (code === "000000") {
        this.signData = data;
        // 判断是否为电签
        if (this.signData.length > 0) {
          if (this.signData[0].signWay === "SIW002") {
            this.isSiw002 = true;
          }
          if (this.signData[0].signOrder === "SIO002") {
            //如果为我方先签署就要隐藏掉更改用印信息按钮
            this.isOurSign = true;
          }
        }
      }
    },
    // 签署按钮
    sign(item) {
      // 判断合同状态，如果是作废中，不能继续
      if (this.contractInfo.statue === "STA011") {
        this.$message({
          type: "warning",
          message: "合同已发起作废流程，暂时无法操作！",
        });
        return;
      }
      setTimeout(() => {
        this.isLoading = true;
      }, 100);
      signContractPage(item)
        .then((res) => {
          if (res.code === "000000") {
            window.open(res.data);
          }
        })
        .catch((err) => {});
    },
    refresh() {
      if (this.isLoading) {
        this.queryContractSign();
        this.isLoading = false;
      }
    },
    // 更改用印信息
    changeSign() {
      if (
        this.contractInfo.statue !== "STA006" &&
        this.contractInfo.statue !== "STA007"
      ) {
        this.$message({
          type: "error",
          message: "不满足合同更改用印信息条件！",
        });
        return;
      }
      this.dlgVisiable = true;
      // this.$router.push({ name: "agencymatter" });
    },
    changeDate(item) {
      let userInfo = this.$store.state.common.userInfo;
      item.signPersonId = userInfo.userId;
      item.signPersonName = userInfo.userName;
      this.signData.forEach((ele) => {
        if (ele.contractSignId != item.contractSignId) {
          if (
            ele.signTime &&
            ele.signTime != "" &&
            this.taskKey !== "offline_we_sign_2"
          ) {
            let time1 = new Date(Date.parse(item.signTime));
            let time2 = new Date(Date.parse(ele.signTime));
            if (time1 < time2) {
              this.$message("选择时间不能晚于已有签订时间！");
              item.signTime = "";
            }
          }
        }
      });
    },
    // 撤回流程
    async deleteProcess() {
      this.$confirm("此操作将不可逆转, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteDone();
        })
        .catch(() => {});
    },
    async deleteDone() {
      let params = {
        contractId: this.contractId,
      };
      const { code, data } = await contractDisable(params);
      if (code === "000000") {
        this.$message({ type: "success", message: "撤回成功！" });
        this.cancel();
      }
    },
    // 预览
    preview(item) {
      let token = this.$Cookie.get("token");
      window.open(
        previewUrl +
          "/" +
          item.fileId +
          "/" +
          item.fileId +
          "/" +
          "?token=" +
          token
      );
    },
    downLoad(item) {
      let token = this.$Cookie.get("token");
      window.open(downloadUrl + "/" + item.fileId + "/" + "?token=" + token);
    },
    printContractInfo() {
      let routeData = this.$router.resolve({
        path: "/contractPrintForm",
        query: {
          contractId: this.contractId,
        },
      });
      window.open(routeData.href, "_blank");
    },
    stopProcess() {
      this.$confirm("确定进行用印撤回操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteProcess({
            id: this.jumpData.bpmProcessTaskVo.workflowHistoryId,
          })
            .then((res) => {
              this.$message({
                type: "succuss",
                message: "用印撤回成功",
              });
              setTimeout(() => {
                this.$router.push({ name: "agencymatter" });
              }, 300);
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: "用印撤回失败",
              });
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
</style>
