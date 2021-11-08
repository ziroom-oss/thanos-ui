/*
 * @Author: 应用管理
 * @Date: 2021-05-15 16:25:40
 * @LastEditTime: 2021-05-20 14:41:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/config/testApplication.config.js
 */
const rules = {
  applicationName: [
    { required: true, message: '请输入应用名称', trigger: 'blur' }
  ],
  ehrTreePath: [
    { required: true, message: '请选择组织结构', trigger: 'change' }
  ],
  applicationType: [
    { required: true, message: '请选择应用类型', trigger: 'change' }
  ]
}

export default {
  rules
}
