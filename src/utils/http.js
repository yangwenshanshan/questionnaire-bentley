import axios from 'axios'
import { Toast } from 'vant'

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
}

axios.interceptors.request.use((config) => {
    config.headers['Content-Type'] = 'application/json'
    if (config.method === 'get') {
      config.params['_t'] = Date.parse(new Date()).toString(32)
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
)

axios.interceptors.response.use((response) => {
    const res = response.data
    return res
  }, (error) => {
    Toast(error.msg || 'Request Error')
    return Promise.reject(error);
  }
)

export default axios