import Vue from 'vue'
import Router from 'vue-router'

const Auth = () => import(/* webpackChunkName: "Auth.vue" */'@/components/Auth.vue')
const MainPage = () => import(/* webpackChunkName: "MainPage.vue" */'@/components/MainPage.vue')
const Cards = () => import(/* webpackChunkName: "Cards.vue" */'@/components/Cards.vue')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'MainPage',
      scrollToTop: true,
      component: MainPage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/cards/:id',
      name: 'Cards',
      scrollToTop: true,
      component: Cards,
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
