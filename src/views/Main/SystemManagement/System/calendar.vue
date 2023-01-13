<template>
    <div class="main">
        <div>
            <el-form>
                <el-form-item label="获取节假日">
                    <el-date-picker v-model="year" type="year" placeholder="选择年" value-format="yyyy" @change="getHoliday"></el-date-picker>
                    <el-button type="primary" @click="importHoliday">导入</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="bg-white mb24 pd24">
            <el-calendar v-model="value" :first-day-of-week="7">
                <template
                    slot="dateCell"
                    slot-scope="{date, data}">
                    <div v-if="isHoliday(date,data)=='WEEKEND'" :class="'is-selected day'">
                        <p>
                            {{data.day.split('-')[2]}}
                        </p>
                        <div class="btn" v-if="data.type=='current-month'"><el-button @click="cancelHoliday(data.day,'WEEKEND')">设为工作日</el-button></div>
                        <div v-if="isCountryHoliday(data.day,date)>=0" class="holiday">
                            {{holidayInfo[isCountryHoliday(data.day,date)].holidayName}}
                        </div>
                    </div>
                    <div v-else-if="isHoliday(date,data)=='HOLIDAY'" :class="'is-selected day'" :title="holidayInfo[isCountryHoliday(data.day,date)].holidayDesc">
                        <p>
                            {{data.day.split('-')[2]}}
                        </p>
                        <div class="btn" v-if="data.type=='current-month'"><el-button @click="cancelHoliday(data.day,'HOLIDAY')">设为工作日</el-button></div>
                        <div v-if="isCountryHoliday(data.day,date)>=0" class="holiday">
                            {{holidayInfo[isCountryHoliday(data.day,date)].holidayName}}
                        </div>
                    </div>
                    <div v-else :class="'day'">
                        <p>
                            {{data.day.split('-')[2]}}
                        </p>
                        <div class="btn" v-if="data.type=='current-month'"><el-button @click="operDlg(data.day)">设为节假日</el-button></div>
                    </div>
                </template>
            </el-calendar>
        </div>

        <el-dialog title="导入日历节假日信息" style="overflow-y: hidden;"
            :visible.sync="visible"
            width="45%">
             <div style="text-align:center">
                <el-input type="textarea" :rows="10" v-model="jsonData" placeholder="请填入从弹窗中获取到的数据"></el-input>
             </div>
            <div style="text-align:center">
                <el-button type="primary" @click="initHolday(year)">保存</el-button>
                <el-button  @click="visible=false">关闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="节假日设置" style="overflow-y: hidden;"
            :visible.sync="dlgvisible"
            width="45%">
             <el-form label-width="120px">
                 <el-row>
                     <el-col>
                        <el-form-item label="日期">
                            {{selectNode.holidayDate}}
                        </el-form-item>
                     </el-col>
                      <el-col>
                        <el-form-item label="节假日说明">
                           <el-input v-model="selectNode.holidayName"></el-input>
                        </el-form-item>
                     </el-col>
                      <el-col>
                        <el-form-item label="节假日描述">
                            <el-input v-model="selectNode.holidayDesc"></el-input>
                        </el-form-item>
                     </el-col>
                 </el-row>
             </el-form>
            <div style="text-align:center">
                <el-button type="primary" @click="setHoliday(year)">保存</el-button>
                <el-button  @click="dlgvisible=false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
                
</template>
<script>

