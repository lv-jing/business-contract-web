<template>
    <div v-loading="loadding" class="orgTree">
        <div class="button" v-show="showBtn">
            <el-button type="primary" @click="getCheckedKeys">确定</el-button>
        </div>
        <el-tree
            ref="tree"
            :data="treeData"
            highlight-current
            node-key="orgCode"
            :props="defaultProps"
            :show-checkbox="mutl"
            :default-expanded-keys="['00000001']"
            @node-click="handleNodeClick"
            :expand-on-click-node="false"
        ></el-tree>
    </div>
</template>

<script>
/* eslint-disable */

import {mapGetters} from "vuex";
import {getOrgTree,getPersonList} from '@/service/4A/index'
export default {
  data() {
    return {
      treeData: [{
                    id: 26,
                    orgCode: '00000001',
                    orgName: '伊利集团',
                    orgType: 'org',
                    orgState:"0",
                    isn:"1",
                    children:[]
                }],
      loadding: true,
      defaultProps: {
        label: 'orgName',
        isLeaf: (data, node) => {
            if(data.isn === '1'){
                return false;
            }else{
                return true;
            }
        }
      },
      selectData:[],
      initFlag: false

    };
  },
  model: {
    prop: "checkedKeys", //指向props的参数名
    event: "change", //事件名称
  },
  watch: {
    selectData(val) {
      this.$emit("change", val);
    },
    checkedKeys(val){
      this.$refs.tree.setCheckedKeys(val);
    },
    unitCode(val){
      this.getOrgTree({unitCode:this.unitCode})
    }
  },
  props: {
    unitCode: "",
    mutl:{
      type:Boolean,
        default:()=>true
    },
    showBtn:{
        type:Boolean,
        default:()=>false
    },
    checkedKeys:{
      type: Array,
      default:()=>[]
    },
  },
    computed: {
        ...mapGetters(['getAuthObj'])
    },
  created() {

  },
  mounted() {
      this.getOrgTree({unitCode:this.unitCode})
  },
  methods: {
    init(){
        this.initFlag = true
        this.$refs.tree.setCheckedKeys(this.checkedKeys);
    },
      
    /**
     * 获取全部子节点
     */
    getOrgTree(params) {
        this.loadding = true
        getOrgTree(params).then(res=>{
            if(res.code = '000000'){
                this.treeData[0].children = res.data.children
            }
            setTimeout(()=>{
               this.init()
            },200)
            this.loadding = false
        }).catch(err=>{
            this.loadding = false
        })
    },
    getCheckedKeys() {
        this.selectData = this.$refs.tree.getCheckedKeys()
        setTimeout(()=>{
               this.$emit('check-ok', this.selectData,this.$refs.tree.getCheckedNodes())
            },300)
        
    },
    clickHandle(){
        this.getCheckedKeys()
        return this.$refs.tree.getCheckedNodes()
    },
    handleNodeClick(data, node){
      if(!this.mutl){
        this.selectData = [data.orgCode]
        setTimeout(()=>{
               this.$emit('check-ok', this.selectData,[data])
            },300)
      }
    }
   
  }
};
</script>

<style lang="less" scoped>
    .orgTree {
        .button {
            padding: 5px;
        }
        max-height: 450px;
        overflow: auto;
    }
</style>