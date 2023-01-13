import service from "@/utils/request"
const TIMER_URL = process.env.VUE_APP_TIMER_URL

/**
 * 从主数据同步数据
 * @param {} params
 */
export function syncMdmData(params = {}) {
    return service.post('/timer/sync/query/mdm', params, {baseURL: TIMER_URL}).then(res => res);
}

/**
 * 将主数据的数据同步至合同系统
 * @param {*} params
 */
export function syncMdmInToData(params = {}) {
    return service.post('/timer/sync/mdm2isump', params, {baseURL: TIMER_URL}).then(res => res);
}

/**
 *
 * @param {"requestID": "", //流程编号，选定的流程返回的值
    "userCode": "" //当前用户编号，必传
    } params
 */
export function getOaViewUrl(params={}){
    return service.post('/timer/sync/getToken', params, {baseURL: TIMER_URL}).then(res => res);
}

/**
 * 查询oa的前置流程
 * @param {"createDate": "",创建时间
	equestID": "", 流程号
	"requestName": "", 流程名称
	"userCode": "", 当前用户编号，必传
	} params
 */
export function queryOaFlow(params={}){
    return service.post('/timer/sync/query/flow', params, {baseURL: TIMER_URL}).then(res => res);
}
