<template>
    <div>
        <div id="contractSealChart" class="echart2" :style="drawStyle" @click="showTableLevel"></div>
        <el-dialog :title="title" :visible.sync="dlgVisiable" width="60%">
            <el-table :data="dataTitle"
                style="width: 99%"
                :highlight-current-row="true"
                ref="multipleTable"
                tooltip-effect="dark"
            > 
              <el-table-column>
                  <template slot-scope="scope">
                      {{scope.row}}
                  </template>
              </el-table-column>
              <el-table-column v-for="(item,index) in legends" :key="index" :label="item">
                  <template>
                      <el-link @click="getMoreInfo(apiData[index])">
                        {{apiData[index].indexData}}
                        {{apiData[index].indexCode === 'INDE_ONLINE_RATE1' ? '%':''}}
                      </el-link>
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
            loading:false,
            tableData:[],
            reportData:[],
            dataTitle:[""],
            drawStyle:{},
            apiData:[],
            legends:[],
            seriesData:[],
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
            eCharts: null,
            yAxis: [],
            yData: [],
            yTitle: '',
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
            default: () => '盖章情况统计',
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
            reportApi.exportContract(this.searchForm,this.userInfo.userId,callback)
        },
        showTableLevel(){
            this.dlgVisiable = true
        },
        handlerPage(page,callback){
            let params = {...this.searchForm,...this.pager}
            params.pageSize = page ? page.pageSize : params.pageSize
            params.currentPage = page ? page.currentPage : 1
            this.loading = true
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
        },
        getMoreInfo(item,index){
            this.searchForm = {...this.queryParams,}
            if(item.dataList && item.dataList.length > 0) {
                this.searchForm.indexEnum = item.dataList[index].indexCode
            }else{
                this.searchForm.indexEnum = item.indexCode
            }
            this.pager.pageSize = 10
            this.pager.currentPage = 1
            this.handlerPage()
            this.dlgVisiable2 = true
            this.title2 = this.title + " - " +item.indexName
        },
        
        drawEcharts(){
            this.queryData()
        },
        queryData(){
            // 查询数据后，调用
            this.reportData = []
            this.legends = []
            this.yData = []
            reportApi.queryByContractPrintStamp(this.queryParams).then(res=>{
                if(res.code === '000000'){
                    this.reportData = []
                    this.legends = []
                    this.yData = []
                    this.apiData = res.data
                    if(this.apiData && this.apiData.length>0){
                        this.apiData.forEach(element => {
                            if(element.indexCode.indexOf('INDE_ONLINE_RATE1')>=0){
                                this.yData.push(element.indexData)
                                this.yTitle = element.indexName
                            }else{
                                // 横坐标
                                this.legends.push(element.indexName)
                                // this.dataTitle.push(element.indexName)
                                this.reportData.push(element.indexData)
                            }
                        });
                    }
                    this.seriesData = []
                    let index = 0
                    this.legends.forEach(element=>{
                        let obj = {}
                        obj.type = 'bar'
                        obj.name = this.legends[index],
                        obj.data = [this.reportData[index]]
                        this.seriesData.push(obj)
                        index++
                    })
                this.seriesData.push({
                    name: this.yTitle,
                    type: "line",
                    yAxisIndex: 1,
                    data: this.yData,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: "{c}%",
                            },
                            labelLine: { show: true },
                        },
                    },
                });
                this.yAxis = [
                    {
                        type: "value",
                        scale: true,
                        name: "合同数",
                        min: 0,
                        boundaryGap: [0.2, 0.2],
                    },
                    {
                        type: "value",
                        scale: true,
                        name: "百分比",
                        max: 100,
                        min: 0,
                        boundaryGap: [0.2, 0.2],
                    },
                ];
               } 
                this.$nextTick(()=>{
                    this.drawLine()
                })
            }).catch(err=>{
                this.$message({type:'error', message:'查询数据出错'})
            })
        },
        resizeChart() {
            this.eCharts.resize();
        },
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('contractSealChart'))
            this.eCharts = myChart
            // 绘制图表
            myChart.setOption({
                title: { text: this.title,
                    x:'center',
                    y:'top',
                    textAlign:'left'  },
                tooltip: {},
                xAxis: {
                    data: this.dataTitle
                },
                yAxis:this.yAxis,
                legend:{
                   bottom: 'bottom'
                },
                color:['#2e76ca','#5dccd8', '#f5be51','#5fcb9f'],
                series: this.seriesData
                
            });
            myChart.on('click', function (params) {
                console.log(params,"drawLine")
            });
        },
    }
        
}
</script>