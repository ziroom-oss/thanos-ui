/*
 * @Author: your name
 * @Date: 2021-06-07 15:07:16
 * @LastEditTime: 2021-06-16 14:45:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/main.js
 */
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import '../permission'
import './config/element-ui.config'
import '@ziroom/zcloud-head/dist/index.css'
import './icons'
import './styles/index.scss'

import '@/assets/style/index.scss'
import './config/echart.config'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

import VueElementExtends from 'vue-element-extends'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

Vue.use(VXETable)
Vue.use(VueElementExtends)

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }

Vue.config.productionTip = false
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
