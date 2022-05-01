import http from '../utils/http'

export default {
  getQuestion: (params) => http.get(`/wj/api/question`, {params: params}),
  submitQuestion: (data) => http.post(`/wj/api/question/submit`, data),
}