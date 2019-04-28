import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/element.js'
import './api/directives'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://127.0.0.1:3000'
axios.defaults.timeout = 5000;         //超时
axios.defaults.withCredentials = true; //携带cookie
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
