import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

/*
* 测试执行列表
*/
export function validateIssueKey (data) {
  return _$http.get(baseURL + '/jiraIssue/validateIssueKey', data)
}
