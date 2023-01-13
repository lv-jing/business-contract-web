import KGBrowser from '../assets/iweboffice/KGBrowser'

const KGBrowserObj = new KGBrowser();

// 用于金格跳转
export function OpenKgWindow(data) {
  let url = window.location.href//.replace('http:/', '')
  //let url1 = url.replace('https:/', '')

  let url2 = window.location.href.substring(0, url.indexOf("#") + 1)
  // console.log(url2, "url2")
  url2 = url2.replace('index.html','index1.html')
  // console.log(url2, "url2第二次")
  let urlopen = url2 + '/iWebOffice' + data
  window.open(urlopen)
  // KGBrowserObj.openWindow(urlopen, '$skin=1$tabshow=1', false);
}

/**
 *  生成随机数
 * @param min 最小
 * @param max 最大
 * @returns {*}
 */
export function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @description [viewFile 查看文件]
 * @author  ZouMiao
 * @param {String} url [文件地址]
 * @returns {Null} [没有返回]
 */
export const viewFile = function (url) {
  let onlineViewType = ['doc', 'docx', 'xls', 'xlsx', 'xlsm', 'ppt', 'pptx']
  let fileTypeName = url.substring(url.lastIndexOf('.') + 1, url.length).split('?')[0]
  let isWord = onlineViewType.find((type) => type === fileTypeName)
  if (isWord) {
    url = 'http://view.officeapps.live.com/op/view.aspx?src=' + url
  }
  window.open(url, '_blank')
}

/**
 *  下拉框，多选框，单选框 ，数据组装
 * @param {Array} arr  原始数组
 * @param {Array} transform 需要转换的字符，
 * @param {boolean} isSplicing  是否需要转换
 * @param {char} symbol  需要转换的符号
 */
export function transformValueAndLabel(arr, transform, isSplicing = true, symbol = '⭐') {

  return new Promise((resolve) => {
    const newArr = arr.map(item => {
      let str = ''
      for (let i of transform) {
        str += symbol + item[i]
      }
      return {
        value: isSplicing ? `${str.substr(1)}` : ((item[transform[1]] && item[transform[1]].toString()) || 'null'),
        label: (item[transform[0]] && item[transform[0]].toString()) || 'null'
      }
    })
    resolve(newArr)
  })

}

/**
 *
 * @param {*} options 下拉框元数据
 * @param {*} str 带有星的字符串
 * @param {*} arr  需要转换的key
 */
export function selectNotDataOption(options, str, arr = ["label", "value"]) {
  if (!Array.isArray(options)) return;
  if (Array.isArray(str)) {
    str.map(it => {
      optionsData(options, it, arr)
    })
  } else {
    optionsData(options, str, arr)
  }
  return options;

}

/**
 *
 * @param {*} str 字符串
 * @param {*} symbol 符号
 * @param {*} arr  需要转成对象的key
 */
export function decomposeStringToJson(str, arr, symbol = '⭐') {
  if (str) {
    let a = str.split(symbol);
    var obj = {};
    a.map((item, index) => {
      obj[arr[index]] = item
    })
  } else {
    var obj = {};
    arr.map(item => {
      obj[item] = ''
    })
  }
  return obj

}

/**
 *
 * @param {*} url 下载地址
 * @param {*} params 参数
 * @param {*} filename 文件名称
 */
export function exportFile(url, params, filename) {

  let param = Qs.stringify(params)
  let Authorization = Cookies.get('Authorization');
  let token = Cookies.get('token');
  var xmlResquest = new XMLHttpRequest();
  xmlResquest.open("GET", url, true);
  xmlResquest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlResquest.setRequestHeader("Authorization", Authorization);
  xmlResquest.setRequestHeader("token", token);
  xmlResquest.responseType = "blob";
  //下载成功触发的事件
  xmlResquest.onload = function (oEvent) {
    var content = xmlResquest.response;
    var elink = document.createElement('a');
    elink.download = filename;
    elink.style.display = 'none';
    var blob = new Blob([content]);
    // 兼容ie
    if (window.navigator.msSaveBlob) {
      try {
        window.navigator.msSaveBlob(blob, url)
      } catch (e) {
        console.log(e);
      }
    } else {
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      document.body.removeChild(elink);
    }

  };
  xmlResquest.send();
}

/**
 * 格式化秒
 * @param int  value 总秒数
 * @return string result 格式化后的字符串
 */
