import request from '@/utils/request'

export function getOmegaProjectList () {
  return request(
    '/apiTaskSet/getOmegaProjectList',
    {
      method: 'get'
    },
    'godzilla'
  )
}

export function addApiTaskSet (data) {
  return request(
    '/apiTaskSet/addApiTaskSet',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function getApiTaskSetList (param, data) {
  return request(
    '/apiTaskSet/getApiTaskSetList',
    {
      method: 'post',
      params: param,
      data
    },
    'godzilla'
  )
}

export function getTaskSetDetailBySetId (param) {
  return request(
    '/apiTaskSet/getTaskSetDetailBySetId',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getMultiTaskSetDetailBySetId (param) {
  return request(
    '/apiTaskSet/getMultiTaskSetDetailBySetId',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function changeCaseMockStatus (data) {
  return request(
    '/apiTaskSet/changeCaseMockStatus',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function editTaskSetInfoBySetId (data) {
  return request(
    '/apiTaskSet/editTaskSetInfoBySetId',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function getTaskSetDetailInfoBySetId (param) {
  return request(
    '/apiTaskSet/getTaskSetDetailInfoBySetId',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function multiApiTaskSetRun (data) {
  return request(
    '/apiTaskSet/multiApiTaskSetRun',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function singleApiTaskSetRun (data) {
  return request(
    '/apiTaskSet/singleApiTaskSetRun',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function getMultiApiTaskSetReport (param) {
  return request(
    '/apiTaskSet/getMultiApiTaskSetReport',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getTaskSetReportDetailByVersion (param) {
  return request(
    '/apiTaskSet/getTaskSetReportDetailByVersion',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getTaskSetByCdVersion (param) {
  return request(
    '/apiTaskSet/getTaskSetByCdVersion',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getTotalTaskSetLatestReport (param) {
  return request(
    '/apiTaskSet/getTotalTaskSetLatestReport',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getTaskSetTypeBySetId (param) {
  return request(
    '/apiTaskSet/getTaskSetTypeBySetId',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getMultiApiTaskSetReportDetail (param) {
  return request(
    '/apiTaskSet/getMultiApiTaskSetReportDetail',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function checkIsExistLatestReportBySetApiType (param) {
  return request(
    '/apiTaskSet/checkIsExistLatestReportBySetApiType',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function taskSetAutoRunByOmega () {
  return request(
    '/apiTaskSet/taskSetAutoRunByOmega',
    {
      method: 'get'
    },
    'godzilla'
  )
}
