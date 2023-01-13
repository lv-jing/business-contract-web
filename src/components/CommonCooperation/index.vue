 <template>  
    <div style="margin-bottom: 10px;">
        <el-form :model="searchOption" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="对方主体编号" prop="cooperationCode">
                <el-input
                  v-model="searchOption.cooperationCode"
                  placeholder="请输入编号"
                  class="input-edit-role"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="对方主体名称" prop="cooperationName">
                <el-input v-model="searchOption.cooperationName" class="input-edit-role"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="对方主体类型" prop="cooperationType">
                <el-select
                  v-model="searchOption.cooperationType"
                  value-key="value"
                  placeholder="请选择"
                  class="input-edit-role"
                >
                  <el-option
                    v-for="item in cooperationTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-button size="small" type="primary" @click="queryData(1)">查 询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
 
        <el-table :data="tableData" 
                highlight-current-row
                @current-change="handleCurrentChange"
                @selection-change="handleSelectionChange"
                :v-loading='loading'
                ref="roleTables" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="cooperationCode" label="对方主体编号" min-width="20%"></el-table-column>
          <el-table-column prop="cooperationName" label="对方主体名称" min-width="60%"></el-table-column>
          <el-table-column prop="cooperationType" label="对方主体类型" min-width="15%">
              <template v-slot="{row}">
                  {{row.cooperationType==='VENDOR'?'供应商':'客户'}}
              </template>
          </el-table-column>
        </el-table>
        <common-pagination v-on:handler-currentPage="queryData" :list="searchOption"></common-pagination>
    </div>
</template>

<script>
import {
  getOtherSide,
} from '@/service/approval';
import {queryCooperationInfo} from'@/service/4A'
import {mapState} from "vuex"
export default {
    data(){
        return {
            loading: false,
            searchOption:{
                currentPage: 1,
                pageSize: 10,
            },
            tableData: [],
            cooperationTypes: [
                {label:'供应商',value:'VENDOR'},{label:'客户',value:'DEALER'}
            ]

        }
    },
    props:{
        mutl:{
            type:Boolean,
            default:false
        },
        selectAll:{
            type:Boolean,
            default:false
        },
        selectedData:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    computed: {
        ...mapState({
        userInfo: state => state.common.userInfo
        })
    },
    mounted(){
        this.queryData(1)
    },
    methods:{
        async queryData(val){
          this.searchOption.currentPage = val.currentPage ? val.currentPage : val
            this.tableData = []
            this.loading = true
            if(this.selectAll){
                 const {code, data} = await queryCooperationInfo({ ...this.searchOption})
                if(code === '000000'){
                    this.tableData = [...data.records]
                    this.searchOption.currentPage = data.current
                    this.searchOption.total = data.total
                }
                this.loading = false
            }else{
                const {code, data} = await getOtherSide({
                            ...this.searchOption,
                            unitCode: this.userInfo.unitCode
                        })
                if(code === '000000'){
                    this.tableData = [...data.content]
                    this.searchOption.currentPage = data.pageNo
                    this.searchOption.total = data.total
                }
                this.loading = false
            }
            this.searchOption = {...this.searchOption}
        },
        handleCurrentChange(item){
            if(!this.mutl){
                this.$refs.roleTables.clearSelection()
                this.$refs.roleTables.toggleRowSelection(item)
            }
        },
        handleSelectionChange(item){
            if(!this.mutl){
                if (item.length > 1) {
                    this.$refs.roleTables.clearSelection()
                    this.$refs.roleTables.toggleRowSelection(item.pop())
                } 
            }
        },
        getSelections(){
            let arr = this.$refs.roleTables.selection;
             setTimeout(()=>{
               this.$emit('check-ok', arr)
            },300)
            return arr
        }
    }
}
</script>