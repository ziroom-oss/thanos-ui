import request from '@/utils/request'

export function deleteMultiApiCaseById (query) {
  return request('/deteleMultiApiCaseById', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function preRunMultiApiCaseById (data) {
  return request('/preRunCaseById', {
    method: 'post',
    data
  }, 'godzilla')
}
export function runMultiApiCaseById (data) {
  return request('/runCaseById', {
    method: 'post',
    data
  }, 'godzilla')
}

export function updateMultiCaseStatus (params) {
  return request('/updateMultiCaseStatus', {
    method: 'get',
    params: params
  }, 'godzilla')
}

export function updateMultiEditStatus (params) {
  return request('/updateMultiEditStatus', {
    method: 'get',
    params: params
  }, 'godzilla')
}

export function getMultiCaseDtl (params) {
  return request('/getMultiApiStepsByCaseId', {
    method: 'get',
    params: params
  }, 'godzilla')
}

export function getMultiCaseList (data) {
  return request('/getMultiCaseListByPage', {
    method: 'post',
    data
  }, 'godzilla')
}

export function getMultiCaseToEditDtl (params) {
  return request('/editMultiApiCase', {
    method: 'get',
    params: params
  }, 'godzilla')
}

export function multiCaseReportToSelect (params) {
  return request('/multiCaseReportByCaseId', {
    method: 'get',
    params: params
  }, 'godzilla')
}
