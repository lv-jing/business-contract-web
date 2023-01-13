<template>
    <div>
        <div id="contractTemplateChart" class="echart2" :style="drawStyle"  @click="showTableLevel"></div>
        <el-dialog :title="title" :visible.sync="dlgVisiable" width="60%">
            <el-table :data="['1']"
                style="width: 99%"
                :highlight-current-row="true"
                ref="multipleTable"
                tooltip-effect="dark"
            >
              <el-table-column v-for="(item,index) in dataTitle" :key="index" :label="item">
                  <template>
                      <el-link @click="getMoreInfo(apiData[index])">{{reportData[index].value}}%</el-link>
                  </template>
              </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog :title="title2" :visible.sync="dlgVisiable2" width="75%">
            <contractList :tableData="tableData" :pager="pager" @handlerPage="handlerPage" @exportData="exportData"></contractList>
        </el-dialog>
    </div>
</template>

<script>
import reportApi from "@/service/report/index";
import {mapState} from "vuex";
import contractList from "../components/contractList"
export default {
    components:{
        contractList:contractList
    },
    data(){
        return {
           // tableData:[{value:'20.28', name:'标准范本'},{value:'18.15', name:'基标准范本'},{value:'34.47', name:'不使用范本'}],
            loading:false,
            tableData:[],
            reportData:[],
            dataTitle:[],
            drawStyle:{},
            apiData:[],
            legends:["合同数"],
            dlgVisiable:false,
            dlgVisiable2:false,
            title2:'',
            searchForm:{
               
            },
            pager:{
                 pageSize:10,
                currentPage:1,
                total:0
            },
            isLoading:false,
            eCharts: null
        }
    },
    model: {
        prop: "queryParams", //指向props的参数名
        event: "change", //事件名称
    },
    props:{
        width:{
            type: String,
            default: () => '100%',
        },
        height:{
            type: String,
            default: () => '400px',
        },
        queryParams:{
            type: Object,
            default: () => {},
        },title:{
            type: String,
            default: () => '范本使用情况统计',
        },
    },
    watch:{
        queryParams(val){
            this.drawEcharts();
        }
    },
    computed: {
        ...mapState({
        userInfo: state => state.common.userInfo
        })
    },
    created(){
        window.addEventListener('resize', this.resizeChart, true)
    },
    destroyed() {
        window.removeEventListener('resize', this.resizeChart, true)
    },
    mounted(){
        this.drawStyle = {width:this.width,height:this.height}
        this.drawEcharts();
        
    },
    methods:{
        exportData(callback){
            this.isLoading = true
            if(this.searchForm.indexEnum==='INDEX_APPROVED_COUNT'){
              reportApi.exportContract(this.searchForm,this.userInfo.userId,callback)
            }else{
              reportApi.exportSnapContract(this.searchForm,this.userInfo.userId,callback)
            }
        },
        showTableLevel(){
            this.dlgVisiable = true
        },
        handlerPage(page,callback){
           let params = {...this.searchForm,...this.pager}
            params.pageSize = page ? page.pageSize : params.pageSize
            params.currentPage = page ? page.currentPage : 1
            this.loading = true
             if(this.searchForm.indexEnum==='INDEX_APPROVED_COUNT'){
                reportApi.queryContract(params).then(res=>{
                    if(res.code === '000000'){
                        this.tableData = res.data.records
                        this.pager = {
                            ...this.pager,
                             total : res.data.total,
                            currentPage : res.data.current,
                            pageSize : res.data.size
                        }
                    }
                    callback && callback()
                }).catch(err=>{
                     callback && callback()
                })
            }else{
                reportApi.querySnapContract(params).then(res=>{
                    if(res.code === '000000'){
                        this.tableData = res.data.records
                        this.pager = {
                            ...this.pager,
                             total : res.data.total,
                            currentPage : res.data.current,
                            pageSize : res.data.size
                        }
                    }
                    callback && callback()
                }).catch(err=>{
                    callback && callback()
                })
            }
        },
        getMoreInfo(item){
            console.log(this.apiData)
            this.searchForm = {...this.queryParams,}
            this.searchForm.indexEnum = item.indexCode
            this.pager.pageSize = 10
            this.pager.currentPage = 1
            this.handlerPage()
            this.dlgVisiable2 = true
            this.title2 = this.title + " - " +item.indexName
        },
        
        drawEcharts(){
            this.queryData()
        },
        queryData(callback){
            // 查询数据后，调用
            this.dataTitle = []
            this.reportData = []
            this.legends = []
            reportApi.queryByContractSampleUsagePortrait(this.queryParams).then(res=>{
                if(res.code === '000000'){
                    this.dataTitle = []
                    this.reportData = []
                    this.legends = []
                    this.apiData = res.data
                    if(this.apiData && this.apiData.length>0){
                        this.apiData.forEach(element => {
                            // 横坐标
                            if(element.indexCode.indexOf('RATE') >= 0){
                                this.dataTitle.push(element.indexName)
                                this.legends.push(element.indexName)
                                this.reportData.push({value:element.indexData,name:element.indexName})
                            }
                        });
                    }
                }
                this.$nextTick(()=>{
                    this.drawLine()
                })
            }).catch(err=>{
                this.$message({type:'error', message:'查询合同状态数据出错'})
            })
        },
        resizeChart() {
            this.eCharts.resize();
        },
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('contractTemplateChart'))
            this.eCharts = myChart
            // 绘制图表
            myChart.setOption({
                title: { text: this.title,
                    x:'center',
                    y:'top',
                    textAlign:'left'  },
                legend:{
                   bottom: 'bottom'
                },
                tooltip: {
                    formatter: function (params, ticket, callback) {
                        // console.log(params,ticket);
                        var showHtm=params.data.name + '：' + params.data.value + '%';
                        return showHtm;
                    }
                },
                series: [{
                    type: 'pie',
                    data: this.reportData,
                    radius: '55%',
                    itemStyle: {
                        normal: {
            　　　　　　　　//这里是重点 动态颜色
                            color: function(params) {
                                //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                                var colorList = ['#5dccd8','#2e76ca', '#5fcb9f', '#d48265', '#91c7ae','#749f83', '#ca8622'];
                                return colorList[params.dataIndex]
                            },
                            label:{ 
                                show: true, 
                                formatter: '{d}%' 
                            }, 
                            labelLine :{show:true} 
                        }
                    }
                }]
                
            });
            myChart.on('click', function (params) {
                console.log(params,"drawLine")
            });
        },
    }
        
}
</script>