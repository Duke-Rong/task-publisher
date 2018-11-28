import Vue from 'vue'
import Router from 'vue-router'

const Auth = () => import(/* webpackChunkName: "Auth.vue" */'@/components/Auth.vue')
const MainPage = () => import(/* webpackChunkName: "MainPage.vue" */'@/components/MainPage.vue')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/mainpage/:id',
      name: 'MainPage',
      scrollToTop: true,
      component: MainPage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/auth',
      name: 'Welcome to Todo Cal!',
      component: Auth
    }
  ]
})

export default router
