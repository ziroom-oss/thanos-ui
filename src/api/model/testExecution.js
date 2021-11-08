import _$http from '../http'

const baseURL = '/quality-defende-provider'

/*
* 测试用例执行
*/
export function queryTestCaseDataByTaskId (data) {
  return _$http.post(baseURL + '/testExecution/queryTestCaseByPage', data)
}

export function getCaseStatusNumber (data) {
  return _$http.get(baseURL + '/testExecution/getCaseStatusNumber', data)
}

export function batchExecuteTestCase (data) {
  return _$http.post(baseURL + '/testExecution/batchExecuteTestCase', data)
}

/*
* 关联bug
*/
export function markTestCaseFail (data) {
  return _$http.post(baseURL + '/testExecution/markTestCaseFail', data)
}

/*
* 查询关联测试用例
*/
export function queryRelTestCaseByPage (data) {
  return _$http.post(baseURL + '/taskTestCase/queryRelTestCaseByPage', data)
}

/*
* 查询运行返显
*/
export function getCaseDetailById (param) {
  return _$http.get(baseURL + '/taskTestCase/getCaseDetailById', param)
}

/*
* 测试用例历史
*/
export function getTestExecutionHistory (data) {
  return _$http.post(baseURL + '/testExecution/getTestExecutionHistory', data)
}
