import service from "@/utils/request"
const LOGIN_URL = process.env.VUE_APP_BASE_LOGIN_URL

/**
 * 登录接口
 * @param {*} params
 */
export function userLogin(params = {}) {
    return service.post('isump/login', params, {baseURL: LOGIN_URL}).then(res => res);
}

/**
 * 登出接口
 * @param  token
 */
export function userLoginOut(token) {
    return service.post('/isump/logout?token='+params, {}, {baseURL: LOGIN_URL}).then(res => res);
}


/**
 * 请求userInfo
 * @param {*} params
 */
export function userInfo(params = {}) {
    return service.get('/contract/login/userInfo').then(res => res);
}

/**
 * 请求菜单
 * @param {*} params
 */
export function getTree(params = {}) {
    return service.get('/contract/ecm-user/menu').then(res => res);
}

// 查询用户信息
export function getPersonList(params = {}){
    return service.post('/isump/user/query/user/page', {...params,statusCode:'0'}, {baseURL: LOGIN_URL}).then(res => res);
}


export function queryUserList(params = {}){
    return service.post('/isump/user/page2/conditions',params, {baseURL: LOGIN_URL}).then(res => res);
}

export function userLoginSSO(params = {}){
    return service.post('/isump/sso/login',params, {baseURL: LOGIN_URL}).then(res => res);
}

export function getOrgTreeList(params = {}){
    return service.get('/isump/organization/list/orgcode/'+params, {baseURL: LOGIN_URL}).then(res => res);
}

export function getOrgTreeFilterData(params = {}){
    return service.get('/isump/organization/list/queryDataOrgTree/'+params, {baseURL: LOGIN_URL}).then(res => res);
}

/**
 * 全量查询组织树
 * @param {*} params 
 */
export function getOrgTree(params = {}){
    return service.post('/isump/organization//select/tree',params, {baseURL: LOGIN_URL}).then(res => res);
}

// 查询所有菜单
export function getResourceTreeList(params = {}){
    return service.post('/isump/resource/list/conditions',params, {baseURL: LOGIN_URL}).then(res => res);
}

// 查询某个事业部
export function getUnitInfo(id){
    return service.get('/isump/unit/'+id,{baseURL: LOGIN_URL}).then(res => res)
}


// 查询所有事业部
export function getAllUnit(params){
    return service.post('/isump/unit/list/conditions',params,{baseURL: LOGIN_URL}).then(res => res)
}

/**
 * 查询某字典下所有子类
 * @param {dictCode:""} params 
 */
export function queryAllDict(params){
    return service.post('/isump/dict/query/all/code',params,{baseURL: LOGIN_URL}).then(res => res)
}

/**
 * 查询当前用户所拥有的角色
 * @param {deputyAccountId:"",roleCode:""} params 
 */
export function queryUserRole(params){
    return service.post('/isump/deputy-account-role/list/conditions',params,{baseURL: LOGIN_URL}).then(res => res)
}

/**
 *  对方签约主体
 * @param {*} params
 */
export function queryCooperationInfo(params = {}) {
    return service.post('/isump/cooperation-info/page/conditions', params,{baseURL:LOGIN_URL}).then(res => res);
}

/**
 * 查询合作方详情
 * @param {*} id 
 */
export function getCooperationInfo(id){
    return service.get('/isump/cooperation-info/'+id,{baseURL:LOGIN_URL}).then(res =>res)
}


export function addForbiddenCooperation(params){
    return service.post('/isump/cooperation-forbidden',params,{baseURL:LOGIN_URL}).then(res =>res)
}

export function updateForbiddenCooperation(id,params){
    return service.patch('/isump/cooperation-forbidden/'+id,params,{baseURL:LOGIN_URL}).then(res =>res)
}

export function deleteForbiddenCooperation(id){
    return service.delete('/isump/cooperation-forbidden/'+id,{baseURL:LOGIN_URL}).then(res =>res)
}

export function queryForbiddenCooperation(params){
    return service.post('/isump/cooperation-forbidden/page/conditions',params,{baseURL:LOGIN_URL}).then(res =>res)
}

export function listForbiddenCooperation(params){
    return service.post('/isump/cooperation-forbidden/list/conditions',params,{baseURL:LOGIN_URL}).then(res =>res)
}