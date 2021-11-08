const checkURL = (rule, value, callback) => {
  const URLREG = /^((https?):\/\/)/
  if (value && !URLREG.test(value)) {
    return callback(new Error('请输入正确的URL！'))
  }
  return callback()
}

const appFormRules = {
  applicationName: [
    {
      required: true, message: '请选择应用名称', trigger: 'change'
    }
  ],
  swaggerUrl: [
    {
      message: '请输入域名', trigger: 'change'
    },
    {
      validator: checkURL, trigger: 'blur'
    }
  ]
}

export default {
  appFormRules
}
