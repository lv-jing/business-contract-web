<template>
  <div>
    <el-form>
      <el-row :gutter="24">
        <el-col :span="$route.query.type==='approval'?19:24">
          <div class="bg-white">
            <common-title class="ft16 pd24" title="合同简要信息" />
          </div>
          <div class="bg-white p25 mt10">
            <CommonContractInfo v-model="contractInfo" :contractId="contractId"></CommonContractInfo>
          </div>
          <!--审批历史-->
          <div class="bg-white mt10 pd16">
              <!-- <common-tableappoval :ApprovalData="ApprovalData" :pinionsList="pinionsList" /> -->
              <CommonSignFileShow :contractInfo="contractInfo"></CommonSignFileShow>
          </div>
        </el-col>
        <el-col v-if="$route.query.type==='approval'" :span="5">
          <common-mode :noShowOption="noShowOption" v-on:getApprovalParams="getApprovalParams"></common-mode>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getDetail,getAuditApprove,rejectProcess,getConsult} from "@/service/work/index";

export default {
  data() {
    return {
      contractId: "",
      contractInfo: {},
      noShowOption:{}
    };
  },
  mounted() {
    this.getProcessInfo();
    this.noShowOption = {
      isPass: true, // 通过
      isReject: true, // 退回
      isShowConsult: false, //意见征询按钮
      isShowNoSuitApproval: false, // 是否非适格审批按钮
      isChooseNode: true, // 是否选择节点
    };
  },
  methods: {
    async getProcessInfo() {
      let processId = this.$route.query.id;
      const { code, data } = await getDetail({ id: processId });
      if (code === "000000") {
        this.contractId = data.contractId;
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList;
      }
    },
    async getApprovalParams(params){
        if (params.type === "adopt") {
        // 提交或者通过
        //点击通过按钮
        const { code } = await getAuditApprove({
          id: this.$route.query.id,
          bpmProcessTaskOpinionsFormList: params.list,
        });
        if (code === "000000") {
          this.$message({ type: "success", message: "审批成功！" });
          setTimeout(() => {
            this.$router.push({ name: "agencymatter" });
          }, 500);
        }
      } else if (params.type === "return") {
        // 退回
        let obj = {
          id: this.$route.query.id,
          ecmContractProcessConfigVoList: params.VoList,
          bpmProcessTaskOpinionsFormList: params.list,
        };
        const { code, data } = await rejectProcess(obj);
        if (code === "000000") {
          this.$message({ type: "success", message: "退回成功！" });
          setTimeout(() => {
            this.$router.push({ name: "agencymatter" });
          }, 500);
        }
      }
    }
  },
};
</script>
<style lang="less" scoped>
</style>