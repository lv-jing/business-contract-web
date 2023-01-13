<template>
  <div>
    <el-popover
      :disabled="!content"
      placement="right"
      width="250"
      trigger="hover"
      :content="content">
      <el-button
        slot="reference" @click="handleClick"
        :disabled="!disabled || ['view','detail','adds'].includes($route.query.type)"
        size="mini" icon="el-icon-upload">
        点击上传
      </el-button>
    </el-popover>

    <div class="el-select">
       <span v-for="(item,index) in workList" :key="index" class="el-tag el-tag--info el-tag--small el-tag--light">
      <span class="el-select__tags-text">
        <span @click="handleGoto(item)" class="pointer">{{ item.requestName }}</span>
        <i v-if="disabled && !['view','detail','adds'].includes($route.query.type)" @click="handleDelate(index)"
           class="el-tag__close el-icon-close"></i>
      </span>
    </span>
    </div>
    <el-dialog
      style="overflow-y: auto"
      title="关联前置审批流程"
      :visible.sync="visible"
      width="65%">
      <el-form :model="ruleForm" label-width="80px"
               ref="ruleForm">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="流程名称" prop="requestName">
              <el-input v-model="ruleForm.requestName" placeholder="请输入流程名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程号" prop="requestID">
              <el-input v-model="ruleForm.requestID" placeholder="请输入流程号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程类型" prop="workflowID">
              <common-select
                v-model="ruleForm.workflowID"
                dictCode="WORK_FLOW_NAME"
                :value="ruleForm.workflowID"
                placeholder="请选择收支类型"
                :isSplicing="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间" prop="createDate">
              <el-date-picker
                class="w-100"
                v-model="ruleForm.createDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <div class="button-box tr">
              <el-button type="primary" @click="formSearchMethod"
                         icon="iconfont sbt_add">查询
              </el-button>
              <el-button @click="formResetMethod('ruleForm')"
                         icon="iconfont sbt_add">重置
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="loading"
        :data="tableData"
        ref="multipleTable"
        stripe highlight-current-row
        style="width: 100%"
        :header-cell-style="{background:'#f3f3f3'}"
        size="mini"
        :height="280"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="requestName" label="流程名称"></el-table-column>
        <el-table-column prop="requestID" label="流程号"></el-table-column>
        <el-table-column prop="workflowName" label="流程类型"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose(1)">取 消</el-button>
    <el-button type="primary" @click="handleClose(2)">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {queryOaFlow, getOaViewUrl} from '@/service/timer'
import {mapState} from "vuex";

export default {
  props: {
    content:String,
    // 回填数据
    showWorkList: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      loading: false,
      visible: false,
      ruleForm: {
        requestName: '',
        requestID: '',
        createDate: '',
        workflowID: ''
      },
      options: [],
      tableData: [],
      workList: [],
      list: [],
      searchForm: {
        createDate: '',
        requestID: '',
        requestName: ''
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  watch: {
    showWorkList(list) {
      if (list.length > 0) {
        list.map(item => {
          item.requestID = item.workFlowId;
          item.requestName = item.workFlowName;
          item.workflowName = item.workFlowTypeName;
          item.workflowID = item.workFlowTypeCode;
        })
        this.workList = list;
      } else {
        this.workList = []
      }
    }
  },
  mounted() {
  },
  methods: {
    // 查询关联审批流程
    async queryOaFlow() {
      this.loading = true
      const {code, data} = await queryOaFlow({
        userCode: this.userInfo.userCode,
        ...this.searchForm
      }).catch(err => {
        this.loading = false
      })
      if (code === '000000') {
        this.loading = false
        this.tableData = data
      } else {
        this.loading = false
        this.tableData = []
      }
    },
    // 点击选择
    handleClick() {
      this.visible = true
      this.queryOaFlow()
    },
    /**
     * 关闭弹窗 1， 确定弹窗2
     * @param val
     */
    handleClose(val) {
      if (val === 1) {
        this.visible = false
        this.$refs.multipleTable.clearSelection();
      } else {
        this.workList = this.unique(this.workList.concat(this.list))
        this.workList.map(item => {
          item.workFlowId = item.requestID;
          item.workFlowName = item.requestName;
          item.workFlowTypeName = item.workflowName;
          item.workFlowTypeCode = item.workflowID;
        })
        this.$emit('getWorkFlow', this.workList)
        this.$refs.multipleTable.clearSelection();
        this.visible = false;
      }
    },
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.requestID) && res.set(arr.requestID, 1))
    },
    /**
     * 选择表格下啦
     * @param list
     */
    handleSelectionChange(list) {
      this.list = list;
    },
    /**
     *  查询
     */
    formSearchMethod() {
      this.searchForm = {
        ...this.searchForm,
        ...this.$refs.ruleForm.model
      }
      this.queryOaFlow()
    },
    /**
     * 重置
     */
    formResetMethod() {
      this.searchForm = {
        createDate: '',
        requestID: '',
        requestName: '',
        workflowID: ''
      }
      this.$refs.ruleForm.resetFields()
      this.queryOaFlow()
    },
    /**
     * 删除关联审批流程
     * @param index
     */
    handleDelate(index) {
      this.workList.splice(index, 1)
      this.$emit('getWorkFlow', this.workList)
    },
    /**
     * 点击关联流程跳转
     * @param item
     */
    async handleGoto(item) {
      const {code, data} = await getOaViewUrl({
        userCode: this.userInfo.userCode,
        requestID: item.requestID
      })
      if (code === '000000') {
        window.open(data.viewUrl)
      }
    },
  }
}
</script>

<style scoped lang="less">

</style>
