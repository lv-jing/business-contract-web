<template>
  <el-select
    :disabled="disabled"
    :clearable="clearable"
    class="w-100"
    v-model="optionVal"
    filterable
    remote
    :placeholder="placeholder"
    :remote-method="(val)=>remoteMethod(val)"
    @change="vauleChange"
    value-key="userId"
    @visible-change="visibleChange"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.userId"
      :label="item.userName"
      :value="item">
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
import {getPersonList} from '@/service/4A'

export default {
  props: {
    orgCode: {
      type: String,
      default: () => ''
    },
    placeholder: {
      type: String,
      default: () => '提醒对象'
    },
    onChange: {
      type: Function,
      default: (val) => {
        return val
      }
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    clearable: {type: Boolean, default: () => false},
    value: {
      type: Object, default: () => {
      }
    }, // 不多选的时候type为String
  },
  data() {
    return {
      options: [],
      optionVal: this.value,
      username: '',
      loading: false,
      pageData: {
        pageSize: 7,
        currentPage: 1,
        total: 0,
        totalPage: 0
      }
    }
  },
  watch: {
    value(n) {
      this.optionVal = n;
      this.getPersonList()
    },
  },
  mounted() {
    this.getPersonList()
  },
  methods: {
    visibleChange(val) {
      if (val) {
        this.username = ''
        this.getPersonList()
      }
    },
    // 查询人员的数据
    async getPersonList() {
      let params = {...this.pageData}
      params.orgCode = this.orgCode
      params.userName = this.username
      const {code, data} = await getPersonList(params)
      if (code === '000000') {
        this.options = this.unique(data.content.concat(this.optionVal && this.optionVal.userName ? this.optionVal : []))
        this.pageData.total = data.total
        this.pageData.totalPage = data.totalPage
      }
    },
    /**
     * 去重
     * @param arr
     * @returns {*}
     */
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
    // 选择某一个人员后
    chooseItem(item) {
      this.inputData = item
      this.isShow = false
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
      console.log(item);
      this.pageData = {
        pageSize: 7,
        currentPage: 1,
        total: 0,
        totalPage: 0
      }
      if (item) {
        this.username = item
        this.getPersonList()
      } else {
        this.username = ''
        this.getPersonList()
      }
    },
    // 选中值后将值回传给父组件
    vauleChange(e) {
      this.$emit("input", {
        userName: e.userName,
        userId: e.userId
      });
      this.onChange(e)
    },
  }
}
</script>
<style lang="less" scoped>
.pagePagination {
  margin-top: 10px;
}


</style>
