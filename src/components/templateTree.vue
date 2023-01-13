<template>
  <div v-loading="loading" class="treeTemplate">
    <el-table
      v-if="data.length>0"
      :data="data"
      :row-style="{height: '30px'}"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="事业部" align="center" width="100">
        <template>{{unitName}}</template>
      </el-table-column>
      <el-table-column prop="contractFirstType" align="center" label="一级" width="100"></el-table-column>
      <el-table-column prop="contractSecondType" align="center" label="二级" width="120"></el-table-column>
      <el-table-column prop="contractTypeName" align="center" label="三级" width="150">
        <template v-slot="{row}">
          <span style="font-size:10px;">{{row.contractTypeName?row.contractTypeName.split("-")[2]:''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="templateName" align="center" label="范本名称">
        <template v-slot="{row}">
          <span
            style="color:#2393F7;cursor: pointer;font-size:10px;"
            @click="gotTemplateDetail(row)"
          >{{row.templateName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount3" v-if="fromType || $store.state.common.userInfo.unitCode===treeData.unitId" align="center" label="操作" width="160">
        <template v-slot="{row}">
          <el-button type="text" size="small"  @click="addCommon(row)">常用</el-button>
          <el-button style="margin-left:20px;" v-show="fromType" type="text" size="small"  @click="opzi(row)">优化</el-button>
          <el-button
              size="small"
              type="text"
              v-show="fromType"
              @click="closeOrOpenTemplate(row)"
              icon="iconfont sbt_add"
            >{{row.statue ==='TES004'?'激活':'关闭'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  selectTemplateByContractTypeAndUnit,
  addToMy,closeOrOpenTemplate
} from "@/service/template/index";
import { getAllUnit } from "@/service/4A/index";
export default {
  props: {
    treeData: {
      type: Object,
      default: () => {},
    },
    fromType: {
      type: String,
      default: () => "",
    },
    isTemplate: {
      type: Boolean,
      default: () => false,
    },
  },
  watch: {
    treeData: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        this.treeDataOwn = {
          ...newValue,
        };
      },
    },
  },
  data() {
    return {
      data1: [],
      data: [],
      firstContractTypeArr: {}, //一级合同类型
      secondContractTypeArr: [], //二级合同类型
      threeContractTypeArr: [], //三级合同类型
      templatesArr: [], //三级下挂的范本
      rootShow: true,
      secondShow: true,
      loading: true,
      unitName: "",
      templateUnitData: [],
      treeDataOwn: {
        contractType: "",
        dictQueryForm: { dictCode: "INCOME_EXPE_TYPE" },
        firstContractType: "",
        secondContractType: "",
        templateName: "",
        unitId: "",
      },
      spanObj: {},
    };
  },
  created() {},
  mounted() {
    this.unitName = this.$store.state.common.userInfo.unitName;
    this.getAllUnit();
  },
  methods: {
    // 获取合同类型的树形
    async getTree() {
      this.loading = true;
      let params = {};
      this.data = []; // 该数据必须清掉，不然合并单元格会出问题
      this.spanObj = {}; // 该数据必须清掉，不然合并单元格会出问题
      let dictCode = {
        dictCode: "INCOME_EXPE_TYPE",
      };
      this.treeDataOwn.dictQueryForm = dictCode;
      if (!this.treeDataOwn.unitId) {
        this.treeDataOwn.unitId = this.$store.state.common.userInfo.unitCode;
      } else {
        this.unitName = this.templateUnitData.find(
          (item) => item.unitCode === this.treeDataOwn.unitId
        ).unitName;
      }
      const { code, data } = await selectTemplateByContractTypeAndUnit(
        this.treeDataOwn
      );
      if (code === "000000") {
        this.data1 = data;
        this.showTable(this.data1);
        this.loading = false;
      }
    },
    // 数据处理分类
    showTable(tableData) {
      // templatesArr:[],//三级下挂的范本
      if (this.data1.length > 0) {
        let dictNameObj = {};
        this.data1.forEach((ele) => {
          dictNameObj[ele.contractFirstTypeCode] =
            dictNameObj[ele.contractFirstTypeCode] || [];
          dictNameObj[ele.contractFirstTypeCode].push(ele);
        });

        this.data1 = [];
        console.log(dictNameObj, "-----");
        // 将所有数组分类拍寻
        for (let k in dictNameObj) {
          this.firstContractTypeArr[k] = dictNameObj[k].length;
          // 二级合同类型分类
          if (dictNameObj[k].length > 0) {
            let dictNameObjSecond = {};
            dictNameObj[k].forEach((ele) => {
              dictNameObjSecond[ele.contractSecondTypeCode] =
                dictNameObjSecond[ele.contractSecondTypeCode] || [];
              dictNameObjSecond[ele.contractSecondTypeCode].push(ele);
            });
            dictNameObj[k] = [];
            for (let p in dictNameObjSecond) {
              // 三级合同类型分类
              if (dictNameObjSecond[p].length > 0) {
                let dictNameObjthree = {};
                dictNameObjSecond[p].forEach((ele) => {
                  dictNameObjthree[ele.contractType] =
                    dictNameObjthree[ele.contractType] || [];
                  dictNameObjthree[ele.contractType].push(ele);
                });

                dictNameObjSecond[p] = [];
                for (let y in dictNameObjthree) {
                  let Arr2 = dictNameObjSecond[p].concat(dictNameObjthree[y]);
                  dictNameObjSecond[p] = [...Arr2];
                }
              }
              let Arr1 = dictNameObj[k].concat(dictNameObjSecond[p]);
              dictNameObj[k] = [...Arr1];
            }
          }

          let Arr = this.data1.concat(dictNameObj[k]);
          this.data1 = [...Arr];

          this.data = [...this.data1];
        }
      }
    },
    // 合并单元格
    init(columnIndex, name) {
      if (this.spanObj[columnIndex]) {
        return;
      }
      let param = {};
      let index = 1;
      let currentName = "";
      let row = 0;
      for (let i = 0; i < this.data.length; i++) {
        if (i == 0) {
          // 将第一个不合并
          param[i] = [1, 1];
          currentName = this.data[i][name];
          continue;
        } else {
          if (currentName === this.data[i][name]) {
            // 将所有的设置为合并
            param[i] = [0, 0];
            // 如果相同，则将序列叠加
            index++;
            if (i === this.data.length - 1) {
              if (index == 1) {
                param[i] = [1, 1];
              } else {
                param[row] = [index, 1];
              }
            }

            continue;
          } else {
            currentName = this.data[i][name];
            param[i] = [1, 1];
            param[row] = [index, 1];
            row += index;
            index = 1;
          }
        }
      }
      this.spanObj[columnIndex] = param;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 5 && columnIndex > 0) {
        this.init(columnIndex, column.property);
        let param = this.spanObj[columnIndex];
        if (param[rowIndex]) {
          return param[rowIndex];
        } else {
          return [0, 0];
        }
      }
    },
    async getAllUnit() {
      let params = {}; // 查询所有事业部不用传参数
      const { code, data } = await getAllUnit(params);
      if (code === "000000") {
        this.templateUnitData = data;
        this.getTree();
      }
    },
    // 点击某一个范本跳转到范本详情
    gotTemplateDetail(item, parentNode) {
      if (this.isTemplate) {
        // 从范本维护的页面进来
        this.$router.push({
          name: "templateMainTain",
          query: {
            type: "detail",
            isShowButton: "true",
            templateId: item.templateId,
            unitCode: item.unitId,
          },
        });
        return;
      }
      if (this.fromType === "manager") {
        this.$router.push({
          name: "managetemplate",
          query: {
            type: "detail",
            isShowButton: "true",
            templateId: item.templateId,
            unitCode: item.unitId,
          },
        });
      } else {
        this.$router.push({
          name: "managetemplate",
          query: {
            type: "detail",
            templateId: item.templateId,
            unitCode: item.unitId,
          },
        });
      }
    },
    // 添加为为的常用范本
    async addCommon(params) {
      const { code, data } = await addToMy(params);
      if (code === "000000") {
        this.$message({ type: "success", message: "添加至常用范本成功！" });
      }
    },
    opzi(params) {
      if (this.isTemplate) {
        // 范本维护页面
        this.$router.push({
          name: "templateMainTain",
          query: {
            type: "optimalize",
            templateId: params.templateId,
          },
        });
      }else{
        this.$router.push({
        name: "managetemplate",
        query: {
          type: "optimization",
          templateId: params.templateId,
        },
      });
      }
    },
    // 关闭或者激活范本
    async closeOrOpenTemplate(params) {
      const { code, data } = await closeOrOpenTemplate(params);
      if (code === "000000") {
        this.$message({ type: "sueccess", message: "操作成功！" });
        this.getTree();
      }
    },
    clear() {
      // this.treeData = {}
    },
  },
};
</script>
<style lang="less">
.treeTemplate {
  min-height: 100px;
  .el-table--small td, .el-table--small th {
    padding: 1px 0;
}
}
</style>