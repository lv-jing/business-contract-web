<template>
  <div>
    <common-title :title="approvalTitle" class="mt20 mb20"/>
    <div><el-button @click="viewPic">查看审批流程图</el-button></div>
    <el-table
      class="mt10 mun-right"
      :data="ApprovalData"
      stripe
      highlight-current-row
      style="width: 100%;"
      :header-cell-style="{background:'#f3f3f3'}"
    >
      <el-table-column type="index" label="序号">
        <template slot-scope="scope">
          <span>{{ ApprovalData.length - scope.$index}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taskDescription" label="审批节点"></el-table-column>
      <el-table-column prop="operationType" label="审批结论">
        <template v-slot={row}>
            <span>{{getDictName(row.operationType)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="意见" width="300" v-if="showOptions">
        <template v-slot={row}>
          <span>{{ getOpintions(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="附件"  v-if="showOptions">
        <template v-slot={row}>
          <span class="pointer upload-hover" v-for="(item,index) in getUpload(row)" v-bind:key="index" style="margin-right: 5px">
              <span class="show-hidden" @click="hanldeDown(item)" >{{item.approverFileName}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="approverName" label="办理人"></el-table-column>
      <el-table-column prop="approvalTime" label="送出时间"></el-table-column>
    </el-table>

     <el-dialog title="查看流程图"
             :visible.sync="dlgPic" width="70%">
            <CommonWorkflowPicture :workflowHistoryId="workflowHistoryId"></CommonWorkflowPicture>
        </el-dialog>
  </div>
</template>

<script>
import {formatSeconds, OpenKgWindow} from '@/utils/tools'
import {dictSelectList} from '@/service/common'
import {downloadUrl, previewUrl} from '@/service/file'

export default {
  name: "index",
  data() {
    return {
      formatSeconds: formatSeconds,
      ruleForm: {
        approverOpinions: ''
      },
      rules: {},
      dictVoList:[],
      workflowHistoryId: "",
      dlgPic: false
    }
  },
  props: {
    //
    ApprovalData: {
      type: Array,
      default: () => []
    },
    pinionsList: {
      type: Array,
      default: () => []
    },
    showOptions:{
      type: Boolean,
      default: () => true
    },
    approvalTitle:{
      type:String,
      default:()=>'审批历史'
    }
  },
  watch:{
    ApprovalData(val){
      if(val && val.length>0){
        this.workflowHistoryId = val[0].workflowHistoryId
      }
    }
  },
  created() {
    this.dictSelectList()
  },
  methods: {
    async dictSelectList(){
      const {code,data}=await dictSelectList({
        dictCode:'OPERATION_TYPE'
      })
      if(code==='000000'){
        this.dictVoList = data[0].dictVoList
      }
    },
    getDictName(code){
      let name = this.dictVoList.filter(item=>item.dictCode===code)
      if(name.length>0){
        return name[0].dictName
      } else {
        return ''
      }
    },
    getOpintions(row){
      var arr = [];  //审批意见
      this.pinionsList.map(item => {
        if (item.taskId === row.taskId && item.approverType === 'TEXT') {
          arr.push(item)
        }
      })
      return arr[0] && arr[0].approverOpinions || ''
    },
    getUpload(row) {
      var arr = []; // 审批附件
      this.pinionsList.map(item => {
       if (item.taskId === row.taskId && item.approverType === 'FILE') {
          arr.push(item)
        }
      })
      return arr
    },
    handleClose(val) {
      this.visible = false
    },
    hanldeDown(item){
      const token = this.$Cookie.get('token')
      // if(['doc','docx'].includes(item.attribute1)){
      //   OpenKgWindow('?openType=open&readType=readyOnly&fileId=' + item.approverFileId + '&token=' + token)
      // } else {
      //   window.open(previewUrl + `/${item.approverFileId}/preview?token=${token}`)
      // }
      window.location.href = downloadUrl + `/${item.approverFileId}?token=${token}`
    },
    viewPic(){
      if(this.workflowHistoryId){
        this.dlgPic = true
      }else{
        this.$message({
          type:"warning",
          message:"无流程历史信息"
        })
      }
    }
  }
}
</script>

<style scoped lang="less">

.viewPicBtn {
  position: relative;
    top: -50px;
    left: 100px;
}

.upload-hover {
  .show-hidden {
    cursor: pointer;
  }

  a {
    color: #2393F7;
  }

  padding: 10px 10px 20px 10px;

  .custom-progress {
    position: absolute;
    bottom: -10px;
    width: 49%;
    height: 25px;
  }

  &:hover {
    .show-hidden {
      color: #2393F7;
    }
  }
}
</style>
