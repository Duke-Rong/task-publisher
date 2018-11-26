import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'
const Auth = () => import(/* webpackChunkName: "Auth.vue" */'@/components/Auth.vue')
const Add = () => import(/* webpackChunkName: "Add.vue" */'@/components/Add.vue')
const Delete = () => import(/* webpackChunkName: "Delete.vue" */'@/components/Delete.vue')
const MainPage = () => import(/* webpackChunkName: "MainPage.vue" */'@/components/MainPage.vue')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      scrollToTop: true,
      component: HelloWorld,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/add',
      name: 'Add',
      scrollToTop: true,
      component: Add,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/delete',
      name: 'Delete',
      scrollToTop: true,
      component: Delete,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/mainpage',
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
