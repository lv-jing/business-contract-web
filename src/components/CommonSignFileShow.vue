<template>
  <div>
    <common-title class="ft16 pd24" title="文件信息" />
    <fieldset style="border:1px solid gray;border-radius:5px;" class="ml20">
      <legend class="ft16 ml20">审批单</legend>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item style="text-align:center;">
            <el-link type="primary">合同审批单</el-link>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button class="button" type="primary" icon="iconfont sbt_add">打印预览</el-button>
            <el-button class="button" type="primary" icon="iconfont sbt_add">下载</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </fieldset>

    <fieldset
      v-if="contractInfo.ecmBusinessAttamentList"
      style="border:1px solid gray;border-radius:5px;"
      class="ml20 mt20"
    >
      <legend class="ft16 ml20">合同</legend>
      <div v-for="(item,index)  in contractInfo.ecmBusinessAttamentList" v-bind:key="index">
        <el-row
          :gutter="24"
          v-if="item.businessType === 'template' && item.fileStatus === 'STA004'"
        >
          <el-col :span="12">
            <el-form-item style="text-align:center;">
              <el-link @click="preview(item)" type="primary">{{item.fileName}}</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button
                class="button"
                type="primary"
                @click="preview(item)"
                icon="iconfont sbt_add"
              >打印预览</el-button>
              <el-button
                class="button"
                type="primary"
                @click="downLoad(item)"
                icon="iconfont sbt_add"
              >下载</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </fieldset>

    <fieldset style="border:1px solid gray;border-radius:5px;" class="ml20 mt20">
      <legend class="ft16 ml20">见证资料</legend>
      <div v-for="(item,index)  in contractInfo.ecmBusinessAttamentList" v-bind:key="index">
        <el-row :gutter="24" v-if="item.businessType === '2'">
          <el-col :span="12">
            <el-form-item style="text-align:center;">
              <el-link type="primary">{{item.fileName}}</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button class="button" type="primary" @click="cancel" icon="iconfont sbt_add">打印预览</el-button>
              <el-button class="button" type="primary" @click="cancel" icon="iconfont sbt_add">下载</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </fieldset>
  </div>
</template>
<script>
import { downloadUrl, previewUrl } from "@/service/file";
export default {
  props: {
    contractInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    preview(item) {
      let token = this.$Cookie.get("token");
      window.open(
        previewUrl +
          "/" +
          item.fileId +
          "/" +
          item.fileId +
          "/" +
          "?token=" +
          token
      );
    },
    downLoad(item) {
      let token = this.$Cookie.get("token");
      window.open(downloadUrl + "/" + item.fileId + "/" + "?token=" + token);
    },
    printContractInfo() {
      let routeData = this.$router.resolve({
        path: "/contractPrintForm",
        query: {
          contractId: this.contractId
        },
      });
      window.open(routeData.href, "_blank",'width=800,height=900,scrollbars=yes');
    },
  },
};
</script>
<style lang="less" scoped>
fieldset {
  min-height: 80px;
}
</style>