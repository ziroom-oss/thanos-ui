/*
 * @Author: liuxr
 * @Date: 2021-03-23 14:40:47
 * @LastEditTime: 2021-04-13 14:39:33
 * @LastEditors: Please set LastEditors
 * @Description: 测试执行配置
 * @FilePath: /quality-defense-initiative/src/config/caseExecution.config.js
 */

const caseExecutionTypeList = {
  integrationTesting: '集成测试',
  functionalTesting: '功能测试',
  smokeTesting: '冒烟测试',
  regressionTesting: '回归测试',
  compatibilityTesting: '兼容性测试',
  performanceTesting: '性能测试',
  securityTesting: '安全性测试'
}

const rules = {
  taskName: [
    { required: true, message: '请输入测试执行标题', trigger: 'blur' }
  ],
  ehrTreePath: [
    { required: true, message: '请选择组织结构', trigger: 'blur' }
  ],
  taskType: [
    { required: true, message: '请选择测试执行类型', trigger: 'blur' }
  ],
  relationRequirement: [
    { required: true, message: '请输入对应jira ID', trigger: 'blur' }
  ],
  testTaskMaster: [
    { required: true, message: '请输入负责人', trigger: 'change' }
  ],
  testTaskExecutors: [
    { required: true, message: '请输入执行人', trigger: 'change' }
  ],
  testExecutionType: [
    { required: true, message: '请输入测试类型', trigger: 'blur' }
  ]
}

const bugRules = {
  bugSummaryStr: [
    { required: true, message: '请输入BUG描述', trigger: 'blur' }
  ],
  bugTypeStr: [
    { required: true, message: '请选择缺陷类型', trigger: 'change' }
  ],
  bugCenterStr: [
    { required: true, message: '请选择缺陷所属中心', trigger: 'change' }
  ],
  bugDeptStr: [
    { required: true, message: '请选择缺陷所属部门', trigger: 'change' }
  ],
  bugModuleStr: [
    { required: true, message: '请选择缺陷模块', trigger: 'change' }
  ],
  bugUserStr: [
    { required: true, message: '请选择缺陷负责人', trigger: 'change' }
  ],
  bugLevelStr: [
    { required: true, message: '请选择缺陷等级', trigger: 'change' }
  ],
  bugEndTypeStr: [
    { required: true, message: '请选择缺陷所属端', trigger: 'change' }
  ]
}

export default {
  caseExecutionTypeList,
  rules,
  bugRules
}
