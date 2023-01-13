<template>
  <div>
    <div class="bg-white mb24 pd24">
      <el-form
        :model="ruleForm"
        label-width="100px"
        ref="ruleForm"
        :class="show?'over-vis':'over-hid'"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="合同名称编号" prop="contractName">
              <el-input v-model="ruleForm.contractName" placeholder="请输入合同名称编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="我方签约主体" prop="ourSide">
              <el-input v-model="ruleForm.ourSide" placeholder="请输入我方签约主体"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对方签约主体" prop="otherSide">
              <el-input v-model="ruleForm.otherSide" placeholder="请输入对方签约主体"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批完成时间">
              <datePicker ref="datePicker" v-model="timeData"></datePicker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-box tr">
        <el-button type="primary" @click="formSearchMethod" icon="iconfont sbt_add">查询</el-button>
        <el-button @click="formResetMethod()" icon="iconfont sbt_add">重置</el-button>
      </div>
    </div>
    <div class="bg-white user-form-table pd24">
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用印申请" name="first">
          <el-button type="primary" @click="chooseSign2" icon="iconfont sbt_add">单份用印</el-button>
          <el-button type="primary" @click="chooseSign" icon="iconfont sbt_add">批量用印</el-button>

        </el-tab-pane>
        <el-tab-pane label="更改用印" name="second">
          <el-button type="primary" @click="changeData" icon="iconfont sbt_add">更改用印信息</el-button>

        </el-tab-pane>
      </el-tabs>
       <CommonSignTabe ref="commonSignTable" @getData="getDataFromTable" :queryData="queryTableData"></CommonSignTabe>
    </div>

    <el-dialog title="批量用印申请" :visible.sync="dlgVisiable" width="75%">
        <common-title class="ft16 pdl24" title="请选择签署方式" />
        <el-form label-width="120px" :model="formInfo" ref="formInfos" :rules="rule">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="签订方式" prop="signWay">
              <common-select
                v-model="formInfo.signWay"
                dictCode="SIGN_WAY"
                :value="ruleForm.signWay"
                placeholder="请选择签订方式"
                :isSplicing="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用印顺序" prop="signOrder">
              <common-select
                v-model="formInfo.signOrder"
                dictCode="SIGN_ORDER"
                placeholder="请选择用印顺序"
                :value="formInfo.signOrder"
                :isSplicing="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="印章类型" prop="sealType">
              <el-popover
                placement="top-start"
                width="250"
                trigger="hover"
                content="选择印章类型：基于公司目前的管理，应优先选择加盖合同专用章，特殊情况下才可使用公章，请知晓！">
              <common-select
                slot="reference"
                v-model="formInfo.sealType"
                dictCode="SEAL_TYPE"
                :value="formInfo.sealType"
                placeholder="请选择印章类型"
                :isSplicing="false"
              />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="24" :push="1">
            <div class="pd24">
              <el-checkbox v-model="checked" class="ft16" fill="red">
                <span style="color:red;" class="ft16 ml10">我承诺：签字盖章的合同文本与系统内最终审批的合同文本一致</span>
              </el-checkbox>
            </div>
          </el-col>
        </el-row>
        </el-form>
         <div slot="footer" class="dialog-footer">
              <el-button @click="dlgVisiable = false">取 消</el-button>
              <el-button type="primary" :disabled="!checked" @click="saveInfo">确 定</el-button>
          </div>   
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { searchFormRule } from "./rules";
import {applySealBatch} from "@/service/sign/index"; 
export default {
  data() {
    return {
      show: false,
      overHeight: "150px",
      ruleForm: {
        statue: "STA005",
        contractName: "",
        ourSide: "",
        otherSide: ""
      },
      rule: {
        signWay: [
          { required: true, message: "请选择签订方式", trigger: "blur" },
        ],
        signOrder: [
          { required: true, message: "请选择用印顺序", trigger: "blur" },
        ],
        sealType: [
          { required: true, message: "请选择印章类型", trigger: "blur" },
        ],
      },
      deletUrl: "",
      searchFormModel: {},
      searchFormRule: searchFormRule,
      searchOption: {
        resetBtn: false,
        submitBtn: false,
        form: {
          size: "small",
        },
      },

      queryTableData: {},
      timeData: {
        startTime:'',
        endTime:''
      },
      choosedTableData:[],
      activeName: 'first',
      formInfo: {},
      dlgVisiable: false,
      checked: false
    };
  },
  mounted() {
    this.queryTableData = {
      type: "SEALAPPLICATION",
      data: this.ruleForm,
    };
  },

  methods: {
    handleClick(tab, event){
      if(tab.name === 'first'){
        this.ruleForm.statue = 'STA005'
      }else{
        this.ruleForm.statue = 'STA006,STA007,STA008,STA009,STA015'
      }
      this.formSearchMethod()
    },
    /**
     * 查询
     */
    formSearchMethod() {
      this.ruleForm.approvalTimeFrom = this.timeData.startTime;
      this.ruleForm.approvalTimeTo = this.timeData.endTime;
      this.queryContract();
    },
    /**
     * 重置
     */
    formResetMethod() {
      this.$refs.ruleForm.resetFields()
      this.timeData={
        startTime:'',
        endTime:''
      }
      this.$refs.datePicker.reset();
      this.ruleForm.approvalTimeFrom = ''
      this.ruleForm.approvalTimeTo =''
      this.queryTableData = {
        type: "SEALAPPLICATION",
        data: {...this.ruleForm},
      };
    },
    /**
     * 分页查询
     */
    async queryContract() {
      this.queryTableData = {
        type: "SEALAPPLICATION",
        data: {...this.ruleForm},
      };
      this.$refs.commonSignTable.getData();
    },

    getDataFromTable(params) {
      this.choosedTableData = []
      // if (params.length > 1 || params.length===0) {
      //   this.$message({ type: "error", message: "必须勾选且只能选一条！" });
      // } else {
        this.choosedTableData = [...params]
      // }
    },
    changeData() {
      if(this.choosedTableData && this.choosedTableData.length===1){
        if(this.choosedTableData[0].statue !=='STA006' && this.choosedTableData[0].statue !=='STA007'){
          this.$message({type:'error',message:'不满足合同更改用印信息条件！'})
          return
        }
        this.$router.push({
          name: "applyseal",
          query: { type: "auditing", contractId: this.choosedTableData[0].contractId,signType:'CHANGESIGN' },
        });
      }else{
        this.$message({type:'error',message:'请勾选一条'})
      }
    },
    chooseSign2(){
      if(this.choosedTableData && this.choosedTableData.length===1){
        if(this.choosedTableData[0].statue !=='STA005'){
          this.$message({type:'error',message:'该合同已申请用印！'})
          return
        }
        this.$router.push({
          name: "applyseal",
          query: { type: "auditing", contractId: this.choosedTableData[0].contractId,signType:'CHOOSESIGNTYPE' },
        });
      }else{
        this.$message({type:'error',message:'请勾选一条'})
      }

    },
    chooseSign(){
      this.formInfo = {}
      if(this.choosedTableData && this.choosedTableData.length>0){
        let contractIdArr = []
        this.choosedTableData.forEach(element=>{
            if(element.statue !=='STA005'){
              this.$message({type:'error',message:'该合同已申请用印！'})
              contractIdArr = []
              return
            }else{
              contractIdArr.push(element.contractId)
            }
        })
        if(contractIdArr && contractIdArr.length>0){
          let contractIds = contractIdArr.join(",")
          this.formInfo.contractIds = contractIds
          this.dlgVisiable = true
        }
      }else{
        this.$message({type:'error',message:'请至少勾选一条'})
      }
    },
    saveInfo(){
      this.$refs.formInfos.validate((valid) => {
        if (valid) {
          applySealBatch(this.formInfo).then(res=>{
            if(res.code==='000000'){
              this.$message({type:'success',message:'操作成功'})
              this.dlgVisiable = false
              this.formInfo = {}
              this.formSearchMethod()
            }else{
              this.$message({type:'error',message:res.data})
            }
          })
        }
      })
      
    }
  },
};
</script>

<style lang="less" scoped>
.over-hid {
  height: 150px;
  overflow: hidden;
}
.over-vis {
  height: auto;
  overflow: visible;
}
.button-center {
  text-align: center;
  span {
    font-size: 14px;
    color: #2393f7;
  }
}
</style>

