<template>
    <el-container>
         <el-header
            style="color:#fff;padding: 0 20px;"
            class="sobute-main-header el_header_flxed flex flex-center-between"
            height="58px"
            >
            <div class="flex flex-center-between">
                <div class="new-logo"></div>
                <p style="color:#f6f6f6; font-size: 14px;">伊利合同</p>
            </div>
            <common-text/>
        </el-header>
        <el-container>
            <el-aside class="aside-content" style="overflow:hidden">
                <div style="height:calc(100vh - 160px)">
                    <vue-scroll>
                        <menu-component/>
                    </vue-scroll>
                </div>
            </el-aside>
            <el-main>
                <div class="main-content-page">
                    <div class="sobute-breadcrumb">
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <template v-for="(item,index) of breadcrumbList">
                                <el-breadcrumb-item
                                    :key="index"
                                    v-if="item.name!==''"
                                    :to="{name:item.name}"
                                >{{ item.title }}
                                </el-breadcrumb-item>
                                <el-breadcrumb-item :key="index" v-else>{{ item.title }}</el-breadcrumb-item>
                            </template>
                        </el-breadcrumb>
                    </div>
                    <div class="sobute-main-view" :style="{height:`calc(100vh - ${setHeight||130}px)`}">
                        <vue-scroll>
                            <div class="cont" v-loading="loading" style="padding-right: 20px;">
                                <router-view></router-view>
                            </div>
                        </vue-scroll>
                    </div>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
/* eslint-disable */
import menuComponent from "@/components/MenuComponent"
import CommonText from '@/components/CommonText'
import {mapState} from 'vuex'
export default {
    components: {
        menuComponent,
        CommonText
    },
    data() {
        return {
            setHeight: 0,
            icon: 'el-icon-s-fold',
            loading: false,
            isCollapse: false,
            hasUser: false
        }
    },
    computed: {
        ...mapState({
            height: state => state.common.height
        })
    },
    watch: {
        $route() {
            this.loading = true;
            this.breadcrumbList = this.$route.meta;
            setTimeout(() => {
                this.$nextTick(() => {
                    this.loading = false;
                });
            }, 700);
        },
        height(val) {
            this.setHeight = val || 100;
        },
    },
    created() {
        this.breadcrumbList = this.$route.meta;
        this.$store.dispatch('setUserInfo', JSON.parse(localStorage.getItem("userInfo")||{}));
    }
}
</script>

<style scoped lang="less">
.sobute-main-header {
  background: url("../../assets/img/balog.png") right no-repeat #414E69;
}

.sobute-home-header {
  background: url("../../assets/img/backlog.png") right no-repeat #414E69;
}

.sobute-main-view {
  overflow: hidden;
}

.aside-content {
  width: 142px !important;
  transition: width 0.3s;
}

.el-aside {
  position: relative;
  z-index: 20;
  background: #414E69;
  height: 100vh;
  /*box-shadow: 2px 0 4px 0 rgba(0, 0, 0, 0.1);*/
}

.aside-content-active {
  width: 71px !important;
  transition: width 0.3s;
}

.new-logo {
  background: url("../../assets/img/logo.png") center no-repeat;
  background-size: contain;
  height: 28px;
  width: 39px;
  margin-right: 8px;
}

.new-logo-home {
  margin-bottom: 12px;
  width: 142px;
}

.main-logo {
  display: flex;
  height: 57px;
  color: #ddd;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  border-bottom: 1px solid rgba(0, 113, 193, 0.2);
}

.aside-top {
  height: 58px;
  display: flex;
  justify-content: center;
}

.main-content {
  background: #0065b3;
  color: #fff;
}

.main-text {
  height: 150px;
  padding-right: 20px;
}

.el-main {
  position: relative;
  background: #f3f3f3;
  padding: 0;
  overflow: hidden;
}

.main-content-page {
  padding: 0 0 24px 24px;
}

.sobute-breadcrumb {
  width: 100%;
  height: 40px;
  top: 58px;
  z-index: 10;
  display: flex;
  align-items: center;
}

.head-portrait {
  position: relative;
  width: 70px;
  height: 70px;
  background: #C0C4CC;
  border-radius: 50%;

  img {
    width: 60px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    border-radius: 50%;
  }
}

.head-name {
  padding-top: 5px;

  span:nth-of-type(1) {
    margin-right: 5px;
  }

  span:nth-of-type(2) {
    opacity: 0.7;
  }
}

.home-left {
  float: left;
  width: 142px;
  text-align: center;
}
</style>
