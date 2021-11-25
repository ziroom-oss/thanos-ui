/*
 * @Author: liuxr3
 * @Date: 2021-03-09 11:26:06
 * @LastEditTime: 2021-08-12 11:07:28
 * @LastEditors: Please set LastEditors
 * @Description: 路由配置
 * @FilePath: /quality-defense-initiative/src/router/routes.js
 */
const layout = () => import(/* webpackChunkName: "layout" */ '@/Layout/Layout')
const postmanCaseImport = () => import(/* webpackChunkName: "TestCase" */ '@/views/TestCase/postmanCaseImport.vue')
const testCase = () => import(/* webpackChunkName: "TestCase" */ '@/views/TestCase')
// const testCase = () => import(/* webpackChunkName: "TestCase" */ '@/views/TestCase/TestCase.vue')
// const postmanCaseImport = () => import(/* webpackChunkName: "TestCase" */ '@/views/TestCase/postmanCaseImport.vue')
const testPlan = () => import(/* webpackChunkName: "TestPlan" */ '@/views/TestPlan/TestPlan.vue')
const caseExecution = () => import(/* webpackChunkName: "CaseExecution" */ '@/views/CaseExecution/CaseExecution.vue')
// const caseReport = () => import(/* webpackChunkName: "CaseReport" */ '@/src/views/CaseExecution/CaseReport.vue.back')
const testApplication = () => import(/* webpackChunkName: "TestApplication" */ '@/views/SystemConfig/TestApplication/TestApplication')
// const testConfig = () => import(/* webpackChunkName: "TestConfig" */ '@/views/SystemConfig/TestConfig/TestConfig')
// const testConfigSetting = () => import(/* webpackChunkName: "TestConfigSetting" */ '@/views/SystemConfig/TestConfig/TestConfigSetting')
const testMessage = () => import(/* webpackChunkName: "TestMessage" */ '@/views/SystemConfig/TestMessage/TestMessage')
const projectConfig = () => import(/* webpackChunkName: "ProjectConfig" */ '@/views/SystemConfig/ProjectConfig/ProjectConfig')
const projectDashboard = () => import(/* webpackChunkName: "ProjectDashboard" */ '@/views/Project/ProjectDashboard')
const projectReport = () => import(/* webpackChunkName: "ProjectReport" */ '@/views/Project/ProjectReport')
const projectHitoryReport = () => import(/* webpackChunkName: "ProjectHitoryReport" */ '@/views/Project/ProjectHitoryReport')
const caseExecutionDetailAndList = () => import('@/views/CaseExecution/CaseExecutionDetailAndList')
// const ApiCaseExecution = () => import('@/src/views/CaseExecution/ApiCaseExecution/ApiCaseExecution.bak')
const unFound = () => import(/* webpackChunkName: "404" */ '@/components/404/404')
const unUser = () => import(/* webpackChunkName: "500" */ '@/components/500/500')
const Login = () => import(/* webpackChunkName: "Login" */ '@/views/Login/Login')
const Register = () => import(/* webpackChunkName: "Register" */ '@/views/Login/Register')
export function hasPermission (route, menu) {
  return route.meta && route.meta.role
    ? menu.includes(route.meta.role)
    : true
};

export function filterAsyncRoute (routes, menu) {
  const res = []
  routes.forEach(route => {
    if (hasPermission(route, menu)) {
      if (route.children) route.children = filterAsyncRoute(route.children, menu)
      res.push(route)
    }
  })
  return res
};

export const constantRoutes = [{
  path: '/',
  name: '项目',
  component: layout,
  redirect: '/projectDashboard',
  meta: {
    title: '项目',
    roles: ['user', 'admin', 'superAdmin']
  },
  children: [{
    name: 'ProjectDashboard',
    path: '/projectDashboard',
    meta: {
      title: '项目',
      roles: ['user', 'admin', 'superAdmin']
    },
    component: projectDashboard
  },
  {
    name: 'ProjectReport',
    path: '/projectReport',
    meta: {
      title: '项目日报',
      hidden: true,
      roles: ['user', 'admin', 'superAdmin']
    },
    component: projectReport
  }
  ]
},
{
  path: '/404',
  name: '404',
  meta: { title: '404', hidden: true, roles: ['admin', 'user', 'superAdmin'] },
  component: unFound
},
{
  path: '/500',
  name: '500',
  meta: { title: '500', hidden: true, roles: ['admin', 'user', 'superAdmin'] },
  component: unUser
},
{
  path: '/login',
  name: 'login',
  meta: { title: '登录', hidden: true },
  component: Login
},
{
  path: '/register',
  name: 'register',
  meta: { title: '注册', hidden: true },
  component: Register
}
// {
//   path: '/404',
//   name: '404',
//   meta: {
//     title: '404',
//     hidden: true,
//     roles: ['admin', 'user', 'superAdmin']
//   },
//   component: unFound
// }
]

