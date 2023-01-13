<template>
    <div class="mt20 flex flex-center-end">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="list.pageNo"
            :page-sizes="[5,10, 20, 30, 40]"
            :page-size="list.pageSize"
            :layout=layout
            :total="list.total"
        ></el-pagination>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: "commonPagination",
    props: {
        list: {
            type: Object,
            default: () => {
            }
        },
        layout: {
            type: String,
            default: () => 'total, sizes, prev, pager, next, jumper'
        }
    },

    methods: {
        handleSizeChange(val) {
            console.log(val);
            this.$emit("handler-currentPage", {
                pageSize: val,
                currentPage: 1
            });
        },
        handleCurrentChange(val) {
            console.log(val);
            this.$emit("handler-currentPage", {
                pageSize: this.list.pageSize,
                currentPage: val
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
