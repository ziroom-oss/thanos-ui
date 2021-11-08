/*
 * @Author: liuxr3
 * @Date: 2021-05-20 10:58:26
 * @LastEditTime: 2021-05-21 11:06:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/views/TestCase/mixin/mixin.js
 */
import {
  queryModuleList,
  queryModuleInAppList,
  queryAppList
} from '@/api/model/testCase'

export const moduleTreeMixin = {
  async created () {
    await this.queryModuleList()
    await this.queryAppList()
    // await this.queryAppListByEhrTreePath()
  },
  data: () => ({
    moduleList: [],
    moduleInAppList: [],
    appList: [],
    treePath: []
    // appListInEhr: []
  }),
  methods: {
    // 查询模块列表
    async queryModuleList () {
      const params = { treePath: this.treePath.toString() }
      const respData = await queryModuleList(params)
      if (respData.data) { this.moduleList = respData.data }
    },
    async queryModuleInAppList (applicationId) { // 应用下模块
      const res = await queryModuleInAppList({ applicationId })
      const respData = res.data
      this.moduleInAppList = this.handleModuleTree(respData)
    },
    async queryAppList () { // 所有应用接口
      const res = await queryAppList()
      this.appList = res.data
    },
    // async queryAppListByEhrTreePath (ehrTreePath) { // 组织结构下应用
    //   this.appListInEhr = await queryAppListByEhrTreePath({ ehrTreePath })
    // },

    handleModuleTree (arr = []) {
      const newArr = arr.map(item => item.children ? {
        label: item.label,
        value: item.id,
        children: this.handleModuleTree(item.children)
      } : {
        label: item.label,
        value: item.id
      })
      return newArr
    }
  }
}
