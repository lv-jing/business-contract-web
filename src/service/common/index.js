import service from "@/utils/request"

/**
 * 全局数字字典
 * @param {*} params
 */
export function dictSelectList(params = {}) {
    return service.post('/contract/dict/selectDictList', params).then(res => res);
}

export function queryContractPage(params = {}) {
    return service.post('/contract/ecm-contract-info/selectContractPage', params).then(res => res);
}

export function getContractInfo(params = {}) {
    return service.post('/contract/ecm-contract-info/getcontractById', params).then(res => res);
}

//
export function getBatchList(params = {}) {
    return service.post('/contract/query/selectBatchContractPage', params).then(res => res);
}
