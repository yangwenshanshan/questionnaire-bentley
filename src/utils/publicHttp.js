import axios from 'axios'
import { Toast } from 'vant'

const instance = axios.create({
  baseURL: './'
});

instance.interceptors.request.use((config) => {
    config.headers['Content-Type'] = 'application/json'
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