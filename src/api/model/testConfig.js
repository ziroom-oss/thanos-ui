import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

/**
 * 分页查询
 * @param data
 * @returns {AxiosPromise}
 */
export function queryTestConfigByPage (data) {
  return _$http.post(baseURL + '/testConfig/queryTestConfigByPage', data)
}

/**
 * 根据ID查询详情用例属性
 * @param params
 * @returns {AxiosPromise}
 */
export function queryTestConfigById (params) {
  return _$http.get(baseURL + '/testConfig/queryTestConfigById', params)
}

/**
 * 保存或编辑用例属性
 * @param data
 * @returns {AxiosPromise}
 */
export function saveOrUpdateTestConfig (data) {
  return _$http.post(baseURL + '/testConfig/saveOrUpdateTestConfig', data)
}

/**
 * 根据ID删除属性值
 * @param params
 * @returns {AxiosPromise}
 */
export function deteleTestConfigOptionsById (params) {
  return _$http.get(baseURL + '/testConfigOptions/deteleTestConfigOptionsById', params)
}

/**
 * 根据ID删除用例属性
 * @param params
 * @returns {AxiosPromise}
 */
export function deleteTestConfigById (params) {
  return _$http.get(baseURL + '/testConfig/deleteTestConfigById', params)
}
