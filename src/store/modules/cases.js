import { isEqual } from 'xe-utils'
import eventBus from '@/utils/eventBus'
import {
  Message
} from 'element-ui'
import {
  parseParams,
  parseHeaderTostring,
  parseParamsUrl,
  getJsonPathAssert
} from '@/utils/parse'
import { isJSON } from '@/utils/base'
import {
  saveApi
} from '@/api/model/singleApiSave'
import {
  updateSingleApiCase
} from '@/api/model/singleApiList'
import { runCaseByDetail, execSQLList } from '@/api/model/testCase'

function initData () {
  return {
    caseName: '', // 用例名称
    encryptType: '', // 加密方式
    testEnvUrl: '', // 测试域名
    requestParam: '', // 参数详情
    comment: '', // 用例描述
    env: 'qua', // 环境
    // contentType: '', // 表单提交方式
    rawData: '', // 选择了raw方式
    body: [{
      key: '',
      value: ''
    }],
    header: [{
      key: '',
      value: ''
    }],
    params: [{
      key: '',
      value: ''
    }],
    preSql: '',
    assertList: [], // 断言数组
    deleteAssertIds: '' // 要删除的数组
  }
}

export default {
  state: {
    caseForm: initData(),
    isRun: true, // 是否不可运行
    type: 'ADD', // 编辑，添加，复制
    callbackBody: {
      actualResult: '',
      recordResult: 0
    }, // 运行后返回的结果
    preSqlallbackBody: [], // Pre-request SQL运行后返回的结果
    selectTab: '',
    lastCaseForm: initData(), // 保存上一次对象
    headerTableDom: null, // 保存header中table的ref
    editSmartAssertDom: null, // 保存断言中的ref
    loading: false,
    isSaveCase: false,
    preRequest: '',
    intelligentAssertions: [],
    intelligentList: {},
  },
  mutations: {
    // 设置表单
    SET_CASE_FORM (state, data) {
      state.caseForm = {
        ...state.caseForm,
        ...data
      }
    },
    RESET_FORM_DATA (state) {
      state.caseForm = initData()
      state.lastCaseForm = initData()
      state.callbackBody = {
        returnValue: '',
        returnStatusCode: 0
      }
      state.preSqlallbackBody = []
      state.isRun = true
      state.lastCaseName = ''
      state.headerTableDom = null
      state.editSmartAssertDom = null
      state.type = 'ADD'
      state.loading = false
      state.isSaveCase = false
    },
    SET_CALLBACK_BODY (state, data) {
      state.callbackBody = data
    },
    SET_PRE_SQL_CALLBACK_BODY (state, data) {
      state.preSqlallbackBody = data
    },
    SET_SELECT_TAB (state, data) {
      state.selectTab = data
    },
    SET_TYPE (state, data) {
      state.type = data
    },
    SET_HEADER_TABLE_DOM (state, dom) {
      state.headerTableDom = dom
    },
    SET_EDIT_SMART_ASSERT_DOM (state, dom) {
      state.editSmartAssertDom = dom
    },
    SET_RUN_STATUS (state, data) {
      state.isRun = data
    },
    SET_LOADING (state, data) {
      state.loading = data
    },
    SET_IS_SAVE_CASE (state, data) {
      state.isSaveCase = data
    },
    SET_LAST_CASE_FORM (state, data) {
      state.lastCaseForm = { ...data }
    },
    SET_PREREQUEST (state, data) {
      state.preRequest = data
    },
    SET_INTELLIGENT_ASSERT (state, data) {
      state.intelligentAssertions = data
    },
    SET_INTELLIGENT_ASSERT_LIST (state, data) {
      state.intelligentList = data
    },
  },
  actions: {
    // 设置表单值
    setCaseForm ({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        try {
          commit('SET_CASE_FORM', data)
          resolve(data)
        } catch (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Set setCaseForm info failed', err.message)
        }
      })
    },
    saveCase ({
      state,
      dispatch
    }) {
      return new Promise((resolve, reject) => {
        try {
          return dispatch('concatParams').then((param) => {
            const type = state.type

            if (!isEqual(param, state.lastCaseForm)) {
              dispatch('setRunStatus', true)
              return Message.warning('你修改过用例，请先点击运行')
            }
            delete param.createTime
            if (type === 'ADD' || type === 'COPY') {
              saveApi(param).then((res) => {
                if (res.success) {
                  return resolve(res.data)
                }
              })
            } else if (type === 'EDIT') {
              saveApi(param).then((res) => {
                if (res.success) {
                  const { caseName } = state.caseForm
                  dispatch('setCaseForm', { caseName: caseName.replace(/^\[swagger生成.*\]/i, '') })

                  return resolve(res.data)
                }
              })
            }
          })
        } catch (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Set saveCase info failed', err.message)
        }
      })
    },
    // 运行用例
    runCase ({
      dispatch,
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        try {
          return dispatch('concatParams').then((param) => {
            // 保存当前form
            commit('SET_LAST_CASE_FORM', param)
            // commit('SET_LAST_CASE_FORM', JSON.parse(JSON.stringify(param)))
            commit('SET_LOADING', true)
            runCaseByDetail(param).then(({
              data
            }) => {
              const status = data?.recordResult === 'SUCCESS'
              const message = status ? 'success' : (data?.failCause ?? '运行失败')

              if (data.failCause === '断言不存在,请添加断言!') {
                eventBus.$emit('changeTab')
              }

              Message({
                type: status ? 'success' : 'error',
                message: `${message} ${data.recordResult === 'SUCCESS' ? '点击保存按钮可保存这条用例!' : ''}`
              })

              data.recordResult === 'SUCCESS' && commit('SET_IS_SAVE_CASE', true)
              commit('SET_CALLBACK_BODY', data)
              commit('SET_RUN_STATUS', !status)
              let actualResult = {}
              try {
                actualResult = JSON.parse(data?.actualResult)
              } catch {}

              commit('SET_INTELLIGENT_ASSERT_LIST', actualResult)
              return resolve(data?.recordResult)
            }).finally(() => {
              commit('SET_LOADING', false)
            })
          })
        } catch (err) {
          commit('SET_LOADING', false)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('RUNCASE info failed', err.message)
        }
      })
    },
    runCaseFisrt ({
      dispatch,
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        try {
          return dispatch('concatParams').then((param) => {
            runCaseByDetail(param).then(({
              data
            }) => {
              let actualResult = {}

              try {
                actualResult = JSON.parse(data?.actualResult)
              } catch {}
              commit('SET_INTELLIGENT_ASSERT_LIST', actualResult)
              return resolve(data?.actualResult)
            })
          })
        } catch (err) {
          reject('RUNCASE info failed', err.message)
        }
      })
    },
    apiSqlInfo ({
      dispatch,
      commit,
      state
    }, data) {
      return new Promise((resolve, reject) => {
        execSQLList(data)
          .then(res => {
            resolve(res.data)
            commit('SET_PRE_SQL_CALLBACK_BODY', res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    resetFormData ({
      commit
    }) {
      commit('RESET_FORM_DATA')
    },
    setPreSqlallbackBody ({
      commit
    }) {
      commit('SET_PRE_SQL_CALLBACK_BODY')
    },
    setIsSaveCase ({
      commit
    }) {
      commit('SET_IS_SAVE_CASE')
    },
    setSelectTab ({
      commit
    }, type) {
      commit('SET_SELECT_TAB', type)
    }, 
    setPreRequest ({
      commit
    }, type) {
      commit('SET_PREREQUEST', type)
    },
    setType ({
      commit
    }, type) {
      commit('SET_TYPE', type)
    },
    // 拼接
    concatParams ({
      state,
      dispatch
    }) {
      return new Promise((resolve) => {
        const {
          caseForm = {},
          preRequest
        } = state

        const {
          body = [],
          header = [],
          params = [],
          rawData,
          caseName,
          ...rest
        } = caseForm

        if (!caseName) {
          return Message.warning('请填写用例名称!')
        }

        const contentTypeRow = header?.find(item => item.key.toLowerCase() === 'content-type')
        const contentType = contentTypeRow?.value ?? ''
        const isRow = contentType.replace(/\n|\t| /g, '') === 'application/json'
        const param = parseParamsUrl(params)
        const requestBody = contentType !== '' ? (isRow ? rawData?.replace(/\n/g, '') : parseParams(body)) : ''

        if (requestBody && isRow && !isJSON(requestBody)) {
          return Message.warning('Body请输入合法的JSON格式')
        }

        dispatch('getAssertResult').then(({
          assertList,
          deleteAssertIds
        }) => {
          const data = {
            ...rest,
            header: parseHeaderTostring(header),
            requestBody: requestBody,
            caseName,
            // todo 暂时写死
            protocolType: 'http',
            requestParam: param,
            assertList,
            deleteAssertIds,
            updateTime: null,
            singleApiCaseList: null,
            preRequest: preRequest ? preRequest.toString() : ''
          }
          return resolve(data)
        })
      })
    },
    // 保存header的table
    setHeaderTableDom ({
      commit
    }, dom) {
      commit('SET_HEADER_TABLE_DOM', dom)
    },
    setEditSmartAssertDom ({
      commit
    }, dom) {
      commit('SET_EDIT_SMART_ASSERT_DOM', dom)
    },
    setIntelligentAssertions ({
      commit
    }, data) {
      commit('SET_INTELLIGENT_ASSERT', data)
    },
    setIntelligentList ({
      commit
    }, data) {
      commit('SET_INTELLIGENT_ASSERT_LIST', data)
    },
    // 设置是否可运行
    setRunStatus ({
      commit
    }, data) {
      commit('SET_RUN_STATUS', data)
    },
    // 设置loading
    setLoading ({
      commit
    }, data) {
      commit('SET_LOADING', data)
    },
    async getAssertResult ({
      state
    }) {
      const assertList = []
      const {
        editSmartAssertDom,
        intelligentAssertions
      } = state
      const tabs = editSmartAssertDom?.editableTabs || []
      const normalContent = editSmartAssertDom?.assertListData || []

      for (const tab of tabs) {
        if (tab.assertRadio === '1') {
          if (tab.schemaContent instanceof Object) {
            tab.schemaContent = JSON.stringify(tab.schemaContent)
          }
          const verifyData = tab.schemaContent.replace(/\r\n/g, '').replace(/\n/g, '')
          const assertType = 1
          assertList.push({
            id: tab.id,
            assertContent: verifyData,
            assertType
          })
        } else if (tab.assertRadio === '2') {
          const verifyData = getJsonPathAssert(tab)
          const assertType = 2
          assertList.push({
            id: tab.id,
            assertContent: verifyData,
            assertType
          })
        } else if (tab.assertRadio === '3') {
          const verifyData = tab.methodContent
          const assertType = 3
          assertList.push({
            id: tab.id,
            assertContent: verifyData,
            assertType
          })
        } else {
          const verifyData = tab.normalContent
          const assertType = 0
          if (verifyData?.trim()) {
            assertList.push({
              id: tab.id,
              assertContent: verifyData,
              assertType
            })
          }
        }
      }

      const ids = editSmartAssertDom.deleteAssertIds
      const deleteAssertIds = ids.substring(0, ids.length - 1)

      return {
        assertList: normalContent,
        deleteAssertIds
      }
    }
  }
}
