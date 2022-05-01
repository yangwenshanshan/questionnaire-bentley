import Vue from 'vue'
import App from './App.vue'
import 'amfe-flexible'
import 'vant/lib/toast/index.less'
import 'vant/lib/notify/index.less'
import router from './router'
import './common/reset.css'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')