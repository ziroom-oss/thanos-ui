/*
 * @Author: liuxr3
 * @Date: 2021-06-16 14:38:36
 * @LastEditTime: 2021-06-17 18:07:11
 * @LastEditors: Please set LastEditors
 * @Description: 登陆 and 路由权限校验
 * @FilePath: /quality-defense-initiative/permission.js
 */
import store from '@/store'
import router from '@/router'
import { GET_USER_INFO } from '@/api/model/login.fetch'
import { getToken, getUserInfo, setToken, setUserInfo } from '@/utils/auth'
// import el from 'element-ui/src/locale/lang/el'

const routerWhiteList = ['/500', '/404', '/login', '/register'] // 路由白名单

router.beforeEach(async (to, from, next) => {
  if (routerWhiteList.indexOf(to.path) !== -1) {
    next()
    return
  }

  // 下面相当于是登录成功之后设置token和用户信息
  // await store.dispatch('getToken', getOauthToken())
  // await store.dispatch('getUserinfo', user.userInfo)
  const hasToken = getToken()
  const userInfo = getUserInfo()
  if (!hasToken) {
    next('/login')
    return
  }
  if (!userInfo) {
    GET_USER_INFO().then(res => {
      if (res.success && res.data) {
        const { data } = res
        setToken(data.userToken)
        setUserInfo(data)
        store.dispatch('permission/generateRoutes', userInfo.role)
        store.dispatch('user/setRole', userInfo.role)
        if (data.role && to.meta && to.meta.roles && to.meta.roles.includes(data.role)) {
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
    }).catch(err => {
      console.log(err)
    })
  }
  if (!store.getters.role) {
    store.dispatch('permission/generateRoutes', userInfo.role)
    store.dispatch('user/setRole', userInfo.role)
    next({ ...to, replace: true })
  }
  next()
})
