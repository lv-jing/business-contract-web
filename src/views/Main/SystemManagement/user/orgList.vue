<template>
  <div class>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <span>组织树</span>
       <!-- <el-button size="small" type="primary" icon="iconfont sbt_add" @click="addMenus">添加菜单</el-button> -->
      </div>

      <el-row class="bg-white">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-tree
              :data="treeData"
              highlight-current
              node-key="orgCode"
              :props="defaultProps"
              :load="loadTree"
              @node-click="handleNodeClick"
              lazy
              :default-expanded-keys="[' ']"
            ></el-tree>
          </el-col>
          <el-col :span="19">
            <el-form :inline="true" :model="selOrg" label-width="100px" label-position="left">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="组织编码">
                                <el-input v-model="selOrg.orgCode" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="组织名称">
                                <el-input v-model="selOrg.orgName" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="简称">
                                <el-input v-model="selOrg.simpleName" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
            </el-form>
            <el-form :model="searchForm" label-width="100px" label-position="left">
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="用户编号" prop="userCode">
                            <el-input v-model="searchForm.userCode" placeholder="请输入用户编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户名称" prop="userName">
                            <el-input v-model="searchForm.userName" placeholder="请输入用户编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="searchForm.phone" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="searchForm.email" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="证件号" prop="idCard">
                            <el-input v-model="searchForm.idCard" placeholder="请输入证件号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户状态" prop="statusCode">
                            <el-select v-model="searchForm.statusCode" placeholder="请输入选择">
                                <el-option key="" value="" label="全部"></el-option>
                                <el-option key="0" value="0" label="有效"></el-option>
                                <el-option key="1" value="1" label="失效"></el-option>
                            </el-select>
                            &nbsp; &nbsp;
                            <el-button type="primary" @click="handlerCurrentPage(1)"
                           icon="iconfont sbt_add">查询
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table :data="tableData" style="width: 99%" :highlight-current-row="true">
              <el-table-column type="index" width="60" label="序号"></el-table-column>
                <el-table-column prop="userCode" label="用户编码"></el-table-column>
                <el-table-column prop="userName" label="用户姓名"></el-table-column>
                <el-table-column prop="phone" label="手机号"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="idCard" label="证件号"></el-table-column>
                <el-table-column prop="unitCode" label="所属事业部"></el-table-column>
                <el-table-column prop="unitName" label="事业部名称" width="100"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{scope.row.statusCode == "1" ? "失效":'有效'}}
                    </template>
                </el-table-column>
            </el-table>
            <common-pagination v-on:handler-currentPage="handlerCurrentPage" :list="searchForm"></common-pagination>
          </el-col>
        </el-row>
      </el-row>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */

import {mapGetters} from "vuex";
import {getOrgTreeList,getPersonList} from '@/service/4A/index'
export default {
  data() {
    return {
      treeData: [],
      tableData: [],
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
      selOrg: {},
      searchForm: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            }

    };
  },
    computed: {
        ...mapGetters(['getAuthObj'])
    },
  created() {

  },

  methods: {
    loadTree (node, resolve) {
            if(node.level === 0){
                return resolve([{
                    id: 26,
                    orgCode: '00000001',
                    orgName: '伊利集团',
                    orgType: 'org',
                    orgState:"0",
                    isn:"1"
                }])
            }

            this.getOrgChildren(node.data, data => {
                return resolve(data)
            })
        },

    /**
     * 获取全部子节点
     */
    async getOrgChildren(ele, callback) {
        const{code, data} =  await getOrgTreeList(ele.orgCode)
        callback(data)

    },
    /**
     * 点击树展示数据
     */
    handleNodeClick(data) {
        this.selOrg = data
        let params = {}
        params.orgId = this.selOrg.orgId
        params.orgCode = this.selOrg.orgCode
        params.currentPage = 0
        params.pageSize = 10
        this.queryUserHandle(params)
    },
    /**
     * 查询用户
     */
    async queryUserHandle(params) {
        const{code,data} = await getPersonList(params);
         if(code && code ==='000000'){
            this.searchForm.total = data.total
            this.searchForm.currentPage = data.pageNo
            this.searchForm.pageSize = data.pageSize
            this.tableData = data.content
        }
    },
    handlerCurrentPage(val){
        this.searchForm.currentPage = val.currentPage || val
        this.searchForm.orgCode = this.selOrg.orgCode
        this.queryUserHandle(this.searchForm)
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
