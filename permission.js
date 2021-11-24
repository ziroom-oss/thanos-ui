/*
 * @Author: liuxr3
 * @Date: 2021-06-16 14:38:36
 * @LastEditTime: 2021-06-17 18:07:11
 * @LastEditors: Please set LastEditors
 * @Description: 登陆 and 路由权限校验
 * @FilePath: /quality-defense-initiative/permission.js
 */
import { doOauthInterceptor, getPlainHref, getOauthToken } from '@ziroom/zcloud-head'
import store from '@/store'
import router from '@/router'
import _$http from '@/api/http'
import { baseURL } from '@/config/baseConfig.config.js'
// import el from 'element-ui/src/locale/lang/el'

const routerWhiteList = ['/500', '/404', '/login'] // 路由白名单
const appcode = process.env.VUE_APP_APPCODE
const setting = {
  clientId: process.env.VUE_APP_ENV_CONFIG === 'dev' ? 'zcloud-dev' : appcode,
  appId: appcode,
  // dev 参数仅能在 zcloud 项目中使用
  // env: ['dev', 'sit'].includes(process.env.VUE_APP_ENV_CONFIG) ? 'sit'
  //   : process.env.VUE_APP_ENV_CONFIG === 'pre'
  //     ? 'prod' : process.env.VUE_APP_ENV_CONFIG

  // clientId: appcode,
  // appId: appcode,
  env: process.env.VUE_APP_ENV_CONFIG
}
function getRole (to, next) {
  return new Promise((resolve, reject) => {
    _$http.get(baseURL + '/userInfo/queryUserRoleByUserName')
      .then(res => {
        if (res.success && res.data) {
          store.dispatch('setRole', res.data)
          const role = res.data
          if (role && to.meta && to.meta.roles && to.meta.roles.includes(role)) {
            console.info(
              '%c \u8d28\u91cf\u4fdd\u969c\u670d\u52a1\u5e73\u53f0😃',
              'text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em'
            )
            resolve(role)
            next() // 放行
          } else {
            resolve(role)
            next({ path: '/404' })// 跳到404页面
          }
        } else {
          next({ path: '/500' })// 跳到500页面
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
}
router.beforeEach(async (to, from, next) => {
  console.log({ ...to })
  if (routerWhiteList.indexOf(to.path) !== -1) {
    console.log('白名单')
    next()
    return
  }
  doOauthInterceptor({
    clientId: setting.clientId,
    appId: setting.appId,
    env: setting.env
  }).then(async (user) => {
    // 下面相当于是登录成功之后设置token和用户信息
    await store.dispatch('getToken', getOauthToken())
    await store.dispatch('getUserinfo', user.userInfo)
    const hasRoles = store.getters.role
    if (hasRoles) {
      next()
    } else {
      const role = await getRole(to, next) // 检查权限
      const accessRoutes = await store.dispatch('generateRoutes', role)
      router.addRoutes(accessRoutes)
      next({ ...to, replace: true })
    }
  }).catch(err => {
    console.error(err)
    const r = window.confirm(err)
    if (r) {
      location.href = getPlainHref()
    }
  })
})
