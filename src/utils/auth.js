import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
export function setUserInfo (userInfo) {
  Cookies.set('ZR_USER_INFO', JSON.stringify(userInfo))
}
export function getUserInfo () {
  return Cookies.get('ZR_USER_INFO') ? JSON.parse(Cookies.get('ZR_USER_INFO')) : ''
}
export function removeUserInfo () {
  Cookies.remove('ZR_USER_INFO')
}