import service from "@/utils/request";
import { mapGetters } from "vuex";
export default {
    data () {
        return {
            LOGIN_URL: process.env.VUE_APP_BASE_LOGIN_URL,
             value: new Date(),
             visible:false,
             dlgvisible:false,
             holidayList:[],
             holidayInfo:[{holidayName:'',holidayDate:''}],
             weekendWorkList:[],
             year:'2020',
             jsonData:'',
            selectNode:{}
        }
    },
    computed: {
      
    },
    methods : {
        importHoliday(){
            this.visible = true
            window.open("https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query="+this.year+"&resource_id=6018")
        },
        isCountryHoliday(day){
            return this.holidayList.indexOf(day)
        },
        getHoliday(){
            service.post('/isump/holiday-info/list/conditions',{holidayYear: this.year},{baseURL: this.LOGIN_URL}).then(res=>{
                if(res.code === '000000'){
                    let arr = res.data
                    this.holidayInfo = []
                    this.weekendWorkList = []
                    this.holidayList = []
                    if(arr.length>0){
                        arr.forEach(item => {
                            this.holidayInfo.push(item)
                            if(item.holidayType === 'HOLIDAY'){
                                this.holidayList.push(item.holidayDate)
                            }else{
                                this.holidayList.push("")
                                this.weekendWorkList.push(item.holidayDate)
                            }
                        })

                    }
                }
            }).catch(err=>{
                this.$message({
                        type: 'error',
                        message: '查询节假日失败!'
                    });
            })
        },
        saveHoliday(){
            service.post('/isump/holiday-info/saveList',JSON.stringify(this.holidayInfo),{baseURL: this.LOGIN_URL}).then(res=>{
                if(res.code === '000000'){
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.visible = false
                }
            }).catch(err=>{
                this.$message({
                        type: 'error',
                        message: '保存节假日失败!'
                    });
            })
        },
        operDlg(day){
            this.selectNode = {}
            this.selectNode.holidayDate = day
            this.dlgvisible = true
        },
        setHoliday(){
            let day = this.selectNode.holidayDate
            let holidayObject = {
                                ...this.selectNode,
                                holidayYear:day.split("-")[0],
                                holidayType:"HOLIDAY",
                            }
            service.post('/isump/holiday-info',holidayObject,{baseURL: this.LOGIN_URL}).then(res=>{
                if(res.code === '000000'){
                    this.holidayList.push(day)
                    this.holidayInfo.push(holidayObject)
                     this.dlgvisible = false
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                }
            }).catch(err=>{
                this.$message({
                        type: 'error',
                        message: '保存节假日失败!'
                    });
            })
        },
        cancelHoliday(day,type){
            service.delete('/isump/holiday-info/'+day,{baseURL: this.LOGIN_URL}).then(res=>{
                if(res.code === '000000'){
                    if(type==='WEEKEND'){
                        this.weekendWorkList.splice(this.weekendWorkList.indexOf(day),1)
                    }else{
                        let index = this.holidayList.indexOf(day)
                        this.holidayList.splice(index,1)
                        this.holidayInfo.splice(index,1)
                    }
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                }
            }).catch(err=>{
                this.$message({
                        type: 'error',
                        message: '取消失败!'
                    });
            })
            
        },
        isHoliday(date,data){
            let weekDay = date.getDay()
             if(data.type === 'current-month'){
                 if(weekDay===0||weekDay===6){
                     if(this.weekendWorkList.indexOf(data.day)>=0){
                        return "WORK"
                     }else{
                         return "WEEKEND"
                     }
                 }else{
                     if(this.isCountryHoliday(data.day)>=0){
                        return "HOLIDAY"
                     }
                     return  "WORK"
                 }
             }else{
                return  "WORK"
            }
        },
        initHolday(year){
            let holiday = JSON.parse(this.jsonData).data[0].holiday
            if(holiday && holiday.length>0){
                this.holidayList = []
                this.holidayInfo = []
                holiday.forEach(element => {
                    let arr = element.list
                    arr.forEach(item=>{
                        let date = new Date(item.date)
                        let dayStr = date.Format('yyyy-MM-dd')
                        if(this.holidayList.indexOf(dayStr)<0){
                            let holidayObject = {
                                holidayDate:dayStr,
                                holidayYear:dayStr.split("-")[0],
                                holidayType:"HOLIDAY",
                                holidayName:"",
                                holidayDesc:element.desc,
                            }
                            if(item.status==='1'){
                                if(item.date === element.festival){
                                   holidayObject.holidayName = element.name
                                }
                                holidayObject.holidayType = "HOLIDAY"
                                this.holidayList.push(dayStr)
                            }else{
                                this.holidayList.push("")
                                if(this.weekendWorkList.indexOf(dayStr)<0){
                                    this.weekendWorkList.push(dayStr)
                                }
                                holidayObject.holidayType = "WEEKEND_WORK"
                            }
                            this.holidayInfo.push(holidayObject)
                        }else{
                            let temp = this.holidayInfo[this.holidayList.indexOf(dayStr)]
                            if(item.status==='1'){
                                temp.holidayType = "HOLIDAY"
                                if(item.date === element.festival){
                                    if(temp.holidayName.indexOf(element.name)<0){
                                        temp.holidayName += " " + element.name
                                    }
                                }else{
                                   temp.holidayName = ""
                                }
                                this.holidayList[this.holidayList.indexOf(dayStr)] = dayStr
                            }else{
                                temp.holidayType = "WEEKEND_WORK"
                                this.holidayList[this.holidayList.indexOf(dayStr)] = ""
                            }
                            this.holidayInfo[this.holidayList.indexOf(dayStr)] = temp
                        }
                    })
                });
            }
            this.saveHoliday()
        }
    },
    mounted () {
        this.getHoliday()
        let that = this
        this.$nextTick(() => {
                // 点击前一个月
                let prevBtn = document.querySelector(
                    '.el-calendar__button-group .el-button-group>button:nth-child(1)');
                prevBtn.addEventListener('click', () => {
                    let currentYear =  new Date(this.value).Format("yyyy-MM-dd").split("-")[0]
                    if(that.year !== currentYear){
                        that.year = currentYear
                        this.getHoliday()
                    }
                })
            })


            this.$nextTick(() => {
                // 点击后一个月
                let prevBtn = document.querySelector(
                    '.el-calendar__button-group .el-button-group>button:last-child');
                prevBtn.addEventListener('click', () => {
                    let currentYear =  new Date(this.value).Format("yyyy-MM-dd").split("-")[0]
                    if(that.year !== currentYear){
                        that.year = currentYear
                        this.getHoliday()
                    }
                })
            })
    }
}
</script>
<style>
 .day{
     position: relative;
    height: 100%;
 }
  .is-selected {
    background-color: #f3f3f3;
    
  }
  .holiday{
      margin-top: 20px;
      margin-left: 10px;
      font-size: 12px;
  }
  .btn{
      position: absolute;
      top: 3px;
      right: 5px;
  }
</style>