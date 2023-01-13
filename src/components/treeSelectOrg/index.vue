<template>
  <treeselect
    :searchable="false"
    :multiple="multiple"
    :disabled="disabled"
    :options="conditList"
    :value="optionVal"
    :disable-branch-nodes="!selectAllLevel"
    :load-options="loadOptions"
    valueFormat="id"
    @select="select"
    @deselect="deselect"
    v-model="optionVal"
    :normalizer="normalizer"
    placeholder="请选择审批部门"
  />
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import {getOrgTreeList,getOrgTreeFilterData} from "@/service/4A";

export default {
  components: {
    Treeselect
  },
  data() {
    return {
      conditList: [{
        id: 26,
        orgCode: '00000001',
        orgName: '伊利集团',
        orgType: 'org',
        orgState: "0",
        isn: "1",
        children: null
      }],
      optionVal: this.value ? this.value : null,
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
    multiple: {
      type: Boolean,
      default: () => false
    },
    selectAllLevel:{
      type: Boolean,
      default: () => false
    },
    dataFilter:{
      type: Boolean,
      default: () => false
    },
    value: {type: [Array, String], default: () => [] || null}, // 不多选的时候type为String
  },
  watch: {
    value(n) {
      this.optionVal = n;
    },
    optionVal(val){
      if(!val || val.length===0){
        this.deselect(null)
      }
    }
  },
  mounted() {
  },
  methods: {
    select(val) {
      this.treeSelect(val)
    },
    deselect(val) {
      this.treeDelSelect(val)
    },
    normalizer(node) {
      if (node.isn==='0') {
        delete node.children;
      }
      return {
        id: node.orgCode,
        label: node.orgName,
      }
    },
    loadOptions({action, parentNode, callback}) {
      console.log(action, parentNode);
      if (action === 'LOAD_CHILDREN_OPTIONS') {
        if(this.dataFilter && parentNode.orgCode !== '00000001'){
          return
        }
        this.getOrgTreeList(parentNode, data => {
          // var arr = [];
          // data.forEach(item => {
          //   let objData = {};
          //   objData.id = item.orgCode;
          //   objData.label = item.orgName;
          //   objData.children = null;
          //   if (item.isn === '0') {
          //     delete objData.children; //有无子节点判断，树节点前面是否有箭头问题
          //   }
          //   arr.push(objData);
          // })
          parentNode.children = data;
          callback()
        },this.dataFilter)
      }
    },
    /**
     *  部门
     */
    async getOrgTreeList(ele, callback,dataFilter) {
      if(dataFilter){
        const {code, data} = await getOrgTreeFilterData(ele.orgCode,dataFilter)
      callback(data)
      }else{
        const {code, data} = await getOrgTreeList(ele.orgCode,dataFilter)
        callback(data)
      }
      
    },
  }
}
</script>

<style scoped>

</style>
