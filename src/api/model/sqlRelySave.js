import request from '@/utils/request'

export function getDatabaseIp () {
  return request('/getDatabaseIpList', {
    method: 'get'
  }, 'godzilla'
  )
}

export function getDatabaseName (query) {
  return request('/getDataBaseEntity', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function saveSqlInfo (query) {
  return request('/saveSqlInfoEntity', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function runSqlInfo (query) {
  return request('/runSqlInfo', {
    method: 'get',
    params: query
  }, 'godzilla')
}
