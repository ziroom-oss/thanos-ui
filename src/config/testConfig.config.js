/*
 * @Author: 用例属性
 * @Date: 2021-05-20 16:25:40
 * @LastEditTime: 2021-05-20 14:41:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/config/testConfig.config.js
 */
const rules = {
  lable: [
    { required: true, message: '请输入属性中文名称（如：用例等级、前置条件）', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入属性英文名称（如：level、preCondition）', trigger: 'blur' }
  ],
  fieldType: [
    { required: true, message: '请选择属性类型', trigger: 'change' }
  ]
}

export default {
  rules
}
