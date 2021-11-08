/*
 * @Author: liuxr3
 * @Date: 2021-03-23 14:57:12
 * @LastEditTime: 2021-04-16 14:25:49
 * @LastEditors: Please set LastEditors
 * @Description: 测试用例执行接口
 * @FilePath: /quality-defense-initiative/src/api/model/caseExecution.js
 */
import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

/*
* 测试执行列表
*/
export function queryCaseExecution (data) {
  return _$http.post(baseURL + '/testTask/queryTestTaskByPage', data)
}

/*
* 测试执行状态
*/
export function getTestTaskStatusList (params) {
  return _$http.get(baseURL + '/testTask/getTestTaskStatusList', params)
}

/*
* 测试执行类型
*/
export function getTestTaskTypeList () {
  return _$http.get(baseURL + '/testTask/getTestTaskTypeList')
}

/*
* 验证测试执行标题唯一
*/
export function getOnlyCaseTitle (params) {
  return _$http.get(baseURL + '/testTask/validateTestTaskName', params)
}

/*
* 保存新建测试执行
*/
export function queryNewCaseExecution (data) {
  return _$http.post(baseURL + '/testTask/saveTestTask', data)
}

/*
* 保存或更新测试执行
*/
export function saveOrUpdateTestTask (data) {
  return _$http.post(baseURL + '/testTask/saveOrUpdateTestTask', data)
}

/*
* 保存或更新测试执行
*/
export function getTestTaskDetailById (data) {
  return _$http.get(baseURL + '/testTask/getTestTaskDetailById', data)
}

/**
 * 测试执行任务关联的用例列表
 * @param data
 * @returns {AxiosPromise}
 */
export function batchDeleteTestTask (params) {
  return _$http.get(baseURL + '/testTask/batchDeleteTestTask', params)
}

/*
* 测试任务关联测试用例
*/
export function queryUnRelTestCaseByPage (data) {
  return _$http.post(baseURL + '/taskTestCase/queryUnRelTestCaseByPage', data)
}

/*
* 测试API任务关联测试用例
*/
export function queryUnRelApiCaseByPage (data) {
  return _$http.post(baseURL + '/taskTestCase/queryUnRelApiCaseByPage', data)
}

/*
* 获取人员名单
*/
export function getEhrUserDetailLikeUserName (params) {
  return _$http.get(baseURL + '/matrix/getEhrUserDetailLikeUserName', params)
}

/*
* 获取所选择的测试用例
*/
export function getSelectedCaseList (data) {
  return _$http.post(baseURL + '/testCase/getCheckedTestCaseList', data)
}

/**
 * 测试执行任务关联的用例列表
 * @param data
 * @returns {AxiosPromise}
 */
export function getTaskTestCaseListByTaskId (data) {
  return _$http.get(baseURL + '/taskTestCase/getTaskTestCaseListByTaskId', data)
}

/*
* 根据测试集合获取测试用例
*/
export function getCaseList (params) {
  return _$http.get(baseURL + '/taskTestCase/getTaskTestCaseListByTaskId', params)
}

/*
* 测试执行关联测试用例
*/
export function saveTestCaseWithExecution (data) {
  return _$http.post(baseURL + '/taskTestCase/batchSaveOrUpdateTaskTestCase', data)
}

/*
* 删除测试用例
*/
export function deleteCase (data) {
  return _$http.post(baseURL + '/taskTestCase/batchDeleteTaskTestCase', data)
}

/*
* 查询项目的下拉菜单
*/
export function queryTopicDropdownList () {
  return _$http.get(baseURL + '/topic/queryTopicDropdownList')
}

/*
* 查询执行状态下拉菜单
*/
export function getTestExecutionMap () {
  return _$http.get(baseURL + '/testExecution/getTestExecutionMap')
}

/*
* 执行状态完成
*/
export function completeTaskStatus (data) {
  return _$http.get(baseURL + '/testTask/completeTaskStatus', data)
}

/*
* 执行发送测试报告邮件
*/
export function sendTestTaskEmail (data) {
  return _$http.post(baseURL + '/testTask/sendTestTaskEmail', data)
}

/*
* 执行状态完成并发送邮件
*/
export function completeTaskAndEmail (data) {
  return _$http.post(baseURL + '/testTask/completeTaskAndEmail', data)
}

/*
* 执行状态重启
*/
export function restartTaskStatus (data) {
  return _$http.get(baseURL + '/testTask/restartTaskStatus', data)
}

/*
* 执行状态重启
*/
export function getTestExeMethodMap () {
  return _$http.get(baseURL + '/testTask/getTestExeMethodMap')
}

/*
* 执行状态重启
*/
export function getAppInfoList () {
  return _$http.get(baseURL + '/testTask/getAppInfoList')
}

/*
* 获取创建bug需要的必要信息
*/
export function queryDemandInfo (param) {
  return _$http.post(baseURL + '/testExecution/queryDemandInfo?taskId=' + param)
}

/*
* 一键生成bug
*/
export function createBugByInfo (data) {
  return _$http.post(baseURL + '/testExecution/createBugByInfo', data)
}
