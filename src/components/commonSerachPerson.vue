<template>
  <el-select
    :disabled="disabled"
    class="w-100"
    v-model="optionVal"
    filterable
    remote
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    @change="vauleChange"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.userId"
      :label="item.userName"
      :value="item.userId">
      <span style="float: left">{{ item.userName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.orgName }}</span>
    </el-option>
    <div class="pagePagination">
      <el-pagination
        background
        layout="prev, pager, next"
        @prev-click="gotoPrev"
        @current-change="gotoCurrentPage"
        @next-click="gotoNext"
        :total="pageData.total">
      </el-pagination>
    </div>
  </el-select>
</template>
<script>
import {getPersonList} from '../service/4A/index'

export default {
  props: {
    orgCode: {
      type: String,
      default: () => ''
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    value: {type: [Array, String], default: () => [] || ""}, // 不多选的时候type为String
  },
  data() {
    return {
      options: [],
      optionVal: this.value,
      username: '',
      loading: false,
      pageData: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        totalPage: 0
      }
    }
  },
  watch: {
    value(n) {
      this.optionVal = n;
    },
  },
  mounted() {
    this.getPersonList()
  },
  methods: {
    // 查询人员的数据
    async getPersonList() {
      let params = {...this.pageData}
      params.orgCode = this.orgCode
      params.userName = this.username
      console.log(params, 'ddd')
      const {code, data} = await getPersonList(params)
      if (code === '000000') {
        this.options = data.content
        this.pageData.total = data.total
        this.pageData.totalPage = data.totalPage
      }
    },
    // 选择某一个人员后
    chooseItem(item) {
      this.inputData = item
      this.isShow = false
      console.log(this.isShow)
    },
    // 上一页
    gotoPrev() {
      if (this.pageData.currentPage > 0) {
        this.pageData.currentPage--
      }
      this.getPersonList()
    },
    // 下一页
    gotoNext() {
      if (this.pageData.currentPage < this.pageData.totalPage) {
        this.pageData.currentPage++
      }
      this.getPersonList()
    },
    // 跳转到某一页
    gotoCurrentPage(page) {
      this.pageData.currentPage = page
      this.getPersonList()
    },
    // 从远程服务器搜索
    remoteMethod(item) {
      if (item.length > 0) {
        this.username = item
        this.getPersonList()
      }
    },
    // 选中值后将值回传给父组件
    vauleChange(e) {
      this.$emit("input", e);
      this.$emit('person', this.optionVal)
    },
    // 父组件重置子组件的参数
    reSetData() {
      this.optionVal = []
      this.options = []
    }
  }
}
</script>
<style lang="less" scoped>
.pagePagination {
  margin-top: 10px;
}

.sel-box {
  display: flex;
  justify-content: space-between;
}
</style>
