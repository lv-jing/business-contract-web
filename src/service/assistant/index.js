import service from "@/utils/request"

/**
 * 获取小工具-提醒列表
 * @param {*} params
 */

export function getToolrList(params = {}) {
  return service.post('/contract/ecm-contract-info/selectContractToolsPage', params).then(res => res);
}
/**
 * 获取小工具-提醒列表 预警 移交
 * @param {*} params
 */
export function getBasiList(params = {}) {
  return service.post('/contract/ecm-contract-info/selectContractCirculatePage', params).then(res => res);
}

/*            小工具             */
/**
 *小工具-提醒列表 -添加
 * @param {*} params
 */
export function saveFulfill(params = {}) {
    return service.post('/contract/tools/saveFulfill', params).then(res => res);
}
export function saveSnapFulfill(params = {}) {
    return service.post('/contract/tools/saveSnapFulfill', params).then(res => res);
}
/*   合同预警  */
/**
 * 合同预警列表查询
 * @param {*} params
 */
export function warningList(params = {}) {
    return service.post('/contract/tools/warningList', params).then(res => res);
}
/**
 * 合同预警列表查询
 * @param {*} params
 */
export function getDetail(id) {
    return service.get(`/contract/ecm-contract-warning/${id}`).then(res => res);
}

/**
 * 合同预警 新增
 * @param {*} params
 */
export function warningAdd(params = {}) {
    return service.post('/contract/tools/warningSubmit', params).then(res => res);
}
/* 合同传阅  */

/**
 * 合同传阅 列表
 * @param {*} params
 */
export function getCircuList(params = {}) {
  return service.post('/contract/query/selectCirculateContractPage', params).then(res => res);
}
/**
 * 添加传阅人
 * @param {*} params
 */
export function addCircuList(params = {}) {
  return service.post('/contract/tools/contractCirculate', params).then(res => res);
}
/**
 * 查询提醒人
 * @param {*} params
 */
export function detailCircul(params = {}) {
  return service.post('/contract/ecm-business-member/page/conditions', params).then(res => res);
}
/**
 * 删除传阅人员
 * @param {*} id
 */
export function deleteMember(id) {
  return service.delete(`/contract/ecm-business-member/${id}`).then(res => res);
}
/* 合同移交*/
/**
 * 移交列表
 * @param {*} params
 */
export function getTransfeList(params={}) {
  return service.post('/contract/ecm-contract-info/selectContractTransfer', params).then(res => res);
}
/**
 * 移交合同根据多选id查询列表
 * @param {*} params
 */
export function getList(params) {
  return service.post('/contract/ecm-contract-info/selectContractList', params).then(res => res);
}
/**
 * 合同移交提交
 *
 */
export function getAdd(params={}) {
  return service.post('/contract/tools/saveContractTransfer', params).then(res => res);
}
/**
 * 合同移交审批流程
 *
 */
export function getSubmit(params={}) {
  return service.post('/contract/tools/contractTransferSubmit', params).then(res => res);
}
/*   综合查询  */

/**
 * 合同归档列表查询
 *
 */
export function getConditionsPage(params={}) {
  return service.post('/contract/query/selectArchiveContractPage', params).then(res => res);
}
/**
 * 新增合同归档
 *
 */
export function getAddArchive(params={}) {
  return service.post('/contract/ecm-contract-archive/submitArchive', params).then(res => res);
}
// 编辑合同归档
export function archiveEdit(params = {}) {
  return service.post('/contract/ecm-contract-archive/update', params).then(res => res);
}
// 未归还
export function updateNo(params = {}) {
  return service.post('/contract/ecm-contract-archive/updateArchiveReturnNo', params).then(res => res);
}
// 已归还
export function updateYes(params = {}) {
  return service.post('/contract/ecm-contract-archive/updateArchiveReturnYes', params).then(res => res);
}
/**
 * 单个归档信息
 *
 */
export function getArchiveDetail(id) {
  return service.get(`/contract/ecm-contract-archive/${id}`).then(res => res);
}

/**
 * 综合台账查询
 *
 */
export function getContractPage(params={}) {
  return service.post('/contract/query/selectLedgerContractPage', params).then(res => res);
}
/**
 * 综合台账导出
 *
 */
export function getContractDown(params={}) {
  return service.get('/contract/query/exportLedgerContract', {params}).then(res => res);
}

/**
 * 综合传阅查询
 *
 */
export function getCirculatePage(params={}) {
  return service.post('/contract/query/selectCirculateContractPage', params).then(res => res);
}