export function formatSeconds(value) {
  var theTime = parseInt(value);// 需要转换的时间秒
  var theTime1 = 0;// 分
  var theTime2 = 0;// 小时
  var theTime3 = 0;// 天
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
      if (theTime2 > 24) {
        //大于24小时
        theTime3 = parseInt(theTime2 / 24);
        theTime2 = parseInt(theTime2 % 24);
      }
    }
  }
  var result = '';
  if (theTime > 0) {
    result = "" + parseInt(theTime) + "秒";
  }
  if (theTime1 > 0) {
    result = "" + parseInt(theTime1) + "分" + result;
  }
  if (theTime2 > 0) {
    result = "" + parseInt(theTime2) + "小时" + result;
  }
  if (theTime3 > 0) {
    result = "" + parseInt(theTime3) + "天" + result;
  }
  return result;
}
// 待办
export const projectType = {
  'CONTRACT_APPROVAL': {name: 'singleContract', type: 'approval'}, // 合同
  'BACTH_CONTRACT_APPROVAL': {name: 'singleContracts', type: 'approval'}, // 批量合同
  'ECM_CONTRACT_AUTH_SIGLE_READ': {name: 'singleContract', type: 'detail'}, // 单个合同审批授权
  'ECM_CONTRACT_AUTH_BATCH_READ': {name: 'singleContracts', type: 'detail'}, // 批量合同审批授权
  'CONTRACT_APPROVAL_CHANGE': {name: 'changevoid', type: 'approval'}, // 合同变更
  'CONTRACT_APPROVAL_TERMINATION_RELEASE': {name: 'changevoid', type: 'approval'}, // 合同废止
  'CONTRACT_APPROVAL_CONTINUE': {name: 'changevoid', type: 'approval'}, // 合同续签
  'TEMPLATE_APPROVAL': {name: 'managetemplate', type: 'approval'},// 范本
  'TEMPLATE_APPROVAL_OPT': {name: 'managetemplate', type: 'approval'},// 范本优化
  'TEMPLATE_APPROVAL_DISABLE': {name: 'managetemplate', type: 'approval'},// 范本作废
  'TERMS_APPROVAL': {name: 'terms', type: 'approval'},// 条款
  'TERMS_APPROVAL_DISABLE': {name: 'terms', type: 'approval'},// 条款作废
  'TERMS_APPROVAL_UPDATE': {name: 'terms', type: 'approvalUpdate'}, //条款更新
  "SIGN_APPROVAL": {name: 'confirmation', type: 'auditing'},// 签署
  "APPLY_PRINT_APPROVAL": {name: "applyseal", "type": "auditing"}, // 用印申请
  "PRINT_APPROVAL": {name: "printdownload", "type": "auditing"},// 打印下载
  "NO_WATER_APPROVAL": {name:'watermarkapplication',type:'approval'},// 无水印申请
  "OFFLINE_SEAL_APPROVAL": {name: "confirmation", "type": "approval"}, //  线下用印补盖
  "ECM_REMIND_READ": {name: "toolremind", "type": "detail"},// 提醒
  "CONTRACT_APPROVAL_DISABLE":{name:"contractrecall",type:'approval'}, //流程作废
  "ECM_CONTRACT_DISABLE_READ":{name:"contractrecall",type:'detail'}, //合同撤回待阅
  "TRANSFER_APPROVAL":{name:"tooltransfer",type:'approval'}, //合同移交
  "ECM_CONTRACT_RENEW_READ":{name:"singleContract",type:'detail'}, //单个合同续签提醒
  "ECM_CONTRACT_CIRCULATE":{name:"singleContract",type:'detail',ispdf:'pdf'}, //传阅 续签提醒
  "ECM_WARNING_READ":{name:"toolwarning",type:'detail'}, // 预警提醒
  "CONTRACT_APPROVAL_ARCHIVE":{name:"contractarchive",type:'approval'}, // 合同归档
  "ECM_CONTRACT_AUTH_READ":{name:"authorizedapproval",type:'detail'}, // 授权审批

}
// 已办 办结
export const projectTypes = {
  'CONTRACT_APPROVAL': {name: "singleContract", "type": "detail"}, // 合同
  'BACTH_CONTRACT_APPROVAL': {name: "singleContracts", "type": "detail"}, // 批量合同
  'ECM_CONTRACT_AUTH_SIGLE_READ': {name: 'singleContract', type: 'detail'}, // 单个合同审批授权
  'ECM_CONTRACT_AUTH_BATCH_READ': {name: 'singleContracts', type: 'detail'}, // 批量合同审批授权
  'CONTRACT_APPROVAL_CHANGE': {name: "changevoid", "type": "detail"}, // 合同变更
  'CONTRACT_APPROVAL_TERMINATION_RELEASE': {name: "changevoid", "type": "detail"}, // 合同废止
  'CONTRACT_APPROVAL_CONTINUE': {name: "changevoid", "type": "detail"}, // 合同续签
  'TEMPLATE_APPROVAL': {name: "managetemplate", "type": "detail"},// 范本
  'TEMPLATE_APPROVAL_OPT': {name: "managetemplate", "type": "detail"},// 范本优化
  'TEMPLATE_APPROVAL_DISABLE': {name: "managetemplate", "type": "detail"},// 范本作废
  'TERMS_APPROVAL': {name: "terms", "type": "detail"},// 条款
  'TERMS_APPROVAL_DISABLE': {name: "terms", "type": "detail"},// 条款作废
  'TERMS_APPROVAL_UPDATE': {name: "terms", "type": "updateDetail"}, //条款更新
  "SIGN_APPROVAL": {name: 'confirmation', type: 'detail'},// 签署
  "APPLY_PRINT_APPROVAL": {name: "applyseal", "type": "auditing"}, // 用印申请
  "PRINT_APPROVAL": {name: "printdownload", "type": "auditing"},// 打印下载
  "ECM_REMIND_READ": {name: "toolremind", "type": "detail"},// 提醒
  "NO_WATER_APPROVAL": {name:'watermarkapplication',type:'detail'},// 无水印申请
  "OFFLINE_SEAL_APPROVAL": {name: "confirmation", "type": "underLineDetail"}, //  线下用印补盖
  "CONTRACT_APPROVAL_DISABLE":{name:"contractrecall",type:'detail'}, //流程作废
  "ECM_CONTRACT_DISABLE_READ":{name:"contractrecall",type:'detail'},//合同撤回待阅
  "TRANSFER_APPROVAL":{name:"tooltransfer",type:'detail'}, //合同移交
  "ECM_CONTRACT_RENEW_READ":{name:"singleContract",type:'detail'}, //单个合同续签提醒
  "ECM_CONTRACT_CIRCULATE":{name:"singleContract",type:'detail',ispdf:'pdf'}, //传阅 已办/办结提醒
  "ECM_WARNING_READ":{name:"toolwarning",type:'detail'}, // 预警提醒
  "CONTRACT_APPROVAL_ARCHIVE":{name:"contractarchive",type:'detail'}, // 合同归档
  "ECM_CONTRACT_AUTH_READ":{name:"authorizedapproval",type:'detail'}, // 授权审批

}

