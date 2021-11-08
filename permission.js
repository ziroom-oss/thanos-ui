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

router.beforeEach((to, from, next) => {
  let role
  function checkRole () {
    return new Promise((resolve, reject) => {
      _$http.get(baseURL + '/userInfo/queryUserRoleByUserName')
        .then(res => {
          resolve()
          if (res.success && res.data) {
            store.dispatch('setRole', res.data)
            role = res.data
            if (role && to.meta && to.meta.roles && to.meta.roles.includes(role)) {
              console.info(
                '%c \u8d28\u91cf\u4fdd\u969c\u670d\u52a1\u5e73\u53f0😃',
                'text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em'
              )
              next() // 放行
            } else {
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
  doOauthInterceptor({
    clientId: setting.clientId,
    appId: setting.appId,
    env: setting.env
  }).then(async (user) => {
    await store.dispatch('getToken', getOauthToken())
    await store.dispatch('getUserinfo', user.userInfo)
    const hasRoles = store.getters.role
    if (hasRoles) {
      next()
    } else {
      await checkRole() // 检查权限
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
