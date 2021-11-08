/*
 * @Author: liuxr3
 * @Date: 2021-05-26 11:44:02
 * @LastEditTime: 2021-05-27 10:28:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/config/projectConfig.js
 */
const projectRules = {
  topicName: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  relationRequirement: [
    { required: true, message: '请输入jiraID', trigger: 'change' }
  ],
  upTime: [
    { required: true, message: '请选择预计上线时间', trigger: 'change' }
  ],
  applicationType: [
    { required: true, message: '请选择应用类型', trigger: 'change' }
  ],
  topicMaster: [
    { required: true, message: '请选择项目负责人', trigger: 'change' }
  ],
  topicParticipant: [
    { required: true, message: '请选择项目参与人', trigger: 'change' }
  ]
  // taskIdList: [
  //   { required: true, message: '请选择相关测试执行', trigger: 'change' }
  // ]
}

export default {
  projectRules
}
