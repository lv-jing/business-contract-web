<template>
  <div>
    <el-form label-width="130px" :model="ruleForm" ref="rulesForm" :rules="rule">
      <b class="ft18">选择签署方式</b>
      <common-title class="ft16 pd24" title="合同简要信息" />
      <div class="bg-white p25">
        <CommonContractInfo v-model="contractInfo" :contractId="this.contractId"></CommonContractInfo>
      </div>
      <div class="bg-white mt20 pt30 pr20">
        <common-title class="ft16 pd24" title="请选择签署方式" />
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="签订方式" prop="signWay">
              <common-select
                :disabled="!isEdit"
                v-model="ruleForm.signWay"
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
                v-model="ruleForm.signOrder"
                :disabled="!isEdit"
                dictCode="SIGN_ORDER"
                :value="ruleForm.signOrder"
                placeholder="请选择用印顺序"
                :isSplicing="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="印章类型" prop="sealType">
              <common-select
                v-model="ruleForm.sealType"
                :disabled="!isEdit"
                dictCode="SEAL_TYPE"
                :value="ruleForm.sealType"
                placeholder="请选择印章类型"
                :isSplicing="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请用印合同份数" prop="printNum">
              <el-input-number
                class="w-100"
                v-model="ruleForm.printNum"
                :disabled="!isEdit"
                @change="handleChange"
                :min="1"
                :max="1000"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col v-show="isEdit" :span="24">
            <div class="pd24">
              <el-checkbox v-model="checked" class="ft16">
                <span style="color:red;" class="ft16 ml10">我承诺：后续签字盖章的合同文本与系统内最终审批的合同文本一致</span>
              </el-checkbox>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="button-box tr">
              <el-button @click="cancel" v-if="!isPop" icon="iconfont sbt_add">取消</el-button>
              <el-button
                type="primary"
                v-show="isEdit"
                :disabled="!checked"
                @click="confirm"
                icon="iconfont sbt_add"
              >确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import {
  getJump,
  getContractPrintInfo,
  changeContractPrint,
  saveContractPrint,
  queryCompanyStatus
} from "@/service/sign/index";
import { getAuditApprove,getDetail } from "@/service/work";

export default {
  data() {
    return {
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
        printNum: [
          {
            required: true,
            message: "请选择申请用印合同份数",
            trigger: "blur",
          },
        ],
      },
      ruleForm: {
        printNum: 1,
      },
      contractInfo: {},
      isEdit: false,
      isChange: false, // 是否从更改用印信息过来
      checked: false, // 是否勾选承诺
      jumpData:{},
      contractId: "",
      signType: "",
      isPop: false
    };
  },
     props: {
      contractIdParam: "",
      signTypeParam: ""
    },

  created(){
    if(this.contractIdParam){
      this.contractId = this.contractIdParam
      this.signType = this.signTypeParam
      this.isPop = true
    }else{
      this.contractId = this.$route.query.contractId
      this.signType = this.$route.query.signType
      this.isPop = false
    }
  },
  mounted() {
    // if(this.contractIdParam){
    //   this.contractId = this.contractIdParam
    //   this.signType = this.signTypeParam
    // }else{
    //   this.contractId = this.$route.query.contractId
    //   this.signType = this.$route.query.signType
    // }
    if(this.$route.query.id){
      this.getFormInfoByProcess()
    }else{
      this.getJump();
      this.getContractPrintInfo();
    }
    if (this.signType === "CHANGESIGN") {
      // 从【更改用印信息】过来
      this.isChange = true;
    }
  },
  methods: {
    confirm() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.ruleForm.contractId = this.contractInfo.contractId;
          this.ruleForm.contractName = this.contractInfo.contractName;
          this.ruleForm.contractNo = this.contractInfo.contractNo;
          // 判断，如果是线上签署，判断对方是否符合要求
          if(this.ruleForm.signWay==='SIW002'){
            // 电子签章
            this.checkCompany(entityNameArr => {
              if(entityNameArr.length > 0){
               this.$confirm("对方："+entityNameArr.join(',')+"未进行资质认证，是否继续使用电子签章", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                if (this.signType === "CHANGESIGN") {
                // 更改用印信息】点击确定
                this.changeContractPrint();
              } else if (this.signType === "CHOOSESIGNTYPE") {
                // 【选择签署方式】
                this.saveContractPrint();
              }
              }).catch(()=>{

              })
            }else{
              if (this.signType === "CHANGESIGN") {
                // 更改用印信息】点击确定
                this.changeContractPrint();
              } else if (this.signType === "CHOOSESIGNTYPE") {
                // 【选择签署方式】
                this.saveContractPrint();
              }
            }
            })
            
            
            
          }else{
            if (this.signType === "CHANGESIGN") {
              // 更改用印信息】点击确定
              this.changeContractPrint();
            } else if (this.signType === "CHOOSESIGNTYPE") {
              // 【选择签署方式】
              this.saveContractPrint();
            }
          }
        }
      });
    },
    cancel() {
      this.$router.go(-1);
    },
    async getJump() {
      let params = {
        businessId: this.contractId,
        objectTypeCode: "APPLY_PRINT_APPROVAL",
      };
      const { code, data } = await getJump(params);
      if (code === "000000") {
        this.jumpData = data
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
        // 如果从更改用印信息过来，就必须可以编辑
        if (this.isChange === true) {
          this.isEdit = true;
        }
      }
    },
    // 获取当前页的所有数据
    async getContractPrintInfo() {
      let params = {
        contractId: this.contractId,
      };
      const { code, data } = await getContractPrintInfo(params);
      if (code === "000000") {
        this.ruleForm = data;
      }
    },
    handleChange() {},
    // 保存合同打印
    async saveContractPrint() {
      const { code, data } = await saveContractPrint(this.ruleForm);
      if (code === "000000") {
        let params = {
          id: this.jumpData.bpmProcessTaskVo.workflowHistoryId
        }
        const{code,data} = await getAuditApprove(params)
        if(code ==='000000'){
          this.$message({ type: "success", message: "处理成功" });
          this.$router.push({ name: "printdownload" });
        }
        
      }
    },
    // 修改合同打印
    async changeContractPrint() {
      this.ruleForm.contractPrintId = null
      const { code, data } = await changeContractPrint(this.ruleForm);
      if (code === "000000") {
        this.$message({ type: "success", message: "处理成功" });
        this.$router.push({ name: "printdownload" });
      }
    },
     // 通过流程进来，获取表单信息
    async getFormInfoByProcess() {
      let processId = this.$route.query.id;
      const { code, data } = await getDetail({ id: processId });
      if (code === "000000") {
        this.contractId = data.contractId
        this.signType === "CHOOSESIGNTYPE"
        this.getJump();
        this.getContractPrintInfo();
      }
    },
    async checkCompany(callback){
      let entityNameArr = []
      for(let i=0;i<this.contractInfo.contractEntityList.length;i++){
        let element = this.contractInfo.contractEntityList[i]
        if(!element.entityId){
          this.$message({type:'warning',message:'对方：'+element.entityName+'，在系统中不存在，不允许进行电子签章！'})
          return
        }
        if(element.entityType === 'ENT02'){
          const { code, data } = await queryCompanyStatus({entityName:element.entityName})
          if(code==='000000' && data != 'PASSED'){
            entityNameArr.push(element.entityName)
          }
        }
      }
      callback && callback(entityNameArr)
    } 
  },
};
</script>

<style lang="less" scoped>
</style>
