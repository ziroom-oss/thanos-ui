import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

export function queryTestConfigSettingByPage (data) {
  return _$http.post(baseURL + '/testConfigSetting/queryTestConfigSettingByPage', data)
}
