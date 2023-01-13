<template>
    <div>
    <div class="bg-white mb24 pd24">
      <el-form :model="ruleForm" :rules="rules" label-width="100px"
               ref="ruleForm">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="对方主体" prop="cooperationName">
              <el-input v-model="ruleForm.cooperationName" placeholder="请输入对方主体"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人" prop="attribute1">
              <el-input v-model="ruleForm.attribute1" placeholder="请输入创建人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <div class="button-box tr">
              <el-button type="primary" @click="formSearchMethod"
                         icon="iconfont sbt_add">查询
              </el-button>
              <el-button @click="formResetMethod('ruleForm')"
                         icon="iconfont sbt_add">重置
              </el-button>
            </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="bg-white user-form-table pd24">
        <el-button type="primary" @click="dlgVisiable=true">新增</el-button>
      <el-table
        class="mt10 md20"
        :data="tableData"
        stripe highlight-current-row
        style="width: 100%"
        :header-cell-style="{background:'#f3f3f3'}"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="cooperationName" label="对方主体" show-overflow-tooltip  ></el-table-column>
        <el-table-column prop="cooperationType" label="对方主体类型" >
            <template v-slot="{row}">
                  {{row.cooperationType==='VENDOR'?'供应商':'客户'}}
              </template>
        </el-table-column>
        <el-table-column prop="forbiddenReason" label="风险提示" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="attribute1" label="创建人" ></el-table-column>
        <el-table-column prop="creationDate" label="创建时间"></el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template v-slot="{row}">
            <div class="tc">
                 <el-button  type="text" size="mini" @click="handleDetail(row)">编辑</el-button>
              <el-popconfirm title="确认撤回该条记录吗?" @onConfirm="handleDeleteClick(row)">
                <el-button slot="reference" type="text" size="mini" circle>删除</el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
    </div>


    <el-dialog title="失信名单信息" :visible.sync="dlgVisiable" width="50%" height="450">
            <el-form label-width="120px">
                <el-col>
                    <el-form-item label="对方主体">
                             {{selectNode.cooperationName}} &nbsp; &nbsp; &nbsp; &nbsp;
                       <el-dropdown v-if="!selectNode.forbiddenId" @command="handleCommand">
                            <el-button type="primary"  @click="dlgVisiable2 = true">
                                选择<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="select">选择</el-dropdown-item>
                                <el-dropdown-item command="clear">清空</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                         
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="风险提示">
                        <el-input type="textarea"
                            :rows="4"
                            placeholder="请输入风险提示"
                            v-model="selectNode.forbiddenReason"
                            maxlength="100"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="创建人">
                        {{userInfo.userName}}
                    </el-form-item>
                </el-col>
              
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgVisiable = false">取 消</el-button>
                <el-button type="primary" @click="saveInfo">确 定</el-button>
            </div>    
    </el-dialog>

    <el-dialog title="选择对方主体" :visible.sync="dlgVisiable2" width="75%">
        <CommonCooperation ref="cooperation" :selectAll="true" :mutl="false"  @check-ok="selectInfo"/>
        <div slot="footer" class="dialog-footer">
                <el-button @click="dlgVisiable2 = false">取 消</el-button>
                <el-button type="primary" @click="selectOk">确 定</el-button>
            </div>  
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import {addForbiddenCooperation, updateForbiddenCooperation,queryForbiddenCooperation,deleteForbiddenCooperation} from '@/service/4A'
import {mapState} from "vuex";
export default {
  data() {
    return {
      overHeight: '150px',
      dlgVisiable: false,
      dlgVisiable2: false,
      ruleForm: {
        cooperationName: '',
        attribute1: ''
      },
      rules: {},
      tableData: [],
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      selectNode:{}
    };
  },
  computed: {
        ...mapState({
        userInfo: state => state.common.userInfo
        })
    },
  mounted() {
    this.$store.dispatch('setHeight', 100)
    this.getBackList()
  },

  methods: {
      async saveInfo(){
          this.selectNode.attribute1 = this.userInfo.userName
          console.log(this.selectNode)
          if(!this.selectNode.cooperationId){
              this.$message({type: "warning",message: "请选择对方主体"})
              return
          }
          if(!this.selectNode.forbiddenReason){
              this.$message({type: "warning",message: "请输入风险提示"})
              return
          }
          if(this.selectNode.forbiddenId){
            const {code,msg,data} = await updateForbiddenCooperation(this.selectNode.forbiddenId,this.selectNode)
            if(code==='000000'){
                this.$message({type: "success",message: "操作成功"})
                this.selectNode = {}
                this.dlgVisiable = false
            }else{
                // this.$message({type: "error",message: data})
            }
          }else{
            const {code,msg,data} = await addForbiddenCooperation(this.selectNode)
            if(code==='000000'){
                this.$message({type: "success",message: "操作成功"})
                this.selectNode = {}
                this.formSearchMethod()
                this.dlgVisiable = false
            }else{
                // this.$message({type: "error",message: data})
            }
          }
          
      },
    async handleDeleteClick(row) {
      const {code} = await deleteForbiddenCooperation(row.forbiddenId)
      if (code === '000000') {
        this.getBackList()
      }
    },
    async getBackList() {
      let date = this.ruleForm.date;
      const {code, data} = await queryForbiddenCooperation({
        ...this.searchForm, ...this.$refs.ruleForm.model,
      });
      if (code === '000000') {
        this.tableData = data.records || []
        this.searchForm.total = data.total
        this.searchForm.currentPage = data.current
      }
    },
    /**
     * 查询
     */
    formSearchMethod() {
      this.searchForm = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      };
      this.getBackList()
    },
    /**
     * 重置
     */
    formResetMethod(self) {
      this.searchForm = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      };
      this.$refs[self].resetFields()
      this.getBackList()
    },
    /**
     * 分页查询
     */
    handlerCurrentPage(list) {
      this.searchForm = {
        ...this.searchForm,
        ...list
      };
      this.getBackList();
    },
    /**
     * 点击待办跳转审批页
     * @param row
     */
    handleDetail(row) {
      this.dlgVisiable = true
      this.selectNode = row
    },
    handleCommand(command){
        if(command==='select'){
            this.dlgVisiable2 = true
        }else if(command === 'clear'){
            this.selectNode.cooperationName = ''
            this.selectNode.cooperationId =  ''
            this.selectNode.cooperationCode =  ''
            this.selectNode.cooperationType =  ''
        }
    },
    selectInfo(arr){

    },
    selectOk(){
        let arr = this.$refs.cooperation.getSelections()
        if(arr && arr.length>=1){
            this.selectNode.cooperationName = arr[0].cooperationName
            this.selectNode.cooperationId = arr[0].cooperationId
            this.selectNode.cooperationCode = arr[0].cooperationCode
            this.selectNode.cooperationType = arr[0].cooperationType
            this.dlgVisiable2 = false
        }else{
            this.$message({type: 'warning',message: "请选择一个对方主体"})
        }
    }
  }
};
</script>

<style lang="less" scoped>

.button-center {
  text-align: center;

  span {
    font-size: 14px;
    color: #2393F7;
  }
}
</style>