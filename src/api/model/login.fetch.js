import { getToken } from '@/utils/auth'
import http from '../http'

/*
 *@description: 登录
 *@params:
  * userName: 用户名
  * password: 密码
 *@author: 李少斌
 *@date: 2021-11-25 10:23:00
*/
export const DO_LOGIN = param => {
  return http.post('/login/userLogin', param)
}
/*
 *@description: 获取角色权限
 *@params: 无
 *@author: 李少斌
 *@date: 2021-11-25 13:45:02
*/
export const GET_USER_INFO = () => {
  return http.post('/login/getByToken', { userToken: getToken() })
}
/*
 *@description: 注册
 *@params:
  * userName: 用户名
  * password: 密码
  * newPassword: 确认密码
 *@author: 李少斌
 *@date: 2021-11-25 17:34:59
*/
export const DO_REGISTER = (param) => {
  return http.post('/login/userRegister', param)
}
