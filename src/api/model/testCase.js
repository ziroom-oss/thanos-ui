/*
 * @Author: liuxr3
 * @Date: 2021-03-12 10:14:41
 * @LastEditTime: 2021-05-19 18:59:47
 * @LastEditors: Please set LastEditors
 * @Description: 测试用例接口
 * @FilePath: /quality-defense-initiative/src/api/model/testCase.js
 */
import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

/*
* 测试用例列表
*/
export function queryTestCaseData (data) {
  return _$http.post(baseURL + '/testCase/queryTestCaseByPage', data)
}

/*
* 组织结构
*/
export function getEhrInfo () {
  return _$http.get(baseURL + '/ehr/getEhrInfo')
}

/*
* 所属系统
*/
export function getBelongSystem (params) {
  return _$http.get(baseURL + '/ci/queryApplicationEnvByLevelAndDomain', params)
}

/*
* 所属模块
*/
export function getBelongModule (params) {
  return _$http.get(baseURL + '/systemModule/querySystemModuleByDomainNameAndModuleName', params)
}

/*
* 所属模块
*/
export function getCaseStatus () {
  return _$http.get(baseURL + '/testCase/getTestCaseStatusList')
}

/*
* 检验所属系统是否存在
*/
export function checkIfSystem (params) {
  return _$http.get(baseURL + '/testCase/validateBelongToSystem', params)
}

/*
* 检验测试用例名称是否唯一
*/
export function checkOnlyCaseName (params) {
  return _$http.get(baseURL + '/testCase/validateTestcaseName', params)
}

/*
* 新增测试用例
*/
export function saveTestCase (data) {
  return _$http.post(baseURL + '/testCase/saveTestCase', data)
}

/*
* 下载测试用例模板
*/
export function downloadCaseDemo (data) {
  return _$http.download(baseURL + '/testCase/exportTestCaseExcelTemplate', data)
}

/*
* 更新测试用例
*/
export function updateTestCase (data) {
  return _$http.post(baseURL + '/testCase/updateTestCase', data)
}

/*
* 批量删除测试用例
*/
export function batchDeleteTestCase (params) {
  return _$http.get(baseURL + '/testCase/batchDeleteTestCase', params)
}

/*
* 根据id获取用例详情信息
*/
export function getTestCaseDetailById (params) {
  return _$http.get(baseURL + '/testCase/getTestCaseDetailById', params)
}

/*
* 批量审批测试用例
*/
export function batchApprovedTestCase (data) {
  return _$http.post(baseURL + '/testCase/batchApprovedTestCase', data)
}

/*
* 校验jiraid是否正确
*/
export function validateIssueKey (params) {
  return _$http.get(baseURL + '/jiraIssue/validateIssueKey', params)
}

/*
* 获取历史版本回溯
*/
export function queryTestCaseHistoryByCaseId (params) {
  return _$http.get(baseURL + '/testCase/queryTestCaseHistoryByCaseId', params)
}

/*
* 查询待审核的数量
*/
export function queryIdsByUncheck (data) {
  return _$http.post(baseURL + '/testCase/queryIdsByUncheck', data)
}

/*
* 获取测试级别列表
*/
export function queryTestLevelTypeList (params) {
  return _$http.get(baseURL + '/dataDictionary/queryTestLevelTypeList', params)
}

/*
* 获取模块列表
*/
export function queryModuleList (params) {
  return _$http.get(baseURL + '/applicatioin/queryApplicationAndModule', params)
}

/*
* 获取测试类型列表
*/
export function queryTestCaseTypeList () {
  return _$http.get(baseURL + '/dataDictionary/queryTestStrategyTypeList')
}

/*
* 获取测试所属平台（所属端）列表
*/
export function queryTestStrategyTypeList () {
  return _$http.get(baseURL + '/dataDictionary/queryTestApplicationTypeList')
}

/*
* 获取所有用例变更类型
*/
export function queryTestChangeTypeList (params) {
  return _$http.get(baseURL + '/dataDictionary/queryTestChangeTypeList', params)
}

/*
* 获取所有应用列表
*/
export function queryAppList () {
  return _$http.get(baseURL + '/applicatioin/findAllApplication')
}

/*
* 获取所有应用列表EhrTreePath
*/
export function queryAppListByEhrTreePath (params) {
  return _$http.get(baseURL + '/applicatioin/findAllApplicationByEhrTreePath', params)
}

/*
* 获取所有应用列表
*/
export function queryModuleInAppList (params) {
  return _$http.get(baseURL + '/applicationModule/queryApplicationModuleTreeByApplicationId', params)
}

/*
* 获取人员名单
*/
export function getEhrUserDetailLikeUserName (params) {
  return _$http.get(baseURL + '/matrix/getEhrUserDetailLikeUserName', params)
}

/*
* 获取审核通过的测试用例id集合
 */
export function queryIdsByCheckPass (params) {
  return _$http.post(baseURL + '/testCase/queryIdsByCheckPass', params)
}

/*
* 自动化测试查询所有数据库和表
 */
export function queryDatabaseList (params) {
  return _$http.post(baseURL + '/data/auto-data-database/list', params)
}

/*
* 自动化测试验证连接
 */
export function testConnection (params) {
  return _$http.post(baseURL + '/data/auto-data-database/validateConnection', params)
}

/*
* 自动化测试新建连接
 */
export function saveConnection (params) {
  return _$http.post(baseURL + '/data/auto-data-database/save', params)
}

/*
* 自动化测试更新连接
 */
export function updateConnection (params) {
  return _$http.post(baseURL + '/data/auto-data-database/updateById', params)
}

/*
* 自动化测试执行批量SQL
 */
export function execSQLList (params) {
  return _$http.post(baseURL + '/data/auto-data-database/execSQLList', params)
}

/*
* 自动化测试用例编辑
 */
export function runCaseByDetail (params) {
  return _$http.post(baseURL + '/execTask/auto-execution-record/runCaseByDetail', params)
}
