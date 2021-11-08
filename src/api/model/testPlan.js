/*
 * @Author: liuxr3
 * @Date: 2021-03-12 10:14:41
 * @LastEditTime: 2021-04-20 10:22:16
 * @LastEditors: Please set LastEditors
 * @Description: 测试用例接口
 * @FilePath: /quality-defense-initiative/src/api/model/testPlan.js
 */
import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

/*
* 查询列表
*/
export function queryTestPlanByPage (data) {
  return _$http.post(baseURL + '/testPlan/queryTestPlanByPage', data)
}

/*
* 新增
*/
export function insertTestPlan (data) {
  return _$http.post(baseURL + '/testPlan/insertTestPlan', data)
}

/*
* 修改
*/
export function updateTestPlan (data) {
  return _$http.post(baseURL + '/testPlan/updateTestPlan', data)
}

/*
* 根据id获取测试计划
*/
export function findPlanInfoById (params) {
  return _$http.get(baseURL + '/testPlan/findPlanInfoById', params)
}

/*
* 批量删除
*/
export function deleteTestPlan (params) {
  return _$http.get(baseURL + '/testPlan/deleteTestPlan', params)
}

/*
* 判断用例计划名称是否相同
*/
export function checkNewPlanName (params) {
  return _$http.get(baseURL + '/testPlan/checkNewPlanName', params)
}

/*
* 查询待审核的测试计划Id集合
*/
export function queryIdsByUncheck (data) {
  return _$http.post(baseURL + '/testPlan/queryIdsByUncheck', data)
}

/*
* 查询用例计划历史版本
*/
export function queryTestPlanHistoryByPlanKey (params) {
  return _$http.get(baseURL + '/testPlan/queryTestPlanHistoryByPlanKey', params)
}

/*
* 批量审批测试用例计划
*/
export function batchApprovedTestPlan (params) {
  return _$http.get(baseURL + '/testPlan/batchApprovedTestPlan', params)
}

/*
* 校验jiraid是否正确
*/
export function validateIssueKey (params) {
  return _$http.get(baseURL + '/jiraIssue/validateIssueKey', params)
}

/*
* 获取测试环境列表
*/
export function queryTestEnvironmentTypeList (params) {
  return _$http.get(baseURL + '/dataDictionary/queryTestEnvironmentTypeList', params)
}

/*
* 获取测试策略列表
*/
export function queryTestStrategyTypeList (params) {
  return _$http.get(baseURL + '/dataDictionary/queryTestStrategyTypeList', params)
}

/*
* 获取人员名单
*/
export function getEhrUserDetailLikeUserName (params) {
  return _$http.get(baseURL + '/matrix/getEhrUserDetailLikeUserName', params)
}
