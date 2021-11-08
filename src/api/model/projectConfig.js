/*
 * @Author: liuxr3
 * @Date: 2021-03-12 10:14:41
 * @LastEditTime: 2021-06-02 10:33:17
 * @LastEditors: Please set LastEditors
 * @Description: 测试用例接口
 * @FilePath: /quality-defense-initiative/src/api/model/testTopic.js
 */
import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

/*
* 查询列表
*/
export function queryListByPage (data) {
  return _$http.post(baseURL + '/topic/queryListByPage', data)
}

/*
* 新增
*/
export function saveTestTopic (data) {
  return _$http.post(baseURL + '/topic/saveTestTopic', data)
}

/*
* 修改
*/
export function updateTestTopic (data) {
  return _$http.post(baseURL + '/topic/updateTestTopic', data)
}

/*
* 删除
*/
export function batchDeleteByIdList (params) {
  return _$http.get(baseURL + '/topic/batchDeleteByIdList', params)
}

/*
* 校验名称是否重复
*/
export function checkNewTopicName (params) {
  return _$http.get(baseURL + '/topic/checkNewTopicName', params)
}

/*
* 根据id获取信息
*/
export function findInfoById (params) {
  return _$http.get(baseURL + '/topic/findInfoById', params)
}

/*
* 测试执行列表
*/
export function getAllCaseExecution (params) {
  return _$http.get(baseURL + '/topicTaskRel/queryAllRelAndUnRelTaskList', params)
}
