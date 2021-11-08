import request from '@/utils/request'
const preInterface = 'quality-defende-provider'

// 旧接口/apiStorage/upload
export function uploadApiFile (data) {
  return request(
    '/caseRepository/auto-single-api-case/upload',
    {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: data
    },
    'godzilla',
    preInterface
  )
}

export function readApiList (query) {
  return request(
    '/apiStorage/apiList',
    {
      method: 'get',
      params: query
    },
    'godzilla'
  )
}

export function saveSingleApiList (data) {
  return request(
    '/apiStorage/saveSingleApiList',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function removeFiles () {
  return request(
    '/apiStorage/clean',
    {
      method: 'get'
    },
    'godzilla'
  )
}

export function analyzeSwaggerUrl (query) {
  return request(
    '/apiStorage/swaggerApiList',
    {
      method: 'get',
      params: query
    },
    'godzilla'
  )
}
// 旧接口/apiStorage/synchronizeApiByUrl
export function analyzeSwaggerApiByUrl (data) {
  return request(
    '/caseRepository/auto-application-properties/synchronizeApiByUrl',
    {
      method: 'post',
      params: data,
      headers: { 'Content-Type': 'multipart/form-data' }
    },
    'godzilla',
    preInterface
  )
}

// 旧接口/apiStorage/getApplicationNameByDomain
export function getApplicationName (query) {
  return request(
    '/caseRepository/auto-application-properties/getApplicationNameByDomain',
    {
      method: 'post',
      params: query
    },
    'godzilla',
    preInterface
  )
}

export function updateAnalyzeSwagger (data) {
  return request(
    '/caseRepository/auto-application-properties/saveOrUpdate',
    {
      method: 'post',
      data
    },
    'godzilla',
    preInterface
  )
}

export function getSwagger (data) {
  return request(
    '/caseRepository/auto-application-properties/find',
    {
      method: 'post',
      data
    },
    'godzilla',
    preInterface
  )
}
