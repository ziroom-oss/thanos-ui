/*
 * @Author: liuxr3
 * @Date: 2021-03-10 11:37:21
 * @LastEditTime: 2021-06-16 11:25:48
 * @LastEditors: Please set LastEditors
 * @Description: getters
 * @FilePath: /quality-defense-initiative/src/store/getter.js
 */
export default {
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,

  token: state => state.user.token,
  menu: state => state.user.menu,
  role: state => state.user.role,
  username: state => state.user.username,
  userInfo: state => state.user.userInfo,
  checkedModuleData: state => state.module.checkedModuleData,
  // staffDataSource: state => state.staff.staffDataSource,

  bodyCount: state => state.cases.body.length,
  headersCount: state => state.cases.headers.length,
  paramsCount: state => state.cases.params.length
}
