/*
 * @Author: liuxr3
 * @Date: 2021-03-11 14:30:07
 * @LastEditTime: 2021-06-16 10:32:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/api/model/user.js
 */
import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

// 登出接口
export function getUserRole () {
  return _$http.get(baseURL + '/userInfo/queryUserRoleByUserName')
}
