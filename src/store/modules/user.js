/*
 * @Author: liuxr3
 * @Date: 2021-03-10 11:37:21
 * @LastEditTime: 2021-06-17 10:59:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/store/modules/user.js
 */

export default {
  namespaced: true,
  state: {
    username: '',
    token: '',
    menu: [],
    userInfo: {},
    role: ''
  },
  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },
    SET_USER_INFO (state, userInfo) {
      state.userInfo = userInfo
      state.username = userInfo.username
      state.menu = userInfo.menu
    },
    SET_ROLE (state, role) {
      state.role = role
    }
  },
  actions: {
    setUserinfo ({ commit }, data) {
      return new Promise((resolve, reject) => {
        try {
          commit('SET_USER_INFO', data)
          resolve(data)
        } catch (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Set user info failed', err.message)
        }
      })
    },
    setToken ({ commit }, data) {
      return new Promise((resolve, reject) => {
        try {
          commit('SET_TOKEN', data)
          resolve(data)
        } catch (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Set token failed', err.message)
        }
      })
    },
    setRole ({ commit }, data) {
      return new Promise((resolve, reject) => {
        try {
          commit('SET_ROLE', data)
          resolve(data)
        } catch (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Set token failed', err.message)
        }
      })
    }
  }
}
