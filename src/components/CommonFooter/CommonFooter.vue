<template>
  <div class="common-footer-box">
    <div class="common-footer">
      <div style="width: 50%"></div>
      <!-- 根据条件显示按钮 -->
      <div class="button-content">
        <slot name="right">
          <el-button
            v-if="isShow"
            type="primary"
            size="small"
            icon="iconfont sbt_save"
            :loading="loading"
            @click="handleSubmit">保存
          </el-button>
          <el-button
            v-if="!['view','detail'].includes($route.query.type)"
            type="primary"
            size="small"
            icon="iconfont sbt_elected"
            :loading="loading"
            @click="handleNextStep">{{ butTitle }}
          </el-button>
        </slot>
        <slot name="right">
          <el-button
            v-if="isGoShow"
            type="primary"
            :loading="loading"
            @click="handleRefuse">{{ butTitle1 }}
          </el-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import router from "@/router"

export default {
  name: "commonFooter",
  data() {
    return {
      remarks: '',
      score: '',
      loading: false,
      radio: 1
    }
  },
  props: {
    // 提交
    handleSubmit: {
      type: Function,
      default: (val) => {
        return val
      }
    },
    // 下一步
    handleNextStep: {
      type: Function,
      default: (val) => {
        return val
      }
    },
    // 提交按钮文案  针对于成果入库文案
    butTitle: {
      type: String,
      default: () => '下一步'
    },
    // 返回按钮 关闭 特殊按钮
    butTitle1: {
      type: String,
      default: () => '返回'
    },
    // 是否显示保存下一步按钮
    isShow: {
      type: Boolean,
      default: () => true
    },
    // 显示返按钮
    isGoShow: {
       type: Boolean,
      default: () => false
    },
    // 返回
    handleRefuse: {
      type: Function,
      default: (val) => {
        router.go(-1)
        return val
      }
    },
  },
  created() {
    this.$store.dispatch("setHeight", 180);
  },
  methods: {}
}
</script>

<style lang="less">

</style>
