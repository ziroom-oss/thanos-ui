// /*
//  * @Author: liuxr3
//  * @Date: 2021-05-25 19:03:46
//  * @LastEditTime: 2021-05-27 10:34:46
//  * @LastEditors: Please set LastEditors
//  * @Description: 组织人员
//  * @FilePath: /quality-defense-initiative/src/store/modules/staff.js
//  */
// import { getEhrPerson } from '@/api/model/caseExecution'
//
// export default {
//   state: {
//     staffDataSource: []
//   },
//   mutations: {
//     SET_STAFF_DATA (state, data) {
//       state.staffDataSource = data
//     }
//   },
//   actions: {
//     queryStaffDataSource ({ commit }, data) {
//       return new Promise((resolve, reject) => {
//         getEhrPerson()
//           .then(res => {
//             resolve(res.data)
//             commit('SET_STAFF_DATA', res.data)
//           })
//           .catch(err => {
//             reject(err)
//             console.log(err)
//           })
//       })
//     }
//   }
// }
