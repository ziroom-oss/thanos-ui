/*
 * @Author: liuxr3
 * @Date: 2021-03-09 14:15:35
 * @LastEditTime: 2021-06-16 14:48:10
 * @LastEditors: Please set LastEditors
 * @Description: axios封装
 * @FilePath: /quality-defense-initiative/src/api/http.js
 */
import axios from 'axios'
import { Notification } from 'element-ui'
import qs from 'qs'
import store from '@/store'
import { getOauthToken } from '@ziroom/zcloud-head'

// 创建axios实例

export const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: false,
  timeout: 60000 // 请求超时时间
})

instance.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'

instance.interceptors.request.use(
  config => {
    config.headers['X-ZCLOUD-TOKEN'] = getOauthToken()
    config.headers.appId = process.env.VUE_APP_APPCODE
    if (store.getters.userInfo) {
      const { userName, nickName, uid, userType } = store.getters.userInfo
      config.headers.userName = userName
      config.headers.userType = userType
      config.headers.nickName = encodeURIComponent(nickName)
      config.headers.uid = uid
    }
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)

instance.interceptors.response.use(response => {
  const { data } = response
  if (!data.success) {
    Notification({
      type: 'error',
      title: 'Error',
      message: data.message || data.data || data.errorMessage || '响应报错，请重新请求'
    })
    return data
  } else {
    return data
  }
}, (err) => {
  Notification({
    type: 'error',
    title: 'Error',
    message: err?.message || err?.data || '响应报错，请重新请求'
  })
  return Promise.reject(err)
})

export default {
  get (url, params) {
    return instance({
      method: 'get',
      url: `${url}${params ? `?${qs.stringify(params)}` : ''}`
    })
  },
  post (url, data, ...reset) {
    return instance({
      method: 'post',
      url,
      data,
      ...reset
    })
  },
  upload (url, data) {
    return instance({
      method: 'post',
      url: url,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  download (url, data) {
    return instance({
      method: 'post',
      url: url,
      data: data,
      headers: {
        responseType: 'blob'
      }
    })
  }
}
