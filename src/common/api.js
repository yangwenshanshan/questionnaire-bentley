import http from '../utils/http'

export default {
  getQuestion: (params) => http.get(`/wj/api/question`, {params: params}),
  submitQuestion: (params, data) => http.post(`/wj/api/question/submit?${params}`, data),
  checkQuestion: (params) => http.get(`/wj/api/question/check`, {params: params}),
}