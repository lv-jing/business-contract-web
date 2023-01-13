import Vue from 'vue'
import VueRouter from 'vue-router'
import Routers from './router'
import SystemsRuter from './systemManager'
import ReportRuter from './report'
import Sso from './seeo'

Vue.use(VueRouter)

/* 解决重复点击菜单报错 */
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const Login = resolve => require(['@/views/Login/Login'], resolve);
const loginSSO = resolve => require(['@/views/Login/loginSSO'], resolve);
const delerLogin =  resolve => require(['@/views/ssoLogin/dealerLogin'], resolve);
const vendorLogin = resolve => require(['@/views/ssoLogin/vendorLogin'], resolve);
const Main = resolve => require(['@/views/Main/index'], resolve);
const contractPrintForm = resolve => require(['@/views/Main/contractSigning/ContractApprovalForm.vue'], resolve);

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/loginSSO',
        name: 'loginSSO',
        component: loginSSO
    },
    {
        path: '/delerLogin',
        name: 'delerLogin',
        component: delerLogin
    },
    {
        path: '/vendorLogin',
        name: 'vendorLogin',
        component: vendorLogin
    },
    {
        path: '/main',
        name: 'main',
        component: Main,
        redirect: {
            name: 'home'
        },
        children:
            [
                ...Routers,
                ...SystemsRuter,
                ...ReportRuter
            ]
    },
    ...Sso,
    {
        path: '/iWebOffice',
        name: 'iWebOffice',
        component: resolve => require(['@/views/iwebOffice/iwebofficePage'], resolve),
    },
    {
        path: '/contractPrintForm',
        name: 'contractPrintForm',
        component: contractPrintForm
    },
    {
        path: '**',
        component: resolve => require(['@/views/Error'], resolve),
    }
]

const router = new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
})
export default router
