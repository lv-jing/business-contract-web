<template>
    <div>
        <el-row>
            <el-col :span="12">
                <contractStatusReport></contractStatusReport>
            </el-col>
            <el-col :span="12">
                <contractTypeReport></contractTypeReport>
            </el-col>
            <el-col :span="12">
                <contractMoneyReport></contractMoneyReport>
            </el-col>
            <el-col :span="12">
                <contractTemplateReport></contractTemplateReport>
            </el-col>
            <el-col :span="12">
                <contractSignReport></contractSignReport>
            </el-col>
             <el-col :span="12">
                <approvalDayReport></approvalDayReport>
            </el-col>
            <el-col :span="24">
                <approvalReport></approvalReport>
            </el-col>
            <el-col :span="12">
                <contractPrintReport></contractPrintReport>
            </el-col>
            <el-col :span="12">
                <contractSealReport></contractSealReport>
            </el-col>
        </el-row>
        
       
    </div>
</template>

<script>
import contractStatusReport from './contractStatusReport'
import contractTypeReport from './contractTypeReport'
import contractMoneyReport from './contractMoneyReport'
import contractTemplateReport from './contractTemplateReport'
import contractSignReport  from './contractSignReport'
import approvalReport from './approvalReport'
import approvalDayReport from './approvalReport/contractApprovalDay'
import contractPrintReport from './contractPrintReport'
import contractSealReport from './contractSealReport'
export default {
    data(){
        return {

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
        this.drawLine();
        this.drawPie();
        this.drawComb()
    },
    methods:{
        drawLine(){
            // ??????????????????dom????????????echarts??????
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // ????????????
            myChart.setOption({
                title: { text: '?????????' },
                tooltip: {},
                xAxis: {
                    data: ["??????","??????","??????","??????","??????","??????"]
                },
                yAxis: {},
                series: [{
                    name: '?????????',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20],
                    itemStyle: {
                        normal: {
            ????????????????????????//??????????????? ????????????
                            color: function(params) {
                                //????????????????????????????????????????????????????????????????????????????????????????????????
                                var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622'];
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                }],
                // ???????????????
                color: ['blue','#2f4554', '#61a0a8'],
            });
            myChart.on('click', function (params) {
                console.log(params,"drawLine")
            });
        },
        drawPie(){
            // ??????????????????dom????????????echarts??????
            let myChart = this.$echarts.init(document.getElementById('myChart2'))
            // ????????????
            myChart.setOption({
                 title: { text: '??????' },
                 tooltip: {},
                series : [
                    {
                        name: '????????????',
                        type: 'pie',    // ???????????????????????????
                        radius: '55%',  // ????????????????????????????????????????????????????????????????????????????????? 55% ?????????
                        data:[          // ???????????????name ?????????????????????value ???????????????
                            {value:235, name:'????????????'},
                            {value:274, name:'????????????'},
                            {value:310, name:'????????????'},
                            {value:335, name:'????????????'},
                            {value:400, name:'????????????'}
                        ]
                    }
                ]
            });
            myChart.on('click', function (params) {
                console.log(params,"drawPie")
            });
        },
        drawComb(){
            let myChart = this.$echarts.init(document.getElementById('myChart3'))
            myChart.setOption({
                title: { text: '?????????' },
                tooltip: {},
                xAxis: {
                    data: ["??????","??????","??????","??????","??????","??????"]
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
                series : [
                    {
                        name: '?????????',
                        type: 'bar',
                        data: [5, 20, 35, 10, 10, 20]
                    },{
                        name: '??????',
                        type: 'line',
                        yAxisIndex: 1,
                        data: [5, 20, 35, 10, 10, 20]
                    }
                ]
            });
            myChart.on('click', function (params) {
                console.log(params,"drawComb")
            });
        }
    }
}
</script>

<style lang="less">
    .echart {
        height:400px;
        width:100%;
    }
    .color {
        color:#2e76ca;
        // color:#419cd5;
        // color:#5dccd8;
        // color:#5fcb9f;
        // color:#f5be51;
    }
</style>