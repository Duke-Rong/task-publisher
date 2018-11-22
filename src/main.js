// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
// 如果不import store则根本不使用store
import { store } from './store'

import './services/firebase.conf'
import firebase from 'firebase'

Vue.use(Vuetify)
Vue.config.silent = false
Vue.config.performance = true
Vue.config.productionTip = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  created () {
    // 确认是否已经登录。若是，则跳转至页面；若否，则跳转至登录页面
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.push('/')
      } else {
        this.$router.push('/auth')
      }
    })
  },
  template: '<App/>'
})
