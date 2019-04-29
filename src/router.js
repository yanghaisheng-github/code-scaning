import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/Login'
    },
    {
      path: '/Login',
      component: Login
    },
    {
      path: '/Home',
      component: Home,
      children: [
        {
          path: '/Dashboard',
          component: resolve => require(['./components/Dashboard.vue'], resolve),
          meta: { title: '系统首页', permission: 'common' }
        },
        {
          path: '/SystemListing',
          component: resolve => require(['./components/SystemListing.vue'], resolve),
          meta: { title: '系统清单', permission: 'admin' }
        },
        {
          path: '/Users',
          component: resolve => require(['./components/Users.vue'], resolve),
          meta: { title: '用户管理', permission: 'admin' }
        },
        {
          path: '/scanJava',
          component: resolve => require(['./components/scanJava.vue'], resolve),
          meta: { title: 'Java代码扫描', permission: 'common' }
        },
        {
          path: '/404',
          component: resolve => require(['./components/404.vue'], resolve),
          meta: { title: '404' }
        },
        {
          path: '/403',
          component: resolve => require(['./components/403.vue'], resolve),
          meta: { title: '403' }
        },
      ]
    },
    {
      path: '*',
      redirect: '/404'

    }
  ]
})
