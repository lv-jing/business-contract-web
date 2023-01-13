import service from "@/utils/request"

const FILE_URL = process.env.VUE_APP_FILE_URL
const OPEN_IMG = process.env.VUE_APP_API_URL
/**
 * 上传接口
 * @param {*} params
 */
export const uploadUrl = FILE_URL + '/fileOperator/uploadFile'
// 下载接口
export const downloadUrl = FILE_URL + '/fileOperator/downloadFile'
// 预览
export const previewUrl = FILE_URL + '/fileOperator/preview'
// 合并在线预览
export const openImg = OPEN_IMG + '/contract/ecm-snap-business-attament/mergeFile'

