/**
 *
 */
import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

/**
* 所属模块
*/
export function queryTestApplicationByPage (data) {
  return _$http.post(baseURL + '/applicatioin/queryTestApplicationByPage', data)
}

/**
 * 验证应用名称唯一
 * @param params
 */
export function validateTestApplicationName (params) {
  return _$http.get(baseURL + '/applicatioin/validateTestApplicationName', params)
}

export function saveOrUpdateTestApplication (data) {
  return _$http.post(baseURL + '/applicatioin/saveOrUpdateTestApplication', data)
}

export function queryTestApplicationDetailById (params) {
  return _$http.get(baseURL + '/applicatioin/queryTestApplicationDetailById', params)
}

export function queryApplicationModuleTreeByApplicationId (params) {
  return _$http.get(baseURL + '/applicationModule/queryApplicationModuleTreeByApplicationId', params)
}

export function validateModuleName (data) {
  return _$http.post(baseURL + '/applicationModule/validateModuleName', data)
}

/**
 * 新增测试模块
 * @param data
 * @returns {AxiosPromise}
 */
export function appendChildApplicationModule (data) {
  return _$http.post(baseURL + '/applicationModule/appendChildApplicationModule', data)
}

/**
* 删除测试模块
* data Object
*/
export function deleteTestApplicationModule (params) {
  return _$http.get(baseURL + '/applicationModule/deleteTestApplicationModuleById', params)
}

/**
* 修改测试模块
* data Object
*/
export function updateApplicationModuleName (data) {
  return _$http.post(baseURL + '/applicationModule/updateApplicationModuleNameById', data)
}

/**
 * 删除应用
 * @param params
 * @returns {AxiosPromise}
 */
export function deleteTestApplicationById (params) {
  return _$http.get(baseURL + '/applicatioin/deleteTestApplicationById', params)
}

/**
 * 关注应用
 * @param params
 * @returns {AxiosPromise}
 */
export function followApplication (params) {
  return _$http.get(baseURL + '/testAppUserRel/followApplication', params)
}

/**
 * 关注应用
 * @param params
 * @returns {AxiosPromise}
 */
export function unfollowApplication (params) {
  return _$http.get(baseURL + '/testAppUserRel/unfollowApplication', params)
}

/**
 * wo关注应用
 * @param params
 * @returns {AxiosPromise}
 */
export function queryMyApplicationAndModule (params) {
  return _$http.get(baseURL + '/applicatioin/queryMyApplicationAndModule', params)
}

/**
 * 模块转移
 * @param params
 * @returns {AxiosPromise}
 */
export function shiftModule (data) {
  return _$http.post(baseURL + '/applicationModule/shiftModule', data)
}
