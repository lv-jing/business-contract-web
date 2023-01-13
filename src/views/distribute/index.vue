<template>
  <div></div>
</template>

<script>
import {objectTypeCode, projectType, projectTypes} from "@/utils/tools";
import {getWorklist, setStatus} from "@/service/work";

export default {
  name: "index",
  data(){
    return{
      num:0
    }
  },
  mounted() {
    this.init(this.$route.query.id)
  },
  methods: {
    async init(id) {
      this.setStatus(id)
      const {code, data} = await getWorklist(id, err => {
        this.$router.go(-1)
      }).catch(() => {
        this.$router.go(-1)
      })
      if (code === '000000') {
        // 审阅的时候走这个逻辑
        if(this.num===0&&data.objectTypeCode==='ECM_CONTRACT_CONSULT_FINISH'){
          this.num++;
          this.init(data.opinion)
        } else if (projectType[data.objectTypeCode].name) {
          if ( ['WAIT_FOR_DEAL','SUSPEND','WAIT_FOR_READ'].includes(data.taskStauts)) {
            this.$router.replace({
              name: projectType[data.objectTypeCode].name,
              query: {
                type: projectType[data.objectTypeCode].type,
                id: data.workflowHistoryId,
                taskKey: data.taskKey,
                operationType: data.operationType,
                sourceType: data.attribute2,
                customizeTaskKey: data.attribute1,
                objectTypeCode: data.objectTypeCode,
                modelTitle: data.attribute3,
                taskStauts: data.taskStauts,
                draftTypeCode: objectTypeCode[data.objectTypeCode], //变更 废止 续签
              }
            })
          } else {
            this.$router.replace({
              name: projectTypes[data.objectTypeCode].name,
              query: {
                type: projectTypes[data.objectTypeCode].type,
                id: data.workflowHistoryId,
                draftTypeCode: objectTypeCode[data.objectTypeCode],
                ispdf:projectTypes[data.objectTypeCode].ispdf
              }
            })
          }
        } else {
          this.$router.go(-1)
        }
      } else {
        this.$router.go(-1)
      }
    },
    async setStatus(id) {
      const {code} = await setStatus(id)
    }
  }
}
</script>

<style scoped>

</style>
