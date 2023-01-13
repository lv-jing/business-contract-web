<template>
  <div class="template">
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="适用组织范围" prop="unitId">
              <el-select class="w-100" :disabled="!isAdmin" v-model="ruleForm.unitId" placeholder="请选择">
                <el-option
                  v-for="item in templateUnitData"
                  :key="item.unitCode"
                  :label="item.unitName"
                  :value="item.unitCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收支类型" prop="firstContractType">
              <common-select
                v-model="ruleForm.firstContractType"
                dictCode="INCOME_EXPE_TYPE"
                :value="ruleForm.firstContractType"
                :handleChange="changeIncome"
                placeholder="请选择收支类型"
                :isSplicing="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二级类型" prop="secondContractType">
              <el-select class="w-100" v-model="ruleForm.secondContractType" placeholder="请选择">
                <el-option
                  v-for="item in secondTemplateContractData"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="范本名称" prop="templateName">
              <el-input v-model="ruleForm.templateName" placeholder="请输范本名称"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8" :push="8">
            <el-form-item>
              <div style="float:right;">
                <el-button type="primary" @click="formSearchMethod" icon="iconfont sbt_add">查询</el-button>
                <el-button class="resetButton" @click="formResetMethod" icon="iconfont sbt_add">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="bg-white user-form-table pd24">
      <el-button type="primary" @click="gotoAddTemplate" icon="iconfont sbt_add">新增</el-button>
      <templateTree :treeData="ruleForm" :fromType="'manager'" ref="templateTree" class="mt10">优化</templateTree>
    </div>
  </div>
</template>
<script>
import { dictSelectList } from "@/service/common/index";
import { getAllUnit,queryUserRole} from "@/service/4A/index";
export default {
  name: "",
  data() {
    return {
      rules: {},
      templateUnitData: [],
      secondTemplateContractData: [],
      ruleForm: {
          unitId:'',
          secondContractType:''
      },
      isAdmin:false
    };
  },
  created() {},
  mounted() {
    this.ruleForm.unitId = this.$store.state.common.userInfo.unitCode
    this.getCurrentPersonRole()
    this.getAllUnit()
  },
  methods: {
    // 获取所有事业部
    async getAllUnit() {
      let params = {}; // 查询所有事业部不用传参数
      const { code, data } = await getAllUnit(params);
      if (code === "000000") {
        this.templateUnitData = data;
      }
    },
    // 查询按钮
    formSearchMethod() {
        this.$refs.templateTree.getTree()
    },
    // 重置按钮
    formResetMethod(){
      this.ruleForm = {
        contractType: "",
        firstContractType: "",
        secondContractType: "",
        templateName: "",
        unitId:this.$store.state.common.userInfo.unitCode
      }
      setTimeout(() => {
        this.$refs.templateTree.getTree()
      }, 700);
    },
    // 获取二级数据字典
    async getDictList(params) {

    },
    // 一级菜单触发的事件
    async changeIncome(params) {
      let obj = {
        dictCode: params,
      };
      this.ruleForm.secondContractType = ""
      this.secondTemplateContractData = [];
      this.ruleForm.contractType = "";
      const { code, data } = await dictSelectList(obj);
      if (code === "000000") {
        this.secondTemplateContractData = data[0].dictVoList
      }
    },
    // 新增
    gotoAddTemplate() {
      this.$router.push({
        name: "managetemplate",
        query: {
          type: "add",
        },
      });
    },
    // 获取当前人的角色
    async getCurrentPersonRole(){
      let userInfo = this.$store.state.common.userInfo
      let params = {
        deputyAccountId: userInfo.deputyAccountId,
        roleCode:'contract_template_admin'
      }
      const{code,data} = await queryUserRole(params)
      if(code === '000000'){
        if(data.length===0){
          this.isAdmin = false
        }else{
          this.isAdmin = true
        }
      }
    }
  },
};
</script>
<style lang="less" scoped>
.template {
  .resetButton {
    border: 1px solid #bbbfc4;
  }
  .tableColQuery {
    color: #2393f7;
    cursor: pointer;
  }
  .tableCol {
    color: #2393f7;
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
