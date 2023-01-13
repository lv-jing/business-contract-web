
import service from "@/utils/request"

/**
 * 获取所有快捷
 * @param {*} params
 */
export function getAlluickList(params = {}) {
  return service.post('/contract/ecm-business-quick/getAllResource', params).then(res => res);
}
/**
 * 首页获取默认快捷方式
 * @param {*} params
 */
export function getQuickList(params = {}) {
  return service.post('/contract/ecm-business-quick/getBusinessQuickList', params).then(res => res);
}
/**
 * 保存人员的快捷方式配置
 * @param {*} params
 */
export function getAddQuickList(params = {}) {
  return service.post('/contract/ecm-business-quick/saveBusinessQuickList', params).then(res => res);
}
