<template>
<span>
  <template v-if="easyMode">
    <!-- 简易模式 -->
        <el-button v-if="noShowOption.isPass" type="primary" :disabled="$route.query.taskStauts==='SUSPEND' || btnClick"
                   @click="handleOk(1)">提交</el-button>
        <el-button v-if="noShowOption.isReject" :disabled="$route.query.taskStauts==='SUSPEND' || btnClick"
                   @click="handleOk(2)">退回</el-button>
        <el-button v-if="noShowOption.goBack" class="button" type="primary" @click="$router.go(-1)"
                   icon="iconfont sbt_add">返回</el-button>
    </template>
  <div v-if="!easyMode" style="width: 100%;">
    <div class="approval-page">
      <div v-if="$route.query.sourceType!=='INAPPROPRIATEPROCESS'">
        <b
          class="mt16">{{
            $route.query.taskKey === 'start' && $route.query.sourceType === 'REJECTPROCESS' ? '说明' : '意见'
          }}</b>
        <el-input
          :disabled="$route.query.taskStauts==='SUSPEND'"
          style="margin-top: 16px;margin-bottom: 17px"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 6}"
          placeholder="请输入审批意见"
          v-model="workflowList.approverOpinions"
        ></el-input>
      </div>
      <div style="margin-bottom: 12px">
        <div v-if="noShowOption.isPass" style="margin-bottom: 12px">
          <el-tooltip class="item" effect="light" content="流程向下继续流转" placement="left">
          <el-button :disabled="$route.query.taskStauts==='SUSPEND' || btnClick" style="min-width: 100%"
                     type="primary" @click="handleOk(1)">
            {{
              ($route.query.sourceType === 'INAPPROPRIATEPROCESS') ? '重新选择审批人' : ($route.query.taskKey === 'start' || $route.query.operationType === 'CONSULT' ? '提交' : '通过')
            }}
          </el-button>
          </el-tooltip>
        </div>
        <div v-if="($route.query.taskKey!=='start' && $route.query.operationType!=='CONSULT') && noShowOption.isReject">
             <el-tooltip class="item" effect="light"
                         :content="$route.query.objectTypeCode === 'TRANSFER_APPROVAL' ? '流程撤销' : '退回至前序审批节点（需点击后选择）'"
                         placement="left">
          <el-button
            :disabled="$route.query.taskStauts==='SUSPEND' || btnClick"
            style="width: 100%"
            @click="handleOk(2)"
          >退回</el-button>
             </el-tooltip>
        </div>
      </div>
      <div v-if="$route.query.taskKey!=='start' && $route.query.operationType!=='CONSULT'">
        <div v-if="noShowOption.isShowConsult" style="margin-bottom: 12px">
                      <el-tooltip class="item" effect="light" content="征询相关部门意见" placement="left">
                        <el-button :disabled="$route.query.taskStauts==='SUSPEND' || btnClick"
                                   style="width: 100%" @click="handleOk(3)">意见征询</el-button>
                      </el-tooltip>
        </div>
        <div v-if="noShowOption.isShowNoSuitApproval" style="margin-bottom: 12px">
                      <el-tooltip class="item" effect="light" content="您不是正确的审批人" placement="left">
                        <el-button :disabled="$route.query.taskStauts==='SUSPEND' || btnClick"
                                   style="width: 100%" @click="handleOk(4)">非适格审批人</el-button>
                      </el-tooltip>
        </div>
      </div>
     <p
       v-if="($route.query.taskKey!=='start' && $route.query.operationType!=='CONSULT') && noShowOption.isReject
       && ['CONTRACT_APPROVAL','BACTH_CONTRACT_APPROVAL','CONTRACT_APPROVAL_CHANGE','CONTRACT_APPROVAL_TERMINATION_RELEASE','CONTRACT_APPROVAL_CONTINUE'].includes($route.query.objectTypeCode)"
       style="font-size: 12px;color: #00a2d4;margin-bottom: 5px;">
       如您对左侧表单字段填写内容有异议，请退回发起人进行修改
     </p>
      <div style="height: 300px;overflow-y: auto" v-if="$route.query.sourceType!=='INAPPROPRIATEPROCESS'">
        <common-upload
          v-on:get-file-list="getFileList"
          :show-attached-list="showAttachedList"
          title="附件"
          :span="24"
          :butShow="butShow"
          :isApproval="true"
        />
      </div>
    </div>
  </div>
  <el-dialog title="提示" :visible.sync="visible" width="40%" append-to-body>
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item v-if="showSelect===2" label="退回节点" prop="nodeNameList">
          <el-select
            class="w-100"
            v-model="ruleForm.nodeNameList"
            placeholder="请选择退回节点"
            value-key="nodeId"
          >
            <el-option
              v-for="item in options"
              :key="item.nodeId"
              :label="item.nodeName+' ' +item.memberName"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="easyMode"
                      :label="$route.query.taskKey === 'start' && $route.query.sourceType === 'REJECTPROCESS' ? '说明' : '意见'">
          <div v-if="$route.query.sourceType!=='INAPPROPRIATEPROCESS'">
            <el-input
              :disabled="$route.query.taskStauts==='SUSPEND'"
              style="margin-top: 16px;margin-bottom: 17px"
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 6}"
              placeholder="请输入审批意见"
              v-model="workflowList.approverOpinions"
            ></el-input>
          </div>
          <common-upload
            v-on:get-file-list="getFileList"
            :show-attached-list="showAttachedList"
            title="附件"
            :span="24"
            :butShow="butShow"
            :isApproval="true"
          />
        </el-form-item>
