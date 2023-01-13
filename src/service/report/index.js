// 报表接口清单
import service from "@/utils/request"
import { rand } from '@/utils/tools'
import Cookies from "js-cookie";
import md5 from "js-md5";
const LOGIN_URL = process.env.VUE_APP_REPORT_URL

const reportApi = {
  querySnapContract(params) {
    return service.post('/report/contract/selectSnapContract', params, { baseURL: LOGIN_URL }).then(res => res);
  },

  exportSnapContract(params, userId, callback) {
    var xmlResquest = new XMLHttpRequest();
    var formData = new FormData();
    const token = Cookies.get('token');
    const timestamp = new Date().getTime();
    const nonce = rand(1000, 9999);
    formData = JSON.stringify(params)
    xmlResquest.open('post', LOGIN_URL + '/report/contract/exportSnapContract', true);
    xmlResquest.setRequestHeader("Content-Type", "application/json");
    xmlResquest.setRequestHeader('Authorization', Cookies.get('Authorization'));
    xmlResquest.setRequestHeader('token', token);
    xmlResquest.setRequestHeader('signature', md5(userId + token + nonce + timestamp + ''));
    xmlResquest.setRequestHeader('nonce', nonce);
    xmlResquest.setRequestHeader('timestamp', timestamp);
    xmlResquest.responseType = 'blob';
    xmlResquest.onload = function (oEvent) {
      var content = xmlResquest.response;
      var filename = "合同信息.xls";
      var elink = document.createElement('a');
      elink.download = filename;
      elink.style.display = 'none';
      var blob = new Blob([content]);
      // 兼容ie
      if (window.navigator.msSaveBlob) {
        try {
          window.navigator.msSaveBlob(blob, filename)
        } catch (e) {
          console.log(e);
        }
      } else {
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      }
      callback && callback()
    };
    xmlResquest.send(formData);
    // return service.post('/report/contract/exportSnapContract', params,{baseURL: LOGIN_URL,responseType:"arraybuffer"}).then(res => res);
  },

  queryContract(params) {
    return service.post('/report/contract/selectContract', params, { baseURL: LOGIN_URL }).then(res => res);
  },

  exportContract(params, userId, callback) {
    var xmlResquest = new XMLHttpRequest();
    var formData = new FormData();
    const token = Cookies.get('token');
    const timestamp = new Date().getTime();
    const nonce = rand(1000, 9999);
    formData = JSON.stringify(params)
    xmlResquest.open('post', LOGIN_URL + '/report/contract/exportContract', true);
    xmlResquest.setRequestHeader("Content-Type", "application/json");
    xmlResquest.setRequestHeader('Authorization', Cookies.get('Authorization'));
    xmlResquest.setRequestHeader('token', token);
    xmlResquest.setRequestHeader('signature', md5(userId + token + nonce + timestamp + ''));
    xmlResquest.setRequestHeader('nonce', nonce);
    xmlResquest.setRequestHeader('timestamp', timestamp);
    xmlResquest.responseType = 'blob';
    xmlResquest.onload = function (oEvent) {
      var content = xmlResquest.response;
      var filename = "合同信息.xls";
      var elink = document.createElement('a');
      elink.download = filename;
      elink.style.display = 'none';
      var blob = new Blob([content]);
      // 兼容ie
      if (window.navigator.msSaveBlob) {
        try {
          window.navigator.msSaveBlob(blob, filename)
        } catch (e) {
          console.log(e);
        }
      } else {
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      }
      callback && callback()
    };
    xmlResquest.send(formData);
    // return service.post('/report/contract/exportContract', params,{baseURL: LOGIN_URL,responseType:"arraybuffer"}).then(res => res);
  },

  /**
   * 查询合同状态报表视图
   * @param {} params
   */
  queryByContractStatusPortrait(params) {
    return service.post('/report/contract/queryByContractStatusPortrait', params, { baseURL: LOGIN_URL }).then(res => res);
  },

  /**
   * 查询按金额报表视图
   * @param {} params
   */
  queryByContractMoneyPortrait(params) {
    return service.post('/report/contract/queryByContractMoneyPortrait', params, { baseURL: LOGIN_URL }).then(res => res);
  },

  /**
   * 查询按后续时效统计视图
   * @param {} params
   */
  queryByContractApprovePortrait(params) {
    return service.post('/report/contract/queryByContractApprovePortrait', params, { baseURL: LOGIN_URL }).then(res => res);
  },
  /**
   * 范本使用情况
   * @param {*} params
   */
  queryByContractSampleUsagePortrait(params) {
    return service.post('/report/contract/queryByContractSampleUsagePortraitPie', params, { baseURL: LOGIN_URL }).then(res => res);
  },
  /**
   * 电子签约情况
   * @param {*} params
   */
  queryByContractElectricSignPortrait(params) {
    return service.post('/report/contract/queryByContractElectricSignPortrait', params, { baseURL: LOGIN_URL }).then(res => res);
  },

  /**
   * 合同类型统计
   */
  queryByContractTypePortrait(params) {
    return service.post('/report/contract/queryByContractTypePortrait', params, { baseURL: LOGIN_URL }).then(res => res);
  },

  /**
   * 盖章情况
   * @param {*} params
   */
  queryByContractPrintStamp(params) {
    return service.post('/report/contract/queryByContractPrintStamp', params, { baseURL: LOGIN_URL }).then(res => res);
  },

  /**
   * 用印顺序情况
   * @param {*} params
   */
  queryByContractPrintOrder(params) {
    return service.post('/report/contract/queryByContractPrintOrder', params, { baseURL: LOGIN_URL }).then(res => res);
  },

  /**
   * 审批时效
   * @param {*} params
   */
  queryByContractApproveCondition(params) {
    return service.post('/report/contract/queryByContractApproveCondition', params, { baseURL: LOGIN_URL }).then(res => res);
  },

  /**
   * 合同总量统计
   * @param {*} params
   */
  queryByContractCountManager(params) {
    return service.post('/report/contract/queryByContractCountManager', params, { baseURL: LOGIN_URL }).then(res => res);
  },
  /**
   * 合同总量统计
   * @param {*} params
   */
  queryBySigleContractCountManager(params) {
    return service.post('/report/contract/queryBySigleContractCountManager', params, { baseURL: LOGIN_URL }).then(res => res);
  },
  /**
* 查询首页报表口径
* @param {*} params
*/
  queryHomeContractReport(params){
    return service.post('/report/contract/queryHomeContractReport', params,{ baseURL: LOGIN_URL }).then(res => res)
  }

}

export default reportApi
