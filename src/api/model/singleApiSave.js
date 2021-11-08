import request from '@/utils/request'
const preInterface = 'quality-defende-provider'

export function getBusiList () {
  return request(
    '/getAllBusinessLineList',
    {
      method: 'get'
    },
    'godzilla'
  )
}
export function getGitList () {
  return request(
    '/getAllGitProjectNameList',
    {
      method: 'get'
    },
    'godzilla'
  )
}

/**
 * 收藏应用
 * @param {data} p1
 * @return void
 */
// 旧接口 '/user-follow-application/follow'
export function followApplication (data) {
  return request(
    '/caseRepository/auto-user-follow-application/follow',
    {
      method: 'post',
      data
    },
    'godzilla',
    preInterface
  )
}

/**
 * 取消收藏
 * @param {data} p1
 * @return void
 */

export function unFollowApplication (data) {
  return request(
    '/caseRepository/auto-user-follow-application/cancelFollow',
    {
      method: 'post',
      data
    },
    'godzilla',
    preInterface
  )
}

export function getDeptList () {
  return request(
    '/deptList',
    {
      method: 'get'
    },
    'godzilla'
  )
}

export function getSqlList (query) {
  return request(
    '/sqlList',
    {
      method: 'get',
      params: query
    },
    'godzilla'
  )
}
export function getSqlInfoById (query) {
  return request('/getSqlInfoById', {
    method: 'get',
    params: query
  }, 'godzilla')
}
export function getSqlByName (query) {
  return request('/getSqlByName', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function getbelong (query) {
  return request(
    '/getSystemAndBusinessLineByDomain',
    {
      method: 'get',
      params: query
    },
    'godzilla'
  )
}

export function getRelyList (query) {
  return request(
    '/singleApiCaseRelyList',
    {
      method: 'get',
      params: query
    },
    'godzilla'
  )
}
// 旧接口/saveSingleApi
export function saveApi (data) {
  return request(
    '/caseRepository/auto-single-api-case/saveSingleApiCase',
    {
      method: 'post',
      data
    },
    'godzilla',
    preInterface
  )
}
// 旧接口/saveSingleApiV2
export function saveSingleApiV2 (data) {
  return request(
    '/caseRepository/auto-single-api/saveSingleApi',
    {
      method: 'post',
      data
    },
    'godzilla',
    preInterface
  )
}

/**
 * 修改模块
 * @param {Object} data 参数描述
 * @return void
 */
// 旧接口/headerUpdateByApp
export function headerUpdateByApp (data) {
  return request(
    '/caseRepository/auto-single-api/headerUpdateByApp',
    {
      method: 'post',
      data
    },
    'godzilla',
    preInterface
  )
}

// 旧接口/runSingleApi
export function runApi (data) {
  return request(
    '/execTask/auto-execution-record/runCaseByDetail',
    {
      method: 'post',
      data
    },
    'godzilla',
    preInterface
  )
}

// 旧接口/checkCaseExist
export function checkExit (data) {
  return request(
    '/caseRepository/auto-single-api-case/checkCaseExist',
    {
      method: 'post',
      data
    },
    'godzilla',
    preInterface
  )
}

export function cryptParam (data) {
  return request(
    '/encryption',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}
