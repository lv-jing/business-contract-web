<template>
    <div>
        <div id="contractApprovalChart" class="echart2" :style="drawStyle" @click="showTableLevel"></div>
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
                  <template slot-scope="scope">
                      <el-link @click="getMoreInfo(apiData[scope.$index].dataList[index])">
                        {{apiData[scope.$index].dataList[index].indexData}}
                        {{apiData[scope.$index].dataList[index].indexCode.indexOf('INDEX_TIMELY_RATE')>=0 ? '%':''}}
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
            dataTitle:[],
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
        prop: "queryParams", //??????props????????????
        event: "change", //????????????
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
            default: () => '??????????????????',
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
            // ????????????????????????
            this.reportData = []
            this.legends = []
            this.yData = []
            this.dataTitle = []
            reportApi.queryByContractApproveCondition(this.queryParams).then(res=>{
                if(res.code === '000000'){
                    this.reportData = []
                    this.legends = []
                    this.yData = []
                    this.dataTitle = []
                    this.apiData = res.data
                    if(this.apiData && this.apiData.length>0){
                        this.apiData.forEach(element => {
                            // ?????????
                            this.dataTitle.push(element.indexName)
                            // this.reportData.push(element.indexData)
                            if(element.dataList && element.dataList.length > 0){
                                element.dataList.forEach(ele => {
                                    let index = this.legends.indexOf(ele.indexName)
                                    if(index<0){
                                        this.legends.push(ele.indexName)
                                        index = this.legends.indexOf(ele.indexName)
                                    }
                                    if(ele.indexCode.indexOf('INDEX_TIMELY_RATE')>=0){
                                      this.yData.push(ele.indexData)
                                      this.yTitle = ele.indexName
                                    }else{
                                      if(this.reportData[index]){
                                           this.reportData[index].push(ele.indexData)
                                      }else{
                                           this.reportData.push([ele.indexData])
                                      }
                                    }
                                    
                                })
                            }
                            
                        });
                    }
                    this.seriesData = []
                    let index = 0
                    this.legends.forEach(element=>{
                         if(this.yTitle !== element){
                            let obj = {}
                            obj.type = 'bar'
                            obj.name = this.legends[index],
                            obj.data = this.reportData[index]
                            this.seriesData.push(obj)
                         }
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
                        name: "?????????",
                        min: 0,
                        boundaryGap: [0.2, 0.2],
                    },
                    {
                        type: "value",
                        scale: true,
                        name: "?????????",
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
                this.$message({type:'error', message:'??????????????????'})
            })
        },
        resizeChart() {
            this.eCharts.resize();
        },
        drawLine(){
            // ??????????????????dom????????????echarts??????
            let myChart = this.$echarts.init(document.getElementById('contractApprovalChart'))
            this.eCharts = myChart
            let axisLabel = {}
            if(this.dataTitle.length > 3){
                axisLabel = {  
                        interval:0,  
                        rotate:60 ,//????????????
                        textStyle: {
                            align: 'right'
                        }
                    }
            }
            // ????????????
            myChart.setOption({
                title: { 
                    text: this.title,
                    x:'center',
                    y:'top',
                    textAlign:'left' 
                },
                tooltip: {},
                xAxis: {
                    data: this.dataTitle,
                    axisLabel: axisLabel,
                },
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        name: '?????????',
                        min: 0,
                        boundaryGap: [0.2, 0.2]
                    },
                    {
                        type: 'value',
                        scale: true,
                        name: '?????????',
                        max: 100,
                        min: 0,
                        boundaryGap: [0.2, 0.2]
                    }
                ],
                legend:{
                   bottom: 'bottom'
                },
                color:['#2e76ca','#5fcb9f', '#f5be51','#5dccd8'],
                series: this.seriesData
                
            });
            myChart.on('click', function (params) {
                console.log(params,"drawLine")
            });
        },
    }
        
}
</script>