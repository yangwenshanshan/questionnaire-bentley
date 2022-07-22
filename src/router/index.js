import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [{
    path: '/',
    redirect: 'main'
  }, {
    path: '/main',
    name: 'main',
    component: () => import('@/views/main/index.vue')
  }, {
    path: '/result',
    name: 'result',
    component: () => import('@/views/main/result.vue')
  }, {
    path: '/answer',
    name: 'answer',
    component: () => import('@/views/main/answer.vue')
  }, {
    path: '/rankList',
    name: 'rankList',
    component: () => import('@/views/rankList/index.vue')
  }, {
    path: '/managerList',
    name: 'managerList',
    component: () => import('@/views/managerList/index.vue')
  }]
});

export default router
