import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getter'
import module from './modules/module'
import permission from './modules/permission'
import user from './modules/user'
import staff from './modules/staff'
import app from './modules/app'
import cases from './modules/cases'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    module,
    permission,
    user,
    staff,
    cases,
    app
  },
  getters
})
