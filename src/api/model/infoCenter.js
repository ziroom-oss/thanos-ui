/*
 * @Author: your name
 * @Date: 2021-04-21 15:49:32
 * @LastEditTime: 2021-04-21 15:51:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/api/model/infoCenter.js
 */
import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

/*
* 消息中心list
*/
export function getNewsList (params) {
  return _$http.get(baseURL + '/testMessage/viewMessage', params)
}

/*
* 消息状态变更
*/
export function getNewsStatusChange (params) {
  return _$http.get(baseURL + '/testMessage/readMessage', params)
}
