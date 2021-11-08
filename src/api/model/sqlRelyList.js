import request from '@/utils/request'

export function getSqlInfoList (query) {
  return request('/getSqlInfoList', {
    method: 'get',
    params: query
  }, 'godzilla'
  )
}

export function deleteSql (query) {
  return request('/deleteSqlById', {
    method: 'post',
    params: query
  }, 'godzilla'
  )
}

export function getSqlInfoById (query) {
  return request('/getSqlInfoById', {
    method: 'get',
    params: query
  }, 'godzilla'
  )
}

export function updateSqlInfo (query) {
  return request('/updateSqlInfoById', {
    method: 'post',
    params: query
  }, 'godzilla'
  )
}
