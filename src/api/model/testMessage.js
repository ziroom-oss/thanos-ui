/*
 * @Author: liuxr3
 * @Date: 2021-03-12 10:14:41
 * @LastEditTime: 2021-04-20 10:22:16
 * @LastEditors: Please set LastEditors
 * @Description: 测试用例接口
 * @FilePath: /quality-defense-initiative/src/api/model/testCase.js
 */
import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

/*
* 消息中心查询列表
*/
export function queryTestMessageByPage (data) {
  return _$http.post(baseURL + '/testMessage/queryTestMessageByPage', data)
}

/*
* 新增消息
*/
export function insertNewMessage (data) {
  return _$http.post(baseURL + '/testMessage/insertNewMessage', data)
}

/*
* 修改消息
*/
export function updateNewMessage (data) {
  return _$http.post(baseURL + '/testMessage/updateNewMessage', data)
}

/*
* 删除消息
*/
export function deleteNewMessage (params) {
  return _$http.get(baseURL + '/testMessage/deleteNewMessage', params)
}

/*
* 校验消息title是否可用
*/
export function checkNewMessageTitle (params) {
  return _$http.get(baseURL + '/testMessage/checkNewMessageTitle', params)
}

/*
* 校验消息title是否正确
*/
export function findMessageById (params) {
  return _$http.get(baseURL + '/testMessage/findMessageById', params)
}
