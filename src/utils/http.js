import axios from 'axios'
import { Toast } from 'vant'

let baseURL = ''

if (import.meta.env.VITE_API_BASE_URL) {
  baseURL = import.meta.env.VITE_API_BASE_URL
}

const instance = axios.create({
  baseURL: baseURL
});

instance.interceptors.request.use((config) => {
    config.headers['Content-Type'] = 'application/json'
    if (config.method === 'get') {
      config.params['_t'] = Date.parse(new Date()).toString(32)
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
)

instance.interceptors.response.use((response) => {
    const res = response.data
    return res
  }, (error) => {
    Toast(error.msg || 'Request Error')
    return Promise.reject(error);
  }
)

export default instance