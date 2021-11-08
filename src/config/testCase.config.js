/*
 * @Author: 测试用例库配置文件
 * @Date: 2021-03-15 16:25:40
 * @LastEditTime: 2021-06-08 16:02:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/config/testCase.config.js
 */
const caseLevelList = [
  { value: 'P0', key: '极高' },
  { value: 'P1', key: '高' },
  { value: 'P2', key: '中' },
  { value: 'P3', key: '低' }
]
const caseLevelToValue = {
  P0: '极高',
  P1: '高',
  P2: '中',
  P3: '低'
}
const caseFormRules = {
  casename: [
    { required: true, message: '请输入用例名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择用例类型', trigger: 'change' }
  ],
  testCaseLevel: [
    { required: true, message: '请选择用例等级', trigger: 'change' }
  ],
  step: [
    { required: true, message: '请输入用例步骤描述', trigger: 'blur' }
  ],
  expectedResults: [
    { required: true, message: '请输入预期结果', trigger: 'blur' }
  ],
  relationRequirement: [
    { required: true, message: '请输入jira ID', trigger: 'blur' }
  ],
  belongToModule: [
    { required: true, message: '请选择所属模块', trigger: 'blur' }
  ],
  ehrTreePath: [
    { required: true, message: '请选择组织结构', trigger: 'change' }
  ],
  testCaseStatus: [
    { required: true, message: '请选择用例状态', trigger: 'change' }
  ],
  belongToSystem: [
    { required: true, message: '请选择所属系统', trigger: 'blur' }
  ],
  belongPlatform: [
    { required: true, message: '请选择所属平台', trigger: 'change' }
  ]
}

const pickerOptions = {
  shortcuts: [{
    text: '最近一周',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]
}
export default {
  caseLevelList,
  caseLevelToValue,
  caseFormRules,
  pickerOptions
}