export const asyncRoutes = [{
  path: '/testPlan',
  name: '测试计划',
  component: layout,
  meta: {
    title: '测试计划',
    roles: ['user', 'admin', 'superAdmin']
  },
  children: [{
    name: 'TestPlan',
    path: '/testPlan',
    meta: {
      title: '测试计划',
      roles: ['user', 'admin', 'superAdmin']
    },
    component: testPlan
  }]
},
{
  name: '用例库',
  path: '/testCase',
  meta: {
    title: '用例库',
    roles: ['user', 'admin', 'superAdmin']
  },
  component: layout,
  children: [{
    name: 'TestCase',
    path: '/testCase',
    meta: {
      title: '用例库',
      roles: ['user', 'admin', 'superAdmin']
    },
    component: testCase
  }, {
    name: 'postmanCaseImport',
    path: '/testCase/postmanCaseImport',
    meta: {
      title: '用例库',
      hidden: true
    },
    component: postmanCaseImport
  }]
},
{
  path: '/caseExecution',
  name: '测试执行',
  component: layout,
  meta: {
    title: '测试执行',
    roles: ['user', 'admin', 'superAdmin']
  },
  children: [{
    name: 'caseExecution',
    path: '/caseExecution',
    meta: {
      title: '测试执行',
      roles: ['user', 'admin', 'superAdmin']
    },
    component: caseExecution
  },
  {
    name: 'CaseExecutionDetailAndList',
    path: '/caseExecutionDetailAndList',
    meta: {
      title: '测试执行',
      hidden: true
    },
    component: caseExecutionDetailAndList
  },
  // {
  //   name: 'ApiCaseExecution',
  //   path: '/ApiCaseExecution',
  //   meta: { title: '测试执行', hidden: true },
  //   component: ApiCaseExecution
  // },
  {

    name: 'projectHitoryReport',
    path: '/projectHitoryReport',
    meta: {
      title: '测试报告',
      hidden: true,
      roles: ['user', 'admin', 'superAdmin']
    },
    component: projectHitoryReport
  }
  // {
  //
  //   name: 'CaseReport',
  //   path: '/caseReport',
  //   meta: {
  //     title: '测试报告',
  //     hidden: true,
  //     roles: ['user', 'admin', 'superAdmin']
  //   },
  //   component: caseReport
  // }
  ]
},
{
  path: '/systemConfig',
  name: '系统配置',
  component: layout,
  meta: {
    title: '系统配置',
    roles: ['admin', 'superAdmin']
  },
  children: [{
    name: 'TestApplication',
    path: '/testApplication',
    meta: {
      title: '应用管理',
      roles: ['admin', 'superAdmin']
    },
    component: testApplication
  },
  // {
  //   name: 'TestConfig',
  //   path: '/testConfig',
  //   meta: {
  //     title: '用例属性',
  //     roles: ['admin', 'superAdmin']
  //   },
  //   component: testConfig
  // },
  // {
  //   name: 'TestConfigSetting',
  //   path: '/testConfigSetting',
  //   meta: {
  //     title: '用例属性配置集',
  //     roles: ['admin', 'superAdmin']
  //   },
  //   component: testConfigSetting
  // },
  {
    name: 'TestMessage',
    path: '/testMessage',
    meta: {
      title: '消息中心',
      roles: ['superAdmin']
    },
    component: testMessage
  },
  {
    name: 'ProjectConfig',
    path: '/projectConfig',
    meta: {
      title: '项目管理',
      roles: ['admin', 'superAdmin']
    },
    component: projectConfig
  }
  ]
},
// {
//   path: '/interfaces',
//   component: layout,
//   name: '接口管理',
//   meta: {
//     title: '接口管理',
//     icon: 'example'
//   },
//   children: [{
//     path: 'apiStorage',
//     component: () => import('@/views/Interfaces/apiStorage/index'),
//     name: '接口导入管理',
//     meta: {
//       title: '接口导入管理'
//     }
//   },
//   {
//     path: 'singleApi',
//     component: () => import('@/views/Interfaces/singleApi/index'),
//     name: '单接口用例管理',
//     meta: {
//       title: '单接口用例管理'
//     },
//     children: [{
//       path: 'single-api-save',
//       component: () => import('@/views/Interfaces/singleApi/single-api-save'),
//       name: 'SingleApiSave',
//       meta: {
//         title: '单接口录入',
//         hidden: true
//       }
//     },
//     // {
//     //   path: 'single-api-search-list',
//     //   component: () => import('@/views/Interfaces/singleApi/single-api-search-list'),
//     //   name: 'singleApiSearchList',
//     //   meta: {
//     //     title: '单接口搜索',
//     //     hidden: true
//     //   }
//     // },
//     // {
//     //   path: 'single-api-List',
//     //   component: () => import('@/views/Interfaces/singleApi/single-api-list'),
//     //   name: 'singleApiList',
//     //   meta: {
//     //     title: '单接口用例管理',
//     //     navShow: false
//     //   }
//     // },
//     {
//       path: 'single-api-search-List',
//       component: () => import('@/views/Interfaces/singleApi/single-api-search-list'),
//       name: 'singleApiSearchList',
//       meta: {
//         title: '单接口用例管理',
//         navShow: false
//       }
//     }
//     ]
//   },
//   {
//     path: 'multiApi',
//     component: () => import('@/views/Interfaces/multiApi/index'),
//     name: '多接口用例管理',
//     meta: {
//       title: '多接口用例管理'
//     },
//     children: [{
//       path: 'multi-api-List',
//       component: () => import('@/views/Interfaces/multiApi/multi-api-list'),
//       name: 'multiApiList',
//       meta: {
//         title: '多接口用例管理'
//       }
//     }]
//   },
//   {
//     path: '/caseExecution',
//     name: '测试执行',
//     component: layout,
//     meta: { title: '测试执行', roles: ['user', 'admin', 'superAdmin'] },
//     children: [
//       {
//         name: 'caseExecution',
//         path: '/caseExecution',
//         meta: { title: '测试执行', roles: ['user', 'admin', 'superAdmin'] },
//         component: caseExecution
//       },
//       {
//         name: 'CaseExecutionDetailAndList',
//         path: '/caseExecutionDetailAndList',
//         meta: { title: '测试执行', hidden: true },
//         component: caseExecutionDetailAndList
//       },
//       {
//         name: 'ApiCaseExecution',
//         path: '/ApiCaseExecution',
//         meta: { title: '测试执行', hidden: true },
//         component: ApiCaseExecution
//       },
//       {
//
//         name: 'CaseReport',
//         path: '/caseReport',
//         meta: { title: '测试报告', hidden: true, roles: ['user', 'admin', 'superAdmin'] },
//         component: caseReport
//       }]
//   },
//   {
//     path: 'dependency',
//     component: () => import('@/views/Interfaces/dependency/index'),
//     name: '依赖管理',
//     meta: {
//       title: '依赖管理'
//     },
//     redirect: '/Interfaces/dependency/single-api-sql-save',
//     children: [{
//       path: 'sql-rely-save',
//       component: () => import('@/views/Interfaces/dependency/sql-rely-save'),
//       name: 'sql-rely-save',
//       meta: {
//         title: 'SQL依赖录入'
//       }
//     },
//     {
//       path: 'sql-rely-list',
//       component: () => import('@/views/Interfaces/dependency/sql-rely-list'),
//       name: 'sql-rely-list',
//       meta: {
//         title: 'SQL依赖列表'
//       }
//     },
//     {
//       path: 'api-rely-condition',
//       component: () => import('@/views/Interfaces/dependency/api-rely-condition'),
//       name: 'api-rely-condition',
//       meta: {
//         title: '单接口依赖列表'
//       }
//     },
//     {
//       path: 'mq-dependency',
//       component: () => import('@/views/MockServer/mock-mq-msg'),
//       name: 'mqDependency',
//       meta: {
//         title: 'MQ依赖管理'
//       }
//     },
//     {
//       path: 'es-dependency',
//       component: () => import('@/views/Interfaces/dependency/es-rely-list'),
//       name: 'esDependency',
//       meta: {
//         title: 'ES依赖管理'
//       }
//     }
//     ]
//   }
//   ]
// },
{
  path: '/interfaces/multiApi/multi-api-save',
  component: () => import('@/views/Interfaces/multiApi/multi-api-save'),
  meta: {
    hidden: true
  }
},
{
  path: '/interfaces/singleApi/single-api-case-latest-report',
  component: () => import('@/views/Interfaces/singleApi/single-api-case-latest-report'),
  meta: {
    hidden: true
  }
},
{
  path: '/interfaces/singleApi/single-api-case-history-report',
  component: () => import('@/views/Interfaces/singleApi/single-api-case-history-report'),
  meta: {
    hidden: true
  }
}
]
