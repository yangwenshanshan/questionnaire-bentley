import http from '../utils/http'
import publicHttp from '../utils/publicHttp'

export default {
  getQuestion: (params) => http.get(`/wj/api/question`, {params: params}),
  submitQuestion: (params, data) => http.post(`/wj/api/question/submit?${params}`, data),
  checkQuestion: (params) => http.get(`/wj/api/question/check`, {params: params}),
  getQuestionHistory: (params) => http.get(`/wj/api/question/history`, {params: params}),
  getProvinceList: () => publicHttp.get('/provinces.json')
}