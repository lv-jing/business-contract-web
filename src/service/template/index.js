import service from "@/utils/request"
const TEMPLATE_URL = process.env.VUE_APP_TEMPLATE_URL

// 新增范本
export function addTemplate(params = {}){
    return service.post('/filesupport/template-info',params,{baseURL: TEMPLATE_URL}).then(res => res)
}

// 获取单个范本
export function getTemplate(id){
    return service.get('/filesupport/template-info/' + id,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 获取单个范本（从weboffice页面,需要存储数据）
export function getTemplateFromIweboffice(id){
    return service.get('/filesupport/uploadgoldgridfile/getTemplateInfo/' + id,{baseURL:TEMPLATE_URL}).then(res => res)
}


// 范本修改接口（从weboffice页面,需要存储数据）
export function saveTemplateInfo(params= {}){
    return service.post('/filesupport/uploadgoldgridfile/saveTemplateInfo',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 通过菜单和范本关联查询数据
export function selectTemplateByContractTypeAndUnit(params = {}) {
    return service.post('/filesupport/getDict/selectTemplateByContractTypeAndUnit', params,{baseURL:TEMPLATE_URL}).then(res => res);
}

/**
 * 获取合同的树形结构
 * @param {} params 
 */
export function getContractTreeList(params){
    return service.post('/contract/dict/selectDictListCascade',params).then(res=>res)
}
// 单个合同发起，通过合同类型查找合同范本
export function getTemplateInfos(params = {}) {
    return service.post('/filesupport/getTemplateInfos', params,{baseURL:TEMPLATE_URL}).then(res => res);
}

// 通过合同范本查找地址
export function getTemplateUrl(id){
  return service.get('/filesupport/business-attament/' + id,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 审批过程中范本新增范本历史记录
export function saveTemplateInfoAndHistory(params){
    return service.post('/filesupport/saveTemplateAndHistory',params,{baseURL:TEMPLATE_URL}).then(res => res)
}
// 合同批量根据合同范本 获取对应模板
export function getFileUrl(params){
    return service.post('/filesupport/contracttype-batch/list/conditions',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 优化范本
export function optimizationTemplate(params){
    return service.post('/filesupport/optimizationTemplate',params,{baseURL:TEMPLATE_URL}).then(res =>res)
}


// 范本废止
export function repealTemplate(params){
    return service.post('/filesupport/repealTemplate',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 获取当前范本的事业部
export function getTemplateUnit(id){
    return service.get('/filesupport/template-unit/'+id,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 获取当前范本的合同类型
export function getTemplateContractType(id){
    return service.get('/filesupport/template-type/'+id,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 将范本和条款关联
export function saveTemplateWithTerm(params){
    return service.post('/filesupport/uploadgoldgridfile/saveTemplateInfoWithTerm',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 添加为我的常用范本
export function addToMy(params){
    return service.post('/filesupport/template-info/addToMy',params,{baseURL:TEMPLATE_URL}).then(res =>res)
}

// 分页查询我的常用范本
export function getMyCommonTemplate(params){
    return service.post('/filesupport/template-info/selectMyTemplate',params,{baseURL:TEMPLATE_URL}).then(res =>res)
}
// 移出常用范本
export function deltTemplate(params){
    return service.post('/filesupport/template-info/deleteToMy',params,{baseURL:TEMPLATE_URL}).then(res =>res)
}

// 关闭或者激活范本
export function closeOrOpenTemplate(params){
    return service.post('/filesupport/openOrCloseTemplate',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 列表查询范本
export function listTemplate(params){
    return service.post('/filesupport/template-info/list/conditions',params,{baseURL:TEMPLATE_URL}).then(res =>res)
}

/**
 * 获取某个范本是否有书签
 * @param {*} params 
 */
export function getTemplateBookMarks(params){
    return service.post('/filesupport/business-parameter/list/conditions',params,{baseURL:TEMPLATE_URL}).then(res=>res)
}

/**
 * 范本维护页面的管理员权限新增范本
 * @param {*} params 
 */
export function mainTainTemplate(params){
    return service.post('/filesupport/templateAdmin/addTemplate',params,{baseURL:TEMPLATE_URL}).then(res=>res)
}

/**
 * 范本维护页面的管理员权限废止范本
 * @param {*} params 
 */
export function adminRepealTemplate(params){
    return service.post('/filesupport/templateAdmin/repealTemplate',params,{baseURL:TEMPLATE_URL}).then(res=>res)
}


/**
 * 范本维护页面的管理员权限范本优化
 * @param {*} params 
 */
export function adminOptimalizeTemplate(params){
    return service.post('/filesupport/templateAdmin/optimalizeTemplate',params,{baseURL:TEMPLATE_URL}).then(res=>res)
}

/**
 * 范本维护页面的管理员权限范本优化,点击提交按钮，没有点击金格控件
 * @param {*} params 
 */
export function optimalizeTemplateNoIwebOffice(params){
    return service.post('/filesupport/templateAdmin/optimalizeTemplateNoIwebOffice',params,{baseURL:TEMPLATE_URL}).then(res=>res)
}

/**
 * 清除掉范本未优化成功的范本
 * @param {*} params 
 */
export function deleteOpziTemplate(params){
    return service.post('/filesupport/templateAdmin/deleteOpziTemplate',params,{baseURL:TEMPLATE_URL}).then(res=>res)
}

/**
 * 批量合同导入的excel与合同类型关联
 */
export function batchAndContractType(params){
    return service.post('/filesupport/contracttype-batch',params,{baseURL:TEMPLATE_URL}).then(res =>res)
}