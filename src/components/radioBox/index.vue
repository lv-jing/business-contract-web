<template>
  <div class="radio-cont" :style="{background: 'url(' + url + ')'}">
    <div class="radio-img">
      <img :src="src" alt="">
    </div>
    <div class="radio-rig">
      <span>{{ title }}</span>
      <p class="hind">{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
name: "index",
  props:{
    url:{
      type:String,
      default:''
    },
    src:{
      type:String,
      default:''
    },
    title:'',
    text:''
  }
}
</script>

<style scoped>

</style>
