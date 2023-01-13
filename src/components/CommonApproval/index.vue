<template>
  <div class="commonApproval">
    <el-dialog
      :visible.sync="visible"
      width="35%"
      title="审批人"
      :show-close="false"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-dialog
        class="append-content"
        width="40%"
        title="审批人"
        :visible.sync="innerVisible"
        append-to-body
      >
        <div class="append-content">
          <el-row :gutter="24">
            <el-col :span="12">
              <commonItemSelect
                v-show="selectShow"
                v-model="remindPersonObj"
                :value="remindPersonObj"
                :onChange="onChange"
                placeholder="请添加审批人"
              ></commonItemSelect>
              <div style="height: 300px;">
                <vue-scroll>
                  <el-tree
                    show-checkbox
                    class="filter-tree"
                    :data="treeUserNameData"
                    :props="defaultProps"
                    default-expand-all
                    node-key="userCode"
                    :default-checked-keys="checkdKeys"
                    @check="handleTreeChange"
                    :filter-node-method="filterNode"
                    ref="tree"
                  ></el-tree>
                </vue-scroll>
              </div>
            </el-col>
            <el-col :span="12">
              <span style="color: #999999;font-size: 12px;">已选：{{ num }} 人</span>
              <p v-for="item in treeUserNamelist" :key="item.userCode">{{ item.userName }}</p>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleTreeCancel">取消</el-button>
          <el-button type="primary" @click="handleTreeOk">确定</el-button>
        </span>
      </el-dialog>
      <el-form
        :model="formDialog"
        :rules="rulesDialog"
        label-width="80px"
        ref="ruleFormDialog"
        class="demo-ruleForm"
      >
        <el-form-item label="其他要素" prop="accountName" v-if="isShow && options.length>1">
          <el-select
            value-key="linkHeadId"
            class="w-100"
            v-model="formDialog.accountName"
            placeholder="请选择审批流程"
            @change="handleChange"
          >
            <el-option
              v-for="item in options"
              :key="item.linkHeadId"
              :label="item.linkName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="height: 300px; padding-left: 40px;">
        <vue-scroll>
          <el-steps direction="vertical" :active="1" :space="75">
            <template v-for="(item,index) in businessList.sysProcessLinkLineVoList">
              <template v-for="(item1,index1) in item.sysProcessLinkLineNodeVoList">
                <el-step>
                  <template slot="title">{{ item1.nodeName }}</template>
                  <template slot="description" >
                    <span class="upload-hover" style="font-size: 14px;" v-for="(items,index2)  in item1.userVoList">
                      {{  items.userName&& items.userCode&&items.userName + ' ' + items.userCode||''}}
                        <span v-show="index2!==item1.userVoList.length-1">,</span>
                    </span>
                    <i v-show="item1.fixedNode!=='N'"
                       style="color: #2393F7;"
                      class="el-icon-edit pointer show-hidden"
                      @click="hanldeName(item1,index,index1)"
                    ></i>
                    <span style="font-size: 12px;margin-left: 5px;" v-show="item1.fixedNode!=='N'&&item1.userVoList.length<1">请选择人员</span>
                  </template>
                </el-step>
              </template>
            </template>
          </el-steps>
        </vue-scroll>
        <span style="font-size: 12px;color: red;">请您校验是否符合审批权限，如有偏差可点击对应节点的小铅笔进行修改</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="viewPic">查看流程图</el-button>
        <el-button @click="handleCancel('ruleFormDialog')">取 消</el-button>
        <el-button type="primary" @click="handleOk('ruleFormDialog')" :loading="okLoading" >确 定</el-button>
      </span>
    </el-dialog>
      <el-dialog title="查看流程图"
             :visible.sync="dlgPic" width="70%" style="overflow-x: scroll ">
            <CommonWorkflowPicture :linkHeadId="sysProcessLinkHeadVo.linkHeadId"></CommonWorkflowPicture>
        </el-dialog>
  </div>
</template>

<script>
import {getApprovlList} from "@/service/work";
import {mapState} from "vuex";

