/*
 * @Author: liuxr3
 * @Date: 2021-04-13 14:48:33
 * @LastEditTime: 2021-04-13 16:19:08
 * @LastEditors: Please set LastEditors
 * @Description: 测试报告接口
 * @FilePath: /quality-defense-initiative/src/api/model/caseReport.js
 */
import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

/*
* 测试报告执行结果
*/
export function getCaseReportResult (params) {
  return _$http.get(baseURL + '/testTask/getTestReportStatusByTaskId', params)
}

/*
* 测试结果汇总
*/
export function getSummaryCaseExecution (params) {
  return _$http.get(baseURL + '/testTask/getTestReportSummaryByTaskId', params)
}

/*
* 测试结果
*/
export function querySummaryData (data) {
  return _$http.post(baseURL + '/testTask/getTestReportBugListByTaskId', data)
}

/*
* 测试报告明细
*/
export function queryCaseTestDetail (data) {
  return _$http.post(baseURL + '/testTask/getTestReportCaseListByTaskId', data)
}
