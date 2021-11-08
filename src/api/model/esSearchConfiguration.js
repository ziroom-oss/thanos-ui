import request from '@/utils/request'

export function insertEsConfiguration (data) {
  return request(
    '/testTool/insertEsConfiguration',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function updateEsConfigurationById (data) {
  return request(
    '/testTool/updateEsConfigurationById',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function deleteEsConfigurationById (param) {
  return request(
    '/testTool/deleteEsConfigurationById',
    {
      method: 'post',
      params: param
    },
    'godzilla'
  )
}

export function getEsConfigurationList (param, data) {
  return request(
    '/testTool/getEsConfigurationList',
    {
      method: 'post',
      params: param,
      data
    },
    'godzilla'
  )
}

export function getEsConfigurationById (param) {
  return request(
    '/testTool/getEsConfigurationById',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getEsConnectionList () {
  return request(
    '/testTool/getEsConnectionList',
    {
      method: 'get'
    },
    'godzilla'
  )
}

export function insertEsSearchCondition (data) {
  return request(
    '/relyInfo/insertEsSearchCondition',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function updateEsSearchConditionById (data) {
  return request(
    '/relyInfo/updateEsSearchConditionById',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function deleteEsSearchConditionById (param) {
  return request(
    '/relyInfo/deleteEsSearchConditionById',
    {
      method: 'post',
      params: param
    },
    'godzilla'
  )
}

export function getEsSearchConditionById (param) {
  return request(
    '/relyInfo/getEsSearchConditionById',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getEsSearchConditionList (param, data) {
  return request(
    '/relyInfo/getEsSearchConditionList',
    {
      method: 'post',
      params: param,
      data
    },
    'godzilla'
  )
}

export function esSearchConditionSearch (param) {
  return request(
    '/relyInfo/esSearchConditionSearch',
    {
      method: 'post',
      params: param
    },
    'godzilla'
  )
}