<!--        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;" v-if="$route.query.sourceType!=='INAPPROPRIATEPROCESS'">-->
<!--            <el-radio-button label="first">所有人</el-radio-button>-->
<!--            <el-radio-button label="second">流程中</el-radio-button>-->
<!--            <el-radio-button label="third">同部门</el-radio-button>-->
<!--        </el-radio-group>-->
        <el-form-item
          v-if="showSelect===3"
          :label="$route.query.sourceType==='INAPPROPRIATEPROCESS'?  $route.query.modelTitle: '选择征询人'"
          prop="approvalList"
        >
          <el-select
            ref="selectAppType"
            multiple
            class="w-100"
            v-model="ruleForm.approvalList"
            filterable
            remote
            :remote-method="remoteMethod"
            @change="vauleChange"
            value-key="userId"
            :loading="loading"
          >
            <el-option
              v-for="item in approvalList"
              :key="item.userId"
              :label="item.userName"
              :value="item"
            >
              <div class="sel-box">
                <span>{{ item.userName }}</span>
                <span style="color: #8492a6; font-size: 13px;">{{ item.unitName }}</span>
                <span style="color: #8492a6; font-size: 13px;">{{ item.orgName }}</span>
              </div>
            </el-option>
            <div class="pagePagination">
              <el-pagination
                background
                layout="prev, pager, next"
                @prev-click="gotoPrev"
                @current-change="gotoCurrentPage"
                @next-click="gotoNext"
                :total="pageData.total"
              ></el-pagination>
            </div>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(1)">取 消</el-button>
        <el-button type="primary" :disabled="btnClick" @click="handleClose(2)">确 定</el-button>
      </span>
    </el-dialog>
</span>
</template>

<script>
import CommonUpload from "@/components/CommonUpload"; // 上传
import {
  getApprovedList,
  getInAppropr,
  getAuditApprove,
} from "@/service/work";
import {getPersonList} from "@/service/4A";

