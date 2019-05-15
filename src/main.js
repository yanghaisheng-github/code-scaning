import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/element.js'
import './plugins/froala-wysing'
import './api/directives'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://127.0.0.1:3000'
axios.defaults.timeout = 5000;         //超时
axios.defaults.withCredentials = true; //携带cookie
Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转,每次每一个路由改变的时候都得执行一遍。
router.beforeEach((to, from, next) => {
  const role = sessionStorage.getItem('role');
  //alert(`role: ${role}  to.path: ${to.path}`)
  if (!role && to.path != '/Login') {
    next('/Login');
  } else if (to.meta.permission == 'admin') {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === '管理员' ? next() : next('/403');
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      });
    } else {
      next();
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')