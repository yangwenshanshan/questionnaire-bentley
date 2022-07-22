import http from '../utils/http'
import publicHttp from '../utils/publicHttp'

export default {
  getQuestion: (params) => http.get(`/wj/api/question`, {params: params}),
  submitQuestion: (params, data) => http.post(`/wj/api/question/submit?${params}`, data),
  checkQuestion: (params) => http.get(`/wj/api/question/check`, {params: params}),
  getQuestionHistory: (params) => http.get(`/wj/api/question/history`, {params: params}),
  getProvinceList: (params) => publicHttp.get(`/${params.locale}_provinces.json`),
  // 排行榜
  // wj/api/board?hubId=KM0FH9Y&top=10&_locale=zh_HK
  getBoardTop: (params) => http.get(`/wj/api/board`, {params: params}),
  // 修改头像
  // /wj/api/user/updateHeadImg
  updateHeadImg: (data) => http.post(`/wj/api/user/updateHeadImg`, data),
  // 总经理列表
  // /wj/api/user/gmList?_locale=zh_CN
  getGmList: (data) => http.post(`/wj/api/user/gmList`, data),
  // 上传文件
  // /wj/api/file/upload
  uploadFile: (data) => http.post(`/wj/api/file/upload`, data),
}