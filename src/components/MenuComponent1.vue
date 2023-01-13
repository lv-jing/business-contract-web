<template>
    <el-menu
        class="el-menu-vertical-demo"
        :collapse="true"
        :default-active="defaultKey"
        :router="true"
        :unique-opened="true"
        text-color="#fff"
        background-color="#414E69"
        active-text-color="#fff"
        :default-openeds="openeds"
    >
        <template v-for="item of menuList">
            <el-submenu
                v-if="item.children && item.children.length>0 && item.name!=='home'"
                :key="item.resourceId"
                :index="item.resourceId"
            >
                <template slot="title">
                    <i class="el-icon-s-home" style="color:#fff;"></i>
                    <!--                    <i :class="[item.icon]" :style="{color:item.color}"></i>-->
                    <span slot="title" class="title-size">{{ item.resourceName }}</span>
                </template>
                <template v-for="subItem of item.children">
                    <menu-items :key="subItem.resourceId" :item="subItem"></menu-items>
                </template>
            </el-submenu>
            <el-menu-item
                v-if="item.name==='home'"
                :key="item.name"
                :index="item.name"
                :route="item"
            >
                <i class="el-icon-s-home" style="color:#fff;"></i>
<!--                <i :class="[item.icon]" :style="{color:item.color}"></i>-->
                <span class="title-size">{{ item.title }}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<style scoped>
</style>
<script>
/* eslint-disable */
// import menuList from '@/router/index';
import menuItems from "./NavComponent.vue";
import {mapState} from 'vuex'

export default {
    props: {
        isCollapse: {
            type: Boolean,
            default: () => false
        }
    },
    components: {
        menuItems
    },
    computed: {
        defaultKey() {
            return this.$route.name;
        },
        ...mapState({
            menuList: state => state.common.menuList
        })
    },
    data() {
        return {
            openeds: [],
        };
    },
};
</script>

<style lang="less">
.title-size {
    font-weight: 600;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 170px;
}

.horizontal-collapse-transition {
    transition: width 0.3s;
}

.el-menu {
    border: 0;
    color: red;
}
</style>
