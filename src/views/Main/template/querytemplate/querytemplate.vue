<template>
  <div class="queryTemplate">
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="适用组织范围" prop="unitId">
              <el-select class="w-100" v-model="ruleForm.unitId" placeholder="请选择">
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
                <el-button class="resetButton" @click="formResetMethod()" icon="iconfont sbt_add">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="bg-white user-form-table pd24">
      <templateTree :treeData="ruleForm" ref="templateTree" class="mt10"></templateTree>
    </div>
  </div>
</template>
<script>
import { getAllUnit, queryUserRole } from "@/service/4A/index";
import { dictSelectList } from "@/service/common/index";
import CommonSelect from "@/components/CommonSelect";
export default {
  name: "",
  components: {
    CommonSelect,
  },
  data() {
    return {
      ruleForm: {
        contractType: "",
        unitId: "",
        secondContractType:""
      },
      rules: {},
      show: false,
      templateUnitData: [],
      incomeData: [], //收支类型
      secondTemplateContractData: [],
      isAdmin: false,
    };
  },
  created() {},
  mounted() {
    this.ruleForm.unitId = this.$store.state.common.userInfo.unitCode;
    this.getAllUnit();
  },
  methods: {
    // 获取所有事业部
    async getAllUnit() {
      let params = {}; // 查询所有事业部不用传参数
      const { code, data } = await getAllUnit(params);
      if (code === "000000") {
        console.log(data);
        this.templateUnitData = data;
      }
    },
    // 获取二级数据字典
    async getDictList(params) {
      const { code, data } = await dictSelectList(params);
      if (code === "000000") {
        this.secondTemplateContractData = data[0].dictVoList;
      }
    },
    // 查询
    formSearchMethod() {
      this.$refs.templateTree.getTree();
    },
    // 范本重置
    formResetMethod() {
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
    changeIncome(params) {
      let obj = {
        dictCode: params,
      };
      this.secondTemplateContractData = [];
      this.ruleForm.contractType = "";
      this.ruleForm.secondContractType = ""
      this.getDictList(obj);
    },
    // 获取当前人的角色
    async getCurrentPersonRole() {
      let userInfo = this.$store.state.common.userInfo;
      let params = {
        deputyAccountId: userInfo.deputyAccountId,
        roleCode: "contract_template_admin",
      };
      const { code, data } = await queryUserRole(params);
      if (code === "000000") {
        if (data.length === 0) {
          this.isAdmin = false;
        } else {
          this.isAdmin = true;
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.queryTemplate {
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