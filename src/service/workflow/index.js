// 审批规则配置
import service from "@/utils/request"

const workflow = {
    /**
     * 查询环节列表
     * @param {*} params
     */
    queryNodeList(params = {}) {
        return service.post('/contract/process/selectProcessDeptList', params).then(res => res);
    },

    /**
     * 查询节点信息
     * @param {*} params 
     */
    queryNodeTask(params){
        return service.post('/contract/process/selectProcessNodeList2', params).then(res => res);
    },
    /**
     * 查询该环节下的节点信息
     * @param {*} params 
     */
    queryNodeTaskByNode(params){
        return service.post('/contract/process/selectProcessDept2', params).then(res => res);
    },
    
    /**
     * 获取节点信息
     * @param {*} params
     */
    queryRuleList(params = {}) {
        return service.post('/contract/process/selectProcessNodeList', params).then(res => res);
    },

    /**
     * 查询路劲信息
     * @param {*} params 
     */
    queryPathList(params){
        return service.post('/contract/process/selectProcessLinkList', params).then(res => res);
    },
    /**
     * 查询单个路径的节点信息
     * @param {*} params 
     */
    queryPathNodeInfo(params){
        return service.post('/contract/process/selectProcessLink', params).then(res => res);
    },
    
    /**
     * 查询审批矩阵
     * @param {*} params
     */
    queryApprovalList(params = {}) {
        return service.post('/contract/process/selectProcessRuleList', params).then(res => res);
    },
   /**
     * 查询要素组合
     * @param {*} params
     */
    queryConfigList(params = {}) {
        return service.post('/contract/process/selectProcessConfigList', params).then(res => res);
    },
    /**
     * 保存环节
     * @param {*} params
     */
    saveNodeInfo(params = {}) {
        return service.post('/contract/process/saveProcessDept', params).then(res => res);
    },

    /**
     * 保存节点信息
     * @param {*} params
     */
    saveRuleInfo(params = {}) {
        return service.post('/contract/process/saveProcessNode', params).then(res => res);
    },
    /**
     * 保存审批矩阵信息
     * @param {*} params
     */
    saveApprovalInfo(params = {}) {
        return service.post('/contract/process/saveProcessRule', params).then(res => res);
    },
    /**
     * 保存审批路劲信息
     * @param {*} params
     */
    savePathInfo(params = {}) {
        return service.post('/contract/process/saveProcessLinkLineNode', params).then(res => res);
    },
    /**
     * 保存组合要素信息
     * @param {*} params
     */
    saveConfigInfo(params = {}) {
        return service.post('/contract/process/saveProcessConfig', params).then(res => res);
    },

    /**
     * 删除环节
     * @param {*} params
     */
    deleteNodeInfo(params = {}) {
        return service.post('/contract/process/deleteProcessDept', params).then(res => res);
    },

    /**
     * 删除节点信息
     * @param {*} params
     */
    deleteRuleInfo(params = {}) {
        return service.post('/contract/process/deleteProcessNode', params).then(res => res);
    },
    /**
     * 删除审批矩阵
     */
    deleteApprovalInfo(params = {}) {
        return service.post('/contract/process/deleteProcessRule', params).then(res => res);
    },
    /**
     * 删除审批路劲
     */
    deletePathInfo(params = {}) {
        return service.post('/contract/process/deleteProcessLinkHead', params).then(res => res);
    },
    /**
     * 删除要素组合
     */
    deleteConfigInfo(params = {}) {
        return service.post('/contract/process/deleteProcessConfig', params).then(res => res);
    },
    queryPageMatrixInfo(params = {}){
        return service.post('/contract/sys-process-rule-line/page/conditions', params).then(res => res);
    },
    saveMatrixInfo(params = {}){
        return service.post('/contract/sys-process-rule-line', params).then(res => res);
    },
    deleteMatrixInfo(id){
        return service.delete('/contract/sys-process-rule-line/'+id).then(res => res);
    }
}

export default workflow