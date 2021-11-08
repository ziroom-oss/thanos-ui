import request from '@/utils/request'
const preInterface = 'quality-defende-provider'

export function getRelyApiCaseList (query) {
  return request('/findRelySingleApiCaseListByPaging', {
    method: 'get',
    params: query
  }, 'godzilla')
}

// 获取断言
// 旧接口'/getSingleApiCaseById'
export function getSingleApiCaseById (query) {
  return request('/caseRepository/auto-single-api-case/findSingleApiById', {
    method: 'post',
    params: query
  }, 'godzilla', preInterface)
}

export function getUserList () {
  return request('/getUserList', {
    method: 'get'
  }, 'godzilla')
}
export function getSytemList () {
  return request('/getSystemInfoList', {
    method: 'get'
  }, 'godzilla')
}
export function runCase (query) {
  return request('/runCase', {
    method: 'get',
    params: query
  }, 'godzilla')
}
