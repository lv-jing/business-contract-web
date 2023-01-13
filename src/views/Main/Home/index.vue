<template>
  <div class="homeIndex" style="padding: 24px 0;">
    <div class="bg-white">
      <el-card shadow="hover" :body-style="{display:'flex','justify-content': 'space-between'}">
        <!-- Header content -->
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <template v-for="(item,index) of systemList">
              <div
                @click.stop="clickChangeSystem(item)"
                class="swiper-slide"
                :key="index"
                :style="{'background':isPowerOfTwo(index)?'#91C1DD':'#95B7D9'}"
              >
                <div class="show-into_system" @click.stop="intoMainPage(item)">
                  <div class="title-num">
                    <span>{{ item.indexData }}</span>
                    <p>{{ item.indexName }}</p>
                  </div>
                  <div class="img-content">
                    <img :src="item.picUrl" alt />
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="swiper-button-prev">
            <i class="el-icon-arrow-left" style="font-size: 30px"></i>
          </div>
          <div class="swiper-button-next">
            <i class="el-icon-arrow-right" style="font-size: 30px"></i>
          </div>
        </div>
        <div>
          <template>
            <el-popover placement="bottom" trigger="click">
              <img src="@/assets/img/yiliLogo.gif" slot="reference" alt style="height: 85px" />
              <div style="text-align:center;">
                <div>
                  <el-button
                    type="primary"
                    @click="$router.push({name:'toolremind'})"
                    class="buttonPop"
                  >小工具-提醒</el-button>
                </div>
                <div>
                  <el-button
                    type="primary"
                    @click="$router.push({name:'toolwarning'})"
                    class="buttonPop"
                  >小工具-预警</el-button>
                </div>
                <div>
                  <el-button
                    type="primary"
                    @click="$router.push({name:'toolauth'})"
                    class="buttonPop"
                  >小工具-合同传阅</el-button>
                </div>
                <div>
                  <el-button
                    type="primary"
                    @click="$router.push({name:'tooltransfer'})"
                    class="buttonPop"
                  >小工具-合同移交</el-button>
                </div>
              </div>
            </el-popover>
          </template>
        </div>
      </el-card>
    </div>
    <div class="bg-white mt24 pd24">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane name="first">
          <template slot="label">待办事项({{ firstNum }})</template>
          <fist-pane v-on:fist-num="getFistNum" />
        </el-tab-pane>
        <el-tab-pane name="second">
          <template slot="label">已办事项({{ secondNum }})</template>
          <second-pane v-on:second-num="getSecondNum" />
        </el-tab-pane>
        <el-tab-pane name="third">
          <template slot="label">办结事项({{ thirdNum }})</template>
          <third-pane v-on:third-num="getThirdNum" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import fistPane from "./pan";
import secondPane from "./panTwo";
import thirdPane from "./panthre";
import reportApi from '@/service/report/index'

export default {
  components: {
    fistPane,
    secondPane,
    thirdPane,
  },
  data() {
    return {
      activeName: "first",
      firstNum: 0,
      secondNum: 0,
      thirdNum: 0,
      value1: "",
      bk: ["#91C1DD", "#95B7D9"],
      systemList: [
        {
          indexName: "审批中合同数量",
          indexData: 0,
        },
        {
          indexName: "审批中合同数量",
          indexData: 0,
        },
        {
          indexName: "审批中合同数量",
          indexData: 0,
        },
        {
          indexName: "审批中合同数量",
          indexData: 0,
        },
        {
          indexName: "审批中合同数量",
          indexData: 0,
        },
        {
          indexName: "审批中合同数量",
          indexData: 0,
        },
      ],
      reportRouter:'',
      firstData: [
        {
          projectNumber: 1,
        },
      ],
      secondData: [
        {
          projectNumber: 1,
        },
      ],
      thirdData: [
        {
          projectNumber: 1,
        },
      ],
    };
  },
  mounted() {
    this.value1 = new Date();
    setTimeout(() => {
      new window.Swiper(".swiper-container", {
        slidesPerView: 4,
        spaceBetween: 25, //卡片之间间距
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
      this.queryHomeContractReport()
    }, 200);
  },
  methods: {
    async queryHomeContractReport(){
      let params= {}
      const{code,data} = await reportApi.queryHomeContractReport(params);
      if(code === '000000'){
        console.log(data,'----')
        this.systemList = data.data
        this.reportRouter = data.roleEnum
        if(this.systemList.length>0){
          this.systemList.forEach((ele,index)=>{
            ele.picUrl = require('@/assets/img/index'+index+'.png')
          })
        }
      }
    },
    getFistNum(val) {
      console.log(val);
      this.firstNum = val;
    },
    getSecondNum(val) {
      this.secondNum = val;
    },
    getThirdNum(val) {
      this.thirdNum = val;
    },
    isPowerOfTwo(n) {
      return /^\d*[02468]$/.test(n);
    },
    /**
     * 点击切换系统
     */
    clickChangeSystem(item) {
      let params = {
        'APPROVER':'approver',
        "DEPT_MANAGER":"deptLeader",
        "MANAGER":'employee',
        "LAWYER_MAN":'lawyer',
        "LAWYER_MANAGER":'lawyerManager',
        "GROUP_CHARGE_LEADER":'leader',
        "PRINTER":'sealManager',
        "UNIT_MANAGER":'unitLeader'
      }
       this.$router.push({name:params[this.reportRouter]})
    },
    /**
     * 点击切换系统
     */
    intoMainPage(item) {
      let params = {
        'APPROVER':'approver',
        "DEPT_MANAGER":"deptLeader",
        "MANAGER":'employee',
        "LAWYER_MAN":'lawyer',
        "LAWYER_MANAGER":'lawyerManager',
        "GROUP_CHARGE_LEADER":'leader',
        "PRINTER":'sealManager',
        "UNIT_MANAGER":'unitLeader'
      }
       this.$router.push({name:params[this.reportRouter]})
    },
    handleClick() {},
  },
};
</script>

<style lang="less" scoped>
.swiper-container {
  width: 86%;
  padding: 0 3%;
}

.swiper-slide {
  cursor: pointer;
  border-radius: 4px;
}

.img-content {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: #ffffff;

  img {
    width: 62px;
  }
}

.show-into_system {
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 14px;
  padding: 13px 24px;
  .title-num {

    span {
      font-size: 28px;
    }
  }
}
.el-popover {
  min-width: 100px;
}
.buttonPop {
  margin-top: 5px;
  width: 95%;
  font-size: 12px;
  background-color: #9cb7d6;
  border: 1px solid #9cb7d6;
}
</style>