export default {
  props: {
    noShowOption: {
      type: Object,
      default: () => {
        return {
          isPass: true, // 通过
          isReject: true, // 退回
          isShowConsult: true, //意见征询按钮
          isShowNoSuitApproval: true, // 是否非适格审批按钮
          isChooseNode: true, // 是否展示节点选择
          goBack: true
        };
      },
    },
    workflowHistoryId: { // 流程ID
      type: String,
      default: () => {
        return ''
      }
    },
    easyMode: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CommonUpload,
  },
  data() {
    return {
      tabPosition: 'first',
      text: "",
      approvalList: [],
      username: "",
      loading: false,
      pageData: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        totalPage: 0,
      },
      showSelect: null,
      options: [],
      ruleForm: {
        nodeNameList: '',
        approvalList: [],
      },
      rules: {
        nodeNameList: [
          {required: true, message: "请选择退回节点", trigger: "blur"},
        ],
        approvalList: [
          {required: true, message: "请选择征询人", trigger: "blur"},
        ],
      },
      visible: false,
      workflowList: {
        approverOpinions: "",
        approverType: "TEXT",
      },
      showAttachedList: [],
      butShow: ["删除"],
      btnClick: false
    };
  },
  mounted() {
    const {sourceType} = this.$route.query;
    if (sourceType === 'REJECTPROCESS') {
      this.workflowList = {
        approverOpinions: "",
        approverType: "TEXT",
      }
    } else {
      this.workflowList = {
        approverOpinions: "同意",
        approverType: "TEXT",
      }
    }

  },
  methods: {
    getNameList(item) {
      const arr = [];
      item && item.length > 0 && item.map(item => {
        arr.push(item.memberName)
      })
      return arr.join(',')
    },
    // 获取附件
    getFileList(list) {
      list.map((item) => {
        item.approverFileId = item.fileId;
        item.approverFileName = item.fileName;
        item.approverType = "FILE";
      });
      this.showAttachedList = list;
    },
    /**
     *  获取审批意见参数
     */
    getObj(val) {
      return {
        list: [...this.showAttachedList, this.workflowList],
        VoList: [this.ruleForm.nodeNameList],
        userVoList: this.ruleForm.approvalList || [],
        type:
          val === 1
            ? "adopt"
            : val === 2
            ? "return"
            : val === 3
              ? "opinion"
              : "approval",
        isEdit: this.$route.query.sourceType === "INAPPROPRIATEPROCESS", // 是否可以编辑， true 不可编辑 就不用掉保持接口
      };
    },
    /**
     * 通过
     */
    handleOk(val) {
      this.btnClick = true
      const {sourceType} = this.$route.query;
      switch (val) {
        case 1:
          if (sourceType === "INAPPROPRIATEPROCESS") {
            // 非适审批人选中之后，经办人进入重新选人提交
            this.showSelect = 3;
            this.visible = true;
            this.btnClick = false
            this.getPersonList(); // 经办人重新选择人员
          } else {
            this.$emit("getApprovalParams", this.getObj(val)); // 通过
          }
          break;
        case 2: // 退回
          this.showSelect = val;
          if (this.noShowOption.isChooseNode) {
            this.visible = true;
            if (this.easyMode) {
              this.workflowList = {
                approverOpinions: "不同意",
                approverType: "TEXT",
              }
            }
            this.btnClick = false
            this.getApprovedList(); // 选择退回节点
          } else {
            this.$emit("getApprovalParams", this.getObj(val)); // 通过
          }
          break;
        case 3: // 意见征询
          this.showSelect = val;
          this.visible = true;
          this.getPersonList(); // 意见征询选择人员
          this.btnClick = false
          break;
        case 4: // 非适格审批人
          this.$confirm("点击确认后,直接返回经办人", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            lockScroll: false
          })
            .then(() => {
              this.getInAppropr(); // 非适格审批人提交 不能编辑
            }).catch((err) => {
            this.btnClick = false
            console.log(err)
          })
          break;
        default:
          this.showSelect = null;
      }
      setTimeout(() => {
        this.btnClick = false
      }, 5000);
    },
    // 退回请求人员
    async getApprovedList() {
      const {code, data} = await getApprovedList({
        id: this.$route.query.id || this.workflowHistoryId,
      });
      let arr = [];
      if (code === "000000") {
        this.options = data.ecmContractProcessConfigVoList || [];
        this.options.length > 0 && this.options.map(item => {
          item.ecmBusinessMemberVoList && item.ecmBusinessMemberVoList.length > 0 && item.ecmBusinessMemberVoList.map(ite => {
            arr.push(ite.memberName)
          })
          item.memberName = arr.join(',')
          arr = [];
        })
      }
    },
    /**
     * 弹窗取消 确定
     */
    handleClose(val) {
      this.btnClick = true
      if (val === 1) {
        this.btnClick = false
        this.visible = false;
        this.$refs.ruleForm.resetFields()
        this.ruleForm = {
          nodeNameList: "",
          approvalList: [],
        };
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.$route.query.sourceType === "INAPPROPRIATEPROCESS") {
              // 非适格审批人，经办人重新选择人员
              this.getAuditApprove();
            } else {
              if (this.showSelect === 2) {
                // 退回
                this.$emit("getApprovalParams", this.getObj(2)); // 退回返回数据到页面，可编辑保存，在退回流程
              } else {
                this.$emit("getApprovalParams", this.getObj(3)); // 征询审批人
              }
            }
          }
        });
        setTimeout(() => {
          this.btnClick = false
        }, 5000);
      }
    },
    /**
     *  同意审批
     * @returns {Promise<void>}
     */
    async getAuditApprove() {
      const {code} = await getAuditApprove({
        id: this.$route.query.id || this.workflowHistoryId,
        bpmProcessTaskOpinionsFormList: [
          ...this.showAttachedList,
          this.workflowList,
        ],
        userVoList: this.ruleForm.approvalList,
      });
      if (code === "000000") {
        this.$router.push({name: "agencymatter"});
      }
    },
    /**
     *  非适格审批人
     * @returns {Promise<void>}
     */
    async getInAppropr() {
      const {code} = await getInAppropr({
        id: this.$route.query.id || this.workflowHistoryId,
        bpmProcessTaskOpinionsFormList: [
          ...this.showAttachedList,
          this.workflowList,
        ],
      });
      if (code === "000000") {
        this.$router.push({name: "agencymatter"});
      }
    },
    // 查询人员的数据
    async getPersonList() {
      let params = {...this.pageData};
      params.orgCode = this.orgCode;
      params.userName = this.username;
      const {code, data} = await getPersonList(params);
      if (code === "000000") {
        this.approvalList = data.content;
        this.pageData.total = data.total;
        this.pageData.totalPage = data.totalPage;
      }
    },
    // 选择某一个人员后
    chooseItem(item) {
      this.inputData = item;
      this.isShow = false;
    },
    // 上一页
    gotoPrev() {
      if (this.pageData.currentPage > 0) {
        this.pageData.currentPage--;
      }
      this.getPersonList();
    },
    // 下一页
    gotoNext() {
      if (this.pageData.currentPage < this.pageData.totalPage) {
        this.pageData.currentPage++;
      }
      this.getPersonList();
    },
    // 跳转到某一页
    gotoCurrentPage(page) {
      this.pageData.currentPage = page;
      this.getPersonList();
    },
    // 从远程服务器搜索
    remoteMethod(item) {
      if (item.length > 0) {
        this.username = item;
        this.getPersonList();
      }
    },
    // 选中值后将值回传给父组件
    vauleChange(e) {
      this.$emit("input", e);
      let _this = this;
      setTimeout(function () {
        _this.$refs.selectAppType.blur();
      }, 50);
    },
  },
};
</script>

<style scoped lang="less">
.ft-z {
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 10px;
  display: block;
}

.approval-page {
  position: fixed;
  background: #fff;
  width: 15%;
  padding: 18px 14px;
  max-height: 660px;
  overflow: auto;
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
    color: #2393f7;
  }
}

.pagePagination {
  margin-top: 10px;
}

.sel-box {
  display: flex;
  justify-content: space-between;
}
</style>
