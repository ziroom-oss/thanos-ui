/*
 * @Author: your name
 * @Date: 2021-07-29 15:31:01
 * @LastEditTime: 2021-08-12 14:21:15
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \quality-defense-initiative\src\api\model\singleApiCaseLatestReport.js
 */
import request from '@/utils/request'
const preInterface = 'quality-defende-provider'

export function getCaseList (query) {
  return request('/caseEntitiesByCaseIds', {
    method: 'get',
    params: query
  }, 'godzilla')
}

// 旧接口/caseLatestDetail
export function caseLatestDetail (data) {
  return request('/execTask/auto-execution-record/latestExecutionRecord', {
    method: 'post',
    data
  }, 'godzilla', preInterface)
}
