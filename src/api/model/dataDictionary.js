import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

/*
* 获取应用类型
*/
export function queryTestApplicationTypeList () {
  return _$http.get(baseURL + '/dataDictionary/queryTestApplicationTypeList')
}

/**
 * 获取用例属性列表值
 * @returns {AxiosPromise}
 */
export function queryFieldTypeList () {
  return _$http.get(baseURL + '/dataDictionary/queryFieldTypeList')
}
