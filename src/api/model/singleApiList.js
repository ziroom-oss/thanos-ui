import request from '@/utils/request'
const preInterface = 'quality-defende-provider'

export function getDeptTreeList (query) {
  return request('/getDeptTreeListByBusinessLineCode', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function addModule (query) {
  return request('/insertSystemMoudleBySystemInfoId', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function deleteModule (query) {
  return request('/deleteSystemModuleById', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function commitEditModule (query) {
  return request('/updateSystemMoudleById', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function deleteApi (query) {
  return request('/deleteSingleApiById', {
    method: 'get',
    params: query
  }, 'godzilla')
}
// 旧接口/deleteSingleApiCaseById
export function deleteCase (data) {
  return request('/caseRepository/auto-single-api-case/deleteSingleApiCaseById', {
    method: 'post',
    data
  }, 'godzilla', preInterface)
}

export function getSingleApiList (query) {
  return request('/findSingleApiListByPaging', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function parseJson (query) {
  return request('/parseParamterToJson', {
    method: 'post',
    params: query,
    emulateJSON: true
  }, 'godzilla')
}

export function updateSingleApiParam (data) {
  return request('/updateSingleApiCaseParams', {
    method: 'post',
    data
  }, 'godzilla')
}

export function runInterface (query) {
  return request('/runInterface', {
    method: 'get',
    params: query
  }, 'godzilla')
}

// 旧接口/runCase
export function runCase (data) {
  return request('/execTask/auto-execution-record/runCaseByIdList', {
    method: 'post',
    data
  }, 'godzilla', preInterface)
}

// 获取环境列表
export function getEnvList () {
  return new Promise((resolve, reject) => {
    return resolve({
      data: [
      //   {
      //   name: '日常环境',
      //   value: 'daily'
      // },
        {
          name: 'QA环境',
          value: 'qua'
        }]
    })
  })
  // return request('/runCase', {
  //   method: 'get',
  //   params: query
  // }, 'godzilla')
}

export function getCaseTableList (query) {
  return request('/findSingleApiCaseListByPaging', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function updateSingleApi (query) {
  return request('/updateSingleApi', {
    method: 'post',
    params: query
  }, 'godzilla')
}

export function copySingleApi (query) {
  return request('/copySingleApi', {
    method: 'post',
    params: query
  }, 'godzilla')
}

// 更改Apirunnable状态
export function changeRunStatus (query) {
  return request('/updateSingleApiRunnableById', {
    method: 'get',
    params: query

  }, 'godzilla')
}

// 更改case的runnable状态
export function changeCaseRunStatus (query) {
  return request('/updateSingleApiCaseRunnableById', {
    method: 'get',
    params: query
  }, 'godzilla')
}

// 更新编辑信息
export function updateSingleApiCase (data) {
  return request('/updateSingleApiCaseById', {
    method: 'post',
    data

  }, 'godzilla')
}

// 更新编辑信息
export function updateSingleApiAndCase (data) {
  return request('/updateSingleApiAndCaseById', {
    method: 'post',
    data

  }, 'godzilla')
}

// 获取单接口下的所有用例
export function getSingleApiCaseListByApiId (query) {
  return request('/getSingleApiCaseListByApiId', {
    method: 'get',
    params: query
  }, 'godzilla')
}

//
export function updateCopySingleApiCase (data) {
  return request('/copySingleApiCase', {
    method: 'post',
    data

  }, 'godzilla')
}

export function getAllBusinessLineList () {
  return request('/getAllBusinessLineList', {
    method: 'get'
  }, 'godzilla')
}

export function getModelList (query) {
  return request('/getSystemMoudleListBySystemInfoId', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function submitBound (query) {
  return request('/updateSingleApiModouleId', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function getSytemList () {
  return request('/getSystemInfoList', {
    method: 'get'
  }, 'godzilla')
}

export function getSystemListByDept (param) {
  return request('/getSystemListByDeptCode', {
    method: 'get',
    params: param
  }, 'godzilla')
}

export function getUserList () {
  return request('/getUserList', {
    method: 'get'
  }, 'godzilla')
}

export function getSwaggerApiParam (query) {
  return request('/getApiParamInfo', {
    method: 'get',
    params: query
  }, 'godzilla')
}

export function swaggerApiInfoCommit (query) {
  return request('/saveApiParamPropertyInfo', {
    method: 'post',
    params: query
  }, 'godzilla')
}
export function convertPostParamToStr (data) {
  return request('/convertPostParamToStr', {
    method: 'post',
    data
  }, 'godzilla')
}
export function fetchCaseList (param, data) {
  return request('/findSingleApiListTableData', {
    method: 'post',
    params: param,
    data
  }, 'godzilla')
}

/**
 * 查询接口列表
 */
// 旧接口'/findSingleApiListTableDataV3'
export function findSingleApiListTableDataV3 (param, data) {
  return request('/caseRepository/auto-single-api-case/findSingleApiListTableData', {
    method: 'post',
    params: param,
    data
  }, 'godzilla', preInterface)
}
/**
 * 查询参与的应用
 */
// 旧接口'/myJoinApplication'
export function myJoinApplication (param, data) {
  return request('/caseRepository/auto-user-follow-application/myJoinApplication', {
    method: 'POST',
    params: param,
    data
  }, 'godzilla', preInterface)
}

// 旧接口/myJoinApplicationSimple
export function myJoinApplicationSimple (param, data) {
  return request('/caseRepository/auto-application-properties/myJoinApplicationSimple', {
    method: 'POST',
    params: param,
    data
  }, 'godzilla', preInterface)
}
/**
 * 查询tags列表
 */

export function getApiTags (param, data) {
  return request('/getApiTags', {
    method: 'POST',
    params: param,
    data
  }, 'godzilla')
}
