<template>
  <div class="bg-white">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix flex flex-center-between">
        <b>发起场景选择</b>
        <el-button @click="handleTotemplates" icon="el-icon-document-add">从我的常用范本发起</el-button>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
        <common-title title="发起方式"/>
        <div class="form-bg">
          <el-row :gutter="24">
            <el-col :span="24" class="setradio">
              <el-form-item label="" prop="radio1">
                <el-radio-group v-model="ruleForm.radio1" @change="radChange">
                  <el-radio label="CON001" border style="height: auto">
                    <radioBox :url="Url1" :src="src1" title="新建合同"/>
                  </el-radio>
                  <el-radio label="CON002" border style="height: auto">
                    <radioBox :url="Url2" :src="src2" title="变更补充" text="合同签订后有对有关条款进行变更或补充"/>
                  </el-radio>
                  <el-radio label="CON003" border style="height: auto;">
                    <radioBox :url="Url3" :src="src3" title="终止解除" text="合同签订后对合同进行终止或解除"/>
                  </el-radio>
                  <el-radio label="CON004" border style="height: auto;">
                    <radioBox :url="Url4" :src="src4" title="续签" text="合同（本系统审批的）期满或即将期满，需要继续签订与原合同业务相同的合同"/>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-show="ruleForm.radio1==='CON001'">
          <common-title title="发起类型"/>
          <div class="form-bg">
            <el-row :gutter="24">
              <el-col :span="24" class="setradio">
                <el-form-item label="" prop="radio2">
                  <el-radio-group v-model="ruleForm.radio2" @change="radChangeTwo">
                    <el-radio :label="1" border style="height: auto">
                      <radioBox :url="Url5" :src="src5" title="单个合同" text=""/>
                    </el-radio>
                    <el-radio :label="2" border style="height: auto">
                      <radioBox :url="Url6" :src="src6" title="批量合同" text="目前只适用于经销商销售合同和冷链投放协议"/>
                    </el-radio>
                    <el-radio style="opacity: 0"></el-radio>
                    <el-radio style="opacity: 0"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div
          v-show="(ruleForm.radio2===1 && ruleForm.radio1==='CON001')">
          <common-title title="收支类型"/>
          <div class="form-bg">
            <el-row :gutter="24">
              <el-col :span="24" class="setradio">
                <el-form-item label="" prop="dictCode">
                  <el-radio-group v-model="ruleForm.dictCode">
                    <el-radio label="IET002" border style="height: auto">
                      <radioBox :url="Url7" :src="src7" title="支出类" text="我方付款、资金流出"/>
                    </el-radio>
                    <el-radio label="IET001" border style="height: auto">
                      <radioBox :url="Url8" :src="src8" title="收入类" text="我方收款、资金流入"/>
                    </el-radio>
                    <el-radio label="IET003" border style="height: auto">
                      <radioBox :url="Url9" :src="src9" title="有收有支类" text="既有我方付款、也有我方收款"/>
                    </el-radio>
                    <el-radio label="IET004" border style="height: auto">
                      <radioBox :url="Url10" :src="src10" title="无收无支类" text="无资金流动"/>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-row :gutter="24">
          <el-col :span="24" style="text-align: right">
            <el-button
              v-if="['CON002','CON003','CON004'].includes(ruleForm.radio1)||
              (ruleForm.radio1==='CON001'&&ruleForm.radio2===2)||
              (['IET001','IET002','IET003','IET004'].includes(ruleForm.dictCode)&&ruleForm.radio2===1)"
              type="primary" @click="handleDetermine"
              icon="iconfont sbt_add">下一步
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import {mapState} from "vuex"

export default {
  data() {
    return {
      Url1: require('@/assets/img/xjbj.png'),
      src1: require('@/assets/img/xj.png'),
      Url2: require('@/assets/img/bgbj.png'),
      src2: require('@/assets/img/bg.png'),
      Url3: require('@/assets/img/zzbj.png'),
      src3: require('@/assets/img/zz.png'),
      Url4: require('@/assets/img/xqbj.png'),
      src4: require('@/assets/img/xq.png'),
      Url5: require('@/assets/img/dgbj.png'),
      src5: require('@/assets/img/dg.png'),
      Url6: require('@/assets/img/plbj.png'),
      src6: require('@/assets/img/pl.png'),
      Url7: require('@/assets/img/zcbj.png'),
      src7: require('@/assets/img/zc.png'),
      Url8: require('@/assets/img/srbj.png'),
      src8: require('@/assets/img/sr.png'),
      Url9: require('@/assets/img/ysyzbj.png'),
      src9: require('@/assets/img/ysyz.png'),
      Url10: require('@/assets/img/wswzbj.png'),
      src10: require('@/assets/img/wswz.png'),
      ruleForm: {
        radio1: '',
        radio2: '',
        dictCode: '',
      }
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo
    })
  },
  watch: {
    userInfo(val) {
    },
  },
  methods: {
    /**
     *选择发起方式
     */
    radChange() {
      this.ruleForm.radio2 = ''
      this.ruleForm.dictCode = ''
    },
    /**
     * 选择发起类型
     */
    radChangeTwo() {
      this.ruleForm.dictCode = ''
    },
    /**
     * 确定
     */
    handleDetermine() {
      if (this.ruleForm.radio1 === 'CON001' && this.ruleForm.radio2 === 1 && this.ruleForm.dictCode) {
        this.$router.push({
          name: 'singleContract',
          query: {type: 'add', dictCode: this.ruleForm.dictCode}
        })
      } else if (this.ruleForm.radio2 === 2) {
        this.$router.push({name: 'singleContracts'})
      } else if (this.ruleForm.radio1 !== 'CON001') {
        this.$router.push({
          name: 'changevoid',
          query: {type: 'add', draftTypeCode: this.ruleForm.radio1}
        })
      }
    },
    /**
     * 发起常用范本
     */
    handleTotemplates() {
      this.$router.push({name: 'commontemplates'})
    }
  }
};
</script>

<style lang="less" scoped>
.radio-cont {
  background-repeat: no-repeat !important;
  background-position: right 0 !important;
}
</style>