export const objectTypeCode = {
  'CONTRACT_APPROVAL_CHANGE': 'CON002', // 合同变更
  'CONTRACT_APPROVAL_TERMINATION_RELEASE': 'CON003', // 合同废止
  'CONTRACT_APPROVAL_CONTINUE': 'CON004', // 合同续签
}

export const approvalTypeCode = {
  'CON002': 'CONTRACT_APPROVAL_CHANGE',
  'CON003': 'CONTRACT_APPROVAL_TERMINATION_RELEASE',
  'CON004': 'CONTRACT_APPROVAL_CONTINUE',
}
export const draftTypeObj = {
  'CON001': '新建合同',
  'CON002': '变更补充',
  'CON003': '终止解除',
  'CON004': '合同续签',
}
export function setTableData(data){
   data.map(item=>{
    item.remindPerson = item.remindPersonObj.userName
    item.remindPersonId = item.remindPersonObj.userId
  })
  return data
}

export function getTableData(data){
  data.map(item=>{
    item.remindPersonObj = {
      userName:item.remindPerson,
      userId:item.remindPersonId
    }
  })
  return data
}

// 分解数据
export function getText(name){
  var lastIndex = name.lastIndexOf(",");
  if (lastIndex > -1) {
    return name.substring(0, lastIndex) + name.substring(lastIndex + 1, name.length);
  }
}

export function getNowTime() {
  var now = new Date();
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth(); //得到月份
  var date = now.getDate(); //得到日期
  var hour = formatTwoDigits(now.getHours());
  var minutes = formatTwoDigits(now.getMinutes());
  var seconds = formatTwoDigits(now.getSeconds());
  var Hour =` ${hour}:${minutes}:${seconds}`; //默认时分秒 如果传给后台的格式为年月日时分秒，就需要加这个，如若不需要，此行可忽略
  month = month + 1;
  month = month.toString().padStart(2, "0");
  date = date.toString().padStart(2, "0");
  return `${year}-${month}-${date}${Hour}`;
}

function formatTwoDigits(s) {
  if (s < 10)
    return "0" + s;
  else
    return s;
}
// 合同发起分解个个类型的附件
export function setUplod(val, name,ispdf) {
  const list = []
  if (val && val.length > 0) {
    if(ispdf==='pdf'){
      let flag = val.filter(item=> item.fileStatus==='STA004'&&item.businessType === 'template')
      if(flag.length>0){
        list.push(...flag)
      } else {
        let flag = val.filter(item=> item.fileStatus==='STA005'&&item.businessType === 'template')
        if(flag.length>0){
          list.push(...flag)
        } else {
          let flag = val.filter(item=> item.fileStatus==='STA003'&&item.businessType === 'template')
          if(flag.length>0){
            list.push(...flag)
          } else {
            let flag = val.filter(item=> item.fileStatus==='STA002'&&item.businessType === 'template')
            if(flag.length>0){
              list.push(...flag)
            } else {
              let flag = val.filter(item=> item.fileStatus==='STA001'&&item.businessType === 'template')
              if(flag.length>0){
                list.push(...flag)
              }
            }
          }
        }
      }
    } else {
      val.forEach(item => {
        if (item.businessType === name) {
          if (item.businessType !== 'template') {
            list.push({
              ...item
            })
          } else {
            if (item.fileType === 'doc') {
              list.push({
                ...item
              })
            }
          }
        }
      })
    }
    return list;
  } else {
    return []
  }
}
export function clearInput (e) {
  console.log(e);
  let key = e.key;
  if (key === 'e' || key === 'E' || key === '+' || key === '-') {
    e.returnValue = false;
    return false;
  }
  return true;
}
