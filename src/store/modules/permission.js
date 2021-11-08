/*
 * @Author: linxinru
 * @Date: 2020-07-04 16:40:06
 * @LastEditTime: 2021-06-17 15:53:53
 */
import { constantRoutes, asyncRoutes } from '@/router/routes'
const hasPermission = (route, role) => {
  // 权限判断可以自由改写
  return route.meta && route.meta.roles
    ? route.meta.roles.includes(role)
    : true
}

const filterAsyncRoute = (routes, role) => {
  const res = []
  routes.forEach(route => {
    if (hasPermission(route, role)) {
      if (route.children) route.children = filterAsyncRoute(route.children, role)
      res.push(route)
    }
  })
  return res
}

export default {
  state: {
    routes: [],
    // routes: JSON.parse(sessionStorage.getItem('routes')),
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, addRoutes) => {
      state.addRoutes = addRoutes
      const routes = constantRoutes.concat(addRoutes)
      sessionStorage.setItem('routes', JSON.stringify(routes))
      state.routes = routes
      // state.routes = sessionStorage.getItem('routes')
    }
  },
  actions: {
    generateRoutes ({ commit }, role) {
      return new Promise((resolve, reject) => {
        try {
          const accessRoutes = filterAsyncRoute(asyncRoutes, role)
          commit('SET_ROUTES', accessRoutes)
          resolve(accessRoutes)
        } catch (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Set routes failed: ' + err.message)
        }
      })
    }
  }
}
