import service from "@/utils/request"


export function queryContractSignList(params = {}) {
    return service.post('/contract/ecm-contract-sign/list/conditions', params).then(res => res);
}

/**
 * 查询签章信息
 * @param {} params 
 */
export function queryContractSign(params = {}) {
    return service.post('/contract/ecm-contract-sign/page/conditions', params).then(res => res);
}

/**
 * 获取外部合作单位的资质认证状态
 * @param {entityName:""} params 
 * return PASSED 为通过
 */
export function queryCompanyStatus(params = {}) {
    return service.post('/contract/ecm-contract-sign/company/status', params).then(res => res);
}

/**
 * 获取资质认证页面
 * @param {*} params 
 */
export function getCompanyPage(params = {}) {
    return service.post('/contract/ecm-contract-sign/company/auth', params).then(res => res);
}

/**
 * 获取签章页面
 * @param {contractId:"",entityName:""} params 
 * return 
 */
export function signContractPage(params = {}) {
    return service.post('/contract/ecm-contract-sign/sign/page', params).then(res => res);
}

/**
 * 
 * @param {*} params 
 */
export function getJump(params){
    return service.post('/contract/work/getJumpPath',params).then(res => res)
}

/**
 * 
 * @param {*} params 
 */
export function getContractPrintInfo(params){
    return service.post('/contract/ecm-contract-print/getContractPrint',params).then(res => res)
}

/**
 * 
 * @param {*} params 
 */
export function saveContractPrint(params){
    return service.post('/contract/ecm-contract-print/saveContractPrint',params).then(res => res)
}


/**
 * 
 * @param {*} params 
 */
export function changeContractPrint(params){
    return service.post('/contract/ecm-contract-print/changeContractPrint',params).then(res => res)
}

/**
 * 批量更新
 * @param {*} params 
 */
export function updateBatch(params =[]){
    return service.post('/contract/ecm-contract-sign/updateBatch',params).then(res => res)
}

export function saveNowaterApply(params){
    return service.post('/contract/ecm-contract-no-water',params).then(res => res)
}

export function getNowaterApplyById(id){
    return service.get('/contract/ecm-contract-no-water/'+id).then(res => res)
}

export function getNowaterApplyByContractId(params){
    return service.post('/contract/ecm-contract-no-water/list/conditions',params).then(res => res)
}

// 线下用印补盖的保存内容
export function underlineSealSave(params){
    return service.post('/contract/ecm-contract-offile-seal',params).then(res => res)
}

// 获取线下用印补盖的list
export function getUnderLineSealList(params){
    return service.post('/contract/ecm-contract-offile-seal/list/conditions',params).then(res => res)
}

export function applySealBatch(params){
    return service.post('/contract/ecm-contract-print/submitBatchContractPrint',params).then(res => res)
}