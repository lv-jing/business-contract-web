<template>
  <div>
    <el-form label-width="130px">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="合同名称">
            <div>{{formData.contractName}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同编号">
            <div>{{formData.contractNo}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同类型">
            <DictCodeToDictName
              :parentCode="'INCOME_EXPE_TYPE'"
              :dictCode="formData.contractTypeCode"
            ></DictCodeToDictName>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同含税额">
            <div>{{formData.includedAmount?formData.includedAmount/100:''}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="合同描述">
            <div>{{formData.contractDesc}}</div>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="我方签约主体">
            <div v-for="(item,index) in formData.contractEntityList" :key="index">
              <div v-if="item.entityType === 'ENT01'">{{item.entityName}}</div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对方签约主体">
            <div v-for="(item,index) in formData.contractEntityList" :key="index">
              <div v-if="item.entityType === 'ENT02'">{{item.entityName}}</div>
            </div>
          </el-form-item>
        </el-col>
       <!-- 
        <el-col :span="12">
          <el-form-item label="不含税合同额">
            <div>{{formData.includedAmount?formData.excludedAmount/100:''}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经办人">
            <div v-for="(item,index) in formData.ecmBusinessMemberList" :key="index">
              <div v-if="item.memberType === 'PET001'">{{item.memberName}}</div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发起部门">
            <div>{{formData.orgName}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式">
            <div v-for="(item,index) in formData.ecmBusinessMemberList" :key="index">
              <div v-if="item.memberType === 'PET001'">{{item.phone}}</div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同有效期">
            <div>{{formData.validDateStart?formData.validDateStart.substring(0,11)+'至':''}}{{formData.validDateEnd?formData.validDateEnd.substring(0,11):''}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否保密">
            <DictCodeToDictName :parentCode="'YES_NO'" :dictCode="formData.scret"></DictCodeToDictName>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否加防伪水印">
            <DictCodeToDictName :parentCode="'YES_NO'" :dictCode="formData.watermark"></DictCodeToDictName>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同份数">
            <div>{{formData.contractNumber}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同状态">
            <DictCodeToDictName :parentCode="'CONTRACT_STATUE'" :dictCode="formData.statue"></DictCodeToDictName>
          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getContractInfo } from "@/service/common";
export default {
  name: "index",
  data() {
    return {
      formData: {},
    };
  },
  model: {
    prop: "modelVal", //指向props的参数名
    event: "change", //事件名称
  },
  watch: {
    formData(val) {
      this.$emit("change", val);
    },
    contractId(val){
        if(this.contractId){
          this.getContractInfo(this.contractId);
      }
    }
  },
  props: {
    modelVal: "",
    contractId: {
      type: String,
      default: () => "",
    },
  },
  mounted() {
      if(this.contractId){
          this.getContractInfo(this.contractId);
      }
  },
  methods: {
    async getContractInfo(contractId) {
      const { code, data } = await getContractInfo({ contractId: contractId });
      if (code === "000000") {
        this.formData = data;
      }
    },
  },
};
</script>

<style scoped>
</style>
