/*
 * @Author: liuxr3
 * @Date: 2021-05-20 11:10:29
 * @LastEditTime: 2021-05-25 16:51:53
 * @LastEditors: Please set LastEditors
 * @Description: 模块当前选中节点
 * @FilePath: /quality-defense-initiative/src/store/modules/module.js
 */
export default {
  state: {
    checkedModuleData: {}
  },
  mutations: {
    SET_MODULE_DATA (state, data) {
      state.checkedModuleData = data
    }
  },
  actions: {
    queryCheckedModuleData ({ commit }, data) {
      return new Promise((resolve, reject) => {
        try {
          commit('SET_MODULE_DATA', data)
          resolve(data)
        } catch (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Set module info failed', err.message)
        }
      })
    }
  }
}
