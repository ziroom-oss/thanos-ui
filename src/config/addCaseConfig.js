// 请求tabs
const REQUEST_TAB_LISTS = [{
  name: 'Params',
  value: 0,
  status: ''
},
{
  name: 'Headers',
  value: 0,
  status: ''
},
{
  name: 'Body',
  value: 0,
  status: ''
},
{
  name: 'Pre-request API',
  value: 0,
  status: '',
  badge: "先"
},
{
  name: 'Pre-request SQL',
  value: 0,
  status: '',
  badge: "后"
},
{
  name: 'Tests',
  value: 0,
  status: ''
}
]

// 返回tabs
const RESPONSE_TAB_LISTS = [{
  name: 'Body',
  value: 0,
  status: ''
}
  // {
  //   name: 'Cookies',
  //   value: 0,
  //   status: ''
  // },
  // {
  //   name: 'Headers',
  //   value: 0,
  //   status: ''
  // }
]

// form
const CONTENT_TYPE = [{
  name: 'none',
  value: ''
},
{
  name: 'form/data',
  value: 'multipart/form-data'
}, {
  name: 'x-www-form-urlencoded',
  value: 'application/x-www-form-urlencoded'
},
{
  name: 'raw',
  value: 'application/json'
}
]

// 环境配置
const ENVIRONMENT_OPTIONS = [
//   {
//   name: '日常环境',
//   value: 'daily'
// },

  {
    name: 'QA环境',
    value: 'qua'
  }
// ,
// {
//   name: '本地环境',
//   value: 'localhost'
// }
]

export default {
  REQUEST_TAB_LISTS,
  RESPONSE_TAB_LISTS,
  ENVIRONMENT_OPTIONS,
  CONTENT_TYPE
}
