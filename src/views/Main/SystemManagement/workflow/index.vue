<template>
  <div>
    <el-tabs type="border-card" @tab-click="handleClick">
        <el-tab-pane label="环节配置">
            <workflowNode></workflowNode>
        </el-tab-pane>
        <el-tab-pane label="节点配置">
            <workflowTaskNode v-if="showTaskNode"></workflowTaskNode>
        </el-tab-pane>
        <el-tab-pane label="路径配置">
            <workflowPath v-if="showPath"></workflowPath>
        </el-tab-pane>
        <el-tab-pane label="审批矩阵">
            <workflowApproval v-if="showApproval"></workflowApproval>
        </el-tab-pane>
        <el-tab-pane label="流程定义">
            <workflowDefined v-if="showDefined"></workflowDefined>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import workflowApproval from "./approval/index";
import workflowDefined from "./defined/index";
import workflowNode from "./node/index";
import workflowPath from "./path/index";
import workflowTaskNode from "./taskNode/index";
export default {
    components: {
    workflowApproval: workflowApproval,
    workflowDefined: workflowDefined,
    workflowNode: workflowNode,
    workflowPath: workflowPath,
    workflowTaskNode: workflowTaskNode,
  },
  data () {
    return{
        showTaskNode:false,
        showPath:false,
        showApproval:false,
        showDefined:false,
    };
  },
  methods: {
        handleClick(tab, event){
            let index = tab.index
            if(index === "1"){
                this.showTaskNode = true
            }else if(index === "2"){
                this.showPath = true
            }else if(index === "3"){
                this.showApproval = true
            }else if(index === "4"){
                this.showDefined = true
            }
        }
    }
};
</script>