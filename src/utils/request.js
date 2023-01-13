import axios from 'axios'
import Vue from 'vue'
import Cookies from "js-cookie";
import md5 from 'js-md5';
import {rand} from '@/utils/tools'
import store from '@/store'
import router from "@/router"
// // 接口白名单
// const whiteList = ['/userLogin']
// const isInWhiteList = function(url) {
//     var flag = false
//     whiteList.forEach(function(e, i) {
//         if (url.indexOf(e) >= 0) {
//             flag = true
//         }
//     })
//     return flag
// }
const v = new Vue();
let service = axios.create({
  url: '',
  baseURL: process.env.VUE_APP_API_URL,
  data: {},
  method: 'post',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  dataType: "json",
  withCredentials: true,
  responseType: 'json',
  timeout: 1000000
});

// 获取URL的参数
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}

// 请求拦截
service.interceptors.request.use(function (config) {
  // 请求头需要传的参数
  if (config.method === 'get') {
    config.url = config.url.indexOf('?') > 0 ? config.url + '&_=' + new Date().getTime() : config.url + '?_=' + new Date().getTime();
  }
  let token = Cookies.get('token');
  if (!token) {
    let url = window.location.href
    let tempArr = url.split('token=')
    if (tempArr.length >= 2) {
      token = tempArr[1].split('&')[0]
    }
  }
  const userId = store.state.common.userInfo && store.state.common.userInfo.userId;
  const timestamp = new Date().getTime();
  const nonce = rand(1000, 9999);
  config.headers = {
    Authorization: Cookies.get('Authorization') || '',
    token: token,
    signature: md5(userId + token + nonce + timestamp + ''),
    nonce: nonce,
    timestamp: timestamp,
    'Content-Type': 'application/json;charset=UTF-8'
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 响应拦截
service.interceptors.response.use(
  function (response) {
    const {data, code} = response;
    if (data.code !== '000000') {
      v.$message({
        type: 'error',
        message: data.mesg
      });
      if (data.code === '999999') {
        router.replace('/')
      }
    }
    return response.data
  },
  function (error) {
    v.$message({
      type: 'error',
      message: '服务器异常'
    })
    // router.replace({name: 'login'});
    return Promise.reject(error)
  }
)

export default service
