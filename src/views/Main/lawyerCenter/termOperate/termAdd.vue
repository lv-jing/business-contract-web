<template>
  <div class="addTerm">
    <div class="bg-white mb24 pd24">
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        ref="ruleForm"
        :class="show?'over-vis':'over-hid'"
      >
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="条款名称">
                <el-select style="width:30%;" v-model="obj.termsType" placeholder="请选择条款类型">
                  <el-option
                    v-for="item in termTypeData"
                    :key="item.dictName"
                    :label="item.dictName"
                    :value="item.dictName"
                  ></el-option>
                </el-select>

                <el-input
                  style="width:30%;margin-left:5%;"
                  v-model="obj.termsOption"
                  placeholder="针对条款的使用情况的简易说明"
                ></el-input>
                <el-select
                  style="width:30%;margin-left:5%;"
                  v-model="obj.unitName"
                  placeholder="请选择事业部"
                >
                  <el-option
                    v-for="item in templateUnitData"
                    :key="item.unitCode"
                    :label="item.unitName"
                    :value="item.unitName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="条款编号" prop="termsNo">
                <el-input v-model="ruleForm.termsNo" :disabled="true" placeholder></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="创建人" prop="createdByName">
                <el-input v-model="ruleForm.createdByName" :disabled="true" placeholder="请输入创建人名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间" prop="creationDate">
                <el-input v-model="ruleForm.creationDate" :disabled="true" placeholder="请输入创建时间"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="条款语言" prop="termsLanguage">
                <common-select
                  v-model="ruleForm.termsLanguage"
                  dictCode="LANGUAGE"
                  :value="ruleForm.termsLanguage"
                  placeholder="请选择条款语言"
                  :isSplicing="false"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-bg" v-loading="visibleWebOffice">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="条款内容" prop="accountName">
                <span class="detailItem" @click="openIwebOffice">
                  <i class="el-icon-s-order"></i>
                  {{obj.termsType&&obj.termsOption&&obj.unitName?obj.termsType +
                  "-" +
                  obj.termsOption +
                  "-" +
                  obj.unitName+'.doc':'创建条款'}}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="24">
          <el-col :span="12" push="12">
            <el-button style="float:right;" type="primary" @click="confirmButton">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <commonApproval
      :visible="visible"
      :handleCancel="handleCancel"
      :approvalParams="approvalParams"
      v-on:get-approvl-start="getApprovlStart"
    />
  </div>
