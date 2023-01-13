<template>
    <el-menu-item
        :key="item.resourceId"
        :index="item.resourceUri"
        :route="item"
        @click="clickMenuItem(item)"
    >
        <span>{{ item.resourceName }}</span>
    </el-menu-item>
</template>

<style lang="less">
// 选中二级菜单 一级菜单高亮颜色
.el-submenu.is-active {
    background-color: #303a4e !important;
    .el-submenu__title{
        background-color: #303a4e !important;
    }
    .title-size {
        color: #fff;
    }

    i {
        color: #fff !important;
    }
}

// 选中二级菜单 一级菜单高亮颜色
.el-submenu.is-opened {
    background-color: #303a4e !important;
    // 移入二级菜单 一级菜单背景色
    .el-submenu__title{
        background-color: #303a4e !important;
    }
}

// 选中二级菜单高亮颜色
.el-menu-item.is-active {
    background-color: #303a4e !important;

    i {
        color: #fff !important;
    }
}

// 选中菜单或者hover颜色
.el-menu-item:focus, .el-menu-item:hover {
    outline: none;
    background-color: #303a4e !important;
}

</style>

<script>
/* eslint-disable */
export default {
    props: {
        item: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    methods: {
        clickMenuItem(item) {
            this.$router.push({name: item.resourceUri})
        }
    }
};
</script>
