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
            <el-menu-item
                :key="item.name"
                :index="item.name"
                :route="item"
            >
                <i class="el-icon-s-home" style="color:#fff;"></i>
                <span class="title-size">{{item.title}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<style scoped>
</style>
<script>
/* eslint-disable */
// import menuList from '@/router/seeo'
import menuItems from "./NavComponent1.vue";

export default {
    props: {
        isCollapse: {
            type: Boolean,
            default: () => false
        }
    },
    mounted(){
        this.isShow = this.$store.state.common.userInfo.userType ==='VENDOR'
        if(!this.isShow){
            this.menuList= [
                {name:'contractSign',path:'/contractSign',title:'电子签署'}
            ]
        }
    },
    components: {
        menuItems
    },
    computed: {
        defaultKey() {
            return this.$route.name;
        }
    },
    data() {
        return {
            openeds: [],
            menuList: [
                {name:'contractSign',path:'/contractSign',title:'电子签署'},
                {name:'authCompany',path:'/authCompany',title:'资质认证'}
            ],
            isShow:false
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
