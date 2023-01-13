<template>
  <div class="title-content">
    <div class="title-icon"></div>
    <div class="text-color-333">{{ title }}</div>
<!--    <el-popover-->
<!--      v-if="content"-->
<!--      placement="right"-->
<!--      width="200"-->
<!--      trigger="manual"-->
<!--      :content="content"-->
<!--      v-model="bottomShow">-->
<!--      <span slot="reference"></span>-->
<!--    </el-popover>-->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "setTitle",
  props: {
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
  },
  data(){
    return{
      bottomShow: false
    }
  },
  // mounted() {
  //   setTimeout(()=>{
  //     this.bottomShow = true
  //   },100)
  // }
};
</script>

<style scoped lang="less">
.title-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;
  height: 32px;
}

.title-icon {
  width: 2px;
  height: 12px;
  border-radius: 1px;
  margin-right: 4px;
  background: #2393F7;
}
</style>
