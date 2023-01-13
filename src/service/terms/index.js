import service from "@/utils/request"
const TEMPLATE_URL = process.env.VUE_APP_TEMPLATE_URL
/**
 * 条款新增接口
 */
export function addTerm(params = {}) {
    return service.post('/filesupport/terms-info', params, {baseURL: TEMPLATE_URL}).then(res => res);
}

// 条款分页查询接口
export function getTermsByPage(params= {}){
    return service.post('/filesupport/terms-info/page/conditions',params,{baseURL:TEMPLATE_URL}).then(res =>res)
}

// 获取单个条款
export function getTermInfo(id){
    return service.get('/filesupport/terms-info/' + id,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 修改单个条款的数据
export function updateTermInfo(params = {}){
    return service.patch('/filesupport/terms-info/'+ params.termsId,params,{baseURL:TEMPLATE_URL}).then(res=> res)
}

// 通过条款ID或者范本ID获取相应的文档
export function getBussAttament(id){
    return service.get('/filesupport/business-attament/'+id,{baseURL:TEMPLATE_URL}).then(res => res)
}



// 条款修改接口（从weboffice页面,需要存储数据）
export function saveTermInfo(params= {}){
    return service.post('/filesupport/uploadgoldgridfile/saveTermInfo',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 获取单个条款（从weboffice页面,需要存储数据）
export function getTermInfoFromIweboffice(id){
    return service.get('/filesupport/uploadgoldgridfile/getTermsInfo/' + id,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 获取书签名（在iwebOffice页面上）
export function getBookMark(params){
    return service.post('/filesupport/uploadgoldgridfile/getBookMarks',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 条款过程中审批数据保存
export function saveTermInfoAndHistory(params){
    return service.post('/filesupport/saveTermInfoHistory',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 条款作废
export function deleteTermInfo(params){
    return service.post('/filesupport/deleteTermInfo',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 查询出所有的条款(不分页)（在iwebOffice页面上）
export function getAllTerms(params){
    return service.post('/filesupport/uploadgoldgridfile/getAllTermInfos',params,{baseURL:TEMPLATE_URL}).then(res => res)
}


// 查询出范本或者条款对应的文档（在iwebOffice页面上）
export function getBussAttamentId(params){
    return service.post('/filesupport/uploadgoldgridfile/getBusinessAttament',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 通过条款查询所关联的范本
export function getTemplateWithTerms(params){
    return service.post('/filesupport/template-terms/page/conditions',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 条款的一键更新
export function clickUpdate(params){
    return service.post('/filesupport/clickUpdateTemplateInfo',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 条款更新的审批页面中获取勾选的范本
export function getTemplateFromTerm(params){
    return service.post('/filesupport/terms-update-temp/list/conditions',params,{baseURL:TEMPLATE_URL}).then(res => res)
}

// 合同监控保存
export function saveContractMon(params){
    return service.post('/contract/ecm-contract-monitoring',params).then(res => res)
}

// 列表查询合同监控数据
export function listContractMonitoring(params){
    return service.post('/contract/ecm-contract-monitoring/page/conditions',params).then(res => res)
}