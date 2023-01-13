<template>
    <el-autocomplete
        class="w-100"
        v-model="optionVal"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
        @change="onChange"
    ></el-autocomplete>
</template>

<script>
export default {
    data(){
      return{
          optionVal: this.value,
          isDisabled: this.disabled
      }
    },
    props: {
        restaurants:{
            type: Array,
            default:()=>[]
        },
        placeholder: {type: String, default: () => "请选择"},
        disabled: {type: Boolean, default: () => false},
        value: {type: [Array, String], default: () => [] || ""}, // 不多选的时候type为String
        handleChange:{
            type: Function,
            default:(val)=>{
                return val
            }
        }
    },
    watch: {
        value(n) {
            this.optionVal = n;
        },
        disabled(n) {
            this.isDisabled = n;
        }
    },
    methods: {
        handleSelect(e) {
            this.$emit("input", e.value);
            this.handleChange(e)
        },
        onChange(e) {
            this.$emit("input", e);
            this.handleChange(e)
        },

        querySearchAsync(queryString, cb) {

            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 3000 * Math.random());
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
    }
}
</script>

<style scoped>

</style>
