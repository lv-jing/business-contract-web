<template>
    <div class="report">
        <el-form label-width="100px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="组织">
                        <CommonTreeOrg :value="orgCode"
                            :treeSelect="treeSelectOrg"
                            :treeDelSelect="treedelOrg"
                            value-format="yyyy"
                            :selectAllLevel="true"
                        ></CommonTreeOrg>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="年度">
                        <el-date-picker
                            v-model="v_year"
                            type="year"
                            placeholder="选择年">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="月份">
                        <el-select v-model="v_month" clearable>
                            <el-option v-for="(item,index) in months" :key="index" :label="item+'月'" :value="item"></el-option>
                        </el-select>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <el-button type="primary" @click="queryInfo">查询</el-button>

                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row>
            <el-col :span="12">
                <contractStatusReport :queryParams="queryParams"></contractStatusReport>
            </el-col>
            <el-col :span="12">
                <contractMoneyReport :queryParams="queryParams"></contractMoneyReport>
            </el-col>
            <el-col :span="12">
                <contractTemplateReport :queryParams="queryParams"></contractTemplateReport>
            </el-col>
            <el-col :span="12">
                <approvalDayReport :queryParams="queryParams" :title="'审批时效统计'"></approvalDayReport>
            </el-col>
            <el-col :span="24">
                <approvalReport :queryParams="queryParams" :title="'专员工作统计'"></approvalReport>
            </el-col>
            
            <el-col :span="24">
                <contractSignReport :queryParams="queryParams"></contractSignReport>
            </el-col>
             <el-col :span="12">
                <contractSealReport :queryParams="queryParams"></contractSealReport>
            </el-col>
            <el-col :span="12">
                <contractPrintReport :queryParams="queryParams"></contractPrintReport>
            </el-col>
        </el-row>
        
       
    </div>
</template>

<script>
import contractStatusReport from '../contractStatusReport'
import contractTypeReport from '../contractTypeReport'
import contractMoneyReport from '../contractMoneyReport'
import contractTemplateReport from '../contractTemplateReport'
import contractSignReport  from '../contractSignReport'
import approvalReport from '../approvalReport'
import approvalDayReport from '../approvalReport/contractApprovalDay'
import contractPrintReport from '../contractPrintReport'
import contractSealReport from '../contractSealReport'
export default {
    data(){
        return {
            v_year:'',
            v_month:'',
            orgCode:null,
            months:[1,2,3,4,5,6,7,8,9,10,11,12],
            queryParams:{roleEnum: "LAWYER_MANAGER",}
        }
    },
    components:{
        contractStatusReport:contractStatusReport,
        contractTypeReport:contractTypeReport,
        contractMoneyReport:contractMoneyReport,
        contractTemplateReport:contractTemplateReport,
        contractSignReport:contractSignReport,
        approvalReport:approvalReport,
        contractPrintReport:contractPrintReport,
        contractSealReport:contractSealReport,
        approvalDayReport:approvalDayReport,
    },
    created(){

    },
    mounted(){
        
    },
    methods:{
        queryInfo(){
            // 参数变动后，自动查询
            let param = {
                year:this.v_year,
                month:this.v_month,
                orgCode:this.orgCode,
                roleEnum: "LAWYER_MANAGER"
            }
            this.queryParams = param
        },
        treeSelectOrg(val){
            this.orgCode = val.orgCode
        },
        treedelOrg(val){
            this.orgCode = null
        }
    }
}
</script>

<style lang="less">
    .report{
        .echart2 {
            padding: 24px 5px 24px 5px
        }
    }
</style>