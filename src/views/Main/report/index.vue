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
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
                title: { text: '柱状图' },
                tooltip: {},
                xAxis: {
                    data: ["总部","冷饮","酸奶","液奶","原奶","奶酪"]
                },
                yAxis: {},
                series: [{
                    name: '合同数',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20],
                    itemStyle: {
                        normal: {
            　　　　　　　　//这里是重点 动态颜色
                            color: function(params) {
                                //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                                var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622'];
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                }],
                // 默认颜色，
                color: ['blue','#2f4554', '#61a0a8'],
            });
            myChart.on('click', function (params) {
                console.log(params,"drawLine")
            });
        },
        drawPie(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart2'))
            // 绘制图表
            myChart.setOption({
                 title: { text: '饼图' },
                 tooltip: {},
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',    // 设置图表类型为饼图
                        radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                        data:[          // 数据数组，name 为数据项名称，value 为数据项值
                            {value:235, name:'视频广告'},
                            {value:274, name:'联盟广告'},
                            {value:310, name:'邮件营销'},
                            {value:335, name:'直接访问'},
                            {value:400, name:'搜索引擎'}
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
                title: { text: '组合图' },
                tooltip: {},
                xAxis: {
                    data: ["总部","冷饮","酸奶","液奶","原奶","奶酪"]
                },
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        name: '合同数',
                        min: 0,
                        boundaryGap: [0.2, 0.2]
                    },
                    {
                        type: 'value',
                        scale: true,
                        name: '百分比',
                        max: 100,
                        min: 0,
                        boundaryGap: [0.2, 0.2]
                    }
                ],
                series : [
                    {
                        name: '合同数',
                        type: 'bar',
                        data: [5, 20, 35, 10, 10, 20]
                    },{
                        name: '占比',
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