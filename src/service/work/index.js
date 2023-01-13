import service from "@/utils/request"

/**
 * 获取合同审批节点和人员信息
 * @param {*} params
 */
export function getApprovlList(params = {}) {
    return service.post('/contract/work/getContractApprovalList', params).then(res => res);
}
/**
 * 合同流程发起
 * @param {*} params
 */
export function getApprovlStart(params = {}) {
    return service.post('/contract/ecm-snap-contract-info/submit', params).then(res => res);
}
/**
 * 合同发起已办列表
 * @param {*} params
 */
export function getDoneList(params = {}) {
    return service.post('/contract/work/done', params).then(res => res);
}
/**
 * 合同发起待办列表
 * @param {*} params
 */
export function getBackList(params = {}) {
    return service.post('/contract/work/backLog', params).then(res => res);
}
/**
 * 获得单个待办信息
 * @param {*} params
 */
export function getWorklist(params) {
    return service.get(`/contract/work/detail/${params}`, params).then(res => res);
}
/**
 * 合同发起待办列表
 * @param {*} params
 */
export function getBusinessId(params) {
    return service.get(`/contract/ecm-business-voucher/${params.id}` ).then(res => res);
}
/**
 * 合同发起待办列表
 * @param {*} params
 */
export function getDetail(params={}) {
    return service.post(`/contract/work/detail`,params ).then(res => res);
}
/**
 * 审批通过
 * @param {*} params
 */
export function getAuditApprove(params={}) {
    return service.post(`/contract/work/auditApprove`,params ).then(res => res);
}
/**
 * 退回节点
 * @param {*} params
 */
export function getApprovedList(params={}) {
    return service.post(`/contract/work/contract/getApprovedList`,params ).then(res => res);
}

/**
 * 驳回流程
 * @param {*} params
 */
export function rejectProcess(params={}) {
    return service.post(`/contract/work/rejectProcess`,params ).then(res => res);
}
/**
 * 征询人
 * @param {*} params
 */
export function getConsult(params={}) {
    return service.post(`/contract/work/startConsultProcess`,params ).then(res => res);
}
/**
 * 非适格审批人
 * @param {*} params
 */
export function getInAppropr(params={}) {
    return service.post(`/contract/work/inAppropriateProcess`,params ).then(res => res);
}
/**
 * 已办结
 * @param {*} params
 */
export function getFinish(params={}) {
    return service.post(`/contract/work/finish`,params ).then(res => res);
}
/**
 * 撤回已办单个合同 批量合同
 * @param {*} params
 */
export function deleteProcess(params={}) {
    return service.post(`/contract/work/stopProcess`,params ).then(res => res);
}


/**
 * 撤回合同流程
 * @param {contractId:""} params
 */
export function contractDisable(params={}) {
    return service.post('/contract/ecm-contract-disable/contractDisable', params).then(res => res);
}


/**
 * 流程发起
 */
export function processStart(params){
    return service.post('/contract/work/contract/processStart',params).then(res => res)
}
/**
 * 批量审批合同信息
 */
export function getTableData(params){
    return service.post('/contract/ecm-snap-contract-info/getcontractWithOutStatusList',params).then(res => res)
}

/*审批授权*/
// 列表
export function getauthList(params){
  return service.post('/contract/ecm-contract-approval-auth/page/conditions',params).then(res => res)
}
// 新增审批授权
export function getAddAuth(params={}){
  return service.post('/contract/ecm-contract-approval-auth',params).then(res => res)
}
// 编辑审批授权
export function deleteList(params){
  return service.patch(`/contract/ecm-contract-approval-auth/${params.contractApprovalAuthId}`,params).then(res => res)
}
// 审批授权详情
export function detailList(id){
  return service.get(`/contract/ecm-contract-approval-auth/${id}`).then(res => res)
}
// 取消授权
export function updateList(params){
  return service.post('/contract/ecm-contract-approval-auth/updateStatus',params).then(res => res)
}

// 是否点击待办
export function setStatus(params){
  return service.post('/contract/work/signTask/'+params).then(res => res)
}

// 获取首页的页签
export function getHomeRadioList(){
    return service.get('/contract/ecm-user/getHomeCondition').then(res => res)
}

// 获取流程历史 {id:''}
export function getBpmProcessTaskVoListById(params){
    return service.post('/contract/work/getBpmProcessTaskVoListById',params).then(res => res)
}

// 获取流程路径 {id:''}
export function getProcessPathById(params){
    return service.post('/contract/work/getProcessPathById',params).then(res => res)
}

// 获取流程审批意见 {id:''}
export function getBpmProcessTaskOpnionVoListById(params){
    return service.post('/contract/work/getBpmProcessTaskOpnionVoListById',params).then(res => res)
}
