/*
 * @Author: liuxr3
 * @Date: 2021-03-09 11:11:04
 * @LastEditTime: 2021-06-17 18:07:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRoutes } from './routes'

const router = new VueRouter({
  mode: 'history',
  routes: constantRoutes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

Vue.use(VueRouter)
export default router
