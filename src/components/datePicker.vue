<template>
  <div>
    <el-date-picker
      style="width:46%;float:left;"
      v-model="startTime"
      type="date"
      @change="chooseDate"
      placeholder="开始日期"
      :picker-options="pickerOptions"
    ></el-date-picker>
    <div style="float:left;width:7.5%;text-align:center;">至</div>
    <el-date-picker
      style="width:46%;float:right;"
      v-model="endTime"
      type="date"
      @change="chooseDate"
      placeholder="结束日期"
      :picker-options="pickerOptions1"
    ></el-date-picker>
  </div>
</template>
<script>
export default {
  model: {
    prop: "modelVal", //指向props的参数名
    event: "change", //事件名称
  },
  props: {
    modelVal: "",
    pickerOptions:{
      type:Object,
      default:()=>{}
    },
  },
  watch: {
    timeData(val) {
      this.$emit("change", val);
    },
  },
  data() {
    return {
      startTime: "",
      endTime: "",
      timeData: {},
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() < this.startTime;
        },
      },
    };
  },
  methods: {
    chooseDate(params) {
      if (this.startTime && this.endTime) {
        if (this.endTime.getTime() < this.startTime.getTime()) {
          this.endTime = "";
        }
      }
      this.timeData = {
        startTime: this.startTime
          ? this.startTime.Format("yyyy-MM-dd hh:mm:ss")
          : "",
        endTime: this.endTime
          ? this.endTime.Format("yyyy-MM-dd") + " 23:59:59"
          : "",
      };
    },
    chooseDate1(params) {
      if (this.startTime && this.endTime) {
        if (this.endTime.getTime() < this.startTime.getTime()) {
          this.endTime = "";
        }
      }
      this.timeData = {
        startTime: this.startTime
          ? this.startTime.Format("yyyy-MM-dd hh:mm:ss")
          : "",
        endTime: this.endTime
          ? this.endTime.Format("yyyy-MM-dd") + " 23:59:59"
          : "",
      };
    },
    reset(){
      this.startTime = ''
      this.endTime = ''
    }
  },
};
</script>
<style lang="less" scoped>
</style>
