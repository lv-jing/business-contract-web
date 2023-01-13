<template>
    <div>
        <div id="contractMoneyChart" class="echart2" :style="drawStyle" @click="showTableLevel"></div>
        <el-dialog :title="title" :visible.sync="dlgVisiable" width="60%">
            <el-table :data="legends"
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
              <el-table-column v-for="(item,index) in dataTitle" :key="index" :label="item">
                  <template slot-scope="scope">
                      <el-link @click="getMoreInfo(apiData[index],scope.$index)">{{reportData[scope.$index][index]}}</el-link>
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
            clickFlag: ''
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
            default: () => '按合同金额统计',
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
            if(this.searchForm.indexEnum.indexOf('INDEX_ALREADY_COUNT')>=0){
              reportApi.exportContract(this.searchForm,this.userInfo.userId,callback)
            }else{
              reportApi.exportSnapContract(this.searchForm,this.userInfo.userId,callback)
            }
        },
       showTableLevel(){
            setTimeout(()=>{
                if(this.clickFlag==='drawLine'){
                    this.clickFlag = ''
                    return
                }
                this.dlgVisiable = true
            },300)
            
        },
        handlerPage(page,callback){
            let params = {...this.searchForm,...this.pager}
            params.pageSize = page ? page.pageSize : params.pageSize
            params.currentPage = page ? page.currentPage : 1
            this.loading = true
             if(this.searchForm.indexEnum.indexOf('INDEX_ALREADY_COUNT')>=0){
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
            this.dataTitle = []
            this.reportData = []
            this.legends = []
            reportApi.queryByContractMoneyPortrait(this.queryParams).then(res=>{
                if(res.code === '000000'){
                    this.dataTitle = []
                    this.reportData = []
                    this.legends = []
                    this.apiData = res.data
                    if(this.apiData && this.apiData.length>0){
                        
                        this.apiData.forEach(element => {
                            // 横坐标
                            this.dataTitle.push(element.indexName)
                            // this.reportData.push(element.indexData)
                            if(element.dataList && element.dataList.length > 0){
                                element.dataList.forEach(ele => {
                                    // indexCode: "INDEX_WAIT_COUNT"
                                    // indexData: "25"
                                    // indexName: "待审核合同"
                                    let index = this.legends.indexOf(ele.indexName)
                                    if(index<0){
                                        this.legends.push(ele.indexName)
                                        index = this.legends.indexOf(ele.indexName)
                                    }
                                   if(this.reportData[index]){
                                        this.reportData[index].push(ele.indexData)
                                   }else{
                                        this.reportData.push([ele.indexData])
                                   }
                                    
                                })
                            }
                        });
                    }
                    this.seriesData = []
                    let index = 0
                    this.legends.forEach(element=>{
                        let obj = {}
                        obj.type = 'bar'
                        obj.name = this.legends[index],
                        obj.data = this.reportData[index]
                        this.seriesData.push(obj)
                        index++
                    })
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
            let myChart = this.$echarts.init(document.getElementById('contractMoneyChart'))
            this.eCharts = myChart
            // 绘制图表
            myChart.setOption({
                title: { text: this.title,
                    x:'center',
                    y:'top',
                    textAlign:'left'  },
                tooltip: {},
                xAxis: {
                    data: this.dataTitle,
                    axisLabel: {  
                        interval:0,  
                        rotate:0 ,//倾斜角度
                        textStyle: {
                            align: 'center'
                        }
                    },
                },
                yAxis: {},
                legend:{
                   bottom: 'bottom'
                },
                color:['#5dccd8', '#f5be51',],
                series: this.seriesData
            });
            myChart.on('click', (params) => {
                this.clickFlag = 'drawLine'
                // console.log(params,"drawLine")
                // console.log(params.dataIndex,params.seriesIndex,'23')
                this.getMoreInfo(this.apiData[params.dataIndex],params.seriesIndex)
            });
        },
    }
        
}
</script>