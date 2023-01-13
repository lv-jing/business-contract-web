<template>
  <div>
    <span>{{dictCodeName}}</span>
  </div>
</template>
<script>
import { queryAllDict } from "@/service/4A/index";
export default {
   watch: {
    dictCode(val) {
      this.init()
    },
  },
  props: {
    parentCode: {
      type: String,
      default: () => "DEFAULT",
    },
    dictCode: {
      type: String,
      default: () => "",
    },
  },
  created() {},
  mounted() {
    if(this.dictCode){
      this.init()
    }
  },
  data() {
    return {
      resultData: [],
      dictCodeName: "",
    };
  },
  methods: {
    init(){
      let data = this.$store.state.common.dictMap[this.parentCode];
      if (data) {
        this.resultData = data;
      }
      this.getDictName();
    },
    async getDictName() {
      if(!this.dictCode){
        this.dictCodeName = ""
        return
      }
      if ((typeof this.resultData) === 'undefined' || this.resultData.length === 0) {
        let params = {
          dictCode: this.parentCode,
        };
        const { code, data } = await queryAllDict(params);
        if (code === "000000") {
          let saveData = {};
          saveData.type = this.parentCode;
          saveData.data = data;

          data.forEach((ele) => {
            if (ele.dictCode === this.dictCode) {
              this.dictCodeName = ele.dictName;
            }
          });
          this.$store.dispatch("setdictMap", saveData);
        }
      } else {
        this.resultData.forEach((ele) => {
          if (ele.dictCode === this.dictCode) {
            this.dictCodeName = ele.dictName;
          }
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
</style>
