<template>
  <div class="div-root">
    <el-button size="mini" type="primary" style="margin: 0 5px;" @click="init">{{buttonName}}</el-button>
    <el-dialog title="同步数据" :visible.sync="digMenuVisible">
      <div class="div-tree" v-loading="treeLoading">
          <div style="padding-bottom:24px;font-size:16px;color:red;">查询条件不填写则默认同步当天的数据</div>
        <el-form label-width="100px" :inline="true">
            <el-row>
                <el-col :span="12" v-for="(item,index) in formLabel" v-bind:key="index">
                    <el-form-item :label="item.label">
                        <el-input v-model="searchForm[item.name]"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="digMenuVisible = false">关 闭</el-button>
        <el-button type="primary" @click="syncData">同步数据</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/utils/request";
import {syncMdmData,syncMdmInToData} from '@/service/timer/index'
export default {
  data() {
    return {
      LOGIN_URL: process.env.VUE_APP_BASE_LOGIN_URL,
      treeLoading: false,
      digMenuVisible: false,
      formLabel: [],
      searchForm:{},
      dataForm: {
        dept: {
          VIEW: "PS_DEPT_TBL_SOA_V",
          PROCEDURE_NAME: "isump_sync_pkg.sync_dept_info",
          WHERE : [{label:"部门编号",name:"DEPTID"},{label:"部门名称",name:"DESCR"}]
        },
        user: {
          VIEW: "PS_PERSONAL_VW",
          PROCEDURE_NAME: "isump_sync_pkg.sync_persion_info",
          WHERE : [{label:"员工编号",name:"EMPLID"},{label:"员工姓名",name:"NAME"},{label:"部门编号",name:"DEPTID"},{label:"证件号",name:"national_id"}]
        },
        org: {
          VIEW: "PS_DEPT_TREE_SOA_V",
          PROCEDURE_NAME: "isump_sync_pkg.sync_org_info",
          WHERE : [{label:"组织编号",name:"TREE_NODE"},{label:"组织名称",name:"DESCR"},{label:"上级组织编号",name:"PARENT_NODE"}]
        },
        unit: {
          VIEW: "PS_BUS_UNIT_TBL_HR_V",
          PROCEDURE_NAME: "isump_sync_pkg.sync_unit_info",
          WHERE : [{label:"事业部编码",name:"BUSINESS_UNIT"},{label:"事业部名称",name:"DESCR"}]
        },
        company: { VIEW: "PS_COMPANY_TBL_SOA_V", PROCEDURE_NAME: "" ,
        WHERE : [{label:"公司编码",name:"COMPANY"},{label:"公司名称",name:"DESCR"}]
        },
        job: {
          VIEW: "PS_JOBCODE_SOA_V",
          PROCEDURE_NAME: "isump_sync_pkg.sync_job_info",
          WHERE : [{label:"职务编码",name:"JOBCODE"},{label:"职务名称",name:"DESCR"}]
        },
        dict: { VIEW: "PSXLATITEM_SOA_V", PROCEDURE_NAME: "" },
        vendor: {VIEW: "", PROCEDURE_NAME: "isump_sync_pkg.sync_vendor_info" },
         WHERE : [{label:"供应商编码",name:"VENDOR_NUM"},{label:"供应商名称",name:"VENDOR_NAME"}]
      },
    };
  },
  props: {
    dataType: {
      type: String,
      default: () => "user",
    },
    buttonName: {
        type: String,
        default: () => "同步人员信息",
    }
  },
  methods: {
    syncData() {
        let params = ""
        let index = 0;
        this.formLabel.forEach(form=>{
            let val = this.searchForm[form.name]
            if(val){
                if(index > 0) {
                    params += " and "
                }
                params +=  form.name + "='" + this.searchForm[form.name] + "' "
                
                index++
            }
        })
       this.treeLoading = true
       this.syncMdmInfo(params);
       
    },
    async syncMdmInfo(where) {
      let params = {
        procedureName: this.dataForm[this.dataType].PROCEDURE_NAME,
        viewName: this.dataForm[this.dataType].VIEW,
        whereName: where,
      };
      
    
      if(params.viewName){
        const { code, data } = await syncMdmData(params);
        if(code === '000000'){
            if(params.procedureName){
                const { code2, data2 } = await syncMdmInToData(params);
                if(code2 === '000000'){
                    this.$message({
                    message: "同步数据处理完成！",
                    type: "success",
                    });
                }
            }else{
                 this.$message({
                    message: "从源系统同步成功！",
                    type: "success",
                });
            }
        }
        this.treeLoading = false
      }else if(params.procedureName){
        const { code2, data2 } = await syncMdmInToData(params);
        if(code2 === '000000'){
             this.$message({
              message: "同步数据处理完成！",
              type: "success",
            });
        }
        this.treeLoading = false
      }
    },
    init() {
       this.treeLoading = false
       this.digMenuVisible = true 
       this.searchForm = {}
    }
  },
  mounted() {
      this.formLabel = this.dataForm[this.dataType].WHERE
     
  },
  created() {},
};
</script>
<style scoped>
.div-root {
  display: inline;
}
.div-tree {
  height: 300px;
  overflow-y: auto;
}
</style>