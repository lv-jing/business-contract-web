<template>
    <treeselect
      :clearable="clearable"
      :multiple="multiple"
      :disabled="disabled"
      :options="conditList"
      v-model="optionVal"
      :disable-branch-nodes="true"
      valueFormat="id"
      @select="select"
      @deselect="deselect"
      :default-expand-level="2"
      :normalizer="normalizer"
      placeholder="请选择"
      appendToBody
      :noOptionsText="noOptionsText"
      noResultsText="暂无数据"
    />
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import {getContractType} from "@/service/approval";

export default {
  components: {
    Treeselect
  },
  data() {
    return {
      conditList: [],
      noOptionsText: '暂无数据',
      optionVal : this.value?this.value:null,
    }
  },
  props: {
    treeSelect: {
      type: Function,
      default: (val) => {
        return val
      }
    },
    treeDelSelect: {
      type: Function,
      default: (val) => {
        return val
      }
    },
    contractTypeCode: {
      type: String,
      default: () => ''
    },
    dictCode: {
      type: String,
      default: () => ''
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    clearable: {
      type: Boolean,
      default: () => false
    },
    multiple: {
      type: Boolean,
      default: () => false
    },
    value: {type: [Array,String],default:()=>null}, // 不多选的时候type为String
  },
  watch: {
    value(n) {
      this.optionVal = n;
    },
    dictCode(val) {
      if(val==='INCOME_EXPE_TYPE'){
        this.getContractType({
          dictCode: val,
          attribute1: 4
        })
      } else {
        this.getContractType({
          dictCode: val,
          attribute1: 3
        })
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      if(this.dictCode){
        if(this.dictCode==='INCOME_EXPE_TYPE'){
          this.getContractType({
            dictCode: this.dictCode,
            attribute1: 4
          })
        } else {
          this.getContractType({
            dictCode: this.dictCode,
            attribute1: 3
          })
        }
      }
    })
  },
  methods: {
    select(val){
      this.treeSelect(val)
    },
    deselect(val){
      this.treeDelSelect(val)
    },
    normalizer(node) {
      if (!node.dictVoList) {
        delete node.dictVoList;
      }
      return {
        id: node.dictCode,
        label: node.dictName,
        children: node.dictVoList,
      }
    },
    /**
     *  合同类型
     */
    async getContractType(params) {
      this.noOptionsText = '数据加载中'
      const {code, data} = await getContractType(params)
      if (code === '000000') {
        this.conditList = data
        this.noOptionsText = ' '
      } else {
        this.noOptionsText = '暂无数据'
      }
    },
  }
}
</script>

<style >
.vue-treeselect__icon-container{
  display: none;
}
.vue-treeselect__tip-text{
  text-align: center;
}
</style>
