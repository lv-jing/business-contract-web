<template>
    <div v-loading="isLoading" element-loading-text="正在导出，请稍后...">
        <div style="width:100%;text-align: right"><el-button type="primary" @click="exportData">导出</el-button></div>
        <el-table :data="tableData"
            style="width: 99%"
            :highlight-current-row="true"
            ref="moreTable"
            v-loading="loading"
            tooltip-effect="dark"
        >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="contractName" label="合同名称">
                <template v-slot="{row}">
                    <a class="pointer" @click="handleDetail(row)">{{ row.contractName }}</a>
                </template>
            </el-table-column>
            <el-table-column prop="contractNo" label="合同编号">
                <template v-slot={row}>
                    <a class="pointer" @click="handleDetail(row)">{{ row.contractNo }}</a>
                </template>
            </el-table-column>
                <el-table-column prop="contractDesc" label="合同描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ourEntityName" label="我方签约主体" show-overflow-tooltip></el-table-column>
            <el-table-column prop="otherEntityName" label="对方签约主体" show-overflow-tooltip></el-table-column>
            <el-table-column prop="includedAmount" label="含税合同金额（元）" align="right">
                <template v-slot="{row}">
                    {{row.includedAmount==null?"":row.includedAmount/100}}
                </template>
            </el-table-column>
            <el-table-column prop="approvalTime" label="完成审批日期">
                <template v-slot="{row}">
                    {{row.approvalTime!=null?row.approvalTime.substr(0,11):''}}
                </template>
            </el-table-column>
            <el-table-column prop="contractTypeCode" label="合同类型">
            <template v-slot="{row}">
                <DictCodeToDictName :parentCode="'INCOME_EXPE_TYPE'" :dictCode="row.contractTypeCode"></DictCodeToDictName>
            </template>
            </el-table-column>
            <el-table-column prop="statue" label="合同状态">
            <template v-slot="{row}">
                <DictCodeToDictName :parentCode="'CONTRACT_STATUE'" :dictCode="row.statue"></DictCodeToDictName>
            </template>
            </el-table-column>
            <el-table-column prop="orgName" label="主办部门"></el-table-column>
                <el-table-column prop="managerName" label="经办人"></el-table-column>

        </el-table>
        <common-pagination v-on:handler-currentPage="handlerPage" :list="pager"></common-pagination>
        </div>
</template>

<script>
export default {
    data(){
        return {
            loading:false,
            dlgVisiable2:false,
            isLoading:false,
            popData:[]
        }
    },
    props:{
        tableData:{
            type:Array,
            default: () => [],
        },
        pager:{
            type:Object,
            default: () => {},
        },

    },
    // watch:{
    //     tableData(val){
    //         this.tableData = val
    //         console.log('11111')
    //     }
    // },
    methods:{
        handleDetail(row){
            if(row.statue==='STA001' || row.statue==='STA002' || row.statue==='STA003'  || row.statue==='STA004'){
                this.$router.push({name: 'singleContract', query: {id: row.contractId, type: 'view'}})
            }else{
                this.$router.push({name: 'singleContract', query: {id: row.contractId, type: 'view',ispdf:'pdf'}})
            }
            
        },
        handlerPage(page){
            this.loading = true
            setTimeout(()=>{
               this.$emit('handlerPage', page,()=>{this.loading = false})
            },100)
        },
        exportData(){
            this.isLoading = true
            setTimeout(()=>{
               this.$emit('exportData',()=>{this.isLoading = false})
            },100)
        }
    }
}
</script>
