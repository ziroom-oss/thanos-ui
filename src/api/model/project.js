/*
 * @Author: your name
 * @Date: 2021-05-27 20:41:15
 * @LastEditTime: 2021-06-02 18:59:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/api/model/project.js
 */
import _$http from '../http'
import { baseURL } from '@/config/baseConfig.config.js'

/**
 * @description: 创建日报
 * @param {*} topicId 项目id
 * @return {*}
 */
export function queryCreateReport (params) {
  return _$http.get(baseURL + '/dailyTestReport/createDailyTestReport', params)
}

/**
 * @description: 查看日报
 * @param {*}  id
 * @return {*}
 */
export function queryCheckReport (params) {
  return _$http.get(baseURL + '/dailyTestReport/findDailyReportInfo', params)
}

/**
 * @description: 全部项目列表
 * @param {*} 无
 * @return {*}
 */
export function queryAllrojectList (params) {
  return _$http.post(baseURL + '/topic/queryListByPage', params)
}

/**
 * @description: 参与的项目列表
 * @param {*} 无
 * @return {*}
 */
export function queryMyrojectList (data) {
  return _$http.post(baseURL + '/topic/queryLoginListByPage', data)
}

/**
 * @description: 历史日报列表
 * @param {*} 无
 * @return {*}
 */
export function queryHistoryReportList (params) {
  return _$http.post(baseURL + '/dailyTestReport/queryListByPage', params)
}

/**
 * @description: 已关联风险
 * @param {*} 无
 * @return {*}
 */
export function queryAlreadyRiskList (params) {
  return _$http.get(baseURL + '/topicRiskRel/queryRelList', params)
}

/**
 * @description: 未关联风险
 * @param {*} 无
 * @return {*}
 */
export function queryUnknownRiskList (params) {
  return _$http.get(baseURL + '/topicRiskRel/queryUnRelList', params)
}

/**
 * @description: 保存关联风险
 * @param {*} 无
 * @return {*}
 */
export function querySaveRiskList (params) {
  return _$http.get(baseURL + '/topicRiskRel/saveRelInfo', params)
}

/**
 * @description: 创建风险
 * @param {*} 无
 * @return {*}
 */
export function queryCreateRisk (params) {
  return _$http.get(baseURL + '/topicRiskRel/createRiskInfo', params)
}
/**
 * @description: 获取邮箱信息
 * @param {*} 无
 * @return {*}
 */
export function findDailyTestReportEmail (params) {
  return _$http.get(baseURL + '/dailyTestReport/findDailyTestReportEmail', params)
}
/**
 * @description: 保存邮箱
 * @param {*} 无
 * @return {*}
 */
export function saveDailyTestReportEmail (data) {
  return _$http.post(baseURL + '/dailyTestReport/saveDailyTestReportEmail', data)
}
/**
 * @description: 查询今天有没有日报
 * @param {*} 无
 * @return {*}
 */
export function checkNewDailyReport (params) {
  return _$http.get(baseURL + '/dailyTestReport/checkNewDailyReport', params)
}
/**
 * @description: 日报邮箱发送接口
 * @param {*} 无
 * @return {*}
 */
export function sendDailyTestReportEmail (params) {
  return _$http.get(baseURL + '/dailyTestReport/sendDailyTestReportEmail', params)
}
/**
 * @description: 日报邮箱预览接口
 * @param {*} 无
 * @return {*}
 */
export function emailPreview (params) {
  return _$http.get(baseURL + '/dailyTestReport/emailPreview', params)
}