export default {
  props: {
    // 显示隐藏弹窗
    visible: {
      type: Boolean,
      default: () => false,
    },
    // 显示隐藏弹窗
    isShow: {
      type: Boolean,
      default: () => false,
    },
    // 弹窗取消
    handleCancel: {
      type: Function,
      default: (val) => {
        return val;
      },
    },
    // 请求审批人员树需要的参数
    approvalParams: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      okLoading:false,
      selectShow:false,
      innerVisible: false,
      treeUserNameData: [], // 人员树总数据
      treeUserNamelist: [], // 选中人员列表
      defaultProps: {
        children: "children",
        label: "userName",
      },
      formDialog: {
        accountName: "",
      },
      remindPersonObj: {},
      filterText: "",
      options: [],
      rulesDialog: {},
      num: 0,
      checkdKeys: [],
      businessList: [],
      sysProcessLinkHeadVo: [],
      parentIndex: "", // 更改审批人父索引
      childIndex: "", // 更改审批人子索引
      dlgPic: false
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.okLoading = false;
        this.getApprovlList(this.approvalParams);
      }
    },
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.common.userInfo,
    }),
  },
  methods: {
    onChange(val) {
      var flag = false;
      this.treeUserNameData.map(item => {
        if (item.userCode === val.userCode) {
          flag = true
        }
      })
      if (!flag) {
        this.treeUserNameData.push(val)
        this.remindPersonObj = {}
        flag = false
      }
    },
    handleChange(val) {
      this.businessList = {}
      let list = JSON.parse(JSON.stringify(val)) || [];
      this.sysProcessLinkHeadVo = JSON.parse(JSON.stringify(val)) || [];
      this.setList(list)
    },
    async getApprovlList(params) {
      const {code, data} = await getApprovlList(params);
      if (code === "000000") {
        let list = JSON.parse(JSON.stringify(data.sysProcessLinkHeadVo)) || [];
        this.sysProcessLinkHeadVo = JSON.parse(JSON.stringify(data.sysProcessLinkHeadVo)) || [];
        this.setList(list)
        this.options = data.sysProcessLinkHeadVoList || []
        this.formDialog.accountName = this.options[0]
        this.$nextTick(() => {
          this.visible = true;
        });
      }
    },
    setList(arr) {
      let list = JSON.parse(JSON.stringify(arr))
      list.sysProcessLinkLineVoList.map((item) => {
        item.sysProcessLinkLineNodeVoList.map((items) => {
          // 等于1就显示一条
         if(items.defaultAll==='1'){
           items.userVoList.map((it, index) => {
             if (index > 0) {
               items.userVoList.splice(index, items.userVoList.length - 1);
             }
           });
           // 不等于1.不等于Y 就显示空
          } else if(items.defaultAll!=='Y'){
           items.userVoList = []
         }
        });
      });
      this.businessList = Object.assign({}, list)
    },
    /**
     * 输入框查询
     * @param value 输入值
     * @param data 传递data
     * @returns {boolean}
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.userName.indexOf(value) !== -1;
    },
    /**
     * 选中节点
     * @param data data数据
     * @param node 节点对应node
     * @param e 本身
     */
    handleTreeChange(data, node) {
      this.treeUserNamelist = node.checkedNodes;
      this.num = node.checkedNodes.length;
    },
    /**
     * 点击更改流程人
     * index 父节点索引
     * indexs 子节点索引
     */
    hanldeName(items, index, index1) {
      console.log(items.dataAll);
      this.selectShow = items.dataAll==='Y'
      const list = [];
      const list1 = [];
      // 人员数总数据
      this.treeUserNameData = this.sysProcessLinkHeadVo.sysProcessLinkLineVoList[index].sysProcessLinkLineNodeVoList[index1].userVoList;

      if (items.userVoList.length === this.treeUserNameData) {
        this.treeUserNameData.map((item) => {
          list.push(item.userCode);
        });
        this.checkdKeys = list; // 选中人员
        this.num = this.checkdKeys.length;
        this.treeUserNamelist = this.treeUserNameData || []; // 选中人员
      } else {
        items.userVoList.map((item) => {
          list1.push(item.userCode);
        });
        this.checkdKeys = list1; // 选中人员
        this.num = this.checkdKeys.length;
        this.treeUserNamelist = items.userVoList || []; // 选中人员
      }
      this.parentIndex = index;
      this.childIndex = index1;
      this.innerVisible = true;
    },
    /**
     * 更改审批人弹窗取消
     */
    handleTreeCancel() {
      this.filterText = "";
      this.$refs.tree.setCurrentKey(null);
      this.innerVisible = false;
    },
    /**
     * 更改审批人确定
     */
    handleTreeOk() {
      if (!this.num) {
        this.$message.error("审评人必须有一人,请选择！");
        return;
      }
      this.businessList.sysProcessLinkLineVoList[
        this.parentIndex
        ].sysProcessLinkLineNodeVoList[
        this.childIndex
        ].userVoList = this.treeUserNamelist;
      this.innerVisible = false;
    },
    viewPic(){
      if(this.sysProcessLinkHeadVo.linkHeadId){
        this.dlgPic = true
      }else{
        this.$message({
          type:"warning",
          message:"无流程信息，无法查看流程图"
        })
      }
    },
    /**
     * 弹窗确定
     */
    handleOk() {
      this.okLoading = true;
      var flage = true;
      let list = JSON.parse(JSON.stringify(this.businessList)) || [];
      list.sysProcessLinkLineVoList ?  list.sysProcessLinkLineVoList.map((item) => {
        item.sysProcessLinkLineNodeVoList.map((items) => {
          if (items.userVoList.length < 1) {
            flage = false;
          }
          items.userVoList.map((it, index) => {
            if (!it.orgName && !it.orgId) {
              flage = false;
            }
          });
        });
      }): flage = false
      if (flage) {
        // 回传给父组件的审批人员流程
        this.$emit("get-approvl-start", {
          sysProcessLinkHead: this.businessList,
        });
        setTimeout(()=>{
          this.okLoading = false;
        },5000)
      } else {
        this.okLoading = false;
        this.$message.error("审批人员信息不完善,联系管理员配置审批人员!");
      }
    },
  },
};
</script>

<style lang="less">
  .el-step__title.is-process {
    font-weight: 400!important;
  }
</style>
