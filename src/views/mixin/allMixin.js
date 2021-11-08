/*
 * @Author: your name
 * @Date: 2021-05-27 10:47:04
 * @LastEditTime: 2021-05-27 11:10:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/views/mixin/mixin.js
 */
import {
  validateIssueKey
} from '@/api/model/testCase'

export const allMixin = {
  data: () => ({
    isValidateKey: false
  }),
  methods: {
    async validateIssueKey (event) {
      // 校验issueKey名称是否正确
      const result = await validateIssueKey({ issueKey: event.target.value })
      if (result) {
        this.isValidateKey = true
      } else {
        this.isValidateKey = false
      }
    }
  }
}
