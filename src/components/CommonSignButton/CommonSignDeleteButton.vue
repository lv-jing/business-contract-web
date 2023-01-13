<template>
  <span class="commonSignButton">
    <el-button class="button" type="primary" @click="deal" icon="iconfont sbt_add">流程作废</el-button>
    <el-dialog title="请输入流程作废原因" :visible.sync="centerDialogVisible" width="50%" append-to-body>
      <el-input type="textarea" :rows="5" v-model="disableReason" maxlength="60"
      show-word-limit></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>
<script>
import {
  contractDisable
} from "@/service/work";
export default {
  props: {
    contractId: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      centerDialogVisible:false,
      disableReason:''
    };
  },
  methods: {
    async deal() {
      this.centerDialogVisible = true;
    },
    async confirm(){
      if (!this.disableReason) {
        //是否输入了废止原因
        this.$message({ type: "warning", message: "请输入流程作废原因" });
        return;
      }
      // 删除流程
      let params = {
        contractId: this.contractId,
        disableReason: this.disableReason,
      };
      this.$confirm('此操作将作废合同流程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          contractDisable(params).then((res) => {
              if (res.code === "000000") {
                  this.$message({type:'success',message:'流程作废发起成功！'})
                setTimeout(() => {
                  this.$router.push({ name: "agencymatter" });
                }, 500);
              }
            })
            .catch((err) => {});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
      
    }
  },
};
</script>
<style lang="less" scoped>
.commonSignButton {
  margin-left: 10px;
  margin-right: 10px;
}
</style>