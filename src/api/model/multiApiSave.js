import request from '@/utils/request'

export function getSingleApiCaseList (query) {
  return request('/getSingleApiCase4MultilInterface', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function getMultiApiCaseList (query) {
  return request('/getMultiApiCaseList', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function getSqlList (query) {
  return request('/getSqlList4MultilInterface', {
    method: 'get',
    params: query
  }, 'godzilla')
}
export function getComponmentList (query) {
  return request('/getComponmentList', {
    method: 'get',
    params: query
  }, 'godzilla')
}
export function getCommonParamList (query) {
  return request('/getCommonParamListByComponmentId', {
    method: 'get',
    params: query
  }, 'godzilla')
}
export function formatMultiApiCaseSteps (query) {
  return request('/formatMultiApiCaseSteps', {
    method: 'get',
    params: query
  }, 'godzilla')
}
export function saveMultiApiCase (data) {
  return request('/saveMultiApiCase', {
    method: 'post',
    data
  }, 'godzilla')
}

export function makeDataDetailInfo (params) {
  return request('/makeData/makeDataDetailInfo', {
    method: 'get',
    params: params
  }, 'godzilla')
}

export function runMultiCaseData (params) {
  return request('/makeData/runData', {
    method: 'get',
    params: params
  }, 'godzilla')
}

export function preRunMultiCaseData (params) {
  return request('/makeData/preRunData', {
    method: 'get',
    params: params
  }, 'godzilla')
}

export function retryRunMultiCaseData (params, data) {
  return request('/makeData/retryRunData', {
    method: 'post',
    params: params,
    data
  }, 'godzilla')
}

export function moduleRunRecords (params) {
  return request('/makeData/moduleRunRecords', {
    method: 'get',
    params: params
  }, 'godzilla')
}
export function editMultiApiCase (data) {
  return request('/updateMultiApiCase', {
    method: 'post',
    data
  }, 'godzilla')
}
export function checkCaseName (params) {
  return request('/getMultiApiCaseEntityByCaseName', {
    method: 'get',
    params: params
  }, 'godzilla')
}

export function addComponentItem (data) {
  return request('/saveOrUpdateComponentItem', {
    method: 'post',
    data
  }, 'godzilla')
}
export function getComponentDetail (params) {
  return request('/getComponentDetail', {
    method: 'get',
    params: params
  }, 'godzilla')
}
export function verificationComponmentName (params) {
  return request('/verificationComponmentName', {
    method: 'get',
    params: params
  }, 'godzilla')
}
export function getComponmentBusinessLineList () {
  return request('/getComponmentBusinessLineList', {
    method: 'get'
  }, 'godzilla')
}
