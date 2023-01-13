import 'babel-polyfill';
import Vue from 'vue'
import router from './router'
import App from './App'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// 引入公共样式
import 'element-ui/lib/theme-chalk/index.css'
import "@/assets/css/common.less"
import i18n from '@/lang/index';
import store from './store'
import vuescroll from 'vuescroll';
import md5 from 'js-md5';
import Cookie from 'js-cookie'

// 引入公共组件
import './plugins/commonComponents'

Vue.prototype.$echarts = echarts
Vue.prototype.$titleObj={"add":"增加","view":"查看","auditing":"审核","edit":"编辑"};
Vue.use(ElementUI, {size: "small"});
Vue.prototype.$md5 = md5;
Vue.prototype.$Cookie = Cookie;
Vue.prototype.$store = store

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o){
    if (new RegExp("(" + k + ")").test(fmt)) {
fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
}
    }
    return fmt;
}

// 你可以在这里设置全局配置
Vue.use(vuescroll, {
    ops: {
        rail: {
            opacity: "0.2",
            background: "#000",
            border: "1px solid #cecece",
            size: "2px"
        },
        bar: {
            background: "#fff",
            keepShow: false,
            size: "1px",
            minSize: 0.1
        }
    }, // 在这里设置全局默认配置
});

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
