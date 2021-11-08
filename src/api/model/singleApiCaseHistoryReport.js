import request from '@/utils/request'

export function getCaseList (query) {
  return request('/caseEntityByCaseId', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function getCaseHistoryList (query) {
  return request('/caseHistoryDetail', {
    method: 'get',
    params: query
  }, 'godzilla')
}
