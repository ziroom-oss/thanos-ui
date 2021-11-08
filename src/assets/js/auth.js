/*
 * @Author: liuxr3
 * @Date: 2021-03-10 17:19:58
 * @LastEditTime: 2021-03-10 17:23:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/assets/js/auth.js
 */
import Cookies from 'js-cookie'
const TokenKey = 'Access-Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  Cookies.remove(TokenKey)
}
