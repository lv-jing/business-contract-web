import service from "@/utils/request"

/**
 * 单个合同新增
 * @param {*} params
 */
export function singAdd(params = {}) {
    return service.post('/contract/ecm-snap-contract-info', params).then(res => res);
}
/**
 * 单个合同编辑
 * @param {*} params
 */
export function singEdit(params = {}) {
    return service.patch('/contract/ecm-snap-contract-info/'+params.contractId, params).then(res => res);
}



/**
 * 草稿箱列表接口
 * @param {*} params
 */
export function getDraftsList(params = {}) {
    return service.post('/contract/ecm-snap-contract-info/getcontractList', params).then(res => res);
}
/**
 * 批量列表接口
 * @param {*} params
 */
export function getBatchsList(params = {}) {
    return service.post('/contract/ecm-snap-contract-info/getBatchContractList', params).then(res => res);
}
/**
 * 批量综合查询详情单个列表接口
 * @param {*} params
 */
export function getQueryBatchsList(params = {}) {
    return service.post('/contract/query/queryBatchContractList', params).then(res => res);
}
/**
 * 批量综合查询添加合同扫描件
 * @param {*} params
 */
export function getBatchUpload(params = {}) {
    return service.post('/contract/query/saveBatchContractScanning', params).then(res => res);
}
/**
 * 删除单个草稿箱列表接口
 * @param {*} params
 */
export function deleList(id) {
    return service.delete(`/contract/ecm-snap-contract-info/${id}`).then(res => res);
}
/**
 * 删除批量草稿箱列表接口
 * @param {*} params
 */
export function deleLists(id) {
    return service.delete(`/contract/ecm-snap-batch-info/${id}`).then(res => res);
}
/**
 * 单个合同详情
 * @param {*} params
 */
export function postEidtSing(params = {}) {
    return service.post('/contract/ecm-snap-contract-info/getcontractById', params).then(res => res);
}
/**
 * 综合查询单个合同详情
 * @param {*} params
 */
export function postEidtSings(params = {}) {
    return service.post('/contract/ecm-contract-info/getcontractById', params).then(res => res);
}
/**
 * 批量合同详情
 * @param {*} params
 */
export function postBactDetail(id) {
    return service.get(`/contract/ecm-snap-batch-info/${id}`).then(res => res);
}

/**
 * 单个合同审批流程
 * @param {*} params
 */
export function getProcessList(params = {}) {
    return service.post('/contract/ecm-business-process/getProcessList', params).then(res => res);
}
/**
 *  我方签约主体
 * @param {*} params
 */
export function getOurSide(params = {}) {
    return service.post('/contract/ecm-snap-contract-info/getOurSide', params).then(res => res);
}
/**
 *  对方签约主体
 * @param {*} params
 */
export function getOtherSide(params = {}) {
    return service.post('/contract/ecm-snap-contract-info/getOtherSide', params).then(res => res);
}
/**
 *  合同类型
 * @param {*} params
 */
export function getContractType(params = {}) {
    return service.post('/contract/dict/selectDictListCascade', params).then(res => res);
}
/**
 *  合同范本选择
 * @param {*} params
 */
export function getCondData(params = {}) {
    return service.post('/contract/ecm-contract-name/list/conditions', params).then(res => res);
}
/**
 *  获取书签
 * @param {*} params
 */
export function editFile(params = {}) {
    return service.post('/contract/ecm-snap-contract-info/uploadgoldgridfile/EditFile', params).then(res => res);
}
/**
 *  更新书签
 * @param {*} params
 */
export function updateFile(params) {
    return service.post('/contract/ecm-snap-business-parameter/uploadgoldgridfile/updateBookMark', params).then(res => res);
}
/**
 *  更新合同
 * @param {*} params
 */
export function addAttachment(params) {
    return service.post('/contract/ecm-snap-business-attament/uploadgoldgridfile/addAttachment', params).then(res => res);
}
/**
 *  查询批量合同
 * @param {*} params
 */
export function getBatchList(params) {
    return service.post('/contract/ecm-snap-batch-info/batchList/conditions', params).then(res => res);
}
/**
 *  批量合同提交审批
 * @param {*} params
 */
export function postBatchList(params) {
    return service.post('/contract/ecm-snap-batch-info/batchSubmit', params).then(res => res);
}
/**
 *  批量合同提交审批
 * @param {*} params
 */
export function deleteContract(params) {
    return service.post('/contract/ecm-snap-business-attament/deleteByContractId', params).then(res => res);
}

/*        变更补充          */
/**
 *  限制查询当前经办人下的合同
 * @param {*} params
 */
export function getContractNo(params={}) {
    return service.post('/contract/ecm-contract-info/page/selectPageByContractNo', params).then(res => res);
}
/**
 *  通过原合同id查询原合同详情
 * @param {*} params
 */
export function getOrgContract(params={}) {
    return service.post('/contract/ecm-contract-info/getcontractById', params).then(res => res);
}

