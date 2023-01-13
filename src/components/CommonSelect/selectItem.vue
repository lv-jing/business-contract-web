<template>
    <el-select
        v-model="optionVal"
        :multiple="multiple"
        :filterable="filterable"
        :collapse-tags="collapseTags"
        :multiple-limit="multipleLimit"
        :remote="remote"
        :disabled="isDisabled"
        :placeholder="placeholder"
        :remote-method="getDictSelectList"
        @change="onChange"
        :clearable="clearable"
        class="w-100"
    >
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item"
        ></el-option>
    </el-select>
</template>

<script>
/*eslint-disable*/
import {dictSelectList} from "@/service/common"
import { transformValueAndLabel,selectNotDataOption } from "@/utils/tools";
export default {
    name: "common-auto",
    data() {
        return {
            options: [],
            optionVal : this.value,
            isDisabled: this.disabled
        };
    },
    props: {
        dictCode: {
            type: String,
            default: () => ''
        },
        transform: { type: Array, default: () => ["dictName", "dictCode"] },
        isSplicing: { type: Boolean, default: () => false },
        placeholder: {type: String, default: () => "请选择"},
        multiple: {type: Boolean, default: () => false},
        collapseTags: {type: Boolean, default: () => false},
        disabled: {type: Boolean, default: () => false},
        value: {type: [Array, Object], default: () => [] || {}}, // 不多选的时候type为String
        field: String,
        multipleLimit: {type: Number, default: () => 0},
        type: {type: String, default: () => ''}, // 内部外部
        filterable: {type: Boolean, default: () => false},
        remote: {type: Boolean, default: () => false},
        clearable: {type: Boolean, default: () => false},
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
    created() {
        this.isDisabled = this.disabled;
    },
    mounted() {
        setTimeout(() => {
            this.getDictSelectList(this.dictCode);
        }, 500);

    },
    methods: {
        onChange(e) {
            this.$emit("input", e);
            this.handleChange(e)
        },
        /**
         * 获取数字字典
         */
        async getDictSelectList(dictCode = "") {

            const {code, data} = await dictSelectList({
                dictCode
            });
            if (code === '000000') {
                const options = await transformValueAndLabel(
                    data[0].dictVoList||[],
                    this.transform,
                    this.isSplicing
                );
                this.options = options
            }
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