</template>
<script>
import { addTerm, getBussAttament } from "@/service/terms/index";
import { OpenKgWindow } from "@/utils/tools";
import CommonSelect from "@/components/CommonSelect";
import { mapState, mapGetters } from "vuex";
import { getAllUnit } from "@/service/4A/index";
import { dictSelectList } from "@/service/common/index";
export default {
  data() {
    return {
      obj: {
        termsOption: "",
        termsType: "",
        unitName: "",
      },
      ruleForm: {
        termsName: "",
      },
      rules: {},
      show: true,
      value: "",
      userInfo1: {},
      templateUnitData: [],
      termTypeData: [],
      rules: {
        termsLanguage: [
          { required: true, message: "请选择条款语言", trigger: "blur" },
        ],
      },
      clickedIwebOffice: false,
      visible: false,
      approvalParams: {},
      visibleWebOffice: false,
      isComfirmApproval: false,
    };
  },
  components: {
    CommonSelect,
  },
  created() {
    this.ruleForm.createdByName = this.$store.state.common.userInfo.userName;
    this.ruleForm.creationDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
  },
  mounted() {
    // 获取字典值
    this.getDict();
    // this.ruleForm.termsName = "测试条款" + new Date().getTime();
    this.getAllUnit();
  },
  methods: {
    async getDict() {
      let dictCode = {
        dictCodes: "TERMS_FIRST_PART",
      };
      const { code, data } = await dictSelectList(dictCode);
      if (code === "000000") {
        this.termTypeData = data[0].dictVoList;
      }
    },

    // 获取所有事业部
    async getAllUnit() {
      let params = {}; // 查询所有事业部不用传参数
      const { code, data } = await getAllUnit(params);
      if (code === "000000") {
        console.log(data);
        this.templateUnitData = data;
      }
    },
    openType() {},
    formResetMethod() {},
    //调用iwebOffice
    async openIwebOffice() {
      this.clickedIwebOffice = true;
      let token = this.$Cookie.get("token");
      if (this.ruleForm.termsId) {
        this.visibleWebOffice = false;
        this.clickedIwebOffice = false;
        this.visibleWebOffice = true;
        // 先查询下是否已经有一个文档了
        const { code, data } = await getBussAttament(this.ruleForm.termsId);
        if (code === "000000") {
          let token = this.$Cookie.get("token");
          this.clickedIwebOffice = false;
          this.visibleWebOffice = false;
          let docFileName = encodeURIComponent(
            this.obj.termsType +
              "-" +
              this.obj.termsOption +
              "-" +
              this.obj.unitName
          );
          if (data.fileId) {
            OpenKgWindow(
              "?openType=open&docFileName=" +
                docFileName +
                "&isSave=true&isTermCreate=true&isShowAllBookMarks=true&operateType=term&ObjectId=" +
                this.ruleForm.termsId +
                "&fileId=" +
                data.fileId +
                "&token=" +
                token
            );
          } else {
            OpenKgWindow(
              "?openType=add&docFileName=" +
                docFileName +
                "&isSave=true&isTermCreate=true&isShowAllBookMarks=true&operateType=term&ObjectId=" +
                this.ruleForm.termsId +
                "&fileId=" +
                data.fileId +
                "&token=" +
                token
            );
          }
        }
      } else {
        this.confirm(this.ruleForm);
      }
    },
    // 提交
    confirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.obj.termsType === "") {
            this.$message({ type: "error", message: "请选择条款类型！" });
            return;
          }
          if (this.obj.termsOption === "") {
            this.$message({ type: "error", message: "请输入适用场景！" });
            return;
          }
          if (this.obj.unitName === "") {
            this.$message({ type: "error", message: "请选择事业部！" });
            return;
          }

          this.ruleForm.termsName =
            this.obj.termsType +
            "-" +
            this.obj.termsOption +
            "-" +
            this.obj.unitName;
          this.ruleForm.termsVersion = "1";
          this.ruleForm.statue = "0";
          this.addToTerm(this.ruleForm);
        }
      });
    },
    // 点击确认按钮
    async confirmButton() {
      // 先去校验下条款数据
      if (this.ruleForm.termsId) {
        const { code, data } = await getBussAttament(this.ruleForm.termsId);
        if (code === "000000") {
          if (data.fileId) {
            this.confirm();
          } else {
            this.$message({ type: "error", message: "请编辑好条款！" });
          }
        }
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            //不写
          } else {
            // 不写
          }
        });
        this.$message({ type: "error", message: "请编辑好条款！" });
      }
    },
    handleCancel() {
      this.visible = false;
    },
    // 发起审批
    getApprovlStart(params) {
      console.log(typeof params);
      this.isComfirmApproval = true;
      this.ruleForm.sysProcessLinkHeadVo = params.sysProcessLinkHead;
      this.confirm();
    },
    async addToTerm(params) {
      const { code, data } = await addTerm(params);
      if (code && code == "000000") {
        this.ruleForm = data;
        // this.reGoUrl(data)
        // 这个表示已经发起了流程，并且已经成功
        if (this.isComfirmApproval) {
          this.$message({ type: "success", message: "条款流程发起成功！" });
          setTimeout(() => {
            this.$router.push({ name: "agencymatter" });
          }, 500);
          return;
        }
        //此处表示提交成功
        if (this.clickedIwebOffice) {
          this.openIwebOffice();
        } else {
          this.$message({ type: "success", message: "新增条款成功！" });
          if (this.ruleForm.termsId) {
            this.approvalParams = {
              objectTypeCode: "TERMS_APPROVAL",
              businessId: this.ruleForm.termsId,
            };
            this.visible = true;
          }
        }
      } else {
        this.clickedIwebOffice = false;
        this.$message("新增条款失败");
      }
    },
  },
};
</script>
<style lang="less">
.addTerm {
  .detailItem {
    color: #2393f7;
    cursor: pointer;
  }
}
</style>