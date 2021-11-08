import request from '@/utils/request'

export function fetchCaseList (data) {
  return request(
    '/performance/getJmxCaseList',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function getBusinessList () {
  return request(
    '/getAllBusinessLineList',
    {
      method: 'get'
    },
    'godzilla'
  )
}

export function notifyOrder (data) {
  return request(
    '/performance/notifyOrder',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function getTeamList () {
  return request(
    '/getUserGroupList',
    {
      method: 'get'
    },
    'godzilla'
  )
}

export function serverRestart () {
  return request(
    '/performance/jmeterAgentRestartK8s',
    // '/performance/jmeterAgentRestart',
    {
      method: 'get'
    },
    'godzilla'
  )
}

export function forceStopTest () {
  return request(
    '/performance/forceStopJMeterAgent',
    {
      method: 'get'
    },
    'godzilla'
  )
}

export function myFileUpload (data) {
  return request(
    '/performance/jmxUpload',
    {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: data
    },
    'godzilla'
  )
}

export function hasPermission (param) {
  return request(
    '/performance/hasPermission',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function saveCaseInfo (data) {
  return request(
    '/performance/saveCaseInfo',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function reSaveCaseInfo (data) {
  return request(
    '/performance/reSaveCaseInfo',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function saveConfPath (data) {
  return request(
    '/performance/updateConfPathK8s',
    // '/performance/updateConfPath',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function deleteJmxCase (data) {
  return request(
    '/performance/delJmxCaseById',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function getLatestJmxReport (param) {
  return request(
    '/performance/getLatestJmxReport',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getHistoryJmxReportById (param) {
  return request(
    '/performance/getHistoryJmxReportById',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getJmxTreeValue (param) {
  return request(
    '/performance/getJmxValue',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getJmxHashTreeValueByJmxPath (param) {
  return request(
    '/performance/getJmxHashTreeValueByJmxPath',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function updateJmxParam (param, data) {
  return request(
    '/performance/updateJmxValue',
    {
      method: 'post',
      params: param,
      data
    },
    'godzilla'
  )
}

export function isDownloadFileExist (param) {
  return request(
    '/performance/isDownloadFileExist',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getCaseRunSlave (param) {
  return request(
    '/performance/getJmeterServerListK8s',
    // '/performance/getJmeterServerList',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function slaveIsRunning (data) {
  return request(
    '/performance/slaveIsRunning',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function runJmxCaseById (data) {
  return request(
    '/performance/jmxCaseRun',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function jmxCaseRunVirtualForLocal (data) {
  return request(
    '/performance/jmxCaseRunVirtualForLocal',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function updateJmxRunCount (param) {
  return request(
    '/performance/updateJmxRunCountById',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getGrafanaKeyResult (param) {
  return request(
    '/performance/getGrafanaKeyResult',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function createScenario (data) {
  return request(
    '/performance/createScenarioK8s',
    // '/performance/createScenario',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function getJmxThreadGroupsParam (param) {
  return request(
    '/performance/getJmxThreadGroupsParam',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getJmxParamVariable (param) {
  return request(
    '/performance/getJmxParamVariable',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function getScenarioDtlById (param) {
  return request(
    '/performance/getScenarioDtlById',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function updateScenarioInfo (data) {
  return request(
    '/performance/updateScenarioInfo',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}
