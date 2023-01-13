<!--合同审批单打印页面-->
<template>
  <div class="printContractInfo">
    <table border="1" bordercolor="#dce3f2" class="printContractInfoDiv">
      <tr>
        <td>
          <div class="title">
            <span>{{contractInfo.contractName}}审批单</span>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="contractInfoDiv" style="width:90%;margin:0 auto;margin-bottom:10px;">
            <common-title class="ft18" title="基本信息" />
            <table style="width:100%;margin-left:10px;font-size:6px;">
              <tr>
                <td class="tdTitle ft10">
                  合同名称
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.contractName}}</td>
              </tr>
              <tr>
                <td class="tdTitle ft10">
                  合同描述
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.contractDesc}}</td>
              </tr>
              <tr>
                <td class="tdTitle ft10">
                  合同编号
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.contractNo}}</td>
              </tr>
              <tr>
                <td class="tdTitle ft10">
                  我方主体
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">
                  <span
                    v-for="(item,index) in ourContractEntity"
                    v-bind:key="index"
                  >{{item.entityName}} {{index===ourContractEntity.length-1?'':','}}</span>
                </td>
              </tr>
              <tr>
                <td class="tdTitle ft10">
                  对方主体
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">
                  <span
                    v-for="(item,index) in otherContractEntity"
                    v-bind:key="index"
                  >{{item.entityName}} {{index===otherContractEntity.length-1?'':','}}</span>
                </td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  前置审批
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.contractNo}}</td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  收支类型
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">
                  <DictCodeToDictName
                    :parentCode="'INCOME_EXPE_TYPE'"
                    :dictCode="contractInfo.incomeExpeTypeCode"
                  ></DictCodeToDictName>
                </td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  合同类型
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">
                  <DictCodeToDictName
                    :parentCode="'INCOME_EXPE_TYPE'"
                    :dictCode="contractInfo.contractTypeCode"
                  ></DictCodeToDictName>
                </td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  合同期限
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">
                  <DictCodeToDictName
                    :parentCode="'VILAD_TYPE'"
                    :dictCode="contractInfo.validDateType"
                  ></DictCodeToDictName>
                </td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  合同币种
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">
                  <DictCodeToDictName
                    :parentCode="'CONTRACT_SURRENCY'"
                    :dictCode="contractInfo.contractCurrencyCode"
                  ></DictCodeToDictName>
                </td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  原币金额
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td
                  class="ft10"
                >{{contractInfo.originalCurrency?contractInfo.originalCurrency/100:''}}</td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  合同税率
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.taxRate}}</td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  含税金额
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.includedAmount?contractInfo.includedAmount/100:""}}</td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  合同份数
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.contractNumber}}</td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  是否保密
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.scret ==='Y'?'是':'否'}}</td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  防伪水印
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.watermark==='N'?'是':'否'}}</td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  项目名称
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.projectName}}</td>
              </tr>
              <tr>
                <td class="tdTitle ft10">
                  项目编号
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.projectCode}}</td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  经办人
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.memberName}}</td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  发起部门
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.orgName}}</td>
              </tr>

              <tr>
                <td class="tdTitle ft10">
                  联系方式
                  <div class="lineDiv">
                    <el-divider class="line" direction="vertical"></el-divider>
                  </div>
                </td>
                <td class="ft10">{{contractInfo.phone}}</td>
              </tr>
            </table>
          </div>
          <div v-if="isUserInfo" style="width:90%;margin:0 auto;margin-bottom:10px;">
            <common-title title="审批历史" class="mt20 mb20 ft18" />
            <el-table
              :data="ApprovalData"
              stripe
              style="width:100%;margin-left:10px;"
              highlight-current-row
              :cell-style="{fontSize: '14px'}"
              :header-cell-style="{background:'#f3f3f3'}"
            >
              <el-table-column type="index" label="序号">
                <template slot-scope="scope">
                  <span>{{ ApprovalData.length - scope.$index}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="taskDescription" label="审批节点"></el-table-column>
              <el-table-column prop="operationType" label="审批结论">
                <template v-slot="{row}">
                  <span>{{getDictName(row.operationType)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="意见">
                <template v-slot="{row}">
                  <span>{{ getOpintions(row) }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop label="附件">
                <template v-slot="{row}">
                  <span
                    class="pointer upload-hover"
                    v-for="(item,index) in getUpload(row)"
                    v-bind:key="index"
                    style="margin-right: 5px"
                  >
                    <span class="show-hidden" @click="hanldeDown(item)">{{item.approverFileName}}</span>
                  </span>
                </template>
              </el-table-column> -->
              <el-table-column prop="approverName" label="办理人"></el-table-column>
              <el-table-column prop="approvalTime" label="送出时间"></el-table-column>
            </el-table>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import { getContractInfo } from "@/service/common/index";
import { queryAllDict } from "@/service/4A/index";
import { dictSelectList } from "@/service/common";
import { userInfo, getTree } from "@/service/4A";
export default {
  data() {
    return {
      contractId: "",
      contractInfo: {},
      ApprovalData: [],
      pinionsList: [],
      isUserInfo: false,
      ourContractEntity: [], // 我方签约主体
      otherContractEntity: [], // 对方签约主体
      dictVoList: [],
    };
  },
  mounted() {
    this.contractId = this.$route.query.contractId;
    this.getUserInfo();
  },
  methods: {
    async getContractInfo() {
      const { code, data } = await getContractInfo({
        contractId: this.contractId,
      });
      if (code === "000000") {
        this.contractInfo = data;
        this.ApprovalData = data.bpmProcessTaskVoList || [];
        this.pinionsList = data.bpmProcessTaskOpinionsVoList;
        this.getOurAndOtherEntity();
      }
    },
    // 获取我方签约主体以及对方签约主体
    getOurAndOtherEntity() {
      let contractEntity = this.contractInfo.contractEntityList;
      if (contractEntity && contractEntity.length > 0) {
        contractEntity.forEach((ele) => {
          if (ele.entityType === "ENT01") {
            // 我方签约主体
            this.ourContractEntity.push(ele);
          } else if (ele.entityType === "ENT02") {
            // 对方签约主体
            this.otherContractEntity.push(ele);
          }
        });
      }

      // 此刻在给800s来调用打印机
      setTimeout(() => {
        window.print()
      }, 800);
    },
    async getUserInfo() {
      const { code, data } = await userInfo();
      if (code === "000000") {
        this.isUserInfo = true;
        localStorage.setItem("userInfo", JSON.stringify(data));
        this.$store.dispatch("setUserInfo", data);
        this.hasUser = true;
        this.getContractInfo();
        this.dictSelectList();
        this.getTree();
        this.getDictMap("INCOME_EXPE_TYPE"); //常用的字典值
        this.getDictMap("YES_NO"); // 是否无水印
        this.getDictMap("CONTRACT_STATUE"); // 合同状态
        this.getDictMap("SIGN_WAY"); //签订方式
        this.getDictMap("SIGN_ORDER"); //  用印顺序
      }
    },
    /**
     * 用户登录
     */
    async getTree() {
      const { code, data } = await getTree();
      if (code === "000000") {
        this.$store.dispatch("setMenuList", data);
      } else {
      }
    },
    async getDictMap(dictCode) {
      let params = {
        dictCode: dictCode,
      };
      const { code, data } = await queryAllDict(params);
      if (code === "000000") {
        let saveData = {};
        saveData.type = dictCode;
        saveData.data = data;
        this.$store.dispatch("setdictMap", saveData);
      }
    },

    async dictSelectList() {
      const { code, data } = await dictSelectList({
        dictCode: "OPERATION_TYPE",
      });
      if (code === "000000") {
        this.dictVoList = data[0].dictVoList;
      }
    },
    getDictName(code) {
      let name = this.dictVoList.filter((item) => item.dictCode === code);
      if (name.length > 0) {
        return name[0].dictName;
      } else {
        return "";
      }
    },
    getOpintions(row) {
      var arr = []; //审批意见
      this.pinionsList.map((item) => {
        if (item.taskId === row.taskId && item.approverType === "TEXT") {
          arr.push(item);
        }
      });
      return (arr[0] && arr[0].approverOpinions) || "";
    },
    getUpload(row) {
      var arr = []; // 审批附件
      this.pinionsList.map((item) => {
        if (item.taskId === row.taskId && item.approverType === "FILE") {
          arr.push(item);
        }
      });
      return arr;
    },

    hanldeDown(item) {
      const token = this.$Cookie.get("token");
      window.location.href =
        downloadUrl + `/${item.approverFileId}?token=${token}`;
    },
  },
};
</script>
<style lang="less" media="print">
html,
body {
  overflow: auto;
  overflow-x: hidden;
}
.printContractInfo {
  width: 720px;
  font-size: 10px;
  word-wrap: break-word;
  word-break: break-all;
  padding: 0px 10px 0px 10px;
  margin:0 auto;

  .printContractInfoDiv{
    width: 100%;
  }
  .tdTitle {
    width: 100px;
    //   border-right:1px solid red;
  }
  .lineDiv {
    float: right;
    border-right: 1px solid #dce3f2;
    width: 10px;
    height: 10px;
    margin-top: 5px;
    margin-right: 30px;
  }
  .line {
    width: 1px;
    background-color: white;
  }
  .title {
    width: 100%;
    text-align: center;
    font-size: 25px;
    margin-top: 10px;
  }
  .contractInfoDiv {
    width: 100%;
    margin: 0 auto;
  }
}
@media print {
  @page {
    size: auto; /* auto is the initial value */
    margin: 5mm; /* this affects the margin in the printer settings */
  }
  .lineDiv {
    float: right;
    margin-right: 10px;
  }
  .line {
    background-color: #dce3f2;
  }
}
</style>
