
const planStatusList =

[
  { code: 1, value: '待提交' },
  { code: 2, value: '待审核' },
  { code: 3, value: '审核通过' },
  { code: 4, value: '审核拒绝' }
]

const planFormRules = {
  planName: [
    { required: true, message: '请输入计划名称', trigger: 'blur' }
  ],
  relationRequirement: [
    { required: true, message: '请输入计划关联需求', trigger: 'blur' }
  ],
  testPlanStartTime: [
    { required: true, message: '请选择计划开始时间', trigger: 'change' }
  ],
  testPlanEndTime: [
    { required: true, message: '请选择计划结束时间', trigger: 'change' }
  ],
  testStrategy: [
    { required: true, message: '请选择测试策略', trigger: 'change' }
  ],
  testEnvironment: [
    { required: true, message: '请选择测试环境', trigger: 'change' }
  ],
  testPlanMaster: [
    { required: true, message: '请选择负责人', trigger: 'change' }
  ],
  testPersionList: [
    { required: true, message: '请选择测试人员', trigger: 'change' }
  ],
  testRisk: [
    { required: true, message: '请输入测试风险', trigger: 'blur' }
  ],
  testRange: [
    { required: true, message: '请输入测试范围', trigger: 'blur' }
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
  planStatusList,
  planFormRules,
  pickerOptions
}
